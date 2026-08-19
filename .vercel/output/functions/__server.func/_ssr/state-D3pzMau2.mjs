import { l as isDue } from "./use-catalog-Be-DbnEV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/state-D3pzMau2.js
/**
* Derived mastery label. Never written by AI — only from encounters, ratings, quizzes, and the clock.
*
* unseen      never studied
* introduced  first pass, not yet solid
* shaky       failed, low quiz, or repeated "mostly"
* understood  held, not due, not yet strong
* due         scheduled review is waiting
* strong      several clean passes and a long interval
*/
function conceptState(progress, knownByProfile = false, now = /* @__PURE__ */ new Date()) {
	if (!progress?.encountered) return knownByProfile ? "understood" : "unseen";
	if (isDue(progress, now)) return "due";
	const quizWeak = progress.lastQuizScore !== null && progress.quizTotal > 0 && progress.lastQuizScore / 3 < .67;
	const failed = progress.understanding === "didnt_get_it";
	const lingering = progress.understanding === "mostly" && progress.timesStudied >= 2 && quizWeak;
	if (failed || quizWeak && progress.understanding !== "got_it" || lingering) return "shaky";
	if (progress.timesStudied >= 3 && progress.understanding === "got_it" && progress.lastQuizScore === 3 && progress.intervalDays >= 14) return "strong";
	if (progress.timesStudied === 1 && progress.understanding !== "got_it") return "introduced";
	return "understood";
}
function stateLabel(state) {
	switch (state) {
		case "unseen": return "Unseen";
		case "introduced": return "Introduced";
		case "shaky": return "Shaky";
		case "understood": return "Understood";
		case "due": return "Due for review";
		case "strong": return "Strong";
	}
}
function isReady(conceptId, progress, journalist, knownIds, introIds) {
	if (knownIds.includes(conceptId)) return true;
	const p = progress[conceptId];
	if (p && (p.understanding === "got_it" || p.understanding === "mostly")) return true;
	if (journalist && introIds.has(conceptId)) return true;
	return false;
}
//#endregion
export { isReady as n, stateLabel as r, conceptState as t };
