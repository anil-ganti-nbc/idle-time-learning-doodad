import { isBillableAttempt } from "@/lib/learning/accounting";
import { PROMPT_VERSION } from "@/lib/learning/types";
import type { GenerationLogEntry } from "@/lib/learning/types";

export { isBillableAttempt };

export interface AttemptResult {
  ok: boolean;
  error?: string;
  provider?: string;
  model?: string;
  cached?: boolean;
  billable: boolean;
  inputTokens?: number;
  outputTokens?: number;
}

export function toGenerationLog(
  kind: GenerationLogEntry["kind"],
  result: AttemptResult,
  extra?: { lessonId?: string; conceptId?: string },
): GenerationLogEntry {
  return {
    id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    kind,
    provider: result.provider ?? "unknown",
    model: result.model ?? "unknown",
    promptVersion: PROMPT_VERSION,
    ok: result.ok,
    error: result.ok ? undefined : result.error,
    lessonId: extra?.lessonId,
    conceptId: extra?.conceptId,
    cached: result.cached ?? false,
    billable: result.billable,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
  };
}
