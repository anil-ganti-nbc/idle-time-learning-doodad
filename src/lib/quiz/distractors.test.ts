import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { itemFromLegacy, lengthReveal, looksJokeOrNonsense, validateDistractors } from "./distractors.ts";

describe("distractor validation", () => {
  it("rejects a distractor that duplicates the correct answer", () => {
    const result = validateDistractors("Latency", [
      { text: "Throughput", kind: "nearby" },
      { text: "latency", kind: "misconception" },
      { text: "Occupancy", kind: "subtle" },
    ]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.issues.some((i) => /duplicates the correct/i.test(i)));
  });

  it("rejects duplicate distractors", () => {
    const result = validateDistractors("Latency", [
      { text: "Throughput", kind: "nearby" },
      { text: "throughput", kind: "misapplied" },
      { text: "Occupancy", kind: "subtle" },
    ]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.issues.some((i) => /duplicates another/i.test(i)));
  });

  it("rejects a length tell", () => {
    assert.equal(
      lengthReveal("A short cache line", "A very long explanation that is obviously the textbook definition of the term"),
      true,
    );
    const result = validateDistractors("The warp is the hardware scheduling quantum.", [
      { text: "A block is just another name for a kernel launch configuration and also the unit that shares an instruction pointer across an entire grid of independent host threads that the driver scheduled onto every SM in the device.", kind: "subtle" },
      { text: "A CUDA stream that only orders host launches", kind: "misapplied" },
      { text: "A DRAM page the OS happens to have mapped", kind: "nearby" },
    ]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.issues.some((i) => /length reveals/i.test(i)));
  });

  it("allows a short noun-phrase option next to a one-line correct answer", () => {
    assert.equal(lengthReveal("Throughput as completion rate", "Occupancy"), false);
    assert.equal(lengthReveal("Throughput as completion rate", "Latency"), false);
  });

  it("rejects an unknown kind and a joke", () => {
    const kind = validateDistractors("Latency", [
      { text: "Throughput", kind: "banana" },
      { text: "Occupancy", kind: "nearby" },
      { text: "Coherence", kind: "subtle" },
    ]);
    assert.equal(kind.ok, false);
    assert.equal(looksJokeOrNonsense("lol just kidding"), true);
    assert.equal(looksJokeOrNonsense("A structural hazard"), false);
  });

  it("accepts three plausible unique distractors", () => {
    const result = validateDistractors("Throughput", [
      { text: "Latency", kind: "nearby", rationale: "Confuses the two quantities." },
      { text: "Clock frequency", kind: "misconception", rationale: "Frequency is not completion rate." },
      { text: "ISA compatibility", kind: "subtle", rationale: "Unrelated axis." },
    ]);
    assert.equal(result.ok, true);
  });

  it("can recover a correct string from a legacy 4-choice item", () => {
    const recovered = itemFromLegacy({
      id: "q",
      prompt: "p",
      choices: ["a", "b", "c", "d"],
      answerIndex: 2,
      explanation: "e",
    });
    assert.equal(recovered.correct, "c");
    assert.equal(recovered.distractors.length, 3);
  });
});
