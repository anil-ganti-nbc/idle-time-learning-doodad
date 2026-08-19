import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { QuizQuestion } from "../learning/types.ts";
import { presentQuiz, recordPositions, shuffleQuestion } from "./shuffle.ts";

function q(id: string, answerIndex: 0 | 1 | 2 | 3 = 1): QuizQuestion {
  return {
    id,
    prompt: `prompt ${id}`,
    choices: ["A-wrong", "B-correct", "C-wrong", "D-wrong"],
    answerIndex,
    explanation: "because",
  };
}

function cycle(seed: number) {
  let n = seed;
  return () => {
    n = (n * 1103515245 + 12345) & 0x7fffffff;
    return n / 0x7fffffff;
  };
}

describe("quiz shuffle", () => {
  it("preserves the correct answer after shuffling", () => {
    const original = q("x", 1);
    const correct = original.choices[original.answerIndex];
    for (let i = 0; i < 40; i++) {
      const shuffled = shuffleQuestion(original, cycle(i + 3));
      assert.equal(shuffled.choices[shuffled.answerIndex], correct);
      assert.deepEqual([...shuffled.choices].sort(), [...original.choices].sort());
    }
  });

  it("does not hard-code option B", () => {
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < 200; i++) {
      const shuffled = shuffleQuestion(q("x", 1), cycle(i + 11));
      counts[shuffled.answerIndex] += 1;
    }
    assert.ok(counts.every((n) => n > 20), `unbalanced ${counts.join(",")}`);
    assert.ok(counts[1] < 120, "still biased toward B");
  });

  it("avoids presenting an entire quiz on the same index", () => {
    let sawSpread = false;
    for (let i = 0; i < 30; i++) {
      const presented = presentQuiz([q("1"), q("2"), q("3")], cycle(i + 21));
      const same = presented.every((item) => item.answerIndex === presented[0].answerIndex);
      if (!same) sawSpread = true;
      for (const item of presented) {
        assert.equal(item.choices[item.answerIndex], "B-correct");
      }
    }
    assert.equal(sawSpread, true);
  });

  it("records recent positions for the next quiz", () => {
    const presented = presentQuiz([q("1", 0), q("2", 2), q("3", 3)], () => 0);
    const next = recordPositions(presented, [1, 1, 1]);
    assert.equal(next.length >= 3, true);
    assert.ok(next.slice(-3).every((n) => n >= 0 && n <= 3));
  });
});
