import { mixGuidance, plannedMix } from "@/lib/quiz/mix";
import { quizGuidanceForTier } from "@/lib/quiz/kinds";
import { inferTier } from "@/lib/learning/curriculum";
import { PROMPT_VERSION, type CognitiveType } from "@/lib/learning/types";
import type { Concept, Effort, Lesson, TimeBudget } from "@/lib/learning/types";

export { PROMPT_VERSION };

export interface QuizPromptContext {
  subjectId?: string;
  subjectName?: string;
  courseId?: string;
  courseTitle?: string;
  moduleId?: string;
  moduleTitle?: string;
  conceptId?: string;
  tier: number;
  currentConcept: string;
  prerequisites: { id: string; name: string }[];
  demonstrated: { id: string; name: string }[];
  weak: { id: string; name: string }[];
  objectives?: string[];
  allowedKnowledge?: { id: string; name: string }[];
  requestedMix?: CognitiveType[];
  recentCognitiveTypes?: CognitiveType[];
  recentObjectiveIds?: string[];
}

export interface LessonPromptInput {
  concept: Concept;
  durationMin: TimeBudget;
  effort: Effort;
  journalist: boolean;
  known: { id: string; name: string }[];
  weak: { id: string; name: string }[];
  recent: { title: string; conceptId: string }[];
  sourceText?: string;
  adapt?: "skip-known" | "harder" | "simpler";
  style?: "analogy" | "technical" | "simpler" | "example";
  quizContext?: QuizPromptContext;
}

const SCHEMA_HINT = `Return ONLY a JSON object. No markdown. No commentary.
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

export function lessonSystemPrompt() {
  return `You write micro-lessons for Dead Air University.
A reader has a short, irregular gap between work. Teach one concept completely.
Tone: precise, adult, no cheerleading, no gamification, no "let's dive in".
Prefer mechanisms over trivia. Questions must test the lesson, not outside facts.
If source text is supplied, stay inside it. Do not add unsupported claims.
${SCHEMA_HINT}
Prompt version ${PROMPT_VERSION}.`;
}

export function lessonUserPrompt(input: LessonPromptInput) {
  const lines = [
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
    input.sourceText
      ? `SOURCE MATERIAL — stay grounded in this text:\n---\n${input.sourceText.slice(0, 8000)}\n---`
      : "",
  ];
  return lines.filter(Boolean).join("\n");
}

export function explainSystemPrompt() {
  return `Rewrite only the explanation and example of a micro-lesson.
Return JSON: { "explanation": string[] , "example": string }
Do not change the concept. Do not add a quiz. No mastery fields.
Prompt version ${PROMPT_VERSION}.`;
}

export function explainUserPrompt(lesson: Lesson, style: NonNullable<LessonPromptInput["style"]>) {
  const hint = {
    analogy: "Use a different concrete analogy.",
    technical: "Be more technical. Name the mechanism.",
    simpler: "Simplify. Shorter sentences. No assumed jargon.",
    example: "Keep the explanation, replace the example with a different concrete case.",
  }[style];
  return `${hint}\nTitle: ${lesson.title}\nCurrent explanation:\n${lesson.explanation.join("\n\n")}\nCurrent example:\n${lesson.example}`;
}

export function quizSystemPrompt() {
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

function quizContractLines(ctx: QuizPromptContext): string[] {
  const allowed = ctx.allowedKnowledge?.length ? ctx.allowedKnowledge : [...ctx.prerequisites, ...ctx.demonstrated];
  const mix = ctx.requestedMix ?? plannedMix(ctx.tier as 0 | 1 | 2 | 3 | 4 | 5);
  return [
    ctx.subjectName ? `Subject: ${ctx.subjectName}` : "",
    ctx.courseTitle ? `Course: ${ctx.courseTitle}` : "",
    ctx.moduleTitle ? `Module: ${ctx.moduleTitle}` : "",
    `Current concept: ${ctx.currentConcept}`,
    ctx.conceptId ? `Concept id: ${ctx.conceptId}` : "",
    `Curriculum tier (internal): ${ctx.tier}`,
    quizGuidanceForTier(ctx.tier as 0 | 1 | 2 | 3 | 4 | 5),
    mixGuidance(ctx.tier as 0 | 1 | 2 | 3 | 4 | 5),
    `Requested cognitive mix: ${mix.join(", ")}`,
    ctx.prerequisites.length
      ? `Prerequisites already established: ${ctx.prerequisites.map((p) => `${p.name} (${p.id})`).join(", ")}`
      : "Prerequisites: none listed.",
    allowed.length
      ? `Allowed prior knowledge — do not require anything outside this list: ${allowed.map((p) => `${p.name} (${p.id})`).join(", ")}`
      : "Allowed prior knowledge: only the current lesson.",
    ctx.objectives?.length ? `Learning objectives (cover these, not trivia): ${ctx.objectives.join("; ")}` : "",
    ctx.weak.length ? `Previously weak: ${ctx.weak.map((p) => p.name).join(", ")}` : "",
    ctx.recentCognitiveTypes?.length ? `Recent cognitive types to avoid repeating: ${ctx.recentCognitiveTypes.join(", ")}` : "",
    ctx.recentObjectiveIds?.length ? `Recently tested objectives (prefer alternatives): ${ctx.recentObjectiveIds.join("; ")}` : "",
  ].filter(Boolean);
}

export function quizUserPrompt(lesson: Lesson, ctx?: QuizPromptContext) {
  const lines = [
    ...(ctx ? quizContractLines(ctx) : [`Current concept: ${lesson.conceptId}`]),
    `Title: ${lesson.title}`,
    lesson.explanation.join("\n\n"),
    `Example: ${lesson.example}`,
    `Why: ${lesson.whyItMatters}`,
    "Do not ask about material that is not in this lesson or the allowed knowledge list.",
  ];
  return lines.filter(Boolean).join("\n");
}

export function pathSystemPrompt() {
  return `Propose a small concept hierarchy for a personal micro-learning app.
Return JSON:
{ "title": string, "blurb": string,
  "concepts": [ {id, name, summary, parentId, prerequisites, level} ],
  "sequence": [concept ids in study order] }
2–12 concepts. ids: kebab-case, unique, prefixed with a short slug.
Do not emit lessons. Do not emit mastery. The user will approve before this becomes real.
Prompt version ${PROMPT_VERSION}.`;
}

export function pathUserPrompt(subject: string, interests: string[]) {
  return `Subject: ${subject}\nInterests to honour if relevant: ${interests.join(", ") || "none"}`;
}
