import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../categories.ts";
import { CONCEPTS } from "../concepts.ts";
import { COURSES } from "../courses/index.ts";
import { CPU_FOUNDATIONS_LESSONS } from "../lessons/cpu-foundations/index.ts";
import { CPU_MICROARCH_LESSONS } from "../lessons/cpu-microarch/index.ts";
import { CPU_SEMI_LESSONS } from "../lessons/cpu-semi.ts";
import { CULTURE_LESSONS } from "../lessons/culture.ts";
import { GPU_LESSONS } from "../lessons/gpu.ts";
import { ARCH_GPU_LESSONS } from "../lessons/arch-gpu/index.ts";
import { SEMI_PROCESS_LESSONS } from "../lessons/semi-process/index.ts";
import { SEMI_LITHO_LESSONS } from "../lessons/semi-litho/index.ts";
import { SEMI_LEADING_LESSONS } from "../lessons/semi-leading/index.ts";
import { OS_FOUNDATIONS_LESSONS } from "../lessons/os-foundations/index.ts";
import { OS_CONCURRENCY_LESSONS } from "../lessons/os-concurrency/index.ts";
import { OS_STORAGE_LESSONS } from "../lessons/os-storage/index.ts";
import { NET_FOUNDATIONS_LESSONS } from "../lessons/net-foundations/index.ts";
import { NET_TRANSPORT_LESSONS } from "../lessons/net-transport/index.ts";
import { NET_INTERNET_LESSONS } from "../lessons/net-internet/index.ts";
import { CMP_FRONTEND_LESSONS } from "../lessons/cmp-frontend/index.ts";
import { CMP_IR_LESSONS } from "../lessons/cmp-ir/index.ts";
import { CMP_BACKEND_LESSONS } from "../lessons/cmp-backend/index.ts";
import { ML_FOUNDATIONS_LESSONS } from "../lessons/ml-foundations/index.ts";
import { ML_NEURAL_LESSONS } from "../lessons/ml-neural/index.ts";
import { ML_TRANSFORMERS_LESSONS } from "../lessons/ml-transformers/index.ts";
import { HORO_FOUNDATIONS_LESSONS } from "../lessons/horo-foundations/index.ts";
import { HORO_REGULATION_LESSONS } from "../lessons/horo-regulation/index.ts";
import { HORO_COMPLICATIONS_LESSONS } from "../lessons/horo-complications/index.ts";
import { MUS_FOUNDATIONS_LESSONS } from "../lessons/mus-foundations/index.ts";
import { MUS_HARMONY_LESSONS } from "../lessons/mus-harmony/index.ts";
import { MUS_HEAVY_LESSONS } from "../lessons/mus-heavy/index.ts";
import { DM_HISTORY_LESSONS } from "../lessons/dm-history/index.ts";
import { DM_CONSTRUCTION_LESSONS } from "../lessons/dm-construction/index.ts";
import { DM_ADVANCED_LESSONS } from "../lessons/dm-advanced/index.ts";
import { SCIENCE_LESSONS } from "../lessons/science.ts";
import { SYSTEMS_LESSONS } from "../lessons/systems.ts";
import { LONGFORM_LESSONS } from "../lessons/longform.ts";
import { buildCatalog } from "../../lib/learning/catalog.ts";
import { defaultState } from "../../lib/learning/defaults.ts";
import { importExport, buildExport } from "../../lib/learning/export.ts";
import { pickCourseForLearner, isConceptUnlocked, isDemonstrated, makeReadinessContext } from "../../lib/learning/readiness.ts";
import { selectLesson } from "../../lib/learning/select.ts";
import { emptyProgress } from "../../lib/learning/srs.ts";
import { isRetiredSeededCategory, isSelectableCategory } from "../../lib/learning/types.ts";
import { isRetiredBuiltInStudyTarget } from "../../lib/learning/curriculum.ts";
import { computeCoverage } from "./coverage.ts";
import { MANIFESTS, MANIFEST_IDS } from "./data/registry.ts";
import { courseManifestSchema } from "./schema.ts";
import { validateCurriculum } from "./validate.ts";

const LESSONS = [
  ...CPU_FOUNDATIONS_LESSONS,
  ...CPU_MICROARCH_LESSONS,
  ...ARCH_GPU_LESSONS,
  ...SEMI_PROCESS_LESSONS,
  ...SEMI_LITHO_LESSONS,
  ...SEMI_LEADING_LESSONS,
  ...OS_FOUNDATIONS_LESSONS,
  ...OS_CONCURRENCY_LESSONS,
  ...OS_STORAGE_LESSONS,
  ...NET_FOUNDATIONS_LESSONS,
  ...NET_TRANSPORT_LESSONS,
  ...NET_INTERNET_LESSONS,
  ...CMP_FRONTEND_LESSONS,
  ...CMP_IR_LESSONS,
  ...CMP_BACKEND_LESSONS,
  ...ML_FOUNDATIONS_LESSONS,
  ...ML_NEURAL_LESSONS,
  ...ML_TRANSFORMERS_LESSONS,
  ...HORO_FOUNDATIONS_LESSONS,
  ...HORO_REGULATION_LESSONS,
  ...HORO_COMPLICATIONS_LESSONS,
  ...MUS_FOUNDATIONS_LESSONS,
  ...MUS_HARMONY_LESSONS,
  ...MUS_HEAVY_LESSONS,
  ...DM_HISTORY_LESSONS,
  ...DM_CONSTRUCTION_LESSONS,
  ...DM_ADVANCED_LESSONS,
  ...CPU_SEMI_LESSONS,
  ...GPU_LESSONS,
  ...SYSTEMS_LESSONS,
  ...SCIENCE_LESSONS,
  ...CULTURE_LESSONS,
  ...LONGFORM_LESSONS,
];
const catalog = buildCatalog(CATEGORIES, CONCEPTS, LESSONS, [], [], [], COURSES);

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

describe("curriculum schema and loading", () => {
  it("validates every generated manifest", () => {
    assert.equal(MANIFESTS.length, MANIFEST_IDS.length);
    for (const raw of MANIFESTS) {
      const parsed = courseManifestSchema.safeParse(raw);
      assert.equal(parsed.success, true, parsed.success ? "" : JSON.stringify(parsed.error.issues[0]));
    }
  });

  it("assembles 9 subjects, 20+ courses, 60+ modules, 500+ concepts", () => {
    const coverage = computeCoverage(catalog);
    assert.equal(coverage.subjects, 9);
    assert.ok(coverage.courses >= 20 && coverage.courses <= 30, String(coverage.courses));
    assert.ok(coverage.modules >= 60 && coverage.modules <= 120, String(coverage.modules));
    assert.ok(coverage.activeConcepts >= 500 && coverage.activeConcepts <= 800, String(coverage.activeConcepts));
    assert.ok(coverage.estimatedMinutes >= 4000);
  });

  it("loads manifests without a single giant hand-maintained array", () => {
    assert.ok(MANIFEST_IDS.includes("cpu-foundations"));
    assert.ok(MANIFEST_IDS.includes("arch-gpu"));
    assert.ok(MANIFEST_IDS.includes("ml-transformers"));
    assert.ok(MANIFEST_IDS.includes("dm-advanced"));
    assert.equal(new Set(MANIFEST_IDS).size, MANIFEST_IDS.length);
  });
});

describe("curriculum integrity", () => {
  it("rejects a broken topology in the seeded catalog", () => {
    const issues = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(issues, []);
  });

  it("has no duplicate ids and no empty courses or modules", () => {
    const courseIds = COURSES.map((c) => c.id);
    assert.equal(new Set(courseIds).size, courseIds.length);
    const moduleIds = COURSES.flatMap((c) => c.modules.map((m) => m.id));
    assert.equal(new Set(moduleIds).size, moduleIds.length);
    const conceptIds = catalog.concepts.map((c) => c.id);
    assert.equal(new Set(conceptIds).size, conceptIds.length);
    for (const course of COURSES) {
      assert.ok(course.modules.length > 0, course.id);
      for (const mod of course.modules) assert.ok(mod.conceptIds.length > 0, mod.id);
    }
  });

  it("rejects dangling prerequisites and unknown source ids", () => {
    const broken = buildCatalog(
      CATEGORIES,
      [...CONCEPTS, { id: "ghost-node", name: "Ghost", category: "cpu", prerequisites: ["no-such-id"], level: "intro", summary: "missing parent" }],
      LESSONS,
      [],
      [],
      [],
      COURSES,
    );
    const issues = validateCurriculum(broken);
    assert.ok(issues.some((i) => i.code === "dangling-prereq"));
  });

  it("detects a prerequisite cycle", () => {
    const cyclic = buildCatalog(
      CATEGORIES,
      [
        { id: "cyc-a", name: "A", category: "cpu", prerequisites: ["cyc-b"], level: "intro", summary: "a loop" },
        { id: "cyc-b", name: "B", category: "cpu", prerequisites: ["cyc-a"], level: "intro", summary: "a loop" },
      ],
      [],
    );
    assert.ok(validateCurriculum(cyclic).some((i) => i.code === "cycle"));
  });

  it("wires real cross-course prerequisites", () => {
    assert.ok(catalog.conceptMap["gpu-why-throughput"].prerequisites.includes("cpu-pipeline"));
    assert.ok(catalog.conceptMap["gpu-why-throughput"].prerequisites.includes("arch-data-parallel"));
    assert.ok(catalog.conceptMap["dm-harmony"].prerequisites.includes("mus-interval"));
    assert.ok(catalog.conceptMap["dm-harmony"].prerequisites.includes("mus-modes"));
    assert.ok(catalog.conceptMap["semi-litho"].prerequisites.includes("semi-wafer"));
    assert.ok(catalog.conceptMap["semi-litho"].prerequisites.includes("semi-planarity"));
    assert.ok(catalog.conceptMap["semi-euv"].prerequisites.includes("semi-duv"));
    assert.ok(catalog.conceptMap["semi-high-na"].prerequisites.includes("semi-na"));
    assert.ok(catalog.conceptMap["os-trap"].prerequisites.includes("os-syscall"));
    assert.ok(catalog.conceptMap["os-page-cache"].prerequisites.includes("os-mmap"));
    assert.ok(catalog.conceptMap["os-cgroup"].prerequisites.includes("os-sched"));
    assert.ok(catalog.conceptMap["os-tlb-os"].prerequisites.includes("cpu-tlb"));
    assert.ok(catalog.conceptMap["ml-attention"].prerequisites.includes("ml-backprop"));
  });
});

describe("removed topics", () => {
  it("keeps retired seeded categories out of normal selection", () => {
    for (const id of ["astronomy", "evo-bio", "economics", "statistics", "audio", "history"]) {
      assert.equal(isRetiredSeededCategory(id), true);
      assert.equal(isSelectableCategory(catalog.categoryMap[id]), false);
    }
    const surprise = selectLesson(
      { minutes: 10, category: null, effort: null, mode: "surprise", journalistDepth: false },
      {},
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(surprise);
    const cat = catalog.conceptMap[surprise.lesson.conceptId]?.category;
    assert.equal(isRetiredSeededCategory(cat ?? ""), false);
    assert.equal(isRetiredBuiltInStudyTarget(catalog, "astronomy"), true);
    assert.equal(isRetiredBuiltInStudyTarget(catalog, "cpu"), false);
  });

  it("does not crash when imported progress references retired concept ids", () => {
    const state = defaultState();
    state.concepts["ast-hr"] = {
      ...emptyProgress("ast-hr"),
      encountered: true,
      understanding: "got_it",
      lastQuizScore: 1,
      lastQuizCorrect: 3,
      lastQuizTotal: 3,
      timesStudied: 1,
    };
    const bundle = buildExport(state);
    const imported = importExport(defaultState(), bundle, "replace");
    assert.equal(imported.state.concepts["ast-hr"].encountered, true);
    assert.ok(catalog.conceptMap["ast-hr"]);
    const picked = selectLesson(
      { minutes: 10, category: "astronomy", effort: null, mode: "explore", journalistDepth: false },
      imported.state.concepts,
      [],
      catalog,
    );
    assert.equal(picked, null);
  });
});

describe("course-specific progression", () => {
  it("Surprise Me cannot jump ahead of course readiness", () => {
    const picked = selectLesson(
      { minutes: 10, category: "cpu", effort: null, mode: "surprise", journalistDepth: false },
      {},
      ["os"],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(picked);
    assert.ok(
      ["arch-latency-throughput", "arch-data-parallel"].includes(picked.lesson.conceptId),
      picked.lesson.conceptId,
    );
    assert.ok(!picked.lesson.conceptId.startsWith("gpu-occup"));
    assert.ok(!picked.lesson.conceptId.startsWith("gpu-sched"));
  });

  it("journalist mode cannot bypass course prerequisites", () => {
    const ctx = makeReadinessContext(catalog, {});
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-simt"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-scheduler"], ctx), false);
    const picked = selectLesson(
      { minutes: 10, category: "cpu", effort: null, mode: "explore", journalistDepth: true },
      {},
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(picked);
    assert.equal(picked.lesson.conceptId, "arch-latency-throughput");
  });

  it("prior demonstrated knowledge can satisfy valid prerequisites", () => {
    const ctx = makeReadinessContext(catalog, {
      "arch-latency-throughput": held("arch-latency-throughput"),
      "arch-data-parallel": held("arch-data-parallel"),
      "cpu-pipeline": held("cpu-pipeline"),
    });
    assert.equal(isDemonstrated("cpu-pipeline", ctx, 2), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-why-throughput"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-occupancy"], ctx), false);
  });

  it("switching courses preserves independent state", () => {
    const courses = {
      "cpu-foundations": {
        courseId: "cpu-foundations",
        startedAt: "2026-08-01T00:00:00.000Z",
        lastStudiedAt: "2026-08-01T00:00:00.000Z",
        waivedConceptIds: ["arch-latency-throughput"],
      },
      "os-foundations": {
        courseId: "os-foundations",
        startedAt: "2026-07-01T00:00:00.000Z",
        lastStudiedAt: "2026-07-01T00:00:00.000Z",
        waivedConceptIds: ["os-kernel"],
      },
    };
    const picked = selectLesson(
      { minutes: 10, category: "os", effort: null, mode: "explore", journalistDepth: false },
      {},
      [],
      catalog,
      undefined,
      { courses, rng: () => 0 },
    );
    assert.ok(picked);
    assert.equal(catalog.conceptMap[picked.lesson.conceptId]?.category, "os");
    assert.deepEqual(courses["cpu-foundations"].waivedConceptIds, ["arch-latency-throughput"]);
    assert.deepEqual(courses["os-foundations"].waivedConceptIds, ["os-kernel"]);
  });

  it("picks the earliest unfinished course in a subject", () => {
    const ctx = makeReadinessContext(catalog, {});
    const course = pickCourseForLearner(catalog, "cpu", ctx);
    assert.equal(course?.id, "cpu-foundations");
    const gpu = pickCourseForLearner(catalog, "cpu", makeReadinessContext(catalog, {}));
    assert.notEqual(gpu?.id, "arch-gpu");
  });
});

describe("curriculum coverage metrics", () => {
  it("reports lessons versus skeleton and shallow modules", () => {
    const coverage = computeCoverage(catalog);
    assert.equal(coverage.conceptsLackingLessons, 0);
    assert.ok(coverage.conceptsWithLessons >= 500);
    assert.deepEqual(coverage.shallowModules, []);
    const gpu = coverage.coursesCovered.find((c) => c.courseId === "arch-gpu");
    assert.ok(gpu);
    assert.ok(gpu.conceptCount >= 20);
    assert.equal(gpu.coveragePct, 100);
    for (const id of [
      "net-foundations",
      "net-transport",
      "net-internet",
      "cmp-frontend",
      "cmp-ir",
      "cmp-backend",
      "ml-foundations",
      "ml-neural",
      "ml-transformers",
      "horo-foundations",
      "horo-regulation",
      "horo-complications",
      "mus-foundations",
      "mus-harmony",
      "mus-heavy",
      "dm-history",
      "dm-construction",
      "dm-advanced",
    ]) {
      const row = coverage.coursesCovered.find((c) => c.courseId === id);
      assert.ok(row, id);
      assert.equal(row.coveragePct, 100, id);
      assert.equal(row.lackingLessons, 0, id);
    }
  });

  it("does not unlock SSA from front-end entry; it waits for three-address IR", () => {
    const ssa = catalog.conceptMap["cmp-ssa"];
    assert.ok(ssa);
    assert.deepEqual(ssa.prerequisites, ["cmp-three-addr"]);
    const onlyFront = makeReadinessContext(catalog, { "cmp-front": held("cmp-front") });
    assert.equal(isConceptUnlocked(ssa, onlyFront), false);
    const afterFrontend = makeReadinessContext(catalog, {
      "cmp-front": held("cmp-front"),
      "cmp-ast": held("cmp-ast"),
      "cmp-typecheck": held("cmp-typecheck"),
      "cmp-ir-lower-intro": held("cmp-ir-lower-intro"),
    });
    assert.equal(isConceptUnlocked(ssa, afterFrontend), false);
    const afterThree = makeReadinessContext(catalog, {
      "cmp-front": held("cmp-front"),
      "cmp-ir-lower-intro": held("cmp-ir-lower-intro"),
      "cmp-three-addr": held("cmp-three-addr"),
    });
    assert.equal(isConceptUnlocked(ssa, afterThree), true);
  });

  it("retired leftover networking and compiler seeds instead of colliding with production lessons", () => {
    const leftover = SYSTEMS_LESSONS.filter((l) =>
      ["net-stack", "net-congestion", "net-bgp", "cmp-front", "cmp-ssa", "cmp-alloc"].includes(l.conceptId) ||
      ["net-stack-5", "net-cc-10", "net-bgp-20", "cmp-front-5", "cmp-ssa-10", "cmp-alloc-20"].includes(l.id),
    );
    assert.deepEqual(leftover.map((l) => l.id), []);
    assert.ok(LESSONS.some((l) => l.id === "net-stack-10"));
    assert.ok(LESSONS.some((l) => l.id === "cmp-front-10"));
    assert.ok(LESSONS.some((l) => l.id === "cmp-ssa-10"));
    assert.ok(LESSONS.some((l) => l.id === "cmp-alloc-10"));
  });

  it("retired leftover remaining-subject seeds instead of colliding with production lessons", () => {
    const leftover = [...SCIENCE_LESSONS, ...CULTURE_LESSONS].filter(
      (l) =>
        ["ml-gd", "ml-backprop", "ml-attention", "mus-interval", "mus-modes", "horo-escape", "horo-tourbillon", "dm-blast", "dm-harmony", "dm-history"].includes(
          l.conceptId,
        ) ||
        ["ml-gd-5", "ml-bp-10", "ml-attn-20", "mus-int-5", "mus-modes-10", "horo-esc-5", "horo-tour-10", "dm-blast-5", "dm-harm-10", "dm-hist-10"].includes(
          l.id,
        ),
    );
    assert.deepEqual(leftover.map((l) => l.id), []);
    assert.ok(LESSONS.some((l) => l.id === "ml-gd-10"));
    assert.ok(LESSONS.some((l) => l.id === "ml-attention-10"));
    assert.ok(LESSONS.some((l) => l.id === "mus-modes-10"));
    assert.ok(LESSONS.some((l) => l.id === "horo-escape-10"));
    assert.ok(LESSONS.some((l) => l.id === "dm-blast-10"));
    assert.ok(LESSONS.some((l) => l.id === "dm-harmony-10"));
  });
});
