import { normalizeLesson } from "@/lib/learning/normalize";
import type { Lesson } from "@/lib/learning/types";
import { CONCEPT_MAP } from "../concepts";
import { lessonFileSchema } from "../schema";
import { CPU_SEMI_LESSONS } from "./cpu-semi";
import { SYSTEMS_LESSONS } from "./systems";
import { SCIENCE_LESSONS } from "./science";
import { CULTURE_LESSONS } from "./culture";
import { GPU_LESSONS } from "./gpu";
import { LONGFORM_LESSONS } from "./longform";

const externalFiles = import.meta.glob("../external/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

function loadExternal(): Lesson[] {
  const out: Lesson[] = [];
  for (const [path, raw] of Object.entries(externalFiles)) {
    const parsed = lessonFileSchema.safeParse(raw);
    if (!parsed.success) {
      console.warn(`[dau] skipped ${path}:`, parsed.error.issues[0]?.message);
      continue;
    }
    try {
      out.push(normalizeLesson(parsed.data as unknown as Lesson, "imported"));
    } catch (err) {
      console.warn(`[dau] skipped ${path}:`, err);
    }
  }
  return out;
}

export const LESSONS: Lesson[] = [
  ...CPU_SEMI_LESSONS,
  ...GPU_LESSONS,
  ...SYSTEMS_LESSONS,
  ...SCIENCE_LESSONS,
  ...CULTURE_LESSONS,
  ...LONGFORM_LESSONS,
  ...loadExternal(),
];

const byId = new Map(LESSONS.map((l) => [l.id, l]));

export function getLesson(id: string): Lesson | undefined {
  return byId.get(id);
}

export function lessonsForConcept(conceptId: string): Lesson[] {
  return LESSONS.filter((l) => l.conceptId === conceptId);
}

export function validateCatalog(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const lesson of LESSONS) {
    if (ids.has(lesson.id)) errors.push(`duplicate lesson id ${lesson.id}`);
    ids.add(lesson.id);
    if (!CONCEPT_MAP[lesson.conceptId]) {
      errors.push(`${lesson.id}: missing concept ${lesson.conceptId}`);
    }
    for (const pre of lesson.prerequisites) {
      if (!CONCEPT_MAP[pre]) errors.push(`${lesson.id}: missing prereq ${pre}`);
    }
    if (lesson.goDeeper && !CONCEPT_MAP[lesson.goDeeper]) {
      errors.push(`${lesson.id}: missing goDeeper ${lesson.goDeeper}`);
    }
    if (lesson.quiz.length !== 3) errors.push(`${lesson.id}: quiz must have 3 questions`);
  }
  return errors;
}
