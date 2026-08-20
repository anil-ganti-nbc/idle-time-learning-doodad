/**
 * Bounds for the OpenAI-compatible "local" provider.
 *
 * Env / server-file URLs are operator configuration.
 * Browser-supplied URLs are user input and must not become an SSRF trampoline
 * on a hosted server.
 */

export type LocalUrlSource = "env" | "file" | "user";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export function isLoopbackHost(host: string): boolean {
  const trimmed = host.trim().toLowerCase().replace(/^\[|\]$/g, "");
  return LOOPBACK_HOSTS.has(trimmed);
}

export function parseHttpUrl(raw: string): { ok: true; url: URL } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "Local provider needs a base URL." };
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Local provider URL is not a valid URL." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Local provider URL must be http or https." };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, error: "Local provider URL must not include credentials." };
  }
  return { ok: true, url: parsed };
}

export function normalizeBaseUrl(url: URL): string {
  return url.toString().replace(/\/$/, "");
}

/**
 * User-supplied URLs (Settings / export) may only target loopback.
 * Operator env/file URLs may target whatever the deployer configured.
 */
export function sanitizeLocalBaseUrl(
  raw: string | undefined,
  source: LocalUrlSource,
): { ok: true; url?: string } | { ok: false; error: string } {
  if (!raw?.trim()) return { ok: true };
  const parsed = parseHttpUrl(raw);
  if (!parsed.ok) return parsed;
  if (source === "user" && !isLoopbackHost(parsed.url.hostname)) {
    return {
      ok: false,
      error: "Browser-supplied local provider URLs must target loopback (127.0.0.1 or localhost).",
    };
  }
  return { ok: true, url: normalizeBaseUrl(parsed.url) };
}
