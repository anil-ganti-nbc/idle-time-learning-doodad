import type { AiPolicy, AiSettings } from "@/lib/learning/types";

export type GuardOk = { ok: true };
export type GuardFail = { ok: false; error: string };

const BANNED_PROGRESS_KEYS = new Set([
  "mastery",
  "progress",
  "ease",
  "intervalDays",
  "interval_days",
  "nextReviewAt",
  "next_review_at",
  "understanding",
  "lapseCount",
  "lapse_count",
  "lastQuizScore",
  "last_quiz_score",
]);

export function assertAiAllowed(
  settings: AiSettings,
  generatedToday: number,
  sessionCount: number,
): GuardOk | GuardFail {
  if (!settings.enabled || settings.policy === "off") {
    return { ok: false, error: "AI is disabled. Turn it on in Settings if you want generated units." };
  }
  if (generatedToday >= settings.maxPerDay) {
    return { ok: false, error: `Daily generation cap reached (${settings.maxPerDay}).` };
  }
  if (sessionCount >= settings.maxPerSession) {
    return { ok: false, error: `This gap already used ${settings.maxPerSession} generations.` };
  }
  return { ok: true };
}

export function assertMissingOnly(policy: AiPolicy, hasLocalMatch: boolean): GuardOk | GuardFail {
  if (policy === "missing-only" && hasLocalMatch) {
    return { ok: false, error: "A local unit already fits. Generation is limited to missing lessons." };
  }
  return { ok: true };
}

export function findProgressFields(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => findProgressFields(item, path ? `${path}[${i}]` : `[${i}]`));
  }
  if (!value || typeof value !== "object") return [];
  const hits: string[] = [];
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const next = path ? `${path}.${key}` : key;
    if (BANNED_PROGRESS_KEYS.has(key)) hits.push(next);
    hits.push(...findProgressFields(child, next));
  }
  return hits;
}

/** Schema validation is the accept/reject boundary. This walk only detects leaks. */
export function assertNoProgressFields(raw: unknown): GuardOk | GuardFail {
  const hits = findProgressFields(raw);
  if (hits.length === 0) return { ok: true };
  return {
    ok: false,
    error: `Generated output included forbidden progress fields (${hits.slice(0, 4).join(", ")}). Rejected.`,
  };
}

/** Recursive strip for diagnostics / defensive copies. Parsing still rejects leaks. */
export function stripProgressFields<T>(obj: T): T {
  return stripValue(obj) as T;
}

function stripValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripValue);
  if (!value || typeof value !== "object") return value;
  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (BANNED_PROGRESS_KEYS.has(key)) continue;
    next[key] = stripValue(child);
  }
  return next;
}
