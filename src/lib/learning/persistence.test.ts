import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { learningStateIsBrowserLocal, PERSISTENCE, survives } from "./persistence.ts";

describe("persistence contract", () => {
  it("keeps learning state out of PGLite", () => {
    assert.equal(learningStateIsBrowserLocal(), true);
    assert.equal(PERSISTENCE.progress.backend, "localStorage");
    assert.match(PERSISTENCE.pglite.contains.join(" "), /never learning/i);
  });

  it("documents what survives each event", () => {
    const refresh = survives("refresh");
    assert.equal(refresh.progress, true);
    assert.equal(refresh.live, true);

    const restart = survives("browserRestart");
    assert.equal(restart.progress, true);
    assert.equal(restart.secrets, true);
    assert.equal(restart.live, false);

    const server = survives("serverRestart");
    assert.equal(server.progress, true);

    const device = survives("deviceChange");
    assert.equal(device.progress, false);
    assert.equal(device.secrets, false);
    assert.match(device.note, /export/i);
    assert.match(device.note, /not sync/i);
  });
});
