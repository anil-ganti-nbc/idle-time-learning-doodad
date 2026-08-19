import { z } from "zod";

/** Current on-disk / interchange lesson schema. Accepts v1 seed files and the v2 provenance object. */
export const LESSON_SCHEMA_VERSION = 1;

export const quizQuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  choices: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  answerIndex: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  explanation: z.string().min(1),
});

export const provenanceSchema = z.object({
  type: z.enum(["seed", "human", "imported", "ai"]),
  provider: z.string().optional(),
  author: z.string().optional(),
  model: z.string().optional(),
  generatedAt: z.string().optional(),
  importedAt: z.string().optional(),
  promptVersion: z.string().optional(),
  schemaVersion: z.number().int().positive().default(1),
  links: z.array(z.string()).optional(),
  sourceExcerpt: z.string().optional(),
  notes: z.string().optional(),
});

const legacySourceSchema = z.object({
  author: z.string(),
  generator: z.enum(["grok", "gpt", "claude", "human"]),
  version: z.string(),
});

export const lessonFileSchema = z
  .object({
    schema_version: z.number().int().positive().optional(),
    schemaVersion: z.number().int().positive().optional(),
    id: z.string().min(1),
    concept_id: z.string().min(1).optional(),
    conceptId: z.string().min(1).optional(),
    title: z.string().min(1),
    category: z.string().optional(),
    estimated_minutes: z.union([z.literal(5), z.literal(10), z.literal(20), z.literal(30)]).optional(),
    durationMin: z.union([z.literal(5), z.literal(10), z.literal(20), z.literal(30)]).optional(),
    effort: z.enum(["light", "normal", "deep"]),
    level: z.enum(["intro", "core", "journalist"]).optional(),
    prerequisites: z.array(z.string()).default([]),
    go_deeper: z.string().optional(),
    goDeeper: z.string().optional(),
    source: z.union([provenanceSchema, legacySourceSchema]),
    explanation: z.union([z.array(z.string()).min(1), z.string().min(1)]),
    example: z.string().min(1),
    why_it_matters: z.string().optional(),
    whyItMatters: z.string().optional(),
    diagram: z.string().nullable().optional(),
    quiz: z.tuple([quizQuestionSchema, quizQuestionSchema, quizQuestionSchema]),
  })
  .refine((v) => Boolean(v.conceptId || v.concept_id), { message: "conceptId is required" })
  .refine((v) => Boolean(v.durationMin || v.estimated_minutes), {
    message: "durationMin / estimated_minutes is required",
  })
  .refine((v) => Boolean(v.whyItMatters || v.why_it_matters), {
    message: "whyItMatters is required",
  });

export type LessonFileInput = z.infer<typeof lessonFileSchema>;

export const conceptFileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  parentId: z.string().optional(),
  prerequisites: z.array(z.string()),
  level: z.enum(["intro", "core", "journalist"]),
  summary: z.string().min(1),
});

export const generatedLessonSchema = z.object({
  schema_version: z.literal(1).optional(),
  concept_id: z.string().min(1),
  title: z.string().min(4),
  category: z.string().min(1),
  estimated_minutes: z.union([z.literal(5), z.literal(10), z.literal(20), z.literal(30)]),
  effort: z.enum(["light", "normal", "deep"]),
  level: z.enum(["intro", "core", "journalist"]).optional(),
  prerequisites: z.array(z.string()).default([]),
  explanation: z.union([z.array(z.string()).min(1), z.string().min(20)]),
  example: z.string().min(20),
  why_it_matters: z.string().min(20),
  diagram: z.string().nullable().optional(),
  quiz: z.tuple([quizQuestionSchema, quizQuestionSchema, quizQuestionSchema]),
  go_deeper: z.array(z.string()).optional(),
});

export const generatedExplainSchema = z.object({
  explanation: z.union([z.array(z.string()).min(1), z.string().min(20)]),
  example: z.string().min(20),
});

export const generatedQuizSchema = z.object({
  quiz: z.tuple([quizQuestionSchema, quizQuestionSchema, quizQuestionSchema]),
});

export const generatedPathSchema = z.object({
  title: z.string().min(2),
  blurb: z.string().min(8),
  concepts: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        summary: z.string().min(8),
        parentId: z.string().nullable().optional(),
        prerequisites: z.array(z.string()).default([]),
        level: z.enum(["intro", "core", "journalist"]).default("intro"),
      }),
    )
    .min(2)
    .max(16),
  sequence: z.array(z.string()).min(2),
});

export type GeneratedLesson = z.infer<typeof generatedLessonSchema>;
export type GeneratedExplain = z.infer<typeof generatedExplainSchema>;
export type GeneratedQuiz = z.infer<typeof generatedQuizSchema>;
export type GeneratedPath = z.infer<typeof generatedPathSchema>;
