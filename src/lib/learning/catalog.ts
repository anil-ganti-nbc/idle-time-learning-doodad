import { applyActiveVersion, normalizeLesson } from "./normalize";
import type { Catalog, Category, Concept, Course, Lesson } from "./types";

export function buildCatalog(
  seededCategories: Category[],
  seededConcepts: Concept[],
  seededLessons: Lesson[],
  customCategories: Category[] = [],
  customConcepts: Concept[] = [],
  customLessons: Lesson[] = [],
  seededCourses: Course[] = [],
  customCourses: Course[] = [],
): Catalog {
  const categories = mergeById(seededCategories, customCategories);
  const concepts = mergeById(seededConcepts, customConcepts);
  const courses = mergeById(seededCourses, customCourses);
  const overlay = new Map(customLessons.filter((l) => !l.archived).map((l) => [l.id, l]));
  const lessons: Lesson[] = [];
  const seen = new Set<string>();

  for (const raw of seededLessons) {
    const custom = overlay.get(raw.id);
    const base = custom ? overlayLesson(raw, custom) : normalizeSeed(raw);
    lessons.push(applyActiveVersion(base));
    seen.add(raw.id);
  }
  for (const custom of customLessons) {
    if (custom.archived || seen.has(custom.id)) continue;
    lessons.push(applyActiveVersion(normalizeLesson(custom, custom.source?.type ?? "human")));
    seen.add(custom.id);
  }

  return {
    categories,
    concepts,
    lessons,
    courses,
    categoryMap: Object.fromEntries(categories.map((c) => [c.id, c])),
    conceptMap: Object.fromEntries(concepts.map((c) => [c.id, c])),
    lessonMap: Object.fromEntries(lessons.map((l) => [l.id, l])),
    courseMap: Object.fromEntries(courses.map((c) => [c.id, c])),
  };
}

function normalizeSeed(lesson: Lesson): Lesson {
  try {
    return normalizeLesson(lesson, lesson.source?.type ?? "seed");
  } catch {
    return lesson;
  }
}

function overlayLesson(seed: Lesson, custom: Lesson): Lesson {
  return {
    ...normalizeSeed(seed),
    ...normalizeLesson(custom, custom.source?.type ?? seed.source?.type ?? "human"),
    id: seed.id,
    versions: custom.versions ?? seed.versions,
    feedback: custom.feedback ?? seed.feedback,
  };
}

function mergeById<T extends { id: string }>(seeded: T[], custom: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of seeded) map.set(item.id, item);
  for (const item of custom) map.set(item.id, { ...map.get(item.id), ...item });
  return [...map.values()];
}

export function getLessonFrom(catalog: Catalog, id: string): Lesson | undefined {
  return catalog.lessonMap[id];
}

export function lessonsForConceptFrom(catalog: Catalog, conceptId: string): Lesson[] {
  return catalog.lessons.filter((l) => l.conceptId === conceptId);
}

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "topic";
}

export function makeId(prefix: string, name: string): string {
  const rand = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${slugify(name)}-${rand}`;
}
