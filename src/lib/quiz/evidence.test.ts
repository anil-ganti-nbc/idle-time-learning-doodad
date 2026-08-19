import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../../content/categories.ts";
import { CONCEPTS } from "../../content/concepts.ts";
import { COURSES } from "../../content/courses/index.ts";
import { GPU_LESSONS } from "../../content/lessons/gpu.ts";
import { ARCH_GPU_LESSONS } from "../../content/lessons/arch-gpu/index.ts";
import { CPU_SEMI_LESSONS } from "../../content/lessons/cpu-semi.ts";
import { buildCatalog } from "../learning/catalog.ts";
import { isConceptUnlocked, makeReadinessContext } from "../learning/readiness.ts";
import { emptyProgress } from "../learning/srs.ts";
import { conceptEvidence, courseReadiness, lessonResult, onePerfectQuizUnlocksSpecialist } from "./evidence.ts";

const catalog = buildCatalog(CATEGORIES, CONCEPTS, [...CPU_SEMI_LESSONS, ...ARCH_GPU_LESSONS, ...GPU_LESSONS], [], [], [], COURSES);

describe("assessment vs mastery", () => {
  it("records a lesson result without claiming course readiness", () => {
    const result = lessonResult({
      lessonId: "arch-latency-throughput-5",
      conceptId: "arch-latency-throughput",
      quizCorrect: 3,
      quizTotal: 3,
      understanding: "got_it",
    });
    assert.equal(result.quizCorrect, 3);
    const ctx = makeReadinessContext(catalog, {
      "arch-latency-throughput": {
        ...emptyProgress("arch-latency-throughput"),
        encountered: true,
        understanding: "got_it",
        lastQuizScore: 1,
        lastQuizTotal: 3,
        timesStudied: 1,
      },
    });
    const occupancy = catalog.conceptMap["gpu-occupancy"];
    const scheduler = catalog.conceptMap["gpu-scheduler"];
    assert.equal(isConceptUnlocked(occupancy, ctx), false);
    assert.equal(isConceptUnlocked(scheduler, ctx), false);
    assert.equal(onePerfectQuizUnlocksSpecialist(ctx.progress["arch-latency-throughput"]), true);
  });

  it("needs repeated evidence before specialist content is ready", () => {
    const once = {
      ...emptyProgress("gpu-warps"),
      encountered: true,
      understanding: "got_it" as const,
      lastQuizScore: 1,
      lastQuizTotal: 3,
      timesStudied: 1,
    };
    assert.equal(onePerfectQuizUnlocksSpecialist(once), true);
    const repeated = { ...once, timesStudied: 3, quizCorrect: 9, quizTotal: 9 };
    assert.equal(onePerfectQuizUnlocksSpecialist(repeated), false);
  });

  it("treats a lapse as weaker evidence", () => {
    const ctx = makeReadinessContext(catalog, {
      "cpu-pipeline": {
        ...emptyProgress("cpu-pipeline"),
        encountered: true,
        understanding: "didnt_get_it",
        lastQuizScore: 0.33,
        lastQuizTotal: 3,
        timesStudied: 2,
        lapseCount: 2,
        quizCorrect: 2,
        quizTotal: 6,
      },
    });
    const ev = conceptEvidence("cpu-pipeline", ctx.progress["cpu-pipeline"], ctx);
    assert.ok(ev.score < 0.5);
    assert.equal(ev.waived, false);
  });

  it("keeps placement waiver distinct from earned encounters", () => {
    const ctx = makeReadinessContext(
      catalog,
      {},
      undefined,
      {
        "cpu-foundations": {
          courseId: "cpu-foundations",
          startedAt: "2026-08-01T00:00:00.000Z",
          lastStudiedAt: "2026-08-01T00:00:00.000Z",
          waivedConceptIds: ["arch-latency-throughput"],
          placement: {
            at: "2026-08-01T00:00:00.000Z",
            recommendedTier: 1,
            waivedConceptIds: ["arch-latency-throughput"],
            evidence: ["arch-latency-throughput:ok"],
            kind: "quiz",
          },
        },
      },
    );
    const ev = conceptEvidence("arch-latency-throughput", undefined, ctx);
    assert.equal(ev.waived, true);
    assert.equal(ev.encounters, 0);
    const gpu = courseReadiness(catalog.courseMap["arch-gpu"], ctx);
    assert.equal(gpu.canOpenSpecialist, false);
    assert.ok(gpu.waivedIds.includes("arch-latency-throughput") === false);
  });

  it("preserves independent course readiness", () => {
    const ctx = makeReadinessContext(
      catalog,
      {
        "os-kernel": {
          ...emptyProgress("os-kernel"),
          encountered: true,
          understanding: "got_it",
          lastQuizScore: 1,
          timesStudied: 2,
        },
      },
      undefined,
      {
        "os-foundations": {
          courseId: "os-foundations",
          startedAt: "2026-07-01T00:00:00.000Z",
          lastStudiedAt: "2026-07-01T00:00:00.000Z",
          waivedConceptIds: ["os-kernel"],
        },
        "cpu-foundations": {
          courseId: "cpu-foundations",
          startedAt: "2026-08-01T00:00:00.000Z",
          lastStudiedAt: "2026-08-01T00:00:00.000Z",
          waivedConceptIds: ["arch-latency-throughput"],
        },
      },
    );
    const os = courseReadiness(catalog.courseMap["os-foundations"], ctx);
    const cpu = courseReadiness(catalog.courseMap["cpu-foundations"], ctx);
    assert.ok(os.waivedIds.includes("os-kernel"));
    assert.ok(cpu.waivedIds.includes("arch-latency-throughput"));
    assert.ok(!os.waivedIds.includes("arch-latency-throughput"));
  });
});
