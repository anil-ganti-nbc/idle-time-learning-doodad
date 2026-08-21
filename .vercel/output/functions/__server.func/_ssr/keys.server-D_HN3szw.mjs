import { n as parseSecrets } from "./secrets-Bp-pUZg8.mjs";
import { i as sanitizeLocalBaseUrl } from "./providers-BwL6YD0o.mjs";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/keys.server-D_HN3szw.js
var ENV_KEY = {
	xai: ["XAI_API_KEY"],
	openai: ["OPENAI_API_KEY"],
	anthropic: ["ANTHROPIC_API_KEY"],
	gemini: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
	local: ["DAU_LOCAL_API_KEY"]
};
var LOCAL_SECRETS_FILENAME = ".dau-secrets.json";
function envValue(names) {
	for (const name of names) {
		const value = process.env[name];
		if (value && value.trim()) return value.trim();
	}
}
function secretsFilePath() {
	return [process.env.DAU_SECRETS_FILE?.trim(), resolve(process.cwd(), LOCAL_SECRETS_FILENAME)].filter(Boolean);
}
/**
* Local-operator file only. Serverless hosts typically have no durable cwd,
* so this returns {} unless DAU_SECRETS_FILE points at a readable file.
* Hosted deployments should use environment variables.
*/
function loadServerSecretsFile() {
	for (const path of secretsFilePath()) try {
		if (!existsSync(path)) continue;
		return parseSecrets(JSON.parse(readFileSync(path, "utf8")));
	} catch {
		continue;
	}
	return {};
}
function fileValue(provider) {
	const file = loadServerSecretsFile();
	if (provider === "xai") return file.xai;
	if (provider === "openai") return file.openai;
	if (provider === "anthropic") return file.anthropic;
	if (provider === "gemini") return file.gemini;
	return file.localApiKey;
}
/**
* Priority: environment → local server file → caller-supplied browser fallback.
* Never returns the key in status APIs.
*/
function resolveProviderKey(provider, userKey) {
	const fromEnv = envValue(ENV_KEY[provider]);
	if (fromEnv) return {
		key: fromEnv,
		source: "env"
	};
	const fromFile = fileValue(provider);
	if (fromFile) return {
		key: fromFile,
		source: "file"
	};
	if (userKey?.trim()) return {
		key: userKey.trim(),
		source: "user"
	};
	return { source: "none" };
}
function resolveLocalBaseUrl(userBaseUrl) {
	const fromEnv = envValue(["DAU_LOCAL_BASE_URL"]);
	if (fromEnv) return finalizeLocalUrl(fromEnv, "env");
	const fromFile = loadServerSecretsFile().localBaseUrl;
	if (fromFile) return finalizeLocalUrl(fromFile, "file");
	if (userBaseUrl?.trim()) return finalizeLocalUrl(userBaseUrl, "user");
	return { source: "none" };
}
function finalizeLocalUrl(raw, source) {
	const sanitized = sanitizeLocalBaseUrl(raw, source);
	if (!sanitized.ok) return {
		source,
		error: sanitized.error
	};
	return {
		url: sanitized.url,
		source
	};
}
function keySourceMap() {
	const file = loadServerSecretsFile();
	const hasFile = {
		xai: Boolean(file.xai),
		openai: Boolean(file.openai),
		anthropic: Boolean(file.anthropic),
		gemini: Boolean(file.gemini),
		local: Boolean(file.localApiKey || file.localBaseUrl)
	};
	const out = {};
	for (const provider of Object.keys(ENV_KEY)) if (envValue(ENV_KEY[provider]) || provider === "local" && envValue(["DAU_LOCAL_BASE_URL"])) out[provider] = "env";
	else if (hasFile[provider]) out[provider] = "file";
	else out[provider] = "none";
	return out;
}
//#endregion
export { keySourceMap, resolveLocalBaseUrl, resolveProviderKey };
