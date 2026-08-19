import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as useProgress, p as useCatalog } from "./use-catalog-Be-DbnEV.mjs";
import { t as HydrateGate } from "./hydrate-NroyXG9v.mjs";
import { r as sourceLabel } from "./provenance-rf1YVTy-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-CxBJuXym.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryReady, {}) });
}
function HistoryReady() {
	const catalog = useCatalog();
	const sessions = useProgress((s) => s.sessions);
	const [topic, setTopic] = (0, import_react.useState)("all");
	const [from, setFrom] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const start = from ? new Date(from).getTime() : 0;
		return sessions.filter((s) => {
			if (topic !== "all" && s.categoryId !== topic) return false;
			if (start && new Date(s.completedAt).getTime() < start) return false;
			return true;
		});
	}, [
		sessions,
		topic,
		from
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: "Log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight",
				children: "Session history"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "What you actually did with the gap — not a streak, just a record."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs text-muted",
					children: ["Topic", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "mt-1 block h-11 min-w-40 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
						value: topic,
						onChange: (e) => setTopic(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All"
						}), catalog.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name
						}, c.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs text-muted",
					children: ["From", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value),
						className: "mt-1 block h-11 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
					})]
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-subtle",
				children: "No sessions match."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-2",
				children: filtered.map((s) => {
					const lesson = catalog.lessonMap[s.lessonId];
					const concept = catalog.conceptMap[s.conceptId];
					const cat = catalog.categoryMap[s.categoryId];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm text-fg",
										children: lesson?.title ?? s.lessonId
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted",
										children: [
											new Date(s.completedAt).toLocaleString(),
											" · ",
											cat?.name ?? s.categoryId,
											" ·",
											" ",
											concept?.name
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 font-mono text-[11px] tabular-nums text-subtle",
										children: [
											s.timeBudget,
											"m asked · ",
											s.actualMinutes,
											"m used · quiz ",
											s.quizCorrect,
											"/",
											s.quizTotal ?? 3,
											" · ",
											s.understanding.replace("_", " "),
											" · ",
											s.mode,
											" ·",
											" ",
											sourceLabel(s.sourceType)
										]
									})
								]
							}), lesson && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/learn/$lessonId",
								params: { lessonId: lesson.id },
								className: "shrink-0 text-xs text-muted no-underline hover:text-fg",
								children: "Open"
							})]
						})
					}, s.id);
				})
			})
		]
	});
}
//#endregion
export { HistoryPage as component };
