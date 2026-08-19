import type { Mode, TimeBudget } from "./types";

const KEY = "dau-live-session";

export interface LiveSession {
  lessonId: string;
  startedAt: string;
  mode: Mode;
  timeBudget: TimeBudget;
  quizCorrect?: number;
  answered?: number;
  generations?: number;
}

export function startLive(session: Omit<LiveSession, "quizCorrect" | "answered">) {
  const next: LiveSession = { generations: 0, ...session };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function getLive(): LiveSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LiveSession;
  } catch {
    return null;
  }
}

export function patchLive(partial: Partial<LiveSession>) {
  const cur = getLive();
  if (!cur) return null;
  const next = { ...cur, ...partial };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function bumpLiveGeneration() {
  const cur = getLive();
  const generations = (cur?.generations ?? 0) + 1;
  if (cur) patchLive({ generations });
  return generations;
}

export function clearLive() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

export function elapsedMinutes(startedAt: string, now = Date.now()): number {
  return Math.max(1, Math.round((now - new Date(startedAt).getTime()) / 60_000));
}

/** Opening a gap with a freshly generated lesson already consumed one billable call. */
export function generationsAfterStart(billable: boolean): number {
  return billable ? 1 : 0;
}
