import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cacheKey, findCachedLesson, hashText } from "./cache.ts";

describe("generation cache", () => {
  it("is stable for the same inputs", () => {
    const a = cacheKey({
      kind: "lesson",
      conceptId: "cpu-pipeline",
      durationMin: 10,
      effort: "normal",
      promptVersion: "dau-lesson-v1",
    });
    const b = cacheKey({
      kind: "lesson",
      conceptId: "cpu-pipeline",
      durationMin: 10,
      effort: "normal",
      promptVersion: "dau-lesson-v1",
    });
    assert.equal(a, b);
  });

  it("changes when duration or prompt version changes", () => {
    const a = cacheKey({ kind: "lesson", conceptId: "x", durationMin: 5, promptVersion: "v1" });
    const b = cacheKey({ kind: "lesson", conceptId: "x", durationMin: 10, promptVersion: "v1" });
    const c = cacheKey({ kind: "lesson", conceptId: "x", durationMin: 5, promptVersion: "v2" });
    assert.notEqual(a, b);
    assert.notEqual(a, c);
  });

  it("reuses a stored AI lesson", () => {
    const hit = findCachedLesson(
      [
        {
          id: "ai-1",
          conceptId: "cpu-pipeline",
          durationMin: 10,
          effort: "normal",
          source: { type: "ai", promptVersion: "dau-lesson-v1" },
        },
      ],
      "cpu-pipeline",
      10,
      "normal",
      "dau-lesson-v1",
    );
    assert.equal(hit?.id, "ai-1");
    const miss = findCachedLesson(
      [
        {
          id: "seed-1",
          conceptId: "cpu-pipeline",
          durationMin: 10,
          effort: "normal",
          source: { type: "seed", promptVersion: "dau-lesson-v1" },
        },
      ],
      "cpu-pipeline",
      10,
      "normal",
      "dau-lesson-v1",
    );
    assert.equal(miss, undefined);
  });

  it("hashes source text", () => {
    assert.equal(hashText("abc"), hashText("abc"));
    assert.notEqual(hashText("abc"), hashText("abd"));
  });
});
