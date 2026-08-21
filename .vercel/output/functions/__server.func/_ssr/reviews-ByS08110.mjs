import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as useCatalog, T as lessonsForConceptFrom, V as useProgress, b as isDue, u as daysUntil } from "./use-catalog-DsTCgnv9.mjs";
import { t as HydrateGate } from "./hydrate-Ceh-ch8W.mjs";
import { t as Button } from "./button-CKDVl6lX.mjs";
import { s as startLive } from "./live-DpxOBqbB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-ByS08110.js
var import_jsx_runtime = require_jsx_runtime();
function ReviewsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsReady, {}) });
}
function ReviewsReady() {
	const navigate = useNavigate();
	const catalog = useCatalog();
	const concepts = useProgress((s) => s.concepts);
	const due = Object.values(concepts).filter((c) => isDue(c) || (daysUntil(c.nextReviewAt) ?? 99) <= 0).sort((a, b) => (a.nextReviewAt ?? "").localeCompare(b.nextReviewAt ?? ""));
	const upcoming = Object.values(concepts).filter((c) => c.nextReviewAt && !due.includes(c)).sort((a, b) => (a.nextReviewAt ?? "").localeCompare(b.nextReviewAt ?? "")).slice(0, 8);
	function open(conceptId) {
		const lesson = lessonsForConceptFrom(catalog, conceptId)[0];
		if (!lesson) return;
		startLive({
			lessonId: lesson.id,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			mode: "reinforce",
			timeBudget: lesson.durationMin
		});
		navigate({
			to: "/learn/$lessonId",
			params: { lessonId: lesson.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: "Spaced review"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight",
				children: "Reviews"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Due items first. Intervals come from rating, quiz, encounters, and recent review history — not a streak clock."
			}),
			due.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-subtle",
				children: "Nothing is due. The next review will appear here."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-2",
				children: due.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					name: catalog.conceptMap[c.conceptId]?.name ?? c.conceptId,
					topic: catalog.categoryMap[catalog.conceptMap[c.conceptId]?.category ?? ""]?.name ?? "",
					meta: "Due now",
					onOpen: () => open(c.conceptId)
				}, c.conceptId))
			}),
			upcoming.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 text-sm font-medium",
				children: "Upcoming"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: upcoming.map((c) => {
					const d = daysUntil(c.nextReviewAt);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						name: catalog.conceptMap[c.conceptId]?.name ?? c.conceptId,
						topic: catalog.categoryMap[catalog.conceptMap[c.conceptId]?.category ?? ""]?.name ?? "",
						meta: d === null ? "" : d <= 0 ? "today" : `${d}d`,
						onOpen: () => open(c.conceptId)
					}, c.conceptId);
				})
			})] })
		]
	});
}
function Row({ name, topic, meta, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center justify-between gap-3 rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-sm text-fg",
				children: name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					topic,
					" · ",
					meta
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			size: "sm",
			variant: "secondary",
			onClick: onOpen,
			children: "Review"
		})]
	});
}
//#endregion
export { ReviewsPage as component };
