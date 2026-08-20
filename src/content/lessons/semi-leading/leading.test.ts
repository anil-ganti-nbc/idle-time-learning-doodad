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
import { SEMI_LEADING_LESSONS } from "./index.ts";
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

const COURSE_ID = "semi-leading";
const PROCESS_ID = "semi-process";
const LITHO_ID = "semi-litho";
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
const LITHO_IDS = [
  "semi-litho",
  "semi-resist",
  "semi-mask",
  "semi-exposure",
  "semi-alignment",
  "semi-rayleigh",
  "semi-k1",
  "semi-process-window",
  "semi-focus-expose",
  "semi-ler",
  "semi-duv",
  "semi-immersion",
  "semi-opc",
  "semi-pec",
  "semi-multi-pattern",
  "semi-pitch-split",
  "semi-overlay-basics",
  "semi-euv",
  "semi-euv-source",
  "semi-euv-mirrors",
  "semi-euv-vacuum",
  "semi-pellicle",
  "semi-stochastics",
  "semi-na",
  "semi-overlay",
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
const leadingOnly = courseLessons.filter((l) => SEMI_LEADING_LESSONS.some((row) => row.id === l.id));

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

describe("Modern Leading-Edge Manufacturing coverage", () => {
  it("has 4 modules, 22 active concepts, and a lesson for each", () => {
    assert.equal(course.id, COURSE_ID);
    assert.equal(course.modules.length, 4);
    assert.equal(courseConcepts.length, 22);
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
    const litho = coverage.coursesCovered.find((row) => row.courseId === LITHO_ID);
    const foundations = coverage.coursesCovered.find((row) => row.courseId === FOUNDATIONS_ID);
    const microarch = coverage.coursesCovered.find((row) => row.courseId === MICROARCH_ID);
    const gpu = coverage.coursesCovered.find((row) => row.courseId === GPU_ID);
    assert.ok(self);
    assert.equal(self.coveragePct, 100);
    assert.equal(self.lackingLessons, 0);
    assert.ok(process);
    assert.equal(process.coveragePct, 100);
    assert.ok(litho);
    assert.equal(litho.coveragePct, 100);
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

describe("Modern Leading-Edge Manufacturing lesson integrity", () => {
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
    for (const lesson of leadingOnly) {
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
    for (const lesson of leadingOnly) {
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
    for (const lesson of leadingOnly) {
      assert.ok([5, 10, 20, 30].includes(lesson.durationMin), lesson.id);
      const tier = catalog.conceptMap[lesson.conceptId]?.tier ?? 2;
      if (tier >= 4) assert.equal(lesson.level, "journalist", lesson.id);
    }
  });

  it("only references LessonDiagram names that exist", () => {
    for (const lesson of leadingOnly) {
      if (!lesson.diagram) continue;
      assert.ok(KNOWN_DIAGRAMS.has(lesson.diagram), `${lesson.id} unknown diagram ${lesson.diagram}`);
    }
  });

  it("keeps default 10-minute units and only justified variants", () => {
    const byConcept = new Map<string, number[]>();
    for (const lesson of leadingOnly) {
      const list = byConcept.get(lesson.conceptId) ?? [];
      list.push(lesson.durationMin);
      byConcept.set(lesson.conceptId, list);
    }
    for (const concept of courseConcepts) {
      const durations = byConcept.get(concept.id) ?? [];
      assert.ok(durations.includes(10), `${concept.id} missing a 10-minute unit`);
    }
    const twenties = leadingOnly.filter((l) => l.durationMin === 20).map((l) => l.conceptId).sort();
    assert.deepEqual(
      twenties,
      [
        "semi-backside-power",
        "semi-gag",
        "semi-high-na",
        "semi-mask-3d",
        "semi-overlay-budget",
        "semi-stochastic-limit",
      ].sort(),
    );
    assert.equal(leadingOnly.filter((l) => l.durationMin === 30).length, 0);
    assert.equal(leadingOnly.filter((l) => l.durationMin === 5).length, 0);
  });

  it("does not collide with leftover cpu-semi seeds", () => {
    const leadingIds = new Set(leadingOnly.map((l) => l.id));
    for (const lesson of CPU_SEMI_LESSONS) {
      assert.equal(leadingIds.has(lesson.id), false, `legacy seed reuses ${lesson.id}`);
      assert.equal(
        courseConcepts.some((c) => c.id === lesson.conceptId),
        false,
        `legacy seed occupies leading concept ${lesson.conceptId}`,
      );
    }
  });
});

describe("Modern Leading-Edge Manufacturing quiz QA", () => {
  it("gives every lesson a 3-item curriculum-aware quiz with valid distractors", () => {
    for (const lesson of leadingOnly) {
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
    for (const lesson of leadingOnly) {
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
    for (const lesson of leadingOnly) {
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
    for (const lesson of leadingOnly) {
      for (const question of lesson.quiz) {
        const correct = question.choices[question.answerIndex];
        const shuffled = shuffleQuestion(question, rng);
        assert.equal(shuffled.choices[shuffled.answerIndex], correct, `${lesson.id}/${question.id}`);
        assert.equal(new Set(shuffled.choices).size, 4, `${lesson.id}/${question.id}`);
      }
    }
  });
});

describe("Modern Leading-Edge Manufacturing sources", () => {
  it("records the leading-edge sources this course is allowed to lean on", () => {
    for (const ref of course.sourceReferences) {
      assert.ok(SOURCE_MAP[ref.id ?? ""], ref.id);
    }
    assert.ok(SOURCE_MAP["asml-euv"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["asml-optics"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["asml-high-na"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["imec-nanosheet"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["imec-bspdn"].informed.includes(COURSE_ID));
    assert.equal(SOURCE_MAP["mit-6774"].informed.includes(COURSE_ID), false);
  });
});

describe("Modern Leading-Edge Manufacturing cross-course prerequisites", () => {
  it("only depends on Process Foundations or Lithography and Patterning", () => {
    const processIds = new Set(catalog.courseMap[PROCESS_ID].modules.flatMap((m) => m.conceptIds));
    const lithoIds = new Set(catalog.courseMap[LITHO_ID].modules.flatMap((m) => m.conceptIds));
    const prior = new Set([...processIds, ...lithoIds]);
    const needed = new Set<string>();
    for (const concept of courseConcepts) {
      for (const pre of concept.prerequisites) {
        if (catalog.conceptMap[pre]?.courseId !== COURSE_ID) needed.add(pre);
      }
    }
    for (const pre of course.entryRequirements) needed.add(pre);
    assert.ok(needed.has("semi-na"));
    assert.ok(needed.has("semi-euv"));
    assert.ok(needed.has("semi-integration"));
    for (const pre of needed) {
      assert.ok(catalog.conceptMap[pre], `missing cross-course prereq ${pre}`);
      assert.ok(prior.has(pre), `${pre} is not in Process Foundations or Lithography`);
      const closure = prereqClosure(catalog, pre);
      for (const id of closure) {
        if (id === pre) continue;
        const home = catalog.conceptMap[id]?.courseId;
        assert.ok(
          !home || home === PROCESS_ID || home === LITHO_ID,
          `unrooted ${pre} via ${id} in ${home}`,
        );
      }
    }
  });
});

describe("Modern Leading-Edge Manufacturing progression", () => {
  it("does not open High-NA from wafer or process-only knowledge", () => {
    const fresh = makeReadinessContext(catalog, {});
    assert.equal(pickCourseForLearner(catalog, "semiconductors", fresh)?.id, PROCESS_ID);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na"], fresh), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-finfet"], fresh), false);

    const processOnly = makeReadinessContext(catalog, heldAll(PROCESS_IDS));
    assert.equal(pickCourseForLearner(catalog, "semiconductors", processOnly)?.id, LITHO_ID);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na"], processOnly), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-gag"], processOnly), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-finfet"], processOnly), true);
  });

  it("opens the intended first-module frontier after both prior courses", () => {
    const ctx = makeReadinessContext(catalog, heldAll([...PROCESS_IDS, ...LITHO_IDS]));
    assert.equal(pickCourseForLearner(catalog, "semiconductors", ctx)?.id, COURSE_ID);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-mask-3d"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na-optics"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-anamorphic"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-gag"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-chiplets"], ctx), false);
    const front = frontierConcepts(course, ctx).map((c) => c.id);
    assert.ok(front.includes("semi-high-na"), String(front));
    assert.ok(front.includes("semi-mask-3d"), String(front));
    assert.equal(front[0] === "semi-mask-3d" || front[0] === "semi-high-na", true, front[0]);
  });

  it("keeps anamorphic behind High-NA optics and GAA behind FinFET", () => {
    const afterHighNa = makeReadinessContext(
      catalog,
      heldAll([...PROCESS_IDS, ...LITHO_IDS, "semi-high-na"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na-optics"], afterHighNa), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na-mask"], afterHighNa), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na-process"], afterHighNa), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-anamorphic"], afterHighNa), false);

    const afterOptics = makeReadinessContext(
      catalog,
      heldAll([...PROCESS_IDS, ...LITHO_IDS, "semi-high-na", "semi-high-na-optics"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-anamorphic"], afterOptics), true);

    const afterFinfet = makeReadinessContext(
      catalog,
      heldAll([...PROCESS_IDS, ...LITHO_IDS, "semi-finfet"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-gag"], afterFinfet), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-cfet"], afterFinfet), false);
  });

  it("can reach every concept from the prerequisite graph", () => {
    const progress: Record<string, ConceptProgress> = {
      ...heldAll([...PROCESS_IDS, ...LITHO_IDS]),
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
    assert.ok(seen.has("semi-scaling-wall"));
    assert.ok(seen.has("semi-cfet"));
    assert.ok(seen.has("semi-anamorphic"));
  });

  it("honours knownConceptIds only for real graph prerequisites", () => {
    const ctx = makeReadinessContext(
      catalog,
      {},
      profileWith(["semi-na", "semi-integration", "semi-euv"]),
    );
    assert.equal(isDemonstrated("semi-na", ctx, 5), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-anamorphic"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-gag"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-chiplets"], ctx), false);
  });

  it("keeps a lapsed concept available for review", () => {
    const ctx = makeReadinessContext(catalog, {
      ...heldAll([...PROCESS_IDS, ...LITHO_IDS]),
      "semi-high-na": held("semi-high-na", {
        understanding: "didnt_get_it",
        lastQuizScore: 0.33,
        lapseCount: 2,
      }),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["semi-high-na"], ctx), true);
    assert.ok(leadingOnly.some((l) => l.conceptId === "semi-high-na" && isLessonUnlocked(l, ctx)));
  });

  it("keeps Surprise Me on this course's frontier once both prior courses are done", () => {
    const afterBoth = selectLesson(
      { minutes: 10, category: "semiconductors", effort: null, mode: "surprise", journalistDepth: false },
      heldAll([...PROCESS_IDS, ...LITHO_IDS]),
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterBoth);
    assert.ok(
      ["semi-high-na", "semi-mask-3d"].includes(afterBoth.lesson.conceptId),
      afterBoth.lesson.conceptId,
    );
    assert.equal(afterBoth.lesson.durationMin, 10);
    assert.notEqual(afterBoth.lesson.conceptId, "semi-gag");
    assert.notEqual(afterBoth.lesson.conceptId, "semi-scaling-wall");
    assert.notEqual(afterBoth.lesson.conceptId, "semi-anamorphic");

    const afterHighNa = selectLesson(
      { minutes: 10, category: "semiconductors", effort: null, mode: "surprise", journalistDepth: false },
      heldAll([...PROCESS_IDS, ...LITHO_IDS, "semi-high-na", "semi-mask-3d"]),
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterHighNa);
    assert.notEqual(afterHighNa.lesson.conceptId, "semi-scaling-wall");
    assert.notEqual(afterHighNa.lesson.conceptId, "semi-cfet");
    assert.notEqual(afterHighNa.lesson.conceptId, "semi-chiplets");
  });

  it("has a healthy seeded topology", () => {
    const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(errors, []);
  });
});
