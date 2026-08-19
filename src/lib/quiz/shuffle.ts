import type { QuizQuestion } from "@/lib/learning/types";

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

/**
 * Application-owned presentation order. The model is not trusted to pick
 * answerIndex. Reshuffles the last item if a quiz would otherwise be all B.
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
  if (recentPositions.length >= 3) {
    const last = recentPositions.slice(-3);
    const dominated = last.every((i) => i === last[0]);
    if (dominated && presented[0].answerIndex === last[0]) {
      presented[0] = shuffleQuestion(quiz[0], rng);
    }
  }
  return presented;
}

export function recordPositions(quiz: QuizQuestion[], previous: number[] = [], keep = 12): number[] {
  return [...previous, ...quiz.map((q) => q.answerIndex)].slice(-keep);
}
