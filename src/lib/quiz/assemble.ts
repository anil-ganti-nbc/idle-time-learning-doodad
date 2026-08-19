import type { CognitiveType, QuizQuestion, Tier } from "@/lib/learning/types";
import { draftToQuestion, stemsLookParaphrased, validateDraft, type DraftValidationContext } from "./draft";
import { looksJokeOrNonsense, validateDistractors, itemFromLegacy, type GeneratedQuizItem } from "./distractors";
import { defaultCognitiveForSlot } from "./kinds";
import { mixIsDistinct } from "./mix";
import { presentQuiz } from "./shuffle";

export type AssembleResult =
  | { ok: true; quiz: [QuizQuestion, QuizQuestion, QuizQuestion]; issues: string[] }
  | { ok: false; error: string; issues: string[] };

export interface AssembleOptions extends DraftValidationContext {
  rng?: () => number;
  recentPositions?: number[];
  shuffle?: boolean;
  expectedTier?: Tier;
}

function asGenerated(raw: GeneratedQuizItem | QuizQuestion | Record<string, unknown>): GeneratedQuizItem | QuizQuestion {
  return raw as GeneratedQuizItem | QuizQuestion;
}

export function assembleQuiz(
  raw: Array<GeneratedQuizItem | QuizQuestion | Record<string, unknown>>,
  rngOrOpts: (() => number) | AssembleOptions = Math.random,
): AssembleResult {
  const opts: AssembleOptions = typeof rngOrOpts === "function" ? { rng: rngOrOpts } : rngOrOpts;
  const rng = opts.rng ?? Math.random;
  if (raw.length !== 3) {
    return { ok: false, error: "Quiz must contain exactly three questions.", issues: ["count"] };
  }
  const issues: string[] = [];
  const built: QuizQuestion[] = [];
  for (const [index, entry] of raw.entries()) {
    const draftCheck = validateDraft(entry, opts);
    if (draftCheck.ok) {
      const question = draftToQuestion(draftCheck.draft);
      if (!question.cognitiveType) question.cognitiveType = defaultCognitiveForSlot(opts.expectedTier ?? 2, index);
      built.push(question);
      continue;
    }

    const item = asGenerated(entry);
    if ("stem" in (entry as object) || "correctAnswer" in (entry as object)) {
      return {
        ok: false,
        error: `Question ${index + 1} failed draft validation.`,
        issues: draftCheck.issues,
      };
    }

    let prompt = "";
    let explanation = "";
    let id = "";
    let correct = "";
    let distractors: { text: string; kind?: string; rationale?: string }[] = [];
    let extra: Partial<QuizQuestion> = {};

    if ("choices" in item && Array.isArray(item.choices) && typeof item.answerIndex === "number") {
      const legacy = itemFromLegacy(item as QuizQuestion);
      id = (item as QuizQuestion).id;
      prompt = (item as QuizQuestion).prompt;
      explanation = (item as QuizQuestion).explanation;
      correct = legacy.correct;
      distractors = legacy.distractors;
      extra = {
        cognitiveType: (item as QuizQuestion).cognitiveType,
        objectiveIds: (item as QuizQuestion).objectiveIds,
        prerequisiteConceptIds: (item as QuizQuestion).prerequisiteConceptIds,
        difficultyTier: (item as QuizQuestion).difficultyTier,
      };
    } else {
      const generated = item as GeneratedQuizItem;
      id = generated.id;
      prompt = generated.prompt;
      explanation = generated.explanation;
      if (generated.correct && generated.distractors?.length) {
        correct = generated.correct;
        distractors = generated.distractors;
      } else if (generated.choices && typeof generated.answerIndex === "number") {
        correct = generated.choices[generated.answerIndex] ?? "";
        distractors = generated.choices
          .filter((_, i) => i !== generated.answerIndex)
          .map((text) => ({ text }));
      }
    }

    if (!prompt.trim() || !correct.trim()) {
      return { ok: false, error: `Question ${index + 1} is missing a stem or correct answer.`, issues: ["missing"] };
    }
    if (looksJokeOrNonsense(correct) || distractors.some((d) => looksJokeOrNonsense(d.text))) {
      return { ok: false, error: `Question ${index + 1} includes a joke or empty option.`, issues: ["nonsense"] };
    }
    const checked = validateDistractors(correct, distractors);
    if (!checked.ok) {
      return { ok: false, error: `Question ${index + 1} failed distractor checks.`, issues: checked.issues };
    }
    built.push({
      id: id || `q${index + 1}`,
      prompt,
      choices: [correct, ...checked.distractors.map((d) => d.text)] as [string, string, string, string],
      answerIndex: 0,
      explanation,
      distractors: checked.distractors.map((d) => ({
        text: d.text,
        kind:
          d.kind === "misconception" ||
          d.kind === "nearby" ||
          d.kind === "reversed" ||
          d.kind === "misapplied" ||
          d.kind === "subtle"
            ? d.kind
            : "subtle",
        rationale: d.rationale ?? "",
      })),
      cognitiveType: extra.cognitiveType ?? defaultCognitiveForSlot(opts.expectedTier ?? 2, index),
      objectiveIds: extra.objectiveIds,
      prerequisiteConceptIds: extra.prerequisiteConceptIds,
      difficultyTier: extra.difficultyTier ?? opts.expectedTier,
    });
    if (!checked.distractors.every((d) => d.kind && d.rationale)) {
      issues.push(`question ${index + 1} missing some distractor rationales`);
    }
    if (draftCheck.issues.includes("unknown objective") || draftCheck.issues.some((i) => i.startsWith("unknown objective"))) {
      return { ok: false, error: `Question ${index + 1} references an unknown objective.`, issues: draftCheck.issues };
    }
    if (draftCheck.issues.some((i) => i.includes("outside allowed knowledge"))) {
      return { ok: false, error: `Question ${index + 1} requires knowledge outside the allowed set.`, issues: draftCheck.issues };
    }
  }

  if (stemsLookParaphrased(built.map((q) => q.prompt))) {
    issues.push("stems look paraphrased");
  }
  if (!mixIsDistinct(built)) {
    issues.push("cognitive mix is not distinct");
  }

  const presented = opts.shuffle === false ? built : presentQuiz(built, rng, opts.recentPositions ?? []);
  return {
    ok: true,
    quiz: [presented[0], presented[1], presented[2]],
    issues,
  };
}

export function assignedRoles(quiz: QuizQuestion[]): Array<CognitiveType | undefined> {
  return quiz.map((q) => q.cognitiveType);
}
