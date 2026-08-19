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

export function findCachedLesson(
  lessons: { id: string; conceptId: string; durationMin: number; effort: string; source: { type: string; promptVersion?: string } }[],
  conceptId: string,
  durationMin: number,
  effort: string,
  promptVersion: string,
) {
  return lessons.find(
    (l) =>
      l.conceptId === conceptId &&
      l.durationMin === durationMin &&
      l.effort === effort &&
      l.source.type === "ai" &&
      (l.source.promptVersion ?? promptVersion) === promptVersion,
  );
}
