import { exportBundleV2Schema, formatZodIssues, secretExportGuard } from "./export-schema";
import { ROLLBACK_STORAGE_KEY } from "./persistence";
import { persistStorage, memoryStorage, type KeyValueStorage } from "./storage";
import { normalizeProgressRow } from "./srs";
import { EXPORT_SCHEMA_VERSION } from "./types";
import type { AiSecrets, AssessmentHistory, ConceptProgress, Lesson, ProgressState, SessionRecord } from "./types";
import { emptyAssessmentHistory } from "@/lib/quiz/history";

export { secretExportGuard };
export { memoryStorage as memoryStore };
export type KeyValueStore = KeyValueStorage;

/** Hosted imports must stay small enough to parse without pinning the tab. */
export const MAX_IMPORT_BYTES = 8 * 1024 * 1024;

export function assertImportSize(bytes: number): { ok: true } | { ok: false; error: string } {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return { ok: false, error: "Import size is not valid." };
  }
  if (bytes > MAX_IMPORT_BYTES) {
    return { ok: false, error: "Import is larger than 8 MB. Export a smaller archive." };
  }
  return { ok: true };
}

export interface ExportBundleV2 {
  format: "dead-air-university-export";
  schema_version: number;
  exported_at: string;
  profile: ProgressState["profile"];
  preferences: ProgressState["settings"];
  ai: ProgressState["ai"];
  secrets?: AiSecrets;
  progress: {
    concepts: Record<string, ConceptProgress>;
    sessions: SessionRecord[];
    recentCategoryIds: string[];
    courses?: ProgressState["courses"];
    assessmentHistory?: ProgressState["assessmentHistory"];
  };
  catalog: {
    categories: ProgressState["customCategories"];
    concepts: ProgressState["customConcepts"];
    lessons: Lesson[];
    courses?: ProgressState["customCourses"];
  };
  generation_log: ProgressState["generationLog"];
  pending_path: ProgressState["pendingPath"];
}

export type ImportMode = "merge" | "replace";

export interface ImportResult {
  state: ProgressState;
  warnings: string[];
  backup: ExportBundleV2;
}

export function buildExport(
  state: ProgressState,
  secrets?: AiSecrets,
  includeSecrets = false,
): ExportBundleV2 {
  return {
    format: "dead-air-university-export",
    schema_version: EXPORT_SCHEMA_VERSION,
    exported_at: new Date().toISOString(),
    profile: state.profile,
    preferences: state.settings,
    ai: state.ai,
    ...(includeSecrets && secrets ? { secrets } : {}),
    progress: {
      concepts: state.concepts,
      sessions: state.sessions,
      recentCategoryIds: state.recentCategoryIds,
      courses: state.courses,
      assessmentHistory: state.assessmentHistory,
    },
    catalog: {
      categories: state.customCategories,
      concepts: state.customConcepts,
      lessons: state.customLessons,
      courses: state.customCourses,
    },
    generation_log: state.generationLog,
    pending_path: state.pendingPath,
  };
}

export function parseExport(
  raw: unknown,
): { ok: true; data: ExportBundleV2 | V1Export } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Not a JSON object." };
  const obj = raw as Record<string, unknown>;
  if (obj.format === "dead-air-university-export" && obj.schema_version === 2) {
    const parsed = exportBundleV2Schema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: formatZodIssues(parsed.error) };
    return { ok: true, data: parsed.data as ExportBundleV2 };
  }
  if (obj.format === "dead-air-university-export") {
    return { ok: false, error: `Unsupported export schema_version ${String(obj.schema_version)}.` };
  }
  if (obj.settings && obj.concepts && obj.sessions) {
    return { ok: true, data: raw as V1Export };
  }
  if (obj.schema_version === 1 || obj.format === "dau-progress") {
    return { ok: true, data: raw as V1Export };
  }
  return { ok: false, error: "Unrecognized export file." };
}

interface V1Export {
  settings?: ProgressState["settings"];
  concepts?: Record<string, ConceptProgress>;
  sessions?: SessionRecord[];
  recentCategoryIds?: string[];
}

export function isNewer(incoming?: string | null, local?: string | null): boolean {
  if (!incoming) return false;
  if (!local) return true;
  return new Date(incoming).getTime() > new Date(local).getTime();
}

function normalizeConceptMap(rows: Record<string, ConceptProgress> | undefined): Record<string, ConceptProgress> {
  const out: Record<string, ConceptProgress> = {};
  for (const [id, row] of Object.entries(rows ?? {})) {
    out[id] = normalizeProgressRow({ ...row, conceptId: id });
  }
  return out;
}

export function importExport(
  current: ProgressState,
  incoming: unknown,
  mode: ImportMode = "merge",
): ImportResult {
  const parsed = parseExport(incoming);
  if (!parsed.ok) throw new Error(parsed.error);
  const backup = buildExport(current);
  const warnings: string[] = [];

  if ("format" in parsed.data && parsed.data.format === "dead-air-university-export") {
    const data = parsed.data;
    const concepts = normalizeConceptMap(data.progress.concepts);
    if (mode === "replace") {
      return {
        state: {
          profile: data.profile,
          settings: { ...current.settings, ...data.preferences },
          ai: data.ai,
          concepts,
          sessions: data.progress.sessions,
          recentCategoryIds: data.progress.recentCategoryIds,
          customCategories: data.catalog.categories,
          customConcepts: data.catalog.concepts,
          customLessons: data.catalog.lessons as Lesson[],
          generationLog: data.generation_log ?? [],
          pendingPath: data.pending_path ?? null,
          courses: data.progress.courses ?? {},
          customCourses: data.catalog.courses ?? [],
          assessmentHistory: data.progress.assessmentHistory ?? emptyAssessmentHistory(),
        },
        warnings,
        backup,
      };
    }
    return {
      state: mergeStates(current, { ...data, progress: { ...data.progress, concepts } }, warnings),
      warnings,
      backup,
    };
  }

  const v1 = parsed.data as V1Export;
  warnings.push("Imported a v1 progress file. Custom catalog and AI settings were left as they are.");
  const incomingConcepts = normalizeConceptMap(v1.concepts);
  const concepts = { ...current.concepts };
  for (const [id, row] of Object.entries(incomingConcepts)) {
    const local = concepts[id];
    if (!local || isNewer(row.lastStudiedAt, local.lastStudiedAt)) {
      concepts[id] = row;
    } else {
      warnings.push(`Kept newer local progress for ${id}.`);
    }
  }
  const sessions = mergeSessions(current.sessions, v1.sessions ?? []);
  return {
    state: {
      ...current,
      settings: { ...current.settings, ...v1.settings },
      concepts,
      sessions,
      recentCategoryIds: unique([...(v1.recentCategoryIds ?? []), ...current.recentCategoryIds]),
    },
    warnings,
    backup,
  };
}

function mergeStates(current: ProgressState, data: ExportBundleV2, warnings: string[]): ProgressState {
  const concepts = { ...current.concepts };
  for (const [id, row] of Object.entries(data.progress.concepts ?? {})) {
    const local = concepts[id];
    const incomingStamp = row.updatedAt ?? row.lastStudiedAt;
    const localStamp = local?.updatedAt ?? local?.lastStudiedAt;
    if (!local || isNewer(incomingStamp, localStamp)) {
      concepts[id] = normalizeProgressRow({ ...row, conceptId: id });
    } else {
      warnings.push(`Kept newer local progress for ${id}.`);
    }
  }

  return {
    profile: { ...current.profile, ...data.profile },
    settings: { ...current.settings, ...data.preferences },
    ai: { ...current.ai, ...data.ai },
    concepts,
    sessions: mergeSessions(current.sessions, data.progress.sessions ?? []),
    recentCategoryIds: unique([...(data.progress.recentCategoryIds ?? []), ...current.recentCategoryIds]),
    customCategories: mergeDefinitions(
      current.customCategories,
      data.catalog.categories ?? [],
      "category",
      ["name", "blurb"],
      warnings,
    ),
    customConcepts: mergeDefinitions(
      current.customConcepts,
      data.catalog.concepts ?? [],
      "concept",
      ["name", "category", "parentId", "prerequisites", "level", "summary"],
      warnings,
    ),
    customLessons: mergeLessons(current.customLessons, (data.catalog.lessons ?? []) as Lesson[], warnings),
    generationLog: uniqueById([...(data.generation_log ?? []), ...current.generationLog]).slice(0, 400),
    pendingPath: current.pendingPath ?? data.pending_path ?? null,
    courses: mergeCourseProgress(current.courses, data.progress.courses ?? {}),
    customCourses: mergeDefinitions(
      current.customCourses,
      data.catalog.courses ?? [],
      "course",
      ["title", "description", "curriculumVersion"],
      warnings,
    ),
    assessmentHistory: mergeAssessmentHistory(current.assessmentHistory, data.progress.assessmentHistory),
  };
}

function stampOf(item: { updatedAt?: string; createdAt?: string }): string | null {
  return item.updatedAt ?? item.createdAt ?? null;
}

function materiallyDifferent<T extends Record<string, unknown>>(local: T, incoming: T, keys: (keyof T)[]): boolean {
  return keys.some((key) => JSON.stringify(local[key]) !== JSON.stringify(incoming[key]));
}

export function mergeDefinitions<T extends { id: string; updatedAt?: string; createdAt?: string }>(
  local: T[],
  incoming: T[],
  kind: string,
  compareKeys: (keyof T)[],
  warnings: string[],
): T[] {
  const map = new Map(local.map((item) => [item.id, item]));
  for (const item of incoming) {
    const cur = map.get(item.id);
    if (!cur) {
      map.set(item.id, item);
      continue;
    }
    if (isNewer(stampOf(item), stampOf(cur))) {
      map.set(item.id, { ...cur, ...item });
      continue;
    }
    if (materiallyDifferent(cur as Record<string, unknown>, item as Record<string, unknown>, compareKeys as string[])) {
      warnings.push(`Kept local ${kind} ${item.id}; incoming definition conflicted.`);
    }
  }
  return [...map.values()];
}

function mergeCourseProgress(
  local: ProgressState["courses"],
  incoming: ProgressState["courses"],
): ProgressState["courses"] {
  const out = { ...local };
  for (const [id, row] of Object.entries(incoming)) {
    const cur = out[id];
    if (!cur) {
      out[id] = row;
      continue;
    }
    out[id] = {
      ...cur,
      ...row,
      waivedConceptIds: unique([...(cur.waivedConceptIds ?? []), ...(row.waivedConceptIds ?? [])]),
      startedAt: cur.startedAt ?? row.startedAt,
      lastStudiedAt: isNewer(row.lastStudiedAt, cur.lastStudiedAt) ? row.lastStudiedAt : cur.lastStudiedAt,
      placement: isNewer(row.placement?.at, cur.placement?.at) ? row.placement : cur.placement,
    };
  }
  return out;
}

function mergeSessions(local: SessionRecord[], incoming: SessionRecord[]): SessionRecord[] {
  return uniqueById([...incoming, ...local]).slice(0, 800);
}

function mergeAssessmentHistory(
  local: AssessmentHistory | undefined,
  incoming: AssessmentHistory | undefined,
): AssessmentHistory {
  if (!incoming) return local ?? emptyAssessmentHistory();
  if (!local) return incoming;
  const seen = new Set(local.items.map((item) => `${item.at}:${item.questionId}:${item.lessonId}`));
  const extra = incoming.items.filter((item) => !seen.has(`${item.at}:${item.questionId}:${item.lessonId}`));
  return {
    items: [...local.items, ...extra].slice(-200),
    recentPositions: [...local.recentPositions, ...incoming.recentPositions].slice(-24),
  };
}

function mergeLessons(local: Lesson[], incoming: Lesson[], warnings: string[]): Lesson[] {
  const map = new Map(local.map((l) => [l.id, l]));
  for (const lesson of incoming) {
    const cur = map.get(lesson.id);
    if (!cur) {
      map.set(lesson.id, lesson);
      continue;
    }
    if (isNewer(lesson.updatedAt, cur.updatedAt)) {
      map.set(lesson.id, lesson);
    } else if (lesson.updatedAt && cur.updatedAt && lesson.updatedAt !== cur.updatedAt) {
      warnings.push(`Kept newer local lesson ${lesson.id}.`);
    }
  }
  return [...map.values()];
}

function unique(ids: string[]): string[] {
  return [...new Set(ids)].slice(0, 12);
}

function uniqueById<T extends { id: string }>(rows: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out;
}

function defaultRollbackStore(): KeyValueStorage {
  return persistStorage();
}

export function saveRollback(bundle: ExportBundleV2, store: KeyValueStorage | null = defaultRollbackStore()): void {
  if (!store) return;
  try {
    store.setItem(ROLLBACK_STORAGE_KEY, JSON.stringify(bundle));
  } catch {
    // blocked storage — replace still applied
  }
}

export function loadRollback(store: KeyValueStorage | null = defaultRollbackStore()): ExportBundleV2 | null {
  if (!store) return null;
  try {
    const raw = store.getItem(ROLLBACK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseExport(JSON.parse(raw));
    if (!parsed.ok || !("format" in parsed.data)) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function clearRollback(store: KeyValueStorage | null = defaultRollbackStore()): void {
  try {
    store?.removeItem(ROLLBACK_STORAGE_KEY);
  } catch {
    // ignore
  }
}
