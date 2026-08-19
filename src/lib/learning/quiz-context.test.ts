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
import { quizContextFor, quizContextForConcept } from "./quiz-context.ts";
import { makeReadinessContext } from "./readiness.ts";
import { emptyProgress } from "./srs.ts";

const catalog = buildCatalog(CATEGORIES, CONCEPTS, [...CPU_FOUNDATIONS_LESSONS, ...CPU_SEMI_LESSONS, ...ARCH_GPU_LESSONS, ...GPU_LESSONS], [], [], [], COURSES);

function held(id: string) {
  return {
    ...emptyProgress(id),
    encountered: true,
    understanding: "got_it" as const,
    lastQuizScore: 1,
    lastQuizCorrect: 3,
    lastQuizTotal: 3,
    quizCorrect: 6,
    quizTotal: 6,
    timesStudied: 2,
  };
}

describe("quiz context", () => {
  it("includes course, module, tier, and objectives for a CPU foundation concept", () => {
    const concept = catalog.conceptMap["arch-latency-throughput"];
    const ctx = quizContextForConcept(concept, makeReadinessContext(catalog, {}), catalog);
    assert.equal(ctx.courseId, "cpu-foundations");
    assert.ok(ctx.courseTitle);
    assert.ok(ctx.moduleId);
    assert.equal(ctx.tier, 0);
    assert.ok((ctx.objectives ?? []).length > 0);
    assert.ok((ctx.allowedKnowledge ?? []).some((row) => row.id === "arch-latency-throughput"));
    assert.ok(!(ctx.allowedKnowledge ?? []).some((row) => row.id === "gpu-scheduler"));
    assert.ok(!(ctx.allowedKnowledge ?? []).some((row) => row.id === "cpu-renaming"));
  });

  it("excludes future concepts and includes demonstrated same-path work", () => {
    const concept = catalog.conceptMap["cpu-hazards"];
    const ctx = quizContextForConcept(
      concept,
      makeReadinessContext(catalog, {
        "cpu-pipeline": held("cpu-pipeline"),
        "arch-latency-throughput": held("arch-latency-throughput"),
      }),
      catalog,
    );
    const ids = (ctx.allowedKnowledge ?? []).map((row) => row.id);
    assert.ok(ids.includes("cpu-pipeline"));
    assert.ok(ids.includes("arch-latency-throughput"));
    assert.ok(!ids.includes("cpu-renaming"));
    assert.ok(!ids.includes("gpu-occupancy"));
  });

  it("does not let journalist mode expand allowed knowledge", () => {
    const concept = catalog.conceptMap["cpu-pipeline"];
    const ready = makeReadinessContext(catalog, {});
    const plain = quizContextForConcept(concept, ready, catalog, { journalist: false });
    const journalist = quizContextForConcept(concept, ready, catalog, { journalist: true });
    assert.deepEqual(
      (plain.allowedKnowledge ?? []).map((r) => r.id),
      (journalist.allowedKnowledge ?? []).map((r) => r.id),
    );
    assert.ok(!(journalist.allowedKnowledge ?? []).some((row) => row.id === "cpu-rob"));
  });

  it("lets an advanced concept use demonstrated cross-course prerequisites", () => {
    const concept = catalog.conceptMap["gpu-why-throughput"];
    const ctx = quizContextForConcept(
      concept,
      makeReadinessContext(catalog, {
        "cpu-pipeline": held("cpu-pipeline"),
        "arch-data-parallel": held("arch-data-parallel"),
      }),
      catalog,
    );
    const ids = (ctx.allowedKnowledge ?? []).map((row) => row.id);
    assert.ok(ids.includes("cpu-pipeline"));
    assert.ok(ids.includes("arch-data-parallel"));
    assert.ok(!ids.includes("gpu-scheduler"));
  });

  it("builds the same contract from a lesson", () => {
    const lesson = catalog.lessonMap["gpu-simt-10"];
    const ctx = quizContextFor(lesson, makeReadinessContext(catalog, {}), catalog);
    assert.equal(ctx.conceptId, "gpu-simt");
    assert.equal(ctx.courseId, "arch-gpu");
    assert.ok(ctx.requestedMix && ctx.requestedMix.length === 3);
  });
});
