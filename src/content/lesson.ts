import type { Lesson, Provenance, QuizQuestion } from "@/lib/learning/types";

const SOURCE: Provenance = {
  type: "seed",
  provider: "grok",
  author: "Dead Air University",
  schemaVersion: 1,
  promptVersion: "seed-v1",
};

export function q(
  id: string,
  prompt: string,
  choices: [string, string, string, string],
  answerIndex: 0 | 1 | 2 | 3,
  explanation: string,
): QuizQuestion {
  return { id, prompt, choices, answerIndex, explanation };
}

export function L(lesson: Omit<Lesson, "source" | "schemaVersion">): Lesson {
  return { ...lesson, schemaVersion: 1, source: SOURCE };
}
