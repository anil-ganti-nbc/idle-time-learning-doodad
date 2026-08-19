import { lessonModuleFileSchema } from "@/content/schema";
import { normalizeLesson } from "@/lib/learning/normalize";
import type { Lesson, Provenance } from "@/lib/learning/types";
import { assembleQuiz } from "@/lib/quiz/assemble";

const LINKS = [
  "https://ocw.mit.edu/courses/6-1810-operating-system-engineering-fall-2023/pages/syllabus/",
  "https://pdos.csail.mit.edu/6.1810/2025/xv6.html",
];

function provenance(courseId: string, moduleId: string, conceptId: string, extra?: Provenance): Provenance {
  return {
    type: "seed",
    provider: "grok",
    author: "Dead Air University",
    schemaVersion: 1,
    promptVersion: "dau-quiz-v3",
    generatedAt: extra?.generatedAt ?? "2026-08-20T00:10:00.000Z",
    links: extra?.links ?? LINKS,
    notes:
      extra?.notes ??
      `${courseId} / ${moduleId} / ${conceptId} · curriculumVersion 1 · informed by MIT 6.1810 and the xv6 book; course prose not copied.`,
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
