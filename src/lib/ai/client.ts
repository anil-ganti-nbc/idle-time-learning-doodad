import { assembleQuiz } from "@/lib/quiz/assemble";
import { PROMPT_VERSION } from "@/lib/learning/types";
import type { AiSecrets, AiSettings, Lesson, PendingPath } from "@/lib/learning/types";
import { cacheKey, findCachedLesson, hashText } from "./cache";
import { assertAiAllowed, assertMissingOnly } from "./guard";
import {
  defaultAiProvenance,
  extractJson,
  lessonFromGenerated,
  parseGeneratedExplain,
  parseGeneratedLesson,
  parseGeneratedPath,
  parseGeneratedQuiz,
  pathConceptsFromGenerated,
} from "./parse";
import {
  explainSystemPrompt,
  explainUserPrompt,
  lessonSystemPrompt,
  lessonUserPrompt,
  pathSystemPrompt,
  pathUserPrompt,
  quizSystemPrompt,
  quizUserPrompt,
  type LessonPromptInput,
  type QuizPromptContext,
} from "./prompts";
import { estimateTokens } from "./providers";
import { bindGeneratedLesson } from "./semantics";
import { getAiStatus, runAiCompletion } from "./server";

export { getAiStatus };

export interface GenerateContext {
  settings: AiSettings;
  secrets: AiSecrets;
  logCountToday: number;
  sessionGenerations: number;
  existingLessons: Lesson[];
  conceptIds: string[];
}

export type ClientResult<T> =
  | {
      ok: true;
      value: T;
      cached?: boolean;
      billable: boolean;
      model: string;
      provider: string;
      inputTokens?: number;
      outputTokens?: number;
    }
  | {
      ok: false;
      error: string;
      issues?: string[];
      billable: boolean;
      model?: string;
      provider?: string;
      inputTokens?: number;
      outputTokens?: number;
    };

type CompletionReply = Awaited<ReturnType<typeof runAiCompletion>>;

function billed(completion: CompletionReply): boolean {
  return "attempted" in completion ? Boolean(completion.attempted) : true;
}

function usageFrom(completion: CompletionReply, user: string): { inputTokens: number; outputTokens?: number } {
  if (completion.ok) {
    return {
      inputTokens: completion.inputTokens ?? estimateTokens(user),
      outputTokens: completion.outputTokens,
    };
  }
  return { inputTokens: estimateTokens(user) };
}

async function completeText(settings: AiSettings, secrets: AiSecrets, system: string, user: string) {
  return runAiCompletion({
    data: {
      provider: settings.provider,
      model: settings.model,
      system,
      user,
      userKey:
        settings.provider === "xai"
          ? secrets.xai
          : settings.provider === "openai"
            ? secrets.openai
            : settings.provider === "anthropic"
              ? secrets.anthropic
              : settings.provider === "gemini"
                ? secrets.gemini
                : secrets.localApiKey,
      localBaseUrl: secrets.localBaseUrl,
    },
  });
}

function lessonCacheQuery(input: LessonPromptInput) {
  return {
    kind: input.adapt === "harder" || input.journalist ? ("deeper" as const) : ("lesson" as const),
    conceptId: input.concept.id,
    durationMin: input.durationMin,
    effort: input.effort,
    level: input.concept.level,
    journalist: input.journalist,
    adapt: input.adapt,
    style: input.style,
    sourceHash: input.sourceText ? hashText(input.sourceText) : undefined,
    promptVersion: PROMPT_VERSION,
  };
}

export async function generateLesson(
  ctx: GenerateContext,
  input: LessonPromptInput,
  opts?: { hasLocalMatch?: boolean },
): Promise<ClientResult<Lesson>> {
  const meta = { provider: ctx.settings.provider, model: ctx.settings.model };
  const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
  if (!guard.ok) return { ...guard, billable: false, ...meta };
  const missing = assertMissingOnly(ctx.settings.policy, Boolean(opts?.hasLocalMatch));
  if (!missing.ok) return { ...missing, billable: false, ...meta };

  const query = lessonCacheQuery(input);
  const cached = findCachedLesson(ctx.existingLessons, query);
  if (cached) {
    const full = ctx.existingLessons.find((l) => l.id === cached.id);
    if (full) {
      return {
        ok: true,
        value: full,
        cached: true,
        billable: false,
        model: full.source.model ?? ctx.settings.model,
        provider: full.source.provider ?? ctx.settings.provider,
      };
    }
  }

  const user = lessonUserPrompt(input);
  const completion = await completeText(ctx.settings, ctx.secrets, lessonSystemPrompt(), user);
  const billable = billed(completion);
  const usage = usageFrom(completion, user);
  if (!completion.ok) {
    return { ok: false, error: completion.error, billable, ...meta, ...usage };
  }
  const json = extractJson(completion.text);
  if (!json.ok) return { ...json, billable, provider: completion.provider, model: completion.model, ...usage };
  const parsed = parseGeneratedLesson(json.value);
  if (!parsed.ok) return { ...parsed, billable, provider: completion.provider, model: completion.model, ...usage };
  const bound = bindGeneratedLesson(parsed.value, {
    concept: input.concept,
    durationMin: input.durationMin,
    effort: input.effort,
    journalist: input.journalist,
    knownConceptIds: new Set(ctx.conceptIds),
  });
  if (!bound.ok) {
    return { ...bound, billable, provider: completion.provider, model: completion.model, ...usage };
  }
  const notes = bound.value.discrepancies.length
    ? `curriculum bound: ${bound.value.discrepancies.join("; ")}`
    : undefined;
  let lesson: Lesson;
  try {
    lesson = lessonFromGenerated(parsed.value, {
      conceptId: bound.value.conceptId,
      level: bound.value.level,
      durationMin: bound.value.durationMin,
      effort: bound.value.effort,
      prerequisites: bound.value.prerequisites,
      goDeeper: bound.value.goDeeper,
      provenance: defaultAiProvenance({
        provider: completion.provider,
        model: completion.model,
        sourceExcerpt: input.sourceText?.slice(0, 400),
        cacheKey: cacheKey(query),
        notes,
      }),
    });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Generated quiz failed validation.",
      billable,
      provider: completion.provider,
      model: completion.model,
      ...usage,
    };
  }
  return {
    ok: true,
    value: lesson,
    billable: true,
    model: completion.model,
    provider: completion.provider,
    ...usage,
  };
}

export async function generateExplain(
  ctx: GenerateContext,
  lesson: Lesson,
  style: NonNullable<LessonPromptInput["style"]>,
): Promise<ClientResult<{ explanation: string[]; example: string }>> {
  const meta = { provider: ctx.settings.provider, model: ctx.settings.model };
  const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
  if (!guard.ok) return { ...guard, billable: false, ...meta };
  const user = explainUserPrompt(lesson, style);
  const completion = await completeText(ctx.settings, ctx.secrets, explainSystemPrompt(), user);
  const billable = billed(completion);
  const usage = usageFrom(completion, user);
  if (!completion.ok) return { ok: false, error: completion.error, billable, ...meta, ...usage };
  const json = extractJson(completion.text);
  if (!json.ok) return { ...json, billable, provider: completion.provider, model: completion.model, ...usage };
  const parsed = parseGeneratedExplain(json.value);
  if (!parsed.ok) return { ...parsed, billable, provider: completion.provider, model: completion.model, ...usage };
  const explanation = Array.isArray(parsed.value.explanation)
    ? parsed.value.explanation
    : [parsed.value.explanation];
  return {
    ok: true,
    value: { explanation, example: parsed.value.example },
    billable: true,
    model: completion.model,
    provider: completion.provider,
    ...usage,
  };
}

export async function generateQuiz(
  ctx: GenerateContext,
  lesson: Lesson,
  quizCtx?: QuizPromptContext,
): Promise<ClientResult<Lesson["quiz"]>> {
  const meta = { provider: ctx.settings.provider, model: ctx.settings.model };
  const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
  if (!guard.ok) return { ...guard, billable: false, ...meta };
  const user = quizUserPrompt(lesson, quizCtx);
  const completion = await completeText(ctx.settings, ctx.secrets, quizSystemPrompt(), user);
  const billable = billed(completion);
  const usage = usageFrom(completion, user);
  if (!completion.ok) return { ok: false, error: completion.error, billable, ...meta, ...usage };
  const json = extractJson(completion.text);
  if (!json.ok) return { ...json, billable, provider: completion.provider, model: completion.model, ...usage };
  const parsed = parseGeneratedQuiz(json.value);
  if (!parsed.ok) return { ...parsed, billable, provider: completion.provider, model: completion.model, ...usage };
  const assembled = assembleQuiz(parsed.value.quiz);
  if (!assembled.ok) {
    return {
      ok: false,
      error: assembled.error,
      issues: assembled.issues,
      billable,
      provider: completion.provider,
      model: completion.model,
      ...usage,
    };
  }
  return {
    ok: true as const,
    value: assembled.quiz,
    billable: true,
    model: completion.model,
    provider: completion.provider,
    ...usage,
  };
}

export async function generatePath(
  ctx: GenerateContext,
  subject: string,
  interests: string[],
): Promise<ClientResult<PendingPath>> {
  const meta = { provider: ctx.settings.provider, model: ctx.settings.model };
  const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
  if (!guard.ok) return { ...guard, billable: false, ...meta };
  const user = pathUserPrompt(subject, interests);
  const completion = await completeText(ctx.settings, ctx.secrets, pathSystemPrompt(), user);
  const billable = billed(completion);
  const usage = usageFrom(completion, user);
  if (!completion.ok) return { ok: false, error: completion.error, billable, ...meta, ...usage };
  const json = extractJson(completion.text);
  if (!json.ok) return { ...json, billable, provider: completion.provider, model: completion.model, ...usage };
  const parsed = parseGeneratedPath(json.value);
  if (!parsed.ok) return { ...parsed, billable, provider: completion.provider, model: completion.model, ...usage };
  const categoryId = `path-${subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 24)}-${Date.now().toString(36)}`;
  return {
    ok: true as const,
    value: {
      id: categoryId,
      subject,
      title: parsed.value.title,
      blurb: parsed.value.blurb,
      createdAt: new Date().toISOString(),
      provider: completion.provider,
      model: completion.model,
      concepts: pathConceptsFromGenerated(parsed.value, categoryId),
      sequence: parsed.value.sequence,
    },
    billable: true,
    model: completion.model,
    provider: completion.provider,
    ...usage,
  };
}
