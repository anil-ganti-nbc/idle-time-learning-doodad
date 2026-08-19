import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultAi, defaultProfile, defaultSettings, defaultState } from "./defaults";
import { importExport, type ImportMode } from "./export";
import { emptyProgress, scheduleReview } from "./srs";
import type {
  AiSettings,
  Category,
  CategoryId,
  Concept,
  ConceptProgress,
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
}

function migrateV1(persisted: unknown): ProgressState {
  const p = (persisted ?? {}) as Partial<ProgressState> & {
    settings?: Partial<Preferences>;
    concepts?: Record<string, ConceptProgress>;
    sessions?: SessionRecord[];
    recentCategoryIds?: string[];
  };
  const concepts: Record<string, ConceptProgress> = {};
  for (const [id, row] of Object.entries(p.concepts ?? {})) {
    concepts[id] = {
      ...emptyProgress(id),
      ...row,
      reviewHistory: row.reviewHistory ?? [],
      updatedAt: row.updatedAt ?? row.lastStudiedAt ?? null,
    };
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
        const prev = get().concepts[input.conceptId] ?? emptyProgress(input.conceptId);
        const schedule = scheduleReview(prev, input.understanding, input.quizCorrect, input.quizTotal);
        const completedAt = new Date().toISOString();
        const next: ConceptProgress = {
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
        set((s) => ({
          concepts: { ...s.concepts, [input.conceptId]: next },
          sessions: [session, ...s.sessions].slice(0, 800),
          recentCategoryIds: [
            input.categoryId,
            ...s.recentCategoryIds.filter((c) => c !== input.categoryId),
          ].slice(0, 8),
        }));
        return session;
      },
      upsertCategory: (category) =>
        set((s) => ({
          customCategories: upsert(s.customCategories, category),
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
        set((s) => ({ customConcepts: upsert(s.customConcepts, concept) })),
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
        set(result.state);
        return { warnings: result.warnings, backupAt: result.backup.exported_at };
      },
      resetAll: () => set(defaultState()),
    }),
    {
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
        pendingPath: s.pendingPath,
      }),
    },
  ),
);

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
  };
}

export function generationsToday(log: { at: string; ok: boolean }[], now = new Date()): number {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return log.filter((e) => e.ok && new Date(e.at).getTime() >= start.getTime()).length;
}
