import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyProgress } from "./srs.ts";

/**
 * Contract: only recordSession (quiz + rating) may write mastery.
 * Applying an AI lesson is an upsert of catalog data.
 */
function applyGeneratedLesson(
  catalog: { customLessons: { id: string }[] },
  progress: Record<string, ReturnType<typeof emptyProgress>>,
  lesson: { id: string; conceptId: string },
) {
  return {
    customLessons: [...catalog.customLessons, lesson],
    progress,
  };
}

describe("AI cannot rewrite mastery", () => {
  it("upserting a generated lesson leaves progress untouched", () => {
    const progress = { "cpu-pipeline": emptyProgress("cpu-pipeline") };
    const before = structuredClone(progress);
    const next = applyGeneratedLesson({ customLessons: [] }, progress, {
      id: "ai-1",
      conceptId: "cpu-pipeline",
    });
    assert.deepEqual(next.progress, before);
    assert.equal(next.customLessons[0].id, "ai-1");
    assert.equal(next.progress["cpu-pipeline"].encountered, false);
    assert.equal(next.progress["cpu-pipeline"].understanding, null);
  });
});
