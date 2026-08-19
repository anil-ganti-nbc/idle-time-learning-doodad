import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseSecrets } from "@/lib/learning/secrets";
import type { AiProviderId, AiSecrets } from "@/lib/learning/types";

export type ResolvedKeySource = "env" | "file" | "user" | "none";

const ENV_KEY: Record<AiProviderId, string[]> = {
  xai: ["XAI_API_KEY"],
  openai: ["OPENAI_API_KEY"],
  anthropic: ["ANTHROPIC_API_KEY"],
  gemini: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
  local: ["DAU_LOCAL_API_KEY"],
};

export const LOCAL_SECRETS_FILENAME = ".dau-secrets.json";

function envValue(names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

function secretsFilePath(): string[] {
  const custom = process.env.DAU_SECRETS_FILE?.trim();
  return [custom, resolve(process.cwd(), LOCAL_SECRETS_FILENAME)].filter(Boolean) as string[];
}

export function loadServerSecretsFile(): AiSecrets {
  for (const path of secretsFilePath()) {
    try {
      if (!existsSync(path)) continue;
      return parseSecrets(JSON.parse(readFileSync(path, "utf8")));
    } catch {
      continue;
    }
  }
  return {};
}

function fileValue(provider: AiProviderId): string | undefined {
  const file = loadServerSecretsFile();
  if (provider === "xai") return file.xai;
  if (provider === "openai") return file.openai;
  if (provider === "anthropic") return file.anthropic;
  if (provider === "gemini") return file.gemini;
  return file.localApiKey;
}

/**
 * Priority: environment → local server file → caller-supplied browser fallback.
 * Never returns the key in status APIs.
 */
export function resolveProviderKey(
  provider: AiProviderId,
  userKey?: string,
): { key?: string; source: ResolvedKeySource } {
  const fromEnv = envValue(ENV_KEY[provider]);
  if (fromEnv) return { key: fromEnv, source: "env" };
  const fromFile = fileValue(provider);
  if (fromFile) return { key: fromFile, source: "file" };
  if (userKey?.trim()) return { key: userKey.trim(), source: "user" };
  return { source: "none" };
}

export function resolveLocalBaseUrl(userBaseUrl?: string): { url?: string; source: ResolvedKeySource } {
  const fromEnv = envValue(["DAU_LOCAL_BASE_URL"]);
  if (fromEnv) return { url: fromEnv, source: "env" };
  const fromFile = loadServerSecretsFile().localBaseUrl;
  if (fromFile) return { url: fromFile, source: "file" };
  if (userBaseUrl?.trim()) return { url: userBaseUrl.trim(), source: "user" };
  return { source: "none" };
}

export function keySourceMap(): Record<AiProviderId, Exclude<ResolvedKeySource, "user">> {
  const file = loadServerSecretsFile();
  const hasFile: Record<AiProviderId, boolean> = {
    xai: Boolean(file.xai),
    openai: Boolean(file.openai),
    anthropic: Boolean(file.anthropic),
    gemini: Boolean(file.gemini),
    local: Boolean(file.localApiKey || file.localBaseUrl),
  };
  const out = {} as Record<AiProviderId, Exclude<ResolvedKeySource, "user">>;
  for (const provider of Object.keys(ENV_KEY) as AiProviderId[]) {
    if (envValue(ENV_KEY[provider]) || (provider === "local" && envValue(["DAU_LOCAL_BASE_URL"]))) {
      out[provider] = "env";
    } else if (hasFile[provider]) {
      out[provider] = "file";
    } else {
      out[provider] = "none";
    }
  }
  return out;
}
