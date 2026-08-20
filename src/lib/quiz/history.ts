import type {
  AssessmentHistory,
  AssessmentItemRecord,
  CognitiveType,
  Understanding,
} from "@/lib/learning/types";

export function emptyAssessmentHistory(): AssessmentHistory {
  return { items: [], recentPositions: [] };
}

export function appendAssessmentItems(
  history: AssessmentHistory | undefined,
  items: AssessmentItemRecord[],
  positions: number[] = [],
): AssessmentHistory {
  const prev = history ?? emptyAssessmentHistory();
  return {
    items: [...prev.items, ...items].slice(-200),
    recentPositions: [...prev.recentPositions, ...positions].slice(-24),
  };
}

export function markLaterPoorRating(
  history: AssessmentHistory | undefined,
  conceptId: string,
  understanding: Understanding,
): AssessmentHistory {
  const prev = history ?? emptyAssessmentHistory();
  if (understanding !== "didnt_get_it") return prev;
  let remaining = 3;
  const items = prev.items
    .slice()
    .reverse()
    .map((item) => {
      if (remaining > 0 && item.conceptId === conceptId && !item.laterPoorRating) {
        remaining -= 1;
        return { ...item, laterPoorRating: true };
      }
      return item;
    })
    .reverse();
  return { ...prev, items };
}

export function recentCognitiveTypes(history: AssessmentHistory | undefined, conceptId?: string): CognitiveType[] {
  return (history?.items ?? [])
    .filter((item) => (!conceptId || item.conceptId === conceptId) && item.cognitiveType)
    .slice(-9)
    .map((item) => item.cognitiveType) as CognitiveType[];
}

export function recentObjectiveIds(history: AssessmentHistory | undefined, conceptId?: string): string[] {
  return (history?.items ?? [])
    .filter((item) => !conceptId || item.conceptId === conceptId)
    .slice(-9)
    .flatMap((item) => item.objectiveIds);
}

export function hasSecretFields(record: AssessmentItemRecord): boolean {
  const blob = JSON.stringify(record).toLowerCase();
  return /chain.of.thought|hidden.?reason|api[_-]?key|authorization:/.test(blob);
}
