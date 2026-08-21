import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ArrowRight } from "../_libs/lucide-react.mjs";
import { B as useCatalog, V as useProgress, b as isDue } from "./use-catalog-DsTCgnv9.mjs";
import { t as HydrateGate } from "./hydrate-Ceh-ch8W.mjs";
import { t as Button } from "./button-CKDVl6lX.mjs";
import { t as JournalistToggle } from "./journalist-toggle-BXrAYSm5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DSEwvI_0.js
var import_jsx_runtime = require_jsx_runtime();
function computeMetrics(sessions, concepts, now = /* @__PURE__ */ new Date()) {
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
	const weekAgo = now.getTime() - 6048e5;
	const monthMinutes = sessions.filter((s) => new Date(s.completedAt).getTime() >= monthStart).reduce((sum, s) => sum + s.actualMinutes, 0);
	const conceptsLearned = Object.values(concepts).filter((c) => c.understanding === "got_it" || c.understanding === "mostly").length;
	const recent = sessions.filter((s) => new Date(s.completedAt).getTime() >= weekAgo);
	const retained = recent.filter((s) => s.understanding === "got_it" || s.quizCorrect >= 2);
	return {
		monthMinutes,
		conceptsLearned,
		retention7: recent.length === 0 ? null : Math.round(retained.length / recent.length * 100),
		reviewsDue: Object.values(concepts).filter((c) => isDue(c, now)).length,
		totalSessions: sessions.length
	};
}
function formatDuration(totalMinutes) {
	const minutes = Math.max(0, Math.round(totalMinutes));
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h === 0) return `${m}m`;
	return `${h}h ${m}m`;
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeReady, {}) });
}
function HomeReady() {
	const catalog = useCatalog();
	const sessions = useProgress((s) => s.sessions);
	const concepts = useProgress((s) => s.concepts);
	const profile = useProgress((s) => s.profile);
	const metrics = computeMetrics(sessions, concepts);
	const dueNames = Object.values(concepts).filter((c) => isDue(c)).slice(0, 3).map((c) => catalog.conceptMap[c.conceptId]?.name ?? c.conceptId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.2em] text-muted uppercase",
				children: "Dead air is a curriculum"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl",
				children: profile.displayName ? `${profile.displayName.split(" ")[0]}, I have time to kill.` : "I have time to kill."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-md text-base leading-relaxed text-muted",
				children: "Pick a gap. Get one unit that fits. No streaks, no gems — just a concept, an example, and three questions."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "primary",
				size: "xl",
				className: "mt-8 w-full sm:w-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/session",
					className: "no-underline",
					children: ["I have time to kill", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-5" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Downtime this month",
						value: formatDuration(metrics.monthMinutes)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "New concepts learned",
						value: String(metrics.conceptsLearned)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "7-day retention",
						value: metrics.retention7 === null ? "—" : `${metrics.retention7}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Reviews due",
						value: String(metrics.reviewsDue)
					})
				]
			}),
			metrics.totalSessions === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-subtle",
				children: "No sessions on this device yet. Five minutes is enough to start the graph."
			}),
			dueNames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm text-muted",
				children: [
					"Waiting: ",
					dueNames.join(" · "),
					metrics.reviewsDue > dueNames.length ? "…" : "",
					".",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/reviews",
						className: "text-fg underline-offset-4 hover:underline",
						children: "Open reviews"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JournalistToggle, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						className: "text-muted no-underline hover:text-fg",
						children: "How it works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/settings",
						className: "text-muted no-underline hover:text-fg",
						children: "Back up your university"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/library",
						className: "text-muted no-underline hover:text-fg",
						children: "Browse topics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/graph",
						className: "text-muted no-underline hover:text-fg",
						children: "Knowledge graph"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/history",
						className: "text-muted no-underline hover:text-fg",
						children: "History"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/settings",
						className: "text-muted no-underline hover:text-fg",
						children: "Settings"
					})
				]
			})
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-mono text-2xl tabular-nums tracking-tight text-fg",
			children: value
		})]
	});
}
//#endregion
export { Home as component };
