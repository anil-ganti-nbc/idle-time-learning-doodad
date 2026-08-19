import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../../content/categories.ts";
import { CONCEPTS } from "../../content/concepts.ts";
import { COURSES } from "../../content/courses/index.ts";
import { CPU_SEMI_LESSONS } from "../../content/lessons/cpu-semi.ts";
import { GPU_LESSONS } from "../../content/lessons/gpu.ts";
import { buildCatalog } from "./catalog.ts";
import { declareKnown, pickPlacementItems, scorePlacement } from "./placement.ts";

const catalog = buildCatalog(CATEGORIES, CONCEPTS, [...CPU_SEMI_LESSONS, ...GPU_LESSONS], [], [], [], COURSES);
const course = catalog.courseMap["arch-gpu"];

describe("placement", () => {
  it("draws only early, non-advanced items", () => {
    const items = pickPlacementItems(course, catalog);
    assert.ok(items.length >= 1 && items.length <= 3);
    for (const item of items) {
      assert.ok(item.tier <= 2);
      assert.ok(!item.conceptId.startsWith("gpu-scheduler"));
      assert.equal(item.question.choices.length, 4);
    }
  });

  it("waives introductions on a clean foundation check, not specialist material", () => {
    const placement = scorePlacement([
      { conceptId: "arch-latency-throughput", tier: 0, correct: true },
      { conceptId: "arch-data-parallel", tier: 0, correct: true },
      { conceptId: "cpu-pipeline", tier: 1, correct: true },
      { conceptId: "gpu-scheduler", tier: 5, correct: true },
    ]);
    assert.ok(placement.recommendedTier <= 2);
    assert.ok(placement.waivedConceptIds.includes("arch-latency-throughput"));
    assert.ok(!placement.waivedConceptIds.includes("gpu-scheduler"));
    assert.ok(placement.evidence.some((line) => line.includes("ignored-advanced")));
  });

  it("will not waive a lone core hit without the foundations", () => {
    const placement = scorePlacement([
      { conceptId: "arch-latency-throughput", tier: 0, correct: false },
      { conceptId: "cpu-pipeline", tier: 1, correct: false },
      { conceptId: "cpu-hazards", tier: 2, correct: true },
    ]);
    assert.equal(placement.recommendedTier, 0);
    assert.ok(!placement.waivedConceptIds.includes("cpu-hazards"));
  });

  it("declaration refuses anything above introductory", () => {
    const placement = declareKnown(course, catalog, [
      "arch-latency-throughput",
      "cpu-pipeline",
      "gpu-warps",
      "gpu-scheduler",
    ]);
    assert.ok(placement.waivedConceptIds.includes("arch-latency-throughput"));
    assert.ok(placement.waivedConceptIds.includes("cpu-pipeline"));
    assert.ok(!placement.waivedConceptIds.includes("gpu-warps"));
    assert.ok(!placement.waivedConceptIds.includes("gpu-scheduler"));
    assert.ok(placement.evidence.some((line) => line.endsWith(":refused")));
    assert.ok(placement.recommendedTier <= 1);
  });
});
