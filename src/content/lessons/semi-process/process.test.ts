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
import { SEMI_PROCESS_LESSONS } from "./index.ts";
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
import type { ConceptProgress, LocalProfile } from "../../../lib/learning/types.ts";
import { assembleQuiz } from "../../../lib/quiz/assemble.ts";
import { validateDistractors } from "../../../lib/quiz/distractors.ts";
import { allowedKnowledge } from "../../../lib/quiz/knowledge.ts";
import { mixIsDistinct, objectiveCoverage } from "../../../lib/quiz/mix.ts";
import { createSeededRng, shuffleQuestion } from "../../../lib/quiz/shuffle.ts";

const COURSE_ID = "semi-process";
const FOUNDATIONS_ID = "cpu-foundations";
const MICROARCH_ID = "cpu-microarch";
const GPU_ID = "arch-gpu";
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
  "wafer-cross",
  "oxide-growth",
  "dopant-profiles",
  "dep-vs-etch",
  "etch-profile",
  "cmp-flat",
  "contact-stack",
  "process-flow",
]);
const OTHER_BULK_COURSES = [
  "semi-litho",
  "semi-leading",
  "os-foundations",
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
const processOnly = courseLessons.filter((l) => SEMI_PROCESS_LESSONS.some((row) => row.id === l.id));

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

describe("Semiconductor Process Foundations coverage", () => {
  it("has 4 modules, 26 active concepts, and a lesson for each", () => {
    assert.equal(course.id, COURSE_ID);
    assert.equal(course.modules.length, 4);
    assert.equal(courseConcepts.length, 26);
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
    const gpu = coverage.coursesCovered.find((row) => row.courseId === GPU_ID);
    assert.ok(self);
    assert.equal(self.coveragePct, 100);
    assert.equal(self.lackingLessons, 0);
    assert.ok(foundations);
    assert.equal(foundations.coveragePct, 100);
    assert.ok(microarch);
    assert.equal(microarch.coveragePct, 100);
    assert.ok(gpu);
    assert.equal(gpu.coveragePct, 100);
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

describe("Semiconductor Process Foundations lesson integrity", () => {
  it("keeps lesson IDs unique and quizzes unique within a lesson", () => {
    const ids = courseLessons.map((l) => l.id);
    assert.equal(new Set(ids).size, ids.length);
    const quizIds = courseLessons.flatMap((l) => l.quiz.map((q) => q.id));
    assert.equal(new Set(quizIds).size, quizIds.length, "quiz ids collide across this course");
    for (const lesson of courseLessons) {
      const qids = lesson.quiz.map((q) => q.id);
      assert.equal(qids.length, 3, lesson.id);
      assert.equal(new Set(qids).size, 3, lesson.id);
    }
  });

  it("binds every lesson to an existing concept in this course and module", () => {
    for (const lesson of processOnly) {
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
    for (const lesson of processOnly) {
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
    for (const lesson of processOnly) {
      assert.ok([5, 10, 20, 30].includes(lesson.durationMin), lesson.id);
      const tier = catalog.conceptMap[lesson.conceptId]?.tier ?? 2;
      if (tier <= 1) assert.ok(lesson.level === "intro" || lesson.level === "core", lesson.id);
      if (tier === 2) assert.ok(lesson.level === "core" || lesson.level === "intro", lesson.id);
      if (tier >= 4) assert.equal(lesson.level, "journalist", lesson.id);
    }
  });

  it("only references LessonDiagram names that exist", () => {
    for (const lesson of processOnly) {
      if (!lesson.diagram) continue;
      assert.ok(KNOWN_DIAGRAMS.has(lesson.diagram), `${lesson.id} unknown diagram ${lesson.diagram}`);
    }
  });

  it("keeps default 10-minute units and only justified variants", () => {
    const byConcept = new Map<string, number[]>();
    for (const lesson of processOnly) {
      const list = byConcept.get(lesson.conceptId) ?? [];
      list.push(lesson.durationMin);
      byConcept.set(lesson.conceptId, list);
    }
    for (const concept of courseConcepts) {
      const durations = byConcept.get(concept.id) ?? [];
      assert.ok(durations.includes(10), `${concept.id} missing a 10-minute unit`);
    }
    const twenties = processOnly.filter((l) => l.durationMin === 20).map((l) => l.conceptId).sort();
    assert.deepEqual(twenties, ["semi-implant", "semi-integration", "semi-oxide"].sort());
    assert.equal(processOnly.filter((l) => l.durationMin === 30).length, 0);
    assert.equal(processOnly.filter((l) => l.durationMin === 5).length, 0);
  });

  it("does not collide with the legacy lithography seed lessons", () => {
    const processIds = new Set(processOnly.map((l) => l.id));
    for (const lesson of CPU_SEMI_LESSONS) {
      assert.equal(processIds.has(lesson.id), false, `legacy seed reuses ${lesson.id}`);
      assert.equal(
        courseConcepts.some((c) => c.id === lesson.conceptId),
        false,
        `legacy seed occupies process concept ${lesson.conceptId}`,
      );
    }
  });
});

describe("Semiconductor Process Foundations quiz QA", () => {
  it("gives every lesson a 3-item curriculum-aware quiz with valid distractors", () => {
    for (const lesson of processOnly) {
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
    for (const lesson of processOnly) {
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
    for (const lesson of processOnly) {
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
    for (const lesson of processOnly) {
      for (const question of lesson.quiz) {
        const correct = question.choices[question.answerIndex];
        const shuffled = shuffleQuestion(question, rng);
        assert.equal(shuffled.choices[shuffled.answerIndex], correct, `${lesson.id}/${question.id}`);
        assert.equal(new Set(shuffled.choices).size, 4, `${lesson.id}/${question.id}`);
      }
    }
  });
});

describe("Semiconductor Process Foundations sources", () => {
  it("records the fabrication sources this course is allowed to lean on", () => {
    for (const ref of course.sourceReferences) {
      assert.ok(SOURCE_MAP[ref.id ?? ""], ref.id);
    }
    assert.ok(SOURCE_MAP["mit-6152j"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["mit-6774"].informed.includes(COURSE_ID));
    assert.equal(SOURCE_MAP["asml-euv"].informed.includes(COURSE_ID), false);
  });
});

describe("Semiconductor Process Foundations progression", () => {
  it("lets a fresh learner start only at single-crystal silicon", () => {
    const ctx = makeReadinessContext(catalog, {});
    assert.equal(pickCourseForLearner(catalog, "semiconductors", ctx)?.id, COURSE_ID);
    const unlocked = courseConcepts.filter((c) => isConceptUnlocked(c, ctx)).map((c) => c.id);
    assert.deepEqual(unlocked, ["semi-crystal"]);
    const front = frontierConcepts(course, ctx).map((c) => c.id);
    assert.deepEqual(front.slice(0, 1), ["semi-crystal"]);
    for (const lesson of processOnly) {
      const open = isLessonUnlocked(lesson, ctx);
      if (lesson.conceptId === "semi-crystal") assert.equal(open, true, lesson.id);
      else assert.equal(open, false, lesson.id);
    }
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-litho"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-euv"], ctx), false);
  });

  it("can reach every concept from the prerequisite graph", () => {
    const progress: Record<string, ConceptProgress> = {};
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
    assert.ok(seen.has("semi-yield-intro"));
    assert.ok(seen.has("semi-contamination"));
    assert.ok(seen.has("semi-planarity"));
  });

  it("documents graph-permitted parallel branches instead of rewriting topology", () => {
    const afterWafer = makeReadinessContext(catalog, heldAll(["semi-crystal", "semi-wafer"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-clean"], afterWafer), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-oxide"], afterWafer), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-diffusion"], afterWafer), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-implant"], afterWafer), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-cvd"], afterWafer), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-integration"], afterWafer), false);

    const afterOxide = makeReadinessContext(
      catalog,
      heldAll(["semi-crystal", "semi-wafer", "semi-oxide"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-moscap"], afterOxide), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-cvd"], afterOxide), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-etch-wet"], afterOxide), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-gate-stack"], afterOxide), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-isolation"], afterOxide), false);

    const afterClean = makeReadinessContext(
      catalog,
      heldAll(["semi-crystal", "semi-wafer", "semi-clean"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-contamination"], afterClean), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-yield-intro"], afterClean), false);
  });

  it("will not skip ahead for a partially knowledgeable learner", () => {
    const progress = heldAll(["semi-crystal", "semi-wafer", "semi-oxide", "semi-diffusion"]);
    const ctx = makeReadinessContext(catalog, progress);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-implant"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-cvd"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-etch-wet"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-anneal"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-pvd"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-etch-plasma"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-integration"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-yield-intro"], ctx), false);
  });

  it("honours knownConceptIds without opening the far end of the course", () => {
    const ctx = makeReadinessContext(
      catalog,
      {},
      profileWith(["semi-crystal", "semi-wafer", "semi-oxide"]),
    );
    assert.equal(isDemonstrated("semi-wafer", ctx, 1), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-diffusion"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-clean"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-cvd"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-implant"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-integration"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-yield-intro"], ctx), false);
  });

  it("keeps a lapsed concept available for review", () => {
    const ctx = makeReadinessContext(catalog, {
      "semi-crystal": held("semi-crystal", {
        understanding: "didnt_get_it",
        lastQuizScore: 0.33,
        lapseCount: 2,
      }),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-crystal"], ctx), true);
    assert.ok(processOnly.some((l) => l.conceptId === "semi-crystal" && isLessonUnlocked(l, ctx)));
  });

  it("keeps Surprise Me on this course's frontier", () => {
    const fresh = selectLesson(
      { minutes: 10, category: "semiconductors", effort: null, mode: "surprise", journalistDepth: false },
      {},
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(fresh);
    assert.equal(fresh.lesson.conceptId, "semi-crystal");
    assert.equal(fresh.lesson.durationMin, 10);

    const afterCrystal = selectLesson(
      { minutes: 10, category: "semiconductors", effort: null, mode: "surprise", journalistDepth: false },
      { "semi-crystal": held("semi-crystal") },
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterCrystal);
    assert.equal(afterCrystal.lesson.conceptId, "semi-wafer");

    const mid = selectLesson(
      { minutes: 10, category: "semiconductors", effort: null, mode: "surprise", journalistDepth: false },
      heldAll(["semi-crystal", "semi-wafer"]),
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(mid);
    assert.ok(
      ["semi-clean", "semi-oxide", "semi-diffusion"].includes(mid.lesson.conceptId),
      mid.lesson.conceptId,
    );
    assert.notEqual(mid.lesson.conceptId, "semi-implant");
    assert.notEqual(mid.lesson.conceptId, "semi-integration");
    assert.notEqual(mid.lesson.conceptId, "semi-litho");
    assert.notEqual(mid.lesson.conceptId, "semi-euv");
  });

  it("keeps advanced integration locked until unit processes exist", () => {
    const ctx = makeReadinessContext(catalog, {
      ...heldAll(["semi-crystal", "semi-wafer", "semi-oxide", "semi-cvd", "semi-etch-wet", "semi-etch-plasma"]),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-isolation"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-gate-stack"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-integration"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-yield-intro"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-well"], ctx), false);
  });

  it("has a healthy seeded topology", () => {
    const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(errors, []);
  });
});
