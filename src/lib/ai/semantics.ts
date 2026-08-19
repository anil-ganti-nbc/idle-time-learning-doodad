import type { GeneratedLesson } from "@/content/schema";
import type { Concept, Effort, Level, TimeBudget } from "@/lib/learning/types";

export interface BindRequest {
  concept: Concept;
  durationMin: TimeBudget;
  effort: Effort;
  journalist: boolean;
  knownConceptIds: Set<string>;
}

export interface BoundCurriculum {
  conceptId: string;
  durationMin: TimeBudget;
  effort: Effort;
  level: Level;
  prerequisites: string[];
  goDeeper?: string;
  discrepancies: string[];
}

export type BindResult =
  | { ok: true; value: BoundCurriculum }
  | { ok: false; error: string; issues: string[] };

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((id, i) => id === right[i]);
}

/**
 * AI authors prose. The app owns curriculum topology.
 * Duration and effort must match the request. Everything else is overwritten
 * from the concept graph when the model disagrees.
 */
export function bindGeneratedLesson(data: GeneratedLesson, req: BindRequest): BindResult {
  const issues: string[] = [];
  if (data.estimated_minutes !== req.durationMin) {
    issues.push(
      `duration ${data.estimated_minutes} does not match the ${req.durationMin}-minute request`,
    );
  }
  if (data.effort !== req.effort) {
    issues.push(`effort ${data.effort} does not match the ${req.effort} request`);
  }
  if (issues.length) {
    return {
      ok: false,
      error: "Generated lesson did not match the requested session.",
      issues,
    };
  }

  const discrepancies: string[] = [];
  if (data.concept_id !== req.concept.id) {
    discrepancies.push(`concept_id ${data.concept_id} replaced with ${req.concept.id}`);
  }

  const prerequisites = [...req.concept.prerequisites];
  if (!sameSet(data.prerequisites ?? [], prerequisites)) {
    discrepancies.push("prerequisites taken from the concept graph");
  }

  let level: Level = req.concept.level;
  if (req.journalist && data.level === "journalist") {
    level = "journalist";
  } else if (data.level && data.level !== req.concept.level) {
    discrepancies.push(`level ${data.level} overwritten with ${req.concept.level}`);
  }

  const requested = data.go_deeper ?? [];
  const valid = requested.filter((id) => id !== req.concept.id && req.knownConceptIds.has(id));
  if (requested.length > 0 && valid.length !== requested.length) {
    discrepancies.push("dropped unknown go_deeper targets");
  }

  return {
    ok: true,
    value: {
      conceptId: req.concept.id,
      durationMin: req.durationMin,
      effort: req.effort,
      level,
      prerequisites,
      goDeeper: valid[0],
      discrepancies,
    },
  };
}
