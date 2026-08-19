import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { lesson } from "../learning/fixtures.ts";
import { quizSystemPrompt, quizUserPrompt } from "./prompts.ts";

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
    assert.match(text, /Allowed prior knowledge/);
    assert.match(text, /do not require anything outside this list/i);
    assert.match(text, /Requested cognitive mix/);
  });

  it("tells the model it does not own answer order or readiness", () => {
    const system = quizSystemPrompt();
    assert.match(system, /Do not decide answer position/i);
    assert.match(system, /Do not include answerIndex/i);
    assert.match(system, /plausible distractors/i);
    assert.match(system, /Do not write jokes/i);
    assert.match(system, /Do not require knowledge outside the allowed list/i);
    assert.match(system, /Do not ask trivia/i);
    assert.match(system, /Do not repeat a lesson sentence verbatim/i);
    assert.match(system, /Do not include readiness, mastery, or placement/i);
  });
});
