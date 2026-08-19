import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assembleQuiz } from "./assemble.ts";
import { validateDraft } from "./draft.ts";
import { d } from "../../content/lesson.ts";

const goodDistractors = [
  d("Latency", "nearby", "Wrong quantity."),
  d("Occupancy", "misapplied", "Later GPU word."),
  d("Coherence", "subtle", "Different problem."),
] as const;

describe("quiz drafts", () => {
  it("accepts a canonical draft and shuffles away from index 0", () => {
    const result = assembleQuiz(
      [1, 2, 3].map((n) => ({
        id: `q${n}`,
        stem: `What moved in case ${n} of the bakery?`,
        correctAnswer: "Throughput as completion rate",
        distractors: goodDistractors,
        correctExplanation: "Throughput is how much work finishes.",
        objectiveIds: ["Distinguish latency from throughput"],
        prerequisiteConceptIds: [],
        difficultyTier: 0 as const,
        cognitiveType: n === 1 ? "recognize" : n === 2 ? "apply" : "identify",
      })),
      () => 0.99,
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    for (const question of result.quiz) {
      assert.equal(question.choices[question.answerIndex], "Throughput as completion rate");
      assert.ok(question.cognitiveType);
      assert.ok((question.objectiveIds ?? []).length > 0);
    }
    assert.ok(new Set(result.quiz.map((q) => q.cognitiveType)).size >= 2);
  });

  it("rejects all-of-the-above and a duplicate correct answer", () => {
    const all = validateDraft({
      id: "q1",
      stem: "Which statement is the mechanism?",
      correctAnswer: "Bypass the result",
      distractors: [
        d("all of the above", "nearby", "Banned form."),
        d("A structural hazard", "subtle", "Different class."),
        d("A cache miss", "reversed", "No value yet."),
      ],
      correctExplanation: "Because forwarding ships an existing value.",
      objectiveIds: [],
      prerequisiteConceptIds: [],
      difficultyTier: 2,
      cognitiveType: "recognize",
    });
    assert.equal(all.ok, false);

    const dup = validateDraft({
      id: "q1",
      stem: "Which statement is the mechanism here?",
      correctAnswer: "Bypass the result",
      distractors: [
        d("Bypass the result", "nearby", "Same words."),
        d("A structural hazard", "subtle", "Different class."),
        d("A cache miss", "reversed", "No value yet."),
      ],
      correctExplanation: "Because forwarding ships an existing value.",
      objectiveIds: [],
      prerequisiteConceptIds: [],
      difficultyTier: 2,
      cognitiveType: "recognize",
    });
    assert.equal(dup.ok, false);
  });

  it("rejects an unknown objective and a future specialist prerequisite", () => {
    const obj = assembleQuiz(
      [1, 2, 3].map((n) => ({
        id: `q${n}`,
        stem: `Why is forwarding used in case ${n}?`,
        correctAnswer: "The value already exists in the pipe",
        distractors: goodDistractors,
        correctExplanation: "Bypass wires cannot invent DRAM data.",
        objectiveIds: ["not-a-real-objective"],
        prerequisiteConceptIds: [],
        difficultyTier: 2 as const,
        cognitiveType: "recognize",
      })),
      { knownObjectiveIds: ["Name the three hazard classes"] },
    );
    assert.equal(obj.ok, false);

    const leak = validateDraft(
      {
        id: "q1",
        stem: "What is a pipeline mainly buying?",
        correctAnswer: "Overlap / throughput",
        distractors: goodDistractors,
        correctExplanation: "Stages stay busy.",
        objectiveIds: [],
        prerequisiteConceptIds: ["gpu-scheduler"],
        difficultyTier: 0,
        cognitiveType: "recognize",
      },
      { allowed: { currentConceptId: "cpu-pipeline", conceptIds: ["cpu-pipeline"], names: [], reasons: {} } },
    );
    assert.equal(leak.ok, false);
    if (!leak.ok) assert.ok(leak.issues.some((i) => /outside allowed/i.test(i)));
  });
});
