import { useMemo } from "react";
import { CATEGORIES } from "@/content/categories";
import { CONCEPTS } from "@/content/concepts";
import { COURSES } from "@/content/courses";
import { LESSONS } from "@/content/lessons";
import { buildCatalog } from "./catalog";
import { useProgress } from "./progress";
import type { Catalog, Lesson } from "./types";

export function useCatalog(): Catalog {
  const customCategories = useProgress((s) => s.customCategories);
  const customConcepts = useProgress((s) => s.customConcepts);
  const customLessons = useProgress((s) => s.customLessons);
  const customCourses = useProgress((s) => s.customCourses);
  return useMemo(
    () =>
      buildCatalog(
        CATEGORIES,
        CONCEPTS,
        LESSONS,
        customCategories,
        customConcepts,
        customLessons,
        COURSES,
        customCourses,
      ),
    [customCategories, customConcepts, customLessons, customCourses],
  );
}

export function useLesson(id: string): Lesson | undefined {
  const catalog = useCatalog();
  return catalog.lessonMap[id];
}

export function seededCatalog(): Catalog {
  return buildCatalog(CATEGORIES, CONCEPTS, LESSONS, [], [], [], COURSES);
}