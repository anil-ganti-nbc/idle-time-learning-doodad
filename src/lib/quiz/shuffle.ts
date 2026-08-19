import type { QuizQuestion } from "@/lib/learning/types";

/** Deterministic mulberry32 RNG for tests and reproducible shuffles. */
export function createSeededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function fisherYates<T>(items: T[], rng: () => number = Math.random): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
  }
  return next;
}

export function shuffleQuestion(question: QuizQuestion, rng: () => number = Math.random): QuizQuestion {
  const correct = question.choices[question.answerIndex];
  const pairs = question.choices.map((text, index) => ({ text, index }));
  const shuffled = fisherYates(pairs, rng);
  const answerIndex = shuffled.findIndex((row) => row.index === question.answerIndex);
  return {
    ...question,
    choices: [shuffled[0].text, shuffled[1].text, shuffled[2].text, shuffled[3].text],
    answerIndex: (answerIndex >= 0 ? answerIndex : shuffled.findIndex((row) => row.text === correct)) as
      | 0
      | 1
      | 2
      | 3,
  };
}

function sameIndex(quiz: QuizQuestion[]): boolean {
  return quiz.length > 1 && quiz.every((q) => q.answerIndex === quiz[0].answerIndex);
}

function reshuffleAway(question: QuizQuestion, avoid: number, rng: () => number): QuizQuestion {
  let next = shuffleQuestion(question, rng);
  let guard = 0;
  while (next.answerIndex === avoid && guard < 10) {
    next = shuffleQuestion(question, rng);
    guard += 1;
  }
  return next;
}

/**
 * Application-owned presentation order. The model is not trusted to pick
 * answerIndex. Avoids B/B/B and long-term positional streaks when possible.
 * Does not force A/B/C/D exactly once.
 */
export function presentQuiz(
  quiz: QuizQuestion[],
  rng: () => number = Math.random,
  recentPositions: number[] = [],
): QuizQuestion[] {
  const presented = quiz.map((q) => shuffleQuestion(q, rng));
  let guard = 0;
  while (sameIndex(presented) && guard < 8) {
    presented[presented.length - 1] = shuffleQuestion(quiz[quiz.length - 1], rng);
    guard += 1;
  }
  if (presented.length >= 3) {
    const [a, b, c] = presented;
    if (a.answerIndex === b.answerIndex && b.answerIndex === c.answerIndex) {
      presented[2] = reshuffleAway(quiz[2], a.answerIndex, rng);
    }
  }
  if (recentPositions.length >= 3) {
    const last = recentPositions.slice(-3);
    const dominated = last.every((i) => i === last[0]);
    if (dominated && presented[0].answerIndex === last[0]) {
      presented[0] = reshuffleAway(quiz[0], last[0], rng);
    }
  }
  return presented;
}

export function recordPositions(quiz: QuizQuestion[], previous: number[] = [], keep = 24): number[] {
  return [...previous, ...quiz.map((q) => q.answerIndex)].slice(-keep);
}

export function positionHistogram(positions: number[]): [number, number, number, number] {
  const counts: [number, number, number, number] = [0, 0, 0, 0];
  for (const p of positions) {
    if (p >= 0 && p <= 3) counts[p] += 1;
  }
  return counts;
}
