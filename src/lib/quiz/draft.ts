import {
  COGNITIVE_TYPES,
  TIERS,
  type CognitiveType,
  type QuizDistractor,
  type QuizItemDraft,
  type QuizQuestion,
  type Tier,
} from "@/lib/learning/types";
import { looksJokeOrNonsense, normalize, validateDistractors } from "./distractors";
import { futureOrSpecialistLeak, type AllowedKnowledge } from "./knowledge";
import type { Catalog, Concept } from "@/lib/learning/types";

export interface DraftValidationContext {
  allowed?: AllowedKnowledge;
  catalog?: Catalog;
  concept?: Concept;
  knownObjectiveIds?: string[];
}

export type DraftValidation =
  | { ok: true; draft: QuizItemDraft }
  | { ok: false; issues: string[] };

const ALL_NONE = /^(all|none) of (the above|these|the following)\.?$/i;

export function isCognitiveType(value: unknown): value is CognitiveType {
  return typeof value === "string" && (COGNITIVE_TYPES as readonly string[]).includes(value);
}

export function isTier(value: unknown): value is Tier {
  return typeof value === "number" && (TIERS as readonly number[]).includes(value);
}

export function coerceDraft(raw: unknown): Partial<QuizItemDraft> & { prompt?: string; correct?: string; explanation?: string } {
  const value = (raw ?? {}) as Record<string, unknown>;
  const distractors = Array.isArray(value.distractors)
    ? value.distractors.map((d) => {
        if (typeof d === "string") return { text: d, kind: "subtle" as const, rationale: "" };
        const row = (d ?? {}) as Record<string, unknown>;
        return {
          text: String(row.text ?? ""),
          kind: (row.kind as QuizDistractor["kind"]) ?? "subtle",
          rationale: String(row.rationale ?? ""),
        };
      })
    : [];
  return {
    id: typeof value.id === "string" ? value.id : "",
    stem: String(value.stem ?? value.prompt ?? ""),
    correctAnswer: String(value.correctAnswer ?? value.correct ?? ""),
    distractors: distractors as QuizItemDraft["distractors"],
    correctExplanation: String(value.correctExplanation ?? value.explanation ?? ""),
    objectiveIds: Array.isArray(value.objectiveIds) ? value.objectiveIds.map(String) : [],
    prerequisiteConceptIds: Array.isArray(value.prerequisiteConceptIds)
      ? value.prerequisiteConceptIds.map(String)
      : [],
    difficultyTier: isTier(value.difficultyTier) ? value.difficultyTier : undefined,
    cognitiveType: isCognitiveType(value.cognitiveType) ? value.cognitiveType : undefined,
  };
}

export function validateDraft(raw: unknown, ctx: DraftValidationContext = {}): DraftValidation {
  const coerced = coerceDraft(raw);
  const issues: string[] = [];
  if (!coerced.id?.trim()) issues.push("missing id");
  if (!coerced.stem || coerced.stem.trim().length < 8) issues.push("stem too short");
  if (!coerced.correctAnswer?.trim()) issues.push("missing correct answer");
  if (!coerced.correctExplanation || coerced.correctExplanation.trim().length < 8) {
    issues.push("explanation too short");
  }
  if (looksJokeOrNonsense(coerced.correctAnswer ?? "") || ALL_NONE.test((coerced.correctAnswer ?? "").trim())) {
    issues.push("correct answer is malformed");
  }
  const distractors = (coerced.distractors ?? []) as QuizDistractor[];
  if (distractors.length !== 3) issues.push("need exactly 3 distractors");
  for (const [i, d] of distractors.entries()) {
    if (ALL_NONE.test(d.text.trim())) issues.push(`distractor ${i} is all/none of the above`);
    if (looksJokeOrNonsense(d.text)) issues.push(`distractor ${i} is joke or empty`);
    if (d.text.trim().length < 3) issues.push(`distractor ${i} is too short`);
  }
  const checked = validateDistractors(coerced.correctAnswer ?? "", distractors);
  if (!checked.ok) issues.push(...checked.issues);

  if (ctx.knownObjectiveIds && ctx.knownObjectiveIds.length > 0 && coerced.objectiveIds?.length) {
    for (const id of coerced.objectiveIds) {
      if (!ctx.knownObjectiveIds.includes(id)) issues.push(`unknown objective ${id}`);
    }
  }
  if (ctx.allowed && coerced.prerequisiteConceptIds?.length) {
    if (ctx.catalog && ctx.concept) {
      const leaks = futureOrSpecialistLeak(ctx.catalog, ctx.concept, coerced.prerequisiteConceptIds, ctx.allowed);
      for (const id of leaks) issues.push(`prerequisite ${id} is outside allowed knowledge`);
    } else {
      for (const id of coerced.prerequisiteConceptIds) {
        if (!ctx.allowed.conceptIds.includes(id)) issues.push(`prerequisite ${id} is outside allowed knowledge`);
      }
    }
  }
  if (coerced.cognitiveType && !isCognitiveType(coerced.cognitiveType)) {
    issues.push("unknown cognitive type");
  }

  if (issues.length) return { ok: false, issues };
  const draft: QuizItemDraft = {
    id: coerced.id!,
    stem: coerced.stem!,
    correctAnswer: coerced.correctAnswer!,
    distractors: checked.ok
      ? (checked.distractors as QuizItemDraft["distractors"])
      : (distractors as QuizItemDraft["distractors"]),
    correctExplanation: coerced.correctExplanation!,
    objectiveIds: coerced.objectiveIds ?? [],
    prerequisiteConceptIds: coerced.prerequisiteConceptIds ?? [],
    difficultyTier: coerced.difficultyTier ?? ctx.concept?.tier ?? 2,
    cognitiveType: coerced.cognitiveType,
  };
  return { ok: true, draft };
}

export function draftToQuestion(draft: QuizItemDraft): QuizQuestion {
  return {
    id: draft.id,
    prompt: draft.stem,
    choices: [
      draft.correctAnswer,
      draft.distractors[0].text,
      draft.distractors[1].text,
      draft.distractors[2].text,
    ],
    answerIndex: 0,
    explanation: draft.correctExplanation,
    distractors: [...draft.distractors],
    cognitiveType: draft.cognitiveType,
    objectiveIds: draft.objectiveIds,
    prerequisiteConceptIds: draft.prerequisiteConceptIds,
    difficultyTier: draft.difficultyTier,
  };
}

export function questionFromCanonical(
  id: string,
  stem: string,
  correct: string,
  distractors: [QuizDistractor, QuizDistractor, QuizDistractor],
  explanation: string,
  extra?: Partial<Pick<QuizQuestion, "cognitiveType" | "objectiveIds" | "prerequisiteConceptIds" | "difficultyTier">>,
): QuizQuestion {
  return {
    id,
    prompt: stem,
    choices: [correct, distractors[0].text, distractors[1].text, distractors[2].text],
    answerIndex: 0,
    explanation,
    distractors,
    ...extra,
  };
}

export function stemsLookParaphrased(stems: string[]): boolean {
  if (stems.length < 2) return false;
  const norms = stems.map((s) => normalize(s).slice(0, 48));
  return new Set(norms).size < stems.length;
}
