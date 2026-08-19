import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCatalog } from "./catalog.ts";
import { testCatalog, lesson } from "./fixtures.ts";
import {
  missingConceptForGeneration,
  pickFromScored,
  recencyPenalty,
  scoreMissingConcept,
  selectLesson,
} from "./select.ts";
import { emptyProgress } from "./srs.ts";
import type { ConceptProgress, SessionRequest } from "./types.ts";

const catalog = testCatalog();

function req(partial: Partial<SessionRequest> = {}): SessionRequest {
  return {
    minutes: 10,
    category: null,
    effort: null,
    mode: "explore",
    journalistDepth: false,
    ...partial,
  };
}

describe("selectLesson", () => {
  it("fits the time budget", () => {
    const picked = selectLesson(req({ minutes: 5, category: "cpu" }), {}, [], catalog);
    assert.ok(picked);
    assert.ok(picked.lesson.durationMin <= 5);
  });

  it("gates on prerequisites", () => {
    const picked = selectLesson(req({ minutes: 10, category: "cpu", mode: "explore" }), {}, [], catalog);
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "cpu-pipeline");
  });

  it("explore prefers unseen ready units", () => {
    const progress: Record<string, ConceptProgress> = {
      "cpu-pipeline": {
        ...emptyProgress("cpu-pipeline"),
        encountered: true,
        understanding: "got_it",
        lastQuizScore: 1,
        lastQuizCorrect: 3,
        lastQuizTotal: 3,
        timesStudied: 1,
      },
    };
    const picked = selectLesson(req({ minutes: 10, category: "cpu" }), progress, [], catalog);
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "cpu-hazards");
  });

  it("reinforce prefers due reviews", () => {
    const progress: Record<string, ConceptProgress> = {
      "cpu-pipeline": {
        ...emptyProgress("cpu-pipeline"),
        encountered: true,
        understanding: "got_it",
        lastQuizScore: 1,
        lastQuizCorrect: 3,
        lastQuizTotal: 3,
        timesStudied: 2,
        nextReviewAt: "2020-01-01T00:00:00.000Z",
      },
    };
    const picked = selectLesson(req({ minutes: 10, category: "cpu", mode: "reinforce" }), progress, [], catalog);
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "cpu-pipeline");
    assert.match(picked.reason, /review/i);
  });

  it("surprise leaves recently studied categories", () => {
    const picked = selectLesson(req({ minutes: 5, mode: "surprise" }), {}, ["cpu"], catalog);
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "os-process");
  });

  it("recency penalty demotes a just-studied concept", () => {
    const now = new Date("2026-08-19T12:00:00.000Z");
    const progress: Record<string, ConceptProgress> = {
      "cpu-pipeline": {
        ...emptyProgress("cpu-pipeline"),
        encountered: true,
        lastStudiedAt: "2026-08-19T11:50:00.000Z",
        lastQuizScore: 1,
        lastQuizCorrect: 3,
        lastQuizTotal: 3,
        timesStudied: 1,
        understanding: "got_it",
      },
    };
    const picked = selectLesson(
      req({ minutes: 5, mode: "explore" }),
      progress,
      [],
      catalog,
      undefined,
      { now, rng: () => 0 },
    );
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "os-process");
    assert.ok(recencyPenalty(progress["cpu-pipeline"], now) >= 8);
  });
});

describe("weighted / top-N selection", () => {
  it("takes a decisive leader without rolling the dice", () => {
    const picked = pickFromScored(
      [
        { item: "a", score: 10 },
        { item: "b", score: 5 },
        { item: "c", score: 4 },
      ],
      () => 0.99,
    );
    assert.equal(picked, "a");
  });

  it("varies among near-ties according to the rng", () => {
    const scored = [
      { item: "a", score: 6 },
      { item: "b", score: 6 },
      { item: "c", score: 5.5 },
    ];
    assert.equal(pickFromScored(scored, () => 0), "a");
    const late = pickFromScored(scored, () => 0.99);
    assert.ok(late === "b" || late === "c");
  });
});

describe("missingConceptForGeneration", () => {
  const gapCatalog = buildCatalog(
    [
      { id: "cpu", name: "CPU", blurb: "chips" },
      { id: "os", name: "OS", blurb: "kernels" },
    ],
    [
      { id: "cpu-pipeline", name: "Pipelines", category: "cpu", prerequisites: [], level: "intro", summary: "s" },
      {
        id: "cpu-ooo",
        name: "Out of order",
        category: "cpu",
        parentId: "cpu-pipeline",
        prerequisites: ["cpu-pipeline"],
        level: "core",
        summary: "s",
      },
      { id: "os-sched", name: "Scheduling", category: "os", prerequisites: [], level: "intro", summary: "s" },
    ],
    [lesson({ id: "pipe-5", conceptId: "cpu-pipeline", durationMin: 5, level: "intro", title: "Factory" })],
  );

  it("does not pick the first array entry when another concept scores higher", () => {
    const progress = {
      "cpu-pipeline": {
        ...emptyProgress("cpu-pipeline"),
        encountered: true,
        understanding: "got_it" as const,
        lastQuizScore: 1,
        lastQuizCorrect: 3,
        lastQuizTotal: 3,
        timesStudied: 2,
      },
    };
    const profile = {
      displayName: "",
      preferredTopics: ["cpu"],
      knownConceptIds: [],
      avoidTopics: [],
      customInterests: [],
    };
    const missing = missingConceptForGeneration(
      req({ minutes: 10 }),
      progress,
      ["os"],
      gapCatalog,
      profile,
      { rng: () => 0 },
    );
    assert.ok(missing);
    assert.equal(missing.conceptId, "cpu-ooo");
    const ooo = scoreMissingConcept(
      gapCatalog.conceptMap["cpu-ooo"],
      req({ minutes: 10 }),
      progress,
      ["os"],
      gapCatalog,
      profile,
    );
    const sched = scoreMissingConcept(
      gapCatalog.conceptMap["os-sched"],
      req({ minutes: 10 }),
      progress,
      ["os"],
      gapCatalog,
      profile,
    );
    assert.ok(ooo > sched);
  });
});
