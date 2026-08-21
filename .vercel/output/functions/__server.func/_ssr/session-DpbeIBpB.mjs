import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Route$7, s as cn } from "./router-Bg908uEK.mjs";
import { B as useCatalog, M as pickCourseForLearner, O as makeReadinessContext, P as presentQuiz, S as isRetiredBuiltInStudyTarget, V as useProgress, d as frontierConcepts, g as inferTier, l as coursesForCategory, o as conceptsInCourse, w as isSelectableCategory } from "./use-catalog-DsTCgnv9.mjs";
import { t as HydrateGate } from "./hydrate-Ceh-ch8W.mjs";
import { t as conceptState } from "./state-ZIUkIptt.mjs";
import { r as selectLesson, t as missingConceptForGeneration } from "./select-Be-uyJdQ.mjs";
import { t as Button } from "./button-DbK4zipU.mjs";
import { a as toGenerationLog, n as generateLesson, o as useAiContext } from "./use-ai-DoYZPk77.mjs";
import { a as getLive, i as generationsAfterStart, s as startLive } from "./live-DpxOBqbB.mjs";
import { n as quizContextForConcept } from "./quiz-context-BAIWHDkr.mjs";
import { t as JournalistToggle } from "./journalist-toggle-DD1IYVWC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-DpbeIBpB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function pickPlacementItems(course, catalog, n = 3) {
	const early = course.modules.slice().sort((a, b) => a.order - b.order).slice(0, 2).flatMap((m) => m.spineIds.length ? m.spineIds : m.conceptIds);
	const items = [];
	for (const conceptId of early) {
		const concept = catalog.conceptMap[conceptId];
		if (!concept || inferTier(concept) > 2) continue;
		const lesson = catalog.lessons.find((l) => l.conceptId === conceptId);
		if (!lesson) continue;
		const question = lesson.quiz[0];
		items.push({
			conceptId,
			tier: inferTier(concept),
			question,
			lessonId: lesson.id
		});
		if (items.length >= n) break;
	}
	return items.map((item) => ({
		...item,
		question: presentQuiz([item.question])[0]
	}));
}
function scorePlacement(answers, now = /* @__PURE__ */ new Date()) {
	const eligible = answers.filter((a) => a.tier <= 2);
	const waived = eligible.filter((a) => a.correct && a.tier <= 1).map((a) => a.conceptId);
	const foundation = eligible.filter((a) => a.tier <= 1);
	const allFoundationCorrect = foundation.length >= 2 && foundation.every((a) => a.correct);
	const coreHit = eligible.find((a) => a.tier === 2 && a.correct);
	if (allFoundationCorrect && coreHit) waived.push(coreHit.conceptId);
	const refused = answers.filter((a) => a.tier >= 3);
	const evidence = [...eligible.map((a) => `${a.conceptId}:${a.correct ? "ok" : "miss"}`), ...refused.map((a) => `${a.conceptId}:ignored-advanced`)];
	let recommendedTier = 0;
	if (waived.length > 0) recommendedTier = 1;
	if (allFoundationCorrect && coreHit) recommendedTier = 2;
	return {
		at: now.toISOString(),
		recommendedTier,
		waivedConceptIds: [...new Set(waived)],
		evidence,
		kind: "quiz"
	};
}
function declareKnown(course, catalog, conceptIds, now = /* @__PURE__ */ new Date()) {
	const allowed = new Set(conceptsInCourse(catalog, course).filter((c) => inferTier(c) <= 1).map((c) => c.id));
	const waived = conceptIds.filter((id) => allowed.has(id));
	return {
		at: now.toISOString(),
		recommendedTier: waived.length ? 1 : 0,
		waivedConceptIds: waived,
		evidence: [...waived.map((id) => `${id}:declared`), ...conceptIds.filter((id) => !allowed.has(id)).map((id) => `${id}:refused`)],
		kind: "declaration"
	};
}
var TIMES = [
	{
		value: 5,
		label: "5 min"
	},
	{
		value: 10,
		label: "10 min"
	},
	{
		value: 20,
		label: "20 min"
	},
	{
		value: 30,
		label: "30+"
	}
];
var MODE_OPTS = [
	{
		value: "explore",
		label: "Explore",
		hint: "Next unit you can actually hold"
	},
	{
		value: "reinforce",
		label: "Reinforce",
		hint: "Due reviews first"
	},
	{
		value: "surprise",
		label: "Surprise me",
		hint: "A different field, at your current position"
	}
];
var EFFORT_OPTS = [
	{
		value: null,
		label: "Any"
	},
	{
		value: "light",
		label: "Light"
	},
	{
		value: "normal",
		label: "Normal"
	},
	{
		value: "deep",
		label: "Deep"
	}
];
function SessionPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionReady, {}) });
}
function SessionReady() {
	const search = Route$7.useSearch();
	const navigate = useNavigate();
	const catalog = useCatalog();
	const settings = useProgress((s) => s.settings);
	const profile = useProgress((s) => s.profile);
	const remember = useProgress((s) => s.rememberRouter);
	const progress = useProgress((s) => s.concepts);
	const recent = useProgress((s) => s.recentCategoryIds);
	const courseRows = useProgress((s) => s.courses);
	const applyPlacement = useProgress((s) => s.applyPlacement);
	const touchCourse = useProgress((s) => s.touchCourse);
	const upsertLesson = useProgress((s) => s.upsertLesson);
	const logGeneration = useProgress((s) => s.logGeneration);
	const ai = useProgress((s) => s.ai);
	const liveGens = getLive()?.generations ?? 0;
	const aiCtx = useAiContext(liveGens);
	const requestedFromUrl = typeof search.category === "string" ? search.category : null;
	const retiredRequested = isRetiredBuiltInStudyTarget(catalog, requestedFromUrl);
	const rawInitial = requestedFromUrl ?? settings.lastCategory ?? profile.preferredTopics[0] ?? null;
	const initialCategory = isRetiredBuiltInStudyTarget(catalog, rawInitial) ? null : rawInitial;
	const initialMode = search.mode ?? settings.lastMode;
	const [minutes, setMinutes] = (0, import_react.useState)(settings.lastTime || settings.preferredDuration);
	const [category, setCategory] = (0, import_react.useState)(initialCategory);
	const [effort, setEffort] = (0, import_react.useState)(settings.lastEffort ?? settings.preferredEffort);
	const [mode, setMode] = (0, import_react.useState)(initialMode);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [placing, setPlacing] = (0, import_react.useState)(false);
	const [placePick, setPlacePick] = (0, import_react.useState)(null);
	const [placeIndex, setPlaceIndex] = (0, import_react.useState)(0);
	const [placeAnswers, setPlaceAnswers] = (0, import_react.useState)([]);
	const preview = (0, import_react.useMemo)(() => selectLesson({
		minutes,
		category,
		effort,
		mode,
		journalistDepth: settings.journalistDepth
	}, progress, recent, catalog, profile, { courses: courseRows }), [
		minutes,
		category,
		effort,
		mode,
		settings.journalistDepth,
		progress,
		recent,
		catalog,
		profile,
		courseRows
	]);
	const missing = (0, import_react.useMemo)(() => missingConceptForGeneration({
		minutes,
		category,
		effort,
		mode,
		journalistDepth: settings.journalistDepth
	}, progress, recent, catalog, profile, { courses: courseRows }), [
		minutes,
		category,
		effort,
		mode,
		settings.journalistDepth,
		progress,
		recent,
		catalog,
		profile,
		courseRows
	]);
	const readiness = makeReadinessContext(catalog, progress, profile, courseRows);
	const activeCourse = category && category !== "random" ? pickCourseForLearner(catalog, category, readiness) ?? coursesForCategory(catalog, category)[0] : void 0;
	const courseState = activeCourse ? courseRows[activeCourse.id] : void 0;
	const nextInCourse = activeCourse ? frontierConcepts(activeCourse, readiness)[0] : void 0;
	const placementItems = (0, import_react.useMemo)(() => activeCourse ? pickPlacementItems(activeCourse, catalog) : [], [activeCourse, catalog]);
	const offerPlacement = Boolean(activeCourse && !courseState?.startedAt && !courseState?.placement && placementItems.length > 0);
	function go(lessonId, live) {
		remember({
			lastTime: minutes,
			lastCategory: category,
			lastEffort: effort,
			lastMode: mode
		});
		if (activeCourse) touchCourse(activeCourse.id);
		startLive({
			lessonId,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			mode,
			timeBudget: minutes,
			generations: live?.generations ?? 0
		});
		navigate({
			to: "/learn/$lessonId",
			params: { lessonId }
		});
	}
	function start() {
		if (!preview) {
			setError("Nothing in the catalog fits this combination. Widen topic or time, or generate a unit.");
			return;
		}
		go(preview.lesson.id);
	}
	function beginAtStart() {
		if (activeCourse) touchCourse(activeCourse.id);
		start();
	}
	function markFoundationsKnown() {
		if (!activeCourse) return;
		const ids = activeCourse.modules.flatMap((m) => m.conceptIds).filter((id) => inferTier(catalog.conceptMap[id]) <= 1);
		applyPlacement(activeCourse.id, declareKnown(activeCourse, catalog, ids));
		setPlacing(false);
		setPlaceIndex(0);
		setPlacePick(null);
		setPlaceAnswers([]);
	}
	function submitPlacementAnswer() {
		const item = placementItems[placeIndex];
		if (!item || placePick === null) return;
		const nextAnswers = [...placeAnswers, {
			conceptId: item.conceptId,
			tier: item.tier,
			correct: placePick === item.question.answerIndex
		}];
		if (placeIndex + 1 < placementItems.length) {
			setPlaceAnswers(nextAnswers);
			setPlaceIndex((n) => n + 1);
			setPlacePick(null);
			return;
		}
		if (activeCourse) applyPlacement(activeCourse.id, scorePlacement(nextAnswers));
		setPlacing(false);
		setPlaceIndex(0);
		setPlacePick(null);
		setPlaceAnswers([]);
	}
	async function generateMissing() {
		if (!missing) return;
		const concept = catalog.conceptMap[missing.conceptId];
		if (!concept) return;
		setBusy(true);
		setError(null);
		const known = profile.knownConceptIds.map((id) => catalog.conceptMap[id]).filter(Boolean).map((c) => ({
			id: c.id,
			name: c.name
		}));
		const weak = Object.values(progress).filter((p) => conceptState(p) === "shaky").map((p) => ({
			id: p.conceptId,
			name: catalog.conceptMap[p.conceptId]?.name ?? p.conceptId
		}));
		const result = await generateLesson(aiCtx, {
			concept,
			durationMin: minutes,
			effort: effort ?? "normal",
			journalist: settings.journalistDepth,
			known,
			weak,
			recent: [],
			adapt: settings.journalistDepth ? "skip-known" : void 0,
			quizContext: quizContextForConcept(concept, readiness, catalog, {
				journalist: settings.journalistDepth,
				history: useProgress.getState().assessmentHistory
			})
		}, { hasLocalMatch: Boolean(preview) });
		setBusy(false);
		logGeneration(toGenerationLog("lesson", result, {
			lessonId: result.ok ? result.value.id : void 0,
			conceptId: concept.id
		}));
		if (!result.ok) {
			setError(result.error + (result.issues ? ` ${result.issues[0]}` : ""));
			return;
		}
		upsertLesson(result.value);
		toast(result.cached ? "Reused a cached unit." : "Generated a structured unit.");
		go(result.value.id, { generations: generationsAfterStart(result.billable) });
	}
	const placeItem = placing ? placementItems[placeIndex] : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.2em] text-muted uppercase",
				children: "Session"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-tight sm:text-4xl",
				children: "How long is the gap?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "One unit. No playlist. Options below are optional."
			}),
			retiredRequested && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl bg-raised p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg",
						children: "This field is archived"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [catalog.categoryMap[requestedFromUrl ?? ""]?.name ?? "This subject", " is kept so old progress still reads. It is not an active built-in course, and Surprise Me will not open it. Open the library if you want to reread something you already studied."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/library",
						className: "mt-3 inline-block text-sm text-muted no-underline hover:text-fg",
						children: "Open library"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: TIMES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMinutes(t.value),
					className: cn("min-h-16 rounded-lg text-base font-medium transition-[box-shadow,background-color] duration-150", minutes === t.value ? "bg-primary text-primary-fg" : "bg-surface text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)]"),
					children: t.label
				}, t.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg",
					children: "Mode"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2 sm:grid-cols-3",
					children: MODE_OPTS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMode(m.value),
						className: cn("min-h-16 rounded-lg px-3 py-3 text-left transition-[box-shadow] duration-150", mode === m.value ? "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" : "bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium",
							children: m.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted",
							children: m.hint
						})]
					}, m.value))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "group rounded-xl bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "cursor-pointer list-none text-sm font-medium text-fg [&::-webkit-details-marker]:hidden",
						children: ["Narrow the field", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 font-normal text-muted",
							children: [category && category !== "random" ? catalog.categoryMap[category]?.name : "any topic", effort ? ` · ${effort}` : " · any effort"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs tracking-wide text-muted uppercase",
								children: "Topic"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: category === null || category === "random",
									onClick: () => setCategory("random"),
									children: "Any / surprise"
								}), catalog.categories.filter(isSelectableCategory).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: category === c.id,
									onClick: () => setCategory(c.id),
									children: c.name
								}, c.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-xs tracking-wide text-muted uppercase",
								children: "Mental effort"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: EFFORT_OPTS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: effort === e.value,
									onClick: () => setEffort(e.value),
									children: e.label
								}, e.label))
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JournalistToggle, {})
			}),
			activeCourse && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.16em] text-muted uppercase",
						children: "Course"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-xl tracking-tight",
						children: activeCourse.title
					}),
					nextInCourse ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Next open unit: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: nextInCourse.name
							}),
							preview && preview.lesson.conceptId !== nextInCourse.id ? ` · router picked “${preview.lesson.title}” for this gap` : ""
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "The open units in this course are already underway. Reviews still fit."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/course/$courseId",
						params: { courseId: activeCourse.id },
						className: "mt-3 inline-block text-sm text-muted no-underline hover:text-fg",
						children: "See modules and sources"
					})
				]
			}),
			offerPlacement && !placing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl bg-raised p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg",
						children: "Starting this course"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Default is the first foundation unit. A short check can waive introductions you already hold — it cannot open advanced material."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: beginAtStart,
							children: "Start at the beginning"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => setPlacing(true),
							children: "I know some of this"
						})]
					})
				]
			}),
			placing && placeItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs tabular-nums text-muted",
						children: [
							"Placement ",
							placeIndex + 1,
							" / ",
							placementItems.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl tracking-tight",
						children: placeItem.question.prompt
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 space-y-2",
						children: placeItem.question.choices.map((choice, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPlacePick(i),
							className: cn("w-full rounded-lg px-4 py-3.5 text-left text-[15px] leading-snug transition-[box-shadow] duration-150", placePick === i ? "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" : "bg-bg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)]"),
							children: choice
						}) }, `${placeItem.question.id}-${choice}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								disabled: placePick === null,
								onClick: submitPlacementAnswer,
								children: placeIndex + 1 < placementItems.length ? "Next" : "Place me"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-muted hover:text-fg",
								onClick: () => {
									setPlacing(false);
									setPlaceIndex(0);
									setPlacePick(null);
									setPlaceAnswers([]);
								},
								children: "Cancel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-muted hover:text-fg",
								onClick: markFoundationsKnown,
								children: "I already know the foundations"
							})
						]
					})
				]
			}),
			preview && !placing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm leading-relaxed text-muted",
				children: [
					"Ready: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: preview.lesson.title
					}),
					" · ",
					preview.lesson.durationMin,
					" min",
					" · ",
					catalog.conceptMap[preview.lesson.conceptId]?.name,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-subtle",
						children: preview.reason
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-bad",
				children: error
			}),
			(!offerPlacement || courseState?.startedAt || courseState?.placement) && !placing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "lg",
					className: "w-full sm:w-auto",
					onClick: start,
					disabled: busy,
					children: "Start learning"
				}), ai.enabled && ai.policy !== "off" && missing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "lg",
					variant: "secondary",
					onClick: () => void generateMissing(),
					disabled: busy,
					children: busy ? "Generating…" : "Generate a missing unit"
				})]
			})
		]
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-10 rounded-full px-3.5 text-sm transition-colors duration-150", active ? "bg-primary text-primary-fg" : "bg-raised text-muted hover:text-fg"),
		children
	});
}
//#endregion
export { SessionPage as component };
