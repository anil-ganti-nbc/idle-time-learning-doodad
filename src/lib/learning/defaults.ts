import type { AiSettings, LocalProfile, Preferences, ProgressState } from "./types";

export const defaultProfile: LocalProfile = {
  displayName: "",
  preferredTopics: [],
  knownConceptIds: [],
  avoidTopics: [],
  customInterests: [],
};

export const defaultSettings: Preferences = {
  journalistDepth: false,
  lastTime: 10,
  lastCategory: null,
  lastEffort: null,
  lastMode: "explore",
  preferredDuration: 10,
  preferredEffort: null,
};

export const defaultAi: AiSettings = {
  enabled: false,
  provider: "xai",
  model: "grok-4.5",
  policy: "manual",
  maxPerDay: 8,
  maxPerSession: 2,
};

export const defaultState = (): Omit<
  ProgressState,
  never
> => ({
  profile: { ...defaultProfile, preferredTopics: [], knownConceptIds: [], avoidTopics: [], customInterests: [] },
  settings: { ...defaultSettings },
  ai: { ...defaultAi },
  concepts: {},
  sessions: [],
  recentCategoryIds: [],
  customCategories: [],
  customConcepts: [],
  customLessons: [],
  generationLog: [],
  pendingPath: null,
});
