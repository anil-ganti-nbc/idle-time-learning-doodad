import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyProgress } from "./srs.ts";
import { conceptState } from "./state.ts";

describe("conceptState", () => {
  it("is unseen until studied", () => {
    assert.equal(conceptState(undefined), "unseen");
    assert.equal(conceptState(emptyProgress("x")), "unseen");
  });

  it("treats profile-known concepts as understood without a session", () => {
    assert.equal(conceptState(undefined, true), "understood");
  });

  it("marks due before other labels", () => {
    const p = {
      ...emptyProgress("x"),
      encountered: true,
      understanding: "got_it" as const,
      lastQuizScore: 3,
      timesStudied: 4,
      intervalDays: 20,
      nextReviewAt: "2020-01-01T00:00:00.000Z",
    };
    assert.equal(conceptState(p, false, new Date("2026-08-19")), "due");
  });

  it("detects shaky vs strong", () => {
    const shaky = {
      ...emptyProgress("x"),
      encountered: true,
      understanding: "didnt_get_it" as const,
      lastQuizScore: 0,
      timesStudied: 2,
      nextReviewAt: "2099-01-01T00:00:00.000Z",
    };
    assert.equal(conceptState(shaky, false, new Date("2026-08-19")), "shaky");

    const strong = {
      ...emptyProgress("x"),
      encountered: true,
      understanding: "got_it" as const,
      lastQuizScore: 3,
      timesStudied: 4,
      intervalDays: 21,
      nextReviewAt: "2099-01-01T00:00:00.000Z",
    };
    assert.equal(conceptState(strong, false, new Date("2026-08-19")), "strong");
  });
});
