import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as inspectStorage, l as survives } from "./storage-CceMV1qh.mjs";
import { B as useCatalog, E as loadRollback, V as useProgress, a as buildExport, i as assertImportSize, z as secretExportGuard } from "./use-catalog-DsTCgnv9.mjs";
import { t as HydrateGate } from "./hydrate-Ceh-ch8W.mjs";
import { a as secretPatch, i as secretFor, r as saveSecrets, t as loadSecrets } from "./secrets-Bp-pUZg8.mjs";
import { i as sanitizeLocalBaseUrl, t as PROVIDER_META } from "./providers-BwL6YD0o.mjs";
import { t as Button } from "./button-CKDVl6lX.mjs";
import { n as getAiStatus, t as generationsToday } from "./server-CBQ7aw1e.mjs";
import { t as Input } from "./input-CpHRt--m.mjs";
import { t as JournalistToggle } from "./journalist-toggle-BXrAYSm5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BVv1T6Ov.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ALLOWED_SOURCES = /* @__PURE__ */ new Set([
	"env",
	"file",
	"none"
]);
function sanitizeSource(value) {
	if (value && ALLOWED_SOURCES.has(value)) return value;
	return "unknown";
}
function buildClientDiagnostics(input) {
	const storage = inspectStorage();
	const serverProvider = sanitizeSource(input.serverSources?.[input.aiProvider]);
	const notes = [];
	if (!storage.available) notes.push("Browser storage is blocked. Progress will not survive a reload on this profile.");
	if (storage.session !== "sessionStorage") notes.push("An unfinished lesson cannot be restored after a tab crash.");
	notes.push("A hosted URL is not cross-device sync. Export an archive to move progress.");
	if (input.aiEnabled && serverProvider === "none") notes.push("No server-side provider key. Generation needs a browser fallback key or stays off.");
	return {
		runtime: typeof window === "undefined" ? "ssr" : "browser",
		appRelease: "1.0",
		curriculumVersion: 1,
		persistVersion: 5,
		exportSchemaVersion: 2,
		storage,
		storageMode: `${storage.local} / ${storage.session}`,
		curriculum: {
			subjects: input.subjects,
			courses: input.courses,
			concepts: input.concepts,
			lessons: input.lessons
		},
		aiEnabled: input.aiEnabled,
		aiProvider: input.aiProvider,
		serverProvider,
		notes
	};
}
var SECRET_EXPORT_WARNING = "The file will contain API keys in plaintext. Anyone with the file can spend those keys. Export anyway?";
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
	const [keySources, setKeySources] = (0, import_react.useState)({});
	const [interest, setInterest] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setSecrets(loadSecrets());
		getAiStatus().then((s) => {
			setXaiEnv(s.xaiEnv);
			setKeySources(s.sources ?? {});
		});
	}, []);
	function persistSecrets(next) {
		setSecrets(next);
		saveSecrets(next);
	}
	function downloadBundle(bundle, filename) {
		const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}
	function exportJson() {
		if (includeKeys) {
			const gate = secretExportGuard(true, confirm(SECRET_EXPORT_WARNING));
			if (!gate.ok) {
				setNote(gate.error);
				return;
			}
		}
		downloadBundle(buildExport(snapshot(), includeKeys ? secrets : void 0, includeKeys), includeKeys ? `dead-air-university-WITH-SECRETS-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json` : `dead-air-university-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`);
		setNote(includeKeys ? "Exported an archive that includes plaintext API keys." : "Exported a versioned JSON archive.");
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
			pendingPath: s.pendingPath,
			courses: s.courses,
			customCourses: s.customCourses,
			assessmentHistory: s.assessmentHistory
		};
	}
	function onFile(file) {
		const size = assertImportSize(file.size);
		if (!size.ok) {
			setNote(size.error);
			return;
		}
		file.text().then((text) => {
			try {
				const parsed = JSON.parse(text);
				if (mode === "replace") downloadBundle(buildExport(snapshot()), `dead-air-university-rollback-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`);
				const result = state.importBundle(parsed, mode);
				if (includeKeys && parsed && typeof parsed === "object" && "secrets" in parsed) persistSecrets({
					...secrets,
					...parsed.secrets ?? {}
				});
				setNote(mode === "replace" ? `Replaced local state. A rollback file was downloaded and a restore snapshot was saved. ${result.warnings[0] ?? ""}`.trim() : `Imported (merge). ${result.warnings[0] ?? ""}`.trim());
				if (result.warnings.length) toast(result.warnings[0]);
				else toast(mode === "replace" ? "Replace complete. Rollback saved." : "Import complete.");
			} catch (err) {
				setNote(err instanceof Error ? err.message : "That file was not a progress export.");
			}
		});
	}
	function restoreRollback() {
		const snap = loadRollback();
		if (!snap) {
			setNote("No replace-import snapshot on this device.");
			return;
		}
		try {
			const result = state.importBundle(snap, "replace");
			setNote(`Restored the pre-replace snapshot from ${new Date(result.backupAt).toLocaleString()}.`);
			toast("Restored previous state.");
		} catch (err) {
			setNote(err instanceof Error ? err.message : "Could not restore the snapshot.");
		}
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
				children: "Optional profile and AI. Nothing here is required before a session. Progress stays in this browser. A hosted URL is not an account and does not sync across devices — export an archive to move. The server never holds your graph."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 space-y-3 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl tracking-tight",
						children: "Back up your university"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Versioned JSON. This is the official way to move progress between browsers and devices. A replace import downloads your current archive first and keeps a restore snapshot on this device. Merge will not silently overwrite newer local progress. Archives larger than 8 MB are rejected."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-1",
							checked: includeKeys,
							onChange: (e) => {
								if (!e.target.checked) {
									setIncludeKeys(false);
									return;
								}
								const allowed = confirm(SECRET_EXPORT_WARNING);
								setIncludeKeys(allowed);
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Include API keys in the file", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-bad",
							children: "Off by default. The JSON will contain plaintext credentials if you confirm twice."
						})] })]
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
								onClick: exportJson,
								children: "Export learning data"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								onClick: () => fileRef.current?.click(),
								children: "Import"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: restoreRollback,
								children: "Restore last replace"
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 space-y-4",
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
							" · ",
							describeKeySource(state.ai.provider, keySources[state.ai.provider], xaiEnv)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: [state.ai.provider === "local" ? "Browser fallback — local base URL" : `Browser fallback key for ${PROVIDER_META[state.ai.provider].label}`, state.ai.provider === "local" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono",
							value: secrets.localBaseUrl ?? "",
							onChange: (e) => persistSecrets({
								...secrets,
								localBaseUrl: e.target.value
							}),
							placeholder: "http://127.0.0.1:11434/v1"
						}), (() => {
							const check = sanitizeLocalBaseUrl(secrets.localBaseUrl, "user");
							return !check.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-bad",
								children: check.error
							}) : null;
						})()] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono",
							type: "password",
							autoComplete: "off",
							value: secretFor(state.ai.provider, secrets),
							onChange: (e) => persistSecrets({
								...secrets,
								...secretPatch(state.ai.provider, e.target.value)
							}),
							placeholder: keySources[state.ai.provider] === "env" || keySources[state.ai.provider] === "file" ? "Ignored while an environment or server-file key is present" : "Plaintext on this device only — last resort"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs leading-relaxed text-subtle",
						children: [
							"Key lookup order: environment variable, then a local ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: ".dau-secrets.json"
							}),
							" ",
							"next to the app (local server only — not durable on typical serverless hosts), then this browser field. Environment and file keys never leave the server. This field is a labelled convenience fallback, not a vault."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl tracking-tight",
						children: "Where this lives"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Progress, the knowledge graph, reviews, and custom lessons are stored in this browser. Refresh and restart keep them. Opening the same hosted URL in another browser, profile, or device starts a separate local graph unless you import an archive. An unfinished lesson lives only in this tab."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-1.5 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersistLine, { event: "refresh" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersistLine, { event: "browserRestart" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersistLine, { event: "serverRestart" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersistLine, { event: "deviceChange" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						className: "text-muted no-underline hover:text-fg",
						children: "How it works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/topics",
						className: "text-muted no-underline hover:text-fg",
						children: "Custom topics and learning paths"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-subtle no-underline hover:text-muted",
						children: "Optional identity"
					})
				]
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnosticsPanel, {
				subjects: catalog.categories.length,
				courses: catalog.courses.length,
				concepts: catalog.concepts.length,
				lessons: catalog.lessons.length,
				aiEnabled: state.ai.enabled,
				aiProvider: state.ai.provider,
				serverSources: keySources
			})
		]
	});
}
function DiagnosticsPanel(props) {
	const report = buildClientDiagnostics(props);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mt-10 rounded-xl bg-surface p-4 text-sm shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
				className: "cursor-pointer text-muted",
				children: "Diagnostics"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Release" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-fg",
						children: report.appRelease
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Curriculum" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "text-fg",
						children: ["v", report.curriculumVersion]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Retained courses" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-fg",
						children: report.curriculum.courses
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Catalog" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "text-fg",
						children: [
							report.curriculum.concepts,
							" concepts · ",
							report.curriculum.lessons,
							" lessons"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Learning store" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "text-fg",
						children: ["v", report.persistVersion]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Export schema" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "text-fg",
						children: ["v", report.exportSchemaVersion]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Storage" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "break-words text-fg",
						children: report.storageMode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Runtime" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-fg",
						children: report.runtime
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "AI" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "text-fg",
						children: [
							report.aiEnabled ? "on" : "off",
							" / ",
							report.aiProvider,
							" / server ",
							report.serverProvider
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1 text-xs text-subtle",
				children: report.notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note }, note))
			})
		]
	});
}
function PersistLine({ event }) {
	const row = survives(event);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-fg",
			children: [event === "refresh" ? "Browser refresh" : event === "browserRestart" ? "Browser restart" : event === "serverRestart" ? "App / server restart" : "Another device", "."]
		}),
		" ",
		row.note
	] });
}
function describeKeySource(provider, source, xaiEnv) {
	if (source === "env" || provider === "xai" && xaiEnv) return "using environment key";
	if (source === "file") return "using local server secrets file";
	if (source === "none") return "no server key — browser fallback only";
	return "key source unknown";
}
//#endregion
export { SettingsPage as component };
