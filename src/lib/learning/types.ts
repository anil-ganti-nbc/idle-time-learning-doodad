export const SEEDED_CATEGORY_IDS = [
  "cpu",
  "semiconductors",
  "os",
  "networking",
  "compilers",
  "ml",
  "astronomy",
  "evo-bio",
  "economics",
  "statistics",
  "horology",
  "audio",
  "music-theory",
  "death-metal",
  "history",
] as const;

/** Any category id — seeded or user-created. */
export type CategoryId = string;
export type SeededCategoryId = (typeof SEEDED_CATEGORY_IDS)[number];

export const TIME_OPTIONS = [5, 10, 20, 30] as const;
export type TimeBudget = (typeof TIME_OPTIONS)[number];

export const EFFORTS = ["light", "normal", "deep"] as const;
export type Effort = (typeof EFFORTS)[number];

export const MODES = ["explore", "reinforce", "surprise"] as const;
export type Mode = (typeof MODES)[number];

export const LEVELS = ["intro", "core", "journalist"] as const;
export type Level = (typeof LEVELS)[number];

export const RATINGS = ["didnt_get_it", "mostly", "got_it"] as const;
export type Understanding = (typeof RATINGS)[number];

export const CONCEPT_STATES = [
  "unseen",
  "introduced",
  "shaky",
  "understood",
  "due",
  "strong",
] as const;
export type ConceptState = (typeof CONCEPT_STATES)[number];

export const SOURCE_TYPES = ["seed", "human", "imported", "ai"] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const AI_PROVIDERS = ["xai", "openai", "anthropic", "gemini", "local"] as const;
export type AiProviderId = (typeof AI_PROVIDERS)[number];

export const AI_POLICIES = ["off", "manual", "missing-only"] as const;
export type AiPolicy = (typeof AI_POLICIES)[number];

export const TIERS = [0, 1, 2, 3, 4, 5] as const;
export type Tier = (typeof TIERS)[number];

/** Internal only — never shown as "Level N". */
export const TIER_LABELS: Record<Tier, string> = {
  0: "Foundation",
  1: "Introductory",
  2: "Core",
  3: "Intermediate",
  4: "Advanced",
  5: "Specialist",
};

export const DISTRACTOR_KINDS = [
  "misconception",
  "nearby",
  "reversed",
  "misapplied",
  "subtle",
] as const;
export type DistractorKind = (typeof DISTRACTOR_KINDS)[number];

export const CURRICULUM_SOURCE_KINDS = ["syllabus", "ocw", "textbook", "vendor", "notes"] as const;
export type CurriculumSourceKind = (typeof CURRICULUM_SOURCE_KINDS)[number];

export const LESSON_SCHEMA_VERSION = 1;
export const EXPORT_SCHEMA_VERSION = 2;
export const PROMPT_VERSION = "dau-lesson-v2";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  custom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurriculumSourceRef {
  title: string;
  url?: string;
  kind: CurriculumSourceKind;
  notes: string;
}

export interface CourseModule {
  id: string;
  title: string;
  blurb?: string;
  order: number;
  /** Other module ids that should be cleared first. */
  prerequisites: string[];
  conceptIds: string[];
  /** Concepts that must be demonstrated to leave the module. */
  spineIds: string[];
}

export interface Course {
  id: string;
  title: string;
  categoryId: CategoryId;
  description: string;
  curriculumVersion: number;
  sourceReferences: CurriculumSourceRef[];
  /** Concept ids that may come from other courses. */
  entryRequirements: string[];
  modules: CourseModule[];
  custom?: boolean;
}

export interface Concept {
  id: string;
  name: string;
  category: CategoryId;
  parentId?: string;
  prerequisites: string[];
  level: Level;
  summary: string;
  custom?: boolean;
  createdAt?: string;
  updatedAt?: string;
  courseId?: string;
  moduleId?: string;
  curriculumOrder?: number;
  tier?: Tier;
  objectives?: string[];
}

export interface QuizDistractor {
  text: string;
  kind: DistractorKind;
  rationale: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
  distractors?: QuizDistractor[];
}

export interface Provenance {
  type: SourceType;
  provider?: string;
  author?: string;
  model?: string;
  generatedAt?: string;
  importedAt?: string;
  promptVersion?: string;
  schemaVersion: number;
  links?: string[];
  sourceExcerpt?: string;
  notes?: string;
  /** Full generation cache key. Present on AI lessons so reuse cannot cross contexts. */
  cacheKey?: string;
}

/** @deprecated v1 seed shape — still accepted on import and normalized. */
export interface LegacyLessonSource {
  author: string;
  generator: "grok" | "gpt" | "claude" | "human";
  version: string;
}

export type LessonSource = Provenance;

export type LessonFeedbackVerdict = "accurate" | "unclear" | "suspect";

export interface LessonFeedback {
  verdict: LessonFeedbackVerdict;
  at: string;
}

export interface LessonVersion {
  id: string;
  createdAt: string;
  kind: "original" | "explain-differently" | "adapted" | "revised" | "quiz-regen";
  explanation?: string[];
  example?: string;
  whyItMatters?: string;
  quiz?: QuizQuestion[];
  provenance: Provenance;
}

export interface Lesson {
  schemaVersion: number;
  id: string;
  conceptId: string;
  title: string;
  durationMin: TimeBudget;
  effort: Effort;
  level: Level;
  prerequisites: string[];
  goDeeper?: string;
  source: Provenance;
  explanation: string[];
  example: string;
  whyItMatters: string;
  diagram?: string;
  quiz: [QuizQuestion, QuizQuestion, QuizQuestion];
  archived?: boolean;
  versions?: LessonVersion[];
  createdAt?: string;
  updatedAt?: string;
  custom?: boolean;
  feedback?: LessonFeedback[];
}

export interface ReviewEvent {
  at: string;
  quizCorrect: number;
  quizTotal: number;
  understanding: Understanding;
  intervalDays: number;
  ease: number;
}

export interface ConceptProgress {
  conceptId: string;
  encountered: boolean;
  understanding: Understanding | null;
  quizCorrect: number;
  quizTotal: number;
  /**
   * Last-session quiz ratio in [0, 1].
   * Legacy v1/v2 stores wrote the raw correct-count (0–3) here; migrate on read.
   */
  lastQuizScore: number | null;
  /** Raw correct answers from the last session. Display only — ranking uses lastQuizScore. */
  lastQuizCorrect: number | null;
  /** Question count of the last session (usually 3). */
  lastQuizTotal: number;
  estimatedMinutes: number;
  actualMinutes: number;
  lastStudiedAt: string | null;
  nextReviewAt: string | null;
  timesStudied: number;
  ease: number;
  intervalDays: number;
  /** Lifetime count of failing reviews (quality ≤ 1). Distinguishes a one-off miss from a pattern. */
  lapseCount: number;
  reviewHistory: ReviewEvent[];
  updatedAt: string | null;
}

export interface SessionRecord {
  id: string;
  lessonId: string;
  conceptId: string;
  categoryId: CategoryId;
  startedAt: string;
  completedAt: string;
  estimatedMinutes: number;
  actualMinutes: number;
  quizCorrect: number;
  quizTotal: number;
  understanding: Understanding;
  mode: Mode;
  timeBudget: TimeBudget;
  sourceType: SourceType;
  sourceProvider?: string;
}

export interface LocalProfile {
  displayName: string;
  preferredTopics: CategoryId[];
  knownConceptIds: string[];
  avoidTopics: CategoryId[];
  customInterests: string[];
}

export interface Preferences {
  journalistDepth: boolean;
  lastTime: TimeBudget;
  lastCategory: CategoryId | "random" | null;
  lastEffort: Effort | null;
  lastMode: Mode;
  preferredDuration: TimeBudget;
  preferredEffort: Effort | null;
}

export interface AiSettings {
  enabled: boolean;
  provider: AiProviderId;
  model: string;
  policy: AiPolicy;
  maxPerDay: number;
  maxPerSession: number;
}

export interface AiSecrets {
  xai?: string;
  openai?: string;
  anthropic?: string;
  gemini?: string;
  localBaseUrl?: string;
  localApiKey?: string;
}

export interface GenerationLogEntry {
  id: string;
  at: string;
  kind: "lesson" | "quiz" | "explain" | "deeper" | "path" | "source";
  provider: string;
  model: string;
  promptVersion: string;
  ok: boolean;
  error?: string;
  lessonId?: string;
  conceptId?: string;
  cached?: boolean;
  billable?: boolean;
  inputTokens?: number;
  outputTokens?: number;
}

export interface PendingPath {
  id: string;
  subject: string;
  title: string;
  blurb: string;
  createdAt: string;
  provider: string;
  model: string;
  concepts: Concept[];
  sequence: string[];
}

export interface CoursePlacement {
  at: string;
  recommendedTier: Tier;
  waivedConceptIds: string[];
  evidence: string[];
  kind: "quiz" | "declaration" | "inferred";
}

export interface CourseProgress {
  courseId: string;
  startedAt: string | null;
  lastStudiedAt: string | null;
  waivedConceptIds: string[];
  placement?: CoursePlacement;
}

export interface Settings {
  journalistDepth: boolean;
  lastTime: TimeBudget;
  lastCategory: CategoryId | "random" | null;
  lastEffort: Effort | null;
  lastMode: Mode;
}

export interface ProgressState {
  profile: LocalProfile;
  settings: Preferences;
  ai: AiSettings;
  concepts: Record<string, ConceptProgress>;
  sessions: SessionRecord[];
  recentCategoryIds: CategoryId[];
  customCategories: Category[];
  customConcepts: Concept[];
  customLessons: Lesson[];
  generationLog: GenerationLogEntry[];
  pendingPath: PendingPath | null;
  courses: Record<string, CourseProgress>;
  customCourses: Course[];
}

export interface SessionRequest {
  minutes: TimeBudget;
  category: CategoryId | "random" | null;
  effort: Effort | null;
  mode: Mode;
  journalistDepth: boolean;
}

export interface SelectionResult {
  lesson: Lesson;
  reason: string;
  blockedBy?: string[];
  generatedCandidate?: boolean;
}

export interface SelectOptions {
  now?: Date;
  /** Injected for tests. Production uses Math.random. */
  rng?: () => number;
  courses?: Record<string, CourseProgress>;
}

export interface Catalog {
  categories: Category[];
  concepts: Concept[];
  lessons: Lesson[];
  courses: Course[];
  categoryMap: Record<string, Category>;
  conceptMap: Record<string, Concept>;
  lessonMap: Record<string, Lesson>;
  courseMap: Record<string, Course>;
}
