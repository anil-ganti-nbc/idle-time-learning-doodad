import { isRetiredSeededCategory } from "@/lib/learning/types";
import type { Catalog, Concept, Course, Tier } from "@/lib/learning/types";
import { inferTier, prereqClosure } from "@/lib/learning/curriculum";
import { SOURCE_MAP } from "./sources";

export interface CurriculumIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
}

export function validateCurriculum(catalog: Catalog): CurriculumIssue[] {
  const issues: CurriculumIssue[] = [];
  const conceptIds = new Set<string>();
  const courseIds = new Set<string>();
  const moduleIds = new Set<string>();

  for (const course of catalog.courses) {
    if (courseIds.has(course.id)) issues.push(err("duplicate-course", `Duplicate course id ${course.id}`));
    courseIds.add(course.id);
    if (!catalog.categoryMap[course.categoryId]) {
      issues.push(err("unknown-category", `Course ${course.id} references unknown category ${course.categoryId}`));
    }
    if (course.modules.length === 0) issues.push(err("empty-course", `Course ${course.id} has no modules`));
    const localModules = new Set(course.modules.map((m) => m.id));
    for (const mod of course.modules) {
      if (moduleIds.has(mod.id)) issues.push(err("duplicate-module", `Duplicate module id ${mod.id}`));
      moduleIds.add(mod.id);
      if (mod.conceptIds.length === 0) issues.push(err("empty-module", `Module ${mod.id} has no concepts`));
      for (const pre of mod.prerequisites) {
        if (!localModules.has(pre)) issues.push(err("unknown-module-prereq", `Module ${mod.id} prerequisites unknown ${pre}`));
      }
      for (const spine of mod.spineIds) {
        if (!mod.conceptIds.includes(spine)) {
          issues.push(err("spine-missing", `Module ${mod.id} spine ${spine} is not in conceptIds`));
        }
      }
      for (const ref of course.sourceReferences) {
        if (ref.id && !SOURCE_MAP[ref.id]) {
          issues.push(err("unknown-source", `Course ${course.id} source ${ref.id} is not in the research ledger`));
        }
      }
    }
  }

  for (const concept of catalog.concepts) {
    if (conceptIds.has(concept.id)) issues.push(err("duplicate-concept", `Duplicate concept id ${concept.id}`));
    conceptIds.add(concept.id);
    if (concept.courseId && !catalog.courseMap[concept.courseId] && !isRetiredSeededCategory(concept.category)) {
      issues.push(err("unknown-course", `Concept ${concept.id} references unknown course ${concept.courseId}`));
    }
    if (concept.moduleId && concept.courseId) {
      const course = catalog.courseMap[concept.courseId];
      if (course && !course.modules.some((m) => m.id === concept.moduleId)) {
        issues.push(err("unknown-module", `Concept ${concept.id} references unknown module ${concept.moduleId}`));
      }
    }
    for (const pre of concept.prerequisites) {
      if (!catalog.conceptMap[pre] && !conceptIds.has(pre)) {
        issues.push(err("dangling-prereq", `Concept ${concept.id} prerequisites unknown ${pre}`));
      }
    }
    for (const sourceId of concept.sourceIds ?? []) {
      if (!SOURCE_MAP[sourceId]) issues.push(err("unknown-source", `Concept ${concept.id} source ${sourceId} is unknown`));
    }
  }

  issues.push(...cycleIssues(catalog.concepts));
  issues.push(...reachabilityIssues(catalog));
  issues.push(...tierIssues(catalog));
  return issues;
}

function cycleIssues(concepts: Concept[]): CurriculumIssue[] {
  const issues: CurriculumIssue[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const byId = new Map(concepts.map((c) => [c.id, c]));

  function walk(id: string, stack: string[]) {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      issues.push(err("cycle", `Prerequisite cycle: ${[...stack, id].join(" → ")}`));
      return;
    }
    visiting.add(id);
    for (const pre of byId.get(id)?.prerequisites ?? []) walk(pre, [...stack, id]);
    visiting.delete(id);
    visited.add(id);
  }

  for (const concept of concepts) walk(concept.id, []);
  return issues;
}

function reachabilityIssues(catalog: Catalog): CurriculumIssue[] {
  const issues: CurriculumIssue[] = [];
  for (const course of catalog.courses) {
    const roots = new Set(
      course.modules
        .filter((m) => m.prerequisites.length === 0)
        .flatMap((m) => m.conceptIds.filter((id) => (catalog.conceptMap[id]?.prerequisites ?? []).every((pre) => !course.modules.some((m) => m.conceptIds.includes(pre))))),
    );
    if (roots.size === 0) {
      const first = course.modules[0]?.conceptIds[0];
      if (first) roots.add(first);
    }
    for (const id of course.modules.flatMap((m) => m.conceptIds)) {
      const concept = catalog.conceptMap[id];
      if (!concept) continue;
      if ((concept.prerequisites ?? []).length === 0) continue;
      const closure = prereqClosure(catalog, id);
      const grounded =
        roots.has(id) ||
        [...closure].some((pre) => roots.has(pre) || Boolean(catalog.conceptMap[pre])) ||
        concept.prerequisites.every((pre) => Boolean(catalog.conceptMap[pre]));
      if (!grounded) issues.push(err("unreachable", `Concept ${id} in ${course.id} looks unreachable`));
    }
  }
  return issues;
}

function tierIssues(catalog: Catalog): CurriculumIssue[] {
  const issues: CurriculumIssue[] = [];
  for (const concept of catalog.concepts) {
    const tier = inferTier(concept);
    for (const pre of concept.prerequisites) {
      const parent = catalog.conceptMap[pre];
      if (!parent) continue;
      const parentTier = inferTier(parent);
      if (parentTier - (tier as Tier) >= 2) {
        issues.push(
          warn(
            "tier-inversion",
            `Concept ${concept.id} (tier ${tier}) depends on ${pre} (tier ${parentTier}) — possible inversion`,
          ),
        );
      }
    }
  }
  return issues;
}

function err(code: string, message: string): CurriculumIssue {
  return { severity: "error", code, message };
}

function warn(code: string, message: string): CurriculumIssue {
  return { severity: "warning", code, message };
}

export function assertCurriculumHealthy(catalog: Catalog): void {
  const errors = validateCurriculum(catalog).filter((i) => i.severity === "error");
  if (errors.length) {
    throw new Error(`Broken curriculum topology:\n${errors.map((e) => `- ${e.message}`).join("\n")}`);
  }
}
