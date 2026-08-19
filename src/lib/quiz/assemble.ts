import type { QuizQuestion } from "@/lib/learning/types";
import {
  itemFromLegacy,
  looksJokeOrNonsense,
  validateDistractors,
  type GeneratedQuizItem,
} from "./distractors";
import { presentQuiz } from "./shuffle";

export type AssembleResult =
  | { ok: true; quiz: [QuizQuestion, QuizQuestion, QuizQuestion]; issues: string[] }
  | { ok: false; error: string; issues: string[] };

function asItem(raw: GeneratedQuizItem | QuizQuestion): {
  id: string;
  prompt: string;
  explanation: string;
  correct: string;
  distractors: { text: string; kind?: string; rationale?: string }[];
} {
  if ("choices" in raw && Array.isArray(raw.choices) && typeof raw.answerIndex === "number") {
    const legacy = itemFromLegacy(raw as QuizQuestion);
    return {
      id: raw.id,
      prompt: raw.prompt,
      explanation: raw.explanation,
      correct: legacy.correct,
      distractors: legacy.distractors,
    };
  }
  const item = raw as GeneratedQuizItem;
  if (item.correct && item.distractors?.length) {
    return {
      id: item.id,
      prompt: item.prompt,
      explanation: item.explanation,
      correct: item.correct,
      distractors: item.distractors,
    };
  }
  if (item.choices && typeof item.answerIndex === "number") {
    const correct = item.choices[item.answerIndex] ?? "";
    return {
      id: item.id,
      prompt: item.prompt,
      explanation: item.explanation,
      correct,
      distractors: item.choices.filter((_, i) => i !== item.answerIndex).map((text) => ({ text })),
    };
  }
  return {
    id: item.id,
    prompt: item.prompt,
    explanation: item.explanation,
    correct: item.correct ?? "",
    distractors: item.distractors ?? [],
  };
}

export function assembleQuiz(
  raw: Array<GeneratedQuizItem | QuizQuestion>,
  rng: () => number = Math.random,
): AssembleResult {
  if (raw.length !== 3) {
    return { ok: false, error: "Quiz must contain exactly three questions.", issues: ["count"] };
  }
  const issues: string[] = [];
  const built: QuizQuestion[] = [];
  for (const [index, entry] of raw.entries()) {
    const item = asItem(entry);
    if (!item.prompt.trim() || !item.correct.trim()) {
      return { ok: false, error: `Question ${index + 1} is missing a stem or correct answer.`, issues: ["missing"] };
    }
    if (looksJokeOrNonsense(item.correct) || item.distractors.some((d) => looksJokeOrNonsense(d.text))) {
      return { ok: false, error: `Question ${index + 1} includes a joke or empty option.`, issues: ["nonsense"] };
    }
    const checked = validateDistractors(item.correct, item.distractors);
    if (!checked.ok) {
      return {
        ok: false,
        error: `Question ${index + 1} failed distractor checks.`,
        issues: checked.issues,
      };
    }
    const choices = [item.correct, ...checked.distractors.map((d) => d.text)] as [
      string,
      string,
      string,
      string,
    ];
    built.push({
      id: item.id || `q${index + 1}`,
      prompt: item.prompt,
      choices,
      answerIndex: 0,
      explanation: item.explanation,
      distractors: checked.distractors.map((d) => ({
        text: d.text,
        kind: d.kind === "misconception" || d.kind === "nearby" || d.kind === "reversed" || d.kind === "misapplied" || d.kind === "subtle"
          ? d.kind
          : "subtle",
        rationale: d.rationale ?? "",
      })),
    });
    if (!checked.distractors.every((d) => d.kind)) {
      issues.push(`question ${index + 1} missing some distractor rationales`);
    }
  }
  const presented = presentQuiz(built, rng);
  return {
    ok: true,
    quiz: [presented[0], presented[1], presented[2]],
    issues,
  };
}
