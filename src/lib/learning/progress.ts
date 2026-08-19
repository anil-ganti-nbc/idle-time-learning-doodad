import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { emptyCourseProgress } from "./curriculum";
import { defaultAi, defaultProfile, defaultSettings, defaultState } from "./defaults";
import { importExport, saveRollback, type ImportMode } from "./export";
import { PROGRESS_PERSIST_VERSION, PROGRESS_STORAGE_KEY } from "./persistence";
import { persistStorage } from "./storage";
import { emptyProgress, normalizeProgressRow, quizRatio, reviewQuality, scheduleReviewFull } from "./srs";
import type {
  AiSettings,
  AssessmentItemRecord,
  Category,
  CategoryId,
  Concept,
  ConceptProgress,
  Course,
  CoursePlacement,
  CourseProgress,
  GenerationLogEntry,
  Lesson,
  LessonFeedbackVerdict,
  LessonVersion,
  LocalProfile,
  Mode,
  PendingPath,
  Preferences,
  ProgressState,
  SessionRecord,
  TimeBudget,
  Understanding,
} from "./types";
import { appendAssessmentItems, emptyAssessmentHistory, markLaterPoorRating } from "@/lib/quiz/history";

interface ProgressStore extends ProgressState {
  setJournalist: (on: boolean) => void;
  rememberRouter: (
    partial: Partial<Pick<Preferences, "lastTime" | "lastCategory" | "lastEffort" | "lastMode">>,
  ) => void;
  updateProfile: (partial: Partial<LocalProfile>) => void;
  updateSettings: (partial: Partial<Preferences>) => void;
  updateAi: (partial: Partial<AiSettings>) => void;
  recordSession: (input: {
    lessonId: string;
    conceptId: string;
    categoryId: CategoryId;
    startedAt: string;
    estimatedMinutes: number;
    actualMinutes: number;
    quizCorrect: number;
    quizTotal: number;
    understanding: Understanding;
    mode: Mode;
    timeBudget: TimeBudget;
    sourceType: SessionRecord["sourceType"];
    sourceProvider?: string;
    courseId?: string;
    assessmentItems?: AssessmentItemRecord[];
    positions?: number[];
  }) => SessionRecord;
  upsertCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  upsertConcept: (concept: Concept) => void;
  removeConcept: (id: string) => void;
  upsertLesson: (lesson: Lesson) => void;
  archiveLesson: (id: string) => void;
  applyLessonVersion: (lessonId: string, version: LessonVersion, patch: Partial<Lesson>) => void;
  addFeedback: (lessonId: string, verdict: LessonFeedbackVerdict) => void;
  logGeneration: (entry: GenerationLogEntry) => void;
  setPendingPath: (path: PendingPath | null) => void;
  approvePath: (path: PendingPath) => void;
  replaceState: (state: ProgressState) => void;
  importBundle: (raw: unknown, mode?: ImportMode) => { warnings: string[]; backupAt: string };
  resetAll: () => void;
  applyPlacement: (courseId: string, placement: CoursePlacement) => void;
  declareConceptsKnown: (courseId: string, conceptIds: string[], placement: CoursePlacement) => void;
  touchCourse: (courseId: string, at?: string) => void;
}

function migratePersisted(persisted: unknown): ProgressState {
  const p = (persisted ?? {}) as Partial<ProgressState> & {
    settings?: Partial<Preferences>;
    concepts?: Record<string, ConceptProgress>;
    sessions?: SessionRecord[];
    recentCategoryIds?: string[];
  };
  const concepts: Record<string, ConceptProgress> = {};
  for (const [id, row] of Object.entries(p.concepts ?? {})) {
    concepts[id] = normalizeProgressRow({ ...row, conceptId: id });
  }
  return {
    ...defaultState(),
    profile: { ...defaultProfile, ...p.profile },
    settings: { ...defaultSettings, ...p.settings },
    ai: { ...defaultAi, ...p.ai },
    concepts,
    sessions: (p.sessions ?? []).map((s) => ({
      ...s,
      quizTotal: s.quizTotal ?? 3,
      sourceType: s.sourceType ?? "seed",
      categoryId: s.categoryId ?? "history",
    })),
    recentCategoryIds: p.recentCategoryIds ?? [],
    customCategories: p.customCategories ?? [],
    customConcepts: p.customConcepts ?? [],
    customLessons: p.customLessons ?? [],
    generationLog: p.generationLog ?? [],
    pendingPath: p.pendingPath ?? null,
    courses: p.courses ?? {},
    customCourses: p.customCourses ?? [],
    assessmentHistory: (p as ProgressState).assessmentHistory ?? emptyAssessmentHistory(),
  };
}

export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...defaultState(),
      setJournalist: (on) => set((s) => ({ settings: { ...s.settings, journalistDepth: on } })),
      rememberRouter: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),
      updateProfile: (partial) => set((s) => ({ profile: { ...s.profile, ...partial } })),
      updateSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),
      updateAi: (partial) => set((s) => ({ ai: { ...s.ai, ...partial } })),
      recordSession: (input) => {
        const prev = normalizeProgressRow(get().concepts[input.conceptId] ?? emptyProgress(input.conceptId));
        const quality = reviewQuality(input.understanding, input.quizCorrect, input.quizTotal);
        const lapseCount = prev.lapseCount + (quality <= 1 ? 1 : 0);
        const schedule = scheduleReviewFull({
          prev,
          understanding: input.understanding,
          quizCorrect: input.quizCorrect,
          quizTotal: input.quizTotal,
          lapseCount,
        });
        const completedAt = new Date().toISOString();
        const next: ConceptProgress = {
          ...prev,
          encountered: true,
          understanding: input.understanding,
          quizCorrect: prev.quizCorrect + input.quizCorrect,
          quizTotal: prev.quizTotal + input.quizTotal,
          lastQuizCorrect: input.quizCorrect,
          lastQuizTotal: input.quizTotal,
          lastQuizScore: quizRatio(input.quizCorrect, input.quizTotal),
          estimatedMinutes: prev.estimatedMinutes + input.estimatedMinutes,
          actualMinutes: prev.actualMinutes + input.actualMinutes,
          lastStudiedAt: completedAt,
          timesStudied: prev.timesStudied + 1,
          lapseCount,
          ...schedule,
          reviewHistory: [
            ...prev.reviewHistory,
            {
              at: completedAt,
              quizCorrect: input.quizCorrect,
              quizTotal: input.quizTotal,
              understanding: input.understanding,
              intervalDays: schedule.intervalDays,
              ease: schedule.ease,
            },
          ].slice(-24),
          updatedAt: completedAt,
        };
        const session: SessionRecord = {
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
          sourceProvider: input.sourceProvider,
        };
        set((s) => {
          const courses = { ...s.courses };
          if (input.courseId) {
            const prev = courses[input.courseId] ?? emptyCourseProgress(input.courseId);
            courses[input.courseId] = {
              ...prev,
              startedAt: prev.startedAt ?? completedAt,
              lastStudiedAt: completedAt,
            };
          }
          return {
            concepts: { ...s.concepts, [input.conceptId]: next },
            sessions: [session, ...s.sessions].slice(0, 800),
            recentCategoryIds: [
              input.categoryId,
              ...s.recentCategoryIds.filter((c) => c !== input.categoryId),
            ].slice(0, 8),
            courses,
            assessmentHistory: markLaterPoorRating(
              appendAssessmentItems(s.assessmentHistory, input.assessmentItems ?? [], input.positions ?? []),
              input.conceptId,
              input.understanding,
            ),
          };
        });
        return session;
      },
      upsertCategory: (category) =>
        set((s) => ({
          customCategories: upsert(s.customCategories, stamp(category)),
        })),
      removeCategory: (id) =>
        set((s) => ({
          customCategories: s.customCategories.filter((c) => c.id !== id),
          customConcepts: s.customConcepts.filter((c) => c.category !== id),
          customLessons: s.customLessons.filter((l) => {
            const concept = s.customConcepts.find((c) => c.id === l.conceptId);
            return concept?.category !== id;
          }),
        })),
      upsertConcept: (concept) =>
        set((s) => ({ customConcepts: upsert(s.customConcepts, stamp(concept)) })),
      removeConcept: (id) =>
        set((s) => ({
          customConcepts: s.customConcepts.filter((c) => c.id !== id),
          customLessons: s.customLessons.filter((l) => l.conceptId !== id),
        })),
      upsertLesson: (lesson) =>
        set((s) => ({ customLessons: upsert(s.customLessons, { ...lesson, updatedAt: new Date().toISOString() }) })),
      archiveLesson: (id) =>
        set((s) => ({
          customLessons: s.customLessons.map((l) =>
            l.id === id ? { ...l, archived: true, updatedAt: new Date().toISOString() } : l,
          ),
        })),
      applyLessonVersion: (lessonId, version, patch) =>
        set((s) => {
          const existing = s.customLessons.find((l) => l.id === lessonId);
          if (existing) {
            return {
              customLessons: s.customLessons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      ...patch,
                      versions: [...(l.versions ?? []), version],
                      updatedAt: new Date().toISOString(),
                    }
                  : l,
              ),
            };
          }
          return {
            customLessons: [
              ...s.customLessons,
              {
                ...(patch as Lesson),
                id: lessonId,
                versions: [version],
                updatedAt: new Date().toISOString(),
                custom: true,
              } as Lesson,
            ],
          };
        }),
      addFeedback: (lessonId, verdict) =>
        set((s) => {
          const entry = { verdict, at: new Date().toISOString() };
          const existing = s.customLessons.find((l) => l.id === lessonId);
          if (existing) {
            return {
              customLessons: s.customLessons.map((l) =>
                l.id === lessonId ? { ...l, feedback: [...(l.feedback ?? []), entry] } : l,
              ),
            };
          }
          return s;
        }),
      logGeneration: (entry) =>
        set((s) => ({ generationLog: [entry, ...s.generationLog].slice(0, 400) })),
      setPendingPath: (path) => set({ pendingPath: path }),
      approvePath: (path) =>
        set((s) => ({
          customCategories: upsert(s.customCategories, {
            id: path.id,
            name: path.title,
            blurb: path.blurb,
            custom: true,
          }),
          customConcepts: [
            ...s.customConcepts.filter((c) => c.category !== path.id),
            ...path.concepts.map((c) => ({ ...c, category: path.id, custom: true })),
          ],
          pendingPath: null,
        })),
      replaceState: (state) => set(state),
      importBundle: (raw, mode = "merge") => {
        const result = importExport(snapshot(get()), raw, mode);
        if (mode === "replace") saveRollback(result.backup);
        set(result.state);
        return { warnings: result.warnings, backupAt: result.backup.exported_at };
      },
      resetAll: () => set(defaultState()),
      applyPlacement: (courseId, placement) =>
        set((s) => {
          const prev = s.courses[courseId] ?? emptyCourseProgress(courseId);
          return {
            courses: {
              ...s.courses,
              [courseId]: {
                ...prev,
                startedAt: prev.startedAt ?? placement.at,
                lastStudiedAt: placement.at,
                waivedConceptIds: [...new Set([...prev.waivedConceptIds, ...placement.waivedConceptIds])],
                placement,
              },
            },
          };
        }),
      declareConceptsKnown: (courseId, conceptIds, placement) =>
        set((s) => {
          const prev = s.courses[courseId] ?? emptyCourseProgress(courseId);
          return {
            courses: {
              ...s.courses,
              [courseId]: {
                ...prev,
                startedAt: prev.startedAt ?? placement.at,
                waivedConceptIds: [...new Set([...prev.waivedConceptIds, ...conceptIds, ...placement.waivedConceptIds])],
                placement,
              },
            },
          };
        }),
      touchCourse: (courseId, at) =>
        set((s) => {
          const stampAt = at ?? new Date().toISOString();
          const prev = s.courses[courseId] ?? emptyCourseProgress(courseId);
          return {
            courses: {
              ...s.courses,
              [courseId]: { ...prev, startedAt: prev.startedAt ?? stampAt, lastStudiedAt: stampAt },
            },
          };
        }),
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      version: PROGRESS_PERSIST_VERSION,
      storage: createJSONStorage(() => persistStorage()),
      migrate: (persisted) => migratePersisted(persisted),
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
        pendingPath: s.pendingPath,
        courses: s.courses,
        customCourses: s.customCourses,
        assessmentHistory: s.assessmentHistory,
      }),
    },
  ),
);

function stamp<T extends { createdAt?: string; updatedAt?: string }>(item: T): T {
  const now = new Date().toISOString();
  return {
    ...item,
    createdAt: item.createdAt ?? now,
    updatedAt: now,
  };
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx === -1) return [...list, item];
  const next = [...list];
  next[idx] = { ...next[idx], ...item };
  return next;
}

function snapshot(s: ProgressState): ProgressState {
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
    assessmentHistory: s.assessmentHistory,
  };
}

export { generationsToday, isBillableAttempt } from "./accounting";
