import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toGenerationLog } from "./attempt.ts";
import { generationsAfterStart } from "../learning/live.ts";
import { generationsToday, isBillableAttempt } from "../learning/accounting.ts";

describe("generation accounting", () => {
  it("counts failed API attempts against the daily limit", () => {
    const now = new Date("2026-08-19T12:00:00.000Z");
    const log = [
      toGenerationLog("lesson", {
        ok: false,
        error: "Generated lesson failed schema validation.",
        billable: true,
        provider: "xai",
        model: "grok-4.5",
      }),
    ];
    log[0].at = now.toISOString();
    assert.equal(isBillableAttempt(log[0]), true);
    assert.equal(generationsToday(log, now), 1);
  });

  it("does not count a cache hit as a billable generation", () => {
    const now = new Date("2026-08-19T12:00:00.000Z");
    const log = [
      toGenerationLog("lesson", {
        ok: true,
        billable: false,
        cached: true,
        provider: "xai",
        model: "grok-4.5",
      }),
    ];
    log[0].at = now.toISOString();
    assert.equal(isBillableAttempt(log[0]), false);
    assert.equal(generationsToday(log, now), 0);
  });

  it("does not count a disabled-guard refusal", () => {
    const entry = toGenerationLog("lesson", {
      ok: false,
      error: "AI is disabled.",
      billable: false,
      provider: "xai",
      model: "grok-4.5",
    });
    assert.equal(isBillableAttempt(entry), false);
  });

  it("treats a legacy successful log without a billable flag as billable", () => {
    assert.equal(isBillableAttempt({ ok: true }), true);
    assert.equal(isBillableAttempt({ ok: false }), false);
  });

  it("records estimated tokens on a failed billable attempt", () => {
    const entry = toGenerationLog("lesson", {
      ok: false,
      error: "malformed JSON",
      billable: true,
      provider: "xai",
      model: "grok-4.5",
      inputTokens: 420,
    });
    assert.equal(entry.billable, true);
    assert.equal(entry.inputTokens, 420);
    assert.equal(isBillableAttempt(entry), true);
  });

  it("starts a generated-lesson gap with one generation consumed", () => {
    assert.equal(generationsAfterStart(true), 1);
    assert.equal(generationsAfterStart(false), 0);
  });
});
