import { r as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { n as complete, t as PROVIDER_META } from "./providers-DJN-C4ZR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-CaheyZgC.js
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
	return {
		xaiEnv: Boolean(process.env.XAI_API_KEY),
		providers: PROVIDER_META
	};
});
var runAiCompletion_createServerFn_handler = createServerRpc({
	id: "6308d8869c850dbcd0b1dbdf0e5ce6ddfff7fc00a56eed269865c7cd5bde5add",
	name: "runAiCompletion",
	filename: "src/lib/ai/server.ts"
}, (opts) => runAiCompletion.__executeServer(opts));
var runAiCompletion = createServerFn({ method: "POST" }).validator((input) => input).handler(runAiCompletion_createServerFn_handler, async ({ data }) => {
	const envKey = data.provider === "xai" ? process.env.XAI_API_KEY : void 0;
	const apiKey = data.userKey || envKey;
	if (!apiKey && data.provider !== "local") return {
		ok: false,
		error: data.provider === "xai" ? "No xAI key. Add one in Settings, or set XAI_API_KEY in the environment." : `No API key for ${data.provider}. Add one in Settings.`
	};
	return await complete({
		provider: data.provider,
		model: data.model,
		system: data.system,
		user: data.user,
		apiKey,
		baseUrl: data.localBaseUrl,
		maxTokens: 1800
	});
});
//#endregion
export { getAiStatus_createServerFn_handler, runAiCompletion_createServerFn_handler };
