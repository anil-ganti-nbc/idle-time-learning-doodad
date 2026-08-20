import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../categories.ts";
import { CONCEPTS } from "../concepts.ts";
import { COURSES } from "../courses/index.ts";
import { CPU_FOUNDATIONS_LESSONS } from "../lessons/cpu-foundations/index.ts";
import { CPU_SEMI_LESSONS } from "../lessons/cpu-semi.ts";
import { CPU_MICROARCH_LESSONS } from "../lessons/cpu-microarch/index.ts";
import { GPU_LESSONS } from "../lessons/gpu.ts";
import { ARCH_GPU_LESSONS } from "../lessons/arch-gpu/index.ts";
import { buildCatalog } from "../../lib/learning/catalog.ts";
import { quizContextForConcept } from "../../lib/learning/quiz-context.ts";
import { makeReadinessContext } from "../../lib/learning/readiness.ts";
import { emptyProgress } from "../../lib/learning/srs.ts";
import { assembleQuiz } from "../../lib/quiz/assemble.ts";
import { allowedKnowledge } from "../../lib/quiz/knowledge.ts";
import { mixIsDistinct, objectiveCoverage } from "../../lib/quiz/mix.ts";
import { ARCH_REFERENCE_DRAFTS } from "./arch-reference.ts";

const catalog = buildCatalog(CATEGORIES, CONCEPTS, [...CPU_FOUNDATIONS_LESSONS, ...CPU_SEMI_LESSONS, ...CPU_MICROARCH_LESSONS, ...ARCH_GPU_LESSONS, ...GPU_LESSONS], [], [], [], COURSES);

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

describe("CPU/GPU reference quizzes", () => {
  it("upgrades foundation through SIMT lessons with distinct jobs and objectives", () => {
    for (const id of [
      "arch-latency-throughput-10",
      "cpu-pipeline-10",
      "cpu-hazards-5",
      "gpu-simt-10",
      "cpu-renaming-10",
      "cpu-coherency-10",
    ]) {
      const lesson = catalog.lessonMap[id];
      assert.ok(lesson, id);
      assert.equal(mixIsDistinct(lesson.quiz), true, id);
      assert.ok(objectiveCoverage(lesson.quiz).length > 0, id);
      for (const q of lesson.quiz) {
        assert.equal(q.choices.length, 4);
        assert.ok(q.distractors?.length === 3);
        assert.ok(q.cognitiveType);
      }
    }
  });

  it("assembles specialist drafts only when allowed knowledge includes their prerequisites", () => {
    const drafts = ARCH_REFERENCE_DRAFTS["gpu-scheduler"];
    const beginner = assembleQuiz(drafts, {
      allowed: { currentConceptId: "arch-latency-throughput", conceptIds: ["arch-latency-throughput"], names: [], reasons: {} },
      expectedTier: 0,
    });
    assert.equal(beginner.ok, false);

    const ready = assembleQuiz(drafts, {
      allowed: {
        currentConceptId: "gpu-scheduler",
        conceptIds: ["gpu-scheduler", "gpu-occupancy", "gpu-divergence", "gpu-warps"],
        names: [],
        reasons: {},
      },
      expectedTier: 5,
    });
    assert.equal(ready.ok, true);
    if (!ready.ok) return;
    assert.equal(mixIsDistinct(ready.quiz), true);
    assert.ok(objectiveCoverage(ready.quiz).length > 0);
  });

  it("keeps journalist mode from expanding allowed knowledge for a specialist concept", () => {
    const concept = catalog.conceptMap["gpu-scheduler"];
    const ctx = makeReadinessContext(catalog, {});
    const quizCtx = quizContextForConcept(concept, ctx, catalog, { journalist: true });
    assert.ok(!(quizCtx.allowedKnowledge ?? []).some((row) => row.id === "gpu-occupancy"));
    const allowed = allowedKnowledge(catalog, concept, ctx, true);
    assert.deepEqual(allowed.conceptIds, ["gpu-scheduler"]);
  });

  it("lets an advanced quiz integrate only demonstrated prerequisites", () => {
    const concept = catalog.conceptMap["gpu-occupancy"];
    const ctx = makeReadinessContext(catalog, {
      "gpu-warps": held("gpu-warps"),
      "gpu-exec-resources": held("gpu-exec-resources"),
      "gpu-memory-hierarchy": held("gpu-memory-hierarchy"),
    });
    const allowed = allowedKnowledge(catalog, concept, ctx);
    const assembled = assembleQuiz(ARCH_REFERENCE_DRAFTS["gpu-occupancy"], { allowed, expectedTier: 4 });
    assert.equal(assembled.ok, true);
    assert.ok(allowed.conceptIds.includes("gpu-warps"));
    assert.ok(!allowed.conceptIds.includes("gpu-scheduler"));
  });
});
