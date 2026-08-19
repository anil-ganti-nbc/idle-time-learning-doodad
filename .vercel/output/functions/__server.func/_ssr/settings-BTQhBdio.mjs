import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as generationsToday, m as useProgress, n as buildExport, p as useCatalog } from "./use-catalog-Be-DbnEV.mjs";
import { t as HydrateGate } from "./hydrate-NroyXG9v.mjs";
import { t as Button } from "./button-WNIv-gfX.mjs";
import { t as PROVIDER_META } from "./providers-DJN-C4ZR.mjs";
import { i as saveSecrets, n as loadSecrets, t as getAiStatus } from "./secrets-BUFL4Lsv.mjs";
import { t as Input } from "./input-BdzwBPhw.mjs";
import { t as JournalistToggle } from "./journalist-toggle-u9MkLlyG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BTQhBdio.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsReady, {}) });
}
function SettingsReady() {
	const catalog = useCatalog();
	const state = useProgress();
	const fileRef = (0, import_react.useRef)(null);
	const [note, setNote] = (0, import_react.useState)(null);
	const [includeKeys, setIncludeKeys] = (0, import_react.useState)(false);
	const [mode, setMode] = (0, import_react.useState)("merge");
	const [secrets, setSecrets] = (0, import_react.useState)({});
	const [xaiEnv, setXaiEnv] = (0, import_react.useState)(false);
	const [interest, setInterest] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setSecrets(loadSecrets());
		getAiStatus().then((s) => setXaiEnv(s.xaiEnv));
	}, []);
	function persistSecrets(next) {
		setSecrets(next);
		saveSecrets(next);
	}
	function exportJson() {
		const bundle = buildExport(snapshot(), includeKeys ? secrets : void 0, includeKeys);
		const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `dead-air-university-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
		setNote("Exported a versioned JSON archive.");
	}
	function snapshot() {
		const s = useProgress.getState();
		return {
			profile: s.profile,
			settings: s.settings,
			ai: s.ai,
			concepts: s.concepts,
			sessions: s.sessions,
			recentCategoryIds: s.recentCategoryIds,
			customCategories: s.customCategories,
			customConcepts: s.customConcepts,
			customLessons: s.customLessons,
			generationLog: s.generationLog,
			pendingPath: s.pendingPath
		};
	}
	function onFile(file) {
		file.text().then((text) => {
			try {
				const parsed = JSON.parse(text);
				const result = state.importBundle(parsed, mode);
				if (includeKeys && parsed && typeof parsed === "object" && "secrets" in parsed) persistSecrets({
					...secrets,
					...parsed.secrets ?? {}
				});
				setNote(`Imported (${mode}). Backup taken at ${new Date(result.backupAt).toLocaleString()}. ${result.warnings[0] ?? ""}`.trim());
				if (result.warnings.length) toast(result.warnings[0]);
				else toast("Import complete.");
			} catch (err) {
				setNote(err instanceof Error ? err.message : "That file was not a progress export.");
			}
		});
	}
	const used = generationsToday(state.generationLog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: "Local"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight",
				children: "Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Optional profile and AI. Nothing here is required before a session. Progress stays on this device unless you export it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl tracking-tight",
						children: "Local profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["Display name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: state.profile.displayName,
							onChange: (e) => state.updateProfile({ displayName: e.target.value }),
							placeholder: "Optional"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-xs text-muted",
						children: "Preferred topics"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: catalog.categories.map((c) => {
							const on = state.profile.preferredTopics.includes(c.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => state.updateProfile({ preferredTopics: on ? state.profile.preferredTopics.filter((id) => id !== c.id) : [...state.profile.preferredTopics, c.id] }),
								className: on ? "rounded-full bg-primary px-3 py-1.5 text-xs text-primary-fg" : "rounded-full bg-raised px-3 py-1.5 text-xs text-muted",
								children: c.name
							}, c.id);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-xs text-muted",
						children: "Topics to avoid"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: catalog.categories.map((c) => {
							const on = state.profile.avoidTopics.includes(c.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => state.updateProfile({ avoidTopics: on ? state.profile.avoidTopics.filter((id) => id !== c.id) : [...state.profile.avoidTopics, c.id] }),
								className: on ? "rounded-full bg-bad/20 px-3 py-1.5 text-xs text-bad" : "rounded-full bg-raised px-3 py-1.5 text-xs text-muted",
								children: c.name
							}, c.id);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["Known concepts (comma-separated ids)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono",
							value: state.profile.knownConceptIds.join(", "),
							onChange: (e) => state.updateProfile({ knownConceptIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }),
							placeholder: "cpu-pipeline, cmp-front"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Preferred duration", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 block h-11 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
								value: state.settings.preferredDuration,
								onChange: (e) => state.updateSettings({ preferredDuration: Number(e.target.value) }),
								children: [
									5,
									10,
									20,
									30
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: n,
									children: [n === 30 ? "30+" : n, " min"]
								}, n))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Preferred intensity", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "mt-1 block h-11 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
								value: state.settings.preferredEffort ?? "",
								onChange: (e) => state.updateSettings({ preferredEffort: e.target.value || null }),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Any"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "light",
										children: "Light"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "normal",
										children: "Normal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "deep",
										children: "Deep"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: interest,
							onChange: (e) => setInterest(e.target.value),
							placeholder: "Custom interest, e.g. Indian economic history"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => {
								const v = interest.trim();
								if (!v) return;
								state.updateProfile({ customInterests: [...state.profile.customInterests, v] });
								setInterest("");
							},
							children: "Add"
						})]
					}),
					state.profile.customInterests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: state.profile.customInterests.join(" · ")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JournalistToggle, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl tracking-tight",
						children: "AI layer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Optional. Off by default. Generates structured lessons behind the same flow — never a chat window. xAI is wired if this environment has a key; other providers need a local key."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between gap-3 text-sm",
						children: ["Enable AI", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: state.ai.enabled,
							onChange: (e) => state.updateAi({ enabled: e.target.checked })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["Provider", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-1 block h-11 w-full rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
							value: state.ai.provider,
							onChange: (e) => {
								const provider = e.target.value;
								state.updateAi({
									provider,
									model: PROVIDER_META[provider].defaultModel
								});
							},
							children: Object.keys(PROVIDER_META).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: id,
								children: [PROVIDER_META[id].label, PROVIDER_META[id].wired ? " — wired" : " — key required"]
							}, id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["Model", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono",
							value: state.ai.model,
							onChange: (e) => state.updateAi({ model: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["When to generate", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "mt-1 block h-11 w-full rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
							value: state.ai.policy,
							onChange: (e) => state.updateAi({ policy: e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "off",
									children: "Never (keep the toggle but refuse calls)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "manual",
									children: "Manual only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "missing-only",
									children: "Only when no local unit fits"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Max / day", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								type: "number",
								min: 0,
								value: state.ai.maxPerDay,
								onChange: (e) => state.updateAi({ maxPerDay: Number(e.target.value) || 0 })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Max / gap", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								type: "number",
								min: 0,
								value: state.ai.maxPerSession,
								onChange: (e) => state.updateAi({ maxPerSession: Number(e.target.value) || 0 })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [
							"Used today: ",
							used,
							"/",
							state.ai.maxPerDay,
							xaiEnv ? " · environment xAI key present" : " · no environment xAI key"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: [state.ai.provider === "local" ? "Local base URL" : `${PROVIDER_META[state.ai.provider].label} API key`, state.ai.provider === "local" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono",
							value: secrets.localBaseUrl ?? "",
							onChange: (e) => persistSecrets({
								...secrets,
								localBaseUrl: e.target.value
							}),
							placeholder: "http://127.0.0.1:11434/v1"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono",
							type: "password",
							autoComplete: "off",
							value: secretFor(state.ai.provider, secrets),
							onChange: (e) => persistSecrets({
								...secrets,
								...secretPatch(state.ai.provider, e.target.value)
							}),
							placeholder: state.ai.provider === "xai" && xaiEnv ? "Optional override of env key" : "Stored only on this device"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl tracking-tight",
						children: "Export / import"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Versioned JSON. Import makes a backup first and will not silently overwrite newer local progress."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: includeKeys,
							onChange: (e) => setIncludeKeys(e.target.checked)
						}), "Include API keys in the file"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-muted",
						children: ["Replace everything on import", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: mode === "replace",
							onChange: (e) => setMode(e.target.checked ? "replace" : "merge")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								onClick: exportJson,
								children: "Export archive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								onClick: () => fileRef.current?.click(),
								children: "Import"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "application/json",
								className: "hidden",
								onChange: (e) => {
									const f = e.target.files?.[0];
									if (f) onFile(f);
								}
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/topics",
					className: "text-sm text-muted no-underline hover:text-fg",
					children: "Custom topics and learning paths"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				className: "mt-8 text-bad",
				onClick: () => {
					if (confirm("Erase all local progress on this device?")) {
						state.resetAll();
						setNote("Progress cleared.");
					}
				},
				children: "Reset all progress"
			}),
			note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: note
			})
		]
	});
}
function secretFor(provider, secrets) {
	if (provider === "xai") return secrets.xai ?? "";
	if (provider === "openai") return secrets.openai ?? "";
	if (provider === "anthropic") return secrets.anthropic ?? "";
	if (provider === "gemini") return secrets.gemini ?? "";
	return secrets.localApiKey ?? "";
}
function secretPatch(provider, value) {
	if (provider === "xai") return { xai: value };
	if (provider === "openai") return { openai: value };
	if (provider === "anthropic") return { anthropic: value };
	if (provider === "gemini") return { gemini: value };
	return { localApiKey: value };
}
//#endregion
export { SettingsPage as component };
