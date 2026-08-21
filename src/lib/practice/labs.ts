import {
  CHUDBOX_LAB_ID,
  COMPILER_WORKBENCH_ID,
  FAB_LAB_ID,
  ML_LAB_ID,
  MOVEMENT_BENCH_LAB_ID,
  OS_LAB_ID,
  PACKET_LAB_ID,
  PIPELINE_LAB_ID,
  SOURCE_APP_DAU,
  adaptChudboxResultMessage,
  adaptCompilerWorkbenchResultMessage,
  adaptFabResultMessage,
  adaptMlResultMessage,
  adaptMovementBenchResultMessage,
  adaptOsResultMessage,
  adaptPacketLabResultMessage,
  adaptPipelineResultMessage,
  buildChudboxLaunchUrl,
  buildCwLaunchUrl,
  buildFabLaunchUrl,
  buildMlLaunchUrl,
  buildMovementBenchLaunchUrl,
  buildOsLaunchUrl,
  buildPlLaunchUrl,
  buildPipelineLaunchUrl,
  canLaunchLab,
  getCompatibleLabs,
  getLab,
  type PracticeLab,
} from "../../../../dau-practice-labs/src/practice-labs/index.ts";

import {
  cwModuleForConcept,
  horoModuleForConcept,
  mlModuleForConcept,
  netModuleForConcept,
  osModuleForConcept,
  practiceFieldsForLesson,
  ppModuleForConcept,
  semiModuleForConcept,
} from "./practice-map";

/** Minimal shape idle-doodad lessons always have. Decoupled from content schema. */
export interface PracticeLessonRef {
  id: string;
  conceptId: string;
  title: string;
}

export interface PracticeLaunch {
  ok: boolean;
  url?: string;
  message?: string;
}

const PRACTICE_LOG_KEY = "dau-practice-log-v1";

export interface PracticeLogEntry {
  labId: string;
  conceptId: string;
  lessonId: string;
  completed: boolean;
  attempts: number;
  timeSpentMs: number;
  selfRating?: number;
  at: string;
}

/** Launchable labs whose concept/course coverage matches this lesson. */
export function practiceLabsForLesson(
  courseId: string | undefined,
  conceptId: string,
): PracticeLab[] {
  return getCompatibleLabs(courseId ?? "", conceptId).filter(
    (lab) => canLaunchLab(lab.labId) && Boolean(lab.launchUrl),
  );
}

function goalForLesson(lesson: PracticeLessonRef): string {
  const base = lesson.title.trim();
  return base.length >= 8 ? `${base}.` : `${base} — hands-on practice.`;
}

/** Pure: the contract request DAU sends for this lesson, routed to its lab. */
export function buildPracticeRequestForLesson(lesson: PracticeLessonRef) {
  if (lesson.conceptId.startsWith("os-")) {
    const mod = osModuleForConcept(lesson.conceptId);
    return {
      schemaVersion: 1 as const,
      sourceApp: SOURCE_APP_DAU,
      labId: OS_LAB_ID,
      conceptId: lesson.conceptId,
      lessonId: lesson.id,
      practiceType: mod.practiceType,
      goal: goalForLesson(lesson),
      parameters: mod.parameters,
    };
  }
  if (lesson.conceptId.startsWith("ml-")) {
    const mod = mlModuleForConcept(lesson.conceptId);
    return {
      schemaVersion: 1 as const,
      sourceApp: SOURCE_APP_DAU,
      labId: ML_LAB_ID,
      conceptId: lesson.conceptId,
      lessonId: lesson.id,
      practiceType: mod.practiceType,
      goal: goalForLesson(lesson),
      parameters: mod.parameters,
    };
  }
  if (lesson.conceptId.startsWith("net-")) {
    const mod = netModuleForConcept(lesson.conceptId);
    return {
      schemaVersion: 1 as const,
      sourceApp: SOURCE_APP_DAU,
      labId: PACKET_LAB_ID,
      conceptId: lesson.conceptId,
      lessonId: lesson.id,
      practiceType: mod.practiceType,
      goal: goalForLesson(lesson),
      parameters: mod.parameters,
    };
  }
  if (lesson.conceptId.startsWith("cmp-")) {
    const mod = cwModuleForConcept(lesson.conceptId);
    return {
      schemaVersion: 1 as const,
      sourceApp: SOURCE_APP_DAU,
      labId: COMPILER_WORKBENCH_ID,
      conceptId: lesson.conceptId,
      lessonId: lesson.id,
      practiceType: mod.practiceType,
      goal: goalForLesson(lesson),
      parameters: mod.parameters,
    };
  }
  if (lesson.conceptId.startsWith("cpu-") || lesson.conceptId.startsWith("gpu-") || lesson.conceptId.startsWith("arch-")) {
    const mod = ppModuleForConcept(lesson.conceptId);
    return {
      schemaVersion: 1 as const,
      sourceApp: SOURCE_APP_DAU,
      labId: PIPELINE_LAB_ID,
      conceptId: lesson.conceptId,
      lessonId: lesson.id,
      practiceType: mod.practiceType,
      goal: goalForLesson(lesson),
      parameters: mod.parameters,
    };
  }
  if (lesson.conceptId.startsWith("horo-")) {
    const mod = horoModuleForConcept(lesson.conceptId);
    return {
      schemaVersion: 1 as const,
      sourceApp: SOURCE_APP_DAU,
      labId: MOVEMENT_BENCH_LAB_ID,
      conceptId: lesson.conceptId,
      lessonId: lesson.id,
      practiceType: mod.practiceType,
      goal: goalForLesson(lesson),
      parameters: mod.parameters,
    };
  }
  if (lesson.conceptId.startsWith("semi-")) {
    const mod = semiModuleForConcept(lesson.conceptId);
    return {
      schemaVersion: 1 as const,
      sourceApp: SOURCE_APP_DAU,
      labId: FAB_LAB_ID,
      conceptId: lesson.conceptId,
      lessonId: lesson.id,
      practiceType: mod.practiceType,
      goal: goalForLesson(lesson),
      parameters: mod.parameters,
    };
  }
  const fields = practiceFieldsForLesson(lesson);
  return {
    schemaVersion: 1 as const,
    sourceApp: SOURCE_APP_DAU,
    labId: CHUDBOX_LAB_ID,
    conceptId: lesson.conceptId,
    lessonId: lesson.id,
    practiceType: fields.practiceType,
    goal: goalForLesson(lesson),
    parameters: { tempo: fields.tempo, patternLength: fields.patternLength },
    allowedTools: fields.allowedTools,
    constraints: fields.constraints,
    completionCriteria: fields.completionCriteria,
  };
}

/**
 * Deploy-time overrides: a hosted deployment injects
 * `window.__DAU_LAB_URLS__ = { [labId]: "https://lab.example.com/" }`
 * before this module loads (see deploy/README). Localhost registry
 * defaults remain the single-source-of-truth fallback.
 */
interface LabUrlOverrides {
  [labId: string]: string | undefined;
}

function deployedBaseForLab(labId: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  const overrides = (window as { __DAU_LAB_URLS__?: LabUrlOverrides }).__DAU_LAB_URLS__;
  const url = overrides?.[labId];
  return typeof url === "string" && url.length > 0 ? url : undefined;
}

function launchBaseForLab(labId: string): string {
  return deployedBaseForLab(labId) ?? getLab(labId)?.launchUrl ?? "http://localhost:8080/";
}

/**
 * Per-lab adapters. Adding a lab to the ecosystem means one entry here plus
 * its contract adapter — no new branching in host code.
 */
const LAUNCHERS: Record<string, (base: string, request: unknown) => ReturnType<typeof buildChudboxLaunchUrl>> = {
  [CHUDBOX_LAB_ID]: (base, request) => buildChudboxLaunchUrl(base, request),
  [MOVEMENT_BENCH_LAB_ID]: (base, request) => buildMovementBenchLaunchUrl(base, request),
  [FAB_LAB_ID]: (base, request) => buildFabLaunchUrl(base, request),
  [PIPELINE_LAB_ID]: (base, request) => buildPipelineLaunchUrl(base, request),
  [COMPILER_WORKBENCH_ID]: (base, request) => buildCwLaunchUrl(base, request),
  [PACKET_LAB_ID]: (base, request) => buildPlLaunchUrl(base, request),
  [OS_LAB_ID]: (base, request) => buildOsLaunchUrl(base, request),
  [ML_LAB_ID]: (base, request) => buildMlLaunchUrl(base, request),
};

/** Pure: validate against the contract and build the pop-up URL. */
export function launchUrlForLesson(lesson: PracticeLessonRef): PracticeLaunch {
  const request = buildPracticeRequestForLesson(lesson);
  const launch = LAUNCHERS[request.labId];
  if (!launch) return { ok: false, message: `No launcher registered for lab ${request.labId}.` };
  const built = launch(launchBaseForLab(request.labId), request);
  if (!built.ok) return { ok: false, message: built.message };
  return { ok: true, url: built.data };
}

/** Open the lab in a new tab/window. Results arrive via initPracticeResultListener. */
export function openPracticeLab(lesson: PracticeLessonRef): PracticeLaunch {
  const launch = launchUrlForLesson(lesson);
  if (!launch.ok || !launch.url) return launch;
  if (typeof window === "undefined") {
    return { ok: false, message: "Practice can only be launched in the browser." };
  }
  // NOTE: deliberately NOT "noopener" — the contract delivers results via
  // postMessage to window.opener. We validate event.origin on receipt instead.
  window.open(launch.url, "_blank");
  return { ok: true, url: launch.url };
}

/**
 * Listen (once) for practice results posted back by launched labs. Validates the
 * sender's origin against every registered lab origin before adapting the
 * envelope (chudbox and movement-bench today; more labs, more adapters).
 */
export function initPracticeResultListener(onResult: (entry: PracticeLogEntry) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const allowedOrigins = new Set<string>();
  const labIds = [CHUDBOX_LAB_ID, MOVEMENT_BENCH_LAB_ID, FAB_LAB_ID, PIPELINE_LAB_ID, COMPILER_WORKBENCH_ID, PACKET_LAB_ID, OS_LAB_ID, ML_LAB_ID];
  const overrides = typeof window !== "undefined" ? (window as { __DAU_LAB_URLS__?: LabUrlOverrides }).__DAU_LAB_URLS__ : undefined;
  for (const labId of labIds) {
    for (const candidate of [getLab(labId)?.launchUrl, overrides?.[labId]]) {
      if (!candidate) continue;
      try {
        allowedOrigins.add(new URL(candidate).origin);
      } catch {
        // Malformed entry — skip rather than trust everything.
      }
    }
  }

  const handler = (event: MessageEvent) => {
    if (allowedOrigins.size > 0 && !allowedOrigins.has(event.origin)) return;
    const chudbox = adaptChudboxResultMessage(event.data);
    const bench = chudbox.ok ? chudbox : adaptMovementBenchResultMessage(event.data);
    const fab = bench.ok ? bench : adaptFabResultMessage(event.data);
    const pp = fab.ok ? fab : adaptPipelineResultMessage(event.data);
    const cw = pp.ok ? pp : adaptCompilerWorkbenchResultMessage(event.data);
    const pl = cw.ok ? cw : adaptPacketLabResultMessage(event.data);
    const os = pl.ok ? pl : adaptOsResultMessage(event.data);
    const adapted = os.ok ? os : adaptMlResultMessage(event.data);
    if (!adapted.ok) return;
    const result = adapted.data.result;
    const entry: PracticeLogEntry = {
      labId: result.labId,
      conceptId: result.conceptId,
      lessonId: result.lessonId,
      completed: result.completed,
      attempts: result.attempts,
      timeSpentMs: result.timeSpentMs,
      ...(result.selfRating != null ? { selfRating: result.selfRating } : {}),
      at: new Date().toISOString(),
    };
    persist(entry);
    onResult(entry);
  };

  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

function persist(entry: PracticeLogEntry): void {
  try {
    const log = readPracticeLog();
    log.push(entry);
    window.localStorage.setItem(PRACTICE_LOG_KEY, JSON.stringify(log.slice(-200)));
  } catch {
    // Storage unavailable (private mode etc.) — the toast already fired; never crash.
  }
}

export function readPracticeLog(): PracticeLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PRACTICE_LOG_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PracticeLogEntry[]) : [];
  } catch {
    return [];
  }
}
