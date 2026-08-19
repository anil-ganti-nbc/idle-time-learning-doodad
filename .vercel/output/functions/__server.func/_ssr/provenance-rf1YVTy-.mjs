import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as cn } from "./router-BLJIBKSA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/provenance-rf1YVTy-.js
var import_jsx_runtime = require_jsx_runtime();
var LABELS = {
	seed: "Human (seed)",
	human: "Human",
	imported: "Imported",
	ai: "AI-generated"
};
function sourceLabel(type) {
	return LABELS[type];
}
function SourceBadge({ lesson, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase", lesson.source.type === "ai" && "bg-raised text-warn", lesson.source.type === "imported" && "bg-raised text-muted", (lesson.source.type === "human" || lesson.source.type === "seed") && "bg-raised text-ok", className),
		children: LABELS[lesson.source.type]
	});
}
function ProvenanceLine({ lesson }) {
	const s = lesson.source;
	const bits = [
		LABELS[s.type],
		s.provider && s.provider !== "human" ? s.provider : null,
		s.model,
		s.promptVersion,
		s.generatedAt ? new Date(s.generatedAt).toLocaleString() : s.importedAt ? new Date(s.importedAt).toLocaleString() : null,
		s.author && s.author !== "Dead Air University" ? s.author : null
	].filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs leading-relaxed text-subtle",
		children: [bits.join(" · "), s.links && s.links.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", s.links.map((href) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href,
			className: "underline-offset-2 hover:underline",
			target: "_blank",
			rel: "noreferrer",
			children: "source"
		}, href))] })]
	});
}
//#endregion
export { SourceBadge as n, sourceLabel as r, ProvenanceLine as t };
