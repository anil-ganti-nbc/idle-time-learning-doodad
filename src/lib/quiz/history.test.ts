import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  appendAssessmentItems,
  emptyAssessmentHistory,
  hasSecretFields,
  markLaterPoorRating,
  recentObjectiveIds,
} from "./history.ts";
import type { AssessmentItemRecord } from "../learning/types.ts";

function item(partial: Partial<AssessmentItemRecord> & Pick<AssessmentItemRecord, "questionId">): AssessmentItemRecord {
  return {
    at: "2026-08-19T00:00:00.000Z",
    lessonId: "arch-latency-throughput-5",
    conceptId: "arch-latency-throughput",
    courseId: "cpu-foundations",
    objectiveIds: ["Distinguish latency from throughput"],
    cognitiveType: "recognize",
    difficultyTier: 0,
    answerIndex: 1,
    correct: true,
    generationKind: "seeded",
    promptVersion: "dau-quiz-v3",
    ...partial,
  };
}

describe("assessment history", () => {
  it("appends items and recent positions without model reasoning", () => {
    const next = appendAssessmentItems(emptyAssessmentHistory(), [item({ questionId: "lt1" })], [2]);
    assert.equal(next.items.length, 1);
    assert.deepEqual(next.recentPositions, [2]);
    assert.equal(hasSecretFields(next.items[0]), false);
  });

  it("marks a later poor rating on the most recent items for that concept", () => {
    const hist = appendAssessmentItems(emptyAssessmentHistory(), [
      item({ questionId: "lt1" }),
      item({ questionId: "lt2", cognitiveType: "apply" }),
      item({ questionId: "lt3", cognitiveType: "identify" }),
    ]);
    const marked = markLaterPoorRating(hist, "arch-latency-throughput", "didnt_get_it");
    assert.equal(marked.items.filter((row) => row.laterPoorRating).length, 3);
    const untouched = markLaterPoorRating(hist, "arch-latency-throughput", "got_it");
    assert.equal(untouched.items.some((row) => row.laterPoorRating), false);
  });

  it("exposes recent objectives so later quizzes can vary", () => {
    const hist = appendAssessmentItems(emptyAssessmentHistory(), [
      item({ questionId: "lt1", objectiveIds: ["Distinguish latency from throughput"] }),
    ]);
    assert.ok(recentObjectiveIds(hist, "arch-latency-throughput").includes("Distinguish latency from throughput"));
  });
});
