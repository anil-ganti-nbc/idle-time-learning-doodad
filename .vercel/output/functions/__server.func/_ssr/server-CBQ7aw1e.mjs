import { i as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-CBQ7aw1e.js
function isBillableAttempt(entry) {
	if (entry.cached) return false;
	if (typeof entry.billable === "boolean") return entry.billable;
	return entry.ok;
}
function generationsToday(log, now = /* @__PURE__ */ new Date()) {
	const start = new Date(now);
	start.setHours(0, 0, 0, 0);
	return log.filter((e) => isBillableAttempt(e) && new Date(e.at).getTime() >= start.getTime()).length;
}
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
//#endregion
export { getAiStatus as n, runAiCompletion as r, generationsToday as t };
