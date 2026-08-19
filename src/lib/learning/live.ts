import { LIVE_SESSION_KEY } from "./persistence";
import { liveStorage } from "./storage";
import type { AssessmentItemRecord, Mode, TimeBudget } from "./types";

export interface LiveSession {
  lessonId: string;
  startedAt: string;
  mode: Mode;
  timeBudget: TimeBudget;
  quizCorrect?: number;
  answered?: number;
  generations?: number;
  quizItems?: AssessmentItemRecord[];
  positions?: number[];
}

function writeLive(next: LiveSession) {
  try {
    liveStorage().setItem(LIVE_SESSION_KEY, JSON.stringify(next));
  } catch {
    // memory fallback already absorbs typical failures
  }
}

export function startLive(session: Omit<LiveSession, "quizCorrect" | "answered">) {
  const next: LiveSession = { generations: 0, ...session };
  writeLive(next);
  return next;
}

export function getLive(): LiveSession | null {
  try {
    const raw = liveStorage().getItem(LIVE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LiveSession;
  } catch {
    return null;
  }
}

export function patchLive(partial: Partial<LiveSession>) {
  const cur = getLive();
  if (!cur) return null;
  const next = { ...cur, ...partial };
  writeLive(next);
  return next;
}

export function bumpLiveGeneration() {
  const cur = getLive();
  const generations = (cur?.generations ?? 0) + 1;
  if (cur) patchLive({ generations });
  return generations;
}

export function clearLive() {
  try {
    liveStorage().removeItem(LIVE_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function elapsedMinutes(startedAt: string, now = Date.now()): number {
  return Math.max(1, Math.round((now - new Date(startedAt).getTime()) / 60_000));
}

/** Opening a gap with a freshly generated lesson already consumed one billable call. */
export function generationsAfterStart(billable: boolean): number {
  return billable ? 1 : 0;
}
