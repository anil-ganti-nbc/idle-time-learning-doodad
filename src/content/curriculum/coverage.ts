import { isRetiredSeededCategory } from "@/lib/learning/types";
import type { Catalog, ConceptProgress } from "@/lib/learning/types";

export interface CourseCoverage {
  courseId: string;
  title: string;
  categoryId: string;
  conceptCount: number;
  withLessons: number;
  lackingLessons: number;
  coveragePct: number;
  estimatedMinutes: number;
  unseenMinutes: number;
  shallow: boolean;
}

export interface CurriculumCoverage {
  subjects: number;
  courses: number;
  modules: number;
  concepts: number;
  activeConcepts: number;
  conceptsWithLessons: number;
  conceptsLackingLessons: number;
  estimatedMinutes: number;
  unseenMinutes: number;
  coursesCovered: CourseCoverage[];
  shallowModules: { moduleId: string; courseId: string; conceptCount: number; withLessons: number }[];
}

export function computeCoverage(
  catalog: Catalog,
  progress: Record<string, ConceptProgress> = {},
): CurriculumCoverage {
  const activeConcepts = catalog.concepts.filter((c) => !isRetiredSeededCategory(c.category));
  const lessonConceptIds = new Set(catalog.lessons.map((l) => l.conceptId));
  const coursesCovered: CourseCoverage[] = catalog.courses.map((course) => {
    const ids = course.modules.flatMap((m) => m.conceptIds);
    const concepts = ids.map((id) => catalog.conceptMap[id]).filter(Boolean);
    const withLessons = concepts.filter((c) => lessonConceptIds.has(c.id)).length;
    const estimatedMinutes = concepts.reduce((sum, c) => sum + (c.estimatedMinutes ?? 10), 0);
    const unseenMinutes = concepts
      .filter((c) => !progress[c.id]?.encountered)
      .reduce((sum, c) => sum + (c.estimatedMinutes ?? 10), 0);
    return {
      courseId: course.id,
      title: course.title,
      categoryId: course.categoryId,
      conceptCount: concepts.length,
      withLessons,
      lackingLessons: Math.max(0, concepts.length - withLessons),
      coveragePct: concepts.length ? Math.round((withLessons / concepts.length) * 100) : 0,
      estimatedMinutes: course.estimatedMinutes ?? estimatedMinutes,
      unseenMinutes,
      shallow: concepts.length > 0 && withLessons / concepts.length < 0.15,
    };
  });

  const shallowModules = catalog.courses.flatMap((course) =>
    course.modules
      .map((mod) => {
        const withLessons = mod.conceptIds.filter((id) => lessonConceptIds.has(id)).length;
        return { moduleId: mod.id, courseId: course.id, conceptCount: mod.conceptIds.length, withLessons };
      })
      .filter((row) => row.conceptCount >= 3 && row.withLessons === 0),
  );

  const estimatedMinutes = activeConcepts.reduce((sum, c) => sum + (c.estimatedMinutes ?? 10), 0);
  const unseenMinutes = activeConcepts
    .filter((c) => !progress[c.id]?.encountered)
    .reduce((sum, c) => sum + (c.estimatedMinutes ?? 10), 0);

  const activeCategories = new Set(catalog.courses.map((c) => c.categoryId));

  return {
    subjects: activeCategories.size,
    courses: catalog.courses.length,
    modules: catalog.courses.reduce((sum, c) => sum + c.modules.length, 0),
    concepts: catalog.concepts.length,
    activeConcepts: activeConcepts.length,
    conceptsWithLessons: activeConcepts.filter((c) => lessonConceptIds.has(c.id)).length,
    conceptsLackingLessons: activeConcepts.filter((c) => !lessonConceptIds.has(c.id)).length,
    estimatedMinutes,
    unseenMinutes,
    coursesCovered,
    shallowModules,
  };
}
