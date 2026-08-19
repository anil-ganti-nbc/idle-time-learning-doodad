import type { QuizPromptContext } from "@/lib/ai/prompts";
import { courseForConcept, inferTier, moduleForConcept } from "./curriculum";
import { conceptState } from "./state";
import type { AssessmentHistory, Catalog, CognitiveType, Concept, Lesson } from "./types";
import { isDemonstrated, type ReadinessContext } from "./readiness";
import { allowedKnowledge } from "@/lib/quiz/knowledge";
import { plannedMix } from "@/lib/quiz/mix";
import { recentCognitiveTypes, recentObjectiveIds } from "@/lib/quiz/history";

export function quizContextForConcept(
  concept: Concept | undefined,
  ctx: ReadinessContext,
  catalog: Catalog,
  opts?: { journalist?: boolean; history?: AssessmentHistory },
): QuizPromptContext {
  const course = concept ? courseForConcept(catalog, concept.id) : undefined;
  const mod = concept ? moduleForConcept(catalog, concept.id) : undefined;
  const allowed = concept
    ? allowedKnowledge(catalog, concept, ctx, opts?.journalist ?? false)
    : { currentConceptId: "", conceptIds: [], names: [], reasons: {} };
  const weak = allowed.names.filter((row) => {
    const state = conceptState(ctx.progress[row.id], ctx.profile?.knownConceptIds.includes(row.id) ?? false);
    return state === "shaky";
  });
  const demonstrated = allowed.names.filter((row) => row.id !== concept?.id && isDemonstrated(row.id, ctx, 2));
  const objectives = concept?.objectives ?? mod?.learningObjectives ?? [];
  const recentObjectives = recentObjectiveIds(opts?.history, concept?.id);
  const prioritized = objectives.filter((id) => !recentObjectives.includes(id)).slice(0, 3);
  const objectiveList = prioritized.length ? prioritized : objectives.slice(0, 3);
  const mix = plannedMix(inferTier(concept));
  return {
    subjectId: concept?.category,
    subjectName: concept ? catalog.categoryMap[concept.category]?.name : undefined,
    courseId: course?.id,
    courseTitle: course?.title,
    moduleId: mod?.id,
    moduleTitle: mod?.title,
    conceptId: concept?.id,
    tier: inferTier(concept),
    currentConcept: concept?.name ?? "",
    prerequisites: (concept?.prerequisites ?? []).map((id) => ({
      id,
      name: catalog.conceptMap[id]?.name ?? id,
    })),
    demonstrated,
    weak,
    objectives: objectiveList,
    allowedKnowledge: allowed.names,
    requestedMix: mix,
    recentCognitiveTypes: recentCognitiveTypes(opts?.history, concept?.id) as CognitiveType[],
    recentObjectiveIds: recentObjectives,
  };
}

export function quizContextFor(
  lesson: Lesson,
  ctx: ReadinessContext,
  catalog: Catalog,
  opts?: { journalist?: boolean; history?: AssessmentHistory },
): QuizPromptContext {
  const concept = catalog.conceptMap[lesson.conceptId];
  const fromConcept = quizContextForConcept(concept, ctx, catalog, opts);
  if (concept) return fromConcept;
  return {
    ...fromConcept,
    currentConcept: lesson.conceptId,
    conceptId: lesson.conceptId,
    prerequisites: lesson.prerequisites.map((id) => ({
      id,
      name: catalog.conceptMap[id]?.name ?? id,
    })),
  };
}
