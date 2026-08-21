//#region node_modules/.nitro/vite/services/ssr/assets/storage-CceMV1qh.js
/**
* Where Dead Air University actually stores things.
*
* Learning state never touches PGLite / Postgres. Those are only used by the
* optional Better Auth stack. A server restart cannot wipe a concept, session,
* or review schedule.
*/
var PROGRESS_STORAGE_KEY = "dau-progress-v1";
var SECRETS_STORAGE_KEY = "dau-secrets";
var LIVE_SESSION_KEY = "dau-live-session";
var ROLLBACK_STORAGE_KEY = "dau-import-rollback";
function survives(event) {
	switch (event) {
		case "refresh": return {
			progress: true,
			secrets: true,
			live: true,
			note: "Same tab keeps the in-progress lesson. Progress and keys stay."
		};
		case "browserRestart": return {
			progress: true,
			secrets: true,
			live: false,
			note: "Progress and keys survive. An unfinished lesson is dropped; finish or export first."
		};
		case "serverRestart": return {
			progress: true,
			secrets: true,
			live: true,
			note: "The server holds no learning state. Browser storage is the source of truth."
		};
		case "deviceChange": return {
			progress: false,
			secrets: false,
			live: false,
			note: "A hosted URL is not sync. Export a JSON archive and import it on the other device."
		};
	}
}
function memoryStorage(initial = {}) {
	const data = { ...initial };
	return {
		getItem: (key) => data[key] ?? null,
		setItem: (key, value) => {
			data[key] = value;
		},
		removeItem: (key) => {
			delete data[key];
		}
	};
}
function probeWebStorage(store) {
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
function nativeStore(kind) {
	if (typeof window === "undefined") return null;
	try {
		const store = kind === "local" ? window.localStorage : window.sessionStorage;
		if (!store || !probeWebStorage(store)) return null;
		return store;
	} catch {
		return null;
	}
}
function inspectStorage() {
	const local = nativeStore("local") ? "localStorage" : "memory";
	return {
		local,
		session: nativeStore("session") ? "sessionStorage" : "memory",
		available: local === "localStorage"
	};
}
var sessionFallback = memoryStorage();
var persistFallback = memoryStorage();
/** Session (in-progress lesson). Memory fallback lasts for this JS context only. */
function liveStorage() {
	return nativeStore("session") ?? sessionFallback;
}
/** Zustand persist backend. Memory fallback is tab-local and empty after reload. */
function persistStorage() {
	return nativeStore("local") ?? persistFallback;
}
function secretsStorage() {
	return persistStorage();
}
//#endregion
export { inspectStorage as a, secretsStorage as c, SECRETS_STORAGE_KEY as i, survives as l, PROGRESS_STORAGE_KEY as n, liveStorage as o, ROLLBACK_STORAGE_KEY as r, persistStorage as s, LIVE_SESSION_KEY as t };
