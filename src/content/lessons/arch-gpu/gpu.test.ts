import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../../categories.ts";
import { CONCEPTS } from "../../concepts.ts";
import { COURSES } from "../../courses/index.ts";
import { CULTURE_LESSONS } from "../culture.ts";
import { GPU_LESSONS } from "../gpu.ts";
import { LONGFORM_LESSONS } from "../longform.ts";
import { SCIENCE_LESSONS } from "../science.ts";
import { SYSTEMS_LESSONS } from "../systems.ts";
import { CPU_SEMI_LESSONS } from "../cpu-semi.ts";
import { CPU_FOUNDATIONS_LESSONS } from "../cpu-foundations/index.ts";
import { CPU_MICROARCH_LESSONS } from "../cpu-microarch/index.ts";
import { ARCH_GPU_LESSONS } from "./index.ts";
import { computeCoverage } from "../../curriculum/coverage.ts";
import { validateCurriculum } from "../../curriculum/validate.ts";
import { SOURCE_MAP } from "../../curriculum/sources.ts";
import { buildCatalog } from "../../../lib/learning/catalog.ts";
import { conceptsInCourse, lessonsInCourse, prereqClosure } from "../../../lib/learning/curriculum.ts";
import {
  frontierConcepts,
  isConceptUnlocked,
  isDemonstrated,
  isLessonUnlocked,
  makeReadinessContext,
  pickCourseForLearner,
} from "../../../lib/learning/readiness.ts";
import { selectLesson } from "../../../lib/learning/select.ts";
import { emptyProgress } from "../../../lib/learning/srs.ts";
import type { ConceptProgress, LocalProfile } from "../../../lib/learning/types.ts";
import { assembleQuiz } from "../../../lib/quiz/assemble.ts";
import { validateDistractors } from "../../../lib/quiz/distractors.ts";
import { allowedKnowledge } from "../../../lib/quiz/knowledge.ts";
import { mixIsDistinct, objectiveCoverage } from "../../../lib/quiz/mix.ts";
import { createSeededRng, shuffleQuestion } from "../../../lib/quiz/shuffle.ts";

const COURSE_ID = "arch-gpu";
const FOUNDATIONS_ID = "cpu-foundations";
const MICROARCH_ID = "cpu-microarch";
const KNOWN_DIAGRAMS = new Set([
  "pipeline",
  "hazards",
  "branch",
  "btb",
  "mesi",
  "latency-throughput",
  "fetch-decode",
  "datapath",
  "locality",
  "hierarchy",
  "rename-map",
  "rob-queue",
  "wakeup-select",
  "lsq",
  "store-buffer",
  "two-caches",
  "gpu-grid",
  "gpu-simt",
  "gpu-diverge",
  "gpu-mem",
  "gpu-coalesce",
  "gpu-occupancy",
]);
const OTHER_BULK_COURSES = [
  "os-foundations",
  "net-foundations",
  "ml-foundations",
  "mus-foundations",
  "dm-history",
  "horo-foundations",
];
const FOUNDATIONS_IDS = [
  "arch-latency-throughput",
  "arch-data-parallel",
  "cpu-amdahl",
  "cpu-perf-metrics",
  "cpu-isa",
  "cpu-von-neumann",
  "cpu-fetch-decode",
  "cpu-alu-vs-control",
  "cpu-addressing",
  "cpu-risc-cisc",
  "cpu-endian",
  "cpu-interrupts-lite",
  "cpu-mmio",
  "cpu-pipeline",
  "cpu-hazards",
  "cpu-forwarding",
  "cpu-control-hazard",
  "cpu-ilp-idea",
  "cpu-locality",
  "cpu-cache-levels",
  "cpu-cache-miss",
  "cpu-write-policy",
  "cpu-virtual-addr",
  "cpu-tlb",
  "cpu-memory-wall",
];
const MICROARCH_IDS = [
  "cpu-branch-prediction",
  "cpu-btb",
  "cpu-predictors",
  "cpu-ras",
  "cpu-issue-width",
  "cpu-renaming",
  "cpu-rob",
  "cpu-ooo-schedule",
  "cpu-wakeup-select",
  "cpu-precise-exceptions",
  "cpu-smt",
  "cpu-load-store-queue",
  "cpu-memory-disambig",
  "cpu-speculative-load",
  "cpu-store-buffer",
  "cpu-mshr",
  "cpu-prefetch",
  "cpu-inclusive-cache",
  "cpu-coherency",
  "cpu-mesi",
  "cpu-snoop-vs-dir",
  "cpu-consistency",
  "cpu-tso-vs-relaxed",
  "cpu-vector-simd",
  "cpu-vliw",
  "cpu-power-wall",
  "cpu-security-spec",
  "cpu-microcode",
];

const catalog = buildCatalog(
  CATEGORIES,
  CONCEPTS,
  [
    ...CPU_FOUNDATIONS_LESSONS,
    ...CPU_MICROARCH_LESSONS,
    ...ARCH_GPU_LESSONS,
    ...CPU_SEMI_LESSONS,
    ...GPU_LESSONS,
    ...SYSTEMS_LESSONS,
    ...SCIENCE_LESSONS,
    ...CULTURE_LESSONS,
    ...LONGFORM_LESSONS,
  ],
  [],
  [],
  [],
  COURSES,
);

const course = catalog.courseMap[COURSE_ID];
const courseConcepts = conceptsInCourse(catalog, course);
const courseLessons = lessonsInCourse(catalog, course);
const gpuOnly = courseLessons.filter((l) => ARCH_GPU_LESSONS.some((row) => row.id === l.id));

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

function heldAll(ids: string[], extra: Partial<ConceptProgress> = {}): Record<string, ConceptProgress> {
  return Object.fromEntries(ids.map((id) => [id, held(id, extra)]));
}

function profileWith(known: string[]): LocalProfile {
  return {
    displayName: "tester",
    preferredTopics: [],
    knownConceptIds: known,
    avoidTopics: [],
    customInterests: [],
  };
}

describe("GPU Architecture and Parallel Execution coverage", () => {
  it("has 4 modules, 24 active concepts, and a lesson for each", () => {
    assert.equal(course.id, COURSE_ID);
    assert.equal(course.modules.length, 4);
    assert.equal(courseConcepts.length, 24);
    const missing = courseConcepts.filter((c) => !courseLessons.some((l) => l.conceptId === c.id));
    assert.deepEqual(
      missing.map((c) => c.id),
      [],
      `uncovered: ${missing.map((c) => c.id).join(", ")}`,
    );
  });

  it("did not bulk-generate any other course", () => {
    const coverage = computeCoverage(catalog);
    const self = coverage.coursesCovered.find((row) => row.courseId === COURSE_ID);
    const foundations = coverage.coursesCovered.find((row) => row.courseId === FOUNDATIONS_ID);
    const microarch = coverage.coursesCovered.find((row) => row.courseId === MICROARCH_ID);
    assert.ok(self);
    assert.equal(self.coveragePct, 100);
    assert.equal(self.lackingLessons, 0);
    assert.ok(foundations);
    assert.equal(foundations.coveragePct, 100);
    assert.ok(microarch);
    assert.equal(microarch.coveragePct, 100);
    for (const id of OTHER_BULK_COURSES) {
      const row = coverage.coursesCovered.find((c) => c.courseId === id);
      assert.ok(row, id);
      assert.ok(row.coveragePct < 100, `${id} should not be fully populated`);
    }
  });

  it("has no shallow modules", () => {
    const coverage = computeCoverage(catalog);
    const shallow = coverage.shallowModules.filter((row) => row.courseId === COURSE_ID);
    assert.deepEqual(shallow, []);
  });
});

describe("GPU Architecture and Parallel Execution lesson integrity", () => {
  it("keeps lesson IDs unique and quizzes unique within a lesson", () => {
    const ids = courseLessons.map((l) => l.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const lesson of courseLessons) {
      const qids = lesson.quiz.map((q) => q.id);
      assert.equal(qids.length, 3, lesson.id);
      assert.equal(new Set(qids).size, 3, lesson.id);
    }
  });

  it("binds every lesson to an existing concept in this course and module", () => {
    for (const lesson of courseLessons) {
      const concept = catalog.conceptMap[lesson.conceptId];
      assert.ok(concept, lesson.id);
      assert.equal(concept.courseId, COURSE_ID, lesson.id);
      assert.ok(concept.moduleId, lesson.id);
      assert.ok(
        course.modules.some((m) => m.id === concept.moduleId && m.conceptIds.includes(concept.id)),
        lesson.id,
      );
    }
  });

  it("matches authoritative prerequisites and uses only graph IDs", () => {
    for (const lesson of courseLessons) {
      const concept = catalog.conceptMap[lesson.conceptId];
      assert.deepEqual(
        [...lesson.prerequisites].sort(),
        [...concept.prerequisites].sort(),
        lesson.id,
      );
      for (const pre of lesson.prerequisites) {
        assert.ok(catalog.conceptMap[pre], `${lesson.id} unknown prereq ${pre}`);
      }
      if (lesson.goDeeper) {
        assert.ok(catalog.conceptMap[lesson.goDeeper], `${lesson.id} dangling goDeeper ${lesson.goDeeper}`);
      }
    }
  });

  it("uses valid durations and compatible tiers", () => {
    for (const lesson of courseLessons) {
      assert.ok([5, 10, 20, 30].includes(lesson.durationMin), lesson.id);
      const tier = catalog.conceptMap[lesson.conceptId]?.tier ?? 2;
      if (tier <= 1) assert.ok(lesson.level === "intro" || lesson.level === "core", lesson.id);
      if (tier === 2) assert.ok(lesson.level === "core" || lesson.level === "intro", lesson.id);
      if (tier >= 4) assert.equal(lesson.level, "journalist", lesson.id);
    }
  });

  it("only references LessonDiagram names that exist", () => {
    for (const lesson of courseLessons) {
      if (!lesson.diagram) continue;
      assert.ok(KNOWN_DIAGRAMS.has(lesson.diagram), `${lesson.id} unknown diagram ${lesson.diagram}`);
    }
  });

  it("keeps default 10-minute units and only justified variants", () => {
    const byConcept = new Map<string, number[]>();
    for (const lesson of courseLessons) {
      const list = byConcept.get(lesson.conceptId) ?? [];
      list.push(lesson.durationMin);
      byConcept.set(lesson.conceptId, list);
    }
    for (const concept of courseConcepts) {
      const durations = byConcept.get(concept.id) ?? [];
      assert.ok(durations.includes(10), `${concept.id} missing a 10-minute unit`);
    }
    const twenties = courseLessons.filter((l) => l.durationMin === 20).map((l) => l.conceptId).sort();
    assert.deepEqual(twenties, ["gpu-coalescing", "gpu-divergence", "gpu-scheduler"].sort());
    assert.equal(courseLessons.filter((l) => l.durationMin === 30).length, 0);
  });

  it("keeps the gpu-warps-10 lesson id that readiness tests look up", () => {
    assert.ok(catalog.lessonMap["gpu-warps-10"]);
    assert.equal(catalog.lessonMap["gpu-warps-10"].conceptId, "gpu-warps");
    assert.ok(catalog.lessonMap["gpu-simt-10"]);
    assert.ok(catalog.lessonMap["gpu-why-throughput-10"]);
  });
});

describe("GPU Architecture and Parallel Execution quiz QA", () => {
  it("gives every lesson a 3-item curriculum-aware quiz with valid distractors", () => {
    for (const lesson of courseLessons) {
      const concept = catalog.conceptMap[lesson.conceptId];
      const assembled = assembleQuiz(lesson.quiz, {
        shuffle: false,
        catalog,
        concept,
        knownObjectiveIds: concept.objectives ?? [],
        expectedTier: concept.tier,
      });
      assert.equal(assembled.ok, true, `${lesson.id}: ${assembled.ok ? "" : assembled.issues.join("; ")}`);
      if (!assembled.ok) continue;
      assert.equal(assembled.quiz.length, 3);
      assert.equal(mixIsDistinct(assembled.quiz), true, lesson.id);
      for (const question of assembled.quiz) {
        const correct = question.choices[question.answerIndex];
        const others = question.choices.filter((_, i) => i !== question.answerIndex);
        const checked = validateDistractors(
          correct,
          others.map((text, i) => ({
            text,
            kind: question.distractors?.[i]?.kind,
            rationale: question.distractors?.[i]?.rationale,
          })),
        );
        assert.equal(checked.ok, true, `${lesson.id}/${question.id}: ${checked.ok ? "" : checked.issues.join("; ")}`);
      }
    }
  });

  it("keeps quiz objective IDs on the current concept", () => {
    const byConcept = new Map(courseConcepts.map((c) => [c.id, new Set(c.objectives ?? [])]));
    const foreign = new Map<string, Set<string>>();
    for (const concept of courseConcepts) {
      for (const [id, objs] of byConcept) {
        if (id === concept.id) continue;
        for (const obj of objs) {
          if (concept.objectives?.includes(obj)) continue;
          const bag = foreign.get(concept.id) ?? new Set<string>();
          bag.add(obj);
          foreign.set(concept.id, bag);
        }
      }
    }
    for (const lesson of courseLessons) {
      const concept = catalog.conceptMap[lesson.conceptId];
      const mine = new Set(concept.objectives ?? []);
      const stolen = foreign.get(concept.id) ?? new Set();
      assert.ok(mine.size > 0, `${concept.id} has no objectives`);
      assert.ok(objectiveCoverage(lesson.quiz).length > 0, lesson.id);
      for (const question of lesson.quiz) {
        assert.ok((question.objectiveIds ?? []).length > 0, `${lesson.id}/${question.id} missing objectives`);
        for (const obj of question.objectiveIds ?? []) {
          assert.ok(mine.has(obj), `${lesson.id}/${question.id} unknown or foreign objective: ${obj}`);
          assert.equal(stolen.has(obj), false, `${lesson.id}/${question.id} uses another concept's objective: ${obj}`);
        }
        for (const pre of question.prerequisiteConceptIds ?? []) {
          assert.ok(
            pre === concept.id || concept.prerequisites.includes(pre) || catalog.conceptMap[pre],
            `${lesson.id}/${question.id} bad prereq ${pre}`,
          );
        }
      }
    }
  });

  it("does not let a quiz assume future-course knowledge", () => {
    for (const lesson of courseLessons) {
      const concept = catalog.conceptMap[lesson.conceptId];
      const allowed = allowedKnowledge(
        catalog,
        concept,
        makeReadinessContext(catalog, {
          [concept.id]: held(concept.id),
          ...Object.fromEntries(concept.prerequisites.map((id) => [id, held(id)])),
        }),
      );
      for (const question of lesson.quiz) {
        for (const pre of question.prerequisiteConceptIds ?? []) {
          assert.ok(
            allowed.conceptIds.includes(pre) || concept.prerequisites.includes(pre) || pre === concept.id,
            `${lesson.id}/${question.id} prerequisite ${pre} outside allowed knowledge`,
          );
        }
      }
    }
  });

  it("keeps the correct answer after shuffling", () => {
    const rng = createSeededRng(20260819);
    for (const lesson of gpuOnly) {
      for (const question of lesson.quiz) {
        const correct = question.choices[question.answerIndex];
        const shuffled = shuffleQuestion(question, rng);
        assert.equal(shuffled.choices[shuffled.answerIndex], correct, `${lesson.id}/${question.id}`);
        assert.equal(new Set(shuffled.choices).size, 4, `${lesson.id}/${question.id}`);
      }
    }
  });
});

describe("GPU Architecture and Parallel Execution cross-course prerequisites", () => {
  it("only depends on reachable Foundations or Microarchitecture concepts", () => {
    const foundationIds = new Set(catalog.courseMap[FOUNDATIONS_ID].modules.flatMap((m) => m.conceptIds));
    const microarchIds = new Set(catalog.courseMap[MICROARCH_ID].modules.flatMap((m) => m.conceptIds));
    const prior = new Set([...foundationIds, ...microarchIds]);
    const needed = new Set<string>();
    for (const concept of courseConcepts) {
      for (const pre of concept.prerequisites) {
        if (catalog.conceptMap[pre]?.courseId !== COURSE_ID) needed.add(pre);
      }
    }
    for (const pre of course.entryRequirements) needed.add(pre);
    assert.ok(needed.size > 0);
    assert.ok(needed.has("cpu-pipeline"));
    assert.ok(needed.has("arch-data-parallel"));
    assert.ok(needed.has("cpu-vector-simd"));
    assert.ok(needed.has("cpu-ilp-idea"));
    assert.ok(needed.has("cpu-virtual-addr"));
    for (const pre of needed) {
      assert.ok(catalog.conceptMap[pre], `missing cross-course prereq ${pre}`);
      assert.ok(prior.has(pre), `${pre} is not in Foundations or Microarchitecture`);
      const closure = prereqClosure(catalog, pre);
      for (const id of closure) {
        if (id === pre) continue;
        const home = catalog.conceptMap[id]?.courseId;
        assert.ok(
          !home || home === FOUNDATIONS_ID || home === MICROARCH_ID,
          `unrooted ${pre} via ${id} in ${home}`,
        );
      }
    }
  });

  it("reuses Modern CPU knowledge only through real graph edges", () => {
    const microarchOnly = courseConcepts.flatMap((c) =>
      c.prerequisites.filter((pre) => catalog.conceptMap[pre]?.courseId === MICROARCH_ID).map((pre) => `${c.id}←${pre}`),
    );
    assert.deepEqual(microarchOnly.sort(), ["gpu-simd-lane←cpu-vector-simd", "gpu-tensor-core←cpu-vector-simd"].sort());
  });

  it("records the architecture sources this course is allowed to lean on", () => {
    for (const ref of course.sourceReferences) {
      assert.ok(SOURCE_MAP[ref.id], ref.id);
    }
    assert.ok(SOURCE_MAP["stanford-cs149"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["nvidia-educators"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["mit-6823"].informed.includes(COURSE_ID));
  });
});

describe("GPU Architecture and Parallel Execution progression", () => {
  it("lets a foundations graduate start at why-a-GPU, not occupancy", () => {
    const ctx = makeReadinessContext(catalog, heldAll(FOUNDATIONS_IDS));
    assert.equal(pickCourseForLearner(catalog, "cpu", ctx)?.id, MICROARCH_ID);
    const unlocked = courseConcepts.filter((c) => isConceptUnlocked(c, ctx)).map((c) => c.id);
    assert.ok(unlocked.includes("gpu-why-throughput"));
    assert.equal(unlocked.includes("gpu-execution-model"), false);
    assert.equal(unlocked.includes("gpu-occupancy"), false);
    assert.equal(unlocked.includes("gpu-scheduler"), false);
    assert.equal(unlocked.includes("gpu-divergence"), false);
    assert.equal(unlocked.includes("gpu-simd-lane"), false);
    assert.equal(unlocked.includes("gpu-tensor-core"), false);
    const front = frontierConcepts(course, ctx).map((c) => c.id);
    assert.equal(front[0], "gpu-why-throughput");
    for (const lesson of courseLessons) {
      const open = isLessonUnlocked(lesson, ctx);
      if (unlocked.includes(lesson.conceptId)) assert.equal(open, true, lesson.id);
      else assert.equal(open, false, lesson.id);
    }
  });

  it("can reach every concept once Microarchitecture SIMD is held", () => {
    const progress: Record<string, ConceptProgress> = {
      ...heldAll(FOUNDATIONS_IDS),
      ...heldAll(MICROARCH_IDS),
    };
    const seen = new Set<string>();
    for (let step = 0; step < 40; step++) {
      const ctx = makeReadinessContext(catalog, progress);
      const front = frontierConcepts(course, ctx);
      if (front.length === 0) break;
      for (const concept of front) {
        progress[concept.id] = held(concept.id);
        seen.add(concept.id);
      }
    }
    assert.deepEqual(
      [...seen].sort(),
      courseConcepts.map((c) => c.id).sort(),
    );
    assert.ok(seen.has("gpu-tensor-core"));
    assert.ok(seen.has("gpu-simd-lane"));
  });

  it("cannot reach SIMD-lane or tensor cores from Foundations alone", () => {
    const progress: Record<string, ConceptProgress> = heldAll(FOUNDATIONS_IDS);
    const seen = new Set<string>();
    for (let step = 0; step < 40; step++) {
      const ctx = makeReadinessContext(catalog, progress);
      const front = frontierConcepts(course, ctx);
      if (front.length === 0) break;
      for (const concept of front) {
        progress[concept.id] = held(concept.id);
        seen.add(concept.id);
      }
    }
    assert.equal(seen.has("gpu-why-throughput"), true);
    assert.equal(seen.has("gpu-warps"), true);
    assert.equal(seen.has("gpu-simd-lane"), false);
    assert.equal(seen.has("gpu-tensor-core"), false);
    assert.ok(seen.size < courseConcepts.length);
  });

  it("documents graph-permitted early unlocks instead of rewriting topology", () => {
    const afterLaunch = makeReadinessContext(catalog, {
      ...heldAll(FOUNDATIONS_IDS),
      "gpu-why-throughput": held("gpu-why-throughput"),
      "gpu-execution-model": held("gpu-execution-model"),
      "gpu-kernel-launch": held("gpu-kernel-launch"),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-graph-capture"], afterLaunch), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-warps"], afterLaunch), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-occupancy"], afterLaunch), false);

    const afterMem = makeReadinessContext(catalog, {
      ...heldAll(FOUNDATIONS_IDS),
      "gpu-why-throughput": held("gpu-why-throughput"),
      "gpu-execution-model": held("gpu-execution-model"),
      "gpu-simt": held("gpu-simt"),
      "gpu-warps": held("gpu-warps"),
      "gpu-memory-hierarchy": held("gpu-memory-hierarchy"),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-atomics"], afterMem), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-multi-gpu"], afterMem), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-unified-mem"], afterMem), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-occupancy"], afterMem), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-scheduler"], afterMem), false);
  });

  it("will not skip ahead for a partially knowledgeable learner", () => {
    const progress = {
      ...heldAll(["cpu-pipeline", "arch-data-parallel", "arch-latency-throughput"]),
    };
    const ctx = makeReadinessContext(catalog, progress);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-why-throughput"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-execution-model"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-occupancy"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-scheduler"], ctx), false);
  });

  it("honours knownConceptIds without opening the far end of the course", () => {
    const ctx = makeReadinessContext(
      catalog,
      {},
      profileWith(["cpu-pipeline", "arch-data-parallel", "gpu-why-throughput"]),
    );
    assert.equal(isDemonstrated("gpu-why-throughput", ctx, 2), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-execution-model"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-occupancy"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-scheduler"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-divergence"], ctx), false);
  });

  it("keeps a lapsed concept available for review", () => {
    const ctx = makeReadinessContext(catalog, {
      ...heldAll(FOUNDATIONS_IDS),
      "gpu-why-throughput": held("gpu-why-throughput", {
        understanding: "didnt_get_it",
        lastQuizScore: 0.33,
        lapseCount: 2,
      }),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-why-throughput"], ctx), true);
    assert.ok(courseLessons.some((l) => l.conceptId === "gpu-why-throughput" && isLessonUnlocked(l, ctx)));
  });

  it("keeps Surprise Me on this course's frontier after both CPU courses", () => {
    const fresh = selectLesson(
      { minutes: 10, category: "cpu", effort: null, mode: "surprise", journalistDepth: false },
      {},
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(fresh);
    assert.equal(fresh.lesson.conceptId, "arch-latency-throughput");

    const afterFoundations = selectLesson(
      { minutes: 10, category: "cpu", effort: null, mode: "surprise", journalistDepth: false },
      heldAll(FOUNDATIONS_IDS),
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterFoundations);
    assert.equal(afterFoundations.lesson.conceptId, "cpu-branch-prediction");

    const afterBoth = selectLesson(
      { minutes: 10, category: "cpu", effort: null, mode: "surprise", journalistDepth: false },
      { ...heldAll(FOUNDATIONS_IDS), ...heldAll(MICROARCH_IDS) },
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterBoth);
    assert.equal(afterBoth.lesson.conceptId, "gpu-why-throughput");
    assert.equal(afterBoth.lesson.durationMin, 10);

    const mid = selectLesson(
      { minutes: 10, category: "cpu", effort: null, mode: "surprise", journalistDepth: false },
      {
        ...heldAll(FOUNDATIONS_IDS),
        ...heldAll(MICROARCH_IDS),
        "gpu-why-throughput": held("gpu-why-throughput"),
      },
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(mid);
    assert.equal(mid.lesson.conceptId, "gpu-execution-model");
    assert.notEqual(mid.lesson.conceptId, "gpu-occupancy");
    assert.notEqual(mid.lesson.conceptId, "gpu-scheduler");
  });

  it("keeps advanced concepts locked until their prerequisites are demonstrated", () => {
    const ctx = makeReadinessContext(catalog, {
      ...heldAll(FOUNDATIONS_IDS),
      "gpu-why-throughput": held("gpu-why-throughput"),
      "gpu-execution-model": held("gpu-execution-model"),
      "gpu-simt": held("gpu-simt"),
      "gpu-warps": held("gpu-warps"),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-exec-resources"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-memory-hierarchy"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-occupancy"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-divergence"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["gpu-scheduler"], ctx), false);
  });

  it("has a healthy seeded topology", () => {
    const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(errors, []);
  });
});
