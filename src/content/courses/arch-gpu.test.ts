import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORIES } from "../categories.ts";
import { CONCEPTS, CONCEPT_MAP } from "../concepts.ts";
import { CPU_SEMI_LESSONS } from "../lessons/cpu-semi.ts";
import { GPU_LESSONS } from "../lessons/gpu.ts";
import { buildCatalog } from "../../lib/learning/catalog.ts";
import { prereqClosure } from "../../lib/learning/curriculum.ts";
import { ARCH_GPU_COURSE } from "./arch-gpu.ts";
import { COURSES } from "./index.ts";

const catalog = buildCatalog(CATEGORIES, CONCEPTS, [...CPU_SEMI_LESSONS, ...GPU_LESSONS], [], [], [], COURSES);

describe("arch-gpu course integrity", () => {
  it("is the only seeded course and points at real ids", () => {
    assert.equal(COURSES.length, 1);
    assert.equal(ARCH_GPU_COURSE.id, "arch-gpu");
    assert.ok(ARCH_GPU_COURSE.sourceReferences.length >= 4);
    const ids = new Set(ARCH_GPU_COURSE.modules.flatMap((m) => m.conceptIds));
    for (const id of ids) {
      assert.ok(CONCEPT_MAP[id], `missing concept ${id}`);
      assert.equal(CONCEPT_MAP[id].courseId, "arch-gpu");
    }
    for (const mod of ARCH_GPU_COURSE.modules) {
      for (const spine of mod.spineIds) {
        assert.ok(mod.conceptIds.includes(spine), `${mod.id} spine ${spine} not in conceptIds`);
      }
      for (const pre of mod.prerequisites) {
        assert.ok(
          ARCH_GPU_COURSE.modules.some((m) => m.id === pre),
          `missing module prereq ${pre}`,
        );
      }
    }
  });

  it("orders modules and keeps a prereq path from foundation", () => {
    const ordered = ARCH_GPU_COURSE.modules.slice().sort((a, b) => a.order - b.order);
    ordered.forEach((mod, i) => assert.equal(mod.order, i));
    const roots = ARCH_GPU_COURSE.modules[0].conceptIds;
    for (const id of ARCH_GPU_COURSE.modules.flatMap((m) => m.conceptIds)) {
      const closure = prereqClosure(catalog, id);
      const grounded = roots.some((root) => root === id || closure.has(root));
      assert.equal(grounded, true, `${id} has no path back to foundations`);
    }
  });

  it("does not put occupancy or scheduling in the first two modules", () => {
    const early = new Set(
      ARCH_GPU_COURSE.modules
        .filter((m) => m.order <= 1)
        .flatMap((m) => m.conceptIds),
    );
    assert.ok(early.has("arch-latency-throughput"));
    assert.ok(early.has("cpu-pipeline"));
    assert.ok(!early.has("gpu-occupancy"));
    assert.ok(!early.has("gpu-scheduler"));
  });
});
