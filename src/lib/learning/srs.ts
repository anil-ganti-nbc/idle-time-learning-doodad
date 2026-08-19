import type { ConceptProgress, ReviewEvent, Understanding } from "./types";

const MIN_INTERVAL = 1;
const MAX_EASE = 3.2;
const MIN_EASE = 1.3;

export function emptyProgress(conceptId: string): ConceptProgress {
  return {
    conceptId,
    encountered: false,
    understanding: null,
    quizCorrect: 0,
    quizTotal: 0,
    lastQuizScore: null,
    estimatedMinutes: 0,
    actualMinutes: 0,
    lastStudiedAt: null,
    nextReviewAt: null,
    timesStudied: 0,
    ease: 2.3,
    intervalDays: 0,
    reviewHistory: [],
    updatedAt: null,
  };
}

/**
 * Quality 0–5 from quiz + self-rating.
 * 0–1 fail, 2–3 partial, 4–5 solid. Auditable: both inputs are stored on the event.
 */
export function reviewQuality(
  understanding: Understanding,
  quizCorrect: number,
  quizTotal: number,
): number {
  const score = quizTotal <= 0 ? 0.5 : quizCorrect / quizTotal;
  if (understanding === "didnt_get_it") return score < 0.34 ? 0 : 1;
  if (understanding === "mostly") return score < 0.67 ? 2 : 3;
  return score < 0.67 ? 3 : score < 1 ? 4 : 5;
}

function meanRecentQuality(history: ReviewEvent[]): number | null {
  if (history.length === 0) return null;
  const last = history.slice(-3);
  return last.reduce((s, e) => s + reviewQuality(e.understanding, e.quizCorrect, e.quizTotal), 0) / last.length;
}

function daysSince(iso: string | null, now: Date): number | null {
  if (!iso) return null;
  return (now.getTime() - new Date(iso).getTime()) / 86_400_000;
}

export interface ScheduleInput {
  prev: ConceptProgress;
  understanding: Understanding;
  quizCorrect: number;
  quizTotal: number;
  now?: Date;
}

export function scheduleReview(
  prev: ConceptProgress,
  understanding: Understanding,
  quizCorrect: number,
  quizTotal: number,
  now = new Date(),
): Pick<ConceptProgress, "ease" | "intervalDays" | "nextReviewAt"> {
  return scheduleReviewFull({ prev, understanding, quizCorrect, quizTotal, now });
}

/**
 * Simple SM-2 relative scheduler.
 *
 * Inputs (all stored, none hidden):
 * - quiz score and self-rating → quality 0–5
 * - previous ease and interval
 * - number of prior encounters
 * - days since last exposure (early restudy grows interval more slowly)
 * - mean quality of the last three reviews
 */
export function scheduleReviewFull(
  input: ScheduleInput,
): Pick<ConceptProgress, "ease" | "intervalDays" | "nextReviewAt"> {
  const now = input.now ?? new Date();
  const quality = reviewQuality(input.understanding, input.quizCorrect, input.quizTotal);
  const encounters = input.prev.timesStudied;
  const elapsed = daysSince(input.prev.lastStudiedAt, now);
  const recent = meanRecentQuality(input.prev.reviewHistory);

  let ease = input.prev.ease;
  if (quality <= 1) ease -= 0.28;
  else if (quality === 2) ease -= 0.1;
  else if (quality === 3) ease -= 0.02;
  else if (quality === 4) ease += 0.1;
  else ease += 0.16;
  if (encounters >= 4 && quality >= 4) ease += 0.04;
  ease = clamp(ease, MIN_EASE, MAX_EASE);

  let intervalDays: number;
  if (quality <= 1) {
    intervalDays = input.quizCorrect === 0 ? 1 : MIN_INTERVAL;
  } else if (input.prev.intervalDays < 1) {
    intervalDays = quality <= 3 ? 3 : 6;
  } else {
    let growth = ease;
    if (elapsed !== null && input.prev.intervalDays > 0 && elapsed < input.prev.intervalDays * 0.4) {
      growth *= 0.85;
    }
    if (recent !== null) {
      if (recent >= 4) growth *= 1.12;
      else if (recent <= 1.5) growth *= 0.8;
    }
    intervalDays = Math.max(quality <= 3 ? 2 : 4, Math.round(input.prev.intervalDays * growth));
  }

  return { ease, intervalDays, nextReviewAt: addDays(now, intervalDays) };
}

export function isDue(progress: ConceptProgress | undefined, now = new Date()): boolean {
  if (!progress?.nextReviewAt) return false;
  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
}

export function addDays(from: Date, days: number): string {
  const d = new Date(from);
  d.setTime(d.getTime() + days * 86_400_000);
  return d.toISOString();
}

export function daysUntil(iso: string | null, now = new Date()): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - now.getTime();
  return Math.ceil(ms / 86_400_000);
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
