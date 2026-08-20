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
import { SEMI_LITHO_LESSONS } from "./index.ts";
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

const COURSE_ID = "semi-litho";
const PROCESS_ID = "semi-process";
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
  "litho-sequence",
  "resist-tone",
  "rayleigh-knobs",
  "dof-trade",
  "overlay-marks",
  "multi-pattern",
  "duv-vs-euv",
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
  "os-foundations",
  "net-foundations",
  "ml-foundations",
  "mus-foundations",
  "dm-history",
  "horo-foundations",
];
const PROCESS_IDS = [
  "semi-crystal",
  "semi-wafer",
  "semi-clean",
  "semi-oxide",
  "semi-diffusion",
  "semi-implant",
  "semi-anneal",
  "semi-cvd",
  "semi-pvd",
  "semi-epitaxy",
  "semi-etch-wet",
  "semi-etch-plasma",
  "semi-cmp",
  "semi-metals",
  "semi-dielectric",
  "semi-isolation",
  "semi-well",
  "semi-gate-stack",
  "semi-silicide",
  "semi-integration",
  "semi-yield-intro",
  "semi-defect-class",
  "semi-metrology",
  "semi-moscap",
  "semi-planarity",
  "semi-contamination",
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
const lithoOnly = courseLessons.filter((l) => SEMI_LITHO_LESSONS.some((row) => row.id === l.id));

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

describe("Lithography and Patterning coverage", () => {
  it("has 4 modules, 25 active concepts, and a lesson for each", () => {
    assert.equal(course.id, COURSE_ID);
    assert.equal(course.modules.length, 4);
    assert.equal(courseConcepts.length, 25);
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
    const process = coverage.coursesCovered.find((row) => row.courseId === PROCESS_ID);
    const foundations = coverage.coursesCovered.find((row) => row.courseId === FOUNDATIONS_ID);
    const microarch = coverage.coursesCovered.find((row) => row.courseId === MICROARCH_ID);
    const gpu = coverage.coursesCovered.find((row) => row.courseId === GPU_ID);
    assert.ok(self);
    assert.equal(self.coveragePct, 100);
    assert.equal(self.lackingLessons, 0);
    assert.ok(process);
    assert.equal(process.coveragePct, 100);
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

describe("Lithography and Patterning lesson integrity", () => {
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
    for (const lesson of lithoOnly) {
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
    for (const lesson of lithoOnly) {
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
    for (const lesson of lithoOnly) {
      assert.ok([5, 10, 20, 30].includes(lesson.durationMin), lesson.id);
      const tier = catalog.conceptMap[lesson.conceptId]?.tier ?? 2;
      if (tier <= 1) assert.ok(lesson.level === "intro" || lesson.level === "core", lesson.id);
      if (tier === 2) assert.ok(lesson.level === "core" || lesson.level === "intro", lesson.id);
      if (tier >= 4) assert.equal(lesson.level, "journalist", lesson.id);
    }
  });

  it("only references LessonDiagram names that exist", () => {
    for (const lesson of lithoOnly) {
      if (!lesson.diagram) continue;
      assert.ok(KNOWN_DIAGRAMS.has(lesson.diagram), `${lesson.id} unknown diagram ${lesson.diagram}`);
    }
  });

  it("keeps default 10-minute units and only justified variants", () => {
    const byConcept = new Map<string, number[]>();
    for (const lesson of lithoOnly) {
      const list = byConcept.get(lesson.conceptId) ?? [];
      list.push(lesson.durationMin);
      byConcept.set(lesson.conceptId, list);
    }
    for (const concept of courseConcepts) {
      const durations = byConcept.get(concept.id) ?? [];
      assert.ok(durations.includes(10), `${concept.id} missing a 10-minute unit`);
    }
    const twenties = lithoOnly.filter((l) => l.durationMin === 20).map((l) => l.conceptId).sort();
    assert.deepEqual(twenties, ["semi-euv", "semi-multi-pattern", "semi-rayleigh", "semi-stochastics"].sort());
    assert.equal(lithoOnly.filter((l) => l.durationMin === 30).length, 0);
    assert.equal(lithoOnly.filter((l) => l.durationMin === 5).length, 0);
  });

  it("does not collide with leftover cpu-semi seeds", () => {
    const lithoIds = new Set(lithoOnly.map((l) => l.id));
    for (const lesson of CPU_SEMI_LESSONS) {
      assert.equal(lithoIds.has(lesson.id), false, `legacy seed reuses ${lesson.id}`);
      assert.equal(
        courseConcepts.some((c) => c.id === lesson.conceptId),
        false,
        `legacy seed occupies litho concept ${lesson.conceptId}`,
      );
    }
  });
});

describe("Lithography and Patterning quiz QA", () => {
  it("gives every lesson a 3-item curriculum-aware quiz with valid distractors", () => {
    for (const lesson of lithoOnly) {
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
    for (const lesson of lithoOnly) {
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
    for (const lesson of lithoOnly) {
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
    for (const lesson of lithoOnly) {
      for (const question of lesson.quiz) {
        const correct = question.choices[question.answerIndex];
        const shuffled = shuffleQuestion(question, rng);
        assert.equal(shuffled.choices[shuffled.answerIndex], correct, `${lesson.id}/${question.id}`);
        assert.equal(new Set(shuffled.choices).size, 4, `${lesson.id}/${question.id}`);
      }
    }
  });
});

describe("Lithography and Patterning sources and cross-course edges", () => {
  it("records the lithography sources this course is allowed to lean on", () => {
    for (const ref of course.sourceReferences) {
      assert.ok(SOURCE_MAP[ref.id ?? ""], ref.id);
    }
    assert.ok(SOURCE_MAP["mit-6152j"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["asml-optics"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["asml-euv"].informed.includes(COURSE_ID));
    assert.equal(SOURCE_MAP["mit-6774"].informed.includes(COURSE_ID), false);
  });

  it("only depends on reachable Process Foundations concepts", () => {
    const processIds = new Set(catalog.courseMap[PROCESS_ID].modules.flatMap((m) => m.conceptIds));
    const needed = new Set<string>();
    for (const concept of courseConcepts) {
      for (const pre of concept.prerequisites) {
        if (catalog.conceptMap[pre]?.courseId !== COURSE_ID) needed.add(pre);
      }
    }
    for (const pre of course.entryRequirements) needed.add(pre);
    assert.deepEqual([...needed].sort(), ["semi-etch-plasma", "semi-planarity", "semi-wafer"]);
    for (const pre of needed) {
      assert.ok(catalog.conceptMap[pre], `missing cross-course prereq ${pre}`);
      assert.ok(processIds.has(pre), `${pre} is not in Process Foundations`);
      const closure = prereqClosure(catalog, pre);
      for (const id of closure) {
        if (id === pre) continue;
        const home = catalog.conceptMap[id]?.courseId;
        assert.ok(!home || home === PROCESS_ID, `unrooted ${pre} via ${id} in ${home}`);
      }
    }
  });

  it("documents the planarity and DUV topology repairs", () => {
    assert.deepEqual(
      [...catalog.conceptMap["semi-litho"].prerequisites].sort(),
      ["semi-planarity", "semi-wafer"],
    );
    assert.deepEqual(
      [...catalog.conceptMap["semi-euv"].prerequisites].sort(),
      ["semi-duv", "semi-litho"],
    );
    assert.deepEqual(course.entryRequirements.slice().sort(), ["semi-planarity", "semi-wafer"]);
  });
});

describe("Lithography and Patterning progression", () => {
  it("keeps a fresh semiconductor learner in Process Foundations", () => {
    const ctx = makeReadinessContext(catalog, {});
    assert.equal(pickCourseForLearner(catalog, "semiconductors", ctx)?.id, PROCESS_ID);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-litho"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-euv"], ctx), false);
    for (const lesson of lithoOnly) {
      assert.equal(isLessonUnlocked(lesson, ctx), false, lesson.id);
    }
  });

  it("does not unlock lithography from wafer knowledge alone", () => {
    const ctx = makeReadinessContext(catalog, heldAll(["semi-crystal", "semi-wafer"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-litho"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-resist"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-euv"], ctx), false);
    assert.equal(pickCourseForLearner(catalog, "semiconductors", ctx)?.id, PROCESS_ID);
  });

  it("opens photolithography only after process foundations, including planarity", () => {
    const ctx = makeReadinessContext(catalog, heldAll(PROCESS_IDS));
    assert.equal(pickCourseForLearner(catalog, "semiconductors", ctx)?.id, COURSE_ID);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-litho"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-resist"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-rayleigh"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-euv"], ctx), false);
    const front = frontierConcepts(course, ctx).map((c) => c.id);
    assert.deepEqual(front, ["semi-litho"]);
  });

  it("can reach every concept from the prerequisite graph", () => {
    const progress = heldAll(PROCESS_IDS);
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
    assert.ok(seen.has("semi-overlay"));
    assert.ok(seen.has("semi-stochastics"));
    assert.ok(seen.has("semi-pitch-split"));
  });

  it("will not jump from a basic stencil to EUV", () => {
    const afterIntro = makeReadinessContext(
      catalog,
      heldAll([...PROCESS_IDS, "semi-litho", "semi-resist", "semi-mask", "semi-exposure", "semi-alignment"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-rayleigh"], afterIntro), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-ler"], afterIntro), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-duv"], afterIntro), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-euv"], afterIntro), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-na"], afterIntro), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-stochastics"], afterIntro), false);
  });

  it("opens EUV only after DUV, not after the intro stencil", () => {
    const lithoOnlyHeld = makeReadinessContext(catalog, heldAll([...PROCESS_IDS, "semi-litho"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-euv"], lithoOnlyHeld), false);

    const throughDuv = makeReadinessContext(
      catalog,
      heldAll([...PROCESS_IDS, "semi-litho", "semi-rayleigh", "semi-duv"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-euv"], throughDuv), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-euv-source"], throughDuv), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na"], throughDuv), false);
  });

  it("keeps multiple patterning locked until plasma etch and DUV both exist", () => {
    const noEtch = makeReadinessContext(
      catalog,
      heldAll(["semi-crystal", "semi-wafer", "semi-planarity", "semi-litho", "semi-rayleigh", "semi-duv"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-multi-pattern"], noEtch), false);

    const withEtch = makeReadinessContext(
      catalog,
      heldAll([...PROCESS_IDS, "semi-litho", "semi-rayleigh", "semi-duv"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-multi-pattern"], withEtch), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-pitch-split"], withEtch), false);
  });

  it("honours knownConceptIds without opening EUV", () => {
    const ctx = makeReadinessContext(
      catalog,
      {},
      profileWith(["semi-wafer", "semi-planarity", "semi-etch-plasma"]),
    );
    assert.equal(isDemonstrated("semi-planarity", ctx, 1), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-litho"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-euv"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-multi-pattern"], ctx), false);
  });

  it("keeps a lapsed concept available for review", () => {
    const ctx = makeReadinessContext(catalog, {
      ...heldAll(PROCESS_IDS),
      "semi-litho": held("semi-litho", {
        understanding: "didnt_get_it",
        lastQuizScore: 0.33,
        lapseCount: 2,
      }),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-litho"], ctx), true);
    assert.ok(lithoOnly.some((l) => l.conceptId === "semi-litho" && isLessonUnlocked(l, ctx)));
  });

  it("keeps Surprise Me on this course's frontier once process is done", () => {
    const afterProcess = selectLesson(
      { minutes: 10, category: "semiconductors", effort: null, mode: "surprise", journalistDepth: false },
      heldAll(PROCESS_IDS),
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterProcess);
    assert.equal(afterProcess.lesson.conceptId, "semi-litho");
    assert.equal(afterProcess.lesson.durationMin, 10);

    const afterLitho = selectLesson(
      { minutes: 10, category: "semiconductors", effort: null, mode: "surprise", journalistDepth: false },
      heldAll([...PROCESS_IDS, "semi-litho"]),
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterLitho);
    assert.ok(
      ["semi-resist", "semi-mask", "semi-alignment", "semi-rayleigh"].includes(afterLitho.lesson.conceptId),
      afterLitho.lesson.conceptId,
    );
    assert.notEqual(afterLitho.lesson.conceptId, "semi-euv");
    assert.notEqual(afterLitho.lesson.conceptId, "semi-duv");
    assert.notEqual(afterLitho.lesson.conceptId, "semi-high-na");
  });

  it("has a healthy seeded topology", () => {
    const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(errors, []);
  });
});
