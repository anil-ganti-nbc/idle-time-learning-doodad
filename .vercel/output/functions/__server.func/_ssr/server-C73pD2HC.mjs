import { r as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { n as complete, t as PROVIDER_META } from "./providers-BwL6YD0o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-C73pD2HC.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "c2b71ab994a8d1ee84d621e29674fed647d9ace14433d69cc4015ed6da34eb4c",
	name: "getAiStatus",
	filename: "src/lib/ai/server.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "GET" }).handler(getAiStatus_createServerFn_handler, async () => {
	const { keySourceMap } = await import("./keys.server-D_HN3szw.mjs");
	const sources = keySourceMap();
	return {
		xaiEnv: sources.xai === "env",
		sources,
		providers: PROVIDER_META
	};
});
var runAiCompletion_createServerFn_handler = createServerRpc({
	id: "6308d8869c850dbcd0b1dbdf0e5ce6ddfff7fc00a56eed269865c7cd5bde5add",
	name: "runAiCompletion",
	filename: "src/lib/ai/server.ts"
}, (opts) => runAiCompletion.__executeServer(opts));
var runAiCompletion = createServerFn({ method: "POST" }).validator((input) => input).handler(runAiCompletion_createServerFn_handler, async ({ data }) => {
	const { resolveLocalBaseUrl, resolveProviderKey } = await import("./keys.server-D_HN3szw.mjs");
	const resolved = resolveProviderKey(data.provider, data.userKey);
	const local = resolveLocalBaseUrl(data.localBaseUrl);
	if (data.provider === "local" && local.error) return {
		ok: false,
		attempted: false,
		error: local.error
	};
	if (!resolved.key && data.provider !== "local") return {
		ok: false,
		attempted: false,
		error: data.provider === "xai" ? "No xAI key. Set XAI_API_KEY, add .dau-secrets.json, or store a browser fallback in Settings." : `No API key for ${data.provider}. Set the provider env var, add .dau-secrets.json, or use the browser fallback in Settings.`
	};
	return {
		...await complete({
			provider: data.provider,
			model: data.model,
			system: data.system,
			user: data.user,
			apiKey: resolved.key,
			baseUrl: local.url,
			localUrlSource: local.source === "env" || local.source === "file" ? local.source : "user",
			maxTokens: 1800
		}),
		attempted: true
	};
});
//#endregion
export { getAiStatus_createServerFn_handler, runAiCompletion_createServerFn_handler };
