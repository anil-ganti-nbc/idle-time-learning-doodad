import type { Concept, Course, CourseModule, Level, Tier } from "@/lib/learning/types";
import type { CourseManifest } from "./schema";

export function levelFromTier(tier: Tier): Level {
  if (tier <= 1) return "intro";
  if (tier <= 3) return "core";
  return "journalist";
}

export function assembleManifest(manifest: CourseManifest): { course: Course; concepts: Concept[] } {
  const byModule = new Map<string, Concept[]>();
  const concepts: Concept[] = manifest.concepts.map((raw, index) => {
    const concept: Concept = {
      id: raw.id,
      name: raw.name,
      category: manifest.categoryId,
      parentId: raw.parentId,
      prerequisites: raw.prerequisites,
      level: levelFromTier(raw.tier as Tier),
      summary: raw.summary,
      courseId: manifest.id,
      moduleId: raw.moduleId,
      curriculumOrder: index,
      tier: raw.tier as Tier,
      objectives: raw.objectives,
      estimatedMinutes: raw.estimatedMinutes ?? 10,
      sourceIds: raw.sourceIds,
    };
    const list = byModule.get(raw.moduleId) ?? [];
    list.push(concept);
    byModule.set(raw.moduleId, list);
    return concept;
  });

  const modules: CourseModule[] = [...manifest.modules]
    .sort((a, b) => a.order - b.order)
    .map((mod) => {
      const ids = (byModule.get(mod.id) ?? []).map((c) => c.id);
      const spine = (mod.spineIds ?? []).filter((id) => ids.includes(id));
      return {
        id: mod.id,
        title: mod.title,
        blurb: mod.blurb,
        order: mod.order,
        prerequisites: mod.prerequisites,
        conceptIds: ids,
        spineIds: spine.length ? spine : ids.slice(0, 1),
        learningObjectives: mod.learningObjectives,
        sourceIds: mod.sourceIds,
      };
    });

  const estimatedMinutes =
    concepts.reduce((sum, c) => sum + (c.estimatedMinutes ?? 10), 0);

  const course: Course = {
    id: manifest.id,
    title: manifest.title,
    categoryId: manifest.categoryId,
    description: manifest.description,
    curriculumVersion: manifest.curriculumVersion,
    sourceReferences: manifest.sourceReferences,
    entryRequirements: manifest.entryRequirements,
    modules,
    orderHint: manifest.orderHint,
    difficultyRange: manifest.difficultyRange,
    estimatedMinutes,
  };

  return { course, concepts };
}
