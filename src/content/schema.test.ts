import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generatedLessonSchema, lessonFileSchema } from "./schema.ts";

const quiz = [
  {
    id: "q1",
    prompt: "Why?",
    choices: ["a", "b", "c", "d"],
    answerIndex: 1,
    explanation: "b is the mechanism.",
  },
  {
    id: "q2",
    prompt: "When?",
    choices: ["a", "b", "c", "d"],
    answerIndex: 0,
    explanation: "order of events.",
  },
  {
    id: "q3",
    prompt: "What fails?",
    choices: ["a", "b", "c", "d"],
    answerIndex: 2,
    explanation: "the third case.",
  },
];

describe("lesson schema", () => {
  it("accepts a v1 seed file with legacy source", () => {
    const parsed = lessonFileSchema.safeParse({
      id: "cpu-pipeline-5",
      conceptId: "cpu-pipeline",
      title: "Factory",
      durationMin: 5,
      effort: "light",
      level: "intro",
      prerequisites: [],
      source: { author: "DAU", generator: "grok", version: "1.0" },
      explanation: ["one"],
      example: "ex",
      whyItMatters: "why",
      quiz,
    });
    assert.equal(parsed.success, true);
  });

  it("accepts the interchange shape with estimated_minutes", () => {
    const parsed = lessonFileSchema.safeParse({
      schema_version: 1,
      id: "x",
      concept_id: "cpu-pipeline",
      title: "Factory",
      estimated_minutes: 10,
      effort: "normal",
      prerequisites: [],
      source: { type: "ai", provider: "xai", model: "grok-4.5", schemaVersion: 1 },
      explanation: ["one"],
      example: "ex",
      why_it_matters: "why",
      quiz,
    });
    assert.equal(parsed.success, true);
  });

  it("rejects a two-question quiz", () => {
    const parsed = generatedLessonSchema.safeParse({
      concept_id: "x",
      title: "Too short",
      category: "cpu",
      estimated_minutes: 10,
      effort: "normal",
      explanation: ["a paragraph that is long enough to count"],
      example: "an example that is long enough to count",
      why_it_matters: "a reason that is long enough to count",
      quiz: [quiz[0], quiz[1]],
    });
    assert.equal(parsed.success, false);
  });
});
