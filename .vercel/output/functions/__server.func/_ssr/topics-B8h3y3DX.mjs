import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as cn } from "./router-Bg908uEK.mjs";
import { B as useCatalog, D as makeId, V as useProgress } from "./use-catalog-DsTCgnv9.mjs";
import { t as HydrateGate } from "./hydrate-Ceh-ch8W.mjs";
import { t as Button } from "./button-DbK4zipU.mjs";
import { a as toGenerationLog, n as generateLesson, o as useAiContext, r as generatePath } from "./use-ai-DoYZPk77.mjs";
import { t as Input } from "./input-CRYzMUF8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/topics-B8h3y3DX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full rounded-md bg-raised px-3 py-2 text-sm leading-relaxed text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] placeholder:text-subtle focus-visible:shadow-[0_0_0_1px_rgba(200,204,212,0.5)]", className),
		...props
	});
}
function TopicsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopicsReady, {}) });
}
function TopicsReady() {
	const catalog = useCatalog();
	const customCategories = useProgress((s) => s.customCategories);
	const upsertCategory = useProgress((s) => s.upsertCategory);
	const upsertConcept = useProgress((s) => s.upsertConcept);
	const upsertLesson = useProgress((s) => s.upsertLesson);
	const removeCategory = useProgress((s) => s.removeCategory);
	const pending = useProgress((s) => s.pendingPath);
	const setPending = useProgress((s) => s.setPendingPath);
	const approvePath = useProgress((s) => s.approvePath);
	const logGeneration = useProgress((s) => s.logGeneration);
	const profile = useProgress((s) => s.profile);
	const ai = useProgress((s) => s.ai);
	const aiCtx = useAiContext(0);
	const [name, setName] = (0, import_react.useState)("");
	const [blurb, setBlurb] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [conceptName, setConceptName] = (0, import_react.useState)("");
	const [conceptCat, setConceptCat] = (0, import_react.useState)(customCategories[0]?.id ?? "");
	function addTopic() {
		if (!name.trim()) return;
		const id = makeId("topic", name);
		upsertCategory({
			id,
			name: name.trim(),
			blurb: blurb.trim() || "Custom field.",
			custom: true
		});
		setConceptCat(id);
		setName("");
		setBlurb("");
	}
	function addConcept() {
		if (!conceptName.trim() || !conceptCat) return;
		upsertConcept({
			id: makeId("c", conceptName),
			name: conceptName.trim(),
			category: conceptCat,
			prerequisites: [],
			level: "intro",
			summary: conceptName.trim(),
			custom: true,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setConceptName("");
	}
	async function proposePath() {
		if (!subject.trim()) return;
		setBusy(true);
		const result = await generatePath(aiCtx, subject.trim(), profile.customInterests);
		setBusy(false);
		logGeneration(toGenerationLog("path", result));
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		setPending(result.value);
	}
	async function fromSource() {
		if (!source.trim() || !conceptCat) {
			toast.error("Pick a topic and paste source text.");
			return;
		}
		const concept = catalog.concepts.find((c) => c.category === conceptCat) ?? {
			id: makeId("c", "source"),
			name: name || "Sourced concept",
			category: conceptCat,
			prerequisites: [],
			level: "core",
			summary: "Generated from supplied notes.",
			custom: true
		};
		if (!catalog.conceptMap[concept.id]) upsertConcept(concept);
		setBusy(true);
		const result = await generateLesson(aiCtx, {
			concept,
			durationMin: 10,
			effort: "normal",
			journalist: false,
			known: [],
			weak: [],
			recent: [],
			sourceText: source
		});
		setBusy(false);
		logGeneration(toGenerationLog("source", result, {
			lessonId: result.ok ? result.value.id : void 0,
			conceptId: concept.id
		}));
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		upsertLesson({
			...result.value,
			source: {
				...result.value.source,
				sourceExcerpt: source.slice(0, 400)
			}
		});
		toast("Grounded lesson saved.");
		setSource("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: "Your catalog"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight",
				children: "Custom topics"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Same model as the seeded fields: a topic, concepts with prerequisites, then lessons. AI may propose a path — it does not become real until you approve it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "New field"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Byzantine history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: blurb,
						onChange: (e) => setBlurb(e.target.value),
						placeholder: "Short blurb"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: addTopic,
						children: "Add topic"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Add a concept"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
						value: conceptCat,
						onChange: (e) => setConceptCat(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Choose a topic"
						}), customCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name
						}, c.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: conceptName,
						onChange: (e) => setConceptName(e.target.value),
						placeholder: "Theme parks of Constantinople"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: addConcept,
						children: "Add concept"
					})
				]
			}),
			customCategories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-2",
				children: customCategories.map((c) => {
					const concepts = catalog.concepts.filter((x) => x.category === c.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-fg",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: concepts.map((x) => x.name).join(" · ") || "No concepts yet"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-bad",
								onClick: () => removeCategory(c.id),
								children: "Remove"
							})]
						})
					}, c.id);
				})
			}),
			ai.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Build a learning path"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "e.g. “Teach me compiler design”"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							placeholder: "Teach me jazz harmony"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => void proposePath(),
							disabled: busy,
							children: busy ? "Proposing…" : "Propose path"
						})
					]
				}),
				pending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-warn uppercase",
							children: "Needs your approval"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-display text-2xl",
							children: pending.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: pending.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-4 list-decimal space-y-1 pl-5 text-sm",
							children: pending.sequence.map((id) => {
								const c = pending.concepts.find((x) => x.id === id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c?.name ?? id }, id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => approvePath(pending),
								children: "Approve into catalog"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								onClick: () => setPending(null),
								children: "Discard"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Lesson from source"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Paste notes or Markdown. The unit stays grounded in that text."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: source,
							onChange: (e) => setSource(e.target.value),
							placeholder: "Paste article text or notes…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => void fromSource(),
							disabled: busy,
							children: "Generate from source"
						})
					]
				})
			] })
		]
	});
}
//#endregion
export { TopicsPage as component };
