import { isRetiredSeededCategory, isSelectableCategory } from "./types";
import type { Catalog, Category, Concept, Course, CourseModule, Lesson, SessionRequest, Tier } from "./types";

export function coursesForCategory(catalog: Catalog, categoryId: string | null | undefined): Course[] {
  if (!categoryId || categoryId === "random") return [];
  return catalog.courses
    .filter((c) => c.categoryId === categoryId)
    .slice()
    .sort((a, b) => (a.orderHint ?? 0) - (b.orderHint ?? 0));
}

export function courseForCategory(catalog: Catalog, categoryId: string | null | undefined): Course | undefined {
  return coursesForCategory(catalog, categoryId)[0];
}

export function courseForConcept(catalog: Catalog, conceptId: string): Course | undefined {
  const concept = catalog.conceptMap[conceptId];
  if (concept?.courseId) return catalog.courseMap[concept.courseId];
  return catalog.courses.find((course) => course.modules.some((m) => m.conceptIds.includes(conceptId)));
}

export function courseForRequest(req: SessionRequest, catalog: Catalog): Course | undefined {
  if (!req.category || req.category === "random") return undefined;
  return courseForCategory(catalog, req.category);
}

export function moduleForConcept(catalog: Catalog, conceptId: string): CourseModule | undefined {
  const course = courseForConcept(catalog, conceptId);
  if (!course) return undefined;
  const concept = catalog.conceptMap[conceptId];
  if (concept?.moduleId) return course.modules.find((m) => m.id === concept.moduleId);
  return course.modules.find((m) => m.conceptIds.includes(conceptId));
}

export function conceptsInCourse(catalog: Catalog, course: Course): Concept[] {
  const ids = new Set(course.modules.flatMap((m) => m.conceptIds));
  return course.modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .flatMap((m) => m.conceptIds.map((id) => catalog.conceptMap[id]))
    .filter((c): c is Concept => Boolean(c && ids.has(c.id)));
}

export function inferTier(concept: Concept | undefined): Tier {
  if (!concept) return 2;
  if (typeof concept.tier === "number") return concept.tier;
  if (concept.level === "intro") return 1;
  if (concept.level === "core") return 2;
  return 4;
}

export function prereqClosure(catalog: Catalog, conceptId: string, seen = new Set<string>()): Set<string> {
  if (seen.has(conceptId)) return seen;
  seen.add(conceptId);
  const concept = catalog.conceptMap[conceptId];
  for (const id of concept?.prerequisites ?? []) prereqClosure(catalog, id, seen);
  return seen;
}

export function lessonsInCourse(catalog: Catalog, course: Course): Lesson[] {
  const ids = new Set(course.modules.flatMap((m) => m.conceptIds));
  return catalog.lessons.filter((l) => ids.has(l.conceptId));
}

export function emptyCourseProgress(courseId: string) {
  return {
    courseId,
    startedAt: null as string | null,
    lastStudiedAt: null as string | null,
    waivedConceptIds: [] as string[],
  };
}

export function selectableCategories(catalog: Catalog): Category[] {
  return catalog.categories.filter((c) => isSelectableCategory(c));
}

export function isCategoryOpenForSelection(
  catalog: Catalog,
  categoryId: string | undefined,
  explicitCategory?: string | null,
): boolean {
  if (!categoryId) return true;
  if (explicitCategory && explicitCategory === categoryId) return true;
  const meta = catalog.categoryMap[categoryId];
  if (meta?.custom) return true;
  if (meta?.status === "retired" || isRetiredSeededCategory(categoryId)) return false;
  return true;
}
