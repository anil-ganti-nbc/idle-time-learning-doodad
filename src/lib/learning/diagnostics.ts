import { APP_RELEASE, CURRICULUM_VERSION, EXPORT_SCHEMA_VERSION } from "./types";
import { PERSISTENCE, PROGRESS_PERSIST_VERSION } from "./persistence";
import { inspectStorage } from "./storage";

const ALLOWED_SOURCES = new Set(["env", "file", "none"]);

export interface ClientDiagnostics {
  runtime: "ssr" | "browser";
  appRelease: string;
  curriculumVersion: number;
  persistVersion: number;
  exportSchemaVersion: number;
  storage: ReturnType<typeof inspectStorage>;
  storageMode: string;
  curriculum: {
    subjects: number;
    courses: number;
    concepts: number;
    lessons: number;
  };
  aiEnabled: boolean;
  aiProvider: string;
  serverProvider: "env" | "file" | "none" | "unknown";
  notes: string[];
}

function sanitizeSource(value: string | undefined): "env" | "file" | "none" | "unknown" {
  if (value && ALLOWED_SOURCES.has(value)) return value as "env" | "file" | "none";
  return "unknown";
}

export function buildClientDiagnostics(input: {
  subjects: number;
  courses: number;
  concepts: number;
  lessons: number;
  aiEnabled: boolean;
  aiProvider: string;
  serverSources?: Record<string, string>;
}): ClientDiagnostics {
  const storage = inspectStorage();
  const serverProvider = sanitizeSource(input.serverSources?.[input.aiProvider]);
  const notes: string[] = [];
  if (!storage.available) {
    notes.push("Browser storage is blocked. Progress will not survive a reload on this profile.");
  }
  if (storage.session !== "sessionStorage") {
    notes.push("An unfinished lesson cannot be restored after a tab crash.");
  }
  notes.push("A hosted URL is not cross-device sync. Export an archive to move progress.");
  if (input.aiEnabled && serverProvider === "none") {
    notes.push("No server-side provider key. Generation needs a browser fallback key or stays off.");
  }
  return {
    runtime: typeof window === "undefined" ? "ssr" : "browser",
    appRelease: APP_RELEASE,
    curriculumVersion: CURRICULUM_VERSION,
    persistVersion: PROGRESS_PERSIST_VERSION,
    exportSchemaVersion: EXPORT_SCHEMA_VERSION,
    storage,
    storageMode: `${storage.local} / ${storage.session}`,
    curriculum: {
      subjects: input.subjects,
      courses: input.courses,
      concepts: input.concepts,
      lessons: input.lessons,
    },
    aiEnabled: input.aiEnabled,
    aiProvider: input.aiProvider,
    serverProvider,
    notes,
  };
}

export function diagnosticsLeakSecrets(report: ClientDiagnostics, secrets: string[]): boolean {
  const blob = JSON.stringify(report);
  return secrets.some((secret) => secret && blob.includes(secret));
}

export { PERSISTENCE };
