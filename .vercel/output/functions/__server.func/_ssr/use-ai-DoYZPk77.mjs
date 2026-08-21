import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { B as useCatalog, D as makeId, F as quizGuidanceForTier, N as plannedMix, V as useProgress, f as generatedExplainSchema, g as inferTier, h as generatedQuizSchema, j as normalizeLesson, k as mixGuidance, m as generatedPathSchema, p as generatedLessonSchema, r as assembleQuiz, t as PROMPT_VERSION } from "./use-catalog-DsTCgnv9.mjs";
import { t as loadSecrets } from "./secrets-Bp-pUZg8.mjs";
import { r as estimateTokens } from "./providers-BwL6YD0o.mjs";
import { r as runAiCompletion, t as generationsToday } from "./server-CBQ7aw1e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-ai-DoYZPk77.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function cacheKey(input) {
	return [
		input.kind,
		input.conceptId,
		input.durationMin ?? "",
		input.effort ?? "",
		input.level ?? "",
		input.journalist ? "j" : "",
		input.adapt ?? "",
		input.style ?? "",
		input.sourceHash ?? "",
		input.promptVersion
	].join("|");
}
function hashText(text) {
	let h = 2166136261;
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0).toString(16);
}
/**
* Reuse an AI lesson only when the full generation context matches.
* A journalist-depth or source-grounded unit must not satisfy a generic request.
*/
function findCachedLesson(lessons, query) {
	const key = cacheKey(query);
	const exact = lessons.find((l) => l.source.type === "ai" && l.source.cacheKey === key);
	if (exact) return exact;
	return lessons.find((l) => {
		if (l.source.type !== "ai") return false;
		if (l.source.cacheKey) return false;
		if (l.conceptId !== query.conceptId) return false;
		if (l.durationMin !== query.durationMin) return false;
		if (query.effort && l.effort !== query.effort) return false;
		if ((l.source.promptVersion ?? query.promptVersion) !== query.promptVersion) return false;
		if (query.level && l.level && l.level !== query.level) return false;
		if (query.journalist === true && l.level !== "journalist") return false;
		if (query.journalist === false && l.level === "journalist") return false;
		if (query.sourceHash) {
			if ((l.source.sourceExcerpt ? hashText(l.source.sourceExcerpt) : "") !== query.sourceHash) return false;
		}
		if (query.adapt) return false;
		if (query.style) return false;
		return true;
	});
}
var BANNED_PROGRESS_KEYS = /* @__PURE__ */ new Set([
	"mastery",
	"progress",
	"ease",
	"intervalDays",
	"interval_days",
	"nextReviewAt",
	"next_review_at",
	"understanding",
	"lapseCount",
	"lapse_count",
	"lastQuizScore",
	"last_quiz_score",
	"readiness",
	"courseProgress",
	"waivedConceptIds",
	"waived_concept_ids",
	"placement",
	"recommendedTier"
]);
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
function findProgressFields(value, path = "") {
	if (Array.isArray(value)) return value.flatMap((item, i) => findProgressFields(item, path ? `${path}[${i}]` : `[${i}]`));
	if (!value || typeof value !== "object") return [];
	const hits = [];
	for (const [key, child] of Object.entries(value)) {
		const next = path ? `${path}.${key}` : key;
		if (BANNED_PROGRESS_KEYS.has(key)) hits.push(next);
		hits.push(...findProgressFields(child, next));
	}
	return hits;
}
/** Schema validation is the accept/reject boundary. This walk only detects leaks. */
function assertNoProgressFields(raw) {
	const hits = findProgressFields(raw);
	if (hits.length === 0) return { ok: true };
	return {
		ok: false,
		error: `Generated output included forbidden progress fields (${hits.slice(0, 4).join(", ")}). Rejected.`
	};
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
function rejectProgressLeak(raw) {
	const leak = assertNoProgressFields(raw);
	if (!leak.ok) return {
		ok: false,
		error: leak.error
	};
	return null;
}
function parseGeneratedLesson(raw) {
	const leak = rejectProgressLeak(raw);
	if (leak) return leak;
	const parsed = generatedLessonSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		error: "Generated lesson failed schema validation.",
		issues: parsed.error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
	};
	return {
		ok: true,
		value: parsed.data
	};
}
function parseGeneratedExplain(raw) {
	const leak = rejectProgressLeak(raw);
	if (leak) return leak;
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
	const leak = rejectProgressLeak(raw);
	if (leak) return leak;
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
	const leak = rejectProgressLeak(raw);
	if (leak) return leak;
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
function finalizedQuiz(raw, opts) {
	const assembled = assembleQuiz(raw, opts);
	if (!assembled.ok) throw new Error(assembled.error);
	return assembled.quiz;
}
function lessonFromGenerated(data, meta) {
	const explanation = Array.isArray(data.explanation) ? data.explanation : [data.explanation];
	return normalizeLesson({
		schemaVersion: 1,
		id: meta.id ?? makeId("ai", data.title),
		conceptId: meta.conceptId,
		title: data.title,
		durationMin: meta.durationMin ?? data.estimated_minutes,
		effort: meta.effort ?? data.effort,
		level: meta.level,
		prerequisites: meta.prerequisites ?? data.prerequisites,
		goDeeper: meta.goDeeper,
		source: meta.provenance,
		explanation,
		example: data.example,
		whyItMatters: data.why_it_matters,
		diagram: data.diagram ?? void 0,
		quiz: finalizedQuiz(data.quiz, meta.assemble),
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
		links: input.links,
		cacheKey: input.cacheKey,
		notes: input.notes
	};
}
var SCHEMA_HINT = `Return ONLY a JSON object. No markdown. No commentary.
Required keys:
schema_version: 1
concept_id, title, category, estimated_minutes (5|10|20|30), effort (light|normal|deep),
prerequisites (string[]), explanation (string[] of 2–5 short paragraphs),
example (string), why_it_matters (string),
quiz: exactly 3 objects {
  id, stem,
  correctAnswer,
  distractors: exactly 3 {text, kind, rationale},
  correctExplanation,
  objectiveIds (string[]),
  prerequisiteConceptIds (string[]),
  difficultyTier (0-5),
  cognitiveType (recognize|distinguish|identify|apply|predict|trace|compare|diagnose|integrate|tradeoff)
}
kind must be one of: misconception | nearby | reversed | misapplied | subtle
Do not set answerIndex. Do not decide final option order. Do not joke.
Each distractor must be a specific plausible misconception.
Do not make the correct answer longer or more technical just because it is correct.
Optional aliases prompt/correct/explanation are accepted. Prefer the canonical keys.
Optional: diagram (null), go_deeper (string[] of concept ids)
Do not include mastery, progress, ease, readiness, placement, or review fields.`;
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
		`Curriculum tier (internal): ${inferTier(input.concept)}`,
		input.quizContext?.courseTitle ? `Course: ${input.quizContext.courseTitle}` : "",
		input.quizContext?.moduleTitle ? `Module: ${input.quizContext.moduleTitle}` : "",
		`Prerequisites: ${input.concept.prerequisites.join(", ") || "none"}`,
		`Duration: ${input.durationMin} minutes`,
		`Effort: ${input.effort}`,
		`Journalist depth: ${input.journalist ? "yes — skip intro definitions, prefer mechanisms. Do not assume extra unlisted knowledge." : "no"}`,
		input.adapt ? `Adapt: ${input.adapt}` : "",
		input.known.length ? `Already understood (do not reteach): ${input.known.map((k) => k.name).join(", ")}` : "",
		input.weak.length ? `Previously weak (spend more time): ${input.weak.map((k) => k.name).join(", ")}` : "",
		input.recent.length ? `Recent lessons: ${input.recent.map((r) => r.title).join(" · ")}` : "",
		input.quizContext ? quizContractLines(input.quizContext).join("\n") : "",
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
The application owns difficulty, readiness, and answer order. You author content only.

Return JSON: { "quiz": [ QuizItemDraft, QuizItemDraft, QuizItemDraft ] }
Each QuizItemDraft:
  id, stem, correctAnswer,
  distractors[3] {text, kind, rationale},
  correctExplanation, objectiveIds[], prerequisiteConceptIds[],
  difficultyTier, cognitiveType

Rules:
- Write plausible distractors. Each one is a specific misconception: nearby concept, reversed cause/effect, right mechanism in the wrong context, missing constraint, oversimplification, wrong step order, or incorrect trade-off.
- Do not write jokes, nonsense, or irrelevant technologies.
- Do not make the correct answer longer or more technical just because it is correct.
- Do not use all/none of the above.
- Do not decide answer position. Do not include answerIndex or choices arrays.
- Do not require knowledge outside the allowed list.
- Do not test untaught terminology or hidden university-course assumptions.
- Do not ask trivia or side comments.
- Do not ask "which statement is true?" unless every alternative is genuinely plausible.
- Do not repeat a lesson sentence verbatim and ask the reader to recognise it.
- Do not write three paraphrases of the same recall question.
- Map each item to at least one listed learning objective.
- Prerequisite IDs must be drawn from the allowed knowledge list.

Do not include readiness, mastery, or placement fields.
Prompt version ${PROMPT_VERSION}.`;
}
function quizContractLines(ctx) {
	const allowed = ctx.allowedKnowledge?.length ? ctx.allowedKnowledge : [...ctx.prerequisites, ...ctx.demonstrated];
	const mix = ctx.requestedMix ?? plannedMix(ctx.tier);
	return [
		ctx.subjectName ? `Subject: ${ctx.subjectName}` : "",
		ctx.courseTitle ? `Course: ${ctx.courseTitle}` : "",
		ctx.moduleTitle ? `Module: ${ctx.moduleTitle}` : "",
		`Current concept: ${ctx.currentConcept}`,
		ctx.conceptId ? `Concept id: ${ctx.conceptId}` : "",
		`Curriculum tier (internal): ${ctx.tier}`,
		quizGuidanceForTier(ctx.tier),
		mixGuidance(ctx.tier),
		`Requested cognitive mix: ${mix.join(", ")}`,
		ctx.prerequisites.length ? `Prerequisites already established: ${ctx.prerequisites.map((p) => `${p.name} (${p.id})`).join(", ")}` : "Prerequisites: none listed.",
		allowed.length ? `Allowed prior knowledge — do not require anything outside this list: ${allowed.map((p) => `${p.name} (${p.id})`).join(", ")}` : "Allowed prior knowledge: only the current lesson.",
		ctx.objectives?.length ? `Learning objectives (cover these, not trivia): ${ctx.objectives.join("; ")}` : "",
		ctx.weak.length ? `Previously weak: ${ctx.weak.map((p) => p.name).join(", ")}` : "",
		ctx.recentCognitiveTypes?.length ? `Recent cognitive types to avoid repeating: ${ctx.recentCognitiveTypes.join(", ")}` : "",
		ctx.recentObjectiveIds?.length ? `Recently tested objectives (prefer alternatives): ${ctx.recentObjectiveIds.join("; ")}` : ""
	].filter(Boolean);
}
function quizUserPrompt(lesson, ctx) {
	return [
		...ctx ? quizContractLines(ctx) : [`Current concept: ${lesson.conceptId}`],
		`Title: ${lesson.title}`,
		lesson.explanation.join("\n\n"),
		`Example: ${lesson.example}`,
		`Why: ${lesson.whyItMatters}`,
		"Do not ask about material that is not in this lesson or the allowed knowledge list."
	].filter(Boolean).join("\n");
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
function sameSet(a, b) {
	if (a.length !== b.length) return false;
	const left = [...a].sort();
	const right = [...b].sort();
	return left.every((id, i) => id === right[i]);
}
/**
* AI authors prose. The app owns curriculum topology.
* Duration and effort must match the request. Everything else is overwritten
* from the concept graph when the model disagrees.
*/
function bindGeneratedLesson(data, req) {
	const issues = [];
	if (data.estimated_minutes !== req.durationMin) issues.push(`duration ${data.estimated_minutes} does not match the ${req.durationMin}-minute request`);
	if (data.effort !== req.effort) issues.push(`effort ${data.effort} does not match the ${req.effort} request`);
	if (issues.length) return {
		ok: false,
		error: "Generated lesson did not match the requested session.",
		issues
	};
	const discrepancies = [];
	if (data.concept_id !== req.concept.id) discrepancies.push(`concept_id ${data.concept_id} replaced with ${req.concept.id}`);
	const prerequisites = [...req.concept.prerequisites];
	if (!sameSet(data.prerequisites ?? [], prerequisites)) discrepancies.push("prerequisites taken from the concept graph");
	let level = req.concept.level;
	if (req.journalist && data.level === "journalist") level = "journalist";
	else if (data.level && data.level !== req.concept.level) discrepancies.push(`level ${data.level} overwritten with ${req.concept.level}`);
	const requested = data.go_deeper ?? [];
	const valid = requested.filter((id) => id !== req.concept.id && req.knownConceptIds.has(id));
	if (requested.length > 0 && valid.length !== requested.length) discrepancies.push("dropped unknown go_deeper targets");
	return {
		ok: true,
		value: {
			conceptId: req.concept.id,
			durationMin: req.durationMin,
			effort: req.effort,
			level,
			prerequisites,
			goDeeper: valid[0],
			discrepancies
		}
	};
}
function billed(completion) {
	return "attempted" in completion ? Boolean(completion.attempted) : true;
}
function usageFrom(completion, user) {
	if (completion.ok) return {
		inputTokens: completion.inputTokens ?? estimateTokens(user),
		outputTokens: completion.outputTokens
	};
	return { inputTokens: estimateTokens(user) };
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
function lessonCacheQuery(input) {
	return {
		kind: input.adapt === "harder" || input.journalist ? "deeper" : "lesson",
		conceptId: input.concept.id,
		durationMin: input.durationMin,
		effort: input.effort,
		level: input.concept.level,
		journalist: input.journalist,
		adapt: input.adapt,
		style: input.style,
		sourceHash: input.sourceText ? hashText(input.sourceText) : void 0,
		promptVersion: PROMPT_VERSION
	};
}
async function generateLesson(ctx, input, opts) {
	const meta = {
		provider: ctx.settings.provider,
		model: ctx.settings.model
	};
	const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
	if (!guard.ok) return {
		...guard,
		billable: false,
		...meta
	};
	const missing = assertMissingOnly(ctx.settings.policy, Boolean(opts?.hasLocalMatch));
	if (!missing.ok) return {
		...missing,
		billable: false,
		...meta
	};
	const query = lessonCacheQuery(input);
	const cached = findCachedLesson(ctx.existingLessons, query);
	if (cached) {
		const full = ctx.existingLessons.find((l) => l.id === cached.id);
		if (full) return {
			ok: true,
			value: full,
			cached: true,
			billable: false,
			model: full.source.model ?? ctx.settings.model,
			provider: full.source.provider ?? ctx.settings.provider
		};
	}
	const user = lessonUserPrompt(input);
	const completion = await completeText(ctx.settings, ctx.secrets, lessonSystemPrompt(), user);
	const billable = billed(completion);
	const usage = usageFrom(completion, user);
	if (!completion.ok) return {
		ok: false,
		error: completion.error,
		billable,
		...meta,
		...usage
	};
	const json = extractJson(completion.text);
	if (!json.ok) return {
		...json,
		billable,
		provider: completion.provider,
		model: completion.model,
		...usage
	};
	const parsed = parseGeneratedLesson(json.value);
	if (!parsed.ok) return {
		...parsed,
		billable,
		provider: completion.provider,
		model: completion.model,
		...usage
	};
	const bound = bindGeneratedLesson(parsed.value, {
		concept: input.concept,
		durationMin: input.durationMin,
		effort: input.effort,
		journalist: input.journalist,
		knownConceptIds: new Set(ctx.conceptIds)
	});
	if (!bound.ok) return {
		...bound,
		billable,
		provider: completion.provider,
		model: completion.model,
		...usage
	};
	const notes = bound.value.discrepancies.length ? `curriculum bound: ${bound.value.discrepancies.join("; ")}` : void 0;
	let lesson;
	try {
		lesson = lessonFromGenerated(parsed.value, {
			conceptId: bound.value.conceptId,
			level: bound.value.level,
			durationMin: bound.value.durationMin,
			effort: bound.value.effort,
			prerequisites: bound.value.prerequisites,
			goDeeper: bound.value.goDeeper,
			provenance: defaultAiProvenance({
				provider: completion.provider,
				model: completion.model,
				sourceExcerpt: input.sourceText?.slice(0, 400),
				cacheKey: cacheKey(query),
				notes
			}),
			assemble: input.quizContext ? {
				expectedTier: input.quizContext.tier,
				knownObjectiveIds: input.quizContext.objectives?.length ? input.quizContext.objectives : void 0,
				allowed: input.quizContext.allowedKnowledge ? {
					currentConceptId: input.quizContext.conceptId ?? input.concept.id,
					conceptIds: [.../* @__PURE__ */ new Set([input.quizContext.conceptId ?? input.concept.id, ...input.quizContext.allowedKnowledge.map((k) => k.id)])],
					names: input.quizContext.allowedKnowledge,
					reasons: {}
				} : void 0
			} : void 0
		});
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Generated quiz failed validation.",
			billable,
			provider: completion.provider,
			model: completion.model,
			...usage
		};
	}
	return {
		ok: true,
		value: lesson,
		billable: true,
		model: completion.model,
		provider: completion.provider,
		...usage
	};
}
async function generateExplain(ctx, lesson, style) {
	const meta = {
		provider: ctx.settings.provider,
		model: ctx.settings.model
	};
	const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
	if (!guard.ok) return {
		...guard,
		billable: false,
		...meta
	};
	const user = explainUserPrompt(lesson, style);
	const completion = await completeText(ctx.settings, ctx.secrets, explainSystemPrompt(), user);
	const billable = billed(completion);
	const usage = usageFrom(completion, user);
	if (!completion.ok) return {
		ok: false,
		error: completion.error,
		billable,
		...meta,
		...usage
	};
	const json = extractJson(completion.text);
	if (!json.ok) return {
		...json,
		billable,
		provider: completion.provider,
		model: completion.model,
		...usage
	};
	const parsed = parseGeneratedExplain(json.value);
	if (!parsed.ok) return {
		...parsed,
		billable,
		provider: completion.provider,
		model: completion.model,
		...usage
	};
	return {
		ok: true,
		value: {
			explanation: Array.isArray(parsed.value.explanation) ? parsed.value.explanation : [parsed.value.explanation],
			example: parsed.value.example
		},
		billable: true,
		model: completion.model,
		provider: completion.provider,
		...usage
	};
}
function assembleGeneratedQuiz(raw, quizCtx, lesson) {
	return assembleQuiz(raw, {
		expectedTier: quizCtx?.tier,
		knownObjectiveIds: quizCtx?.objectives?.length ? quizCtx.objectives : void 0,
		allowed: quizCtx?.allowedKnowledge ? {
			currentConceptId: quizCtx.conceptId ?? lesson.conceptId,
			conceptIds: [.../* @__PURE__ */ new Set([quizCtx.conceptId ?? lesson.conceptId, ...quizCtx.allowedKnowledge.map((k) => k.id)])],
			names: quizCtx.allowedKnowledge,
			reasons: {}
		} : void 0
	});
}
function canRetryQuiz(ctx, alreadyUsed) {
	return ctx.logCountToday + alreadyUsed < ctx.settings.maxPerDay && ctx.sessionGenerations + alreadyUsed < ctx.settings.maxPerSession;
}
async function generateQuiz(ctx, lesson, quizCtx) {
	const meta = {
		provider: ctx.settings.provider,
		model: ctx.settings.model
	};
	const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
	if (!guard.ok) return {
		...guard,
		billable: false,
		...meta
	};
	const user = quizUserPrompt(lesson, quizCtx);
	let completion = await completeText(ctx.settings, ctx.secrets, quizSystemPrompt(), user);
	let billable = billed(completion);
	let usage = usageFrom(completion, user);
	if (!completion.ok) return {
		ok: false,
		error: completion.error,
		billable,
		...meta,
		...usage
	};
	const first = finalizeGeneratedQuiz(completion.text, quizCtx, lesson);
	if (first.ok) return {
		ok: true,
		value: first.quiz,
		billable: true,
		model: completion.model,
		provider: completion.provider,
		...usage
	};
	if (!canRetryQuiz(ctx, 1)) return {
		ok: false,
		error: first.error,
		issues: first.issues,
		billable,
		provider: completion.provider,
		model: completion.model,
		...usage
	};
	completion = await completeText(ctx.settings, ctx.secrets, quizSystemPrompt(), user);
	billable = billable || billed(completion);
	const retryUsage = usageFrom(completion, user);
	usage = {
		inputTokens: usage.inputTokens + retryUsage.inputTokens,
		outputTokens: (usage.outputTokens ?? 0) + (retryUsage.outputTokens ?? 0)
	};
	if (!completion.ok) return {
		ok: false,
		error: first.error,
		issues: first.issues,
		billable,
		...meta,
		...usage
	};
	const second = finalizeGeneratedQuiz(completion.text, quizCtx, lesson);
	if (!second.ok) return {
		ok: false,
		error: second.error,
		issues: second.issues,
		billable,
		provider: completion.provider,
		model: completion.model,
		...usage
	};
	return {
		ok: true,
		value: second.quiz,
		billable: true,
		model: completion.model,
		provider: completion.provider,
		...usage
	};
}
function finalizeGeneratedQuiz(text, quizCtx, lesson) {
	const json = extractJson(text);
	if (!json.ok) return json;
	const parsed = parseGeneratedQuiz(json.value);
	if (!parsed.ok) return parsed;
	const assembled = assembleGeneratedQuiz(parsed.value.quiz, quizCtx, lesson);
	if (!assembled.ok) return {
		ok: false,
		error: assembled.error,
		issues: assembled.issues
	};
	return {
		ok: true,
		quiz: assembled.quiz
	};
}
async function generatePath(ctx, subject, interests) {
	const meta = {
		provider: ctx.settings.provider,
		model: ctx.settings.model
	};
	const guard = assertAiAllowed(ctx.settings, ctx.logCountToday, ctx.sessionGenerations);
	if (!guard.ok) return {
		...guard,
		billable: false,
		...meta
	};
	const user = pathUserPrompt(subject, interests);
	const completion = await completeText(ctx.settings, ctx.secrets, pathSystemPrompt(), user);
	const billable = billed(completion);
	const usage = usageFrom(completion, user);
	if (!completion.ok) return {
		ok: false,
		error: completion.error,
		billable,
		...meta,
		...usage
	};
	const json = extractJson(completion.text);
	if (!json.ok) return {
		...json,
		billable,
		provider: completion.provider,
		model: completion.model,
		...usage
	};
	const parsed = parseGeneratedPath(json.value);
	if (!parsed.ok) return {
		...parsed,
		billable,
		provider: completion.provider,
		model: completion.model,
		...usage
	};
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
		billable: true,
		model: completion.model,
		provider: completion.provider,
		...usage
	};
}
function toGenerationLog(kind, result, extra) {
	return {
		id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		kind,
		provider: result.provider ?? "unknown",
		model: result.model ?? "unknown",
		promptVersion: PROMPT_VERSION,
		ok: result.ok,
		error: result.ok ? void 0 : result.error,
		lessonId: extra?.lessonId,
		conceptId: extra?.conceptId,
		cached: result.cached ?? false,
		billable: result.billable,
		inputTokens: result.inputTokens,
		outputTokens: result.outputTokens
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
		existingLessons: catalog.lessons,
		conceptIds: catalog.concepts.map((c) => c.id)
	};
}
//#endregion
export { toGenerationLog as a, generateQuiz as i, generateLesson as n, useAiContext as o, generatePath as r, generateExplain as t };
