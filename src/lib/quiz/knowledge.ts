import { courseForConcept, inferTier, moduleForConcept, prereqClosure } from "@/lib/learning/curriculum";
import { isDemonstrated, isWaived, type ReadinessContext } from "@/lib/learning/readiness";
import type { Catalog, Concept, Tier } from "@/lib/learning/types";

export type KnowledgeReason = "current" | "prerequisite" | "demonstrated-path" | "cross-course" | "waived";

export interface AllowedKnowledge {
  currentConceptId: string;
  conceptIds: string[];
  names: { id: string; name: string }[];
  reasons: Record<string, KnowledgeReason>;
}

/**
 * Knowledge a quiz may assume. Journalist depth is ignored — it must not
 * expand the allowed set past demonstrated or waived prerequisites.
 */
export function allowedKnowledge(
  catalog: Catalog,
  concept: Concept,
  ctx: ReadinessContext,
  _journalist = false,
): AllowedKnowledge {
  const reasons: Record<string, KnowledgeReason> = { [concept.id]: "current" };
  const ids = new Set<string>([concept.id]);

  function admit(id: string, reason: KnowledgeReason) {
    if (!id || ids.has(id) || !catalog.conceptMap[id]) return;
    ids.add(id);
    reasons[id] = reason;
  }

  for (const pre of concept.prerequisites) {
    if (isWaived(pre, ctx)) admit(pre, "waived");
    else if (isDemonstrated(pre, ctx, inferTier(concept))) admit(pre, "prerequisite");
  }

  const course = courseForConcept(catalog, concept.id);
  const currentMod = moduleForConcept(catalog, concept.id);
  if (course) {
    const currentOrder = currentMod?.order ?? 0;
    for (const mod of course.modules) {
      if (mod.order > currentOrder) continue;
      for (const id of mod.conceptIds) {
        if (id === concept.id) continue;
        if (isWaived(id, ctx)) admit(id, "waived");
        else if (isDemonstrated(id, ctx, 2)) admit(id, "demonstrated-path");
      }
    }
  }

  for (const pre of prereqClosure(catalog, concept.id)) {
    if (pre === concept.id) continue;
    if (isWaived(pre, ctx)) admit(pre, "waived");
    else if (isDemonstrated(pre, ctx, inferTier(concept))) {
      const already = reasons[pre];
      if (!already) admit(pre, "cross-course");
    }
  }

  // Journalist must not add extra IDs. `_journalist` is accepted so callers
  // cannot accidentally widen the set by passing it.
  void _journalist;

  return {
    currentConceptId: concept.id,
    conceptIds: [...ids],
    names: [...ids].map((id) => ({ id, name: catalog.conceptMap[id]?.name ?? id })),
    reasons,
  };
}

export function isAllowedConcept(allowed: AllowedKnowledge, conceptId: string): boolean {
  return allowed.conceptIds.includes(conceptId);
}

export function futureOrSpecialistLeak(
  catalog: Catalog,
  current: Concept,
  referencedIds: string[],
  allowed: AllowedKnowledge,
): string[] {
  const currentTier = inferTier(current);
  const leaks: string[] = [];
  for (const id of referencedIds) {
    if (id === current.id) continue;
    if (!isAllowedConcept(allowed, id)) {
      leaks.push(id);
      continue;
    }
    const other = catalog.conceptMap[id];
    if (!other) {
      leaks.push(id);
      continue;
    }
    const otherTier = inferTier(other);
    if (currentTier <= 1 && otherTier >= 4) leaks.push(id);
  }
  return leaks;
}

export function maxAllowedTier(allowed: AllowedKnowledge, catalog: Catalog): Tier {
  let max: Tier = 0;
  for (const id of allowed.conceptIds) {
    const tier = inferTier(catalog.conceptMap[id]);
    if (tier > max) max = tier;
  }
  return max;
}
