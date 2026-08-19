import {
  generatedExplainSchema,
  generatedLessonSchema,
  generatedPathSchema,
  generatedQuizSchema,
} from "@/content/schema";
import { makeId } from "@/lib/learning/catalog";
import { normalizeLesson } from "@/lib/learning/normalize";
import { PROMPT_VERSION } from "@/lib/learning/types";
import type { Concept, Effort, Lesson, Level, Provenance, TimeBudget } from "@/lib/learning/types";
import { extractJson } from "./json";

export { extractJson };
export type ParseFailure = { ok: false; error: string; issues?: string[] };
export type ParseSuccess<T> = { ok: true; value: T };

export function parseGeneratedLesson(raw: unknown): ParseSuccess<ReturnType<typeof generatedLessonSchema.parse>> | ParseFailure {
  const parsed = generatedLessonSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Generated lesson failed schema validation.",
      issues: parsed.error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`),
    };
  }
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if ("mastery" in obj || "progress" in obj || "ease" in obj) {
      return { ok: false, error: "Generated lesson tried to write mastery state and was rejected." };
    }
  }
  return { ok: true, value: parsed.data };
}

export function parseGeneratedExplain(raw: unknown) {
  const parsed = generatedExplainSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Explanation rewrite failed schema validation.",
      issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  return { ok: true as const, value: parsed.data };
}

export function parseGeneratedQuiz(raw: unknown) {
  const parsed = generatedQuizSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Quiz generation failed schema validation.",
      issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  return { ok: true as const, value: parsed.data };
}

export function parseGeneratedPath(raw: unknown) {
  const parsed = generatedPathSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Learning path failed schema validation.",
      issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  return { ok: true as const, value: parsed.data };
}

export function lessonFromGenerated(
  data: ReturnType<typeof generatedLessonSchema.parse>,
  meta: {
    id?: string;
    conceptId: string;
    level: Level;
    provenance: Provenance;
  },
): Lesson {
  const explanation = Array.isArray(data.explanation) ? data.explanation : [data.explanation];
  return normalizeLesson(
    {
      schemaVersion: 1,
      id: meta.id ?? makeId("ai", data.title),
      conceptId: meta.conceptId,
      title: data.title,
      durationMin: data.estimated_minutes as TimeBudget,
      effort: data.effort as Effort,
      level: data.level ?? meta.level,
      prerequisites: data.prerequisites,
      goDeeper: data.go_deeper?.[0],
      source: meta.provenance,
      explanation,
      example: data.example,
      whyItMatters: data.why_it_matters,
      diagram: data.diagram ?? undefined,
      quiz: data.quiz,
      custom: true,
      createdAt: meta.provenance.generatedAt,
      updatedAt: meta.provenance.generatedAt,
    },
    "ai",
  );
}

export function pathConceptsFromGenerated(
  data: ReturnType<typeof generatedPathSchema.parse>,
  categoryId: string,
): Concept[] {
  const ids = new Set(data.concepts.map((c) => c.id));
  return data.concepts.map((c) => ({
    id: c.id,
    name: c.name,
    category: categoryId,
    parentId: c.parentId && ids.has(c.parentId) ? c.parentId : undefined,
    prerequisites: c.prerequisites.filter((id) => ids.has(id)),
    level: c.level,
    summary: c.summary,
    custom: true,
  }));
}

export function defaultAiProvenance(input: {
  provider: string;
  model: string;
  sourceExcerpt?: string;
  links?: string[];
}): Provenance {
  return {
    type: "ai",
    provider: input.provider,
    model: input.model,
    generatedAt: new Date().toISOString(),
    promptVersion: PROMPT_VERSION,
    schemaVersion: 1,
    sourceExcerpt: input.sourceExcerpt,
    links: input.links,
  };
}
