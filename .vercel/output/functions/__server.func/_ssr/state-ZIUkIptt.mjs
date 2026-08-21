import { b as isDue } from "./use-catalog-DsTCgnv9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/state-ZIUkIptt.js
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
	const quizWeak = progress.lastQuizScore !== null && progress.lastQuizScore < .67;
	const failed = progress.understanding === "didnt_get_it";
	const lingering = progress.understanding === "mostly" && progress.timesStudied >= 2 && quizWeak;
	if (failed || quizWeak && progress.understanding !== "got_it" || lingering) return "shaky";
	if (progress.timesStudied >= 3 && progress.understanding === "got_it" && progress.lastQuizScore !== null && progress.lastQuizScore >= 1 && progress.intervalDays >= 14) return "strong";
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
//#endregion
export { stateLabel as n, conceptState as t };
