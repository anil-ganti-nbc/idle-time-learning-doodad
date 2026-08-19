import { DISTRACTOR_KINDS, type DistractorKind, type QuizQuestion } from "@/lib/learning/types";

export interface GeneratedDistractor {
  text: string;
  kind?: string;
  rationale?: string;
}

export interface GeneratedQuizItem {
  id: string;
  prompt: string;
  correct?: string;
  choices?: string[];
  answerIndex?: number;
  distractors?: GeneratedDistractor[];
  explanation: string;
}

export function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

export function isPlausibleKind(kind: string | undefined): kind is DistractorKind {
  return Boolean(kind && (DISTRACTOR_KINDS as readonly string[]).includes(kind));
}

/**
 * Catch sentence-versus-paragraph tells. Short noun-phrase options
 * next to a one-line correct answer are a normal MCQ shape.
 */
export function lengthReveal(correct: string, option: string): boolean {
  const a = correct.trim().length;
  const b = option.trim().length;
  const shorter = Math.min(a, b);
  const longer = Math.max(a, b);
  if (shorter < 16) return false;
  return longer > shorter * 4 || (longer > shorter * 2.8 && longer - shorter > 80);
}

export function validateDistractors(
  correct: string,
  distractors: GeneratedDistractor[],
): { ok: true; distractors: GeneratedDistractor[] } | { ok: false; issues: string[] } {
  const issues: string[] = [];
  if (distractors.length !== 3) issues.push("need exactly 3 distractors");
  const seen = new Set<string>([normalize(correct)]);
  for (const [i, d] of distractors.entries()) {
    const text = d.text?.trim() ?? "";
    if (!text) {
      issues.push(`distractor ${i} is empty`);
      continue;
    }
    const key = normalize(text);
    if (key === normalize(correct)) issues.push(`distractor ${i} duplicates the correct answer`);
    if (seen.has(key) && key !== normalize(correct)) issues.push(`distractor ${i} duplicates another option`);
    seen.add(key);
    if (lengthReveal(correct, text)) issues.push(`distractor ${i} length reveals the answer`);
    if (d.kind && !isPlausibleKind(d.kind)) issues.push(`distractor ${i} has an unknown kind`);
  }
  if (issues.length) return { ok: false, issues };
  return { ok: true, distractors };
}

export function itemFromLegacy(question: QuizQuestion): { correct: string; distractors: GeneratedDistractor[] } {
  const correct = question.choices[question.answerIndex];
  const distractors = question.choices
    .filter((_, i) => i !== question.answerIndex)
    .map((text, i) => ({
      text,
      kind: question.distractors?.[i]?.kind,
      rationale: question.distractors?.[i]?.rationale,
    }));
  return { correct, distractors };
}

const JOKE = /\b(lol|lmao|jk|just kidding|foo bar|asdf|placeholder)\b/i;
const ALL_NONE = /^(all|none) of (the above|these|the following)\.?$/i;

export function looksJokeOrNonsense(text: string): boolean {
  const trimmed = text.trim();
  return JOKE.test(trimmed) || trimmed.length < 2 || ALL_NONE.test(trimmed);
}
