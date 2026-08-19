import type { AiSecrets } from "./types";

const KEY = "dau-secrets";

export function loadSecrets(): AiSecrets {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as AiSecrets;
  } catch {
    return {};
  }
}

export function saveSecrets(secrets: AiSecrets) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(secrets));
}

export function clearSecrets() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
