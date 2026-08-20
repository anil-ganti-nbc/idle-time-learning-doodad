import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mixIsDistinct, objectiveCoverage, plannedMix } from "./mix.ts";
import type { QuizQuestion } from "../learning/types.ts";

function q(id: string, cognitiveType?: QuizQuestion["cognitiveType"], objectiveIds?: string[]): QuizQuestion {
  return {
    id,
    prompt: `prompt ${id} long enough`,
    choices: ["a", "b", "c", "d"],
    answerIndex: 0,
    explanation: "because the mechanism says so",
    cognitiveType,
    objectiveIds,
  };
}

describe("question mix", () => {
  it("gives foundation a simple third job, not forced integration", () => {
    assert.deepEqual(plannedMix(0), ["recognize", "apply", "identify"]);
    assert.ok(!plannedMix(1).includes("integrate"));
  });

  it("asks advanced quizzes to integrate rather than recall three times", () => {
    const mix = plannedMix(5);
    assert.ok(mix.includes("integrate"));
    assert.ok(mix.includes("diagnose") || mix.includes("tradeoff"));
    assert.ok(!mix.includes("recognize"));
  });

  it("treats three identical cognitive types as a bad mix", () => {
    assert.equal(mixIsDistinct([q("1", "recognize"), q("2", "recognize"), q("3", "recognize")]), false);
    assert.equal(mixIsDistinct([q("1", "recognize"), q("2", "apply"), q("3", "identify")]), true);
  });

  it("collects non-empty objective coverage", () => {
    const covered = objectiveCoverage([
      q("1", "recognize", ["Distinguish latency from throughput"]),
      q("2", "apply", ["Distinguish latency from throughput"]),
      q("3", "identify", ["Explain why raising clock or width can move one without the other"]),
    ]);
    assert.ok(covered.length >= 2);
  });
});
