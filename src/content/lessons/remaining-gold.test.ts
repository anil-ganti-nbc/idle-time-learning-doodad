import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../categories.ts";
import { CONCEPTS } from "../concepts.ts";
import { COURSES } from "../courses/index.ts";
import { CULTURE_LESSONS } from "./culture.ts";
import { SCIENCE_LESSONS } from "./science.ts";
import { ML_FOUNDATIONS_LESSONS } from "./ml-foundations/index.ts";
import { HORO_FOUNDATIONS_LESSONS } from "./horo-foundations/index.ts";
import { MUS_FOUNDATIONS_LESSONS } from "./mus-foundations/index.ts";
import { DM_HISTORY_LESSONS } from "./dm-history/index.ts";
import { buildCatalog } from "../../lib/learning/catalog.ts";
import { assembleQuiz } from "../../lib/quiz/assemble";
import { validateDistractors } from "../../lib/quiz/distractors.ts";
import { mixIsDistinct, objectiveCoverage } from "../../lib/quiz/mix.ts";

const GOLD = [
  {
    courseId: "ml-foundations",
    moduleId: "ml-f-problem",
    lessons: ML_FOUNDATIONS_LESSONS,
    diagrams: new Set(["ml-learn-loop"]),
    five: ["ml-learning-problem"],
  },
  {
    courseId: "horo-foundations",
    moduleId: "horo-f-move",
    lessons: HORO_FOUNDATIONS_LESSONS,
    diagrams: new Set(["horo-power-flow", "horo-parts"]),
    five: ["horo-movement"],
  },
  {
    courseId: "mus-foundations",
    moduleId: "mus-f-elem",
    lessons: MUS_FOUNDATIONS_LESSONS,
    diagrams: new Set(["mus-dimensions", "mus-interval-ratio"]),
    five: ["mus-sound"],
  },
  {
    courseId: "dm-history",
    moduleId: "dm-h-lineage",
    lessons: DM_HISTORY_LESSONS,
    diagrams: new Set(["dm-lineage-soil", "dm-listen-layers"]),
    five: ["dm-lineage"],
  },
] as const;

const catalog = buildCatalog(
  CATEGORIES,
  CONCEPTS,
  [
    ...ML_FOUNDATIONS_LESSONS,
    ...HORO_FOUNDATIONS_LESSONS,
    ...MUS_FOUNDATIONS_LESSONS,
    ...DM_HISTORY_LESSONS,
    ...SCIENCE_LESSONS,
    ...CULTURE_LESSONS,
  ],
  [],
  [],
  [],
  COURSES,
);

describe("remaining-curriculum gold modules", () => {
  for (const gold of GOLD) {
    const course = catalog.courseMap[gold.courseId];
    const moduleConceptIds = course.modules.find((m) => m.id === gold.moduleId)?.conceptIds ?? [];
    const moduleLessons = gold.lessons.filter((l) => moduleConceptIds.includes(l.conceptId));

    it(`${gold.courseId}/${gold.moduleId} covers every module concept with a 10-minute lesson`, () => {
      assert.ok(moduleConceptIds.length >= 6, gold.moduleId);
      for (const id of moduleConceptIds) {
        const tens = moduleLessons.filter((l) => l.conceptId === id && l.durationMin === 10);
        assert.equal(tens.length, 1, `${id} needs exactly one 10-minute lesson`);
      }
      const fives = moduleLessons.filter((l) => l.durationMin === 5).map((l) => l.conceptId).sort();
      assert.deepEqual(fives, [...gold.five]);
      assert.equal(moduleLessons.filter((l) => l.durationMin === 20 || l.durationMin === 30).length, 0);
    });

    it(`${gold.courseId}/${gold.moduleId} keeps IDs unique and quizzes honest`, () => {
      const ids = moduleLessons.map((l) => l.id);
      assert.equal(new Set(ids).size, ids.length);
      const quizIds = moduleLessons.flatMap((l) => l.quiz.map((q) => q.id));
      assert.equal(new Set(quizIds).size, quizIds.length);
      for (const lesson of moduleLessons) {
        const concept = catalog.conceptMap[lesson.conceptId];
        assert.ok(concept, lesson.id);
        assert.equal(concept.courseId, gold.courseId, lesson.id);
        assert.equal(concept.moduleId, gold.moduleId, lesson.id);
        assert.deepEqual([...lesson.prerequisites].sort(), [...concept.prerequisites].sort(), lesson.id);
        if (lesson.goDeeper) assert.ok(catalog.conceptMap[lesson.goDeeper], lesson.goDeeper);
        if (lesson.diagram) assert.ok(gold.diagrams.has(lesson.diagram), `${lesson.id} ${lesson.diagram}`);
        assert.equal(lesson.quiz.length, 3, lesson.id);
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
        assert.ok(objectiveCoverage(lesson.quiz).length > 0, lesson.id);
        const mine = new Set(concept.objectives ?? []);
        for (const question of lesson.quiz) {
          assert.ok((question.objectiveIds ?? []).length > 0, `${lesson.id}/${question.id}`);
          for (const obj of question.objectiveIds ?? []) {
            assert.ok(mine.has(obj), `${lesson.id}/${question.id} foreign objective: ${obj}`);
          }
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
  }

  it("does not collide with leftover seed lesson IDs", () => {
    const leftoverIds = new Set([...SCIENCE_LESSONS, ...CULTURE_LESSONS].map((l) => l.id));
    for (const gold of GOLD) {
      for (const lesson of gold.lessons) {
        assert.equal(leftoverIds.has(lesson.id), false, `gold reuses leftover id ${lesson.id}`);
      }
    }
  });
});
