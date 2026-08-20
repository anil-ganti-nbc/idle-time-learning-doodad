/**
 * Browser storage with a memory fallback.
 *
 * Safari private mode, blocked cookies, and SSR all make localStorage throw or
 * disappear. Learning must still boot; it just will not survive a reload.
 */

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type StorageKind = "localStorage" | "sessionStorage" | "memory";

export function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage {
  const data = { ...initial };
  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

export function probeWebStorage(store: KeyValueStorage): boolean {
  try {
    const key = "__dau_storage_probe__";
    store.setItem(key, "1");
    const ok = store.getItem(key) === "1";
    store.removeItem(key);
    return ok;
  } catch {
    return false;
  }
}

function nativeStore(kind: "local" | "session"): KeyValueStorage | null {
  if (typeof window === "undefined") return null;
  try {
    const store = kind === "local" ? window.localStorage : window.sessionStorage;
    if (!store || !probeWebStorage(store)) return null;
    return store;
  } catch {
    return null;
  }
}

export function inspectStorage(): {
  local: StorageKind;
  session: StorageKind;
  available: boolean;
} {
  const local = nativeStore("local") ? "localStorage" : "memory";
  const session = nativeStore("session") ? "sessionStorage" : "memory";
  return { local, session, available: local === "localStorage" };
}

const sessionFallback = memoryStorage();
const persistFallback = memoryStorage();

/** Session (in-progress lesson). Memory fallback lasts for this JS context only. */
export function liveStorage(): KeyValueStorage {
  return nativeStore("session") ?? sessionFallback;
}

/** Zustand persist backend. Memory fallback is tab-local and empty after reload. */
export function persistStorage(): KeyValueStorage {
  return nativeStore("local") ?? persistFallback;
}

export function secretsStorage(): KeyValueStorage {
  return persistStorage();
}
