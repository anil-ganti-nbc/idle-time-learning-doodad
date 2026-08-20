import { lessonModuleFileSchema } from "@/content/schema";
import { normalizeLesson } from "@/lib/learning/normalize";
import type { Lesson, Provenance } from "@/lib/learning/types";
import { assembleQuiz } from "@/lib/quiz/assemble";

const LINKS = [
  "https://www.asml.com/en/products/euv-lithography-systems",
  "https://www.asml.com/en/products/euv-lithography-systems/twinscan-exe-5000",
  "https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors",
  "https://www.imec-int.com/en/articles/entering-nanosheet-transistor-era-0",
  "https://www.imec-int.com/en/articles/how-power-chips-backside",
];

function provenance(courseId: string, moduleId: string, conceptId: string, extra?: Provenance): Provenance {
  return {
    type: "seed",
    provider: "grok",
    author: "Dead Air University",
    schemaVersion: 1,
    promptVersion: "dau-quiz-v3",
    generatedAt: extra?.generatedAt ?? "2026-08-19T23:50:00.000Z",
    links: extra?.links ?? LINKS,
    notes:
      extra?.notes ??
      `${courseId} / ${moduleId} / ${conceptId} · curriculumVersion 1 · informed by ASML High-NA / EUV notes and imec device and backside-power articles; course prose not copied.`,
  };
}

export function loadModuleLessons(raw: unknown): Lesson[] {
  const parsed = lessonModuleFileSchema.parse(raw);
  return parsed.lessons.map((entry) => {
    const assembled = assembleQuiz(entry.quiz, { shuffle: false });
    if (!assembled.ok) {
      throw new Error(`${entry.id}: ${assembled.error} (${assembled.issues.join("; ")})`);
    }
    return normalizeLesson(
      {
        schemaVersion: 1,
        id: entry.id,
        conceptId: entry.conceptId,
        title: entry.title,
        durationMin: entry.durationMin,
        effort: entry.effort,
        level: entry.level,
        prerequisites: entry.prerequisites,
        goDeeper: entry.goDeeper,
        diagram: entry.diagram ?? undefined,
        explanation: entry.explanation,
        example: entry.example,
        whyItMatters: entry.whyItMatters,
        quiz: assembled.quiz,
        source: provenance(parsed.courseId, parsed.moduleId, entry.conceptId, entry.source as Provenance | undefined),
      },
      "seed",
    );
  });
}
