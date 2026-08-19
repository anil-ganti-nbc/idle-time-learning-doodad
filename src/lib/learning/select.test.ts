import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { testCatalog } from "./fixtures.ts";
import { selectLesson } from "./select.ts";
import { emptyProgress } from "./srs.ts";
import type { ConceptProgress, SessionRequest } from "./types.ts";

const catalog = testCatalog();

function req(partial: Partial<SessionRequest> = {}): SessionRequest {
  return {
    minutes: 10,
    category: null,
    effort: null,
    mode: "explore",
    journalistDepth: false,
    ...partial,
  };
}

describe("selectLesson", () => {
  it("fits the time budget", () => {
    const picked = selectLesson(req({ minutes: 5, category: "cpu" }), {}, [], catalog);
    assert.ok(picked);
    assert.ok(picked.lesson.durationMin <= 5);
  });

  it("gates on prerequisites", () => {
    const picked = selectLesson(req({ minutes: 10, category: "cpu", mode: "explore" }), {}, [], catalog);
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "cpu-pipeline");
  });

  it("explore prefers unseen ready units", () => {
    const progress: Record<string, ConceptProgress> = {
      "cpu-pipeline": {
        ...emptyProgress("cpu-pipeline"),
        encountered: true,
        understanding: "got_it",
        lastQuizScore: 3,
        timesStudied: 1,
      },
    };
    const picked = selectLesson(req({ minutes: 10, category: "cpu" }), progress, [], catalog);
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "cpu-hazards");
  });

  it("reinforce prefers due reviews", () => {
    const progress: Record<string, ConceptProgress> = {
      "cpu-pipeline": {
        ...emptyProgress("cpu-pipeline"),
        encountered: true,
        understanding: "got_it",
        lastQuizScore: 3,
        timesStudied: 2,
        nextReviewAt: "2020-01-01T00:00:00.000Z",
      },
    };
    const picked = selectLesson(req({ minutes: 10, category: "cpu", mode: "reinforce" }), progress, [], catalog);
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "cpu-pipeline");
    assert.match(picked.reason, /review/i);
  });

  it("surprise leaves recently studied categories", () => {
    const picked = selectLesson(req({ minutes: 5, mode: "surprise" }), {}, ["cpu"], catalog);
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "os-process");
  });
});
