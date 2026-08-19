import { createServerFn } from "@tanstack/react-start";
import type { AiProviderId } from "@/lib/learning/types";
import { complete, PROVIDER_META } from "./providers";

export const getAiStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { keySourceMap } = await import("./keys.server");
  const sources = keySourceMap();
  return {
    xaiEnv: sources.xai === "env",
    sources,
    providers: PROVIDER_META,
  };
});

export const runAiCompletion = createServerFn({ method: "POST" })
  .validator(
    (input: {
      provider: AiProviderId;
      model: string;
      system: string;
      user: string;
      userKey?: string;
      localBaseUrl?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const { resolveLocalBaseUrl, resolveProviderKey } = await import("./keys.server");
    const resolved = resolveProviderKey(data.provider, data.userKey);
    const local = resolveLocalBaseUrl(data.localBaseUrl);
    if (data.provider === "local" && local.error) {
      return { ok: false as const, attempted: false as const, error: local.error };
    }
    if (!resolved.key && data.provider !== "local") {
      return {
        ok: false as const,
        attempted: false as const,
        error:
          data.provider === "xai"
            ? "No xAI key. Set XAI_API_KEY, add .dau-secrets.json, or store a browser fallback in Settings."
            : `No API key for ${data.provider}. Set the provider env var, add .dau-secrets.json, or use the browser fallback in Settings.`,
      };
    }
    const result = await complete({
      provider: data.provider,
      model: data.model,
      system: data.system,
      user: data.user,
      apiKey: resolved.key,
      baseUrl: local.url,
      localUrlSource: local.source === "env" || local.source === "file" ? local.source : "user",
      maxTokens: 1800,
    });
    return { ...result, attempted: true as const };
  });
