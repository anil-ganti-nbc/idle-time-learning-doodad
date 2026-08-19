import { SECRETS_STORAGE_KEY } from "./persistence";
import type { AiProviderId, AiSecrets } from "./types";

/**
 * Browser-only convenience store. Lowest priority after env and a local
 * server secrets file. Not a vault — keys sit in plaintext localStorage.
 *
 * A desktop wrapper can replace `browserSecretStore` with an OS keychain
 * implementation that satisfies SecretStore. Do not add cloud secret infra.
 */
export type SecretBackend = "env" | "file" | "browser" | "keychain";

export interface SecretStore {
  id: Exclude<SecretBackend, "env" | "file">;
  get(): AiSecrets;
  set(secrets: AiSecrets): void;
  clear(): void;
}

const KNOWN_SECRET_KEYS = [
  "xai",
  "openai",
  "anthropic",
  "gemini",
  "localBaseUrl",
  "localApiKey",
] as const satisfies readonly (keyof AiSecrets)[];

export function parseSecrets(raw: unknown): AiSecrets {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  const next: AiSecrets = {};
  for (const key of KNOWN_SECRET_KEYS) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) next[key] = value.trim();
  }
  return next;
}

export const browserSecretStore: SecretStore = {
  id: "browser",
  get() {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(SECRETS_STORAGE_KEY);
      if (!raw) return {};
      return parseSecrets(JSON.parse(raw));
    } catch {
      return {};
    }
  },
  set(secrets) {
    if (typeof window === "undefined") return;
    localStorage.setItem(SECRETS_STORAGE_KEY, JSON.stringify(parseSecrets(secrets)));
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SECRETS_STORAGE_KEY);
  },
};

/** Hook for a future desktop keychain. Returns null in the browser app. */
export function keychainSecretStore(): SecretStore | null {
  return null;
}

export function loadSecrets(): AiSecrets {
  return (keychainSecretStore() ?? browserSecretStore).get();
}

export function saveSecrets(secrets: AiSecrets) {
  (keychainSecretStore() ?? browserSecretStore).set(secrets);
}

export function clearSecrets() {
  (keychainSecretStore() ?? browserSecretStore).clear();
}

export function secretFor(provider: AiProviderId, secrets: AiSecrets): string {
  if (provider === "xai") return secrets.xai ?? "";
  if (provider === "openai") return secrets.openai ?? "";
  if (provider === "anthropic") return secrets.anthropic ?? "";
  if (provider === "gemini") return secrets.gemini ?? "";
  return secrets.localApiKey ?? "";
}

export function secretPatch(provider: AiProviderId, value: string): Partial<AiSecrets> {
  if (provider === "xai") return { xai: value };
  if (provider === "openai") return { openai: value };
  if (provider === "anthropic") return { anthropic: value };
  if (provider === "gemini") return { gemini: value };
  return { localApiKey: value };
}

export const SECRET_PRIORITY: SecretBackend[] = ["env", "file", "browser"];
