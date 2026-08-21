import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./router-DocPpzdv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-NocV-6jE.js
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		title: "Pick a time gap",
		body: "Five, ten, twenty, or thirty minutes. DAU chooses one bounded unit that fits."
	},
	{
		title: "Read, then three questions",
		body: "A concept, an example, and a short quiz. Then you say how well it sat so the review schedule can move."
	},
	{
		title: "Progress stays on this device",
		body: "The graph, reviews, and history live in this browser. A hosted URL is not an account and does not sync."
	},
	{
		title: "No streaks, XP, or nagging",
		body: "There are no gems, leaderboards, or daily-login tricks. A missed day is just a missed day."
	},
	{
		title: "Export when you want a copy",
		body: "A versioned JSON archive is how you move or back up. Merge will not silently overwrite newer local work."
	},
	{
		title: "AI is optional",
		body: "The seeded university is complete. Generation is an off-by-default extra, not a requirement for study."
	}
];
function HowItWorks({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: cn("space-y-5", className),
		children: STEPS.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 w-5 shrink-0 font-mono text-xs tabular-nums text-subtle",
				children: i + 1
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-fg",
					children: step.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-muted",
					children: step.body
				})]
			})]
		}, step.title))
	});
}
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: "About"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight",
				children: "How Dead Air University works"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "A university for gaps. Local-first. No account required."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, { className: "mt-8" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/session",
						className: "text-fg no-underline hover:underline",
						children: "Start a gap"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/settings",
						className: "text-muted no-underline hover:text-fg",
						children: "Back up your university"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-muted no-underline hover:text-fg",
						children: "Desk"
					})
				]
			})
		]
	});
}
//#endregion
export { AboutPage as component };
