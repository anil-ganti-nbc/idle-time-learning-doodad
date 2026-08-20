import type { CognitiveType, Lesson, Provenance, QuizDistractor, QuizQuestion, Tier } from "@/lib/learning/types";

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
  extra?: Partial<Pick<QuizQuestion, "cognitiveType" | "objectiveIds" | "prerequisiteConceptIds" | "difficultyTier" | "distractors">>,
): QuizQuestion {
  return { id, prompt, choices, answerIndex, explanation, ...extra };
}

export function d(
  text: string,
  kind: QuizDistractor["kind"],
  rationale: string,
): QuizDistractor {
  return { text, kind, rationale };
}

export function item(input: {
  id: string;
  stem: string;
  correct: string;
  distractors: [QuizDistractor, QuizDistractor, QuizDistractor];
  explanation: string;
  cognitiveType: CognitiveType;
  objectiveIds?: string[];
  prerequisiteConceptIds?: string[];
  difficultyTier?: Tier;
}): QuizQuestion {
  return {
    id: input.id,
    prompt: input.stem,
    choices: [input.correct, input.distractors[0].text, input.distractors[1].text, input.distractors[2].text],
    answerIndex: 0,
    explanation: input.explanation,
    distractors: input.distractors,
    cognitiveType: input.cognitiveType,
    objectiveIds: input.objectiveIds,
    prerequisiteConceptIds: input.prerequisiteConceptIds,
    difficultyTier: input.difficultyTier,
  };
}

export function L(lesson: Omit<Lesson, "source" | "schemaVersion">): Lesson {
  return { ...lesson, schemaVersion: 1, source: SOURCE };
}