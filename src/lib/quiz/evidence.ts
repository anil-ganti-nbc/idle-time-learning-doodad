import { inferTier } from "@/lib/learning/curriculum";
import {
  evidenceScore,
  frontierConcepts,
  isDemonstrated,
  isWaived,
  type ReadinessContext,
} from "@/lib/learning/readiness";
import type {
  ConceptProgress,
  Course,
  LessonResult,
  Understanding,
} from "@/lib/learning/types";

export interface LessonResultInput {
  lessonId: string;
  conceptId: string;
  quizCorrect: number;
  quizTotal: number;
  understanding: Understanding | null;
  at?: string;
}

export interface ConceptEvidence {
  conceptId: string;
  encounters: number;
  lastQuizRatio: number | null;
  lifetimeRatio: number | null;
  understanding: Understanding | null;
  lapseCount: number;
  waived: boolean;
  declaredKnown: boolean;
  score: number;
}

export interface CourseReadinessSummary {
  courseId: string;
  demonstratedIds: string[];
  waivedIds: string[];
  frontierIds: string[];
  canOpenSpecialist: boolean;
}

export function lessonResult(input: LessonResultInput): LessonResult {
  return {
    lessonId: input.lessonId,
    conceptId: input.conceptId,
    quizCorrect: input.quizCorrect,
    quizTotal: input.quizTotal,
    understanding: input.understanding,
    at: input.at ?? new Date().toISOString(),
  };
}

export function conceptEvidence(
  conceptId: string,
  progress: ConceptProgress | undefined,
  ctx: ReadinessContext,
): ConceptEvidence {
  const declared = Boolean(ctx.profile?.knownConceptIds.includes(conceptId));
  return {
    conceptId,
    encounters: progress?.timesStudied ?? 0,
    lastQuizRatio: progress?.lastQuizScore ?? null,
    lifetimeRatio: progress && progress.quizTotal > 0 ? progress.quizCorrect / progress.quizTotal : null,
    understanding: progress?.understanding ?? null,
    lapseCount: progress?.lapseCount ?? 0,
    waived: isWaived(conceptId, ctx) && !(progress?.encountered && (progress.timesStudied ?? 0) > 0),
    declaredKnown: declared,
    score: evidenceScore(progress),
  };
}

export function courseReadiness(course: Course, ctx: ReadinessContext): CourseReadinessSummary {
  const ids = course.modules.flatMap((m) => m.conceptIds);
  const demonstratedIds = ids.filter((id) => {
    const concept = ctx.catalog.conceptMap[id];
    return concept ? isDemonstrated(id, ctx, inferTier(concept)) : false;
  });
  const waivedIds = [
    ...new Set([
      ...(ctx.courses?.[course.id]?.waivedConceptIds ?? []),
      ...(ctx.courses?.[course.id]?.placement?.waivedConceptIds ?? []),
    ]),
  ];
  const specialist = ids
    .map((id) => ctx.catalog.conceptMap[id])
    .filter((c): c is NonNullable<typeof c> => Boolean(c) && inferTier(c) >= 5);
  const canOpenSpecialist = specialist.some((c) => isDemonstrated(c.id, ctx, inferTier(c)) || isConceptReadyFor(c.id, ctx));
  return {
    courseId: course.id,
    demonstratedIds,
    waivedIds,
    frontierIds: frontierConcepts(course, ctx).map((c) => c.id),
    canOpenSpecialist,
  };
}

function isConceptReadyFor(conceptId: string, ctx: ReadinessContext): boolean {
  const concept = ctx.catalog.conceptMap[conceptId];
  if (!concept) return false;
  return concept.prerequisites.every((id) => isDemonstrated(id, ctx, inferTier(concept)));
}

/** A single 3/3 is evidence. It is not enough to open a specialist branch. */
export function onePerfectQuizUnlocksSpecialist(progress: ConceptProgress | undefined): boolean {
  if (!progress?.encountered) return false;
  if ((progress.timesStudied ?? 0) >= 2) return false;
  return (progress.lastQuizScore ?? 0) >= 1 && (progress.lastQuizTotal ?? 3) === 3;
}
