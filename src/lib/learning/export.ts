import { normalizeProgressRow } from "./srs";
import { EXPORT_SCHEMA_VERSION } from "./types";
import type { AiSecrets, ConceptProgress, Lesson, ProgressState, SessionRecord } from "./types";

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
  };
  catalog: {
    categories: ProgressState["customCategories"];
    concepts: ProgressState["customConcepts"];
    lessons: Lesson[];
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
    },
    catalog: {
      categories: state.customCategories,
      concepts: state.customConcepts,
      lessons: state.customLessons,
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
    return { ok: true, data: raw as ExportBundleV2 };
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
          customLessons: data.catalog.lessons,
          generationLog: data.generation_log ?? [],
          pendingPath: data.pending_path ?? null,
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
    customCategories: mergeById(current.customCategories, data.catalog.categories ?? []),
    customConcepts: mergeById(current.customConcepts, data.catalog.concepts ?? []),
    customLessons: mergeLessons(current.customLessons, data.catalog.lessons ?? [], warnings),
    generationLog: uniqueById([...(data.generation_log ?? []), ...current.generationLog]).slice(0, 400),
    pendingPath: current.pendingPath ?? data.pending_path ?? null,
  };
}

function mergeSessions(local: SessionRecord[], incoming: SessionRecord[]): SessionRecord[] {
  return uniqueById([...incoming, ...local]).slice(0, 800);
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

function mergeById<T extends { id: string }>(local: T[], incoming: T[]): T[] {
  const map = new Map(local.map((x) => [x.id, x]));
  for (const item of incoming) {
    if (!map.has(item.id)) map.set(item.id, item);
    else map.set(item.id, { ...map.get(item.id)!, ...item });
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
