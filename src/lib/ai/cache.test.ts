import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cacheKey, findCachedLesson, hashText, type CachedLessonLike } from "./cache.ts";

function aiLesson(partial: Partial<CachedLessonLike> & Pick<CachedLessonLike, "id">): CachedLessonLike {
  return {
    conceptId: "cpu-pipeline",
    durationMin: 10,
    effort: "normal",
    level: "core",
    source: { type: "ai", promptVersion: "dau-lesson-v1" },
    ...partial,
  };
}

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

  it("changes when duration, journalist, adapt, or source hash changes", () => {
    const base = {
      kind: "lesson" as const,
      conceptId: "x",
      durationMin: 5 as const,
      effort: "normal" as const,
      promptVersion: "v1",
    };
    assert.notEqual(cacheKey(base), cacheKey({ ...base, durationMin: 10 }));
    assert.notEqual(cacheKey(base), cacheKey({ ...base, journalist: true }));
    assert.notEqual(cacheKey(base), cacheKey({ ...base, adapt: "harder" }));
    assert.notEqual(cacheKey(base), cacheKey({ ...base, sourceHash: hashText("notes") }));
    assert.notEqual(cacheKey(base), cacheKey({ ...base, kind: "deeper" }));
  });

  it("reuses a stored AI lesson with a matching cache key", () => {
    const key = cacheKey({
      kind: "lesson",
      conceptId: "cpu-pipeline",
      durationMin: 10,
      effort: "normal",
      level: "core",
      journalist: false,
      promptVersion: "dau-lesson-v1",
    });
    const hit = findCachedLesson(
      [aiLesson({ id: "ai-1", source: { type: "ai", promptVersion: "dau-lesson-v1", cacheKey: key } })],
      {
        kind: "lesson",
        conceptId: "cpu-pipeline",
        durationMin: 10,
        effort: "normal",
        level: "core",
        journalist: false,
        promptVersion: "dau-lesson-v1",
      },
    );
    assert.equal(hit?.id, "ai-1");
  });

  it("does not let a journalist lesson satisfy a generic request", () => {
    const journalistKey = cacheKey({
      kind: "lesson",
      conceptId: "cpu-pipeline",
      durationMin: 10,
      effort: "normal",
      level: "journalist",
      journalist: true,
      promptVersion: "dau-lesson-v1",
    });
    const miss = findCachedLesson(
      [
        aiLesson({
          id: "ai-j",
          level: "journalist",
          source: { type: "ai", promptVersion: "dau-lesson-v1", cacheKey: journalistKey },
        }),
      ],
      {
        kind: "lesson",
        conceptId: "cpu-pipeline",
        durationMin: 10,
        effort: "normal",
        level: "core",
        journalist: false,
        promptVersion: "dau-lesson-v1",
      },
    );
    assert.equal(miss, undefined);
  });

  it("does not leak source-grounded output into an ungrounded request", () => {
    const grounded = cacheKey({
      kind: "lesson",
      conceptId: "cpu-pipeline",
      durationMin: 10,
      effort: "normal",
      sourceHash: hashText("EUV resist paper"),
      promptVersion: "dau-lesson-v1",
    });
    const miss = findCachedLesson(
      [aiLesson({ id: "ai-src", source: { type: "ai", promptVersion: "dau-lesson-v1", cacheKey: grounded } })],
      {
        kind: "lesson",
        conceptId: "cpu-pipeline",
        durationMin: 10,
        effort: "normal",
        promptVersion: "dau-lesson-v1",
      },
    );
    assert.equal(miss, undefined);
  });

  it("does not reuse seed lessons or adapted units for a plain lesson", () => {
    const missSeed = findCachedLesson(
      [aiLesson({ id: "seed-1", source: { type: "seed", promptVersion: "dau-lesson-v1" } })],
      {
        kind: "lesson",
        conceptId: "cpu-pipeline",
        durationMin: 10,
        effort: "normal",
        promptVersion: "dau-lesson-v1",
      },
    );
    assert.equal(missSeed, undefined);

    const adaptedKey = cacheKey({
      kind: "lesson",
      conceptId: "cpu-pipeline",
      durationMin: 10,
      effort: "normal",
      adapt: "harder",
      promptVersion: "dau-lesson-v1",
    });
    const missAdapt = findCachedLesson(
      [aiLesson({ id: "ai-h", source: { type: "ai", promptVersion: "dau-lesson-v1", cacheKey: adaptedKey } })],
      {
        kind: "lesson",
        conceptId: "cpu-pipeline",
        durationMin: 10,
        effort: "normal",
        promptVersion: "dau-lesson-v1",
      },
    );
    assert.equal(missAdapt, undefined);
  });

  it("hashes source text", () => {
    assert.equal(hashText("abc"), hashText("abc"));
    assert.notEqual(hashText("abc"), hashText("abd"));
  });
});
