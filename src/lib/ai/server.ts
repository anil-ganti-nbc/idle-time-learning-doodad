import { createServerFn } from "@tanstack/react-start";
import type { AiProviderId } from "@/lib/learning/types";
import { complete, PROVIDER_META } from "./providers";

export const getAiStatus = createServerFn({ method: "GET" }).handler(async () => {
  return {
    xaiEnv: Boolean(process.env.XAI_API_KEY),
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
    const envKey = data.provider === "xai" ? process.env.XAI_API_KEY : undefined;
    const apiKey = data.userKey || envKey;
    if (!apiKey && data.provider !== "local") {
      return {
        ok: false as const,
        error:
          data.provider === "xai"
            ? "No xAI key. Add one in Settings, or set XAI_API_KEY in the environment."
            : `No API key for ${data.provider}. Add one in Settings.`,
      };
    }
    const result = await complete({
      provider: data.provider,
      model: data.model,
      system: data.system,
      user: data.user,
      apiKey,
      baseUrl: data.localBaseUrl,
      maxTokens: 1800,
    });
    return result;
  });
