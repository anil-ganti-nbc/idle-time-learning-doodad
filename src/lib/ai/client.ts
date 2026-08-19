import { PROMPT_VERSION } from "@/lib/learning/types";
import type { AiSecrets, AiSettings, Lesson } from "@/lib/learning/types";
import { findCachedLesson } from "./cache";
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
} from "./prompts";
import { estimateTokens } from "./providers";
import { getAiStatus, runAiCompletion } from "./server";

export { getAiStatus };

export interface GenerateContext {
  settings: AiSettings;
  secrets: AiSecrets;
  logCountToday: number;
  sessionGenerations: number;
  existingLessons: Lesson[];
}

export type ClientResult<T> =
  | {
      ok: true;
      value: T;
      cached?: boolean;
      model: string;
      provider: string;
      inputTokens?: number;
      outputTokens?: number;
    }
  | { ok: false; error: string; issues?: string[] };

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

export async function generateLesson(
  ctx: GenerateContext,
  input: LessonPromptInput,
  opts?: { hasLocalMatch?: boolean },
): Promise<ClientResult<Lesson>> {
  const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
  if (!guard.ok) return guard;
  const missing = assertMissingOnly(ctx.settings.policy, Boolean(opts?.hasLocalMatch));
  if (!missing.ok) return missing;

  const cached = findCachedLesson(
    ctx.existingLessons,
    input.concept.id,
    input.durationMin,
    input.effort,
    PROMPT_VERSION,
  );
  if (cached) {
    const full = ctx.existingLessons.find((l) => l.id === cached.id);
    if (full) {
      return {
        ok: true,
        value: full,
        cached: true,
        model: full.source.model ?? ctx.settings.model,
        provider: full.source.provider ?? ctx.settings.provider,
      };
    }
  }

  const user = lessonUserPrompt(input);
  const completion = await completeText(ctx.settings, ctx.secrets, lessonSystemPrompt(), user);
  if (!completion.ok) return completion;
  const json = extractJson(completion.text);
  if (!json.ok) return json;
  const parsed = parseGeneratedLesson(json.value);
  if (!parsed.ok) return parsed;
  const lesson = lessonFromGenerated(parsed.value, {
    conceptId: input.concept.id,
    level: input.concept.level,
    provenance: defaultAiProvenance({
      provider: completion.provider,
      model: completion.model,
      sourceExcerpt: input.sourceText?.slice(0, 400),
    }),
  });
  return {
    ok: true,
    value: lesson,
    model: completion.model,
    provider: completion.provider,
    inputTokens: completion.inputTokens ?? estimateTokens(user),
    outputTokens: completion.outputTokens,
  };
}

export async function generateExplain(
  ctx: GenerateContext,
  lesson: Lesson,
  style: NonNullable<LessonPromptInput["style"]>,
): Promise<ClientResult<{ explanation: string[]; example: string }>> {
  const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
  if (!guard.ok) return guard;
  const completion = await completeText(
    ctx.settings,
    ctx.secrets,
    explainSystemPrompt(),
    explainUserPrompt(lesson, style),
  );
  if (!completion.ok) return completion;
  const json = extractJson(completion.text);
  if (!json.ok) return json;
  const parsed = parseGeneratedExplain(json.value);
  if (!parsed.ok) return parsed;
  const explanation = Array.isArray(parsed.value.explanation)
    ? parsed.value.explanation
    : [parsed.value.explanation];
  return {
    ok: true,
    value: { explanation, example: parsed.value.example },
    model: completion.model,
    provider: completion.provider,
    inputTokens: completion.inputTokens,
    outputTokens: completion.outputTokens,
  };
}

export async function generateQuiz(ctx: GenerateContext, lesson: Lesson) {
  const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
  if (!guard.ok) return guard;
  const completion = await completeText(ctx.settings, ctx.secrets, quizSystemPrompt(), quizUserPrompt(lesson));
  if (!completion.ok) return completion;
  const json = extractJson(completion.text);
  if (!json.ok) return json;
  const parsed = parseGeneratedQuiz(json.value);
  if (!parsed.ok) return parsed;
  return {
    ok: true as const,
    value: parsed.value.quiz,
    model: completion.model,
    provider: completion.provider,
    inputTokens: completion.inputTokens,
    outputTokens: completion.outputTokens,
  };
}

export async function generatePath(ctx: GenerateContext, subject: string, interests: string[]) {
  const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
  if (!guard.ok) return guard;
  const completion = await completeText(
    ctx.settings,
    ctx.secrets,
    pathSystemPrompt(),
    pathUserPrompt(subject, interests),
  );
  if (!completion.ok) return completion;
  const json = extractJson(completion.text);
  if (!json.ok) return json;
  const parsed = parseGeneratedPath(json.value);
  if (!parsed.ok) return parsed;
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
    model: completion.model,
    provider: completion.provider,
    inputTokens: completion.inputTokens,
    outputTokens: completion.outputTokens,
  };
}
