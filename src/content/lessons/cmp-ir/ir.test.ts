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
import { CMP_FRONTEND_LESSONS } from "../cmp-frontend/index.ts";
import { CMP_IR_LESSONS } from "./index.ts";
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
  makeReadinessContext,
  pickCourseForLearner,
} from "../../../lib/learning/readiness.ts";
import { emptyProgress } from "../../../lib/learning/srs.ts";
import type { ConceptProgress } from "../../../lib/learning/types";
import { assembleQuiz } from "../../../lib/quiz/assemble";
import { validateDistractors } from "../../../lib/quiz/distractors.ts";
import { allowedKnowledge } from "../../../lib/quiz/knowledge.ts";
import { mixIsDistinct, objectiveCoverage } from "../../../lib/quiz/mix.ts";
import { createSeededRng, shuffleQuestion } from "../../../lib/quiz/shuffle.ts";

const COURSE_ID = "cmp-ir";
const FRONTEND_ID = "cmp-frontend";
const BACKEND_ID = "cmp-backend";

const FRONTEND_IDS = [
  "cmp-front",
  "cmp-token",
  "cmp-regex-lex",
  "cmp-source-loc",
  "cmp-preproc",
  "cmp-macro",
  "cmp-cfg",
  "cmp-parse-tree",
  "cmp-ast",
  "cmp-recursive-descent",
  "cmp-lr",
  "cmp-ambiguity",
  "cmp-grammar-class",
  "cmp-semantic-action",
  "cmp-error-recovery",
  "cmp-symbol-table",
  "cmp-scope",
  "cmp-name-resolve",
  "cmp-typecheck",
  "cmp-overload",
  "cmp-visitor",
  "cmp-ir-lower-intro",
];

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
const own = courseLessons.filter((l) => CMP_IR_LESSONS.some((row) => row.id === l.id));

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

describe("IR and Optimisation coverage", () => {
  it("has 3 modules, 22 active concepts, and a lesson for each", () => {
    assert.equal(course.id, COURSE_ID);
    assert.equal(course.modules.length, 3);
    assert.equal(courseConcepts.length, 22);
    const missing = courseConcepts.filter((c) => !courseLessons.some((l) => l.conceptId === c.id));
    assert.deepEqual(missing.map((c) => c.id), [], `uncovered: ${missing.map((c) => c.id).join(", ")}`);
  });

  it("completes the Compiler track and leaves other subjects alone", () => {
    const coverage = computeCoverage(catalog);
    for (const id of [FRONTEND_ID, COURSE_ID, BACKEND_ID]) {
      const row = coverage.coursesCovered.find((c) => c.courseId === id);
      assert.ok(row, id);
      assert.equal(row.coveragePct, 100, id);
    }
    for (const id of ["ml-foundations", "mus-foundations"]) {
      const row = coverage.coursesCovered.find((c) => c.courseId === id);
      assert.ok(row, id);
      assert.ok(row.coveragePct < 100, id);
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

describe("IR and Optimisation lesson integrity", () => {
  it("keeps lesson and quiz IDs unique", () => {
    const ids = own.map((l) => l.id);
    assert.equal(new Set(ids).size, ids.length);
    const quizIds = own.flatMap((l) => l.quiz.map((q) => q.id));
    assert.equal(new Set(quizIds).size, quizIds.length);
  });

  it("matches authoritative prerequisites", () => {
    for (const lesson of own) {
      const concept = catalog.conceptMap[lesson.conceptId];
      assert.equal(concept.courseId, COURSE_ID, lesson.id);
      assert.deepEqual([...lesson.prerequisites].sort(), [...concept.prerequisites].sort(), lesson.id);
      if (lesson.goDeeper) assert.ok(catalog.conceptMap[lesson.goDeeper], lesson.id);
    }
  });

  it("only references known diagrams", () => {
    for (const lesson of own) {
      if (lesson.diagram) assert.ok(KNOWN_DIAGRAMS.has(lesson.diagram), `${lesson.id} ${lesson.diagram}`);
    }
  });

  it("keeps default 10-minute units and only justified variants", () => {
    for (const concept of courseConcepts) {
      assert.ok(
        own.some((l) => l.conceptId === concept.id && l.durationMin === 10),
        `${concept.id} missing a 10-minute unit`,
      );
    }
    assert.deepEqual(
      own.filter((l) => l.durationMin === 5).map((l) => l.conceptId).sort(),
      ["cmp-three-addr"],
    );
    assert.deepEqual(
      own.filter((l) => l.durationMin === 20).map((l) => l.conceptId).sort(),
      ["cmp-dataflow", "cmp-licm", "cmp-ssa"],
    );
  });

  it("does not collide with leftover systems seeds", () => {
    for (const lesson of SYSTEMS_LESSONS) {
      assert.equal(own.some((l) => l.id === lesson.id), false, lesson.id);
      assert.equal(courseConcepts.some((c) => c.id === lesson.conceptId), false, lesson.conceptId);
    }
  });
});

describe("IR and Optimisation quiz QA", () => {
  it("assembles a distinct 3-item quiz with valid distractors", () => {
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

  it("keeps quiz objectives on the current concept", () => {
    for (const lesson of own) {
      const mine = new Set(catalog.conceptMap[lesson.conceptId].objectives ?? []);
      assert.ok(objectiveCoverage(lesson.quiz).length > 0, lesson.id);
      for (const question of lesson.quiz) {
        for (const obj of question.objectiveIds ?? []) {
          assert.ok(mine.has(obj), `${lesson.id}/${question.id} ${obj}`);
        }
      }
    }
  });

  it("does not assume future-course knowledge", () => {
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
            `${lesson.id}/${question.id} ${pre}`,
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

  it("does not stamp a mechanical advanced cognitive jacket", () => {
    const counts = new Map<string, number>();
    for (const lesson of own) {
      for (const question of lesson.quiz) {
        const kind = question.cognitiveType ?? "missing";
        counts.set(kind, (counts.get(kind) ?? 0) + 1);
      }
    }
    const advanced = (counts.get("integrate") ?? 0) + (counts.get("tradeoff") ?? 0);
    assert.ok(advanced <= 4, `integrate/tradeoff ${advanced}`);
    assert.ok((counts.get("apply") ?? 0) + (counts.get("predict") ?? 0) >= 8);
    assert.ok([...counts.keys()].length >= 4, [...counts.keys()].join(","));
  });
});

describe("IR and Optimisation sources", () => {
  it("records the sources this course is allowed to lean on", () => {
    for (const ref of course.sourceReferences) {
      assert.ok(SOURCE_MAP[ref.id ?? ""], ref.id);
    }
    assert.ok(SOURCE_MAP["cmu-15411"].informed.includes(COURSE_ID));
    assert.ok(SOURCE_MAP["llvm-langref"].informed.includes(COURSE_ID));
  });
});

describe("IR and Optimisation progression", () => {
  it("keeps a fresh Compilers learner in the front end", () => {
    const ctx = makeReadinessContext(catalog, {});
    assert.equal(pickCourseForLearner(catalog, "compilers", ctx)?.id, FRONTEND_ID);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-three-addr"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-ssa"], ctx), false);
  });

  it("does not unlock SSA from front-end entry alone", () => {
    assert.deepEqual(catalog.conceptMap["cmp-ssa"].prerequisites, ["cmp-three-addr"]);
    const onlyFront = makeReadinessContext(catalog, heldAll(["cmp-front"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-ssa"], onlyFront), false);
    const afterFrontend = makeReadinessContext(catalog, heldAll(FRONTEND_IDS));
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-three-addr"], afterFrontend), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-ssa"], afterFrontend), false);
  });

  it("unlocks SSA after three-address IR, not after lexing", () => {
    const afterThree = makeReadinessContext(catalog, heldAll([...FRONTEND_IDS, "cmp-three-addr"]));
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-ssa"], afterThree), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-phi"], afterThree), false);
    assert.equal(isDemonstrated("cmp-three-addr", afterThree, 2), true);
  });

  it("opens the IR frontier after lowering, not allocation", () => {
    const ctx = makeReadinessContext(catalog, heldAll(FRONTEND_IDS));
    assert.equal(pickCourseForLearner(catalog, "compilers", ctx)?.id, COURSE_ID);
    const front = frontierConcepts(course, ctx).map((c) => c.id);
    assert.ok(front.includes("cmp-three-addr"), String(front));
    assert.equal(isConceptUnlocked(catalog.conceptMap["cmp-alloc"], ctx), false);
  });

  it("can reach every concept once the front end is held", () => {
    const progress = heldAll([...FRONTEND_IDS, "cpu-vector-simd"]);
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

  it("has a healthy seeded topology", () => {
    const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(errors, []);
  });
});
