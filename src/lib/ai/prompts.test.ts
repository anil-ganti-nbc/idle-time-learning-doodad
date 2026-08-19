import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { lesson } from "../learning/fixtures.ts";
import { quizUserPrompt } from "./prompts.ts";

describe("quiz prompts", () => {
  it("passes course, module, prerequisites, and tier into the quiz prompt", () => {
    const text = quizUserPrompt(lesson({ id: "gpu-warps-10", conceptId: "gpu-warps", durationMin: 10 }), {
      courseTitle: "Computer architecture — from pipelines to GPUs",
      moduleTitle: "GPU execution model",
      tier: 3,
      currentConcept: "Warps and wavefronts",
      prerequisites: [{ id: "gpu-simt", name: "SIMT versus SIMD" }],
      demonstrated: [{ id: "gpu-execution-model", name: "Grid, block, thread" }],
      weak: [],
    });
    assert.match(text, /Computer architecture/);
    assert.match(text, /GPU execution model/);
    assert.match(text, /Warps and wavefronts/);
    assert.match(text, /SIMT versus SIMD/);
    assert.match(text, /Grid, block, thread/);
    assert.match(text, /Curriculum tier/);
    assert.match(text, /combine prior concepts|trade-offs|diagnose/i);
  });
});
