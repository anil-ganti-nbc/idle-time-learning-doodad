import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { GeneratedLesson } from "../../content/schema.ts";
import { bindGeneratedLesson } from "./semantics.ts";
import type { Concept } from "../learning/types.ts";

const concept: Concept = {
  id: "cpu-pipeline",
  name: "Pipelines",
  category: "cpu",
  prerequisites: ["cpu-fetch"],
  level: "intro",
  summary: "overlap",
};

const quiz = [
  {
    id: "q1",
    prompt: "Why pipeline?",
    choices: ["a", "b", "c", "d"] as [string, string, string, string],
    answerIndex: 1 as const,
    explanation: "overlap",
  },
  {
    id: "q2",
    prompt: "What stalls?",
    choices: ["a", "b", "c", "d"] as [string, string, string, string],
    answerIndex: 0 as const,
    explanation: "hazards",
  },
  {
    id: "q3",
    prompt: "What is latency?",
    choices: ["a", "b", "c", "d"] as [string, string, string, string],
    answerIndex: 2 as const,
    explanation: "per instruction",
  },
];

function lesson(partial: Partial<GeneratedLesson> = {}): GeneratedLesson {
  return {
    concept_id: "cpu-pipeline",
    title: "The factory line",
    category: "cpu",
    estimated_minutes: 10,
    effort: "normal",
    prerequisites: ["cpu-fetch"],
    explanation: ["A pipeline overlaps stages so the factory keeps moving."],
    example: "While instruction N writes back, N+1 can execute and N+2 can decode.",
    why_it_matters: "Throughput is why CPUs look busy even when each instruction still takes many cycles.",
    quiz,
    ...partial,
  };
}

describe("bindGeneratedLesson", () => {
  it("rejects a duration mismatch", () => {
    const r = bindGeneratedLesson(lesson({ estimated_minutes: 20 }), {
      concept,
      durationMin: 10,
      effort: "normal",
      journalist: false,
      knownConceptIds: new Set(["cpu-hazards"]),
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.issues.join(" "), /duration/);
  });

  it("rejects an effort mismatch", () => {
    const r = bindGeneratedLesson(lesson({ effort: "deep" }), {
      concept,
      durationMin: 10,
      effort: "normal",
      journalist: false,
      knownConceptIds: new Set(),
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.issues.join(" "), /effort/);
  });

  it("overwrites prerequisite mismatches from the concept graph", () => {
    const r = bindGeneratedLesson(lesson({ prerequisites: ["invented-node"] }), {
      concept,
      durationMin: 10,
      effort: "normal",
      journalist: false,
      knownConceptIds: new Set(["cpu-hazards"]),
    });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.deepEqual(r.value.prerequisites, ["cpu-fetch"]);
      assert.ok(r.value.discrepancies.some((d) => /prerequisite/i.test(d)));
    }
  });

  it("drops unknown go_deeper targets", () => {
    const r = bindGeneratedLesson(lesson({ go_deeper: ["not-a-concept", "cpu-pipeline"] }), {
      concept,
      durationMin: 10,
      effort: "normal",
      journalist: false,
      knownConceptIds: new Set(["cpu-hazards"]),
    });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.value.goDeeper, undefined);
      assert.ok(r.value.discrepancies.some((d) => /go_deeper/i.test(d)));
    }
  });

  it("keeps a valid go_deeper target", () => {
    const r = bindGeneratedLesson(lesson({ go_deeper: ["cpu-hazards"] }), {
      concept,
      durationMin: 10,
      effort: "normal",
      journalist: false,
      knownConceptIds: new Set(["cpu-hazards"]),
    });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.value.goDeeper, "cpu-hazards");
  });

  it("forces the requested concept id", () => {
    const r = bindGeneratedLesson(lesson({ concept_id: "wrong" }), {
      concept,
      durationMin: 10,
      effort: "normal",
      journalist: false,
      knownConceptIds: new Set(),
    });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.value.conceptId, "cpu-pipeline");
  });
});
