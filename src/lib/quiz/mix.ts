import type { CognitiveType, QuizQuestion, Tier } from "@/lib/learning/types";

/** Three distinct jobs for a normal micro-lesson quiz. */
export function plannedMix(tier: Tier): [CognitiveType, CognitiveType, CognitiveType] {
  if (tier <= 1) return ["recognize", "apply", "identify"];
  if (tier === 2) return ["recognize", "apply", "predict"];
  if (tier === 3) return ["apply", "diagnose", "integrate"];
  return ["integrate", "diagnose", "tradeoff"];
}

export function mixGuidance(tier: Tier): string {
  const [q1, q2, q3] = plannedMix(tier);
  if (tier <= 1) {
    return `Q1 ${q1} the current lesson. Q2 ${q2} a simple mechanism. Q3 ${q3} a close alternative. Keep Q3 simple — do not force integration.`;
  }
  if (tier === 2) {
    return `Q1 ${q1} the current lesson. Q2 ${q2} the mechanism. Q3 ${q3} a straightforward outcome. Do not write three recall paraphrases.`;
  }
  if (tier === 3) {
    return `Q1 ${q1} the current concept. Q2 ${q2} a result. Q3 ${q3} a demonstrated prerequisite. No future-module knowledge.`;
  }
  return `All three may be integrative (${q1}, ${q2}, ${q3}), but only with already demonstrated prerequisites. Advanced means tighter reasoning, not trivia.`;
}

export function uniqueCognitiveTypes(quiz: Array<{ cognitiveType?: CognitiveType }>): CognitiveType[] {
  return [...new Set(quiz.map((q) => q.cognitiveType).filter((t): t is CognitiveType => Boolean(t)))];
}

export function mixIsDistinct(quiz: Array<{ cognitiveType?: CognitiveType }>): boolean {
  const types = quiz.map((q) => q.cognitiveType).filter(Boolean);
  if (types.length < 2) return true;
  return new Set(types).size >= 2;
}

export function objectiveCoverage(quiz: QuizQuestion[]): string[] {
  return [...new Set(quiz.flatMap((q) => q.objectiveIds ?? []))];
}

export function repeatsRecentObjective(
  objectiveIds: string[] | undefined,
  recentObjectiveIds: string[],
): boolean {
  if (!objectiveIds?.length || recentObjectiveIds.length === 0) return false;
  return objectiveIds.every((id) => recentObjectiveIds.slice(-6).includes(id));
}
