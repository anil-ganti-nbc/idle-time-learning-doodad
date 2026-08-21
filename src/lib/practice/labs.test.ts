import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { decodeChudboxPracticeQuery } from "../../../../dau-practice-labs/src/practice-labs/index.ts";

import {
  buildPracticeRequestForLesson,
  launchUrlForLesson,
  practiceLabsForLesson,
  readPracticeLog,
} from "./labs.ts";

const LESSON = {
  id: "dm-riff-cell-10",
  conceptId: "dm-riff-cell",
  title: "Repeat, shift, or mutate",
};

describe("practice labs host integration", () => {
  it("resolves chudbox for riff-construction lessons", () => {
    const labs = practiceLabsForLesson("dm-construction", "dm-riff-cell");
    assert.equal(labs.length, 1);
    assert.equal(labs[0].labId, "chudbox");
    assert.ok(labs[0].launchUrl);
  });

  it("does not resolve labs for out-of-scope subjects", () => {
    // compiler-workbench covers cmp-* and is now launchable.
    assert.deepEqual(
      practiceLabsForLesson("cmp-frontend", "cmp-tokens").map((lab) => lab.labId),
      ["compiler-workbench"],
    );
    // Concept-pattern compatibility holds even without course context.
    assert.deepEqual(
      practiceLabsForLesson(undefined, "mus-notes").map((lab) => lab.labId),
      ["chudbox"],
    );
  });

  it("builds a contract request whose launch URL chudbox can decode", () => {
    const request = buildPracticeRequestForLesson(LESSON);
    assert.equal(request.labId, "chudbox");
    assert.equal(request.conceptId, "dm-riff-cell");
    assert.ok(request.goal.trim().length >= 8, "goal must satisfy chudbox minimum");

    const launch = launchUrlForLesson(LESSON);
    assert.ok(launch.ok, `launch failed: ${launch.message}`);
    assert.ok(launch.url?.includes("?practice="));

    // Round-trip through the lab's own decoder.
    const token = new URL(launch.url!).searchParams.get("practice") ?? "";
    const decoded = decodeChudboxPracticeQuery(token);
    assert.ok(decoded.ok, `round-trip decode failed: ${decoded.ok ? "" : decoded.message}`);
    if (decoded.ok) {
      assert.equal(decoded.data.conceptId, "dm-riff-cell");
      assert.equal(decoded.data.lessonId, "dm-riff-cell-10");
      assert.equal(decoded.data.practiceType, "riff-cell");
    }
  });

  it("rejects lessons whose ids are not valid DAU ids", () => {
    const bad = launchUrlForLesson({ id: "not-a-dau-id", conceptId: "weird", title: "Some title" });
    assert.equal(bad.ok, false);
  });

  it("practice log is empty and safe outside the browser", () => {
    assert.deepEqual(readPracticeLog(), []);
  });
});
