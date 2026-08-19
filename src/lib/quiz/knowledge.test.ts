import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../../content/categories.ts";
import { CONCEPTS } from "../../content/concepts.ts";
import { COURSES } from "../../content/courses/index.ts";
import { CPU_FOUNDATIONS_LESSONS } from "../../content/lessons/cpu-foundations/index.ts";
import { GPU_LESSONS } from "../../content/lessons/gpu.ts";
import { ARCH_GPU_LESSONS } from "../../content/lessons/arch-gpu/index.ts";
import { CPU_SEMI_LESSONS } from "../../content/lessons/cpu-semi.ts";
import { buildCatalog } from "../learning/catalog.ts";
import { makeReadinessContext } from "../learning/readiness.ts";
import { emptyProgress } from "../learning/srs.ts";
import { allowedKnowledge, futureOrSpecialistLeak } from "./knowledge.ts";

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

describe("allowed knowledge", () => {
  it("gives a new learner only the current concept", () => {
    const concept = catalog.conceptMap["arch-latency-throughput"];
    const allowed = allowedKnowledge(catalog, concept, makeReadinessContext(catalog, {}));
    assert.deepEqual(allowed.conceptIds, ["arch-latency-throughput"]);
  });

  it("includes demonstrated prerequisites and same-course completed work", () => {
    const concept = catalog.conceptMap["gpu-simt"];
    const ctx = makeReadinessContext(catalog, {
      "gpu-why-throughput": held("gpu-why-throughput"),
      "gpu-execution-model": held("gpu-execution-model"),
      "arch-data-parallel": held("arch-data-parallel"),
      "cpu-pipeline": held("cpu-pipeline"),
    });
    const allowed = allowedKnowledge(catalog, concept, ctx);
    assert.ok(allowed.conceptIds.includes("gpu-simt"));
    assert.ok(allowed.conceptIds.includes("gpu-execution-model"));
    assert.ok(!allowed.conceptIds.includes("gpu-occupancy"));
    assert.ok(!allowed.conceptIds.includes("gpu-scheduler"));
  });

  it("does not expand when journalist depth is on", () => {
    const concept = catalog.conceptMap["gpu-warps"];
    const ctx = makeReadinessContext(catalog, {});
    const plain = allowedKnowledge(catalog, concept, ctx, false);
    const journalist = allowedKnowledge(catalog, concept, ctx, true);
    assert.deepEqual(plain.conceptIds, journalist.conceptIds);
    assert.ok(!journalist.conceptIds.includes("gpu-scheduler"));
  });

  it("flags a foundation item that names a specialist concept", () => {
    const concept = catalog.conceptMap["arch-latency-throughput"];
    const allowed = allowedKnowledge(catalog, concept, makeReadinessContext(catalog, {}));
    const leaks = futureOrSpecialistLeak(catalog, concept, ["gpu-scheduler"], allowed);
    assert.ok(leaks.includes("gpu-scheduler"));
  });

  it("allows a demonstrated cross-course prerequisite", () => {
    const concept = catalog.conceptMap["gpu-why-throughput"];
    const ctx = makeReadinessContext(catalog, {
      "cpu-pipeline": held("cpu-pipeline"),
      "arch-data-parallel": held("arch-data-parallel"),
    });
    const allowed = allowedKnowledge(catalog, concept, ctx);
    assert.ok(allowed.conceptIds.includes("cpu-pipeline"));
    assert.equal(allowed.reasons["cpu-pipeline"] === "prerequisite" || allowed.reasons["cpu-pipeline"] === "cross-course" || allowed.reasons["cpu-pipeline"] === "demonstrated-path", true);
  });
});
