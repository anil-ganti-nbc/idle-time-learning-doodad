import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as generatedLessonSchema, c as generationsToday, d as makeId, f as normalizeLesson, i as generatedExplainSchema, m as useProgress, o as generatedPathSchema, p as useCatalog, s as generatedQuizSchema, t as PROMPT_VERSION } from "./use-catalog-Be-DbnEV.mjs";
import { r as estimateTokens } from "./providers-DJN-C4ZR.mjs";
import { n as loadSecrets, r as runAiCompletion } from "./secrets-BUFL4Lsv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-ai-ColkSuBf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function findCachedLesson(lessons, conceptId, durationMin, effort, promptVersion) {
	return lessons.find((l) => l.conceptId === conceptId && l.durationMin === durationMin && l.effort === effort && l.source.type === "ai" && (l.source.promptVersion ?? promptVersion) === promptVersion);
}
function assertAiAllowed(settings, generatedToday, sessionCount) {
	if (!settings.enabled || settings.policy === "off") return {
		ok: false,
		error: "AI is disabled. Turn it on in Settings if you want generated units."
	};
	if (generatedToday >= settings.maxPerDay) return {
		ok: false,
		error: `Daily generation cap reached (${settings.maxPerDay}).`
	};
	if (sessionCount >= settings.maxPerSession) return {
		ok: false,
		error: `This gap already used ${settings.maxPerSession} generations.`
	};
	return { ok: true };
}
function assertMissingOnly(policy, hasLocalMatch) {
	if (policy === "missing-only" && hasLocalMatch) return {
		ok: false,
		error: "A local unit already fits. Generation is limited to missing lessons."
	};
	return { ok: true };
}
function extractJson(text) {
	const trimmed = text.trim();
	const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
	const candidate = fenced ? fenced[1].trim() : trimmed;
	const start = candidate.indexOf("{");
	const end = candidate.lastIndexOf("}");
	if (start === -1 || end === -1 || end <= start) return {
		ok: false,
		error: "Model did not return a JSON object."
	};
	try {
		return {
			ok: true,
			value: JSON.parse(candidate.slice(start, end + 1))
		};
	} catch {
		return {
			ok: false,
			error: "Model returned invalid JSON."
		};
	}
}
function parseGeneratedLesson(raw) {
	const parsed = generatedLessonSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		error: "Generated lesson failed schema validation.",
		issues: parsed.error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
	};
	if (raw && typeof raw === "object") {
		const obj = raw;
		if ("mastery" in obj || "progress" in obj || "ease" in obj) return {
			ok: false,
			error: "Generated lesson tried to write mastery state and was rejected."
		};
	}
	return {
		ok: true,
		value: parsed.data
	};
}
function parseGeneratedExplain(raw) {
	const parsed = generatedExplainSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		error: "Explanation rewrite failed schema validation.",
		issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
	};
	return {
		ok: true,
		value: parsed.data
	};
}
function parseGeneratedQuiz(raw) {
	const parsed = generatedQuizSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		error: "Quiz generation failed schema validation.",
		issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
	};
	return {
		ok: true,
		value: parsed.data
	};
}
function parseGeneratedPath(raw) {
	const parsed = generatedPathSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		error: "Learning path failed schema validation.",
		issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
	};
	return {
		ok: true,
		value: parsed.data
	};
}
function lessonFromGenerated(data, meta) {
	const explanation = Array.isArray(data.explanation) ? data.explanation : [data.explanation];
	return normalizeLesson({
		schemaVersion: 1,
		id: meta.id ?? makeId("ai", data.title),
		conceptId: meta.conceptId,
		title: data.title,
		durationMin: data.estimated_minutes,
		effort: data.effort,
		level: data.level ?? meta.level,
		prerequisites: data.prerequisites,
		goDeeper: data.go_deeper?.[0],
		source: meta.provenance,
		explanation,
		example: data.example,
		whyItMatters: data.why_it_matters,
		diagram: data.diagram ?? void 0,
		quiz: data.quiz,
		custom: true,
		createdAt: meta.provenance.generatedAt,
		updatedAt: meta.provenance.generatedAt
	}, "ai");
}
function pathConceptsFromGenerated(data, categoryId) {
	const ids = new Set(data.concepts.map((c) => c.id));
	return data.concepts.map((c) => ({
		id: c.id,
		name: c.name,
		category: categoryId,
		parentId: c.parentId && ids.has(c.parentId) ? c.parentId : void 0,
		prerequisites: c.prerequisites.filter((id) => ids.has(id)),
		level: c.level,
		summary: c.summary,
		custom: true
	}));
}
function defaultAiProvenance(input) {
	return {
		type: "ai",
		provider: input.provider,
		model: input.model,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		promptVersion: PROMPT_VERSION,
		schemaVersion: 1,
		sourceExcerpt: input.sourceExcerpt,
		links: input.links
	};
}
var SCHEMA_HINT = `Return ONLY a JSON object. No markdown. No commentary.
Required keys:
schema_version: 1
concept_id, title, category, estimated_minutes (5|10|20|30), effort (light|normal|deep),
prerequisites (string[]), explanation (string[] of 2–5 short paragraphs),
example (string), why_it_matters (string),
quiz: exactly 3 objects {id, prompt, choices[4], answerIndex 0-3, explanation}
Optional: diagram (null), go_deeper (string[] of concept ids)
Do not include mastery, progress, ease, or review fields.`;
function lessonSystemPrompt() {
	return `You write micro-lessons for Dead Air University.
A reader has a short, irregular gap between work. Teach one concept completely.
Tone: precise, adult, no cheerleading, no gamification, no "let's dive in".
Prefer mechanisms over trivia. Questions must test the lesson, not outside facts.
If source text is supplied, stay inside it. Do not add unsupported claims.
${SCHEMA_HINT}
Prompt version ${PROMPT_VERSION}.`;
}
function lessonUserPrompt(input) {
	return [
		`Concept: ${input.concept.name} (${input.concept.id})`,
		`Category: ${input.concept.category}`,
		`Summary: ${input.concept.summary}`,
		`Level: ${input.concept.level}`,
		`Prerequisites: ${input.concept.prerequisites.join(", ") || "none"}`,
		`Duration: ${input.durationMin} minutes`,
		`Effort: ${input.effort}`,
		`Journalist depth: ${input.journalist ? "yes — skip intro definitions, prefer mechanisms" : "no"}`,
		input.adapt ? `Adapt: ${input.adapt}` : "",
		input.known.length ? `Already understood (do not reteach): ${input.known.map((k) => k.name).join(", ")}` : "",
		input.weak.length ? `Previously weak (spend more time): ${input.weak.map((k) => k.name).join(", ")}` : "",
		input.recent.length ? `Recent lessons: ${input.recent.map((r) => r.title).join(" · ")}` : "",
		input.sourceText ? `SOURCE MATERIAL — stay grounded in this text:\n---\n${input.sourceText.slice(0, 8e3)}\n---` : ""
	].filter(Boolean).join("\n");
}
function explainSystemPrompt() {
	return `Rewrite only the explanation and example of a micro-lesson.
Return JSON: { "explanation": string[] , "example": string }
Do not change the concept. Do not add a quiz. No mastery fields.
Prompt version ${PROMPT_VERSION}.`;
}
function explainUserPrompt(lesson, style) {
	return `${{
		analogy: "Use a different concrete analogy.",
		technical: "Be more technical. Name the mechanism.",
		simpler: "Simplify. Shorter sentences. No assumed jargon.",
		example: "Keep the explanation, replace the example with a different concrete case."
	}[style]}\nTitle: ${lesson.title}\nCurrent explanation:\n${lesson.explanation.join("\n\n")}\nCurrent example:\n${lesson.example}`;
}
function quizSystemPrompt() {
	return `Write exactly three multiple-choice questions that test understanding of THIS lesson.
Each has 4 choices and one correct answerIndex.
Avoid trivia and outside knowledge.
Return JSON: { "quiz": [ {id, prompt, choices, answerIndex, explanation}, x3 ] }
Prompt version ${PROMPT_VERSION}.`;
}
function quizUserPrompt(lesson) {
	return `Title: ${lesson.title}\n${lesson.explanation.join("\n\n")}\nExample: ${lesson.example}\nWhy: ${lesson.whyItMatters}`;
}
function pathSystemPrompt() {
	return `Propose a small concept hierarchy for a personal micro-learning app.
Return JSON:
{ "title": string, "blurb": string,
  "concepts": [ {id, name, summary, parentId, prerequisites, level} ],
  "sequence": [concept ids in study order] }
2–12 concepts. ids: kebab-case, unique, prefixed with a short slug.
Do not emit lessons. Do not emit mastery. The user will approve before this becomes real.
Prompt version ${PROMPT_VERSION}.`;
}
function pathUserPrompt(subject, interests) {
	return `Subject: ${subject}\nInterests to honour if relevant: ${interests.join(", ") || "none"}`;
}
async function completeText(settings, secrets, system, user) {
	return runAiCompletion({ data: {
		provider: settings.provider,
		model: settings.model,
		system,
		user,
		userKey: settings.provider === "xai" ? secrets.xai : settings.provider === "openai" ? secrets.openai : settings.provider === "anthropic" ? secrets.anthropic : settings.provider === "gemini" ? secrets.gemini : secrets.localApiKey,
		localBaseUrl: secrets.localBaseUrl
	} });
}
async function generateLesson(ctx, input, opts) {
	const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
	if (!guard.ok) return guard;
	const missing = assertMissingOnly(ctx.settings.policy, Boolean(opts?.hasLocalMatch));
	if (!missing.ok) return missing;
	const cached = findCachedLesson(ctx.existingLessons, input.concept.id, input.durationMin, input.effort, PROMPT_VERSION);
	if (cached) {
		const full = ctx.existingLessons.find((l) => l.id === cached.id);
		if (full) return {
			ok: true,
			value: full,
			cached: true,
			model: full.source.model ?? ctx.settings.model,
			provider: full.source.provider ?? ctx.settings.provider
		};
	}
	const user = lessonUserPrompt(input);
	const completion = await completeText(ctx.settings, ctx.secrets, lessonSystemPrompt(), user);
	if (!completion.ok) return completion;
	const json = extractJson(completion.text);
	if (!json.ok) return json;
	const parsed = parseGeneratedLesson(json.value);
	if (!parsed.ok) return parsed;
	return {
		ok: true,
		value: lessonFromGenerated(parsed.value, {
			conceptId: input.concept.id,
			level: input.concept.level,
			provenance: defaultAiProvenance({
				provider: completion.provider,
				model: completion.model,
				sourceExcerpt: input.sourceText?.slice(0, 400)
			})
		}),
		model: completion.model,
		provider: completion.provider,
		inputTokens: completion.inputTokens ?? estimateTokens(user),
		outputTokens: completion.outputTokens
	};
}
async function generateExplain(ctx, lesson, style) {
	const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
	if (!guard.ok) return guard;
	const completion = await completeText(ctx.settings, ctx.secrets, explainSystemPrompt(), explainUserPrompt(lesson, style));
	if (!completion.ok) return completion;
	const json = extractJson(completion.text);
	if (!json.ok) return json;
	const parsed = parseGeneratedExplain(json.value);
	if (!parsed.ok) return parsed;
	return {
		ok: true,
		value: {
			explanation: Array.isArray(parsed.value.explanation) ? parsed.value.explanation : [parsed.value.explanation],
			example: parsed.value.example
		},
		model: completion.model,
		provider: completion.provider,
		inputTokens: completion.inputTokens,
		outputTokens: completion.outputTokens
	};
}
async function generateQuiz(ctx, lesson) {
	const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
	if (!guard.ok) return guard;
	const completion = await completeText(ctx.settings, ctx.secrets, quizSystemPrompt(), quizUserPrompt(lesson));
	if (!completion.ok) return completion;
	const json = extractJson(completion.text);
	if (!json.ok) return json;
	const parsed = parseGeneratedQuiz(json.value);
	if (!parsed.ok) return parsed;
	return {
		ok: true,
		value: parsed.value.quiz,
		model: completion.model,
		provider: completion.provider,
		inputTokens: completion.inputTokens,
		outputTokens: completion.outputTokens
	};
}
async function generatePath(ctx, subject, interests) {
	const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
	if (!guard.ok) return guard;
	const completion = await completeText(ctx.settings, ctx.secrets, pathSystemPrompt(), pathUserPrompt(subject, interests));
	if (!completion.ok) return completion;
	const json = extractJson(completion.text);
	if (!json.ok) return json;
	const parsed = parseGeneratedPath(json.value);
	if (!parsed.ok) return parsed;
	const categoryId = `path-${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}-${Date.now().toString(36)}`;
	return {
		ok: true,
		value: {
			id: categoryId,
			subject,
			title: parsed.value.title,
			blurb: parsed.value.blurb,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			provider: completion.provider,
			model: completion.model,
			concepts: pathConceptsFromGenerated(parsed.value, categoryId),
			sequence: parsed.value.sequence
		},
		model: completion.model,
		provider: completion.provider,
		inputTokens: completion.inputTokens,
		outputTokens: completion.outputTokens
	};
}
function useAiContext(sessionGenerations = 0) {
	const settings = useProgress((s) => s.ai);
	const log = useProgress((s) => s.generationLog);
	const catalog = useCatalog();
	return {
		settings,
		secrets: (0, import_react.useMemo)(() => loadSecrets(), [settings.enabled, settings.provider]),
		logCountToday: generationsToday(log),
		sessionGenerations,
		existingLessons: catalog.lessons
	};
}
//#endregion
export { useAiContext as a, generateQuiz as i, generateLesson as n, generatePath as r, generateExplain as t };
