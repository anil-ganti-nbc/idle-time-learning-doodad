import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../../content/categories.ts";
import { CONCEPTS } from "../../content/concepts.ts";
import { COURSES } from "../../content/courses/index.ts";
import { CPU_FOUNDATIONS_LESSONS } from "../../content/lessons/cpu-foundations/index.ts";
import { CPU_SEMI_LESSONS } from "../../content/lessons/cpu-semi.ts";
import { GPU_LESSONS } from "../../content/lessons/gpu.ts";
import { ARCH_GPU_LESSONS } from "../../content/lessons/arch-gpu/index.ts";
import { buildCatalog } from "./catalog.ts";
import {
  evidenceScore,
  frontierConcepts,
  isConceptUnlocked,
  isDemonstrated,
  isLessonUnlocked,
  makeReadinessContext,
} from "./readiness.ts";
import { emptyProgress } from "./srs.ts";
import type { ConceptProgress } from "./types.ts";

const catalog = buildCatalog(CATEGORIES, CONCEPTS, [...CPU_FOUNDATIONS_LESSONS, ...CPU_SEMI_LESSONS, ...ARCH_GPU_LESSONS, ...GPU_LESSONS], [], [], [], COURSES);
const gpuCourse = catalog.courseMap["arch-gpu"];
const foundations = catalog.courseMap["cpu-foundations"];

function held(id: string, extra: Partial<ConceptProgress> = {}): ConceptProgress {
  return {
    ...emptyProgress(id),
    encountered: true,
    understanding: "got_it",
    lastQuizScore: 1,
    lastQuizCorrect: 3,
    lastQuizTotal: 3,
    quizCorrect: 6,
    quizTotal: 6,
    timesStudied: 2,
    ...extra,
  };
}

function oneShot(id: string): ConceptProgress {
  return held(id, { timesStudied: 1, quizCorrect: 3, quizTotal: 3 });
}

describe("readiness", () => {
  it("scores a clean repeated pass highly and a lapse lower", () => {
    const clean = held("cpu-pipeline");
    const lapse = held("cpu-pipeline", { lapseCount: 3, lastQuizScore: 0.33, understanding: "mostly" });
    assert.ok(evidenceScore(clean) > 0.75);
    assert.ok(evidenceScore(lapse) < evidenceScore(clean));
  });

  it("does not treat a single perfect quiz as specialist evidence", () => {
    const ctx = makeReadinessContext(catalog, { "gpu-occupancy": oneShot("gpu-occupancy") });
    assert.equal(isDemonstrated("gpu-occupancy", ctx, 5), false);
    assert.equal(isDemonstrated("gpu-occupancy", ctx, 2), true);
  });

  it("keeps advanced GPU concepts locked for a new learner", () => {
    const ctx = makeReadinessContext(catalog, {});
    assert.equal(isConceptUnlocked(catalog.conceptMap["arch-latency-throughput"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-warps"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-scheduler"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-occupancy"], ctx), false);
    const next = frontierConcepts(foundations, ctx).map((c) => c.id);
    assert.deepEqual(next.slice(0, 1), ["arch-latency-throughput"]);
    assert.ok(!frontierConcepts(gpuCourse, ctx).some((c) => c.id === "gpu-scheduler"));
    assert.equal(frontierConcepts(gpuCourse, ctx).length, 0);
  });

  it("does not let journalist depth bypass conceptual prerequisites", () => {
    const ctx = makeReadinessContext(catalog, {});
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-simt"], ctx), false);
    assert.equal(isLessonUnlocked(catalog.lessonMap["gpu-warps-10"], ctx), false);
    assert.equal(isLessonUnlocked(catalog.lessonMap["arch-latency-throughput-10"], ctx), true);
  });

  it("implicitly waives foundation ancestors of a later demonstrated concept", () => {
    const ctx = makeReadinessContext(catalog, { "cpu-pipeline": held("cpu-pipeline") });
    assert.equal(isDemonstrated("arch-latency-throughput", ctx, 1), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cpu-pipeline"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cpu-hazards"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-warps"], ctx), false);
  });

  it("unlocks a core GPU unit only after the spine that actually feeds it", () => {
    const ctx = makeReadinessContext(catalog, {
      "arch-latency-throughput": held("arch-latency-throughput"),
      "arch-data-parallel": held("arch-data-parallel"),
      "cpu-pipeline": held("cpu-pipeline"),
      "cpu-hazards": held("cpu-hazards"),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-why-throughput"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-occupancy"], ctx), false);
  });

  it("keeps already-started units available for review", () => {
    const ctx = makeReadinessContext(catalog, {
      "gpu-warps": {
        ...emptyProgress("gpu-warps"),
        encountered: true,
        understanding: "mostly",
        lastQuizScore: 0.67,
        timesStudied: 1,
      },
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-warps"], ctx), true);
  });
});
