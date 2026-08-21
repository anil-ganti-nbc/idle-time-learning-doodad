import { c as secretsStorage, i as SECRETS_STORAGE_KEY } from "./storage-CceMV1qh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/secrets-Bp-pUZg8.js
var KNOWN_SECRET_KEYS = [
	"xai",
	"openai",
	"anthropic",
	"gemini",
	"localBaseUrl",
	"localApiKey"
];
function parseSecrets(raw) {
	if (!raw || typeof raw !== "object") return {};
	const obj = raw;
	const next = {};
	for (const key of KNOWN_SECRET_KEYS) {
		const value = obj[key];
		if (typeof value === "string" && value.trim()) next[key] = value.trim();
	}
	return next;
}
var browserSecretStore = {
	id: "browser",
	get() {
		try {
			const raw = secretsStorage().getItem(SECRETS_STORAGE_KEY);
			if (!raw) return {};
			return parseSecrets(JSON.parse(raw));
		} catch {
			return {};
		}
	},
	set(secrets) {
		try {
			secretsStorage().setItem(SECRETS_STORAGE_KEY, JSON.stringify(parseSecrets(secrets)));
		} catch {}
	},
	clear() {
		try {
			secretsStorage().removeItem(SECRETS_STORAGE_KEY);
		} catch {}
	}
};
/** Hook for a future desktop keychain. Returns null in the browser app. */
function keychainSecretStore() {
	return null;
}
function loadSecrets() {
	return (keychainSecretStore() ?? browserSecretStore).get();
}
function saveSecrets(secrets) {
	(keychainSecretStore() ?? browserSecretStore).set(secrets);
}
function secretFor(provider, secrets) {
	if (provider === "xai") return secrets.xai ?? "";
	if (provider === "openai") return secrets.openai ?? "";
	if (provider === "anthropic") return secrets.anthropic ?? "";
	if (provider === "gemini") return secrets.gemini ?? "";
	return secrets.localApiKey ?? "";
}
function secretPatch(provider, value) {
	if (provider === "xai") return { xai: value };
	if (provider === "openai") return { openai: value };
	if (provider === "anthropic") return { anthropic: value };
	if (provider === "gemini") return { gemini: value };
	return { localApiKey: value };
}
//#endregion
export { secretPatch as a, secretFor as i, parseSecrets as n, saveSecrets as r, loadSecrets as t };
