import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assembleQuiz } from "./assemble.ts";

const distractors = [
  { text: "Latency", kind: "nearby" as const, rationale: "Wrong quantity." },
  { text: "Occupancy", kind: "misapplied" as const, rationale: "Later concept." },
  { text: "Coherence", kind: "subtle" as const, rationale: "Different problem." },
];

describe("assembleQuiz", () => {
  it("accepts canonical correct+distractors and shuffles away from index 0", () => {
    const result = assembleQuiz(
      [1, 2, 3].map((n) => ({
        id: `q${n}`,
        prompt: `Why throughput ${n}?`,
        correct: "Completion rate",
        distractors,
        explanation: "Throughput is how much work finishes.",
      })),
      () => 0.99,
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    for (const question of result.quiz) {
      assert.equal(question.choices[question.answerIndex], "Completion rate");
      assert.equal(question.choices.length, 4);
    }
  });

  it("accepts legacy choices+answerIndex", () => {
    const result = assembleQuiz(
      [1, 2, 3].map((n) => ({
        id: `q${n}`,
        prompt: `Legacy ${n}`,
        choices: ["wrong-a", "right", "wrong-c", "wrong-d"],
        answerIndex: 1,
        explanation: "right is right",
      })),
      () => 0.2,
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    for (const question of result.quiz) {
      assert.equal(question.choices[question.answerIndex], "right");
    }
  });

  it("rejects a joke option and a duplicated correct answer", () => {
    const joke = assembleQuiz([
      {
        id: "q1",
        prompt: "Why?",
        correct: "Because",
        distractors: [
          { text: "lol", kind: "nearby" },
          { text: "Maybe", kind: "subtle" },
          { text: "Never", kind: "reversed" },
        ],
        explanation: "no",
      },
      {
        id: "q2",
        prompt: "Why?",
        correct: "Because",
        distractors,
        explanation: "nope this is long enough",
      },
      {
        id: "q3",
        prompt: "Why?",
        correct: "Because",
        distractors,
        explanation: "still no",
      },
    ]);
    assert.equal(joke.ok, false);

    const dup = assembleQuiz([
      {
        id: "q1",
        prompt: "Why?",
        correct: "Because mechanisms",
        distractors: [
          { text: "Because mechanisms", kind: "nearby" },
          { text: "Maybe not", kind: "subtle" },
          { text: "Never that", kind: "reversed" },
        ],
        explanation: "duplicate",
      },
      {
        id: "q2",
        prompt: "Why?",
        correct: "Because mechanisms",
        distractors,
        explanation: "ok",
      },
      {
        id: "q3",
        prompt: "Why?",
        correct: "Because mechanisms",
        distractors,
        explanation: "ok",
      },
    ]);
    assert.equal(dup.ok, false);
  });
});
