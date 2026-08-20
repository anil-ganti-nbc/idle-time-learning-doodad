import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COURSES } from "../../content/courses/index.ts";
import { CONCEPTS } from "../../content/concepts.ts";
import { ARCH_GPU_LESSONS } from "../../content/lessons/arch-gpu/index.ts";
import { CPU_FOUNDATIONS_LESSONS } from "../../content/lessons/cpu-foundations/index.ts";
import { CPU_MICROARCH_LESSONS } from "../../content/lessons/cpu-microarch/index.ts";
import { assertAiAllowed } from "../ai/guard.ts";
import { defaultAi, defaultState } from "./defaults.ts";
import { assertImportSize, buildExport, importExport, MAX_IMPORT_BYTES } from "./export.ts";
import { clearLive, getLive, startLive } from "./live.ts";
import { useProgress } from "./progress.ts";
import { loadSecrets, saveSecrets } from "./secrets.ts";
import { emptyProgress } from "./srs.ts";
import { inspectStorage } from "./storage.ts";

describe("platform portability", () => {
  it("imports browser-only modules on the server without throwing", () => {
    assert.equal(typeof window, "undefined");
    assert.equal(inspectStorage().available, false);
    assert.equal(getLive(), null);
    const live = startLive({
      lessonId: "pipe-5",
      startedAt: "2026-08-19T00:00:00.000Z",
      mode: "explore",
      timeBudget: 5,
    });
    assert.equal(getLive()?.lessonId, live.lessonId);
    clearLive();
    assert.equal(getLive(), null);
    saveSecrets({ openai: "sk-should-stay-in-memory" });
    assert.equal(loadSecrets().openai, "sk-should-stay-in-memory");
    assert.ok(useProgress.getState().ai);
    assert.equal(useProgress.getState().ai.enabled, false);
  });

  it("runs the three completed courses with AI off and no keys", () => {
    assert.equal(defaultAi.enabled, false);
    const ids = COURSES.map((c) => c.id);
    assert.ok(ids.includes("cpu-foundations"));
    assert.ok(ids.includes("cpu-microarch"));
    assert.ok(ids.includes("arch-gpu"));
    assert.ok(CPU_FOUNDATIONS_LESSONS.length > 0);
    assert.ok(CPU_MICROARCH_LESSONS.length > 0);
    assert.ok(ARCH_GPU_LESSONS.length > 0);
    assert.ok(CONCEPTS.length > 0);
    const refused = assertAiAllowed(defaultAi, 0, 0);
    assert.equal(refused.ok, false);
    if (!refused.ok) assert.match(refused.error, /disabled/i);
  });

  it("rejects oversized imports and keeps current state", () => {
    assert.equal(assertImportSize(MAX_IMPORT_BYTES).ok, true);
    const tooBig = assertImportSize(MAX_IMPORT_BYTES + 1);
    assert.equal(tooBig.ok, false);
    if (!tooBig.ok) assert.match(tooBig.error, /8 MB/);
  });

  it("round-trips retired-topic history without requiring those fields to be study targets", () => {
    const state = defaultState();
    state.concepts["ast-hr"] = {
      ...emptyProgress("ast-hr"),
      encountered: true,
      understanding: "mostly",
      lastStudiedAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-01T00:00:00.000Z",
      timesStudied: 2,
      nextReviewAt: "2026-07-08T00:00:00.000Z",
    };
    state.sessions = [
      {
        id: "retired-1",
        lessonId: "legacy-hr",
        conceptId: "ast-hr",
        categoryId: "astronomy",
        startedAt: "2026-07-01T00:00:00.000Z",
        completedAt: "2026-07-01T00:06:00.000Z",
        estimatedMinutes: 5,
        actualMinutes: 6,
        quizCorrect: 2,
        quizTotal: 3,
        understanding: "mostly",
        mode: "explore",
        timeBudget: 5,
        sourceType: "seed",
      },
    ];
    const imported = importExport(defaultState(), buildExport(state), "replace");
    assert.equal(imported.state.concepts["ast-hr"].timesStudied, 2);
    assert.equal(imported.state.sessions[0].categoryId, "astronomy");
    assert.equal(imported.state.ai.enabled, false);
  });
});
