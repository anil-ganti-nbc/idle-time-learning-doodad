import type { Catalog, Concept, Course } from "@/lib/learning/types";
import { assembleManifest } from "./assemble";
import { MANIFESTS } from "./data/registry";
import { RETIRED_CONCEPTS } from "./retired";
import { courseManifestSchema } from "./schema";
import { assertCurriculumHealthy } from "./validate";

function loadSeededCurriculum(): { courses: Course[]; concepts: Concept[] } {
  const courses: Course[] = [];
  const concepts: Concept[] = [];
  for (const raw of MANIFESTS) {
    const manifest = courseManifestSchema.parse(raw);
    const assembled = assembleManifest(manifest);
    courses.push(assembled.course);
    concepts.push(...assembled.concepts);
  }
  return { courses, concepts };
}

const seeded = loadSeededCurriculum();

export const SEEDED_COURSES: Course[] = seeded.courses;
export const SEEDED_CONCEPTS: Concept[] = seeded.concepts;
export const CONCEPTS: Concept[] = [...seeded.concepts, ...RETIRED_CONCEPTS];

export const COURSE_MAP: Record<string, Course> = Object.fromEntries(
  SEEDED_COURSES.map((c) => [c.id, c]),
);
export const CONCEPT_MAP: Record<string, Concept> = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));

export function assertSeededCurriculum(catalog: Catalog): void {
  assertCurriculumHealthy(catalog);
}
