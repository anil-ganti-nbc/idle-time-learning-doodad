import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultState } from "./defaults.ts";
import {
  buildExport,
  importExport,
  isNewer,
  loadRollback,
  memoryStore,
  mergeDefinitions,
  parseExport,
  saveRollback,
  secretExportGuard,
} from "./export.ts";
import { emptyProgress } from "./srs.ts";
import type { SessionRecord } from "./types.ts";

function session(id: string, conceptId: string): SessionRecord {
  return {
    id,
    lessonId: "pipe-5",
    conceptId,
    categoryId: "cpu",
    startedAt: "2026-08-01T10:00:00.000Z",
    completedAt: "2026-08-01T10:06:00.000Z",
    estimatedMinutes: 5,
    actualMinutes: 6,
    quizCorrect: 3,
    quizTotal: 3,
    understanding: "got_it",
    mode: "explore",
    timeBudget: 5,
    sourceType: "seed",
  };
}

describe("export/import", () => {
  it("round-trips v2 state including quiz ratio and lapses", () => {
    const state = defaultState();
    state.profile.displayName = "Anil";
    state.concepts["cpu-pipeline"] = {
      ...emptyProgress("cpu-pipeline"),
      encountered: true,
      understanding: "got_it",
      lastQuizScore: 1,
      lastQuizCorrect: 3,
      lastQuizTotal: 3,
      lastStudiedAt: "2026-08-18T00:00:00.000Z",
      updatedAt: "2026-08-18T00:00:00.000Z",
      timesStudied: 1,
      lapseCount: 2,
    };
    state.sessions = [session("s1", "cpu-pipeline")];
    state.customCategories = [{ id: "custom", name: "Custom", blurb: "mine", custom: true }];
    const bundle = buildExport(state);
    assert.equal(bundle.format, "dead-air-university-export");
    assert.equal(bundle.schema_version, 2);
    assert.equal("secrets" in bundle, false);
    const imported = importExport(defaultState(), bundle, "replace");
    assert.equal(imported.state.profile.displayName, "Anil");
    assert.equal(imported.state.sessions[0].id, "s1");
    assert.equal(imported.state.concepts["cpu-pipeline"].timesStudied, 1);
    assert.equal(imported.state.concepts["cpu-pipeline"].lastQuizScore, 1);
    assert.equal(imported.state.concepts["cpu-pipeline"].lastQuizCorrect, 3);
    assert.equal(imported.state.concepts["cpu-pipeline"].lapseCount, 2);
    assert.equal(imported.state.customCategories[0].id, "custom");
  });

  it("round-trips course progress independently of other courses", () => {
    const state = defaultState();
    state.courses = {
      "arch-gpu": {
        courseId: "arch-gpu",
        startedAt: "2026-08-01T00:00:00.000Z",
        lastStudiedAt: "2026-08-10T00:00:00.000Z",
        waivedConceptIds: ["arch-latency-throughput"],
        placement: {
          at: "2026-08-01T00:00:00.000Z",
          recommendedTier: 1,
          waivedConceptIds: ["arch-latency-throughput"],
          evidence: ["arch-latency-throughput:ok"],
          kind: "quiz",
        },
      },
      "other": {
        courseId: "other",
        startedAt: "2026-07-01T00:00:00.000Z",
        lastStudiedAt: "2026-07-02T00:00:00.000Z",
        waivedConceptIds: ["keep-me"],
      },
    };
    const incoming = defaultState();
    incoming.courses = {
      "arch-gpu": {
        courseId: "arch-gpu",
        startedAt: "2026-08-01T00:00:00.000Z",
        lastStudiedAt: "2026-08-12T00:00:00.000Z",
        waivedConceptIds: ["cpu-pipeline"],
      },
    };
    const merged = importExport(state, buildExport(incoming), "merge");
    assert.ok(merged.state.courses["arch-gpu"].waivedConceptIds.includes("arch-latency-throughput"));
    assert.ok(merged.state.courses["arch-gpu"].waivedConceptIds.includes("cpu-pipeline"));
    assert.equal(merged.state.courses["arch-gpu"].lastStudiedAt, "2026-08-12T00:00:00.000Z");
    assert.deepEqual(merged.state.courses.other.waivedConceptIds, ["keep-me"]);
  });

  it("omits secrets unless asked, and includes them when asked", () => {
    const bare = buildExport(defaultState());
    assert.equal(bare.secrets, undefined);
    const withKeys = buildExport(defaultState(), { openai: "sk-test" }, true);
    assert.equal(withKeys.secrets?.openai, "sk-test");
  });

  it("refuses a key export without explicit confirmation", () => {
    assert.equal(secretExportGuard(false, false).ok, true);
    assert.equal(secretExportGuard(true, false).ok, false);
    assert.equal(secretExportGuard(true, true).ok, true);
  });

  it("rejects a v2 file that is only a format stamp", () => {
    const parsed = parseExport({
      format: "dead-air-university-export",
      schema_version: 2,
    });
    assert.equal(parsed.ok, false);
    if (!parsed.ok) assert.match(parsed.error, /Invalid export/i);
  });

  it("rejects a partial v2 archive missing catalog", () => {
    const bundle = buildExport(defaultState()) as Record<string, unknown>;
    delete bundle.catalog;
    const parsed = parseExport(bundle);
    assert.equal(parsed.ok, false);
    if (!parsed.ok) assert.match(parsed.error, /catalog/i);
  });

  it("rejects a corrupted v2 archive before mutating state", () => {
    const local = defaultState();
    local.profile.displayName = "Keep me";
    const bad = {
      ...buildExport(defaultState()),
      progress: { concepts: "nope", sessions: [], recentCategoryIds: [] },
    };
    assert.throws(() => importExport(local, bad, "replace"), /Invalid export|progress/i);
    assert.equal(local.profile.displayName, "Keep me");
  });

  it("persists a replace-import rollback that can restore prior state", () => {
    const local = defaultState();
    local.profile = { ...local.profile, displayName: "Before" };
    local.concepts.a = { ...emptyProgress("a"), encountered: true, timesStudied: 4 };
    const incoming = defaultState();
    incoming.profile = { ...incoming.profile, displayName: "After" };
    const result = importExport(local, buildExport(incoming), "replace");
    assert.equal(result.state.profile.displayName, "After");
    assert.equal(result.backup.profile.displayName, "Before");

    const store = memoryStore();
    saveRollback(result.backup, store);
    const restored = loadRollback(store);
    assert.ok(restored);
    const rolled = importExport(result.state, restored, "replace");
    assert.equal(rolled.state.profile.displayName, "Before");
    assert.equal(rolled.state.concepts.a.timesStudied, 4);
  });

  it("keeps a conflicting local category without a newer timestamp", () => {
    const warnings: string[] = [];
    const merged = mergeDefinitions(
      [{ id: "cpu", name: "Local CPU", blurb: "mine", updatedAt: "2026-08-19T00:00:00.000Z" }],
      [{ id: "cpu", name: "Imported CPU", blurb: "theirs", updatedAt: "2026-08-01T00:00:00.000Z" }],
      "category",
      ["name", "blurb"],
      warnings,
    );
    assert.equal(merged[0].name, "Local CPU");
    assert.ok(warnings.some((w) => /Kept local category cpu/.test(w)));
  });

  it("keeps local concept when stamps are missing and fields differ", () => {
    const warnings: string[] = [];
    const merged = mergeDefinitions(
      [{ id: "cpu-pipeline", name: "Local", category: "cpu", prerequisites: ["cpu-fetch"], level: "intro", summary: "mine" }],
      [{ id: "cpu-pipeline", name: "Imported", category: "cpu", prerequisites: [], level: "core", summary: "theirs" }],
      "concept",
      ["name", "category", "prerequisites", "level", "summary"],
      warnings,
    );
    assert.equal(merged[0].name, "Local");
    assert.equal(merged[0].level, "intro");
    assert.ok(warnings.some((w) => /Kept local concept cpu-pipeline/.test(w)));
  });

  it("takes a newer incoming category stamp", () => {
    const warnings: string[] = [];
    const merged = mergeDefinitions(
      [{ id: "cpu", name: "Local CPU", blurb: "mine", updatedAt: "2026-08-01T00:00:00.000Z" }],
      [{ id: "cpu", name: "Imported CPU", blurb: "theirs", updatedAt: "2026-08-19T00:00:00.000Z" }],
      "category",
      ["name", "blurb"],
      warnings,
    );
    assert.equal(merged[0].name, "Imported CPU");
    assert.equal(warnings.length, 0);
  });

  it("migrates a legacy integer quiz score on import", () => {
    const incoming = defaultState();
    incoming.concepts.a = {
      ...emptyProgress("a"),
      lastQuizScore: 1,
      lastQuizCorrect: null as unknown as number,
      lastQuizTotal: 0,
      lastStudiedAt: "2026-08-18T00:00:00.000Z",
      updatedAt: "2026-08-18T00:00:00.000Z",
      encountered: true,
    };
    delete (incoming.concepts.a as { lastQuizCorrect?: number | null }).lastQuizCorrect;
    incoming.concepts.a.lastQuizTotal = undefined as unknown as number;
    const bundle = buildExport(incoming);
    bundle.progress.concepts.a = {
      ...bundle.progress.concepts.a,
      lastQuizScore: 1,
      lastQuizCorrect: undefined as unknown as number,
      lastQuizTotal: undefined as unknown as number,
    };
    const result = importExport(defaultState(), bundle, "replace");
    assert.ok(Math.abs((result.state.concepts.a.lastQuizScore ?? 0) - 1 / 3) < 1e-9);
    assert.equal(result.state.concepts.a.lastQuizCorrect, 1);
  });

  it("merge keeps newer local progress", () => {
    const local = defaultState();
    local.concepts.a = {
      ...emptyProgress("a"),
      lastStudiedAt: "2026-08-19T00:00:00.000Z",
      updatedAt: "2026-08-19T00:00:00.000Z",
      timesStudied: 3,
      encountered: true,
    };
    const incoming = defaultState();
    incoming.concepts.a = {
      ...emptyProgress("a"),
      lastStudiedAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-01T00:00:00.000Z",
      timesStudied: 1,
      encountered: true,
    };
    incoming.sessions = [session("old", "a")];
    const result = importExport(local, buildExport(incoming), "merge");
    assert.equal(result.state.concepts.a.timesStudied, 3);
    assert.ok(result.warnings.some((w) => w.includes("newer local")));
    assert.equal(result.state.sessions[0].id, "old");
  });

  it("accepts a v1 file", () => {
    const v1 = {
      settings: { journalistDepth: true, lastTime: 20, lastCategory: null, lastEffort: null, lastMode: "explore" },
      concepts: { x: { ...emptyProgress("x"), encountered: true, lastStudiedAt: "2026-08-10T00:00:00.000Z" } },
      sessions: [session("v1s", "x")],
      recentCategoryIds: ["cpu"],
    };
    const result = importExport(defaultState(), v1, "merge");
    assert.equal(result.state.concepts.x.encountered, true);
    assert.ok(result.warnings.some((w) => /v1/i.test(w)));
  });

  it("isNewer compares stamps", () => {
    assert.equal(isNewer("2026-08-19", "2026-08-01"), true);
    assert.equal(isNewer("2026-08-01", "2026-08-19"), false);
    assert.equal(isNewer(null, "2026-08-19"), false);
  });
});
