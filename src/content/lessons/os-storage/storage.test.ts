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
import { ARCH_GPU_LESSONS } from "../arch-gpu/index.ts";
import { SEMI_PROCESS_LESSONS } from "../semi-process/index.ts";
import { SEMI_LITHO_LESSONS } from "../semi-litho/index.ts";
import { SEMI_LEADING_LESSONS } from "../semi-leading/index.ts";
import { OS_FOUNDATIONS_LESSONS } from "../os-foundations/index.ts";
import { OS_CONCURRENCY_LESSONS } from "../os-concurrency/index.ts";
import { OS_STORAGE_LESSONS } from "./index.ts";
import { computeCoverage } from "../../curriculum/coverage.ts";
import { validateCurriculum } from "../../curriculum/validate.ts";
import { SOURCE_MAP } from "../../curriculum/sources.ts";
import { buildCatalog } from "../../../lib/learning/catalog.ts";
import { conceptsInCourse, lessonsInCourse } from "../../../lib/learning/curriculum.ts";
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
import type { ConceptProgress, LocalProfile } from "../../../lib/learning/types";
import { assembleQuiz } from "../../../lib/quiz/assemble";
import { validateDistractors } from "../../../lib/quiz/distractors.ts";
import { allowedKnowledge } from "../../../lib/quiz/knowledge.ts";
import { mixIsDistinct, objectiveCoverage } from "../../../lib/quiz/mix.ts";
import { createSeededRng, shuffleQuestion } from "../../../lib/quiz/shuffle.ts";

const COURSE_ID = "os-storage";
const FOUNDATIONS_ID = "os-foundations";
const CONCURRENCY_ID = "os-concurrency";

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
  "litho",
  "euv",
  "litho-sequence",
  "resist-tone",
  "rayleigh-knobs",
  "dof-trade",
  "overlay-marks",
  "multi-pattern",
  "duv-vs-euv",
  "high-na-field",
  "anamorphic-field",
  "mask-3d-stack",
  "stochastic-wall",
  "overlay-budget",
  "gag-sheet",
  "backside-power",
  "chiplet-bond",
  "wafer-cross",
  "oxide-growth",
  "dopant-profiles",
  "dep-vs-etch",
  "etch-profile",
  "cmp-flat",
  "contact-stack",
  "process-flow",
  "user-kernel-boundary",
  "trap-entry",
  "process-space",
  "thread-share",
  "context-switch",
  "ready-queue",
  "virt-translate",
  "tlb-shootdown",
  "page-fault-path",
  "cow-fork",
  "sched-queues",
  "race-interleave",
  "lock-sleep",
  "inode-dir-fd",
  "fs-layout",
  "journal-commit",
  "buffer-path",
]);

const OTHER_BULK_COURSES = [
  "net-foundations",
  "ml-foundations",
  "mus-foundations",
  "dm-history",
  "horo-foundations",
];

const catalog = buildCatalog(
  CATEGORIES,
  CONCEPTS,
  [
    ...CPU_FOUNDATIONS_LESSONS,
    ...CPU_MICROARCH_LESSONS,
    ...ARCH_GPU_LESSONS,
    ...SEMI_PROCESS_LESSONS,
    ...SEMI_LITHO_LESSONS,
    ...SEMI_LEADING_LESSONS,
    ...OS_FOUNDATIONS_LESSONS,
    ...OS_CONCURRENCY_LESSONS,
    ...OS_STORAGE_LESSONS,
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
const own = courseLessons.filter((l) => OS_STORAGE_LESSONS.some((row) => row.id === l.id));

const FOUNDATIONS_IDS = conceptsInCourse(catalog, catalog.courseMap[FOUNDATIONS_ID]).map((c) => c.id);
const CONCURRENCY_IDS = conceptsInCourse(catalog, catalog.courseMap[CONCURRENCY_ID]).map((c) => c.id);

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

describe("Storage, Filesystems, and Kernel Internals coverage", () => {
  it("has 3 modules, 22 active concepts, and a lesson for each", () => {
    assert.equal(course.id, COURSE_ID);
    assert.equal(course.modules.length, 3);
    assert.equal(courseConcepts.length, 22);
    const missing = courseConcepts.filter((c) => !courseLessons.some((l) => l.conceptId === c.id));
    assert.deepEqual(missing.map((c) => c.id), []);
  });

  it("completes the OS track and does not populate other subjects", () => {
    const coverage = computeCoverage(catalog);
    for (const id of [FOUNDATIONS_ID, CONCURRENCY_ID, COURSE_ID]) {
      const row = coverage.coursesCovered.find((c) => c.courseId === id);
      assert.ok(row, id);
      assert.equal(row.coveragePct, 100, id);
    }
    for (const id of OTHER_BULK_COURSES) {
      const row = coverage.coursesCovered.find((c) => c.courseId === id);
      assert.ok(row, id);
      assert.ok(row.coveragePct < 100, `${id} should not be fully populated`);
    }
  });

  it("has no shallow modules", () => {
    const coverage = computeCoverage(catalog);
    assert.deepEqual(
      coverage.shallowModules.filter((row) => row.courseId === COURSE_ID),
      [],
    );
  });
});

describe("Storage, Filesystems, and Kernel Internals lesson integrity", () => {
  it("keeps lesson IDs unique and quizzes unique", () => {
    const ids = courseLessons.map((l) => l.id);
    assert.equal(new Set(ids).size, ids.length);
    const quizIds = own.flatMap((l) => l.quiz.map((q) => q.id));
    assert.equal(new Set(quizIds).size, quizIds.length);
    for (const lesson of own) assert.equal(lesson.quiz.length, 3, lesson.id);
  });

  it("binds every lesson to this course and matches graph prerequisites", () => {
    for (const lesson of own) {
      const concept = catalog.conceptMap[lesson.conceptId];
      assert.ok(concept, lesson.id);
      assert.equal(concept.courseId, COURSE_ID, lesson.id);
      assert.deepEqual([...lesson.prerequisites].sort(), [...concept.prerequisites].sort(), lesson.id);
      if (lesson.goDeeper) {
        assert.ok(catalog.conceptMap[lesson.goDeeper], `${lesson.id} dangling goDeeper`);
      }
    }
  });

  it("uses valid durations and compatible tiers", () => {
    for (const lesson of own) {
      assert.ok([5, 10, 20, 30].includes(lesson.durationMin), lesson.id);
      const tier = catalog.conceptMap[lesson.conceptId]?.tier ?? 2;
      if (tier === 2) assert.ok(lesson.level === "core" || lesson.level === "intro", lesson.id);
      if (tier >= 4) assert.equal(lesson.level, "journalist", lesson.id);
    }
  });

  it("only references LessonDiagram names that exist", () => {
    for (const lesson of own) {
      if (!lesson.diagram) continue;
      assert.ok(KNOWN_DIAGRAMS.has(lesson.diagram), `${lesson.id} unknown diagram ${lesson.diagram}`);
    }
  });

  it("keeps a 10-minute unit on every concept and only justified variants", () => {
    for (const concept of courseConcepts) {
      const durations = own.filter((l) => l.conceptId === concept.id).map((l) => l.durationMin);
      assert.ok(durations.includes(10), `${concept.id} missing a 10-minute unit`);
    }
    const fives = own.filter((l) => l.durationMin === 5).map((l) => l.conceptId).sort();
    assert.deepEqual(fives, ["os-block-dev"]);
    const twenties = own.filter((l) => l.durationMin === 20).map((l) => l.conceptId).sort();
    assert.deepEqual(twenties, ["os-container", "os-crash-consist", "os-journal"]);
    assert.equal(own.filter((l) => l.durationMin === 30).length, 0);
  });

  it("does not collide with leftover systems seeds", () => {
    const ids = new Set(own.map((l) => l.id));
    for (const lesson of SYSTEMS_LESSONS) {
      assert.equal(ids.has(lesson.id), false, lesson.id);
      assert.equal(courseConcepts.some((c) => c.id === lesson.conceptId), false, lesson.conceptId);
    }
  });
});

describe("Storage, Filesystems, and Kernel Internals quiz QA", () => {
  it("gives every lesson a 3-item curriculum-aware quiz with valid distractors", () => {
    for (const lesson of own) {
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
    for (const lesson of own) {
      const concept = catalog.conceptMap[lesson.conceptId];
      const mine = new Set(concept.objectives ?? []);
      assert.ok(mine.size > 0, concept.id);
      for (const question of lesson.quiz) {
        assert.ok((question.objectiveIds ?? []).length > 0, `${lesson.id}/${question.id}`);
        for (const obj of question.objectiveIds ?? []) {
          assert.ok(mine.has(obj), `${lesson.id}/${question.id} foreign objective: ${obj}`);
        }
      }
    }
  });

  it("does not let a quiz assume future-course knowledge", () => {
    for (const lesson of own) {
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
    const rng = createSeededRng(20260820);
    for (const lesson of own) {
      for (const question of lesson.quiz) {
        const correct = question.choices[question.answerIndex];
        const shuffled = shuffleQuestion(question, rng);
        assert.equal(shuffled.choices[shuffled.answerIndex], correct, `${lesson.id}/${question.id}`);
      }
    }
  });

  it("varies cognitive types instead of stamping one advanced stencil", () => {
    const counts = new Map<string, number>();
    for (const lesson of own) {
      for (const question of lesson.quiz) {
        counts.set(question.cognitiveType ?? "missing", (counts.get(question.cognitiveType ?? "missing") ?? 0) + 1);
      }
    }
    assert.ok((counts.get("apply") ?? 0) >= 8, String(counts.get("apply")));
    assert.ok((counts.get("predict") ?? 0) >= 6, String(counts.get("predict")));
    const items = [...counts.values()].reduce((a, b) => a + b, 0);
    const stamped = (counts.get("integrate") ?? 0) + (counts.get("tradeoff") ?? 0) + (counts.get("diagnose") ?? 0);
    assert.ok(stamped < items * 0.55, `advanced types dominate: ${JSON.stringify(Object.fromEntries(counts))}`);
    assert.ok([...counts.keys()].length >= 5, [...counts.keys()].join(","));
  });
});

describe("Storage, Filesystems, and Kernel Internals sources", () => {
  it("records the OS sources this course is allowed to lean on", () => {
    for (const ref of course.sourceReferences) {
      assert.ok(SOURCE_MAP[ref.id ?? ""], ref.id);
    }
    assert.ok(SOURCE_MAP["mit-61810"].informed.includes(COURSE_ID));
  });
});

describe("Storage, Filesystems, and Kernel Internals progression", () => {
  it("does not become the picked course until Memory/Concurrency is clear", () => {
    const fresh = makeReadinessContext(catalog, {});
    assert.equal(pickCourseForLearner(catalog, "os", fresh)?.id, FOUNDATIONS_ID);

    const afterFoundations = makeReadinessContext(catalog, heldAll(FOUNDATIONS_IDS));
    assert.equal(pickCourseForLearner(catalog, "os", afterFoundations)?.id, CONCURRENCY_ID);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-block-dev"], afterFoundations), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-page-cache"], afterFoundations), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-cgroup"], afterFoundations), false);
  });

  it("unlocks block devices from Foundations, but page cache only after mmap", () => {
    const afterFoundations = makeReadinessContext(catalog, heldAll(FOUNDATIONS_IDS));
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-block-dev"], afterFoundations), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-inode"], afterFoundations), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-init"], afterFoundations), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-namespace"], afterFoundations), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-buffer-cache"], afterFoundations), false);

    const afterBlock = makeReadinessContext(catalog, heldAll([...FOUNDATIONS_IDS, "os-block-dev"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-inode"], afterBlock), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-buffer-cache"], afterBlock), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-page-cache"], afterBlock), false);

    const afterMmap = makeReadinessContext(
      catalog,
      heldAll([...FOUNDATIONS_IDS, "os-block-dev", "os-buffer-cache", "os-vm", "os-mmap"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-page-cache"], afterMmap), true);
  });

  it("keeps crash consistency behind journaling, and containers behind namespace+cgroup", () => {
    const afterLayout = makeReadinessContext(
      catalog,
      heldAll([...FOUNDATIONS_IDS, "os-block-dev", "os-inode", "os-fs-layout"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-journal"], afterLayout), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-crash-consist"], afterLayout), false);

    const afterNs = makeReadinessContext(catalog, heldAll([...FOUNDATIONS_IDS, "os-namespace"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-namespace-linux"], afterNs), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-container"], afterNs), false);

    const afterBoth = makeReadinessContext(
      catalog,
      heldAll([...FOUNDATIONS_IDS, "os-namespace", "os-sched", "os-cgroup"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-container"], afterBoth), true);
  });

  it("does not unlock KVM without cpu-virtual-addr", () => {
    const osOnly = makeReadinessContext(catalog, heldAll(FOUNDATIONS_IDS));
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-kvm-intro"], osOnly), false);
    const withCpu = makeReadinessContext(catalog, heldAll([...FOUNDATIONS_IDS, "cpu-virtual-addr"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-kvm-intro"], withCpu), true);
  });

  it("can reach every concept once cross-course prereqs are held", () => {
    const progress = heldAll([
      "cpu-tlb",
      "arch-latency-throughput",
      "cpu-consistency",
      "cpu-virtual-addr",
      ...FOUNDATIONS_IDS,
      ...CONCURRENCY_IDS,
    ]);
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
    assert.deepEqual([...seen].sort(), courseConcepts.map((c) => c.id).sort());
  });

  it("honours knownConceptIds only for real graph prerequisites", () => {
    const ctx = makeReadinessContext(catalog, {}, profileWith(["os-device-intro"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-block-dev"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["os-inode"], ctx), false);
    assert.equal(isDemonstrated("os-device-intro", ctx, 2), true);
  });

  it("keeps a lapsed concept available for review", () => {
    const ctx = makeReadinessContext(catalog, {
      ...heldAll(FOUNDATIONS_IDS),
      "os-block-dev": held("os-block-dev", {
        understanding: "didnt_get_it",
        lastQuizScore: 0.33,
        lapseCount: 2,
      }),
    });
    assert.ok(own.some((l) => l.conceptId === "os-block-dev" && isLessonUnlocked(l, ctx)));
  });

  it("Surprise Me stays on concurrency until that frontier is empty", () => {
    const afterFoundations = selectLesson(
      { minutes: 10, category: "os", effort: null, mode: "surprise", journalistDepth: false },
      heldAll(FOUNDATIONS_IDS),
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterFoundations);
    assert.equal(afterFoundations.lesson.conceptId, "os-vm");

    const afterBoth = selectLesson(
      { minutes: 10, category: "os", effort: null, mode: "surprise", journalistDepth: false },
      heldAll([
        "cpu-tlb",
        "arch-latency-throughput",
        "cpu-consistency",
        ...FOUNDATIONS_IDS,
        ...CONCURRENCY_IDS,
      ]),
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterBoth);
    assert.equal(afterBoth.lesson.conceptId, "os-block-dev");
  });

  it("has a healthy seeded topology", () => {
    const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(errors, []);
  });
});
