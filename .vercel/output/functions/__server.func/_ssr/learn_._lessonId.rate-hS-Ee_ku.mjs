import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route } from "./router-BLJIBKSA.mjs";
import { m as useProgress, p as useCatalog, r as daysUntil, u as lessonsForConceptFrom } from "./use-catalog-Be-DbnEV.mjs";
import { t as conceptState } from "./state-D3pzMau2.mjs";
import { t as Button } from "./button-WNIv-gfX.mjs";
import { a as useAiContext, n as generateLesson } from "./use-ai-ColkSuBf.mjs";
import { i as getLive, n as clearLive, o as startLive, r as elapsedMinutes } from "./live-Cdzq3AeC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn_._lessonId.rate-hS-Ee_ku.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RATINGS = [
	{
		id: "didnt_get_it",
		label: "Didn't get it",
		hint: "Review tomorrow"
	},
	{
		id: "mostly",
		label: "Mostly",
		hint: "Review in a few days"
	},
	{
		id: "got_it",
		label: "Got it",
		hint: "Stretch the interval"
	}
];
function RatePage() {
	const { lessonId } = Route.useParams();
	const navigate = useNavigate();
	const catalog = useCatalog();
	const lesson = catalog.lessonMap[lessonId];
	const record = useProgress((s) => s.recordSession);
	const lastMode = useProgress((s) => s.settings.lastMode);
	const lastTime = useProgress((s) => s.settings.lastTime);
	const progress = useProgress((s) => s.concepts);
	const upsertLesson = useProgress((s) => s.upsertLesson);
	const logGeneration = useProgress((s) => s.logGeneration);
	const ai = useProgress((s) => s.ai);
	const aiCtx = useAiContext(getLive()?.generations ?? 0);
	const [doneId, setDoneId] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const snapshot = (0, import_react.useMemo)(() => {
		if (typeof window === "undefined") return null;
		return getLive();
	}, []);
	const stored = useProgress((s) => doneId ? s.concepts[lesson?.conceptId ?? ""] : void 0);
	if (!lesson) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Unit not found"
		})
	});
	const unit = lesson;
	const concept = catalog.conceptMap[unit.conceptId];
	const quizCorrect = snapshot?.quizCorrect ?? 0;
	function rate(understanding) {
		let live = getLive();
		if (!live || live.lessonId !== unit.id) live = startLive({
			lessonId: unit.id,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			mode: lastMode,
			timeBudget: lastTime
		});
		const session = record({
			lessonId: unit.id,
			conceptId: unit.conceptId,
			categoryId: concept?.category ?? "history",
			startedAt: live.startedAt,
			estimatedMinutes: unit.durationMin,
			actualMinutes: elapsedMinutes(live.startedAt),
			quizCorrect: live.quizCorrect ?? quizCorrect,
			quizTotal: 3,
			understanding,
			mode: live.mode,
			timeBudget: live.timeBudget,
			sourceType: unit.source.type,
			sourceProvider: unit.source.provider
		});
		clearLive();
		setDoneId(session.id);
	}
	async function generateDeeper() {
		if (!concept) return;
		setBusy(true);
		const known = Object.values(progress).filter((p) => conceptState(p) === "strong" || conceptState(p) === "understood").map((p) => ({
			id: p.conceptId,
			name: catalog.conceptMap[p.conceptId]?.name ?? p.conceptId
		}));
		const result = await generateLesson(aiCtx, {
			concept: {
				...concept,
				level: "journalist",
				summary: `Deeper follow-up after “${unit.title}”. Quiz ${stored?.lastQuizScore ?? quizCorrect}/3.`
			},
			durationMin: unit.durationMin,
			effort: "deep",
			journalist: true,
			known,
			weak: [],
			recent: [{
				title: unit.title,
				conceptId: unit.conceptId
			}],
			adapt: stored && (stored.lastQuizScore ?? 0) >= 2 ? "harder" : "simpler"
		});
		setBusy(false);
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		upsertLesson(result.value);
		logGeneration({
			id: `gen-${Date.now()}`,
			at: (/* @__PURE__ */ new Date()).toISOString(),
			kind: "deeper",
			provider: result.provider,
			model: result.model,
			promptVersion: "dau-lesson-v1",
			ok: true,
			lessonId: result.value.id,
			conceptId: concept.id,
			cached: result.cached
		});
		startLive({
			lessonId: result.value.id,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			mode: "explore",
			timeBudget: result.value.durationMin
		});
		navigate({
			to: "/learn/$lessonId",
			params: { lessonId: result.value.id }
		});
	}
	if (doneId && stored) {
		const deeperSeed = unit.goDeeper ? lessonsForConceptFrom(catalog, unit.goDeeper).sort((a, b) => a.durationMin - b.durationMin)[0] : void 0;
		const until = daysUntil(stored.nextReviewAt);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.18em] text-muted uppercase",
					children: "Logged"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl tracking-tight",
					children: "Gap converted."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Quiz",
							value: `${stored.lastQuizScore ?? 0}/3`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Time",
							value: `${stored.actualMinutes}m`,
							hint: `est. ${unit.durationMin}m`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Next review",
							value: until === null ? "—" : until <= 0 ? "now" : `${until}d`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Times seen",
							value: String(stored.timesStudied)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
					children: [
						deeperSeed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							onClick: () => {
								startLive({
									lessonId: deeperSeed.id,
									startedAt: (/* @__PURE__ */ new Date()).toISOString(),
									mode: "explore",
									timeBudget: deeperSeed.durationMin
								});
								navigate({
									to: "/learn/$lessonId",
									params: { lessonId: deeperSeed.id }
								});
							},
							children: ["Go deeper: ", catalog.conceptMap[unit.goDeeper]?.name]
						}),
						!deeperSeed && ai.enabled && ai.policy !== "off" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => void generateDeeper(),
							disabled: busy,
							children: busy ? "Writing follow-up…" : "Go deeper (generate)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "no-underline",
								children: "Desk"
							})
						})
					]
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tabular-nums text-muted",
				children: [
					"Quiz ",
					quizCorrect,
					"/3"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight",
				children: "How well did that sit?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "This schedules the next review. Honest beats optimistic."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-2",
				children: RATINGS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => rate(r.id),
					className: "min-h-16 rounded-lg bg-surface px-4 py-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[box-shadow] duration-150 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.16)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: r.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-sm text-muted",
						children: r.hint
					})]
				}, r.id))
			})
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-xl tabular-nums",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: hint
			})
		]
	});
}
//#endregion
export { RatePage as component };
