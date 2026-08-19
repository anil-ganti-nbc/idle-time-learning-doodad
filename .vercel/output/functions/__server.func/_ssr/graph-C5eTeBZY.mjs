import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as cn } from "./router-BLJIBKSA.mjs";
import { l as isDue, m as useProgress, p as useCatalog, r as daysUntil } from "./use-catalog-Be-DbnEV.mjs";
import { t as HydrateGate } from "./hydrate-NroyXG9v.mjs";
import { r as stateLabel, t as conceptState } from "./state-D3pzMau2.mjs";
import { n as nextConcepts } from "./select-AwSLjyBd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/graph-C5eTeBZY.js
var import_jsx_runtime = require_jsx_runtime();
var DOT = {
	unseen: "bg-subtle/50",
	introduced: "bg-muted",
	shaky: "bg-bad",
	understood: "bg-ok",
	due: "bg-warn",
	strong: "bg-primary"
};
function GraphPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphReady, {}) });
}
function GraphReady() {
	const catalog = useCatalog();
	const progress = useProgress((s) => s.concepts);
	const profile = useProgress((s) => s.profile);
	const journalist = useProgress((s) => s.settings.journalistDepth);
	const roots = catalog.concepts.filter((c) => !c.parentId);
	const known = profile.knownConceptIds;
	const next = nextConcepts(catalog, progress, journalist, known).slice(0, 6);
	const weak = catalog.concepts.filter((c) => conceptState(progress[c.id], known.includes(c.id)) === "shaky").slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: "Progression"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight",
				children: "Knowledge graph"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Prerequisites sit above their children. The selector will not open a locked unit until the parent is at least “mostly.”"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 flex flex-wrap gap-3 text-[11px] text-muted",
				children: Object.keys(DOT).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", DOT[s]) }), stateLabel(s)]
				}, s))
			}),
			(next.length > 0 || weak.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: "Logical next"
					}), next.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-subtle",
						children: "Everything unlocked is already opened."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1",
						children: next.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm text-fg",
							children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-subtle",
								children: [" · ", catalog.categoryMap[c.category]?.name]
							})]
						}, c.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: "Weak areas"
					}), weak.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-subtle",
						children: "No shaky concepts yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1",
						children: weak.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-fg",
							children: c.name
						}, c.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 space-y-10",
				children: catalog.categories.map((cat) => {
					const catRoots = roots.filter((c) => c.category === cat.id);
					if (catRoots.length === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl tracking-tight",
							children: cat.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/session",
							search: { category: cat.id },
							className: "text-xs text-muted no-underline hover:text-fg",
							children: "Study"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: catRoots.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
							concept: c,
							progress,
							depth: 0,
							catalogConcepts: catalog.concepts,
							known
						}, c.id))
					})] }, cat.id);
				})
			})
		]
	});
}
function Node({ concept, progress, depth, catalogConcepts, known }) {
	const children = catalogConcepts.filter((c) => c.parentId === concept.id);
	const p = progress[concept.id];
	const locked = concept.prerequisites.some((id) => {
		const parent = progress[id];
		return !(parent?.understanding === "got_it" || parent?.understanding === "mostly" || known.includes(id));
	});
	const state = conceptState(p, known.includes(concept.id));
	const due = isDue(p);
	const until = daysUntil(p?.nextReviewAt ?? null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 rounded-md py-1.5",
		style: { paddingLeft: depth * 16 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("mr-2 inline-block size-1.5 rounded-full align-middle", DOT[state]),
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-sm", locked && !p?.encountered ? "text-subtle" : "text-fg"),
					children: concept.name
				}),
				concept.level === "journalist" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-[10px] tracking-wide text-muted uppercase",
					children: "J"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 font-mono text-[11px] tabular-nums text-subtle",
			children: due ? "due" : p?.understanding ? until !== null && until > 0 ? `${until}d` : stateLabel(state) : locked ? "locked" : stateLabel(state)
		})]
	}), children.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
		concept: c,
		progress,
		depth: depth + 1,
		catalogConcepts,
		known
	}, c.id)) })] });
}
//#endregion
export { GraphPage as component };
