import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyProgress, normalizeProgressRow, quizRatio, reviewQuality, scheduleReviewFull } from "./srs.ts";

describe("quiz ratio", () => {
  it("normalises 0–1", () => {
    assert.equal(quizRatio(0, 3), 0);
    assert.equal(quizRatio(3, 3), 1);
    assert.equal(quizRatio(2, 3), 2 / 3);
    assert.equal(quizRatio(1, 0), 0);
  });

  it("migrates a legacy integer lastQuizScore of 1 as 1/3, not 100%", () => {
    const row = normalizeProgressRow({
      conceptId: "cpu-pipeline",
      lastQuizScore: 1,
    });
    assert.equal(row.lastQuizCorrect, 1);
    assert.equal(row.lastQuizTotal, 3);
    assert.ok(Math.abs((row.lastQuizScore ?? 0) - 1 / 3) < 1e-9);
  });

  it("migrates a perfect legacy count of 3 to ratio 1", () => {
    const row = normalizeProgressRow({
      conceptId: "cpu-pipeline",
      lastQuizScore: 3,
    });
    assert.equal(row.lastQuizScore, 1);
    assert.equal(row.lastQuizCorrect, 3);
  });

  it("trusts lastQuizCorrect when both fields exist", () => {
    const row = normalizeProgressRow({
      conceptId: "x",
      lastQuizScore: 1,
      lastQuizCorrect: 2,
      lastQuizTotal: 3,
    });
    assert.equal(row.lastQuizCorrect, 2);
    assert.ok(Math.abs((row.lastQuizScore ?? 0) - 2 / 3) < 1e-9);
  });
});

describe("scheduleReview", () => {
  const now = new Date("2026-08-19T00:00:00.000Z");

  it("schedules a first solid pass a few days out", () => {
    const next = scheduleReviewFull({
      prev: emptyProgress("x"),
      understanding: "got_it",
      quizCorrect: 3,
      quizTotal: 3,
      now,
    });
    assert.equal(next.intervalDays, 6);
    assert.equal(next.nextReviewAt?.slice(0, 10), "2026-08-25");
  });

  it("keeps a failing review on a short interval", () => {
    const next = scheduleReviewFull({
      prev: emptyProgress("x"),
      understanding: "didnt_get_it",
      quizCorrect: 0,
      quizTotal: 3,
      now,
    });
    assert.equal(next.intervalDays, 1);
    assert.equal(next.nextReviewAt?.slice(0, 10), "2026-08-20");
  });

  it("treats a second lapse more harshly than the first partial fail", () => {
    const first = scheduleReviewFull({
      prev: { ...emptyProgress("x"), intervalDays: 0, lapseCount: 0 },
      understanding: "didnt_get_it",
      quizCorrect: 1,
      quizTotal: 3,
      now,
      lapseCount: 1,
    });
    const repeat = scheduleReviewFull({
      prev: { ...emptyProgress("x"), intervalDays: 6, ease: 2.3, lapseCount: 1 },
      understanding: "didnt_get_it",
      quizCorrect: 1,
      quizTotal: 3,
      now,
      lapseCount: 2,
    });
    assert.equal(repeat.intervalDays, 1);
    assert.ok(repeat.ease <= first.ease);
  });

  it("quality is auditable from quiz + rating", () => {
    assert.equal(reviewQuality("got_it", 3, 3), 5);
    assert.equal(reviewQuality("didnt_get_it", 0, 3), 0);
    assert.ok(reviewQuality("mostly", 2, 3) >= 2);
  });
});
