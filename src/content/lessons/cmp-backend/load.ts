import { lessonModuleFileSchema } from "@/content/schema";
import { normalizeLesson } from "@/lib/learning/normalize";
import type { Lesson, Provenance } from "@/lib/learning/types";
import { assembleQuiz } from "@/lib/quiz/assemble";

const LINKS = [
  "https://web.stanford.edu/class/cs143/",
  "https://gitlab.com/x86-psABIs/x86-64-ABI",
];

function provenance(courseId: string, moduleId: string, conceptId: string, extra?: Provenance): Provenance {
  return {
    type: "seed",
    provider: "grok",
    author: "Dead Air University",
    schemaVersion: 1,
    promptVersion: "dau-quiz-v3",
    generatedAt: extra?.generatedAt ?? "2026-08-20T06:00:00.000Z",
    links: extra?.links ?? LINKS,
    notes:
      extra?.notes ??
      `${courseId} / ${moduleId} / ${conceptId} · curriculumVersion 1 · informed by Stanford CS143, the System V AMD64 ABI, and the JVM Specification; course prose not copied.`,
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
