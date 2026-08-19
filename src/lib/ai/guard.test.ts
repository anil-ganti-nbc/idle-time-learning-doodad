import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertAiAllowed, assertMissingOnly, stripProgressFields } from "./guard.ts";
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

  it("strips mastery fields from model objects", () => {
    const cleaned = stripProgressFields({
      title: "ok",
      mastery: "strong",
      progress: { a: 1 },
      ease: 2,
    });
    assert.equal(cleaned.title, "ok");
    assert.equal("mastery" in cleaned, false);
    assert.equal("ease" in cleaned, false);
  });
});
