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
import { OS_STORAGE_LESSONS } from "../os-storage/index.ts";
import { NET_FOUNDATIONS_LESSONS } from "../net-foundations/index.ts";
import { NET_TRANSPORT_LESSONS } from "../net-transport/index.ts";
import { NET_INTERNET_LESSONS } from "../net-internet/index.ts";
import { CMP_FRONTEND_LESSONS } from "./index.ts";
import { CMP_IR_LESSONS } from "../cmp-ir/index.ts";
import { CMP_BACKEND_LESSONS } from "../cmp-backend/index.ts";
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

const COURSE_ID = "cmp-frontend";
const IR_ID = "cmp-ir";
const BACKEND_ID = "cmp-backend";

const KNOWN_DIAGRAMS = new Set([
  "cmp-pipeline",
  "cmp-tokens",
  "cmp-ast-drop",
  "cmp-cfg-blocks",
  "cmp-ssa-phi",
  "cmp-dataflow",
  "cmp-isel-tile",
  "cmp-alloc-color",
  "cmp-frame-abi",
  "cmp-gc-roots",
]);

const OTHER_BULK_COURSES = ["ml-foundations", "mus-foundations", "dm-history", "horo-foundations"];

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
    ...NET_FOUNDATIONS_LESSONS,
    ...NET_TRANSPORT_LESSONS,
    ...NET_INTERNET_LESSONS,
    ...CMP_FRONTEND_LESSONS,
    ...CMP_IR_LESSONS,
    ...CMP_BACKEND_LESSONS,
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
const own = courseLessons.filter((l) => CMP_FRONTEND_LESSONS.some((row) => row.id === l.id));

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

describe("Compiler Front-End coverage", () => {
  it("has 3 modules, 22 active concepts, and a lesson for each", () => {
    assert.equal(course.id, COURSE_ID);
    assert.equal(course.modules.length, 3);
    assert.equal(courseConcepts.length, 22);
    const missing = courseConcepts.filter((c) => !courseLessons.some((l) => l.conceptId === c.id));
    assert.deepEqual(missing.map((c) => c.id), [], `uncovered: ${missing.map((c) => c.id).join(", ")}`);
  });

  it("completes the Compiler track and does not populate other subjects", () => {
    const coverage = computeCoverage(catalog);
    for (const id of [COURSE_ID, IR_ID, BACKEND_ID]) {
      const row = coverage.coursesCovered.find((c) => c.courseId === id);
      assert.ok(row, id);
      assert.equal(row.coveragePct, 100, id);
      assert.equal(row.lackingLessons, 0, id);
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

describe("Compiler Front-End lesson integrity", () => {
  it("keeps lesson IDs unique and quizzes unique within the course", () => {
    const ids = courseLessons.map((l) => l.id);
    assert.equal(new Set(ids).size, ids.length);
    const quizIds = own.flatMap((l) => l.quiz.map((q) => q.id));
    assert.equal(new Set(quizIds).size, quizIds.length, "quiz ids collide across this course");
    for (const lesson of own) {
      const qids = lesson.quiz.map((q) => q.id);
      assert.equal(qids.length, 3, lesson.id);
      assert.equal(new Set(qids).size, 3, lesson.id);
    }
  });

  it("binds every lesson to an existing concept in this course and module", () => {
    for (const lesson of own) {
      const concept = catalog.conceptMap[lesson.conceptId];
      assert.ok(concept, lesson.id);
      assert.equal(concept.courseId, COURSE_ID, lesson.id);
      assert.ok(
        course.modules.some((m) => m.id === concept.moduleId && m.conceptIds.includes(concept.id)),
        lesson.id,
      );
    }
  });

  it("matches authoritative prerequisites and uses only graph IDs", () => {
    for (const lesson of own) {
      const concept = catalog.conceptMap[lesson.conceptId];
      assert.deepEqual([...lesson.prerequisites].sort(), [...concept.prerequisites].sort(), lesson.id);
      for (const pre of lesson.prerequisites) {
        assert.ok(catalog.conceptMap[pre], `${lesson.id} unknown prereq ${pre}`);
      }
      if (lesson.goDeeper) {
        assert.ok(catalog.conceptMap[lesson.goDeeper], `${lesson.id} dangling goDeeper ${lesson.goDeeper}`);
      }
    }
  });

  it("uses valid durations and compatible tiers", () => {
    for (const lesson of own) {
      assert.ok([5, 10, 20, 30].includes(lesson.durationMin), lesson.id);
      const tier = catalog.conceptMap[lesson.conceptId]?.tier ?? 2;
      if (tier <= 1) assert.ok(lesson.level === "intro" || lesson.level === "core", lesson.id);
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

  it("keeps default 10-minute units and only justified variants", () => {
    const byConcept = new Map<string, number[]>();
    for (const lesson of own) {
      const list = byConcept.get(lesson.conceptId) ?? [];
      list.push(lesson.durationMin);
      byConcept.set(lesson.conceptId, list);
    }
    for (const concept of courseConcepts) {
      const durations = byConcept.get(concept.id) ?? [];
      assert.ok(durations.includes(10), `${concept.id} missing a 10-minute unit`);
    }
    const fives = own.filter((l) => l.durationMin === 5).map((l) => l.conceptId).sort();
    assert.deepEqual(fives, ["cmp-front", "cmp-token"]);
    const twenties = own.filter((l) => l.durationMin === 20).map((l) => l.conceptId).sort();
    assert.deepEqual(twenties, ["cmp-lr", "cmp-typecheck"]);
    assert.equal(own.filter((l) => l.durationMin === 30).length, 0);
  });

  it("does not collide with leftover systems seeds", () => {
    const ids = new Set(own.map((l) => l.id));
    for (const lesson of SYSTEMS_LESSONS) {
      assert.equal(ids.has(lesson.id), false, `legacy seed reuses ${lesson.id}`);
      assert.equal(
        courseConcepts.some((c) => c.id === lesson.conceptId),
        false,
        `legacy seed occupies frontend concept ${lesson.conceptId}`,
      );
    }
  });
});

describe("Compiler Front-End quiz QA", () => {
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
    for (const lesson of own) {
      const concept = catalog.conceptMap[lesson.conceptId];
      const mine = new Set(concept.objectives ?? []);
      assert.ok(mine.size > 0, `${concept.id} has no objectives`);
      assert.ok(objectiveCoverage(lesson.quiz).length > 0, lesson.id);
      for (const question of lesson.quiz) {
        assert.ok((question.objectiveIds ?? []).length > 0, `${lesson.id}/${question.id} missing objectives`);
        for (const obj of question.objectiveIds ?? []) {
          assert.ok(mine.has(obj), `${lesson.id}/${question.id} unknown or foreign objective: ${obj}`);
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
        assert.equal(new Set(shuffled.choices).size, 4, `${lesson.id}/${question.id}`);
      }
    }
  });

  it("varies cognitive types instead of stamping one advanced stencil", () => {
    const counts = new Map<string, number>();
    for (const lesson of own) {
      for (const question of lesson.quiz) {
        const kind = question.cognitiveType ?? "missing";
        counts.set(kind, (counts.get(kind) ?? 0) + 1);
      }
    }
    assert.ok((counts.get("recognize") ?? 0) + (counts.get("identify") ?? 0) >= 6, String(counts.get("recognize")));
    assert.ok((counts.get("apply") ?? 0) + (counts.get("trace") ?? 0) >= 6);
    const advanced = (counts.get("integrate") ?? 0) + (counts.get("tradeoff") ?? 0);
    assert.equal(advanced, 0, "foundations should not stamp integrate/tradeoff");
    assert.ok([...counts.keys()].length >= 5, [...counts.keys()].join(","));
  });
});

describe("Compiler Front-End sources", () => {
  it("records the sources this course is allowed to lean on", () => {
    for (const ref of course.sourceReferences) {
      assert.ok(SOURCE_MAP[ref.id ?? ""], ref.id);
    }
    assert.ok(SOURCE_MAP["stanford-cs143"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["dragon-book"].informed.includes(COURSE_ID));
  });
});

describe("Compiler Front-End progression", () => {
  it("lets a fresh learner start only at the front end overview", () => {
    const ctx = makeReadinessContext(catalog, {});
    assert.equal(pickCourseForLearner(catalog, "compilers", ctx)?.id, COURSE_ID);
    const unlocked = courseConcepts.filter((c) => isConceptUnlocked(c, ctx)).map((c) => c.id);
    assert.deepEqual(unlocked, ["cmp-front"]);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-token"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-typecheck"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-ssa"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-alloc"], ctx), false);
  });

  it("opens tokens and grammars after the overview, not SSA", () => {
    const ctx = makeReadinessContext(catalog, heldAll(["cmp-front"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-token"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-cfg"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-typecheck"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-ssa"], ctx), false);
    const front = frontierConcepts(course, ctx).map((c) => c.id);
    assert.ok(front.includes("cmp-token"), String(front));
    assert.ok(front.includes("cmp-cfg"), String(front));
  });

  it("keeps type checking behind name resolution", () => {
    const afterAst = makeReadinessContext(catalog, heldAll(["cmp-front", "cmp-cfg", "cmp-parse-tree", "cmp-ast"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-symbol-table"], afterAst), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-typecheck"], afterAst), false);
    const afterNames = makeReadinessContext(
      catalog,
      heldAll(["cmp-front", "cmp-cfg", "cmp-parse-tree", "cmp-ast", "cmp-symbol-table", "cmp-scope", "cmp-name-resolve"]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-typecheck"], afterNames), true);
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
    assert.deepEqual([...seen].sort(), courseConcepts.map((c) => c.id).sort());
  });

  it("honours knownConceptIds only for real graph prerequisites", () => {
    const ctx = makeReadinessContext(catalog, {}, profileWith(["cmp-front"]));
    assert.equal(isDemonstrated("cmp-front", ctx, 1), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-token"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-typecheck"], ctx), false);
  });

  it("keeps a lapsed concept available for review", () => {
    const ctx = makeReadinessContext(catalog, {
      "cmp-front": held("cmp-front"),
      "cmp-token": held("cmp-token", {
        understanding: "didnt_get_it",
        lastQuizScore: 0.33,
        lapseCount: 2,
      }),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-token"], ctx), true);
    assert.ok(own.some((l) => l.conceptId === "cmp-token" && isLessonUnlocked(l, ctx)));
  });

  it("keeps Surprise Me on this course's frontier", () => {
    const fresh = selectLesson(
      { minutes: 10, category: "compilers", effort: null, mode: "surprise", journalistDepth: false },
      {},
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(fresh);
    assert.equal(fresh.lesson.conceptId, "cmp-front");
    assert.notEqual(fresh.lesson.conceptId, "cmp-ssa");
    assert.notEqual(fresh.lesson.conceptId, "cmp-alloc");

    const afterFront = selectLesson(
      { minutes: 10, category: "compilers", effort: null, mode: "surprise", journalistDepth: false },
      heldAll(["cmp-front"]),
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(afterFront);
    assert.ok(["cmp-token", "cmp-cfg"].includes(afterFront.lesson.conceptId), afterFront.lesson.conceptId);
    assert.notEqual(afterFront.lesson.conceptId, "cmp-ssa");
  });

  it("has a healthy seeded topology", () => {
    const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(errors, []);
  });
});
