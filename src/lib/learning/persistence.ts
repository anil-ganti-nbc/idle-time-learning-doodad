/**
 * Where Dead Air University actually stores things.
 *
 * Learning state never touches PGLite / Postgres. Those are only used by the
 * optional Better Auth stack. A server restart cannot wipe a concept, session,
 * or review schedule.
 */

export const PROGRESS_STORAGE_KEY = "dau-progress-v1";
export const SECRETS_STORAGE_KEY = "dau-secrets";
export const LIVE_SESSION_KEY = "dau-live-session";
export const ROLLBACK_STORAGE_KEY = "dau-import-rollback";
export const PROGRESS_PERSIST_VERSION = 4;

export const PERSISTENCE = {
  progress: {
    key: PROGRESS_STORAGE_KEY,
    backend: "localStorage" as const,
    version: PROGRESS_PERSIST_VERSION,
    contains: [
      "profile",
      "preferences",
      "ai settings (not keys)",
      "concept progress / SRS",
      "session history",
      "custom catalog",
      "generation log",
      "pending learning path",
      "course progress / placement waivers",
    ],
  },
  rollback: {
    key: ROLLBACK_STORAGE_KEY,
    backend: "localStorage" as const,
    contains: ["last replace-import snapshot"],
  },
  secrets: {
    key: SECRETS_STORAGE_KEY,
    backend: "localStorage" as const,
    contains: ["optional browser-fallback API keys"],
  },
  live: {
    key: LIVE_SESSION_KEY,
    backend: "sessionStorage" as const,
    contains: ["in-progress lesson (quiz answers, start time)"],
  },
  pglite: {
    backend: "in-memory / server process" as const,
    contains: ["Better Auth tables only — never learning state"],
  },
} as const;

export type PersistenceEvent = "refresh" | "browserRestart" | "serverRestart" | "deviceChange";

export function survives(event: PersistenceEvent): {
  progress: boolean;
  secrets: boolean;
  live: boolean;
  note: string;
} {
  switch (event) {
    case "refresh":
      return {
        progress: true,
        secrets: true,
        live: true,
        note: "Same tab keeps the in-progress lesson. Progress and keys stay.",
      };
    case "browserRestart":
      return {
        progress: true,
        secrets: true,
        live: false,
        note: "Progress and keys survive. An unfinished lesson is dropped; finish or export first.",
      };
    case "serverRestart":
      return {
        progress: true,
        secrets: true,
        live: true,
        note: "The server holds no learning state. Browser storage is the source of truth.",
      };
    case "deviceChange":
      return {
        progress: false,
        secrets: false,
        live: false,
        note: "Nothing moves with you unless you export and import a JSON archive.",
      };
  }
}

export function learningStateIsBrowserLocal(): true {
  return true;
}
