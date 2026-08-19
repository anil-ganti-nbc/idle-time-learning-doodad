import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Route$6, o as cn } from "./router-BLJIBKSA.mjs";
import { m as useProgress, p as useCatalog } from "./use-catalog-Be-DbnEV.mjs";
import { t as HydrateGate } from "./hydrate-NroyXG9v.mjs";
import { t as conceptState } from "./state-D3pzMau2.mjs";
import { r as selectLesson, t as missingConceptForGeneration } from "./select-AwSLjyBd.mjs";
import { t as Button } from "./button-WNIv-gfX.mjs";
import { a as useAiContext, n as generateLesson } from "./use-ai-ColkSuBf.mjs";
import { i as getLive, o as startLive } from "./live-Cdzq3AeC.mjs";
import { t as JournalistToggle } from "./journalist-toggle-u9MkLlyG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-DYYnaXo0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIMES = [
	{
		value: 5,
		label: "5 min"
	},
	{
		value: 10,
		label: "10 min"
	},
	{
		value: 20,
		label: "20 min"
	},
	{
		value: 30,
		label: "30+"
	}
];
var MODE_OPTS = [
	{
		value: "explore",
		label: "Explore",
		hint: "A new concept that fits"
	},
	{
		value: "reinforce",
		label: "Reinforce",
		hint: "Due reviews first"
	},
	{
		value: "surprise",
		label: "Surprise me",
		hint: "Away from recent topics"
	}
];
var EFFORT_OPTS = [
	{
		value: null,
		label: "Any"
	},
	{
		value: "light",
		label: "Light"
	},
	{
		value: "normal",
		label: "Normal"
	},
	{
		value: "deep",
		label: "Deep"
	}
];
function SessionPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionReady, {}) });
}
function SessionReady() {
	const search = Route$6.useSearch();
	const navigate = useNavigate();
	const catalog = useCatalog();
	const settings = useProgress((s) => s.settings);
	const profile = useProgress((s) => s.profile);
	const remember = useProgress((s) => s.rememberRouter);
	const progress = useProgress((s) => s.concepts);
	const recent = useProgress((s) => s.recentCategoryIds);
	const upsertLesson = useProgress((s) => s.upsertLesson);
	const logGeneration = useProgress((s) => s.logGeneration);
	const ai = useProgress((s) => s.ai);
	const liveGens = getLive()?.generations ?? 0;
	const aiCtx = useAiContext(liveGens);
	const initialCategory = search.category ?? settings.lastCategory ?? profile.preferredTopics[0] ?? null;
	const initialMode = search.mode ?? settings.lastMode;
	const [minutes, setMinutes] = (0, import_react.useState)(settings.lastTime || settings.preferredDuration);
	const [category, setCategory] = (0, import_react.useState)(initialCategory);
	const [effort, setEffort] = (0, import_react.useState)(settings.lastEffort ?? settings.preferredEffort);
	const [mode, setMode] = (0, import_react.useState)(initialMode);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const preview = (0, import_react.useMemo)(() => selectLesson({
		minutes,
		category,
		effort,
		mode,
		journalistDepth: settings.journalistDepth
	}, progress, recent, catalog, profile), [
		minutes,
		category,
		effort,
		mode,
		settings.journalistDepth,
		progress,
		recent,
		catalog,
		profile
	]);
	const missing = (0, import_react.useMemo)(() => missingConceptForGeneration({
		minutes,
		category,
		effort,
		mode,
		journalistDepth: settings.journalistDepth
	}, progress, catalog, profile), [
		minutes,
		category,
		effort,
		mode,
		settings.journalistDepth,
		progress,
		catalog,
		profile
	]);
	function go(lessonId) {
		remember({
			lastTime: minutes,
			lastCategory: category,
			lastEffort: effort,
			lastMode: mode
		});
		startLive({
			lessonId,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			mode,
			timeBudget: minutes
		});
		navigate({
			to: "/learn/$lessonId",
			params: { lessonId }
		});
	}
	function start() {
		if (!preview) {
			setError("Nothing in the catalog fits this combination. Widen topic or time, or generate a unit.");
			return;
		}
		go(preview.lesson.id);
	}
	async function generateMissing() {
		if (!missing) return;
		const concept = catalog.conceptMap[missing.conceptId];
		if (!concept) return;
		setBusy(true);
		setError(null);
		const known = profile.knownConceptIds.map((id) => catalog.conceptMap[id]).filter(Boolean).map((c) => ({
			id: c.id,
			name: c.name
		}));
		const weak = Object.values(progress).filter((p) => conceptState(p) === "shaky").map((p) => ({
			id: p.conceptId,
			name: catalog.conceptMap[p.conceptId]?.name ?? p.conceptId
		}));
		const result = await generateLesson(aiCtx, {
			concept,
			durationMin: minutes,
			effort: effort ?? "normal",
			journalist: settings.journalistDepth,
			known,
			weak,
			recent: [],
			adapt: settings.journalistDepth ? "skip-known" : void 0
		}, { hasLocalMatch: Boolean(preview) });
		setBusy(false);
		if (!result.ok) {
			setError(result.error + (result.issues ? ` ${result.issues[0]}` : ""));
			return;
		}
		upsertLesson(result.value);
		logGeneration({
			id: `gen-${Date.now()}`,
			at: (/* @__PURE__ */ new Date()).toISOString(),
			kind: "lesson",
			provider: result.provider,
			model: result.model,
			promptVersion: result.value.source.promptVersion ?? "dau-lesson-v1",
			ok: true,
			lessonId: result.value.id,
			conceptId: concept.id,
			cached: result.cached,
			inputTokens: result.inputTokens,
			outputTokens: result.outputTokens
		});
		toast(result.cached ? "Reused a cached unit." : "Generated a structured unit.");
		go(result.value.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.2em] text-muted uppercase",
				children: "Session"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight sm:text-4xl",
				children: "How long is the gap?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "One unit. No playlist. Options below are optional."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: TIMES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMinutes(t.value),
					className: cn("min-h-16 rounded-lg text-base font-medium transition-[box-shadow,background-color] duration-150", minutes === t.value ? "bg-primary text-primary-fg" : "bg-surface text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)]"),
					children: t.label
				}, t.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg",
					children: "Mode"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2 sm:grid-cols-3",
					children: MODE_OPTS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMode(m.value),
						className: cn("min-h-16 rounded-lg px-3 py-3 text-left transition-[box-shadow] duration-150", mode === m.value ? "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" : "bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium",
							children: m.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted",
							children: m.hint
						})]
					}, m.value))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "group rounded-xl bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "cursor-pointer list-none text-sm font-medium text-fg [&::-webkit-details-marker]:hidden",
						children: ["Narrow the field", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 font-normal text-muted",
							children: [category && category !== "random" ? catalog.categoryMap[category]?.name : "any topic", effort ? ` · ${effort}` : " · any effort"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs tracking-wide text-muted uppercase",
								children: "Topic"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: category === null || category === "random",
									onClick: () => setCategory("random"),
									children: "Any / surprise"
								}), catalog.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: category === c.id,
									onClick: () => setCategory(c.id),
									children: c.name
								}, c.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-xs tracking-wide text-muted uppercase",
								children: "Mental effort"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: EFFORT_OPTS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: effort === e.value,
									onClick: () => setEffort(e.value),
									children: e.label
								}, e.label))
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JournalistToggle, {})
			}),
			preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm leading-relaxed text-muted",
				children: [
					"Ready: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: preview.lesson.title
					}),
					" · ",
					preview.lesson.durationMin,
					" min",
					" · ",
					catalog.conceptMap[preview.lesson.conceptId]?.name,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-subtle",
						children: preview.reason
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-bad",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "lg",
					className: "w-full sm:w-auto",
					onClick: start,
					disabled: busy,
					children: "Start learning"
				}), ai.enabled && ai.policy !== "off" && missing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "lg",
					variant: "secondary",
					onClick: () => void generateMissing(),
					disabled: busy,
					children: busy ? "Generating…" : "Generate a missing unit"
				})]
			})
		]
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-10 rounded-full px-3.5 text-sm transition-colors duration-150", active ? "bg-primary text-primary-fg" : "bg-raised text-muted hover:text-fg"),
		children
	});
}
//#endregion
export { SessionPage as component };
