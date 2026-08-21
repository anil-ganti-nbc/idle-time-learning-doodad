import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route$4, s as cn } from "./router-DocPpzdv.mjs";
import { B as useCatalog, O as makeReadinessContext, S as isRetiredBuiltInStudyTarget, V as useProgress, d as frontierConcepts, g as inferTier, v as isConceptUnlocked, y as isDemonstrated } from "./use-catalog-DsTCgnv9.mjs";
import { t as HydrateGate } from "./hydrate-Ceh-ch8W.mjs";
import { n as stateLabel, t as conceptState } from "./state-ZIUkIptt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/course._courseId-CkSh92Lv.js
var import_jsx_runtime = require_jsx_runtime();
function CoursePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseReady, {}) });
}
function CourseReady() {
	const { courseId } = Route$4.useParams();
	const catalog = useCatalog();
	const course = catalog.courseMap[courseId];
	const progress = useProgress((s) => s.concepts);
	const profile = useProgress((s) => s.profile);
	const courseRows = useProgress((s) => s.courses);
	const readiness = makeReadinessContext(catalog, progress, profile, courseRows);
	if (!course) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Course not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/graph",
			className: "mt-4 inline-block text-sm text-muted hover:text-fg",
			children: "Back to the graph"
		})]
	});
	const next = frontierConcepts(course, readiness)[0];
	const categoryName = catalog.categoryMap[course.categoryId]?.name ?? course.categoryId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: categoryName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight",
				children: course.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: course.description
			}),
			next && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 text-sm text-muted",
				children: ["Open now: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: next.name
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-4 text-sm",
				children: [isRetiredBuiltInStudyTarget(catalog, course.categoryId) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-subtle",
					children: "Archived field — readable, not opened as a new session"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/session",
					search: { category: course.categoryId },
					className: "text-fg no-underline hover:underline",
					children: "Study this course"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/graph",
					className: "text-muted no-underline hover:text-fg",
					children: "Full graph"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-10 space-y-8",
				children: course.modules.slice().sort((a, b) => a.order - b.order).map((mod, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tabular-nums text-subtle",
						children: String(index + 1).padStart(2, "0")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-xl tracking-tight",
						children: mod.title
					}),
					mod.blurb && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: mod.blurb
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1",
						children: mod.conceptIds.map((id) => {
							const concept = catalog.conceptMap[id];
							if (!concept) return null;
							const unlocked = isConceptUnlocked(concept, readiness);
							const held = isDemonstrated(concept.id, readiness, inferTier(concept));
							const state = conceptState(progress[id], profile.knownConceptIds.includes(id));
							const isNext = next?.id === id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("flex items-baseline justify-between gap-3 rounded-md px-3 py-2", isNext && "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("text-sm", unlocked || held ? "text-fg" : "text-subtle"),
									children: concept.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 font-mono text-[11px] tabular-nums text-subtle",
									children: held ? "held" : isNext ? "next" : unlocked ? stateLabel(state) : "locked"
								})]
							}, id);
						})
					})
				] }, mod.id))
			}),
			course.sourceReferences.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 border-t border-border/70 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.16em] text-muted uppercase",
					children: "What informed this order"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-3",
					children: course.sourceReferences.map((ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm",
						children: [ref.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: ref.url,
							className: "text-fg underline-offset-4 hover:underline",
							target: "_blank",
							rel: "noreferrer",
							children: ref.title
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: ref.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-xs leading-relaxed text-muted",
							children: ref.notes
						})]
					}, ref.title))
				})]
			})
		]
	});
}
//#endregion
export { CoursePage as component };
