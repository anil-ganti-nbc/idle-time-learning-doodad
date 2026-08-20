import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../categories.ts";
import { CONCEPTS } from "../concepts.ts";
import { COURSES } from "../courses/index.ts";
import { CULTURE_LESSONS } from "./culture.ts";
import { GPU_LESSONS } from "./gpu.ts";
import { LONGFORM_LESSONS } from "./longform.ts";
import { SCIENCE_LESSONS } from "./science.ts";
import { SYSTEMS_LESSONS } from "./systems.ts";
import { CPU_SEMI_LESSONS } from "./cpu-semi.ts";
import { CPU_FOUNDATIONS_LESSONS } from "./cpu-foundations/index.ts";
import { CPU_MICROARCH_LESSONS } from "./cpu-microarch/index.ts";
import { ARCH_GPU_LESSONS } from "./arch-gpu/index.ts";
import { SEMI_PROCESS_LESSONS } from "./semi-process/index.ts";
import { SEMI_LITHO_LESSONS } from "./semi-litho/index.ts";
import { SEMI_LEADING_LESSONS } from "./semi-leading/index.ts";
import { OS_FOUNDATIONS_LESSONS } from "./os-foundations/index.ts";
import { OS_CONCURRENCY_LESSONS } from "./os-concurrency/index.ts";
import { OS_STORAGE_LESSONS } from "./os-storage/index.ts";
import { NET_FOUNDATIONS_LESSONS } from "./net-foundations/index.ts";
import { NET_TRANSPORT_LESSONS } from "./net-transport/index.ts";
import { NET_INTERNET_LESSONS } from "./net-internet/index.ts";
import { CMP_FRONTEND_LESSONS } from "./cmp-frontend/index.ts";
import { CMP_IR_LESSONS } from "./cmp-ir/index.ts";
import { CMP_BACKEND_LESSONS } from "./cmp-backend/index.ts";
import { ML_FOUNDATIONS_LESSONS } from "./ml-foundations/index.ts";
import { ML_NEURAL_LESSONS } from "./ml-neural/index.ts";
import { ML_TRANSFORMERS_LESSONS } from "./ml-transformers/index.ts";
import { HORO_FOUNDATIONS_LESSONS } from "./horo-foundations/index.ts";
import { HORO_REGULATION_LESSONS } from "./horo-regulation/index.ts";
import { HORO_COMPLICATIONS_LESSONS } from "./horo-complications/index.ts";
import { MUS_FOUNDATIONS_LESSONS } from "./mus-foundations/index.ts";
import { MUS_HARMONY_LESSONS } from "./mus-harmony/index.ts";
import { MUS_HEAVY_LESSONS } from "./mus-heavy/index.ts";
import { DM_HISTORY_LESSONS } from "./dm-history/index.ts";
import { DM_CONSTRUCTION_LESSONS } from "./dm-construction/index.ts";
import { DM_ADVANCED_LESSONS } from "./dm-advanced/index.ts";
import { computeCoverage } from "../curriculum/coverage.ts";
import { validateCurriculum } from "../curriculum/validate.ts";
import { SOURCE_MAP } from "../curriculum/sources.ts";
import { buildCatalog } from "../../lib/learning/catalog.ts";
import { conceptsInCourse, lessonsInCourse } from "../../lib/learning/curriculum.ts";
import {
  frontierConcepts,
  isConceptUnlocked,
  isDemonstrated,
  isLessonUnlocked,
  makeReadinessContext,
  pickCourseForLearner,
} from "../../lib/learning/readiness.ts";
import { selectLesson } from "../../lib/learning/select.ts";
import { emptyProgress } from "../../lib/learning/srs.ts";
import type { ConceptProgress, Lesson, LocalProfile } from "../../lib/learning/types";
import { assembleQuiz } from "../../lib/quiz/assemble";
import { validateDistractors } from "../../lib/quiz/distractors.ts";
import { allowedKnowledge } from "../../lib/quiz/knowledge.ts";
import { mixIsDistinct, objectiveCoverage } from "../../lib/quiz/mix.ts";
import { createSeededRng, shuffleQuestion } from "../../lib/quiz/shuffle.ts";

const REMAINING = [
  {
    id: "ml-foundations",
    subject: "ml",
    lessons: ML_FOUNDATIONS_LESSONS,
    fives: ["ml-learning-problem", "ml-linear-reg", "ml-train-val-test"],
    twenties: ["ml-gd", "ml-overfit"],
    concepts: 24,
  },
  {
    id: "ml-neural",
    subject: "ml",
    lessons: ML_NEURAL_LESSONS,
    fives: ["ml-neuron"],
    twenties: ["ml-backprop"],
    concepts: 22,
  },
  {
    id: "ml-transformers",
    subject: "ml",
    lessons: ML_TRANSFORMERS_LESSONS,
    fives: ["ml-attention", "ml-tokenizer"],
    twenties: ["ml-attention", "ml-kv-cache", "ml-transformer"],
    concepts: 25,
  },
  {
    id: "horo-foundations",
    subject: "horology",
    lessons: HORO_FOUNDATIONS_LESSONS,
    fives: ["horo-mainspring", "horo-movement", "horo-winding"],
    twenties: ["horo-gear-train", "horo-keyless"],
    concepts: 24,
  },
  {
    id: "horo-regulation",
    subject: "horology",
    lessons: HORO_REGULATION_LESSONS,
    fives: ["horo-escape"],
    twenties: ["horo-isochronism", "horo-lever"],
    concepts: 24,
  },
  {
    id: "horo-complications",
    subject: "horology",
    lessons: HORO_COMPLICATIONS_LESSONS,
    fives: ["horo-chrono", "horo-date"],
    twenties: ["horo-chrono", "horo-tourbillon-honest"],
    concepts: 22,
  },
  {
    id: "mus-foundations",
    subject: "music-theory",
    lessons: MUS_FOUNDATIONS_LESSONS,
    fives: ["mus-rhythm", "mus-scale", "mus-sound"],
    twenties: ["mus-modes"],
    concepts: 24,
  },
  {
    id: "mus-harmony",
    subject: "music-theory",
    lessons: MUS_HARMONY_LESSONS,
    fives: ["mus-power-chord", "mus-triad"],
    twenties: ["mus-voice-lead"],
    concepts: 23,
  },
  {
    id: "mus-heavy",
    subject: "music-theory",
    lessons: MUS_HEAVY_LESSONS,
    fives: ["mus-nonfunc", "mus-odd-meter"],
    twenties: ["mus-analysis-method", "mus-odd-meter"],
    concepts: 22,
  },
  {
    id: "dm-history",
    subject: "death-metal",
    lessons: DM_HISTORY_LESSONS,
    fives: ["dm-lineage"],
    twenties: ["dm-history"],
    concepts: 22,
  },
  {
    id: "dm-construction",
    subject: "death-metal",
    lessons: DM_CONSTRUCTION_LESSONS,
    fives: ["dm-riff-cell"],
    twenties: ["dm-blast", "dm-harmony"],
    concepts: 23,
  },
  {
    id: "dm-advanced",
    subject: "death-metal",
    lessons: DM_ADVANCED_LESSONS,
    fives: ["dm-tech-vs-func"],
    twenties: ["dm-analysis-riff", "dm-prog-form"],
    concepts: 23,
  },
] as const;

const REMAINING_IDS = REMAINING.map((row) => row.id);

const KNOWN_DIAGRAMS = new Set([
  "ml-learn-loop",
  "ml-splits",
  "ml-gd-steps",
  "ml-bias-var",
  "ml-decision-boundary",
  "ml-backprop-graph",
  "ml-neuron",
  "ml-mlp-forward",
  "ml-cnn-share",
  "ml-rnn-unroll",
  "ml-vanish",
  "ml-qkv",
  "ml-causal-mask",
  "ml-transformer-block",
  "ml-kv-cache",
  "ml-rag-path",
  "horo-power-flow",
  "horo-parts",
  "horo-train",
  "horo-keyless",
  "horo-escape-cycle",
  "horo-lever",
  "horo-balance-spring",
  "horo-positions",
  "horo-chrono-couple",
  "horo-tourbillon-cage",
  "horo-date-works",
  "mus-dimensions",
  "mus-interval-ratio",
  "mus-meter-grid",
  "mus-scale-steps",
  "mus-modes-tonic",
  "mus-voice-lead",
  "mus-triad-stack",
  "mus-pedal",
  "mus-odd-grid",
  "mus-polymeter",
  "mus-riff-cell-harm",
  "dm-lineage-soil",
  "dm-listen-layers",
  "dm-two-factories",
  "dm-branch-map",
  "dm-riff-cell",
  "dm-form",
  "dm-displace",
  "dm-phrase-group",
  "dm-poly-riff",
  "dm-arrange",
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
  ],
  [],
  [],
  [],
  COURSES,
);

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

function ownLessons(row: (typeof REMAINING)[number]): Lesson[] {
  const course = catalog.courseMap[row.id];
  return lessonsInCourse(catalog, course).filter((l) => row.lessons.some((own) => own.id === l.id));
}

describe("remaining subjects coverage", () => {
  it("covers every remaining course at 100% with no shallow modules", () => {
    const coverage = computeCoverage(catalog);
    assert.equal(coverage.conceptsLackingLessons, 0);
    assert.deepEqual(
      coverage.shallowModules.filter((row) => REMAINING_IDS.includes(row.courseId as (typeof REMAINING_IDS)[number])),
      [],
    );
    for (const row of REMAINING) {
      const found = coverage.coursesCovered.find((c) => c.courseId === row.id);
      assert.ok(found, row.id);
      assert.equal(found.coveragePct, 100, row.id);
      assert.equal(found.lackingLessons, 0, row.id);
      assert.equal(found.conceptCount, row.concepts, row.id);
    }
  });

  it("keeps completed tracks populated and retired leftovers retired", () => {
    const coverage = computeCoverage(catalog);
    for (const id of ["cpu-foundations", "arch-gpu", "os-foundations", "net-foundations", "cmp-frontend"]) {
      const row = coverage.coursesCovered.find((c) => c.courseId === id);
      assert.ok(row, id);
      assert.equal(row.coveragePct, 100, id);
    }
    const leftoverIds = new Set([...SCIENCE_LESSONS, ...CULTURE_LESSONS].map((l) => l.id));
    for (const row of REMAINING) {
      for (const lesson of row.lessons) {
        assert.equal(leftoverIds.has(lesson.id), false, `leftover collision ${lesson.id}`);
      }
    }
  });
});

describe("remaining subjects lesson integrity", () => {
  for (const row of REMAINING) {
    const course = catalog.courseMap[row.id];
    const courseConcepts = conceptsInCourse(catalog, course);
    const own = ownLessons(row);

    it(`${row.id} binds unique lessons to this course with graph-legal edges`, () => {
      assert.equal(course.modules.length, row.id.startsWith("ml-foundations") || row.id === "ml-transformers" ? 4 : 3);
      const ids = own.map((l) => l.id);
      assert.equal(new Set(ids).size, ids.length, row.id);
      const quizIds = own.flatMap((l) => l.quiz.map((q) => q.id));
      assert.equal(new Set(quizIds).size, quizIds.length, `${row.id} quiz ids collide`);
      for (const lesson of own) {
        const concept = catalog.conceptMap[lesson.conceptId];
        assert.ok(concept, lesson.id);
        assert.equal(concept.courseId, row.id, lesson.id);
        assert.deepEqual([...lesson.prerequisites].sort(), [...concept.prerequisites].sort(), lesson.id);
        if (lesson.goDeeper) assert.ok(catalog.conceptMap[lesson.goDeeper], `${lesson.id} ${lesson.goDeeper}`);
        if (lesson.diagram) assert.ok(KNOWN_DIAGRAMS.has(lesson.diagram), `${lesson.id} unknown diagram ${lesson.diagram}`);
        assert.ok([5, 10, 20, 30].includes(lesson.durationMin), lesson.id);
        assert.equal(lesson.quiz.length, 3, lesson.id);
      }
      for (const concept of courseConcepts) {
        assert.ok(own.some((l) => l.conceptId === concept.id && l.durationMin === 10), `${concept.id} missing 10`);
      }
      assert.deepEqual(own.filter((l) => l.durationMin === 5).map((l) => l.conceptId).sort(), [...row.fives]);
      assert.deepEqual(own.filter((l) => l.durationMin === 20).map((l) => l.conceptId).sort(), [...row.twenties]);
      assert.equal(own.filter((l) => l.durationMin === 30).length, 0, row.id);
    });
  }
});

describe("remaining subjects quiz QA", () => {
  for (const row of REMAINING) {
    const own = ownLessons(row);

    it(`${row.id} quizzes assemble, shuffle, and stay on-concept`, () => {
      const counts = new Map<string, number>();
      const rng = createSeededRng(20260820);
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
        assert.ok(objectiveCoverage(lesson.quiz).length > 0, lesson.id);
        const mine = new Set(concept.objectives ?? []);
        const allowed = allowedKnowledge(
          catalog,
          concept,
          makeReadinessContext(catalog, {
            [concept.id]: held(concept.id),
            ...Object.fromEntries(concept.prerequisites.map((id) => [id, held(id)])),
          }),
        );
        for (const question of lesson.quiz) {
          assert.ok((question.objectiveIds ?? []).length > 0, `${lesson.id}/${question.id}`);
          for (const obj of question.objectiveIds ?? []) {
            assert.ok(mine.has(obj), `${lesson.id}/${question.id} foreign objective: ${obj}`);
          }
          for (const pre of question.prerequisiteConceptIds ?? []) {
            assert.ok(
              allowed.conceptIds.includes(pre) || concept.prerequisites.includes(pre) || pre === concept.id,
              `${lesson.id}/${question.id} prerequisite ${pre} outside allowed knowledge`,
            );
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
          const shuffled = shuffleQuestion(question, rng);
          assert.equal(shuffled.choices[shuffled.answerIndex], correct, `${lesson.id}/${question.id}`);
          assert.equal(new Set(shuffled.choices).size, 4, `${lesson.id}/${question.id}`);
          const kind = question.cognitiveType ?? "missing";
          counts.set(kind, (counts.get(kind) ?? 0) + 1);
        }
      }
      assert.ok([...counts.keys()].length >= 5, `${row.id} ${[...counts.keys()].join(",")}`);
      assert.ok((counts.get("recognize") ?? 0) + (counts.get("identify") ?? 0) >= 4, row.id);
      assert.ok((counts.get("apply") ?? 0) + (counts.get("trace") ?? 0) + (counts.get("predict") ?? 0) >= 6, row.id);
    });
  }
});

describe("remaining subjects sources", () => {
  it("records the sources each remaining course is allowed to lean on", () => {
    for (const row of REMAINING) {
      const course = catalog.courseMap[row.id];
      for (const ref of course.sourceReferences) {
        assert.ok(SOURCE_MAP[ref.id ?? ""], `${row.id} ${ref.id}`);
      }
    }
    assert.ok(SOURCE_MAP["stanford-cs229"].informed.includes("ml-foundations"));
    assert.ok(SOURCE_MAP["stanford-cs224n"].informed.includes("ml-transformers"));
    assert.ok(SOURCE_MAP["hsny-edu"].informed.includes("horo-foundations"));
    assert.ok(SOURCE_MAP["wostep-training"].informed.includes("horo-complications"));
    assert.ok(SOURCE_MAP["mit-21m051"].informed.includes("mus-foundations"));
    assert.ok(SOURCE_MAP["mit-metal101"].informed.includes("dm-history"));
  });
});

describe("remaining subjects progression", () => {
  it("lets a fresh learner start only at each subject's intended frontier", () => {
    const empty = makeReadinessContext(catalog, {});
    assert.equal(pickCourseForLearner(catalog, "ml", empty)?.id, "ml-foundations");
    assert.equal(pickCourseForLearner(catalog, "horology", empty)?.id, "horo-foundations");
    assert.equal(pickCourseForLearner(catalog, "music-theory", empty)?.id, "mus-foundations");
    assert.equal(pickCourseForLearner(catalog, "death-metal", empty)?.id, "dm-history");
    assert.deepEqual(
      conceptsInCourse(catalog, catalog.courseMap["ml-foundations"])
        .filter((c) => isConceptUnlocked(c, empty))
        .map((c) => c.id),
      ["ml-learning-problem"],
    );
    assert.deepEqual(
      conceptsInCourse(catalog, catalog.courseMap["horo-foundations"])
        .filter((c) => isConceptUnlocked(c, empty))
        .map((c) => c.id),
      ["horo-movement"],
    );
    assert.deepEqual(
      conceptsInCourse(catalog, catalog.courseMap["mus-foundations"])
        .filter((c) => isConceptUnlocked(c, empty))
        .map((c) => c.id),
      ["mus-sound"],
    );
    assert.deepEqual(
      conceptsInCourse(catalog, catalog.courseMap["dm-history"])
        .filter((c) => isConceptUnlocked(c, empty))
        .map((c) => c.id),
      ["dm-lineage"],
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["ml-neuron"], empty), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["ml-attention"], empty), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["horo-escape"], empty), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["mus-triad"], empty), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["dm-harmony"], empty), false);
  });

  it("can reach every remaining concept from the prerequisite graph", () => {
    for (const row of REMAINING) {
      const course = catalog.courseMap[row.id];
      const courseConcepts = conceptsInCourse(catalog, course);
      const progress: Record<string, ConceptProgress> = {};
      const seen = new Set<string>();
      for (let step = 0; step < 80; step++) {
        const ctx = makeReadinessContext(catalog, progress);
        const front = frontierConcepts(course, ctx);
        if (front.length === 0) break;
        for (const concept of front) {
          progress[concept.id] = held(concept.id);
          seen.add(concept.id);
        }
      }
      const missing = courseConcepts.filter((c) => !seen.has(c.id)).map((c) => c.id);
      // Later remaining courses have external prereqs; hold those, then resume.
      if (missing.length) {
        const needed = new Set<string>();
        for (const id of missing) {
          for (const pre of catalog.conceptMap[id]?.prerequisites ?? []) {
            if (!courseConcepts.some((c) => c.id === pre)) needed.add(pre);
          }
        }
        for (const id of needed) progress[id] = held(id);
        for (let step = 0; step < 80; step++) {
          const ctx = makeReadinessContext(catalog, progress);
          const front = frontierConcepts(course, ctx);
          if (front.length === 0) break;
          for (const concept of front) {
            progress[concept.id] = held(concept.id);
            seen.add(concept.id);
          }
        }
      }
      assert.deepEqual([...seen].sort(), courseConcepts.map((c) => c.id).sort(), row.id);
    }
  });

  it("honours knownConceptIds only for real graph prerequisites", () => {
    const ctx = makeReadinessContext(catalog, {}, profileWith(["ml-learning-problem"]));
    assert.equal(isDemonstrated("ml-learning-problem", ctx, 1), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["ml-features-targets"], ctx), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["ml-attention"], ctx), false);
  });

  it("keeps a lapsed remaining concept available for review", () => {
    const ctx = makeReadinessContext(catalog, {
      "ml-learning-problem": held("ml-learning-problem"),
      "ml-features-targets": held("ml-features-targets", {
        understanding: "didnt_get_it",
        lastQuizScore: 0.33,
        lapseCount: 2,
      }),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["ml-features-targets"], ctx), true);
    assert.ok(ML_FOUNDATIONS_LESSONS.some((l) => l.conceptId === "ml-features-targets" && isLessonUnlocked(l, ctx)));
  });

  it("keeps Surprise Me on each subject's intended frontier", () => {
    for (const [category, expected] of [
      ["ml", "ml-learning-problem"],
      ["horology", "horo-movement"],
      ["music-theory", "mus-sound"],
      ["death-metal", "dm-lineage"],
    ] as const) {
      const picked = selectLesson(
        { minutes: 10, category, effort: null, mode: "surprise", journalistDepth: false },
        {},
        [],
        catalog,
        undefined,
        { rng: () => 0 },
      );
      assert.ok(picked, category);
      assert.equal(picked.lesson.conceptId, expected, category);
    }
  });

  it("opens later remaining courses only after their graph entry is held", () => {
    const afterMlFound = makeReadinessContext(
      catalog,
      heldAll(conceptsInCourse(catalog, catalog.courseMap["ml-foundations"]).map((c) => c.id)),
    );
    assert.equal(pickCourseForLearner(catalog, "ml", afterMlFound)?.id, "ml-neural");
    assert.equal(isConceptUnlocked(catalog.conceptMap["ml-neuron"], afterMlFound), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["ml-attention"], afterMlFound), false);

    const afterHoroFound = makeReadinessContext(
      catalog,
      heldAll(conceptsInCourse(catalog, catalog.courseMap["horo-foundations"]).map((c) => c.id)),
    );
    assert.equal(pickCourseForLearner(catalog, "horology", afterHoroFound)?.id, "horo-regulation");
    assert.equal(isConceptUnlocked(catalog.conceptMap["horo-escape"], afterHoroFound), true);
  });

  it("keeps Music Theory → Death Metal continuity graph-legal", () => {
    const musicOnly = makeReadinessContext(
      catalog,
      heldAll(conceptsInCourse(catalog, catalog.courseMap["mus-foundations"]).map((c) => c.id)),
    );
    assert.equal(pickCourseForLearner(catalog, "death-metal", musicOnly)?.id, "dm-history");
    assert.equal(isConceptUnlocked(catalog.conceptMap["dm-harmony"], musicOnly), false);
    assert.equal(isConceptUnlocked(catalog.conceptMap["dm-riff-cell"], musicOnly), false);

    const historyAndMusic = makeReadinessContext(
      catalog,
      heldAll([
        ...conceptsInCourse(catalog, catalog.courseMap["mus-foundations"]).map((c) => c.id),
        ...conceptsInCourse(catalog, catalog.courseMap["dm-history"]).map((c) => c.id),
      ]),
    );
    assert.equal(isConceptUnlocked(catalog.conceptMap["dm-riff-cell"], historyAndMusic), true);
    assert.equal(isConceptUnlocked(catalog.conceptMap["dm-harmony"], historyAndMusic), false);

    const readyForHarmony = makeReadinessContext(catalog, {
      ...heldAll([
        ...conceptsInCourse(catalog, catalog.courseMap["mus-foundations"]).map((c) => c.id),
        ...conceptsInCourse(catalog, catalog.courseMap["dm-history"]).map((c) => c.id),
      ]),
      "dm-riff-cell": held("dm-riff-cell"),
    });
    assert.equal(isConceptUnlocked(catalog.conceptMap["dm-harmony"], readyForHarmony), true);
    assert.ok(catalog.conceptMap["dm-harmony"].prerequisites.includes("mus-interval"));
    assert.ok(catalog.conceptMap["dm-harmony"].prerequisites.includes("mus-modes"));
  });

  it("has a healthy seeded topology", () => {
    const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
    assert.deepEqual(errors, []);
  });
});
