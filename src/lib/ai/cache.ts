import type { Effort, Level, TimeBudget } from "@/lib/learning/types";

export interface CacheKeyInput {
  kind: "lesson" | "explain" | "quiz" | "deeper" | "source";
  conceptId: string;
  durationMin?: TimeBudget;
  effort?: Effort;
  level?: Level;
  journalist?: boolean;
  adapt?: string;
  style?: string;
  sourceHash?: string;
  promptVersion: string;
}

export interface CachedLessonLike {
  id: string;
  conceptId: string;
  durationMin: number;
  effort: string;
  level?: string;
  source: {
    type: string;
    promptVersion?: string;
    cacheKey?: string;
    sourceExcerpt?: string;
  };
}

export function cacheKey(input: CacheKeyInput): string {
  return [
    input.kind,
    input.conceptId,
    input.durationMin ?? "",
    input.effort ?? "",
    input.level ?? "",
    input.journalist ? "j" : "",
    input.adapt ?? "",
    input.style ?? "",
    input.sourceHash ?? "",
    input.promptVersion,
  ].join("|");
}

export function hashText(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

/**
 * Reuse an AI lesson only when the full generation context matches.
 * A journalist-depth or source-grounded unit must not satisfy a generic request.
 */
export function findCachedLesson(lessons: CachedLessonLike[], query: CacheKeyInput): CachedLessonLike | undefined {
  const key = cacheKey(query);
  const exact = lessons.find((l) => l.source.type === "ai" && l.source.cacheKey === key);
  if (exact) return exact;

  return lessons.find((l) => {
    if (l.source.type !== "ai") return false;
    if (l.source.cacheKey) return false;
    if (l.conceptId !== query.conceptId) return false;
    if (l.durationMin !== query.durationMin) return false;
    if (query.effort && l.effort !== query.effort) return false;
    if ((l.source.promptVersion ?? query.promptVersion) !== query.promptVersion) return false;
    if (query.level && l.level && l.level !== query.level) return false;
    if (query.journalist === true && l.level !== "journalist") return false;
    if (query.journalist === false && l.level === "journalist") return false;
    if (query.sourceHash) {
      const stored = l.source.sourceExcerpt ? hashText(l.source.sourceExcerpt) : "";
      if (stored !== query.sourceHash) return false;
    }
    if (query.adapt) return false;
    if (query.style) return false;
    return true;
  });
}
