import { isDue } from "./srs";
import type { ConceptProgress, ConceptState } from "./types";

/**
 * Derived mastery label. Never written by AI — only from encounters, ratings, quizzes, and the clock.
 *
 * unseen      never studied
 * introduced  first pass, not yet solid
 * shaky       failed, low quiz, or repeated "mostly"
 * understood  held, not due, not yet strong
 * due         scheduled review is waiting
 * strong      several clean passes and a long interval
 */
export function conceptState(
  progress: ConceptProgress | undefined,
  knownByProfile = false,
  now = new Date(),
): ConceptState {
  if (!progress?.encountered) {
    return knownByProfile ? "understood" : "unseen";
  }
  if (isDue(progress, now)) return "due";

  const quizWeak = progress.lastQuizScore !== null && progress.lastQuizScore < 0.67;
  const failed = progress.understanding === "didnt_get_it";
  const lingering =
    progress.understanding === "mostly" && progress.timesStudied >= 2 && quizWeak;

  if (failed || (quizWeak && progress.understanding !== "got_it") || lingering) {
    return "shaky";
  }

  const strong =
    progress.timesStudied >= 3 &&
    progress.understanding === "got_it" &&
    progress.lastQuizScore !== null &&
    progress.lastQuizScore >= 1 &&
    progress.intervalDays >= 14;

  if (strong) return "strong";
  if (progress.timesStudied === 1 && progress.understanding !== "got_it") return "introduced";
  return "understood";
}

export function stateLabel(state: ConceptState): string {
  switch (state) {
    case "unseen":
      return "Unseen";
    case "introduced":
      return "Introduced";
    case "shaky":
      return "Shaky";
    case "understood":
      return "Understood";
    case "due":
      return "Due for review";
    case "strong":
      return "Strong";
  }
}

export function isReady(
  conceptId: string,
  progress: Record<string, ConceptProgress>,
  journalist: boolean,
  knownIds: string[],
  introIds: Set<string>,
): boolean {
  if (knownIds.includes(conceptId)) return true;
  const p = progress[conceptId];
  if (p && (p.understanding === "got_it" || p.understanding === "mostly")) return true;
  if (journalist && introIds.has(conceptId)) return true;
  return false;
}
