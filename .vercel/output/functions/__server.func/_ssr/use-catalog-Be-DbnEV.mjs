import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { Bt as union, Dt as _enum, Ft as object, Mt as literal, Pt as number, Rt as string, kt as array, zt as tuple } from "../_libs/@better-auth/core+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-catalog-Be-DbnEV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var defaultProfile = {
	displayName: "",
	preferredTopics: [],
	knownConceptIds: [],
	avoidTopics: [],
	customInterests: []
};
var defaultSettings = {
	journalistDepth: false,
	lastTime: 10,
	lastCategory: null,
	lastEffort: null,
	lastMode: "explore",
	preferredDuration: 10,
	preferredEffort: null
};
var defaultAi = {
	enabled: false,
	provider: "xai",
	model: "grok-4.5",
	policy: "manual",
	maxPerDay: 8,
	maxPerSession: 2
};
var defaultState = () => ({
	profile: defaultProfile,
	settings: defaultSettings,
	ai: defaultAi,
	concepts: {},
	sessions: [],
	recentCategoryIds: [],
	customCategories: [],
	customConcepts: [],
	customLessons: [],
	generationLog: [],
	pendingPath: null
});
var PROMPT_VERSION = "dau-lesson-v1";
function buildExport(state, secrets, includeSecrets = false) {
	return {
		format: "dead-air-university-export",
		schema_version: 2,
		exported_at: (/* @__PURE__ */ new Date()).toISOString(),
		profile: state.profile,
		preferences: state.settings,
		ai: state.ai,
		...includeSecrets && secrets ? { secrets } : {},
		progress: {
			concepts: state.concepts,
			sessions: state.sessions,
			recentCategoryIds: state.recentCategoryIds
		},
		catalog: {
			categories: state.customCategories,
			concepts: state.customConcepts,
			lessons: state.customLessons
		},
		generation_log: state.generationLog,
		pending_path: state.pendingPath
	};
}
function parseExport(raw) {
	if (!raw || typeof raw !== "object") return {
		ok: false,
		error: "Not a JSON object."
	};
	const obj = raw;
	if (obj.format === "dead-air-university-export" && obj.schema_version === 2) return {
		ok: true,
		data: raw
	};
	if (obj.settings && obj.concepts && obj.sessions) return {
		ok: true,
		data: raw
	};
	if (obj.schema_version === 1 || obj.format === "dau-progress") return {
		ok: true,
		data: raw
	};
	return {
		ok: false,
		error: "Unrecognized export file."
	};
}
function isNewer(incoming, local) {
	if (!incoming) return false;
	if (!local) return true;
	return new Date(incoming).getTime() > new Date(local).getTime();
}
function importExport(current, incoming, mode = "merge") {
	const parsed = parseExport(incoming);
	if (!parsed.ok) throw new Error(parsed.error);
	const backup = buildExport(current);
	const warnings = [];
	if ("format" in parsed.data && parsed.data.format === "dead-air-university-export") {
		const data = parsed.data;
		if (mode === "replace") return {
			state: {
				profile: data.profile,
				settings: {
					...current.settings,
					...data.preferences
				},
				ai: data.ai,
				concepts: data.progress.concepts,
				sessions: data.progress.sessions,
				recentCategoryIds: data.progress.recentCategoryIds,
				customCategories: data.catalog.categories,
				customConcepts: data.catalog.concepts,
				customLessons: data.catalog.lessons,
				generationLog: data.generation_log ?? [],
				pendingPath: data.pending_path ?? null
			},
			warnings,
			backup
		};
		return {
			state: mergeStates(current, data, warnings),
			warnings,
			backup
		};
	}
	const v1 = parsed.data;
	warnings.push("Imported a v1 progress file. Custom catalog and AI settings were left as they are.");
	const concepts = { ...current.concepts };
	for (const [id, row] of Object.entries(v1.concepts ?? {})) {
		const local = concepts[id];
		if (!local || isNewer(row.lastStudiedAt, local.lastStudiedAt)) concepts[id] = {
			...row,
			reviewHistory: row.reviewHistory ?? [],
			updatedAt: row.updatedAt ?? row.lastStudiedAt ?? null
		};
		else warnings.push(`Kept newer local progress for ${id}.`);
	}
	const sessions = mergeSessions(current.sessions, v1.sessions ?? []);
	return {
		state: {
			...current,
			settings: {
				...current.settings,
				...v1.settings
			},
			concepts,
			sessions,
			recentCategoryIds: unique([...v1.recentCategoryIds ?? [], ...current.recentCategoryIds])
		},
		warnings,
		backup
	};
}
function mergeStates(current, data, warnings) {
	const concepts = { ...current.concepts };
	for (const [id, row] of Object.entries(data.progress.concepts ?? {})) {
		const local = concepts[id];
		const incomingStamp = row.updatedAt ?? row.lastStudiedAt;
		const localStamp = local?.updatedAt ?? local?.lastStudiedAt;
		if (!local || isNewer(incomingStamp, localStamp)) concepts[id] = {
			...row,
			reviewHistory: row.reviewHistory ?? [],
			updatedAt: incomingStamp ?? null
		};
		else warnings.push(`Kept newer local progress for ${id}.`);
	}
	return {
		profile: {
			...current.profile,
			...data.profile
		},
		settings: {
			...current.settings,
			...data.preferences
		},
		ai: {
			...current.ai,
			...data.ai
		},
		concepts,
		sessions: mergeSessions(current.sessions, data.progress.sessions ?? []),
		recentCategoryIds: unique([...data.progress.recentCategoryIds ?? [], ...current.recentCategoryIds]),
		customCategories: mergeById$1(current.customCategories, data.catalog.categories ?? []),
		customConcepts: mergeById$1(current.customConcepts, data.catalog.concepts ?? []),
		customLessons: mergeLessons(current.customLessons, data.catalog.lessons ?? [], warnings),
		generationLog: uniqueById([...data.generation_log ?? [], ...current.generationLog]).slice(0, 400),
		pendingPath: current.pendingPath ?? data.pending_path ?? null
	};
}
function mergeSessions(local, incoming) {
	return uniqueById([...incoming, ...local]).slice(0, 800);
}
function mergeLessons(local, incoming, warnings) {
	const map = new Map(local.map((l) => [l.id, l]));
	for (const lesson of incoming) {
		const cur = map.get(lesson.id);
		if (!cur) {
			map.set(lesson.id, lesson);
			continue;
		}
		if (isNewer(lesson.updatedAt, cur.updatedAt)) map.set(lesson.id, lesson);
		else if (lesson.updatedAt && cur.updatedAt && lesson.updatedAt !== cur.updatedAt) warnings.push(`Kept newer local lesson ${lesson.id}.`);
	}
	return [...map.values()];
}
function mergeById$1(local, incoming) {
	const map = new Map(local.map((x) => [x.id, x]));
	for (const item of incoming) if (!map.has(item.id)) map.set(item.id, item);
	else map.set(item.id, {
		...map.get(item.id),
		...item
	});
	return [...map.values()];
}
function unique(ids) {
	return [...new Set(ids)].slice(0, 12);
}
function uniqueById(rows) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const row of rows) {
		if (seen.has(row.id)) continue;
		seen.add(row.id);
		out.push(row);
	}
	return out;
}
var MIN_INTERVAL = 1;
var MAX_EASE = 3.2;
var MIN_EASE = 1.3;
function emptyProgress(conceptId) {
	return {
		conceptId,
		encountered: false,
		understanding: null,
		quizCorrect: 0,
		quizTotal: 0,
		lastQuizScore: null,
		estimatedMinutes: 0,
		actualMinutes: 0,
		lastStudiedAt: null,
		nextReviewAt: null,
		timesStudied: 0,
		ease: 2.3,
		intervalDays: 0,
		reviewHistory: [],
		updatedAt: null
	};
}
/**
* Quality 0–5 from quiz + self-rating.
* 0–1 fail, 2–3 partial, 4–5 solid. Auditable: both inputs are stored on the event.
*/
function reviewQuality(understanding, quizCorrect, quizTotal) {
	const score = quizTotal <= 0 ? .5 : quizCorrect / quizTotal;
	if (understanding === "didnt_get_it") return score < .34 ? 0 : 1;
	if (understanding === "mostly") return score < .67 ? 2 : 3;
	return score < .67 ? 3 : score < 1 ? 4 : 5;
}
function meanRecentQuality(history) {
	if (history.length === 0) return null;
	const last = history.slice(-3);
	return last.reduce((s, e) => s + reviewQuality(e.understanding, e.quizCorrect, e.quizTotal), 0) / last.length;
}
function daysSince(iso, now) {
	if (!iso) return null;
	return (now.getTime() - new Date(iso).getTime()) / 864e5;
}
function scheduleReview(prev, understanding, quizCorrect, quizTotal, now = /* @__PURE__ */ new Date()) {
	return scheduleReviewFull({
		prev,
		understanding,
		quizCorrect,
		quizTotal,
		now
	});
}
/**
* Simple SM-2 relative scheduler.
*
* Inputs (all stored, none hidden):
* - quiz score and self-rating → quality 0–5
* - previous ease and interval
* - number of prior encounters
* - days since last exposure (early restudy grows interval more slowly)
* - mean quality of the last three reviews
*/
function scheduleReviewFull(input) {
	const now = input.now ?? /* @__PURE__ */ new Date();
	const quality = reviewQuality(input.understanding, input.quizCorrect, input.quizTotal);
	const encounters = input.prev.timesStudied;
	const elapsed = daysSince(input.prev.lastStudiedAt, now);
	const recent = meanRecentQuality(input.prev.reviewHistory);
	let ease = input.prev.ease;
	if (quality <= 1) ease -= .28;
	else if (quality === 2) ease -= .1;
	else if (quality === 3) ease -= .02;
	else if (quality === 4) ease += .1;
	else ease += .16;
	if (encounters >= 4 && quality >= 4) ease += .04;
	ease = clamp(ease, MIN_EASE, MAX_EASE);
	let intervalDays;
	if (quality <= 1) intervalDays = input.quizCorrect === 0 ? 1 : MIN_INTERVAL;
	else if (input.prev.intervalDays < 1) intervalDays = quality <= 3 ? 3 : 6;
	else {
		let growth = ease;
		if (elapsed !== null && input.prev.intervalDays > 0 && elapsed < input.prev.intervalDays * .4) growth *= .85;
		if (recent !== null) {
			if (recent >= 4) growth *= 1.12;
			else if (recent <= 1.5) growth *= .8;
		}
		intervalDays = Math.max(quality <= 3 ? 2 : 4, Math.round(input.prev.intervalDays * growth));
	}
	return {
		ease,
		intervalDays,
		nextReviewAt: addDays(now, intervalDays)
	};
}
function isDue(progress, now = /* @__PURE__ */ new Date()) {
	if (!progress?.nextReviewAt) return false;
	return new Date(progress.nextReviewAt).getTime() <= now.getTime();
}
function addDays(from, days) {
	const d = new Date(from);
	d.setTime(d.getTime() + days * 864e5);
	return d.toISOString();
}
function daysUntil(iso, now = /* @__PURE__ */ new Date()) {
	if (!iso) return null;
	const ms = new Date(iso).getTime() - now.getTime();
	return Math.ceil(ms / 864e5);
}
function clamp(n, lo, hi) {
	return Math.min(hi, Math.max(lo, n));
}
function migrateV1(persisted) {
	const p = persisted ?? {};
	const concepts = {};
	for (const [id, row] of Object.entries(p.concepts ?? {})) concepts[id] = {
		...emptyProgress(id),
		...row,
		reviewHistory: row.reviewHistory ?? [],
		updatedAt: row.updatedAt ?? row.lastStudiedAt ?? null
	};
	return {
		...defaultState(),
		profile: {
			...defaultProfile,
			...p.profile
		},
		settings: {
			...defaultSettings,
			...p.settings
		},
		ai: {
			...defaultAi,
			...p.ai
		},
		concepts,
		sessions: (p.sessions ?? []).map((s) => ({
			...s,
			quizTotal: s.quizTotal ?? 3,
			sourceType: s.sourceType ?? "seed",
			categoryId: s.categoryId ?? "history"
		})),
		recentCategoryIds: p.recentCategoryIds ?? [],
		customCategories: p.customCategories ?? [],
		customConcepts: p.customConcepts ?? [],
		customLessons: p.customLessons ?? [],
		generationLog: p.generationLog ?? [],
		pendingPath: p.pendingPath ?? null
	};
}
var useProgress = create()(persist((set, get) => ({
	...defaultState(),
	setJournalist: (on) => set((s) => ({ settings: {
		...s.settings,
		journalistDepth: on
	} })),
	rememberRouter: (partial) => set((s) => ({ settings: {
		...s.settings,
		...partial
	} })),
	updateProfile: (partial) => set((s) => ({ profile: {
		...s.profile,
		...partial
	} })),
	updateSettings: (partial) => set((s) => ({ settings: {
		...s.settings,
		...partial
	} })),
	updateAi: (partial) => set((s) => ({ ai: {
		...s.ai,
		...partial
	} })),
	recordSession: (input) => {
		const prev = get().concepts[input.conceptId] ?? emptyProgress(input.conceptId);
		const schedule = scheduleReview(prev, input.understanding, input.quizCorrect, input.quizTotal);
		const completedAt = (/* @__PURE__ */ new Date()).toISOString();
		const next = {
			...prev,
			encountered: true,
			understanding: input.understanding,
			quizCorrect: prev.quizCorrect + input.quizCorrect,
			quizTotal: prev.quizTotal + input.quizTotal,
			lastQuizScore: input.quizCorrect,
			estimatedMinutes: prev.estimatedMinutes + input.estimatedMinutes,
			actualMinutes: prev.actualMinutes + input.actualMinutes,
			lastStudiedAt: completedAt,
			timesStudied: prev.timesStudied + 1,
			...schedule,
			reviewHistory: [...prev.reviewHistory, {
				at: completedAt,
				quizCorrect: input.quizCorrect,
				quizTotal: input.quizTotal,
				understanding: input.understanding,
				intervalDays: schedule.intervalDays,
				ease: schedule.ease
			}].slice(-24),
			updatedAt: completedAt
		};
		const session = {
			id: `${input.lessonId}-${Date.now()}`,
			lessonId: input.lessonId,
			conceptId: input.conceptId,
			categoryId: input.categoryId,
			startedAt: input.startedAt,
			completedAt,
			estimatedMinutes: input.estimatedMinutes,
			actualMinutes: input.actualMinutes,
			quizCorrect: input.quizCorrect,
			quizTotal: input.quizTotal,
			understanding: input.understanding,
			mode: input.mode,
			timeBudget: input.timeBudget,
			sourceType: input.sourceType,
			sourceProvider: input.sourceProvider
		};
		set((s) => ({
			concepts: {
				...s.concepts,
				[input.conceptId]: next
			},
			sessions: [session, ...s.sessions].slice(0, 800),
			recentCategoryIds: [input.categoryId, ...s.recentCategoryIds.filter((c) => c !== input.categoryId)].slice(0, 8)
		}));
		return session;
	},
	upsertCategory: (category) => set((s) => ({ customCategories: upsert(s.customCategories, category) })),
	removeCategory: (id) => set((s) => ({
		customCategories: s.customCategories.filter((c) => c.id !== id),
		customConcepts: s.customConcepts.filter((c) => c.category !== id),
		customLessons: s.customLessons.filter((l) => {
			return s.customConcepts.find((c) => c.id === l.conceptId)?.category !== id;
		})
	})),
	upsertConcept: (concept) => set((s) => ({ customConcepts: upsert(s.customConcepts, concept) })),
	removeConcept: (id) => set((s) => ({
		customConcepts: s.customConcepts.filter((c) => c.id !== id),
		customLessons: s.customLessons.filter((l) => l.conceptId !== id)
	})),
	upsertLesson: (lesson) => set((s) => ({ customLessons: upsert(s.customLessons, {
		...lesson,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}) })),
	archiveLesson: (id) => set((s) => ({ customLessons: s.customLessons.map((l) => l.id === id ? {
		...l,
		archived: true,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	} : l) })),
	applyLessonVersion: (lessonId, version, patch) => set((s) => {
		if (s.customLessons.find((l) => l.id === lessonId)) return { customLessons: s.customLessons.map((l) => l.id === lessonId ? {
			...l,
			...patch,
			versions: [...l.versions ?? [], version],
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} : l) };
		return { customLessons: [...s.customLessons, {
			...patch,
			id: lessonId,
			versions: [version],
			updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			custom: true
		}] };
	}),
	addFeedback: (lessonId, verdict) => set((s) => {
		const entry = {
			verdict,
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (s.customLessons.find((l) => l.id === lessonId)) return { customLessons: s.customLessons.map((l) => l.id === lessonId ? {
			...l,
			feedback: [...l.feedback ?? [], entry]
		} : l) };
		return s;
	}),
	logGeneration: (entry) => set((s) => ({ generationLog: [entry, ...s.generationLog].slice(0, 400) })),
	setPendingPath: (path) => set({ pendingPath: path }),
	approvePath: (path) => set((s) => ({
		customCategories: upsert(s.customCategories, {
			id: path.id,
			name: path.title,
			blurb: path.blurb,
			custom: true
		}),
		customConcepts: [...s.customConcepts.filter((c) => c.category !== path.id), ...path.concepts.map((c) => ({
			...c,
			category: path.id,
			custom: true
		}))],
		pendingPath: null
	})),
	replaceState: (state) => set(state),
	importBundle: (raw, mode = "merge") => {
		const result = importExport(snapshot(get()), raw, mode);
		set(result.state);
		return {
			warnings: result.warnings,
			backupAt: result.backup.exported_at
		};
	},
	resetAll: () => set(defaultState())
}), {
	name: "dau-progress-v1",
	version: 2,
	migrate: (persisted) => migrateV1(persisted),
	partialize: (s) => ({
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
	})
}));
function upsert(list, item) {
	const idx = list.findIndex((x) => x.id === item.id);
	if (idx === -1) return [...list, item];
	const next = [...list];
	next[idx] = {
		...next[idx],
		...item
	};
	return next;
}
function snapshot(s) {
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
function generationsToday(log, now = /* @__PURE__ */ new Date()) {
	const start = new Date(now);
	start.setHours(0, 0, 0, 0);
	return log.filter((e) => e.ok && new Date(e.at).getTime() >= start.getTime()).length;
}
var CATEGORIES = [
	{
		id: "cpu",
		name: "CPU / GPU architecture",
		blurb: "Pipelines, prediction, caches, and out-of-order guts."
	},
	{
		id: "semiconductors",
		name: "Semiconductor manufacturing",
		blurb: "How chips are printed, aligned, and yielded."
	},
	{
		id: "os",
		name: "Operating systems",
		blurb: "Processes, memory, and the scheduler that lies to you."
	},
	{
		id: "networking",
		name: "Networking",
		blurb: "Packets, congestion, and how the internet actually routes."
	},
	{
		id: "compilers",
		name: "Compilers",
		blurb: "From source text to registers, via IR."
	},
	{
		id: "ml",
		name: "Machine learning",
		blurb: "Gradients, attention, and what the math is actually doing."
	},
	{
		id: "astronomy",
		name: "Astronomy",
		blurb: "Stars, distances, and how we know what we claim."
	},
	{
		id: "evo-bio",
		name: "Evolutionary biology",
		blurb: "Selection, development, and what evolution is not."
	},
	{
		id: "economics",
		name: "Economics",
		blurb: "Trade-offs, money, and models that break in public."
	},
	{
		id: "statistics",
		name: "Statistics",
		blurb: "Uncertainty, bias, and the difference between signal and luck."
	},
	{
		id: "horology",
		name: "Horology",
		blurb: "Escapements, regulation, and why a watch keeps time."
	},
	{
		id: "audio",
		name: "Audio engineering",
		blurb: "Frequency, dynamics, and the physics of a mix."
	},
	{
		id: "music-theory",
		name: "Music theory",
		blurb: "Intervals, modes, and why some clashes work."
	},
	{
		id: "death-metal",
		name: "Death metal",
		blurb: "History, technique, and how the music is built."
	},
	{
		id: "history",
		name: "General history",
		blurb: "Events as mechanisms, not trivia."
	}
];
Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
var CONCEPTS = [
	{
		id: "cpu-pipeline",
		name: "Instruction pipelines",
		category: "cpu",
		prerequisites: [],
		level: "intro",
		summary: "Breaking instruction execution into overlapping stages."
	},
	{
		id: "cpu-hazards",
		name: "Pipeline hazards",
		category: "cpu",
		parentId: "cpu-pipeline",
		prerequisites: ["cpu-pipeline"],
		level: "core",
		summary: "Data, control, and structural stalls that break ideal overlap."
	},
	{
		id: "cpu-branch-prediction",
		name: "Branch prediction",
		category: "cpu",
		parentId: "cpu-pipeline",
		prerequisites: ["cpu-pipeline"],
		level: "core",
		summary: "Guessing control flow so the pipeline stays full."
	},
	{
		id: "cpu-btb",
		name: "Branch target buffers",
		category: "cpu",
		parentId: "cpu-branch-prediction",
		prerequisites: ["cpu-branch-prediction"],
		level: "journalist",
		summary: "Caching where a branch went last time, not just taken/not-taken."
	},
	{
		id: "cpu-predictors",
		name: "Predictor types",
		category: "cpu",
		parentId: "cpu-branch-prediction",
		prerequisites: ["cpu-branch-prediction"],
		level: "journalist",
		summary: "Local, global, and TAGE-style predictors and why they exist."
	},
	{
		id: "cpu-ras",
		name: "Return address stacks",
		category: "cpu",
		parentId: "cpu-branch-prediction",
		prerequisites: ["cpu-branch-prediction"],
		level: "journalist",
		summary: "Special-casing CALL/RET so returns do not pollute the BTB."
	},
	{
		id: "cpu-renaming",
		name: "Register renaming",
		category: "cpu",
		parentId: "cpu-pipeline",
		prerequisites: ["cpu-pipeline"],
		level: "core",
		summary: "Mapping architectural names onto a larger physical file."
	},
	{
		id: "cpu-rob",
		name: "Reorder buffers",
		category: "cpu",
		parentId: "cpu-renaming",
		prerequisites: ["cpu-renaming"],
		level: "journalist",
		summary: "Retiring out-of-order work in program order."
	},
	{
		id: "cpu-coherency",
		name: "Cache coherency",
		category: "cpu",
		parentId: "cpu-pipeline",
		prerequisites: ["cpu-pipeline"],
		level: "core",
		summary: "Keeping private caches honest across cores."
	},
	{
		id: "semi-litho",
		name: "Photolithography",
		category: "semiconductors",
		prerequisites: [],
		level: "intro",
		summary: "Projecting patterns into resist to define features."
	},
	{
		id: "semi-euv",
		name: "EUV lithography",
		category: "semiconductors",
		parentId: "semi-litho",
		prerequisites: ["semi-litho"],
		level: "core",
		summary: "13.5 nm light, mirrors, and why refractive optics die."
	},
	{
		id: "semi-na",
		name: "Numerical aperture",
		category: "semiconductors",
		parentId: "semi-euv",
		prerequisites: ["semi-euv"],
		level: "journalist",
		summary: "How High-NA EUV buys resolution and spends depth of focus."
	},
	{
		id: "semi-overlay",
		name: "Overlay",
		category: "semiconductors",
		parentId: "semi-euv",
		prerequisites: ["semi-euv"],
		level: "journalist",
		summary: "Layer-to-layer alignment as a yield budget, not a slogan."
	},
	{
		id: "semi-stochastics",
		name: "Stochastic defects",
		category: "semiconductors",
		parentId: "semi-euv",
		prerequisites: ["semi-euv"],
		level: "journalist",
		summary: "Photon and photoacid shot noise at EUV doses."
	},
	{
		id: "os-process",
		name: "Processes and threads",
		category: "os",
		prerequisites: [],
		level: "intro",
		summary: "Address spaces, threads, and what isolation actually costs."
	},
	{
		id: "os-vm",
		name: "Virtual memory",
		category: "os",
		parentId: "os-process",
		prerequisites: ["os-process"],
		level: "core",
		summary: "Pages, page tables, and the TLB as a cache of translations."
	},
	{
		id: "os-sched",
		name: "CPU scheduling",
		category: "os",
		parentId: "os-process",
		prerequisites: ["os-process"],
		level: "core",
		summary: "Fairness, latency, and why CFS is not a real-time scheduler."
	},
	{
		id: "net-stack",
		name: "The network stack",
		category: "networking",
		prerequisites: [],
		level: "intro",
		summary: "Layers as contracts, not a morality play."
	},
	{
		id: "net-congestion",
		name: "Congestion control",
		category: "networking",
		parentId: "net-stack",
		prerequisites: ["net-stack"],
		level: "core",
		summary: "How senders share a pipe they cannot see."
	},
	{
		id: "net-bgp",
		name: "BGP",
		category: "networking",
		parentId: "net-stack",
		prerequisites: ["net-stack"],
		level: "journalist",
		summary: "Policy routing between autonomous systems."
	},
	{
		id: "cmp-front",
		name: "Lexing and parsing",
		category: "compilers",
		prerequisites: [],
		level: "intro",
		summary: "Turning characters into a tree the rest of the compiler can hate."
	},
	{
		id: "cmp-ssa",
		name: "SSA form",
		category: "compilers",
		parentId: "cmp-front",
		prerequisites: ["cmp-front"],
		level: "core",
		summary: "Single assignment so dataflow becomes a graph problem."
	},
	{
		id: "cmp-alloc",
		name: "Register allocation",
		category: "compilers",
		parentId: "cmp-ssa",
		prerequisites: ["cmp-ssa"],
		level: "journalist",
		summary: "Graph coloring, spilling, and the real cost of an extra live range."
	},
	{
		id: "ml-gd",
		name: "Gradient descent",
		category: "ml",
		prerequisites: [],
		level: "intro",
		summary: "Following the slope of a loss you can actually compute."
	},
	{
		id: "ml-backprop",
		name: "Backpropagation",
		category: "ml",
		parentId: "ml-gd",
		prerequisites: ["ml-gd"],
		level: "core",
		summary: "Reverse-mode autodiff, not a separate algorithm from calculus."
	},
	{
		id: "ml-attention",
		name: "Attention",
		category: "ml",
		parentId: "ml-backprop",
		prerequisites: ["ml-backprop"],
		level: "journalist",
		summary: "QKV as a content-addressable lookup, and why it scales."
	},
	{
		id: "ast-hr",
		name: "The Hertzsprung–Russell diagram",
		category: "astronomy",
		prerequisites: [],
		level: "intro",
		summary: "Luminosity versus temperature as a map of stellar lives."
	},
	{
		id: "ast-exo",
		name: "Exoplanet detection",
		category: "astronomy",
		parentId: "ast-hr",
		prerequisites: ["ast-hr"],
		level: "core",
		summary: "Transits, radial velocity, and what each method cannot see."
	},
	{
		id: "bio-selection",
		name: "Natural selection",
		category: "evo-bio",
		prerequisites: [],
		level: "intro",
		summary: "Differential reproductive success, not progress."
	},
	{
		id: "bio-evodevo",
		name: "Evo-devo",
		category: "evo-bio",
		parentId: "bio-selection",
		prerequisites: ["bio-selection"],
		level: "core",
		summary: "How developmental toolkits make large morphological jumps cheap."
	},
	{
		id: "econ-ca",
		name: "Comparative advantage",
		category: "economics",
		prerequisites: [],
		level: "intro",
		summary: "Opportunity cost, not absolute productivity."
	},
	{
		id: "econ-money",
		name: "Monetary policy",
		category: "economics",
		parentId: "econ-ca",
		prerequisites: ["econ-ca"],
		level: "core",
		summary: "Rates, reserves, and the transmission the press compresses."
	},
	{
		id: "stat-bias",
		name: "Sampling bias",
		category: "statistics",
		prerequisites: [],
		level: "intro",
		summary: "Who is in the data is the result."
	},
	{
		id: "stat-pvalue",
		name: "P-values",
		category: "statistics",
		parentId: "stat-bias",
		prerequisites: ["stat-bias"],
		level: "core",
		summary: "A tail probability under a model, not the chance you are right."
	},
	{
		id: "stat-bayes",
		name: "Bayes in practice",
		category: "statistics",
		parentId: "stat-pvalue",
		prerequisites: ["stat-pvalue"],
		level: "journalist",
		summary: "Priors, likelihoods, and why base rates refuse to die."
	},
	{
		id: "horo-escape",
		name: "The escapement",
		category: "horology",
		prerequisites: [],
		level: "intro",
		summary: "Turning a spring’s unwind into counted ticks."
	},
	{
		id: "horo-tourbillon",
		name: "The tourbillon",
		category: "horology",
		parentId: "horo-escape",
		prerequisites: ["horo-escape"],
		level: "core",
		summary: "Averaging positional error, and when it is theater."
	},
	{
		id: "aud-freq",
		name: "Frequency response",
		category: "audio",
		prerequisites: [],
		level: "intro",
		summary: "What a system does to amplitude versus frequency."
	},
	{
		id: "aud-comp",
		name: "Compression",
		category: "audio",
		parentId: "aud-freq",
		prerequisites: ["aud-freq"],
		level: "core",
		summary: "Threshold, ratio, attack, release — gain reduction as time."
	},
	{
		id: "mus-interval",
		name: "Intervals and consonance",
		category: "music-theory",
		prerequisites: [],
		level: "intro",
		summary: "Ratios, beating, and why a fifth sits still."
	},
	{
		id: "mus-modes",
		name: "Modes",
		category: "music-theory",
		parentId: "mus-interval",
		prerequisites: ["mus-interval"],
		level: "core",
		summary: "Same pitch set, different tonic gravity."
	},
	{
		id: "dm-blast",
		name: "Blast beats",
		category: "death-metal",
		prerequisites: [],
		level: "intro",
		summary: "The drum grammar that made death metal possible."
	},
	{
		id: "dm-harmony",
		name: "Death-metal harmony",
		category: "death-metal",
		parentId: "dm-blast",
		prerequisites: ["dm-blast"],
		level: "core",
		summary: "Diminished cells, chromatic planing, and riff as form."
	},
	{
		id: "dm-history",
		name: "Florida and Stockholm",
		category: "death-metal",
		prerequisites: [],
		level: "intro",
		summary: "Two scenes, two production doctrines, one genre name."
	},
	{
		id: "hist-method",
		name: "How historians argue",
		category: "history",
		prerequisites: [],
		level: "intro",
		summary: "Sources, causation, and the difference between chronicle and claim."
	},
	{
		id: "hist-nixon",
		name: "The Nixon shock",
		category: "history",
		parentId: "hist-method",
		prerequisites: ["hist-method"],
		level: "journalist",
		summary: "Ending gold convertibility and the monetary order that followed."
	}
];
Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
var example_euv_resist_default = {
	id: "semi-resist-10",
	conceptId: "semi-stochastics",
	title: "Resist is a chemical budget",
	durationMin: 10,
	effort: "deep",
	level: "journalist",
	prerequisites: ["semi-euv"],
	source: {
		"author": "External seed",
		"generator": "human",
		"version": "1.0"
	},
	explanation: ["Chemically amplified resists turn a few photoacids into many solubility-switching events. That amplification is why a sparse EUV photon shower can still print — and why acid diffusion blurs the edge you thought you bought with a smaller λ.", "Metal-oxide resists raise absorption and can change the RLS trade, but they shift the problem into underlayer adhesion, scum, and etch selectivity. A resist drop-in is never only a resist drop-in."],
	example: "Raise PAG loading to print at a lower dose and you often pay in line-edge roughness as acids wander. The ‘faster’ resist can be the noisier one.",
	whyItMatters: "When a foundry says they changed resist, they are moving the stochastic and etch budgets, not swapping a filter preset.",
	quiz: [
		{
			"id": "rs1",
			"prompt": "Chemical amplification exists so that:",
			"choices": [
				"Every photon is wasted",
				"A few photoacids can switch many sites, stretching a sparse photon budget",
				"Mirrors become lenses",
				"Overlay is free"
			],
			"answerIndex": 1,
			"explanation": "Gain on a small photon count — with diffusion as the tax."
		},
		{
			"id": "rs2",
			"prompt": "Acid diffusion primarily hurts:",
			"choices": [
				"Source power",
				"Edge placement / LER",
				"The tin droplet rate",
				"The scanner’s vacuum"
			],
			"answerIndex": 1,
			"explanation": "The chemical blur is a resolution and roughness term."
		},
		{
			"id": "rs3",
			"prompt": "A metal-oxide resist swap also forces you to revisit:",
			"choices": [
				"Only the logo on the bottle",
				"Underlayer, scum, and etch selectivity",
				"The ISA of the CPU",
				"BGP policy"
			],
			"answerIndex": 1,
			"explanation": "The stack is the process."
		}
	]
};
function isLegacySource(source) {
	return "generator" in source && !("type" in source);
}
function normalizeProvenance(source, fallback = "seed") {
	if (!isLegacySource(source)) return {
		...source,
		schemaVersion: source.schemaVersion ?? 1
	};
	return {
		type: source.generator === "human" ? fallback === "imported" ? "imported" : "human" : fallback,
		provider: source.generator,
		author: source.author,
		schemaVersion: 1,
		notes: `legacy ${source.version}`
	};
}
function asParagraphs(text) {
	if (Array.isArray(text)) return text.filter((p) => p.trim().length > 0);
	return text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}
function asQuiz(quiz) {
	return [
		quiz[0],
		quiz[1],
		quiz[2]
	];
}
function normalizeLesson(raw, fallbackType = "seed") {
	const conceptId = raw.conceptId ?? raw.concept_id;
	const durationMin = raw.durationMin ?? raw.estimated_minutes;
	const why = raw.whyItMatters ?? raw.why_it_matters;
	if (!raw.id || !conceptId || !raw.title || !durationMin || !raw.effort || !why || !raw.quiz) throw new Error("lesson is missing required fields");
	if (raw.quiz.length !== 3) throw new Error("lesson quiz must have exactly 3 questions");
	const source = raw.source ? normalizeProvenance(raw.source, fallbackType) : {
		type: fallbackType,
		schemaVersion: 1,
		author: "unknown"
	};
	return {
		schemaVersion: raw.schemaVersion ?? raw.schema_version ?? 1,
		id: raw.id,
		conceptId,
		title: raw.title,
		durationMin,
		effort: raw.effort,
		level: raw.level ?? "core",
		prerequisites: raw.prerequisites ?? [],
		goDeeper: raw.goDeeper ?? raw.go_deeper,
		source,
		explanation: asParagraphs(raw.explanation ?? []),
		example: raw.example ?? "",
		whyItMatters: why,
		diagram: raw.diagram ?? void 0,
		quiz: asQuiz(raw.quiz),
		archived: raw.archived,
		versions: raw.versions,
		createdAt: raw.createdAt,
		updatedAt: raw.updatedAt,
		custom: raw.custom,
		feedback: raw.feedback
	};
}
function applyActiveVersion(lesson) {
	const versions = lesson.versions ?? [];
	if (versions.length === 0) return lesson;
	const last = versions[versions.length - 1];
	return {
		...lesson,
		explanation: last.explanation ?? lesson.explanation,
		example: last.example ?? lesson.example,
		whyItMatters: last.whyItMatters ?? lesson.whyItMatters,
		quiz: last.quiz && last.quiz.length === 3 ? asQuiz(last.quiz) : lesson.quiz,
		source: last.provenance ?? lesson.source
	};
}
var quizQuestionSchema = object({
	id: string().min(1),
	prompt: string().min(1),
	choices: tuple([
		string(),
		string(),
		string(),
		string()
	]),
	answerIndex: union([
		literal(0),
		literal(1),
		literal(2),
		literal(3)
	]),
	explanation: string().min(1)
});
var provenanceSchema = object({
	type: _enum([
		"seed",
		"human",
		"imported",
		"ai"
	]),
	provider: string().optional(),
	author: string().optional(),
	model: string().optional(),
	generatedAt: string().optional(),
	importedAt: string().optional(),
	promptVersion: string().optional(),
	schemaVersion: number().int().positive().default(1),
	links: array(string()).optional(),
	sourceExcerpt: string().optional(),
	notes: string().optional()
});
var legacySourceSchema = object({
	author: string(),
	generator: _enum([
		"grok",
		"gpt",
		"claude",
		"human"
	]),
	version: string()
});
var lessonFileSchema = object({
	schema_version: number().int().positive().optional(),
	schemaVersion: number().int().positive().optional(),
	id: string().min(1),
	concept_id: string().min(1).optional(),
	conceptId: string().min(1).optional(),
	title: string().min(1),
	category: string().optional(),
	estimated_minutes: union([
		literal(5),
		literal(10),
		literal(20),
		literal(30)
	]).optional(),
	durationMin: union([
		literal(5),
		literal(10),
		literal(20),
		literal(30)
	]).optional(),
	effort: _enum([
		"light",
		"normal",
		"deep"
	]),
	level: _enum([
		"intro",
		"core",
		"journalist"
	]).optional(),
	prerequisites: array(string()).default([]),
	go_deeper: string().optional(),
	goDeeper: string().optional(),
	source: union([provenanceSchema, legacySourceSchema]),
	explanation: union([array(string()).min(1), string().min(1)]),
	example: string().min(1),
	why_it_matters: string().optional(),
	whyItMatters: string().optional(),
	diagram: string().nullable().optional(),
	quiz: tuple([
		quizQuestionSchema,
		quizQuestionSchema,
		quizQuestionSchema
	])
}).refine((v) => Boolean(v.conceptId || v.concept_id), { message: "conceptId is required" }).refine((v) => Boolean(v.durationMin || v.estimated_minutes), { message: "durationMin / estimated_minutes is required" }).refine((v) => Boolean(v.whyItMatters || v.why_it_matters), { message: "whyItMatters is required" });
object({
	id: string().min(1),
	name: string().min(1),
	category: string().min(1),
	parentId: string().optional(),
	prerequisites: array(string()),
	level: _enum([
		"intro",
		"core",
		"journalist"
	]),
	summary: string().min(1)
});
var generatedLessonSchema = object({
	schema_version: literal(1).optional(),
	concept_id: string().min(1),
	title: string().min(4),
	category: string().min(1),
	estimated_minutes: union([
		literal(5),
		literal(10),
		literal(20),
		literal(30)
	]),
	effort: _enum([
		"light",
		"normal",
		"deep"
	]),
	level: _enum([
		"intro",
		"core",
		"journalist"
	]).optional(),
	prerequisites: array(string()).default([]),
	explanation: union([array(string()).min(1), string().min(20)]),
	example: string().min(20),
	why_it_matters: string().min(20),
	diagram: string().nullable().optional(),
	quiz: tuple([
		quizQuestionSchema,
		quizQuestionSchema,
		quizQuestionSchema
	]),
	go_deeper: array(string()).optional()
});
var generatedExplainSchema = object({
	explanation: union([array(string()).min(1), string().min(20)]),
	example: string().min(20)
});
var generatedQuizSchema = object({ quiz: tuple([
	quizQuestionSchema,
	quizQuestionSchema,
	quizQuestionSchema
]) });
var generatedPathSchema = object({
	title: string().min(2),
	blurb: string().min(8),
	concepts: array(object({
		id: string().min(1),
		name: string().min(1),
		summary: string().min(8),
		parentId: string().nullable().optional(),
		prerequisites: array(string()).default([]),
		level: _enum([
			"intro",
			"core",
			"journalist"
		]).default("intro")
	})).min(2).max(16),
	sequence: array(string()).min(2)
});
var SOURCE = {
	type: "seed",
	provider: "grok",
	author: "Dead Air University",
	schemaVersion: 1,
	promptVersion: "seed-v1"
};
function q(id, prompt, choices, answerIndex, explanation) {
	return {
		id,
		prompt,
		choices,
		answerIndex,
		explanation
	};
}
function L(lesson) {
	return {
		...lesson,
		schemaVersion: 1,
		source: SOURCE
	};
}
var CPU_SEMI_LESSONS = [
	L({
		id: "cpu-pipeline-5",
		conceptId: "cpu-pipeline",
		title: "Why a CPU is a factory line",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "cpu-hazards",
		diagram: "pipeline",
		explanation: [
			"A single instruction looks atomic from software: fetch it, do it, write the result. Hardware cannot afford that. Instruction execution is a sequence of distinct physical jobs — fetch bytes, decode them, read registers, do ALU work, access memory, write back. Each job uses different silicon.",
			"A pipeline keeps those jobs busy at once, the way a factory keeps every station occupied. While instruction N is in execute, N+1 can be decoding and N+2 can be fetching. Ideal throughput approaches one instruction per cycle even though each instruction still takes several cycles of latency.",
			"Clock speed stories hide this. Frequency is how fast a stage ticks. IPC (instructions per cycle) is how often the line actually retires useful work. Deep pipelines raise frequency by shrinking each stage, and they raise the cost of any interruption."
		],
		example: "A 5-stage RISC line (IF/ID/EX/MEM/WB) can have five instructions in flight. If every instruction is independent and hits in cache, you retire one per cycle. The moment a load’s data is needed by the next ALU op, the line bubbles — the factory waits for a part.",
		whyItMatters: "Almost every performance claim about a CPU — clocks, cores, ‘efficiency cores’, GPU occupancy — is a story about keeping a pipeline fed. If you only remember frequency, you will misread every chip announcement.",
		quiz: [
			q("p1", "Pipelining primarily improves which quantity?", [
				"Instruction latency",
				"Throughput / IPC",
				"Cache capacity",
				"DRAM latency"
			], 1, "Each instruction still takes multiple stages. Overlap raises how many finish per unit time."),
			q("p2", "A pipeline bubble is:", [
				"A spare physical register",
				"An empty stage waiting on a dependency or miss",
				"A branch that was predicted taken",
				"A SIMD lane with no work"
			], 1, "The stage has nothing useful to do until the producer finishes."),
			q("p3", "Deeper pipelines usually:", [
				"Eliminate data hazards",
				"Lower the cost of a mispredict",
				"Allow a higher clock at the cost of more expensive interruptions",
				"Remove the need for caches"
			], 2, "Shorter stages clock faster; a flush wastes more in-flight work.")
		]
	}),
	L({
		id: "cpu-hazards-10",
		conceptId: "cpu-hazards",
		title: "The three ways a pipeline stalls",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["cpu-pipeline"],
		goDeeper: "cpu-renaming",
		diagram: "hazards",
		explanation: [
			"Ideal overlap assumes every stage always has independent work. Three classes of hazard break that. Structural: two instructions want the same unit (one divider, two divides). Data: an instruction needs a result that has not been written yet. Control: you do not know which instruction is next because of a branch.",
			"Hardware papers spend most of their pages on data and control. Forwarding (bypassing) ships a result from the ALU output back to the next instruction’s input without waiting for writeback. That kills many RAW hazards. It cannot help when the producer is a cache miss — there is no value to forward yet.",
			"Control hazards are why branch prediction exists. Until the branch resolves, the fetch stage is guessing. A wrong guess flushes every younger instruction. The longer and wider the machine, the more work that flush discards."
		],
		example: "`r1 = load [r2]; r3 = r1 + 4` cannot execute the add until the load data arrives. On an L1 hit that may be 4 cycles; on an L3 miss it may be 40; on DRAM it is hundreds. The pipeline does not ‘slow down’ uniformly — it waits on that one edge.",
		whyItMatters: "When a reviewer writes that a chip is ‘bad at games’ or ‘great at compiles’, they are usually pointing at how often this machine hits a hazard its predictors and caches cannot hide.",
		quiz: [
			q("h1", "Forwarding fixes which situation?", [
				"A cache miss",
				"A RAW hazard when the value already exists in the pipeline",
				"A structural conflict on one divider",
				"An interrupt"
			], 1, "Bypass wires ship an already-computed result. They cannot invent a value still in DRAM."),
			q("h2", "A control hazard exists because:", [
				"Registers have names",
				"The next fetch address depends on an unresolved branch",
				"The TLB is full",
				"The ROB is a queue"
			], 1, "Fetch cannot know the correct PC until the branch (or its predictor) speaks."),
			q("h3", "Which stall cannot be removed by a bigger register file alone?", [
				"WAW on the same architectural register",
				"A load that misses in cache",
				"An output dependency the renamer would kill",
				"Two writes to r1 in program order"
			], 1, "A miss is a data availability problem, not a name conflict.")
		]
	}),
	L({
		id: "cpu-branch-10",
		conceptId: "cpu-branch-prediction",
		title: "Branch prediction is a cache for the future",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["cpu-pipeline"],
		goDeeper: "cpu-predictors",
		diagram: "branch",
		explanation: [
			"Every conditional branch is a tiny future you have not computed yet. The fetch unit cannot wait. It predicts taken or not-taken and, separately, where the target is. Those are different problems: direction is a bit; the target is an address.",
			"A 90% accurate predictor still hurts if the remaining 10% each flush 100 in-flight instructions. Modern cores advertise >95% on SPEC-like code. That number is workload-specific. Interpreters, browsers, and poorly predicted virtual calls are where the story breaks.",
			"Prediction is not magic insight. It is correlation: this branch, in this recent context, usually went that way. When the correlation dies — a new input distribution, a security domain switch — the pipeline suddenly looks much shorter."
		],
		example: "A loop branch (`i < n`) is almost always taken until the last iteration. A one-bit saturating counter learns this immediately and pays one mispredict per loop. A two-bit counter survives a single odd not-taken without flipping, which is why it became the textbook default.",
		whyItMatters: "Spectre made branch predictors famous for the wrong reason. For reporting and for performance work, the right reason remains: mispredicts are how control flow taxes IPC, and every ‘security mitigation’ that constrains prediction has a measurable throughput cost.",
		quiz: [
			q("b1", "Direction prediction and target prediction are separate because:", [
				"Taken/not-taken is one bit; the destination is an address",
				"Targets never repeat",
				"Only indirect branches have a direction",
				"The BTB stores flags, not PCs"
			], 0, "A taken branch still needs to know *where*."),
			q("b2", "A two-bit saturating counter is used so that:", [
				"It can store the target PC",
				"A single unusual outcome does not flip the prediction",
				"It predicts return addresses",
				"It replaces the BTB"
			], 1, "It takes two consecutive disagreements to change state."),
			q("b3", "A 97% prediction rate can still dominate runtime when:", [
				"Each miss is cheap",
				"The window is wide and each miss flushes a lot of work",
				"There are no branches",
				"The cache always hits"
			], 1, "Cost is miss-rate × miss-penalty. Wide/deep machines have huge penalties.")
		]
	}),
	L({
		id: "cpu-btb-10",
		conceptId: "cpu-btb",
		title: "The BTB is not a direction predictor",
		durationMin: 10,
		effort: "deep",
		level: "journalist",
		prerequisites: ["cpu-branch-prediction"],
		goDeeper: "cpu-ras",
		diagram: "btb",
		explanation: [
			"A branch target buffer is a cache from instruction address (usually a tag on the fetch PC) to the last-seen target. It answers ‘if I fetch from here, where do I fetch next?’ before decode has even seen that the bytes are a branch.",
			"That timing is the point. Waiting for decode to notice a branch already costs a cycle in a high-frequency front end. The BTB lets fetch steer itself. Capacity, associativity, and how many branches per fetch group it can handle show up in front-end stall counters long before you look at the direction predictor.",
			"Indirect branches (function pointers, vtables, computed goto) stress the BTB because the target is data-dependent. A BTB that stores one target per branch thrashes. Some designs keep multiple targets and a chooser; some fold in path history. When a chip vendor talks about ‘indirect branch improvements’, this is the structure they mean."
		],
		example: "A bytecode interpreter’s dispatch is often `handler = table[*pc++]; goto *handler`. Every opcode is an indirect branch through the same site. A 1-target BTB is almost useless. A history-tagged indirect predictor can learn that `ADD` is often followed by `LOAD` and steer correctly.",
		whyItMatters: "Writeups that say ‘better branch prediction’ after a microarchitecture launch are usually mixing three boxes: BTB capacity, direction predictor, and the return stack. They miss different workloads. If you cannot name which box moved, you cannot judge the claim.",
		quiz: [
			q("t1", "The BTB’s job is primarily to:", [
				"Guess taken versus not-taken",
				"Provide a fetch redirect address early",
				"Rename registers",
				"Store return addresses only"
			], 1, "It is a target cache used before decode."),
			q("t2", "Indirect branches hurt a simple BTB because:", [
				"They are never taken",
				"The target varies and a single cached destination is often wrong",
				"They have no PC",
				"They cannot be cached"
			], 1, "One site, many destinations."),
			q("t3", "A BTB miss on an otherwise well-predicted taken branch typically costs:", [
				"A full pipeline flush equivalent to a direction mispredict",
				"A short front-end bubble until decode computes the target",
				"A cache writeback",
				"A trip to DRAM"
			], 1, "You still discover the branch at decode; you just steered late.")
		]
	}),
	L({
		id: "cpu-predictors-20",
		conceptId: "cpu-predictors",
		title: "TAGE and why local history was not enough",
		durationMin: 20,
		effort: "deep",
		level: "journalist",
		prerequisites: ["cpu-branch-prediction"],
		explanation: [
			"A local predictor keeps a short history per branch: the last N outcomes of *this* site. It wins on loops and simple phases. It loses when this branch’s behavior is a function of other recent branches — the classic example is a branch inside a nested condition whose outcome correlates with an earlier test.",
			"A global predictor hashes a shared history register of recent outcomes and indexes a table of counters. That captures correlation across sites. It also aliases: unrelated branches collide in the same counter. Gshare XOR’s the history with the PC to spread them.",
			"TAGE (TAgged GEometric) is the family most high-performance cores now resemble. Several tables, each tagged, each indexed with a geometrically longer history. A hit on a longer table wins. Partial tag checks cut aliasing. Newly allocated entries are cautious. The geometric lengths exist because useful correlation lives at many timescales at once — 4 bits for a loop, 40 bits for a parser state machine.",
			"When a vendor says they ‘increased the predictor’, ask: more entries, longer histories, better allocation, or a new indirect/loop helper? Those are different silicon and different SPECint deltas."
		],
		example: "`if (a) …; if (b) …; if (a || b)` — the third test is a logical function of the first two. A local history of the third site cannot see `a` and `b`. A global/TAGE history can, which is why correlated branches are the textbook justification for global history.",
		whyItMatters: "Security mitigations (e.g. flushing or partitioning predictor state on domain switch) destroy exactly this long history. The performance cliff after a Spectre-era mitigation is often TAGE being reset, not the BTB being smaller.",
		quiz: [
			q("g1", "Local history fails when:", [
				"A branch is a loop",
				"This branch’s outcome depends on other recent branches",
				"The BTB hits",
				"The pipeline is short"
			], 1, "Local tables never see the other sites."),
			q("g2", "TAGE uses multiple geometric history lengths because:", [
				"Silicon cannot store one long history",
				"Useful correlation exists at several timescales at once",
				"Tags are illegal at short histories",
				"It predicts targets, not directions"
			], 1, "Loops, nested predicates, and parsers want different history depths."),
			q("g3", "Aliasing in a global predictor means:", [
				"Two branches share a counter and pollute each other’s state",
				"The BTB overflowed",
				"History is empty",
				"The RAS underflowed"
			], 0, "Same index, unrelated correlation.")
		]
	}),
	L({
		id: "cpu-ras-10",
		conceptId: "cpu-ras",
		title: "Return address stacks",
		durationMin: 10,
		effort: "deep",
		level: "journalist",
		prerequisites: ["cpu-branch-prediction"],
		explanation: [
			"Returns are indirect branches, but they are not random. A CALL pushes a return PC; the matching RET should pop it. A small hardware stack, the RAS, predicts returns with near-perfect accuracy as long as call depth stays within the stack and the compiler actually uses the calling convention.",
			"Overflow and underflow are the real bugs. Deep recursion, or a flood of calls from a trampoline, wraps the RAS and starts predicting stale addresses. Unbalanced CALL/RET pairs — tail-call tricks, hand-written asm, context switches — desynchronize it. Operating systems snapshot or flush the RAS on swap so one process does not gift another a predicted target.",
			"This is also a Spectre gadget. A poisoned RAS makes RET speculate to an attacker-chosen address. That is why you will see ‘RSB stuffing’ or ‘RSB flush on context switch’ in kernel changelogs. The performance cost is a burst of return mispredicts after the stuffing."
		],
		example: "A 16-entry RAS correctly predicts a well-nested call tree of depth 16. The 17th nested call overwrites the oldest entry. When you unwind past 16, the remaining returns predict whatever the overflow wrote — often a spectacular front-end flush.",
		whyItMatters: "If a chip review mentions ‘worse than expected on recursion-heavy code’ or a kernel mitigation ‘costs 2% on syscall-heavy workloads’, look at the RAS before you look at the ALU.",
		quiz: [
			q("r1", "The RAS predicts returns by:", [
				"Hashing global history",
				"Pushing the link address at CALL and popping at RET",
				"Storing one target per binary",
				"Asking the BTB only"
			], 1, "It exploits LIFO structure, not correlation."),
			q("r2", "RAS overflow happens when:", [
				"Call depth exceeds the hardware stack",
				"A branch is not taken",
				"L1 misses",
				"The ROB fills"
			], 0, "Extra CALLs overwrite older return PCs."),
			q("r3", "Kernels stuff or flush the RAS on context switch to:", [
				"Warm the cache",
				"Stop one task’s return predictions from steering another",
				"Clear the BTB tags",
				"Reset the clock"
			], 1, "Otherwise RET speculation becomes a cross-task gadget and a mispredict source.")
		]
	}),
	L({
		id: "cpu-rename-10",
		conceptId: "cpu-renaming",
		title: "Register renaming kills false dependencies",
		durationMin: 10,
		effort: "deep",
		level: "core",
		prerequisites: ["cpu-pipeline"],
		goDeeper: "cpu-rob",
		explanation: [
			"ISA registers are a small set of names (x86 has few; RISC-V has 32). Programs reuse them constantly. `r1 = a; use r1; r1 = b; use r1` looks like r1 is one location. The first and third writes are not a real data dependency — they just share a name. That is a WAW/WAR hazard, a *false* dependency.",
			"The renamer maps each write to a new physical register from a larger file. Readers of the old value keep the old physical. The ISA name becomes a pointer. True RAW dependencies remain; false ones disappear. Out-of-order issue can then run the second write while the first value is still in flight.",
			"When the physical file or the free list is exhausted, rename stalls even if ALUs are idle. That is a hidden capacity limit, and it is why microarchitectures advertise physical register file size next to ROB entries."
		],
		example: "Two independent `add` instructions that both dest `eax` on x86 can execute in parallel after rename, because they write p37 and p41. Without rename, the second add would wait for the first to retire, for no semantic reason.",
		whyItMatters: "Compiler register pressure and ISA width arguments are incomplete without the physical file. A ‘small ISA register set’ is not a death sentence if rename is wide; a huge ISA file still stalls if physicals run out.",
		quiz: [
			q("n1", "Renaming removes which dependencies?", [
				"True RAW data dependencies",
				"False WAW/WAR name dependencies",
				"Cache misses",
				"Control hazards"
			], 1, "It gives each write a fresh physical destination."),
			q("n2", "A rename stall with idle ALUs usually means:", [
				"The branch predictor failed",
				"The physical register file or free list is empty",
				"DRAM is offline",
				"The TLB hit"
			], 1, "No physical destination, no dispatch."),
			q("n3", "After rename, an ISA register name is best thought of as:", [
				"A physical location",
				"A pointer to the latest physical register for that name",
				"A cache tag",
				"A ROB index only"
			], 1, "The map table is the live translation.")
		]
	}),
	L({
		id: "cpu-rob-20",
		conceptId: "cpu-rob",
		title: "The reorder buffer is the commit covenant",
		durationMin: 20,
		effort: "deep",
		level: "journalist",
		prerequisites: ["cpu-renaming"],
		goDeeper: "cpu-coherency",
		explanation: [
			"Out-of-order execution finishes instructions whenever their inputs exist. Precise exceptions and a coherent architectural state still require *program order* at retirement. The reorder buffer is the queue that restores that order. An instruction is allocated in-order at the tail, executes whenever, and commits only when it reaches the head and has completed.",
			"On a mispredict or fault, everything younger than the offending instruction is discarded. Physical registers allocated for those ops return to the free list. Stores are not released to the coherent memory system until commit — they sit in a store buffer. That is how a faulting load does not leave a half-updated heap.",
			"ROB capacity is a window size. A 400-entry ROB can have 400 ops in flight, hiding tens of nanoseconds of miss if the compiler and predictor kept them independent. A full ROB blocks rename even if execution units are hungry. Reviews that only quote ‘width’ (6-wide decode) without window size are quoting the firehose, not the tank."
		],
		example: "A load misses, 80 independent adds follow it. They execute and sit in the ROB completed. The load finally returns, the load commits, then the adds drain at a rate limited by commit width. If an interrupt arrives before the load commits, those adds never happened architecturally.",
		whyItMatters: "When a vendor increases ROB from 256 to 512, they are buying miss tolerance, not peak FLOPs. That number is how you should read ‘better at high-latency code’ claims.",
		quiz: [
			q("o1", "Instructions enter the ROB:", [
				"Whenever they finish",
				"In program order, at allocate",
				"Only on a miss",
				"Only branches"
			], 1, "Allocate is in-order; execute is not."),
			q("o2", "Stores become globally visible:", [
				"At execute",
				"When they issue to the ALU",
				"At or after commit, via the store buffer",
				"At fetch"
			], 2, "Otherwise a squashed path would mutate memory."),
			q("o3", "A full ROB with idle ALUs means:", [
				"The window cannot accept more in-flight work, often because an old instruction has not committed",
				"There are no instructions in the program",
				"The predictor is perfect",
				"Caches are off"
			], 0, "The tank is full; the firehose has to wait.")
		]
	}),
	L({
		id: "cpu-mesi-20",
		conceptId: "cpu-coherency",
		title: "MESI, or how caches lie together",
		durationMin: 20,
		effort: "deep",
		level: "core",
		prerequisites: ["cpu-pipeline"],
		diagram: "mesi",
		explanation: [
			"Each core keeps a private cache for speed. Those copies must not disagree about the value of a line. Coherence protocols are the distributed algorithm that maintains a single-writer or multiple-reader invariant. MESI is the common vocabulary: Modified, Exclusive, Shared, Invalid.",
			"A read miss in Shared or Exclusive is cheap to satisfy. A write to a Shared line must invalidate every other copy first (or upgrade via a read-for-ownership). That round trip is why a ping-ponging atomic on one cache line destroys scaling. The line is not ‘slow’; the protocol is doing a distributed lock.",
			"MESI is about *coherence* (same address, same value, eventually). It is not *consistency* (when stores become visible relative to other addresses). x86’s TSO is a consistency model sitting on top of a coherent cache hierarchy. Confusing the two is how people misread Java memory model pieces and ARM weak-memory bugs."
		],
		example: "Two cores increment `counter++` on the same `int` without atomics. They can each hold the line in Modified at different times and drop updates. With a `lock add`, the RFO plus the lock prefix makes the read-modify-write one coherence transaction — slow, correct, and a scaling cliff.",
		whyItMatters: "Every ‘we sharded this counter’ or ‘false sharing’ performance note is a MESI story. If you write about multicore speedups without mentioning invalidation traffic, you are describing the wish, not the machine.",
		quiz: [
			q("c1", "A write to a line in Shared typically requires:", [
				"Nothing",
				"Invalidating or downgrading other copies (RFO)",
				"Flushing the ROB",
				"A disk sync"
			], 1, "Single-writer invariant."),
			q("c2", "False sharing is:", [
				"Two cores fighting over different variables on the same cache line",
				"A branch mispredict",
				"A TLB shootdown",
				"A RAID level"
			], 0, "The protocol cannot see your C fields, only 64-byte lines."),
			q("c3", "Coherence vs consistency:", [
				"They are synonyms",
				"Coherence is per-address agreement; consistency is ordering across addresses",
				"Consistency is only for disks",
				"MESI implements sequential consistency by itself"
			], 1, "MESI does not pick x86 TSO vs ARM.")
		]
	}),
	L({
		id: "semi-litho-5",
		conceptId: "semi-litho",
		title: "Lithography is a shadow play",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "semi-euv",
		diagram: "litho",
		explanation: ["A chip layer is a pattern of where material should stay or go. Photolithography paints that pattern by shining light through (or reflecting it off) a mask onto photoresist. The resist’s chemical solubility changes where light landed. Develop, then etch or deposit, then strip the resist. Repeat for each layer.", "Resolution is not ‘smaller light = smaller transistors’ as a slogan. The Rayleigh criterion, CD = k1 · λ / NA, is the working equation. Wavelength, numerical aperture, and process factor k1 are the three knobs. For two decades the industry rode wavelength (365 → 248 → 193 nm) and then immersion, then multiple patterning, because the next wavelength was late."],
		example: "193 nm immersion lithography with NA 1.35 and aggressive k1 can print features well below 40 nm — but only with tricks (off-axis illumination, OPC, multipatterning) that make the mask no longer look like the wafer.",
		whyItMatters: "Every foundry node slide is a lithography slide in costume. If you cannot name λ, NA, and k1, you will treat ‘3 nm’ as a length rather than a marketing bundle of tricks.",
		quiz: [
			q("l1", "In CD = k1 · λ / NA, shrinking λ:", [
				"Always raises depth of focus",
				"Improves resolution if other terms hold",
				"Removes the need for a mask",
				"Makes resist irrelevant"
			], 1, "Smaller wavelength, smaller printable pitch, other knobs fixed."),
			q("l2", "Photoresist’s role is to:", [
				"Be the metal of the transistor",
				"Record the optical image as a chemical solubility change",
				"Cool the wafer",
				"Replace the mask"
			], 1, "It is the recording medium."),
			q("l3", "Multiple patterning appeared because:", [
				"EUV was late and 193 nm had run out of cheap resolution",
				"Copper was too cheap",
				"Masks became free",
				"NA cannot exceed 0.1"
			], 0, "It splits one dense layer into several sparser exposures.")
		]
	}),
	L({
		id: "semi-euv-10",
		conceptId: "semi-euv",
		title: "EUV: 13.5 nm and no lenses",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["semi-litho"],
		goDeeper: "semi-na",
		diagram: "euv",
		explanation: [
			"Extreme ultraviolet lithography uses 13.5 nm light, produced by blasting tin droplets with a CO2 laser so they become a plasma that emits in that band. Almost everything absorbs EUV, including air. The entire optical path is vacuum. Refractive lenses are impossible; the tool is a chain of multilayer Bragg mirrors, each reflecting only a fraction of the light.",
			"The mask is reflective too — a patterned absorber on a multilayer mirror. There is no pellicle that is optically free; pellicles that do exist eat power and can wrinkle. Source power, mirror reflectivity, and resist dose fight each other: more photons cost more time or more laser; fewer photons cost stochastic defects.",
			"EUV did not make multipatterning vanish. It pushed the single-exposure limit down, then High-NA and more multipatterning arguments started again. Treat ‘EUV node’ as ‘this layer may be a single EUV exposure’ — not as a synonym for magic."
		],
		example: "A tin-droplet source firing 50,000 times a second, a collector mirror that degrades under tin debris, and a wafer that must still see enough photons per square nanometer of resist: that is the industrial object behind a sentence like ‘ASML shipped a High-NA tool’.",
		whyItMatters: "EUV availability, pellicle maturity, and source power are why a foundry’s leading node slips. Reporting that stops at ‘they use EUV now’ is stopping at the brochure.",
		quiz: [
			q("e1", "EUV tools use mirrors rather than lenses because:", [
				"Mirrors are cheaper",
				"13.5 nm is absorbed by all practical refractive materials",
				"Vacuum forbids glass for legal reasons",
				"Masks are transmissive"
			], 1, "There is no useful EUV glass."),
			q("e2", "The EUV light is generated by:", [
				"A mercury lamp",
				"Laser-produced tin plasma",
				"A synchrotron in every fab",
				"LEDs"
			], 1, "Tin droplets + CO2 laser is the HVM path."),
			q("e3", "Low photon count at the resist shows up as:", [
				"Higher NA",
				"Stochastic defects — missing contacts, broken lines",
				"Better overlay automatically",
				"Cheaper masks"
			], 1, "Shot noise becomes a yield term.")
		]
	}),
	L({
		id: "semi-na-20",
		conceptId: "semi-na",
		title: "High-NA EUV spends depth of focus",
		durationMin: 20,
		effort: "deep",
		level: "journalist",
		prerequisites: ["semi-euv"],
		goDeeper: "semi-overlay",
		explanation: [
			"Numerical aperture is n · sin(θ), the sine of the half-angle the optic can accept. Resolution scales as 1/NA. Depth of focus scales roughly as λ / NA². High-NA EUV (0.55 vs today’s 0.33) is therefore not a free lunch: you print tighter pitch and you get a thinner slice of acceptable focus.",
			"ASML’s High-NA machines use an anamorphic lens: different magnification in X and Y so the reflective mask can stay a manufacturable size. The scanner field shrinks. That means more stitched exposures per layer, which hands the problem to overlay. The tool also needs a tighter focus control loop and flatter wafers.",
			"When a briefing says High-NA ‘enables 2 nm’, they mean a specific pitch for a specific layer family, at a cost in field size, throughput, and process window. They do not mean every layer on the wafer is suddenly 0.55 NA."
		],
		example: "A contact layer that was two 0.33-NA EUV exposures may become one 0.55-NA exposure — cheaper in mask count, hungrier in focus budget. A metal layer that still fits 0.33 NA will stay there because High-NA time is the scarce resource.",
		whyItMatters: "The interesting High-NA questions are field stitching, resist thickness (thinner for focus, worse for etch budget), and which layers actually move. ‘They bought a High-NA tool’ is not a node.",
		quiz: [
			q("na1", "Raising NA improves resolution and:", [
				"Improves depth of focus",
				"Shrinks depth of focus roughly as 1/NA²",
				"Removes overlay error",
				"Makes vacuum unnecessary"
			], 1, "That is the trade the name hides."),
			q("na2", "Anamorphic High-NA optics exist to:", [
				"Add color",
				"Keep the mask a workable size while increasing NA",
				"Eliminate mirrors",
				"Cool the tin source"
			], 1, "X and Y magnifications differ."),
			q("na3", "A smaller scanner field implies:", [
				"Fewer wafers ever",
				"More exposure shots and a tighter overlay problem at stitch boundaries",
				"No need for focus control",
				"Cheaper resists automatically"
			], 1, "You tile the die with more fields.")
		]
	}),
	L({
		id: "semi-overlay-10",
		conceptId: "semi-overlay",
		title: "Overlay is a budget, not a slogan",
		durationMin: 10,
		effort: "deep",
		level: "journalist",
		prerequisites: ["semi-euv"],
		goDeeper: "semi-stochastics",
		explanation: [
			"Overlay is how well layer N sits on layer N−1. Contact over gate, via over metal, cut over fin. The error has systematic pieces (stage, lens distortion, mask writing, wafer warpage) and a random piece. Yield dies when the tail of that distribution eats the landing pad.",
			"You do not ‘have 2 nm overlay’. You have a 3σ number on a particular layer pair, after correction, on a particular scanner, on wafers that warped in the last anneal. Correction is a model: higher-order wafer alignment, per-exposure residuals, sometimes computational overlay using after-develop or after-etch metrology fed back to the scanner.",
			"High-NA’s smaller field and any multi-patterning scheme multiply the pairs you must control. A story about a node delay that mentions ‘process window’ and never mentions overlay is missing the usual villain."
		],
		example: "A via landing on a 20 nm-wide metal with 8 nm of overlay error on one side is no longer a via. It is an open or a merged neighbor. Designers fatten landing pads (via pillars, self-aligned vias) because they do not trust the tail.",
		whyItMatters: "This is how to read ‘yield ramp’. Not a mysterious curse — a stack of layer-pair distributions, some of which refuse to sit down.",
		quiz: [
			q("ov1", "Overlay measures:", [
				"Line-width roughness",
				"Layer-to-layer alignment",
				"Source power",
				"k1"
			], 1, "Did this layer land on the last one."),
			q("ov2", "A 3σ overlay spec is about:", [
				"The mean only",
				"The tail of the error distribution that eats yield",
				"Clock speed",
				"Mask cost"
			], 1, "Yield cares about the bad fields."),
			q("ov3", "Self-aligned vias exist because:", [
				"Metals cannot be etched",
				"Designers refuse to trust overlay tails on tiny landings",
				"EUV has no masks",
				"NA is infinite"
			], 1, "The process, not the designer, defines the edge.")
		]
	}),
	L({
		id: "semi-stoch-20",
		conceptId: "semi-stochastics",
		title: "Stochastics: when photons become dice",
		durationMin: 20,
		effort: "deep",
		level: "journalist",
		prerequisites: ["semi-euv"],
		explanation: [
			"At 13.5 nm each photon carries a lot of energy, so a given dose in mJ/cm² is fewer photons than at 193 nm. Resist features are now small enough that the count of photons (and of photoacid molecules they generate) in a contact hole is a small integer. Poisson noise on a small integer is a defect: a hole that does not open, a line that pinches.",
			"Dose goes up, noise goes down, throughput goes down. Resist sensitivity goes up, noise often goes up because you used fewer photons to generate the acids. That is the RLS triangle: resolution, line-edge roughness, sensitivity — pick two. New metal-oxide resists and underlayers are attempts to change the constant, not repeal Poisson.",
			"Inspection and stochastic-aware OPC try to find the layouts that amplify noise (tiny gaps, aggressive tips). A ‘random’ killer defect on an EUV layer is often a predictable consequence of a local photon budget."
		],
		example: "A 20 nm contact printed at a dose whose mean photon count in the hole is ~100 has a 1σ of 10%. The left tail does not clear the develop threshold. Multiply by a hundred billion contacts and you have a yield model, not bad luck.",
		whyItMatters: "When a foundry talks about EUV ‘defectivity’ without a particle story, they may mean stochastics. The lever is dose, resist, and layout — not a cleaner cleanroom.",
		quiz: [
			q("s1", "EUV stochastics are severe because:", [
				"Mirrors are crooked",
				"Feature volumes contain few photons/acids, so Poisson noise is a defect",
				"Vacuum fluctuates",
				"Tin is expensive"
			], 1, "Small counts, fat relative noise."),
			q("s2", "The RLS triangle says:", [
				"You can freely have resolution, smoothness, and sensitivity",
				"Pushing sensitivity (faster resist) often costs roughness or resolution",
				"Overlay is a resist property",
				"NA cancels Poisson"
			], 1, "Dose, size, and LER trade."),
			q("s3", "Raising dose to fight stochastics typically:", [
				"Speeds the scanner",
				"Slows throughput because the wafer must collect more photons",
				"Removes the need for OPC",
				"Lets you skip vacuum"
			], 1, "Photons per second are the scarce resource.")
		]
	})
];
var SYSTEMS_LESSONS = [
	L({
		id: "os-process-5",
		conceptId: "os-process",
		title: "A process is a lie you can kill",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "os-vm",
		explanation: ["A process is the kernel’s unit of isolation: an address space, a set of open handles, credentials, and one or more threads that actually run. A thread is a schedulable context — registers, stack, a program counter — sharing that address space with its siblings.", "The isolation is not a law of physics. It is a pile of hardware features (page tables, privilege rings, SMEP/SMAP) plus kernel bookkeeping. A kernel bug, a shared file, or an explicit mapping collapses it. Treating ‘process’ as a security boundary is a policy choice, not a guarantee."],
		example: "Chrome’s site isolation puts origins in different processes so a renderer RCE does not automatically read another tab’s cookies. That only works if the kernel’s address-space isolation holds and the IPC surface is narrower than the old in-process DOM.",
		whyItMatters: "Every sandbox story, container story, and ‘we forked for reliability’ story is a bet on this distinction. Threads share faults; processes share only what you pass.",
		quiz: [
			q("op1", "Threads in one process share:", [
				"Nothing",
				"The address space and handles, not their register state",
				"Only the program counter",
				"Only the kernel stack"
			], 1, "That is why a wild write in one thread corrupts another."),
			q("op2", "Process isolation ultimately rests on:", [
				"POSIX opinion",
				"Page tables and privileged hardware, plus kernel policy",
				"The C standard",
				"DNS"
			], 1, "Hardware plus software; neither alone."),
			q("op3", "A container is typically:", [
				"A new CPU mode",
				"A process (or tree) with restricted namespaces and cgroups",
				"A virtual machine always",
				"A thread with a color"
			], 1, "Same kernel, dressed-up isolation.")
		]
	}),
	L({
		id: "os-vm-10",
		conceptId: "os-vm",
		title: "Virtual memory is a translation cache problem",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["os-process"],
		goDeeper: "os-sched",
		explanation: [
			"Every user address is a name. The MMU walks page tables to turn it into a frame (or a fault). Multi-level tables exist so the mapping can be sparse: you do not store a row for every possible page. The TLB caches recent walks. A TLB miss is a walk; a walk miss is a page fault.",
			"A page fault is not always swapping. It is also first touch, copy-on-write after fork, memory-mapped file fill, guard pages, and soft faults that just install a mapping the kernel already knew. The interesting production number is often minor faults and TLB shootdowns, not disk.",
			"Large pages (2 MB / 1 GB) exist to make the TLB cover more memory with the same entries. They also create internal fragmentation and make the kernel’s compaction life worse. That trade is why databases beg for huge pages and why some runtimes refuse them."
		],
		example: "`fork()` marks pages copy-on-write. Parent and child share frames until a write. The first store faults, the kernel copies the page, and each side gets a private frame. That is why fork of a 40 GB process is cheap until someone writes.",
		whyItMatters: "Latency cliffs labelled ‘mysterious’ are often TLB or fault storms. If you cannot tell a TLB miss from a major fault, you will tune the wrong thing.",
		quiz: [
			q("vm1", "The TLB caches:", [
				"File contents",
				"Virtual-to-physical translations",
				"Branch targets",
				"Inodes"
			], 1, "It is a cache of page-table results."),
			q("vm2", "A page fault always means:", [
				"Disk I/O",
				"The MMU could not complete the translation and trapped to the kernel — reason varies",
				"The process dies",
				"The TLB is infinite"
			], 1, "Major, minor, COW, first-touch…"),
			q("vm3", "Huge pages help when:", [
				"The TLB is the limit and the working set is large and contiguous enough",
				"You want more faults",
				"Disk is fast",
				"You have one page of RAM"
			], 0, "Same TLB entries, more coverage.")
		]
	}),
	L({
		id: "os-sched-10",
		conceptId: "os-sched",
		title: "Schedulers trade fairness for latency",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["os-process"],
		explanation: [
			"A general-purpose scheduler decides which runnable thread owns a core next. Linux CFS (and EEVDF after it) tries to give each task a fair share of CPU, weighted by niceness, while keeping wakeup latency tolerable. It is not trying to meet a deadline. If you needed a deadline, you wanted a real-time class or a different OS.",
			"The visible knobs — nice, cgroup cpu.max, SCHED_FIFO — change who starves. They do not create cycles. A machine at 100% has already spent the resource; the scheduler only picks the victim. Latency-sensitive work (audio, UI, packet loops) dies when a batch job is equally nice and cache-hot.",
			"Migration and load balancing are the other half. A task bouncing across cores throws away its cache and its branch history. Pinning is sometimes the whole optimization."
		],
		example: "A 4-core laptop compiles (`-j8`) and plays audio. Without a reservation, the audio thread’s wakeups sit behind fat compiler tasks. PulseAudio crackles. `nice +10` on the compile, or a cgroup cap, is a political act about whose latency matters.",
		whyItMatters: "Cloud ‘noisy neighbor’ writing is scheduler plus cgroup plus cache. If the piece only mentions cores, it missed the policy layer.",
		quiz: [
			q("sc1", "CFS/EEVDF are designed to:", [
				"Meet hard deadlines",
				"Share CPU fairly among nice-weighted tasks",
				"Replace paging",
				"Pin every thread"
			], 1, "Fair share, not RT."),
			q("sc2", "At 100% utilization the scheduler:", [
				"Creates extra cycles",
				"Only chooses who waits",
				"Turns off caches",
				"Disables interrupts"
			], 1, "Policy, not supply."),
			q("sc3", "Cross-core migration is costly because:", [
				"PIDs change",
				"You lose warm caches and predictor state",
				"Virtual memory turns off",
				"Disk must remount"
			], 1, "The working set is not in the new private caches.")
		]
	}),
	L({
		id: "net-stack-5",
		conceptId: "net-stack",
		title: "Layers are contracts",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "net-congestion",
		explanation: ["The textbook OSI stack is a teaching aid. The running internet is closer to: link delivers frames on a local medium, IP delivers packets between hosts, UDP/TCP deliver datagrams or byte streams between ports, TLS authenticates and encrypts a stream, and the application lies about all of it.", "A layer is a promise about what the layer above does not have to know. IP does not promise order or reliability. TCP does, on top of IP, by inventing sequence numbers and retransmission. When people say ‘the network lost my message’, they usually mean a layer that never promised delivery."],
		example: "DNS over UDP can lose a query and the resolver just retries. HTTP/3 runs over QUIC, which reimplements reliability and congestion control on UDP because the middleboxes ossified TCP.",
		whyItMatters: "Debugging and regulation both fail when you blame the wrong layer. A TLS certificate error is not an IP routing error, and a BGP leak is not a CSS bug.",
		quiz: [
			q("ns1", "IP promises:", [
				"In-order reliable delivery",
				"Best-effort packet delivery between hosts",
				"Encrypted streams",
				"Exactly-once RPC"
			], 1, "Everything else is someone else’s job."),
			q("ns2", "TCP exists to:", [
				"Route between ASes",
				"Provide a reliable, ordered byte stream over unreliable IP",
				"Replace Ethernet",
				"Name hosts"
			], 1, "Sequence numbers, ACKs, retransmission."),
			q("ns3", "QUIC rides UDP mainly because:", [
				"UDP is faster in silicon always",
				"Middleboxes treat unknown TCP extensions badly; UDP is a freer user-space playground",
				"IP is deprecated",
				"TLS cannot run on TCP"
			], 1, "Ossification, plus handshake fusion.")
		]
	}),
	L({
		id: "net-cc-10",
		conceptId: "net-congestion",
		title: "Congestion control is a distributed argument",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["net-stack"],
		goDeeper: "net-bgp",
		explanation: [
			"A sender does not know the path capacity. It infers it from loss, delay, or explicit marks (ECN). Classic Reno treats loss as ‘slow down’. BBR treats rising delay and delivery rate as the signal and tries to sit at the pipe’s BDP. Both can be wrong: Wi-Fi loss is not always congestion; bufferbloat makes delay a lying signal.",
			"Fairness is emergent and fragile. Two flows sharing a bottleneck should each get about half if they use compatible rules. A more aggressive variant, or a UDP sender with no control, eats the rest. This is why ‘fairness’ in QUIC and in data-center transports (DCTCP, Swift) is a research object, not a moral property of packets.",
			"The buffer in the middle is part of the algorithm. An oversized buffer (bufferbloat) hides loss and stores delay. Your video call then ‘has latency’ that is actually a standing queue."
		],
		example: "A home router with 100 ms of standing queue makes every ACK late. Cubic TCP fills that buffer; latency-sensitive flows die. Cake/FQ-CoDel on the uplink often fixes ‘my internet is slow’ without buying bandwidth.",
		whyItMatters: "When a CDN or a mobile carrier changes default congestion control, they change how the internet feels. That is a protocol story, not a marketing speed-tier story.",
		quiz: [
			q("cc1", "Reno-style control treats packet loss as:", [
				"A routing change always",
				"A congestion signal to reduce window",
				"Proof the peer is down",
				"A TLS failure"
			], 1, "That assumption is the design."),
			q("cc2", "Bufferbloat is:", [
				"Too little RAM in a phone",
				"Excess queuing that turns a bottleneck into delay instead of honest loss/marks",
				"A BGP leak",
				"DNSSEC"
			], 1, "The buffer becomes the RTT."),
			q("cc3", "BBR’s distinctive idea is to:", [
				"Ignore delivery rate",
				"Use delay and observed bandwidth rather than loss alone",
				"Disable ACK clocks",
				"Replace IP"
			], 1, "Model the pipe, don’t wait for a drop.")
		]
	}),
	L({
		id: "net-bgp-20",
		conceptId: "net-bgp",
		title: "BGP is policy with a reachability rumor",
		durationMin: 20,
		effort: "deep",
		level: "journalist",
		prerequisites: ["net-stack"],
		explanation: [
			"BGP is how autonomous systems tell each other which prefixes they can reach. It is not a shortest-path protocol in the OSPF sense. A route is a prefix plus an AS path plus a pile of attributes. Operators apply policy: prefer this transit, never route that prefix to this peer, pad the path to be less attractive.",
			"The safety properties are weak. A more-specific prefix wins. A leak (announcing a route you should only have used for yourself) can pull traffic into a small network and blackhole it. RPKI can sign ‘this AS is allowed to originate this prefix’ — origin validation — but it does not, by itself, stop every path manipulation.",
			"When a newspaper says ‘the internet broke in country X’, ask: origin hijack, leak, cable cut, or DNS? Those have different actors and different fixes. Only some of them are BGP."
		],
		example: "In 2008, Pakistan Telecom advertised a more-specific YouTube prefix to stop local access. The route escaped to peers. YouTube died globally for the more-specific. That is longest-match plus transitive trust, not a hacker in a hoodie.",
		whyItMatters: "Geopolitics, outages, and ‘why is this CDN slow from here’ are often path-selection stories. If you cannot say prefix, AS path, and more-specific, you will copy the press release.",
		quiz: [
			q("bg1", "A more-specific prefix wins because:", [
				"BGP prefers longer AS paths",
				"Forwarding uses longest-prefix match",
				"RPKI forbids aggregates",
				"TCP retransmits it"
			], 1, "Routing table lookup, not politics."),
			q("bg2", "A route leak is typically:", [
				"A physical cable cut",
				"Announcing a route beyond the intended policy boundary",
				"A TLS downgrade",
				"An MTU blackhole only"
			], 1, "Policy failure, often accidental."),
			q("bg3", "RPKI origin validation tells you:", [
				"The entire AS path is honest",
				"The originating AS is authorized for the prefix",
				"The cable is intact",
				"Latency will be low"
			], 1, "Origin, not path.")
		]
	}),
	L({
		id: "cmp-front-5",
		conceptId: "cmp-front",
		title: "Lex, parse, then stop guessing",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "cmp-ssa",
		explanation: ["A compiler front end turns bytes into a tree. The lexer groups characters into tokens (identifiers, numbers, `if`). The parser checks whether that token stream belongs to the language and builds a syntax tree. Name resolution and type checking then hang meaning on the tree.", "These stages exist so later passes do not argue about spelling. Once you have an AST (or a HIR), an optimizer can treat `x + 1` as a node, not as three characters. Error quality lives here: a parser that resynchronizes after a missing semicolon is a product feature, not a CS footnote."],
		example: "`if x = 1` in a language that uses `==` for comparison fails at parse or type-check depending on whether assignment is an expression. The diagnostic is the compiler’s entire user interface for that moment.",
		whyItMatters: "‘The compiler is slow’ is often ‘the front end parsed the world because of header graphs or monomorphization’, not ‘LLVM is thinking hard’. Know which end you are blaming.",
		quiz: [
			q("cf1", "The lexer’s output is:", [
				"Machine code",
				"A token stream",
				"A register assignment",
				"A binary image"
			], 1, "Words, not meanings."),
			q("cf2", "Type checking usually runs:", [
				"Before lexing",
				"After a tree exists, on names that have been resolved",
				"In the linker",
				"In the TLB"
			], 1, "You need a structure to check."),
			q("cf3", "An AST exists so that:", [
				"The CPU can fetch faster",
				"Later passes operate on meaning, not characters",
				"Disk stays warm",
				"BGP can route types"
			], 1, "A stable IR for the rest of the pipe.")
		]
	}),
	L({
		id: "cmp-ssa-10",
		conceptId: "cmp-ssa",
		title: "SSA: every name is written once",
		durationMin: 10,
		effort: "deep",
		level: "core",
		prerequisites: ["cmp-front"],
		goDeeper: "cmp-alloc",
		explanation: [
			"Static single assignment form gives each assignment a fresh name: `x1 = …; x2 = …`. At control-flow joins, a φ-function picks which name arrives: `x3 = φ(x1, x2)`. The point is not the Greek letter. The point is that def-use chains become explicit, so constant propagation, dead code, and GVN are graph walks instead of iterative dataflow soup.",
			"Mem2reg promotes stack slots to SSA values when the compiler can prove they do not escape. That one pass is why `-O1` sometimes looks like a different language. What remains in memory is what had to: address taken, volatile, atomic, interprocedural mystery.",
			"SSA is not assembly. You still have to leave it — destroy φs, assign registers, emit moves on edges. People who paste LLVM IR into a discussion and call it ‘what the CPU does’ are one lowering late."
		],
		example: "`x = 1; if (c) x = 2; return x;` becomes `x1 = 1; x2 = 2; x3 = φ(x1, x2); return x3`. A later pass that knows `c` is true rewrites the φ to `x2` and deletes `x1`.",
		whyItMatters: "Modern optimizer talk (LLVM, GCC, cranelift, MLIR) is SSA talk. If you cannot read a φ, you cannot read a missed-optimization bug.",
		quiz: [
			q("ss1", "A φ-node exists to:", [
				"Call a function named phi",
				"Merge different SSA names of one variable at a join",
				"Allocate a register",
				"Parse tokens"
			], 1, "Joins need an explicit choice."),
			q("ss2", "mem2reg is powerful because:", [
				"It deletes the stack",
				"It turns eligible memory slots into SSA values the rest of the optimizer can see",
				"It writes object files",
				"It predicts branches"
			], 1, "Values beat loads."),
			q("ss3", "SSA must be destroyed before emit because:", [
				"CPUs do not have φ instructions or infinite names",
				"Linkers forbid it",
				"φ is patented",
				"ELF cannot store graphs"
			], 0, "Lower to moves and real registers.")
		]
	}),
	L({
		id: "cmp-alloc-20",
		conceptId: "cmp-alloc",
		title: "Register allocation is a packing problem with a gun",
		durationMin: 20,
		effort: "deep",
		level: "journalist",
		prerequisites: ["cmp-ssa"],
		explanation: [
			"You have more live values than architectural registers. Allocation assigns values to registers or spills them to the stack. The classic model is interference: two values that are live at the same time cannot share a register. That is graph coloring, approximately, except the graph changes when you spill (you insert loads and stores, which create new short live ranges).",
			"Linear-scan allocators trade optimality for compile time and are why JIT compile times stay tolerable. On a static compiler, a graph-coloring or PBQP allocator plus careful live-range splitting is often worth it. Calling convention constraints (arguments in fixed regs, callee-saved vs caller-saved) are precoloring: some nodes already have a crayon.",
			"A ‘bad codegen’ report that shows a storm of stack traffic on a hot loop is frequently register pressure, not a missing peephole. Inlining, vectorization, and scalar evolution can raise pressure until the allocator gives up. That is a global budget, not a local insult."
		],
		example: "Unrolling a 4-wide float loop 8 times can create 32 live accumulators. x86-64 has 16 XMM/YMM names in the ABI-visible set (more with AVX-512). The allocator spills. The unroll that ‘should be faster’ is now bound on stack bandwidth.",
		whyItMatters: "This is how to read compiler release notes about ‘better allocation on AArch64’ and why a microbenchmark lied after you added one more temporary.",
		quiz: [
			q("ra1", "Two SSA values interfere when:", [
				"They have the same type",
				"Their live ranges overlap",
				"They are constants",
				"They are in different functions"
			], 1, "They would clobber each other in one register."),
			q("ra2", "A spill is:", [
				"Deleting the value",
				"Holding the value in memory for a while because no register is free",
				"Inlining",
				"A linker error"
			], 1, "Reload later."),
			q("ra3", "Precoloring models:", [
				"Comments in the AST",
				"ABI constraints that pin some values to specific registers",
				"Cache colors",
				"MESI states"
			], 1, "Arguments, return regs, callee-saved.")
		]
	})
];
var SCIENCE_LESSONS = [
	L({
		id: "ml-gd-5",
		conceptId: "ml-gd",
		title: "Gradient descent is walking downhill in the dark",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "ml-backprop",
		diagram: "gd",
		explanation: ["A model is a function with knobs (parameters). A loss is a number that says how wrong the function is on some data. The gradient of the loss with respect to the knobs is the direction of steepest increase. Descend by stepping the other way.", "You almost never use the true gradient on the whole dataset. Minibatches give a noisy estimate that is cheaper and, usefully, noisier — the noise helps escape sharp bad holes. The step size (learning rate) is the whole game: too big and you diverge; too small and you waste the afternoon."],
		example: "Fit `y ≈ wx` on pairs (x, y). Loss = average (wx − y)². The gradient ∂L/∂w is an average of 2x(wx − y). One step: w ← w − η times that. After enough passes, w is the least-squares slope — if η behaved.",
		whyItMatters: "Every training graph you see in a paper is this loop. When someone says a model ‘learned’, they mean this number went down in a way that also went down on data the optimizer had not used to step.",
		quiz: [
			q("gd1", "The gradient points:", [
				"Toward lower loss",
				"Toward steeper increase of the loss",
				"At the nearest integer",
				"At the test set"
			], 1, "You step opposite it."),
			q("gd2", "Minibatches are used because:", [
				"Full-batch is always more generalizable",
				"They are cheaper and the noise can help",
				"Gradients do not exist otherwise",
				"GPUs cannot add"
			], 1, "Cost and implicit regularization."),
			q("gd3", "A learning rate that is too large typically:", [
				"Guarantees the global minimum",
				"Makes the loss explode or oscillate",
				"Removes the need for data",
				"Computes the Hessian"
			], 1, "You overshoot the bowl.")
		]
	}),
	L({
		id: "ml-bp-10",
		conceptId: "ml-backprop",
		title: "Backprop is reverse-mode autodiff",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["ml-gd"],
		goDeeper: "ml-attention",
		explanation: [
			"A neural net is a composition of simple ops. The chain rule says the derivative of the composition is a product of local Jacobians. Forward-mode autodiff pushes a derivative along with each value — cheap when you have one input and many outputs. Reverse-mode (backprop) seeds the loss with dL/dL = 1 and pushes adjoints backward — cheap when you have many inputs (parameters) and one output (the loss).",
			"That is why we backprop. Not because of a special neural-net theorem. Because parameter count ≫ 1. Frameworks build a graph (or a tape) of the forward ops and then walk it in reverse, applying each op’s vector-Jacobian product.",
			"The practical failures are not mystical: vanishing/exploding products through deep multiplies, disconnected graphs when someone called `.detach()` or used a non-differentiable index, and kernels whose VJP was never written."
		],
		example: "`y = ReLU(Wx)`. Forward: multiply, then zero the negatives. Backward: dL/dW = (dL/dy, masked by the ReLU gate) · xᵀ. The mask is the local Jacobian of ReLU. No finite differences required.",
		whyItMatters: "If you cannot see backprop as bookkeeping for the chain rule, you will treat training bugs as folklore. Most of them are a broken tape.",
		quiz: [
			q("bp1", "Reverse-mode autodiff is preferred in deep learning because:", [
				"There is one loss and millions of parameters",
				"There is one parameter and millions of losses",
				"GPUs cannot multiply",
				"The chain rule fails forward"
			], 0, "One output, many inputs."),
			q("bp2", "A vector-Jacobian product is:", [
				"A full Jacobian matrix always materialized",
				"The local backward of an op, applied to incoming adjoints",
				"A learning rate",
				"A type of attention"
			], 1, "You never need the whole Jacobian."),
			q("bp3", "`.detach()` / `stop_gradient` breaks training because:", [
				"It deletes the weights",
				"It cuts the tape, so adjoints do not flow",
				"It changes the optimizer",
				"It turns off the GPU"
			], 1, "No path, no gradient.")
		]
	}),
	L({
		id: "ml-attn-20",
		conceptId: "ml-attention",
		title: "Attention is a soft lookup",
		durationMin: 20,
		effort: "deep",
		level: "journalist",
		prerequisites: ["ml-backprop"],
		diagram: "attention",
		explanation: [
			"For each query vector q, attention scores every key kᵢ with a dot product (usually scaled by 1/√d), softmaxes those scores, and uses them to mix the values vᵢ. It is a content-addressable read: ‘find things like this, average them.’ Multi-head just does that in several learned projections so different heads can specialize.",
			"Self-attention sets Q, K, V as projections of the same token sequence. That gives you pairwise mixing at every layer, which is why a transformer can move information across a sentence in one layer — and why compute is O(n²) in sequence length for the naive algorithm. The last three years of ‘efficient attention’ papers are almost all about not paying n², or paying it in SRAM with tiling (FlashAttention).",
			"Causal masks zero out future keys so a language model cannot read the answer while writing the question. That mask, not the softmax, is the autoregressive contract. KV cache exists because for generation the keys and values of past tokens do not change; you should not recompute them."
		],
		example: "In ‘The trophy does not fit in the suitcase because it is too big’, a head on ‘it’ can put mass on ‘trophy’ rather than ‘suitcase’. Nothing in the mechanism knows linguistics; training found a key/query geometry that makes that mix useful for next-token loss.",
		whyItMatters: "Context-window marketing, MoE routing, and inference-price wars all reduce to: how many tokens do you score, where do you store KV, and how tiled is the matmul. ‘The model understands’ is not a mechanism.",
		quiz: [
			q("at1", "Softmax(QKᵀ/√d) V is:", [
				"A convolution",
				"A weighted average of values, weights from query-key similarity",
				"A hash table with hard addressing",
				"Gradient descent"
			], 1, "Soft lookup."),
			q("at2", "Naive self-attention is O(n²) because:", [
				"Softmax is quadratic in d",
				"Every query scores every key",
				"The vocabulary is n²",
				"Layers are squared"
			], 1, "All pairs."),
			q("at3", "A KV cache is valid at generate time because:", [
				"Queries never change",
				"Past keys/values do not depend on future tokens under a causal mask",
				"Attention is not differentiable",
				"Batch size is 1 always"
			], 1, "You append, you do not recompute history.")
		]
	}),
	L({
		id: "ast-hr-5",
		conceptId: "ast-hr",
		title: "The HR diagram is a census, not a map of space",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "ast-exo",
		explanation: ["Plot stellar luminosity against surface temperature (or color, or spectral type) and stars do not sprinkle at random. They sit on a main sequence, a red-giant branch, a white-dwarf cooling track. The diagram is a snapshot of many lives at once, like a city census that happens to reveal age.", "The main sequence is hydrogen fusion in the core. Mass sets the spot: massive stars are hot and bright and brief; M dwarfs are dim and almost immortal. Giants are what you get when the core is no longer that hydrogen engine and the envelope puffs. White dwarfs are leftover cores, cooling."],
		example: "A cluster’s HR diagram has a main-sequence turnoff. Stars above that mass have already left. The turnoff mass is a clock for the cluster’s age — one of the cleaner clocks we have.",
		whyItMatters: "When a headline says astronomers ‘weighed’ or ‘aged’ a star, they usually put it on this diagram (plus spectroscopy) and compared it to models. The diagram is the argument.",
		quiz: [
			q("hr1", "The main sequence is where stars are:", [
				"Dying",
				"Fusing hydrogen in the core",
				"Only made of iron",
				"Planets"
			], 1, "That is the long middle of a star’s life."),
			q("hr2", "A cluster turnoff ages the cluster because:", [
				"All stars form at different times always",
				"Higher-mass stars leave the main sequence first",
				"White dwarfs cannot be dated",
				"Color is random"
			], 1, "Mass–lifetime relation."),
			q("hr3", "The HR diagram’s axes are:", [
				"Distance vs RA",
				"Luminosity vs temperature (or a proxy)",
				"Mass vs orbital period",
				"Redshift vs time"
			], 1, "A census of state, not position.")
		]
	}),
	L({
		id: "ast-exo-10",
		conceptId: "ast-exo",
		title: "How we know a planet is there",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["ast-hr"],
		explanation: [
			"Transit: the planet crosses the star and the star gets slightly fainter. You learn radius (from depth) and period (from repetition), not mass. Radial velocity: the star wobbles; the spectrum’s lines shift. You learn a mass function (m sin i) and period, not radius. Together they give density. Alone they lie by omission.",
			"Each method has a selection function. Transits love close-in planets on edge-on orbits. RV loves massive, close planets around quiet stars. Direct imaging loves wide, young, self-luminous giants. Microlensing loves a one-time alignment toward the bulge. A catalog is not a population until you invert those biases.",
			"False positives are the job. Eclipsing binaries, starspots, and blended background stars fake transits. Activity fakes RV. The honest papers are about vetting, not discovery selfies."
		],
		example: "A 1% dip every 3.5 days on a Sun-like star is a roughly Jupiter-radius object close in — a ‘hot Jupiter’ — or a smaller star blended in the pixel. Without a mass, or a high-resolution spectrum, you do not yet have a planet.",
		whyItMatters: "‘Earth-like’ in a press release often means ‘rocky-sized on a period we can detect’, not ‘habitable’. The method’s selection function wrote that sentence.",
		quiz: [
			q("ex1", "A transit depth primarily constrains:", [
				"Mass",
				"Radius ratio of planet to star",
				"Atmosphere always",
				"Age"
			], 1, "Blocked light ≈ area ratio."),
			q("ex2", "RV alone gives:", [
				"True mass always",
				"m sin i, missing the inclination",
				"Radius",
				"Albedo"
			], 1, "You see the line-of-sight wobble."),
			q("ex3", "Why catalogs are not populations:", [
				"Planets do not exist",
				"Each method sees a biased slice of period/mass/inclination",
				"Stars have no planets",
				"Kepler failed"
			], 1, "Invert the selection function or stay quiet.")
		]
	}),
	L({
		id: "bio-sel-5",
		conceptId: "bio-selection",
		title: "Selection is accounting, not a ladder",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "bio-evodevo",
		explanation: ["Natural selection requires variation, heritability, and differential reproductive success. That is the whole machine. It does not require progress, consciousness, or a goal. A trait spreads if its bearers leave more copies, in that environment, period.", "Fitness is not ‘stronger’. A smaller body that breeds earlier can beat a larger one. Drift can fix a worse allele in a small population. Adaptation is an outcome you have to argue for, not a default explanation for every trait."],
		example: "Sickle-cell allele persists in malaria regions because heterozygotes out-reproduce both homozygotes there. In a malaria-free environment the accounting flips. Same allele, different ledger.",
		whyItMatters: "Almost every popular evolution sentence that uses ‘so that’ is smuggling purpose. The mechanism does not have purposes. It has rates.",
		quiz: [
			q("bs1", "Selection requires:", [
				"A plan",
				"Variation, heritability, differential success",
				"Only mutation",
				"Only time"
			], 1, "Three ingredients."),
			q("bs2", "Fitness in this sense is:", [
				"Gym strength",
				"Relative reproductive success",
				"IQ",
				"Lifespan alone"
			], 1, "Copies in the next generation."),
			q("bs3", "Drift matters most when:", [
				"Populations are huge and selection is strong",
				"Populations are small, so chance fixes alleles",
				"There is no DNA",
				"Selection is infinite"
			], 1, "Sampling error on allele frequencies.")
		]
	}),
	L({
		id: "bio-evo-10",
		conceptId: "bio-evodevo",
		title: "Evo-devo: reuse the toolkit",
		durationMin: 10,
		effort: "deep",
		level: "core",
		prerequisites: ["bio-selection"],
		explanation: [
			"Animals that look nothing alike share a developmental toolkit — Hox genes, signaling pathways (Wnt, Hedgehog, BMP) — reused in new places and times. Large morphological change does not always need new proteins. It often needs a cis-regulatory tweak: express the same gene two hours later, or in a different stripe.",
			"That is why ‘irreducible’ anatomy is the wrong bet. Eyes, limbs, and segments are deep homologies plus a lot of local tinkering. The fossil record’s apparent jumps are sometimes the visible part of a regulatory change that was genetically small.",
			"The caution: homology of genes is not homology of organs. Pax6 is involved in eyes across phyla; that does not mean a fly eye and a vertebrate eye are the same organ. It means development is conservative in its parts list and creative in its recipes."
		],
		example: "A snake’s lack of limbs is not a missing limb genome. Limb-bud signaling is altered — Shh expression in the zone of polarizing activity fails to sustain a bud. The toolkit is there; the switch is not thrown.",
		whyItMatters: "This is the reply to both ‘evolution cannot make new body plans’ and naive just-so stories. The substrate is regulatory. The accounting is still selection.",
		quiz: [
			q("ed1", "A cis-regulatory change typically:", [
				"Invent a new amino-acid alphabet",
				"Alters when/where an existing gene is expressed",
				"Deletes selection",
				"Creates DNA from RNA only"
			], 1, "Same protein, different map."),
			q("ed2", "Hox genes are famous because:", [
				"They encode muscles",
				"They pattern the anterior–posterior axis and are deeply conserved",
				"They are only in plants",
				"They replace mutation"
			], 1, "Toolkit, not trivia."),
			q("ed3", "Shared toolkit genes imply:", [
				"Identical organs",
				"A conserved parts list that can be redeployed",
				"No convergent evolution",
				"That fossils are wrong"
			], 1, "Recipes diverge; ingredients rhyme.")
		]
	}),
	L({
		id: "stat-bias-5",
		conceptId: "stat-bias",
		title: "The sample is the result",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "stat-pvalue",
		explanation: ["Statistics does not rescue a sample that is the wrong population. If you survey people who answer the phone at 2 pm, you have learned about people who answer the phone at 2 pm. Estimators have bias (they miss on average) and variance (they jump around). A huge biased sample is a confident wrong answer.", "Selection into the data is often the phenomenon. Hospital studies see sick people. Crash studies see crashed cars. GitHub studies see public repos. Ask ‘who is missing?’ before you ask ‘what is the p-value?’"],
		example: "WWII survivorship bias: armor the planes where the returning ones were hit, and you armor the places that were not fatal. The missing data — the planes that did not return — were the signal.",
		whyItMatters: "Most viral charts are sampling stories in costume. The honest first sentence is who is in the denominator.",
		quiz: [
			q("sb1", "A large biased sample typically:", [
				"Cancels the bias",
				"Gives a precise estimate of the wrong thing",
				"Becomes a census",
				"Has no variance"
			], 1, "n kills variance, not bias."),
			q("sb2", "Survivorship bias means:", [
				"You only see the units that made it into the sample, and that filter is the effect",
				"Everyone survives",
				"Variance is zero",
				"The mean is the median"
			], 0, "The missing are the data."),
			q("sb3", "Before a p-value you should ask:", [
				"Who is in the sample, and who cannot be",
				"Whether the chart is 3D",
				"The brand of software",
				"If n > 30 as a ritual"
			], 0, "Design beats ritual.")
		]
	}),
	L({
		id: "stat-p-10",
		conceptId: "stat-pvalue",
		title: "A p-value is not the chance you are right",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["stat-bias"],
		goDeeper: "stat-bayes",
		explanation: [
			"A p-value is P(data this extreme or more | the null model is true). It is not P(null is true | data). It is not the false-discovery rate. It is not effect size. A tiny p with a tiny effect in a huge sample is a precise irrelevance.",
			"The null is a model, including all the sampling assumptions. If those are false, the number is theater. Multiple comparisons manufacture small p’s; preregistration and holding out a confirmation set are boring because they work.",
			"Confidence intervals (or better: compatibility intervals) at least show a range of effects still on speaking terms with the data. Reporting only p < 0.05 is discarding the interesting bit: how large, and how sensitive."
		],
		example: "A drug trial, n = 80,000, finds a 0.1 mmHg blood-pressure drop, p = 0.01. The null of exactly zero is probably false. Nobody should change practice. The interval tells you the effect is real and useless.",
		whyItMatters: "This is the entire replication crisis in one confusion. If you write about a paper, and you only carry the p, you did not carry the claim.",
		quiz: [
			q("pv1", "p = 0.03 means:", [
				"The hypothesis is 97% true",
				"Under the null model, data this extreme would happen about 3% of the time",
				"There is a 3% chance of a mistake",
				"The effect is large"
			], 1, "Tail probability under a model."),
			q("pv2", "A tiny p with a tiny effect usually means:", [
				"Importance",
				"A large sample rejected a sharp null of no difference",
				"Fraud always",
				"The interval is infinite"
			], 1, "Distinguish detection from mattering."),
			q("pv3", "p-hacking is dangerous because:", [
				"It makes n smaller",
				"The nominal tail probability assumes a single pre-specified test",
				"It raises bias in the Gauss-Markov sense always",
				"It deletes outliers ethically"
			], 1, "The denominator of ‘this extreme’ changed.")
		]
	}),
	L({
		id: "stat-bayes-20",
		conceptId: "stat-bayes",
		title: "Base rates do not care about your likelihood",
		durationMin: 20,
		effort: "deep",
		level: "journalist",
		prerequisites: ["stat-pvalue"],
		explanation: [
			"Bayes: posterior odds = prior odds × likelihood ratio. A very surprising result under the null (small p, large LR) does not make a rare claim probable unless the prior was not tiny. Medical testing is the clean version: a 99% specific test for a 0.1% disease still yields mostly false positives.",
			"In scientific literature the prior is the base rate of true hypotheses in the pile you chose to test. A field that tests 100 long shots a year will fill journals with ‘significant’ noise even with honest p < 0.05. That is Ioannidis as arithmetic, not cynicism.",
			"A useful Bayesian writeup is often just: here is a skeptical prior, here is the likelihood, here is how much you would have to already believe. You do not need a full MCMC to refuse a miracle."
		],
		example: "A mammogram 90% sensitive, 91% specific, disease base rate 1%. A positive result is still only about a 9% chance of cancer. The arithmetic is a 2×2 table. The intuition is not.",
		whyItMatters: "This is how to read a diagnostic, a polygraph, a ‘AI detector’, and a surprising social-science finding. Ask for the base rate or refuse the posterior.",
		quiz: [
			q("by1", "Posterior odds equal:", [
				"The p-value",
				"Prior odds times the likelihood ratio",
				"1 minus specificity",
				"The sample size"
			], 1, "That is the theorem."),
			q("by2", "A highly specific test for a very rare disease still yields many false positives because:", [
				"Sensitivity is 0",
				"The negative class is huge, so even a small false-positive rate outnumbers the true cases",
				"Bayes fails",
				"Hospitals round wrong"
			], 1, "Base rate dominates."),
			q("by3", "In a field of long-shot hypotheses, p < 0.05 results are often wrong because:", [
				"Frequentism is false",
				"The prior odds on any given hypothesis are poor, so most ‘hits’ are noise",
				"Journals dislike Bayes",
				"n is always 10"
			], 1, "Selection plus weak priors.")
		]
	})
];
var CULTURE_LESSONS = [
	L({
		id: "econ-ca-5",
		conceptId: "econ-ca",
		title: "Comparative advantage is opportunity cost",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "econ-money",
		explanation: ["You have a comparative advantage in the task where your opportunity cost is lower, not where you are absolutely faster. A surgeon who types 120 wpm should still hire a typist if an hour of surgery is worth more than an hour of typing. The typist can be worse at both and the trade still raises joint output.", "Ricardo’s wine-and-cloth story is this arithmetic with countries as the agents. It is not a claim that trade is kind, that adjustment is free, or that distribution inside a country is fair. Those are separate arguments people smuggle into the same sentence."],
		example: "England produces cloth at a lower opportunity cost in wine than Portugal does, even if Portugal is better at both. Specialize, trade, both consume more. The laid-off English vintner is a distributional fact the theorem does not erase.",
		whyItMatters: "Trade pieces that argue from ‘we can make it here’ are arguing absolute advantage. That is the wrong inequality. The right one is what you give up.",
		quiz: [
			q("ca1", "Comparative advantage is about:", [
				"Who is best in absolute terms",
				"Who has the lower opportunity cost",
				"Who has more capital always",
				"Who has a navy"
			], 1, "Relative cost, not trophies."),
			q("ca2", "A person worse at every task:", [
				"Cannot gain from trade",
				"Can still have a comparative advantage in something",
				"Has infinite opportunity cost",
				"Must be the surgeon"
			], 1, "The inequality can flip."),
			q("ca3", "Ricardo’s theorem is silent on:", [
				"Gains in joint output from specialization",
				"How those gains are shared, and the cost of adjustment",
				"Opportunity cost",
				"Two-good examples"
			], 1, "Efficiency ≠ equity.")
		]
	}),
	L({
		id: "econ-money-10",
		conceptId: "econ-money",
		title: "Monetary policy is a transmission, not a lever",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["econ-ca"],
		goDeeper: "hist-nixon",
		explanation: [
			"A central bank’s policy rate is the price of reserves (or the target it defends). It is not the mortgage rate, the corporate bond yield, or ‘the amount of money’. Those move if and when the rest of the system transmits: banks, Treasuries, risk premia, the exchange rate, and expectations of the future path of the rate — not just today’s print.",
			"The textbook IS-LM lever is a cartoon of this. In a floor system the bank sets administered rates and the quantity of reserves can be large without forcing the rate to zero. QE is then about duration and spreads, not about ‘printing for inflation’ as a one-line mechanism. Inflation is a path of demand, supply, and expectations; the rate path is one input.",
			"When a reporter writes ‘the Fed raised rates to fight inflation’, the unfinished sentence is ‘and it expects this to slow interest-sensitive spending and cool the labor market with a lag of months’. Without the lag and the channel, the sentence is a totem."
		],
		example: "2022–23: policy rates jumped; housing and venture felt it fast; many service prices lagged. The same lever, different elasticities. A single CPI print is not the transmission.",
		whyItMatters: "This is how to read a central-bank decision without copying the adjective in the headline (‘hawkish surprise’). Name the channel or you are narrating vibes.",
		quiz: [
			q("mp1", "The policy rate is closest to:", [
				"The CPI",
				"The rate the central bank sets or defends in the market for reserves",
				"The average mortgage",
				"M2"
			], 1, "A specific price, not ‘money’."),
			q("mp2", "Transmission means:", [
				"The rate change instantly sets all prices",
				"How that rate filters into other yields, credit, FX, and spending — with lags",
				"Printing banknotes",
				"Fiscal policy"
			], 1, "A chain, not a wand."),
			q("mp3", "In a floor system, abundant reserves:", [
				"Must force the policy rate to zero",
				"Need not; administered rates can hold the floor",
				"Abolish inflation",
				"Replace the Treasury"
			], 1, "Quantity and rate are less glued than the cartoon.")
		]
	}),
	L({
		id: "horo-esc-5",
		conceptId: "horo-escape",
		title: "An escapement counts a spring",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "horo-tourbillon",
		diagram: "escapement",
		explanation: ["A mainspring wants to unwind in one rush. The escapement lets it go in ticks. A pallet fork locks and unlocks a toothed escape wheel in time with the oscillator (balance wheel and hairspring, or a pendulum). Each unlock gives the oscillator a little push — the impulse — so friction does not kill the swing.", "Timekeeping lives in the oscillator’s period, not in the gear train. The train just counts. If the impulse or the lock disturbs the period in a state-dependent way, the watch gains or loses with position, amplitude, and temperature."],
		example: "The Swiss lever escapement: two pallet jewels take turns locking the escape wheel. The impulse face gives the balance a kick through the roller jewel. You can hear this as the tick. You can see it as the seconds hand stepping.",
		whyItMatters: "Every ‘mechanical vs quartz’ piece that stops at ‘gears’ has missed the object. The fight is how cleanly you count a resonator.",
		quiz: [
			q("he1", "The escapement’s job is to:", [
				"Store energy for a week",
				"Release the train in ticks and impulse the oscillator",
				"Display the moon",
				"Magnetize the hairspring"
			], 1, "Count and sustain."),
			q("he2", "The time base is:", [
				"The mainspring barrel",
				"The oscillator’s period",
				"The number of jewels",
				"The case metal"
			], 1, "The train is a counter."),
			q("he3", "A state-dependent impulse error shows up as:", [
				"Better waterproofing",
				"Rate that changes with position or amplitude",
				"A louder rotor",
				"Thinner oil always helping"
			], 1, "Disturb the period, disturb the day.")
		]
	}),
	L({
		id: "horo-tour-10",
		conceptId: "horo-tourbillon",
		title: "The tourbillon averages a mistake",
		durationMin: 10,
		effort: "deep",
		level: "core",
		prerequisites: ["horo-escape"],
		explanation: [
			"A pocket watch sits vertical in a vest. Gravity then biases the oscillator differently depending on which way ‘up’ is relative to the balance. Breguet’s tourbillon puts the escapement and balance in a rotating cage so that positional error is averaged around the clock — literally.",
			"On a modern wristwatch that already changes position every few minutes, the averaging argument is weaker. What remains is a demonstration of finishing, inertia management, and sometimes a residual benefit if the cage period is well chosen. Claiming a tourbillon as automatically more accurate than a well-regulated fixed escapement is a sales sentence.",
			"Complications that actually attack rate today are more often: better hairspring alloys (temperature and magnetism), free-sprung balances, silicon parts, and regulation against a timing machine in six positions. The rotating cage is the poetry."
		],
		example: "A 60-second tourbillon rotates the cage once a minute. A +8 s/d error at crown-left and a −8 s/d error at crown-right can cancel in the mean. A +8 s/d in every vertical position will not.",
		whyItMatters: "This is how to write about haute horology without being the press office. Name the error it averages. If you cannot, it is decoration.",
		quiz: [
			q("ht1", "A tourbillon was invented to:", [
				"Increase power reserve magically",
				"Average gravitational positional errors of a mostly-vertical watch",
				"Replace the hairspring",
				"Tell solar time"
			], 1, "Pocket-watch gravity."),
			q("ht2", "On the wrist the classic argument weakens because:", [
				"Gravity turns off",
				"The watch already changes orientation often",
				"Springs have no rate",
				"Cages cannot rotate"
			], 1, "You are already averaging."),
			q("ht3", "A tourbillon cannot cancel:", [
				"Errors that change sign with position",
				"Errors that have the same sign in all positions",
				"The need for oil",
				"The existence of a balance"
			], 1, "The mean of +8 and +8 is +8.")
		]
	}),
	L({
		id: "aud-freq-5",
		conceptId: "aud-freq",
		title: "Frequency response is a filter’s autobiography",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "aud-comp",
		diagram: "freq",
		explanation: ["A system’s frequency response says, for a sine at frequency f, how much the amplitude (and phase) changes. Speakers, rooms, mics, cables, and EQ are all filters. A ‘flat’ response means unity gain across the band you care about, not a moral virtue — a translation you can then choose to color.", "Decibels are ratios. +6 dB is about a doubling of voltage/amplitude; +10 dB is roughly twice as loud to a human, sometimes. Phase is not optional: two drivers that are 180° apart at a crossover will notch. A magnitude plot without phase is half a story."],
		example: "A cheap Bluetooth speaker with a 6 dB hump at 80 Hz and a hole at 3 kHz sounds ‘bassy’ and ‘dull’. EQ can fake the hole; it cannot invent excursion the driver does not have. The response told you the truth first.",
		whyItMatters: "Every review that uses ‘warm’ or ‘harsh’ is attempting to name a frequency response plus distortion. Ask for the curve.",
		quiz: [
			q("af1", "Frequency response plots:", [
				"Only THD",
				"Gain (and ideally phase) versus frequency",
				"The lyrics",
				"Bit depth"
			], 1, "What the filter does to sines."),
			q("af2", "+6 dB in voltage terms is about:", [
				"Half",
				"A doubling of amplitude",
				"Silence",
				"10× power exactly always"
			], 1, "20 log10(2) ≈ 6 dB."),
			q("af3", "A 180° phase flip at a crossover often:", [
				"Doubles bass usefully",
				"Cancels that band — a notch",
				"Removes the need for a cabinet",
				"Is inaudible by theorem"
			], 1, "Out of polarity.")
		]
	}),
	L({
		id: "aud-comp-10",
		conceptId: "aud-comp",
		title: "Compression is gain that depends on yesterday",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["aud-freq"],
		explanation: [
			"A compressor reduces gain when the input exceeds a threshold, by a ratio. 4:1 means that above the threshold, 4 dB in becomes 1 dB out (in the gain-reduction story). Attack is how fast reduction arrives; release is how fast it leaves. Those times are the sound: they decide whether you hear a transient or a pump.",
			"This is not ‘making it louder’. Makeup gain does that after. Compression changes the envelope. Sidechains let a kick duck a bass. Limiters are extreme ratios with fast attack, used as a ceiling. Loudness wars were limiters plus a cultural preference for dense RMS.",
			"The mistake is treating the meter as the mix. Gain reduction of 1–3 dB on a vocal with a musically chosen release is a stabilizer. 12 dB on a whole mix with a 10 ms release is a new instrument, usually an ugly one."
		],
		example: "A vocal with 12 dB crests above the verse. Threshold just under those crests, 3:1, 10 ms attack (keep consonants), 80 ms release (breathe with the phrase). The verse and chorus sit in the same fader throw.",
		whyItMatters: "If you write about loudness, streaming normalization, or ‘that record punches’, you are writing about envelopes and meters (LUFS), not about a magic plugin.",
		quiz: [
			q("ac1", "Ratio 4:1 above threshold means:", [
				"The signal is gated off",
				"Excess is compressed so 4 dB in above threshold becomes ~1 dB out",
				"Pitch drops by 4",
				"Stereo becomes mono"
			], 1, "Slope of the transfer."),
			q("ac2", "Attack time controls:", [
				"EQ slope",
				"How quickly gain reduction arrives after a peak",
				"Sample rate",
				"Polarity"
			], 1, "Transients live here."),
			q("ac3", "A limiter is:", [
				"An expander",
				"A compressor with a very high ratio used as a ceiling",
				"A reverb",
				"A microphone"
			], 1, "Brickwall-ish.")
		]
	}),
	L({
		id: "mus-int-5",
		conceptId: "mus-interval",
		title: "Intervals are ratios you can hear beating",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "mus-modes",
		explanation: ["An interval is a frequency ratio. An octave is 2:1 — the same pitch class, a doubling. A just fifth is 3:2. When two tones are near a simple ratio, their partials lock and beating slows. When they are not, you hear roughness. Equal temperament lies a little on every interval except the octave so that you can play in every key.", "Consonance is not a moral category. It is a mixture of that acoustic roughness, familiarity, and the music’s own grammar. A minor second is a grind in a hymn and a color in a riff."],
		example: "Tune two guitar strings to a fifth by killing the beat: 3:2. Then play a barre chord in equal temperament and the third will beat a little. The guitar is a compromise you have already accepted.",
		whyItMatters: "This is the physical layer under ‘it sounds dark’ or ‘that chorus lifts’. Lift is often a fifth or a register change, not a feeling that arrived from nowhere.",
		quiz: [
			q("mi1", "A just fifth is the ratio:", [
				"2:1",
				"3:2",
				"5:4",
				"16:15"
			], 1, "The next simple integer after the octave."),
			q("mi2", "Equal temperament exists to:", [
				"Make every interval just",
				"Split the octave into equal steps so all keys are usable, at a cost in justness",
				"Remove beats from unisons only",
				"Replace rhythm"
			], 1, "A political acoustic choice."),
			q("mi3", "Beating between two close partials is:", [
				"Proof of MIDI",
				"An audible amplitude oscillation from interference",
				"A compression setting",
				"Silence"
			], 1, "You can tune by it.")
		]
	}),
	L({
		id: "mus-modes-10",
		conceptId: "mus-modes",
		title: "A mode is a tonic, not a scale shape",
		durationMin: 10,
		effort: "normal",
		level: "core",
		prerequisites: ["mus-interval"],
		explanation: [
			"Dorian, Phrygian, Mixolydian — these are not just ‘the white keys starting on D’. A mode is a hierarchy: which pitch is home, which degrees are stable, which want to move. The same pitch set with a different tonic is a different gravity well.",
			"In metal and modal jazz this matters because riffs often refuse functional V–I. A Phrygian riff with a flattened second sits on E and treats F as a neighbor, not as a key-of-C leftover. If you analyze it as C major you will invent cadences that are not there.",
			"Changing mode without changing tonic (parallel) is a color shift: C Ionian to C minor. Changing tonic without changing pitch set (relative) is a re-centering: C Ionian to A Aeolian. Those are different moves and they feel different."
		],
		example: "Sabbath’s E-minor pentatonic riffs plus a ♭2 visit is already leaning Phrygian. The home chord is still E5. Calling it ‘in G’ because the notes fit G major is a category error.",
		whyItMatters: "If you want to talk about why a riff feels Arabic, folk, or ‘open’, name the tonic and the characteristic degree. Otherwise you are listing notes.",
		quiz: [
			q("mm1", "Two modes sharing a pitch set differ by:", [
				"Tempo",
				"Which pitch is treated as tonic",
				"Time signature",
				"Instrumentation"
			], 1, "Gravity, not inventory."),
			q("mm2", "A characteristic Phrygian color is:", [
				"A raised 4th only",
				"A flattened 2nd against the tonic",
				"A major 7 always",
				"No fifth"
			], 1, "The ♭2 neighbor."),
			q("mm3", "Parallel major→minor keeps:", [
				"The tonic, changes the third (and more)",
				"The pitch set, changes nothing",
				"Only the tempo",
				"The lyric"
			], 0, "Same home, new color.")
		]
	}),
	L({
		id: "dm-blast-5",
		conceptId: "dm-blast",
		title: "The blast beat is a grammar",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "dm-harmony",
		explanation: ["A blast beat is a high-speed interlocking of kick, snare, and often ride/cymbal such that the ear hears a continuous roll instead of a backbeat. Common forms: traditional (kick and snare alternating), bomb blast (doubled kick under snare), and euro/hammer blast. The point is density and the removal of the rock ‘2 and 4’ as the only accent.", "It is not ‘playing fast’. It is a texture that lets guitars hold tremolo figures without a swinging drum arguing. Death metal’s shift from thrash’s mid-tempo d-beat to this texture is a formal change, not just BPM."],
		example: "Early Napalm Death and then the Florida tapes (and later Morbid Angel live) turned the blast from a hardcore burst into a section type you could write in — verse blast, half-time drop, blast again.",
		whyItMatters: "If you describe death metal as ‘noise’ you have not heard the grid. The blast is a grid. You can transcribe it.",
		quiz: [
			q("db1", "A blast beat typically:", [
				"Keeps a lazy backbeat at 80 BPM",
				"Stacks kick/snare/cymbal into a continuous high-speed texture",
				"Removes the kick drum",
				"Is only ride cymbal jazz"
			], 1, "Density as form."),
			q("db2", "Compared to thrash’s d-beat, blast sections:", [
				"Are slower always",
				"Replace the rock accent pattern with a roll-like grid",
				"Require a saxophone",
				"Forbid kick drums"
			], 1, "A different grammar."),
			q("db3", "A bomb blast usually means:", [
				"No snare",
				"Snare on the pulse with doubled kick underneath",
				"Only toms",
				"A studio explosion sample"
			], 1, "One common taxonomy.")
		]
	}),
	L({
		id: "dm-harm-10",
		conceptId: "dm-harmony",
		title: "Death-metal harmony is cells, not songs",
		durationMin: 10,
		effort: "deep",
		level: "core",
		prerequisites: ["dm-blast"],
		goDeeper: "dm-history",
		explanation: [
			"A lot of death metal is built from short chromatic or diminished cells that get sequenced, inverted, and planed (moved in parallel). Tritone and minor-second relations do the tension that functional dominant chords do in common-practice music. Tremolo picking is articulation, not harmony — but it lets those cells stay in the air long enough to register.",
			"Riff-as-form: sections are defined by a guitar figure, not by a chord chart. The drum grammar (blast, d-beat, half-time) is a second formal axis. Vocals are often a rhythmic layer, not a melody with a hook. Analyzing this with pop verse/chorus first will fail you; start with the cell and the drum texture.",
			"Swedish (Stockholm) and Florida traditions also differ in production harmony: the Stockholm buzzsaw (HM-2, mid-scooped wall) stacks thirds into a smear; Florida recordings often leave more pick attack and separated rhythm. Same cells, different spectra."
		],
		example: "A two-bar chromatic descent on the low string, sequenced up a minor third, over a blast; then the same cell in half-time with a ride. That is a section pair. No chorus required.",
		whyItMatters: "This is how to write about the music as composed, not as a lifestyle appendix. Name the cell and the drum change.",
		quiz: [
			q("dh1", "Planing in this context is:", [
				"A woodworking term only",
				"Moving a voicing or cell in parallel without functional voice-leading",
				"Tuning down",
				"A mix bus"
			], 1, "Parallel motion as color."),
			q("dh2", "A useful first analysis step is:", [
				"Find the V–I",
				"Identify the riff cell and the drum texture",
				"Ignore the guitars",
				"Count the logo spikes"
			], 1, "Form lives there."),
			q("dh3", "HM-2 ‘buzzsaw’ tone is mainly:", [
				"A harmony theory",
				"A spectral/production choice that smears stacked midrange",
				"A drum technique",
				"A tempo"
			], 1, "It changes how cells fuse.")
		]
	}),
	L({
		id: "dm-hist-10",
		conceptId: "dm-history",
		title: "Florida and Stockholm were two factories",
		durationMin: 10,
		effort: "normal",
		level: "intro",
		prerequisites: [],
		goDeeper: "dm-harmony",
		explanation: [
			"By the late 1980s two scenes independently finished the move out of thrash. In Florida (Tampa, Morrisound, Death, Morbid Angel, Obituary, Deicide) the doctrine was precision, palm-muted rhythm, and a dry, articulate recording of fast right hands. In Stockholm (Nihilist → Entombed, Dismember, Grave; Sunlight Studio) the doctrine was the HM-2 wall, mid-paced crush, and a wetter, dirtier spectrum.",
			"Neither scene is a purity test. They borrowed riffs, shared tape-trading, and later mixed. But if you cannot hear Morrisound versus Sunlight you will treat ‘old-school death metal’ as one object, which it was not. The later technical and dissonant turns (Gorguts, Immolation, Ulcerate) are a third factory.",
			"Genre history here is production history as much as personnel history. The desk and the pedal are part of the composition."
		],
		example: "Play Obituary’s *Cause of Death* into Entombed’s *Left Hand Path*. Same decade, same ancestor (Slayer/Celtic Frost/hardcore), two different answers about what a rhythm guitar is for.",
		whyItMatters: "Scene names in metal writing are often fashion. These two names are also engineering decisions you can point at.",
		quiz: [
			q("di1", "Morrisound’s Florida reputation is tied to:", [
				"HM-2 walls",
				"A drier, more articulate death-metal documentation",
				"Black-metal church burnings",
				"Only slam"
			], 1, "Precision as aesthetic."),
			q("di2", "Sunlight / Stockholm is associated with:", [
				"The HM-2 buzzsaw midrange wall",
				"Jazz fusion drums only",
				"No kick drum",
				"Tape-trading’s end"
			], 0, "A spectrum, not just a city."),
			q("di3", "Treating OSDM as one object fails because:", [
				"There was only one band",
				"Production and riff doctrine split at least two ways early",
				"Nobody recorded",
				"Death metal started in 2010"
			], 1, "Two factories, one name.")
		]
	}),
	L({
		id: "hist-method-5",
		conceptId: "hist-method",
		title: "A source is not a fact",
		durationMin: 5,
		effort: "light",
		level: "intro",
		prerequisites: [],
		goDeeper: "hist-nixon",
		explanation: ["Historians argue from remnants: documents, objects, numbers, later testimonies. A source has a maker, a purpose, and a silence. The job is not to collect quotes. It is to say what the remnant can support and what it cannot. Chronicle (‘this happened then’) is not yet causation (‘this happened because’).", "Primary versus secondary is a relationship to the question, not a halo. A 1971 newspaper is primary for public rhetoric in 1971 and secondary for what the Fed staff believed in the room. Footnotes are the experiment log."],
		example: "A presidential speech announcing a policy is excellent evidence of the claim the government wanted heard. It is poor evidence of the policy’s effects. Those need different remnants: prices, cables, later archives.",
		whyItMatters: "Most viral history is a quote treated as a verdict. If you cannot name what the source is for, you are reading, not arguing.",
		quiz: [
			q("hm1", "A primary source is defined by:", [
				"Being old",
				"Its relationship to the question you are asking",
				"Being official",
				"Being a book"
			], 1, "Function, not age."),
			q("hm2", "Chronicle differs from causal history in that:", [
				"Chronicle orders events; causation claims a mechanism",
				"Chronicle is always false",
				"Causation needs no sources",
				"Only kings have causes"
			], 0, "Because is a higher claim."),
			q("hm3", "A public speech is usually strongest as evidence of:", [
				"Private belief of every official",
				"The message offered to an audience at that moment",
				"Long-run economic effects",
				"Secret cables"
			], 1, "It is a performance with an aim.")
		]
	}),
	L({
		id: "hist-nixon-10",
		conceptId: "hist-nixon",
		title: "The Nixon shock was a regime change",
		durationMin: 10,
		effort: "deep",
		level: "journalist",
		prerequisites: ["hist-method"],
		explanation: [
			"On 15 August 1971 Nixon closed the gold window: the US would no longer convert foreign official dollars into gold at $35/oz. That ended the Bretton Woods promise that the dollar was a gold-anchored key currency and that other parities hung off it. The same package included a 90-day wage-price freeze and a 10% import surcharge — so it was also a political act about inflation and elections, not a seminar.",
			"The deeper bind: US deficits (Vietnam, Great Society) had produced more dollars abroad than gold at $35 could cover. Triffin’s dilemma was no longer theoretical. Surplus countries (notably France) had been asking for metal. Closing the window defaulted on a convertibility pledge to protect the remaining stock and US policy space.",
			"What followed was not instant ‘free floating forever’ as a plan. The Smithsonian attempt (December 1971) tried new parities. Those failed. By 1973 major currencies were floating. The world you write about when you write about FX reserves, petrodollars, and independent inflation policy is the one that this break made possible — not inevitable in every detail, but possible."
		],
		example: "A 1971 reader of the speech heard ‘jobs, not gold’. A French official heard a default. A later textbook heard ‘the start of fiat’. All three readings need different sources. None is the whole remnant.",
		whyItMatters: "Every piece that treats floating FX, modern reserve-currency politics, or 1970s inflation as weather should have to pass through this weekend. It was a choice under constraint.",
		quiz: [
			q("hn1", "Closing the gold window meant:", [
				"The US minted more coins",
				"Foreign official dollars were no longer convertible into US gold at the fixed price",
				"Bretton Woods was strengthened",
				"Wages were indexed to gold"
			], 1, "A convertibility default."),
			q("hn2", "Triffin’s dilemma here is that:", [
				"A key-currency country supplies the world with its money only by running external deficits that eventually undermine convertibility",
				"Gold has no industrial use",
				"Inflation is always monetary",
				"France had no gold"
			], 0, "Liquidity versus confidence."),
			q("hn3", "Smithsonian (1971) was:", [
				"The final float",
				"An attempt to restore a system of parities that then failed",
				"A trade treaty with Japan only",
				"The founding of the ECB"
			], 1, "A last fixed try.")
		]
	})
];
var LONGFORM_LESSONS = [L({
	id: "cpu-window-30",
	conceptId: "cpu-rob",
	title: "The instruction window as an economy",
	durationMin: 30,
	effort: "deep",
	level: "journalist",
	prerequisites: ["cpu-renaming"],
	explanation: [
		"A modern core is not ‘faster clocks’ and not even ‘wider issue’ in isolation. It is a window: how many not-yet-retired instructions can sit in flight while the machine waits on a miss, a mispredict, or a long divider. The window is the product of several finite tables that must all have a free slot: ROB, physical registers, scheduler entries, load/store queue, fetch buffer. The first one that fills is the real width that day.",
		"This is why two chips with the same advertised 6-wide decode can feel different on a browser versus a GEMM. The browser is front-end and predictor bound; the GEMM is backend and cache bound. A larger ROB without a larger physical file just moves the stall. Vendor slides that quote one number are choosing which bottleneck to brag about.",
		"Spectre-era mitigations, SMT, and security domains tax the same tables. An RSB stuff is a burst of fake calls that occupy predictor state. An IBPB is a flush of useful history. SMT doubles the customers of one ROB and one file. When a review says ‘security tax’, try to name the table that got smaller in practice.",
		"For reporting: ask which structure grew, on which workload class, and whether the compiler or the runtime was assumed. A 512-entry ROB is a miss-tolerance story. A 20% larger BTB is a frontend-in-the-interpreter story. They are not interchangeable adjectives."
	],
	example: "A load misses 80 ns. At 4 GHz that is 320 cycles. A 4-wide machine that can keep 320 independent ops in flight can hide the miss; one that fills a 192-entry ROB at cycle 50 sits idle for the rest. The SPECint delta from ‘bigger window’ is this arithmetic on the misses that actually happen.",
	whyItMatters: "This is the single model that lets you read a microarchitecture launch without being towed by the slide. Name the scarce table.",
	quiz: [
		q("w1", "The effective window is limited by:", [
			"Clock only",
			"The first structure to fill among ROB, PRF, scheduler, LSQs…",
			"ISA register count alone",
			"The number of sold chips"
		], 1, "Min of the capacities, not the brochure max."),
		q("w2", "A bigger ROB without a bigger PRF often:", [
			"Always doubles IPC",
			"Moves the stall from allocate-at-ROB to rename",
			"Removes caches",
			"Fixes mispredicts"
		], 1, "You still need destinations."),
		q("w3", "SMT typically:", [
			"Duplicates every table perfectly",
			"Shares many of those tables, so one thread can starve the window of the other",
			"Turns off the predictor",
			"Makes ROB infinite"
		], 1, "More customers, same tank.")
	]
}), L({
	id: "semi-stack-30",
	conceptId: "semi-stochastics",
	title: "How an EUV layer actually fails",
	durationMin: 30,
	effort: "deep",
	level: "journalist",
	prerequisites: ["semi-euv"],
	explanation: [
		"A failing EUV layer is rarely ‘the tool is down’. It is a budget that went negative: photons, focus, overlay, resist thickness, etch bias. Stochastics open a contact. Overlay puts a via off the metal. High-NA’s thin process window puts a die’s edge out of focus. The same wafer can show all three, and the weekly yield meeting will argue about which histogram to believe.",
		"Metrology is part of the process, not an afterthought. Overlay residuals from the previous lot retune the scanner. After-develop inspection catches some stochastic killers; after-etch inspection catches the ones the etch amplified. A ‘random defect’ that clusters on a particular layout pattern is not random — it is a hotspot the OPC model missed.",
		"This is also a supply-chain story. Pellicle transmittance eats dose. Mask 3D effects at EUV angles distort the image so the mask shop and the OPC team are one team whether the org chart agrees. Tin debris on the collector is a scheduled degradation, not an accident. When a foundry slips a node, read the sentence after ‘EUV’ — it is usually one of these nouns.",
		"Journalist depth here means: do not explain what a transistor is. Explain which budget blew and who owns the knob. That is the actual news."
	],
	example: "A via chain fails at 0.1% on a die. Split lot: higher EUV dose cuts opens (stochastics) but drops WPH. A different split with a fatter via landing (design rule) cuts opens without dose. The cheaper fix was the landing pad, not the tool.",
	whyItMatters: "Node-delay journalism that stops at ‘EUV is hard’ is interchangeable with last year’s piece. The piece worth writing names the budget.",
	quiz: [
		q("sk1", "A layout-clustered ‘random’ defect is often:", [
			"Cosmic rays",
			"A hotspot — OPC or process-window failure at a local pattern",
			"A software license",
			"Tin futures"
		], 1, "Geometry amplified the noise."),
		q("sk2", "Pellicles affect stochastics because:", [
			"They add photons",
			"They eat transmission, so dose at the wafer drops unless you slow down",
			"They flatten wafers",
			"They set NA"
		], 1, "Fewer photons, fatter Poisson."),
		q("sk3", "The cheaper yield fix is sometimes:", [
			"Always a new scanner",
			"A design-rule or landing-pad change rather than more dose",
			"Turning off overlay",
			"Skipping etch"
		], 1, "Who owns the knob.")
	]
})];
var externalFiles = /* #__PURE__ */ Object.assign({ "../external/example-euv-resist.json": example_euv_resist_default });
function loadExternal() {
	const out = [];
	for (const [path, raw] of Object.entries(externalFiles)) {
		const parsed = lessonFileSchema.safeParse(raw);
		if (!parsed.success) {
			console.warn(`[dau] skipped ${path}:`, parsed.error.issues[0]?.message);
			continue;
		}
		try {
			out.push(normalizeLesson(parsed.data, "imported"));
		} catch (err) {
			console.warn(`[dau] skipped ${path}:`, err);
		}
	}
	return out;
}
var LESSONS = [
	...CPU_SEMI_LESSONS,
	...SYSTEMS_LESSONS,
	...SCIENCE_LESSONS,
	...CULTURE_LESSONS,
	...LONGFORM_LESSONS,
	...loadExternal()
];
new Map(LESSONS.map((l) => [l.id, l]));
function buildCatalog(seededCategories, seededConcepts, seededLessons, customCategories = [], customConcepts = [], customLessons = []) {
	const categories = mergeById(seededCategories, customCategories);
	const concepts = mergeById(seededConcepts, customConcepts);
	const overlay = new Map(customLessons.filter((l) => !l.archived).map((l) => [l.id, l]));
	const lessons = [];
	const seen = /* @__PURE__ */ new Set();
	for (const raw of seededLessons) {
		const custom = overlay.get(raw.id);
		const base = custom ? overlayLesson(raw, custom) : normalizeSeed(raw);
		lessons.push(applyActiveVersion(base));
		seen.add(raw.id);
	}
	for (const custom of customLessons) {
		if (custom.archived || seen.has(custom.id)) continue;
		lessons.push(applyActiveVersion(normalizeLesson(custom, custom.source?.type ?? "human")));
		seen.add(custom.id);
	}
	return {
		categories,
		concepts,
		lessons,
		categoryMap: Object.fromEntries(categories.map((c) => [c.id, c])),
		conceptMap: Object.fromEntries(concepts.map((c) => [c.id, c])),
		lessonMap: Object.fromEntries(lessons.map((l) => [l.id, l]))
	};
}
function normalizeSeed(lesson) {
	try {
		return normalizeLesson(lesson, lesson.source?.type ?? "seed");
	} catch {
		return lesson;
	}
}
function overlayLesson(seed, custom) {
	return {
		...normalizeSeed(seed),
		...normalizeLesson(custom, custom.source?.type ?? seed.source?.type ?? "human"),
		id: seed.id,
		versions: custom.versions ?? seed.versions,
		feedback: custom.feedback ?? seed.feedback
	};
}
function mergeById(seeded, custom) {
	const map = /* @__PURE__ */ new Map();
	for (const item of seeded) map.set(item.id, item);
	for (const item of custom) map.set(item.id, {
		...map.get(item.id),
		...item
	});
	return [...map.values()];
}
function lessonsForConceptFrom(catalog, conceptId) {
	return catalog.lessons.filter((l) => l.conceptId === conceptId);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "topic";
}
function makeId(prefix, name) {
	const rand = Math.random().toString(36).slice(2, 7);
	return `${prefix}-${slugify(name)}-${rand}`;
}
function useCatalog() {
	const customCategories = useProgress((s) => s.customCategories);
	const customConcepts = useProgress((s) => s.customConcepts);
	const customLessons = useProgress((s) => s.customLessons);
	return (0, import_react.useMemo)(() => buildCatalog(CATEGORIES, CONCEPTS, LESSONS, customCategories, customConcepts, customLessons), [
		customCategories,
		customConcepts,
		customLessons
	]);
}
//#endregion
export { generatedLessonSchema as a, generationsToday as c, makeId as d, normalizeLesson as f, generatedExplainSchema as i, isDue as l, useProgress as m, buildExport as n, generatedPathSchema as o, useCatalog as p, daysUntil as r, generatedQuizSchema as s, PROMPT_VERSION as t, lessonsForConceptFrom as u };
