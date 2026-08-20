import { z } from "zod";
import { lessonFileSchema } from "@/content/schema";

const understanding = z.enum(["didnt_get_it", "mostly", "got_it"]);
const difficultyNote = z.enum(["too_easy", "right_level", "too_hard", "unclear"]);
const effort = z.enum(["light", "normal", "deep"]);
const mode = z.enum(["explore", "reinforce", "surprise"]);
const level = z.enum(["intro", "core", "journalist"]);
const timeBudget = z.union([z.literal(5), z.literal(10), z.literal(20), z.literal(30)]);
const sourceType = z.enum(["seed", "human", "imported", "ai"]);
const aiProvider = z.enum(["xai", "openai", "anthropic", "gemini", "local"]);
const aiPolicy = z.enum(["off", "manual", "missing-only"]);
const tier = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

const profileSchema = z.object({
  displayName: z.string(),
  preferredTopics: z.array(z.string()),
  knownConceptIds: z.array(z.string()),
  avoidTopics: z.array(z.string()),
  customInterests: z.array(z.string()),
});

const preferencesSchema = z.object({
  journalistDepth: z.boolean(),
  lastTime: timeBudget,
  lastCategory: z.string().nullable(),
  lastEffort: effort.nullable(),
  lastMode: mode,
  preferredDuration: timeBudget,
  preferredEffort: effort.nullable(),
});

const aiSettingsSchema = z.object({
  enabled: z.boolean(),
  provider: aiProvider,
  model: z.string().min(1),
  policy: aiPolicy,
  maxPerDay: z.number(),
  maxPerSession: z.number(),
});

const reviewEventSchema = z.object({
  at: z.string(),
  quizCorrect: z.number(),
  quizTotal: z.number(),
  understanding,
  intervalDays: z.number(),
  ease: z.number(),
});

export const conceptProgressSchema = z.object({
  conceptId: z.string().min(1),
  encountered: z.boolean(),
  understanding: understanding.nullable(),
  quizCorrect: z.number(),
  quizTotal: z.number(),
  lastQuizScore: z.number().nullable(),
  lastQuizCorrect: z.number().nullable().optional(),
  lastQuizTotal: z.number().optional(),
  estimatedMinutes: z.number(),
  actualMinutes: z.number(),
  lastStudiedAt: z.string().nullable(),
  nextReviewAt: z.string().nullable(),
  timesStudied: z.number(),
  ease: z.number(),
  intervalDays: z.number(),
  lapseCount: z.number().optional(),
  reviewHistory: z.array(reviewEventSchema).optional(),
  updatedAt: z.string().nullable().optional(),
});

const sessionRecordSchema = z.object({
  id: z.string().min(1),
  lessonId: z.string().min(1),
  conceptId: z.string().min(1),
  categoryId: z.string().min(1),
  startedAt: z.string(),
  completedAt: z.string(),
  estimatedMinutes: z.number(),
  actualMinutes: z.number(),
  quizCorrect: z.number(),
  quizTotal: z.number(),
  understanding,
  mode,
  timeBudget,
  sourceType,
  sourceProvider: z.string().optional(),
  difficultyNote: difficultyNote.optional(),
});

const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  blurb: z.string(),
  custom: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const conceptSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  parentId: z.string().optional(),
  prerequisites: z.array(z.string()),
  level,
  summary: z.string(),
  custom: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  courseId: z.string().optional(),
  moduleId: z.string().optional(),
  curriculumOrder: z.number().optional(),
  tier: tier.optional(),
  objectives: z.array(z.string()).optional(),
});

const storedLessonSchema = z.union([
  lessonFileSchema,
  z.object({
    schemaVersion: z.number().optional(),
    id: z.string().min(1),
    conceptId: z.string().min(1),
    title: z.string().min(1),
    durationMin: timeBudget,
    effort,
    level,
    prerequisites: z.array(z.string()),
    goDeeper: z.string().optional(),
    source: z.record(z.string(), z.unknown()),
    explanation: z.union([z.array(z.string()), z.string()]),
    example: z.string(),
    whyItMatters: z.string(),
    diagram: z.string().optional(),
    quiz: z.array(z.unknown()).min(3).max(3),
    archived: z.boolean().optional(),
    versions: z.array(z.unknown()).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    custom: z.boolean().optional(),
    feedback: z.array(z.unknown()).optional(),
  }),
]);

const generationLogSchema = z.object({
  id: z.string().min(1),
  at: z.string(),
  kind: z.enum(["lesson", "quiz", "explain", "deeper", "path", "source"]),
  provider: z.string(),
  model: z.string(),
  promptVersion: z.string(),
  ok: z.boolean(),
  error: z.string().optional(),
  lessonId: z.string().optional(),
  conceptId: z.string().optional(),
  cached: z.boolean().optional(),
  billable: z.boolean().optional(),
  inputTokens: z.number().optional(),
  outputTokens: z.number().optional(),
});

const pendingPathSchema = z
  .object({
    id: z.string().min(1),
    subject: z.string(),
    title: z.string(),
    blurb: z.string(),
    createdAt: z.string(),
    provider: z.string(),
    model: z.string(),
    concepts: z.array(conceptSchema),
    sequence: z.array(z.string()),
  })
  .nullable();

const secretsSchema = z
  .object({
    xai: z.string().optional(),
    openai: z.string().optional(),
    anthropic: z.string().optional(),
    gemini: z.string().optional(),
    localBaseUrl: z.string().optional(),
    localApiKey: z.string().optional(),
  })
  .optional();

const courseProgressSchema = z.object({
  courseId: z.string().min(1),
  startedAt: z.string().nullable(),
  lastStudiedAt: z.string().nullable(),
  waivedConceptIds: z.array(z.string()),
  placement: z
    .object({
      at: z.string(),
      recommendedTier: tier,
      waivedConceptIds: z.array(z.string()),
      evidence: z.array(z.string()),
      kind: z.enum(["quiz", "declaration", "inferred"]),
    })
    .optional(),
});

const courseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string(),
  curriculumVersion: z.number(),
  sourceReferences: z.array(
    z.object({
      title: z.string(),
      url: z.string().optional(),
      kind: z.enum(["syllabus", "ocw", "textbook", "vendor", "notes"]),
      notes: z.string(),
    }),
  ),
  entryRequirements: z.array(z.string()),
  modules: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      blurb: z.string().optional(),
      order: z.number(),
      prerequisites: z.array(z.string()),
      conceptIds: z.array(z.string()),
      spineIds: z.array(z.string()),
    }),
  ),
  custom: z.boolean().optional(),
});

export const exportBundleV2Schema = z.object({
  format: z.literal("dead-air-university-export"),
  schema_version: z.literal(2),
  exported_at: z.string().min(1),
  profile: profileSchema,
  preferences: preferencesSchema,
  ai: aiSettingsSchema,
  secrets: secretsSchema,
  progress: z.object({
    concepts: z.record(z.string(), conceptProgressSchema),
    sessions: z.array(sessionRecordSchema),
    recentCategoryIds: z.array(z.string()),
    courses: z.record(z.string(), courseProgressSchema).optional(),
    assessmentHistory: z
      .object({
        items: z.array(
          z.object({
            at: z.string(),
            lessonId: z.string(),
            conceptId: z.string(),
            questionId: z.string(),
            courseId: z.string().optional(),
            moduleId: z.string().optional(),
            objectiveIds: z.array(z.string()).default([]),
            cognitiveType: z.string().optional(),
            difficultyTier: tier.optional(),
            answerIndex: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            correct: z.boolean(),
            laterPoorRating: z.boolean().optional(),
            generationKind: z.enum(["seeded", "generated"]).optional(),
            promptVersion: z.string().optional(),
            provider: z.string().optional(),
            model: z.string().optional(),
          }),
        ),
        recentPositions: z.array(z.number()),
      })
      .optional(),
  }),
  catalog: z.object({
    categories: z.array(categorySchema),
    concepts: z.array(conceptSchema),
    lessons: z.array(storedLessonSchema),
    courses: z.array(courseSchema).optional(),
  }),
  generation_log: z.array(generationLogSchema),
  pending_path: pendingPathSchema,
});

export type ValidatedExportV2 = z.infer<typeof exportBundleV2Schema>;

export function formatZodIssues(error: z.ZodError): string {
  const first = error.issues[0];
  const path = first?.path?.length ? first.path.join(".") : "root";
  return `Invalid export (${path}): ${first?.message ?? "failed schema validation."}`;
}

export function secretExportGuard(
  includeKeys: boolean,
  confirmed: boolean,
): { ok: true } | { ok: false; error: string } {
  if (!includeKeys) return { ok: true };
  if (!confirmed) {
    return { ok: false, error: "Plaintext key export requires explicit confirmation." };
  }
  return { ok: true };
}
