import type { QuizPromptContext } from "@/lib/ai/prompts";
import { courseForConcept, inferTier, moduleForConcept } from "./curriculum";
import { isDemonstrated, type ReadinessContext } from "./readiness";
import { conceptState } from "./state";
import type { Catalog, Concept, Lesson } from "./types";

export function quizContextForConcept(
  concept: Concept | undefined,
  ctx: ReadinessContext,
  catalog: Catalog,
): QuizPromptContext {
  const course = concept ? courseForConcept(catalog, concept.id) : undefined;
  const mod = concept ? moduleForConcept(catalog, concept.id) : undefined;
  const demonstrated = catalog.concepts
    .filter((c) => isDemonstrated(c.id, ctx, 2))
    .map((c) => ({ id: c.id, name: c.name }));
  const weak = catalog.concepts
    .filter((c) => conceptState(ctx.progress[c.id], ctx.profile?.knownConceptIds.includes(c.id) ?? false) === "shaky")
    .map((c) => ({ id: c.id, name: c.name }));
  return {
    courseTitle: course?.title,
    moduleTitle: mod?.title,
    tier: inferTier(concept),
    currentConcept: concept?.name ?? "",
    prerequisites: (concept?.prerequisites ?? []).map((id) => ({
      id,
      name: catalog.conceptMap[id]?.name ?? id,
    })),
    demonstrated,
    weak,
  };
}

export function quizContextFor(
  lesson: Lesson,
  ctx: ReadinessContext,
  catalog: Catalog,
): QuizPromptContext {
  const concept = catalog.conceptMap[lesson.conceptId];
  const fromConcept = quizContextForConcept(concept, ctx, catalog);
  if (concept) return fromConcept;
  return {
    ...fromConcept,
    currentConcept: lesson.conceptId,
    prerequisites: lesson.prerequisites.map((id) => ({
      id,
      name: catalog.conceptMap[id]?.name ?? id,
    })),
  };
}
