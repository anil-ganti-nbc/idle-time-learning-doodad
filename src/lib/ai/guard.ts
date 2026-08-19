import type { AiPolicy, AiSettings } from "@/lib/learning/types";

export type GuardOk = { ok: true };
export type GuardFail = { ok: false; error: string };

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

/** AI output may never mutate mastery. Progress writes go only through recordSession. */
export function stripProgressFields<T extends Record<string, unknown>>(obj: T): T {
  const banned = ["mastery", "progress", "ease", "intervalDays", "nextReviewAt", "understanding"];
  const next = { ...obj };
  for (const key of banned) delete next[key];
  return next;
}
