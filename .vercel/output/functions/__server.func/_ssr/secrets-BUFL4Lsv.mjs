import { i as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/secrets-BUFL4Lsv.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("c2b71ab994a8d1ee84d621e29674fed647d9ace14433d69cc4015ed6da34eb4c"));
var runAiCompletion = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("6308d8869c850dbcd0b1dbdf0e5ce6ddfff7fc00a56eed269865c7cd5bde5add"));
var KEY = "dau-secrets";
function loadSecrets() {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {};
		return JSON.parse(raw);
	} catch {
		return {};
	}
}
function saveSecrets(secrets) {
	if (typeof window === "undefined") return;
	localStorage.setItem(KEY, JSON.stringify(secrets));
}
//#endregion
export { saveSecrets as i, loadSecrets as n, runAiCompletion as r, getAiStatus as t };
