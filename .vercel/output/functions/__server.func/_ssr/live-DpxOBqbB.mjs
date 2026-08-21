import { o as liveStorage, t as LIVE_SESSION_KEY } from "./storage-CceMV1qh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-DpxOBqbB.js
function writeLive(next) {
	try {
		liveStorage().setItem(LIVE_SESSION_KEY, JSON.stringify(next));
	} catch {}
}
function startLive(session) {
	const next = {
		generations: 0,
		...session
	};
	writeLive(next);
	return next;
}
function getLive() {
	try {
		const raw = liveStorage().getItem(LIVE_SESSION_KEY);
		if (!raw) return null;
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
	writeLive(next);
	return next;
}
function bumpLiveGeneration() {
	const cur = getLive();
	const generations = (cur?.generations ?? 0) + 1;
	if (cur) patchLive({ generations });
	return generations;
}
function clearLive() {
	try {
		liveStorage().removeItem(LIVE_SESSION_KEY);
	} catch {}
}
function elapsedMinutes(startedAt, now = Date.now()) {
	return Math.max(1, Math.round((now - new Date(startedAt).getTime()) / 6e4));
}
/** Opening a gap with a freshly generated lesson already consumed one billable call. */
function generationsAfterStart(billable) {
	return billable ? 1 : 0;
}
//#endregion
export { getLive as a, generationsAfterStart as i, clearLive as n, patchLive as o, elapsedMinutes as r, startLive as s, bumpLiveGeneration as t };
