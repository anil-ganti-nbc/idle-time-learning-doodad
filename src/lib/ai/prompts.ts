import { PROMPT_VERSION } from "@/lib/learning/types";
import type { Concept, Effort, Lesson, Level, TimeBudget } from "@/lib/learning/types";

export { PROMPT_VERSION };

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
}

const SCHEMA_HINT = `Return ONLY a JSON object. No markdown. No commentary.
Required keys:
schema_version: 1
concept_id, title, category, estimated_minutes (5|10|20|30), effort (light|normal|deep),
prerequisites (string[]), explanation (string[] of 2–5 short paragraphs),
example (string), why_it_matters (string),
quiz: exactly 3 objects {id, prompt, choices[4], answerIndex 0-3, explanation}
Optional: diagram (null), go_deeper (string[] of concept ids)
Do not include mastery, progress, ease, or review fields.`;

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
    `Prerequisites: ${input.concept.prerequisites.join(", ") || "none"}`,
    `Duration: ${input.durationMin} minutes`,
    `Effort: ${input.effort}`,
    `Journalist depth: ${input.journalist ? "yes — skip intro definitions, prefer mechanisms" : "no"}`,
    input.adapt ? `Adapt: ${input.adapt}` : "",
    input.known.length ? `Already understood (do not reteach): ${input.known.map((k) => k.name).join(", ")}` : "",
    input.weak.length ? `Previously weak (spend more time): ${input.weak.map((k) => k.name).join(", ")}` : "",
    input.recent.length ? `Recent lessons: ${input.recent.map((r) => r.title).join(" · ")}` : "",
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
Each has 4 choices and one correct answerIndex.
Avoid trivia and outside knowledge.
Return JSON: { "quiz": [ {id, prompt, choices, answerIndex, explanation}, x3 ] }
Prompt version ${PROMPT_VERSION}.`;
}

export function quizUserPrompt(lesson: Lesson) {
  return `Title: ${lesson.title}\n${lesson.explanation.join("\n\n")}\nExample: ${lesson.example}\nWhy: ${lesson.whyItMatters}`;
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
