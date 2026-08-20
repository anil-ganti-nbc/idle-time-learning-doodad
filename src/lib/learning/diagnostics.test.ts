import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultAi } from "./defaults.ts";
import { buildClientDiagnostics, diagnosticsLeakSecrets } from "./diagnostics.ts";
import { APP_RELEASE, CURRICULUM_VERSION, EXPORT_SCHEMA_VERSION } from "./types.ts";
import { PROGRESS_PERSIST_VERSION } from "./persistence.ts";

describe("client diagnostics", () => {
  it("reports versions, blocked storage, and no-sync without leaking secrets", () => {
    const report = buildClientDiagnostics({
      subjects: 9,
      courses: 27,
      concepts: 80,
      lessons: 200,
      aiEnabled: defaultAi.enabled,
      aiProvider: "openai",
      serverSources: { openai: "none" },
    });
    assert.equal(report.appRelease, APP_RELEASE);
    assert.equal(report.curriculumVersion, CURRICULUM_VERSION);
    assert.equal(report.curriculum.courses, 27);
    assert.equal(report.persistVersion, PROGRESS_PERSIST_VERSION);
    assert.equal(report.exportSchemaVersion, EXPORT_SCHEMA_VERSION);
    assert.equal(report.storage.available, false);
    assert.equal(report.storageMode.includes("memory"), true);
    assert.equal(report.aiEnabled, false);
    assert.equal(report.serverProvider, "none");
    assert.ok(report.notes.some((n) => /not cross-device sync/i.test(n)));
    assert.ok(report.notes.some((n) => /will not survive a reload/i.test(n)));
    assert.equal(diagnosticsLeakSecrets(report, ["sk-secret-value", "XAI_API_KEY=abc"]), false);
    assert.equal(JSON.stringify(report).includes("sk-"), false);
  });

  it("sanitizes unexpected server source labels", () => {
    const report = buildClientDiagnostics({
      subjects: 1,
      courses: 1,
      concepts: 1,
      lessons: 1,
      aiEnabled: true,
      aiProvider: "xai",
      serverSources: { xai: "sk-live-should-not-appear" },
    });
    assert.equal(report.serverProvider, "unknown");
    assert.equal(JSON.stringify(report).includes("sk-live"), false);
  });
});
