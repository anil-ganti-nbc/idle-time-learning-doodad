import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { QuizQuestion } from "../learning/types.ts";
import { createSeededRng, presentQuiz, recordPositions, shuffleQuestion } from "./shuffle.ts";

function q(id: string, answerIndex: 0 | 1 | 2 | 3 = 1): QuizQuestion {
  return {
    id,
    prompt: `prompt ${id}`,
    choices: ["A-wrong", "B-correct", "C-wrong", "D-wrong"],
    answerIndex,
    explanation: "because",
  };
}

describe("quiz shuffle", () => {
  it("preserves the correct answer after shuffling", () => {
    const original = q("x", 1);
    const correct = original.choices[original.answerIndex];
    for (let i = 0; i < 40; i++) {
      const shuffled = shuffleQuestion(original, createSeededRng(i + 3));
      assert.equal(shuffled.choices[shuffled.answerIndex], correct);
      assert.deepEqual([...shuffled.choices].sort(), [...original.choices].sort());
    }
  });

  it("does not hard-code option B", () => {
    const counts = [0, 0, 0, 0];
    const rng = createSeededRng(11);
    for (let i = 0; i < 200; i++) {
      const shuffled = shuffleQuestion(q("x", 1), rng);
      counts[shuffled.answerIndex] += 1;
    }
    assert.ok(counts.every((n) => n > 20), `unbalanced ${counts.join(",")}`);
    assert.ok(counts[1] < 120, "still biased toward B");
  });

  it("avoids presenting an entire quiz on the same index", () => {
    let sawSpread = false;
    for (let i = 0; i < 30; i++) {
      const presented = presentQuiz([q("1"), q("2"), q("3")], createSeededRng(i + 21));
      const same = presented.every((item) => item.answerIndex === presented[0].answerIndex);
      if (!same) sawSpread = true;
      for (const item of presented) {
        assert.equal(item.choices[item.answerIndex], "B-correct");
      }
    }
    assert.equal(sawSpread, true);
  });

  it("balances positions across many seeded quizzes", () => {
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < 120; i++) {
      const presented = presentQuiz([q("1"), q("2"), q("3")], createSeededRng(i + 101));
      for (const item of presented) counts[item.answerIndex] += 1;
    }
    assert.ok(counts.every((n) => n > 40), `unbalanced ${counts.join(",")}`);
    assert.ok(counts[1] < counts.reduce((a, b) => a + b, 0) * 0.4, "still B-heavy");
  });

  it("makes the same seed produce the same presentation", () => {
    const a = presentQuiz([q("1"), q("2"), q("3")], createSeededRng(42));
    const b = presentQuiz([q("1"), q("2"), q("3")], createSeededRng(42));
    assert.deepEqual(
      a.map((item) => item.answerIndex),
      b.map((item) => item.answerIndex),
    );
    assert.deepEqual(a.map((item) => item.choices), b.map((item) => item.choices));
    const positions = recordPositions(a);
    assert.equal(positions.length, 3);
  });

  it("breaks a recent B/B/B streak when it can", () => {
    const presented = presentQuiz([q("1"), q("2"), q("3")], createSeededRng(7), [1, 1, 1]);
    assert.ok(presented.some((item) => item.answerIndex !== 1) || presented[0].answerIndex !== 1);
  });
});
