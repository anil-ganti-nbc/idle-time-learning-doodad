import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as useProgress, p as useCatalog } from "./use-catalog-Be-DbnEV.mjs";
import { t as HydrateGate } from "./hydrate-NroyXG9v.mjs";
import { t as conceptState } from "./state-D3pzMau2.mjs";
import { n as SourceBadge } from "./provenance-rf1YVTy-.mjs";
import { o as startLive } from "./live-Cdzq3AeC.mjs";
import { t as Input } from "./input-BdzwBPhw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-DaAwLllH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibraryPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryReady, {}) });
}
function LibraryReady() {
	const catalog = useCatalog();
	const progress = useProgress((s) => s.concepts);
	const lastMode = useProgress((s) => s.settings.lastMode);
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("all");
	const lessons = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return catalog.lessons.filter((l) => {
			if (source !== "all") {
				if (source === "human" && l.source.type !== "human" && l.source.type !== "seed") return false;
				if (source !== "human" && l.source.type !== source) return false;
			}
			if (!needle) return true;
			const concept = catalog.conceptMap[l.conceptId];
			const cat = concept ? catalog.categoryMap[concept.category]?.name : "";
			return [
				l.title,
				concept?.name,
				cat,
				l.conceptId
			].some((s) => s?.toLowerCase().includes(needle));
		});
	}, [
		catalog,
		q,
		source
	]);
	function open(id, minutes) {
		startLive({
			lessonId: id,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			mode: lastMode,
			timeBudget: minutes
		});
		navigate({
			to: "/learn/$lessonId",
			params: { lessonId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: "Catalog"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight",
				children: "Library"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					catalog.lessons.length,
					" units across ",
					catalog.categories.length,
					" fields. Search or open a unit directly — the router is still the fastest path."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/topics",
						className: "text-sm text-muted no-underline hover:text-fg",
						children: "Custom topics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/session",
						className: "text-sm text-muted no-underline hover:text-fg",
						children: "Time router"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search lessons or concepts",
					"aria-label": "Search lessons"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						"all",
						"seed",
						"human",
						"imported",
						"ai"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSource(s),
						className: source === s ? "rounded-full bg-primary px-3 py-1.5 text-xs text-primary-fg" : "rounded-full bg-raised px-3 py-1.5 text-xs text-muted",
						children: s === "seed" ? "seeded" : s
					}, s))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-2",
				children: catalog.categories.map((cat) => {
					const concepts = catalog.concepts.filter((c) => c.category === cat.id);
					const units = lessons.filter((l) => concepts.some((c) => c.id === l.conceptId));
					if (units.length === 0 && q) return null;
					const seen = concepts.filter((c) => progress[c.id]?.encountered).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-lg bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 [&::-webkit-details-marker]:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-fg",
								children: [cat.name, cat.custom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-[10px] tracking-wide text-muted uppercase",
									children: "yours"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: cat.blurb
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "shrink-0 font-mono text-xs tabular-nums text-subtle",
								children: [
									seen,
									"/",
									concepts.length,
									" · ",
									units.length,
									"u"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "border-t border-border/60 px-2 py-2",
							children: units.map((l) => {
								const concept = catalog.conceptMap[l.conceptId];
								const state = conceptState(progress[l.conceptId]);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => open(l.id, l.durationMin),
									className: "flex w-full items-start justify-between gap-3 rounded-md px-2 py-2.5 text-left hover:bg-raised",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm text-fg",
											children: l.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-xs text-muted",
											children: [
												concept?.name,
												" · ",
												l.durationMin,
												"m · ",
												l.effort,
												" · ",
												state,
												concept?.prerequisites.length ? ` · assumes ${concept.prerequisites.map((id) => catalog.conceptMap[id]?.name ?? id).join(", ")}` : ""
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { lesson: l })]
								}) }, l.id);
							})
						})] })
					}, cat.id);
				})
			})
		]
	});
}
//#endregion
export { LibraryPage as component };
