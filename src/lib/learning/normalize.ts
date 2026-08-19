import type { LegacyLessonSource, Lesson, Provenance, QuizQuestion, TimeBudget } from "./types";

type LooseLesson = Partial<Lesson> & {
  schema_version?: number;
  concept_id?: string;
  estimated_minutes?: TimeBudget;
  go_deeper?: string;
  why_it_matters?: string;
  source?: Provenance | LegacyLessonSource;
  explanation?: string[] | string;
};

export function isLegacySource(source: Provenance | LegacyLessonSource): source is LegacyLessonSource {
  return "generator" in source && !("type" in source);
}

export function normalizeProvenance(
  source: Provenance | LegacyLessonSource,
  fallback: Provenance["type"] = "seed",
): Provenance {
  if (!isLegacySource(source)) {
    return {
      ...source,
      schemaVersion: source.schemaVersion ?? 1,
    };
  }
  const type: Provenance["type"] =
    source.generator === "human" ? (fallback === "imported" ? "imported" : "human") : fallback;
  return {
    type,
    provider: source.generator,
    author: source.author,
    schemaVersion: 1,
    notes: `legacy ${source.version}`,
  };
}

function asParagraphs(text: string[] | string): string[] {
  if (Array.isArray(text)) return text.filter((p) => p.trim().length > 0);
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function asQuiz(quiz: QuizQuestion[]): [QuizQuestion, QuizQuestion, QuizQuestion] {
  return [quiz[0], quiz[1], quiz[2]];
}

export function normalizeLesson(raw: LooseLesson, fallbackType: Provenance["type"] = "seed"): Lesson {
  const conceptId = raw.conceptId ?? raw.concept_id;
  const durationMin = raw.durationMin ?? raw.estimated_minutes;
  const why = raw.whyItMatters ?? raw.why_it_matters;
  if (!raw.id || !conceptId || !raw.title || !durationMin || !raw.effort || !why || !raw.quiz) {
    throw new Error("lesson is missing required fields");
  }
  if (raw.quiz.length !== 3) throw new Error("lesson quiz must have exactly 3 questions");
  const source = raw.source
    ? normalizeProvenance(raw.source, fallbackType)
    : { type: fallbackType, schemaVersion: 1, author: "unknown" };

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
    diagram: raw.diagram ?? undefined,
    quiz: asQuiz(raw.quiz),
    archived: raw.archived,
    versions: raw.versions,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    custom: raw.custom,
    feedback: raw.feedback,
  };
}

export function applyActiveVersion(lesson: Lesson): Lesson {
  const versions = lesson.versions ?? [];
  if (versions.length === 0) return lesson;
  const last = versions[versions.length - 1];
  return {
    ...lesson,
    explanation: last.explanation ?? lesson.explanation,
    example: last.example ?? lesson.example,
    whyItMatters: last.whyItMatters ?? lesson.whyItMatters,
    quiz: last.quiz && last.quiz.length === 3 ? asQuiz(last.quiz) : lesson.quiz,
    source: last.provenance ?? lesson.source,
  };
}
