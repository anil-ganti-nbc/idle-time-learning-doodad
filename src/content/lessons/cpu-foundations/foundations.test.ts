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
import { CPU_FOUNDATIONS_LESSONS } from "./index.ts";
import { computeCoverage } from "../../curriculum/coverage.ts";
import { validateCurriculum } from "../../curriculum/validate.ts";
import { buildCatalog } from "../../../lib/learning/catalog.ts";
import { conceptsInCourse, lessonsInCourse } from "../../../lib/learning/curriculum.ts";
import {
  frontierConcepts,
  isConceptUnlocked,
  isDemonstrated,
  isLessonUnlocked,
  makeReadinessContext,
} from "../../../lib/learning/readiness.ts";
import { selectLesson } from "../../../lib/learning/select.ts";
import { emptyProgress } from "../../../lib/learning/srs.ts";
import type { ConceptProgress, LocalProfile } from "../../../lib/learning/types.ts";
import { assembleQuiz } from "../../../lib/quiz/assemble.ts";
import { validateDistractors } from "../../../lib/quiz/distractors.ts";
import { allowedKnowledge } from "../../../lib/quiz/knowledge.ts";
import { mixIsDistinct, objectiveCoverage } from "../../../lib/quiz/mix.ts";
import { createSeededRng, shuffleQuestion } from "../../../lib/quiz/shuffle.ts";

const COURSE_ID = "cpu-foundations";
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
]);
const OTHER_BULK_COURSES = [
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
  [...CPU_FOUNDATIONS_LESSONS, ...CPU_SEMI_LESSONS, ...GPU_LESSONS, ...SYSTEMS_LESSONS, ...SCIENCE_LESSONS, ...CULTURE_LESSONS, ...LONGFORM_LESSONS],
  [],
  [],
  [],
  COURSES,
);

const course = catalog.courseMap[COURSE_ID];
const courseConcepts = conceptsInCourse(catalog, course);
const courseLessons = lessonsInCourse(catalog, course);
const foundationOnly = courseLessons.filter((l) => CPU_FOUNDATIONS_LESSONS.some((row) => row.id === l.id));

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

function profileWith(known: string[]): LocalProfile {
  return {
    displayName: "tester",
    preferredTopics: [],
    knownConceptIds: known,
    avoidTopics: [],
    customInterests: [],
  };
}

describe("Computer Architecture Foundations coverage", () => {
  it("has 25 active concepts and a lesson for each", () => {
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
    assert.ok(self);
    assert.equal(self.coveragePct, 100);
    assert.equal(self.lackingLessons, 0);
    for (const id of OTHER_BULK_COURSES) {
      const row = coverage.coursesCovered.find((c) => c.courseId === id);
      assert.ok(row, id);
      assert.ok(row.coveragePct < 100, `${id} should not be fully populated`);
    }
  });
});

describe("Computer Architecture Foundations lesson integrity", () => {
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
});

describe("Computer Architecture Foundations quiz QA", () => {
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
      const allowed = allowedKnowledge(catalog, concept, makeReadinessContext(catalog, {
        [concept.id]: held(concept.id),
        ...Object.fromEntries(concept.prerequisites.map((id) => [id, held(id)])),
      }));
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
    for (const lesson of foundationOnly) {
      for (const question of lesson.quiz) {
        const correct = question.choices[question.answerIndex];
        const shuffled = shuffleQuestion(question, rng);
        assert.equal(shuffled.choices[shuffled.answerIndex], correct, `${lesson.id}/${question.id}`);
        assert.equal(new Set(shuffled.choices).size, 4, `${lesson.id}/${question.id}`);
      }
    }
  });
});

describe("Computer Architecture Foundations progression", () => {
  it("lets a fresh learner start only at the first concept", () => {
    const ctx = makeReadinessContext(catalog, {});
    const unlocked = courseConcepts.filter((c) => isConceptUnlocked(c, ctx)).map((c) => c.id);
    assert.deepEqual(unlocked, ["arch-latency-throughput"]);
    const front = frontierConcepts(course, ctx).map((c) => c.id);
    assert.deepEqual(front.slice(0, 1), ["arch-latency-throughput"]);
    for (const lesson of courseLessons) {
      const open = isLessonUnlocked(lesson, ctx);
      if (lesson.conceptId === "arch-latency-throughput") assert.equal(open, true, lesson.id);
      else assert.equal(open, false, lesson.id);
    }
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
  });

  it("will not skip ahead for a partially knowledgeable learner", () => {
    const progress = { "arch-latency-throughput": held("arch-latency-throughput") };
    const ctx = makeReadinessContext(catalog, progress);
    const unlocked = new Set(courseConcepts.filter((c) => isConceptUnlocked(c, ctx)).map((c) => c.id));
    assert.equal(unlocked.has("arch-latency-throughput"), true);
    assert.equal(unlocked.has("arch-data-parallel"), true);
    assert.equal(unlocked.has("cpu-pipeline"), true);
    assert.equal(unlocked.has("cpu-locality"), true);
    assert.equal(unlocked.has("cpu-isa"), true);
    assert.equal(unlocked.has("cpu-tlb"), false);
    assert.equal(unlocked.has("cpu-memory-wall"), false);
    assert.equal(unlocked.has("cpu-forwarding"), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cpu-hazards"], ctx), false);
  });

  it("honours knownConceptIds without opening the far end of the course", () => {
    const ctx = makeReadinessContext(
      catalog,
      {},
      profileWith(["arch-latency-throughput", "cpu-isa"]),
    );
    assert.equal(isDemonstrated("arch-latency-throughput", ctx, 1), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cpu-von-neumann"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cpu-memory-wall"], ctx), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["cpu-tlb"], ctx), false);
  });

  it("keeps a lapsed concept available for review", () => {
    const ctx = makeReadinessContext(catalog, {
      "arch-latency-throughput": held("arch-latency-throughput"),
      "cpu-pipeline": held("cpu-pipeline", {
        understanding: "didnt_get_it",
        lastQuizScore: 0.33,
        lapseCount: 2,
      }),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["cpu-pipeline"], ctx), true);
    assert.ok(courseLessons.some((l) => l.conceptId === "cpu-pipeline" && isLessonUnlocked(l, ctx)));
  });

  it("keeps Surprise Me on the course frontier", () => {
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

    const mid = selectLesson(
      { minutes: 10, category: "cpu", effort: null, mode: "surprise", journalistDepth: false },
      { "arch-latency-throughput": held("arch-latency-throughput") },
      [],
      catalog,
      undefined,
      { rng: () => 0 },
    );
    assert.ok(mid);
    assert.ok(
      ["arch-data-parallel", "cpu-perf-metrics", "cpu-isa", "cpu-pipeline", "cpu-locality"].includes(mid.lesson.conceptId),
      mid.lesson.conceptId,
    );
    assert.notEqual(mid.lesson.conceptId, "cpu-tlb");
    assert.notEqual(mid.lesson.conceptId, "cpu-memory-wall");
  });

  it("has a healthy seeded topology", () => {
    const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(errors, []);
  });
});
