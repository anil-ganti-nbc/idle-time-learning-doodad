import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as cn } from "./router-BLJIBKSA.mjs";
import { m as useProgress } from "./use-catalog-Be-DbnEV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journalist-toggle-u9MkLlyG.js
var import_jsx_runtime = require_jsx_runtime();
function JournalistToggle({ className }) {
	const on = useProgress((s) => s.settings.journalistDepth);
	const set = useProgress((s) => s.setJournalist);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-start justify-between gap-4", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-fg",
				children: "Journalist depth"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-sm leading-snug text-muted",
				children: "Skip introductions you already meet at work. Prefer mechanisms: NA, overlay, stochastics, windows."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			role: "switch",
			"aria-checked": on,
			onClick: () => set(!on),
			className: cn("relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-150", on ? "bg-primary" : "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-0.5 left-0.5 size-6 rounded-full transition-transform duration-150", on ? "translate-x-5 bg-primary-fg" : "translate-x-0 bg-fg/80") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Journalist depth"
			})]
		})]
	});
}
//#endregion
export { JournalistToggle as t };
