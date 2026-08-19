import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseGeneratedLesson } from "./parse.ts";
import { assertAiAllowed, assertMissingOnly, assertNoProgressFields, stripProgressFields } from "./guard.ts";
import type { AiSettings } from "../learning/types.ts";

const on: AiSettings = {
  enabled: true,
  provider: "xai",
  model: "grok-4.5",
  policy: "manual",
  maxPerDay: 2,
  maxPerSession: 1,
};

describe("AI guards", () => {
  it("refuses when disabled", () => {
    const r = assertAiAllowed({ ...on, enabled: false }, 0, 0);
    assert.equal(r.ok, false);
  });

  it("refuses when policy is off", () => {
    const r = assertAiAllowed({ ...on, policy: "off" }, 0, 0);
    assert.equal(r.ok, false);
  });

  it("enforces daily and session caps", () => {
    assert.equal(assertAiAllowed(on, 2, 0).ok, false);
    assert.equal(assertAiAllowed(on, 0, 1).ok, false);
    assert.equal(assertAiAllowed(on, 0, 0).ok, true);
  });

  it("missing-only blocks when a local lesson exists", () => {
    assert.equal(assertMissingOnly("missing-only", true).ok, false);
    assert.equal(assertMissingOnly("missing-only", false).ok, true);
    assert.equal(assertMissingOnly("manual", true).ok, true);
  });

  it("strips nested mastery fields", () => {
    const cleaned = stripProgressFields({
      title: "ok",
      mastery: "strong",
      meta: { progress: { a: 1 }, ease: 2 },
      quiz: [{ prompt: "q", understanding: "got_it" }],
    });
    assert.equal(cleaned.title, "ok");
    assert.equal("mastery" in cleaned, false);
    assert.equal("progress" in cleaned.meta, false);
    assert.equal("ease" in cleaned.meta, false);
    assert.equal("understanding" in cleaned.quiz[0], false);
  });

  it("rejects nested progress fields instead of silently accepting them", () => {
    const leak = assertNoProgressFields({
      title: "Pipelines",
      meta: { nextReviewAt: "2026-08-20", lapseCount: 2 },
    });
    assert.equal(leak.ok, false);
    if (!leak.ok) assert.match(leak.error, /nextReviewAt|lapseCount/);
  });

  it("parseGeneratedLesson rejects a nested mastery leak even if the rest is valid-looking", () => {
    const parsed = parseGeneratedLesson({
      concept_id: "cpu-pipeline",
      title: "The factory line",
      category: "cpu",
      estimated_minutes: 10,
      effort: "normal",
      prerequisites: [],
      explanation: ["A pipeline overlaps stages of instruction execution so the factory keeps moving."],
      example: "While instruction N writes back, N+1 can execute and N+2 can decode.",
      why_it_matters: "Throughput is why CPUs look busy even when each instruction still takes many cycles.",
      quiz: [
        {
          id: "q1",
          prompt: "Why pipeline?",
          choices: ["a", "b", "c", "d"],
          answerIndex: 1,
          explanation: "overlap",
        },
        {
          id: "q2",
          prompt: "What stalls?",
          choices: ["a", "b", "c", "d"],
          answerIndex: 0,
          explanation: "hazards",
        },
        {
          id: "q3",
          prompt: "What is latency?",
          choices: ["a", "b", "c", "d"],
          answerIndex: 2,
          explanation: "per instruction",
        },
      ],
      extra: { mastery: "strong", ease: 2.8 },
    });
    assert.equal(parsed.ok, false);
    if (!parsed.ok) assert.match(parsed.error, /mastery|ease|forbidden/i);
  });

  it("rejects readiness, placement, and waiver fields from the model", () => {
    for (const leak of [
      { readiness: 0.9 },
      { courseProgress: { waived: true } },
      { waivedConceptIds: ["gpu-scheduler"] },
      { placement: { recommendedTier: 5 } },
      { recommendedTier: 4 },
    ]) {
      const result = assertNoProgressFields(leak);
      assert.equal(result.ok, false, JSON.stringify(leak));
    }
  });
});
