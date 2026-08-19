//#region node_modules/.nitro/vite/services/ssr/assets/live-Cdzq3AeC.js
var KEY = "dau-live-session";
function startLive(session) {
	const next = {
		generations: 0,
		...session
	};
	sessionStorage.setItem(KEY, JSON.stringify(next));
	return next;
}
function getLive() {
	if (typeof window === "undefined") return null;
	const raw = sessionStorage.getItem(KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function patchLive(partial) {
	const cur = getLive();
	if (!cur) return null;
	const next = {
		...cur,
		...partial
	};
	sessionStorage.setItem(KEY, JSON.stringify(next));
	return next;
}
function bumpLiveGeneration() {
	const cur = getLive();
	const generations = (cur?.generations ?? 0) + 1;
	if (cur) patchLive({ generations });
	return generations;
}
function clearLive() {
	if (typeof window === "undefined") return;
	sessionStorage.removeItem(KEY);
}
function elapsedMinutes(startedAt, now = Date.now()) {
	return Math.max(1, Math.round((now - new Date(startedAt).getTime()) / 6e4));
}
//#endregion
export { patchLive as a, getLive as i, clearLive as n, startLive as o, elapsedMinutes as r, bumpLiveGeneration as t };
