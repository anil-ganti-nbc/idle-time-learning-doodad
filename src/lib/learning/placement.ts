import { conceptsInCourse, inferTier } from "./curriculum";
import type {
  Catalog,
  Course,
  CoursePlacement,
  Lesson,
  QuizQuestion,
  Tier,
} from "./types";
import { presentQuiz } from "@/lib/quiz/shuffle";

export interface PlacementItem {
  conceptId: string;
  tier: Tier;
  question: QuizQuestion;
  lessonId: string;
}

export interface PlacementAnswer {
  conceptId: string;
  tier: Tier;
  correct: boolean;
}

export function pickPlacementItems(course: Course, catalog: Catalog, n = 3): PlacementItem[] {
  const early = course.modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .slice(0, 2)
    .flatMap((m) => (m.spineIds.length ? m.spineIds : m.conceptIds));
  const items: PlacementItem[] = [];
  for (const conceptId of early) {
    const concept = catalog.conceptMap[conceptId];
    if (!concept || inferTier(concept) > 2) continue;
    const lesson = catalog.lessons.find((l) => l.conceptId === conceptId);
    if (!lesson) continue;
    const question = lesson.quiz[0];
    items.push({
      conceptId,
      tier: inferTier(concept),
      question,
      lessonId: lesson.id,
    });
    if (items.length >= n) break;
  }
  return items.map((item) => ({
    ...item,
    question: presentQuiz([item.question])[0],
  }));
}

export function scorePlacement(answers: PlacementAnswer[], now = new Date()): CoursePlacement {
  const eligible = answers.filter((a) => a.tier <= 2);
  const waived = eligible.filter((a) => a.correct && a.tier <= 1).map((a) => a.conceptId);
  const foundation = eligible.filter((a) => a.tier <= 1);
  const allFoundationCorrect = foundation.length >= 2 && foundation.every((a) => a.correct);
  const coreHit = eligible.find((a) => a.tier === 2 && a.correct);
  if (allFoundationCorrect && coreHit) waived.push(coreHit.conceptId);

  const refused = answers.filter((a) => a.tier >= 3);
  const evidence = [
    ...eligible.map((a) => `${a.conceptId}:${a.correct ? "ok" : "miss"}`),
    ...refused.map((a) => `${a.conceptId}:ignored-advanced`),
  ];

  let recommendedTier: Tier = 0;
  if (waived.length > 0) recommendedTier = 1;
  if (allFoundationCorrect && coreHit) recommendedTier = 2;

  return {
    at: now.toISOString(),
    recommendedTier,
    waivedConceptIds: [...new Set(waived)],
    evidence,
    kind: "quiz",
  };
}

export function declareKnown(
  course: Course,
  catalog: Catalog,
  conceptIds: string[],
  now = new Date(),
): CoursePlacement {
  const allowed = new Set(
    conceptsInCourse(catalog, course)
      .filter((c) => inferTier(c) <= 1)
      .map((c) => c.id),
  );
  const waived = conceptIds.filter((id) => allowed.has(id));
  return {
    at: now.toISOString(),
    recommendedTier: waived.length ? 1 : 0,
    waivedConceptIds: waived,
    evidence: [
      ...waived.map((id) => `${id}:declared`),
      ...conceptIds.filter((id) => !allowed.has(id)).map((id) => `${id}:refused`),
    ],
    kind: "declaration",
  };
}

export function placementUnlocksAdvanced(placement: CoursePlacement): boolean {
  return placement.recommendedTier >= 4 || placement.waivedConceptIds.some((id) => id.includes("gpu-scheduler"));
}

export function lessonHasPlacementQuestion(lesson: Lesson): boolean {
  return lesson.quiz.length === 3;
}
