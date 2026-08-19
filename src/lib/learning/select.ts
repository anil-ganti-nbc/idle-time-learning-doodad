import { isReady } from "./state";
import { isDue } from "./srs";
import type {
  Catalog,
  CategoryId,
  Concept,
  ConceptProgress,
  Lesson,
  LocalProfile,
  SelectOptions,
  SelectionResult,
  SessionRequest,
} from "./types";

export function lessonsForConcept(catalog: Catalog, conceptId: string): Lesson[] {
  return catalog.lessons.filter((l) => l.conceptId === conceptId);
}

export function lessonById(catalog: Catalog, id: string): Lesson | undefined {
  return catalog.lessonMap[id];
}

function introIds(catalog: Catalog): Set<string> {
  return new Set(catalog.concepts.filter((c) => c.level === "intro").map((c) => c.id));
}

function knownEnough(
  conceptId: string,
  progress: Record<string, ConceptProgress>,
  journalist: boolean,
  catalog: Catalog,
  knownIds: string[],
): boolean {
  return isReady(conceptId, progress, journalist, knownIds, introIds(catalog));
}

function prereqsMet(
  lesson: Lesson,
  progress: Record<string, ConceptProgress>,
  journalist: boolean,
  catalog: Catalog,
  knownIds: string[],
): boolean {
  return lesson.prerequisites.every((id) => knownEnough(id, progress, journalist, catalog, knownIds));
}

function missingPrereqs(
  lesson: Lesson,
  progress: Record<string, ConceptProgress>,
  journalist: boolean,
  catalog: Catalog,
  knownIds: string[],
) {
  return lesson.prerequisites.filter((id) => !knownEnough(id, progress, journalist, catalog, knownIds));
}

function durationFits(lesson: Lesson, minutes: number): boolean {
  if (minutes >= 30) return lesson.durationMin <= 30;
  return lesson.durationMin <= minutes;
}

/** Hours since last encounter. Used so the same unit does not win every gap. */
export function recencyPenalty(progress: ConceptProgress | undefined, now: Date): number {
  if (!progress?.lastStudiedAt) return 0;
  const hours = (now.getTime() - new Date(progress.lastStudiedAt).getTime()) / 3_600_000;
  if (hours < 1) return 12;
  if (hours < 6) return 8;
  if (hours < 24) return 5;
  if (hours < 72) return 2;
  return 0;
}

export function scoreLesson(
  lesson: Lesson,
  req: SessionRequest,
  progress: ConceptProgress | undefined,
  catalog: Catalog,
  profile: LocalProfile | undefined,
  now: Date,
): number {
  let score = 0;
  const target = req.minutes >= 30 ? 30 : req.minutes;
  score -= Math.abs(lesson.durationMin - target) * 4;
  if (req.effort && lesson.effort === req.effort) score += 3;
  if (req.journalistDepth && lesson.level === "journalist") score += 6;
  if (req.journalistDepth && lesson.level === "intro") score -= 5;
  if (!req.journalistDepth && lesson.level === "journalist") score -= 2;
  if (!progress?.encountered) score += 4;
  score -= recencyPenalty(progress, now);
  if (progress?.understanding === "didnt_get_it") score += 1;
  const cat = catalog.conceptMap[lesson.conceptId]?.category;
  if (profile && cat) {
    if (profile.preferredTopics.includes(cat) && (!req.category || req.category === "random")) score += 2;
    if (profile.avoidTopics.includes(cat)) score -= 20;
  }
  return score;
}

export function pickFromScored<T>(
  scored: { item: T; score: number }[],
  rng: () => number = Math.random,
  opts?: { topN?: number; decisiveGap?: number },
): T | undefined {
  if (scored.length === 0) return undefined;
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  if (sorted.length === 1) return sorted[0].item;
  const decisiveGap = opts?.decisiveGap ?? 4;
  if (sorted[0].score - sorted[1].score >= decisiveGap) return sorted[0].item;
  const top = sorted.slice(0, opts?.topN ?? 4);
  const floor = top[top.length - 1].score;
  const weights = top.map((row) => Math.pow(2, (row.score - floor) / 2));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let ticket = rng() * total;
  for (let i = 0; i < top.length; i++) {
    ticket -= weights[i];
    if (ticket <= 0) return top[i].item;
  }
  return top[0].item;
}

function pickBest(
  pool: Lesson[],
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  catalog: Catalog,
  profile: LocalProfile | undefined,
  options: SelectOptions,
) {
  const now = options.now ?? new Date();
  const rng = options.rng ?? Math.random;
  const scored = pool.map((lesson) => ({
    item: lesson,
    score: scoreLesson(lesson, req, progress[lesson.conceptId], catalog, profile, now),
  }));
  const surprise = req.mode === "surprise";
  return pickFromScored(scored, rng, {
    topN: surprise ? 5 : 4,
    decisiveGap: surprise ? 2.5 : 4,
  });
}

function inCategory(lesson: Lesson, category: CategoryId | "random" | null, catalog: Catalog): boolean {
  if (!category || category === "random") return true;
  return catalog.conceptMap[lesson.conceptId]?.category === category;
}

function notAvoided(lesson: Lesson, catalog: Catalog, profile?: LocalProfile): boolean {
  if (!profile || profile.avoidTopics.length === 0) return true;
  const cat = catalog.conceptMap[lesson.conceptId]?.category;
  return !cat || !profile.avoidTopics.includes(cat);
}

function foundationFor(
  missing: string[],
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  catalog: Catalog,
  profile: LocalProfile | undefined,
  options: SelectOptions,
): Lesson | undefined {
  const knownIds = profile?.knownConceptIds ?? [];
  const candidates = missing.flatMap((id) =>
    lessonsForConcept(catalog, id).filter((l) => durationFits(l, req.minutes)),
  );
  const ready = candidates.filter((l) => prereqsMet(l, progress, req.journalistDepth, catalog, knownIds));
  return pickBest(ready.length ? ready : candidates, req, progress, catalog, profile, options);
}

export function selectLesson(
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  recentCategories: CategoryId[],
  catalog: Catalog,
  profile?: LocalProfile,
  options: SelectOptions = {},
): SelectionResult | null {
  const knownIds = profile?.knownConceptIds ?? [];
  const fitting = catalog.lessons.filter(
    (l) => durationFits(l, req.minutes) && inCategory(l, req.category, catalog) && notAvoided(l, catalog, profile),
  );
  const ready = fitting.filter((l) => prereqsMet(l, progress, req.journalistDepth, catalog, knownIds));

  if (req.mode === "reinforce") {
    const due = ready.filter((l) => isDue(progress[l.conceptId], options.now));
    const seen = ready.filter((l) => progress[l.conceptId]?.encountered);
    const pick =
      pickBest(due, req, progress, catalog, profile, options) ??
      pickWeakest(seen, progress) ??
      pickBest(ready, req, progress, catalog, profile, options);
    if (!pick) return fallbackUnready(fitting, req, progress, catalog, profile, options);
    return {
      lesson: pick,
      reason: due.some((l) => l.id === pick.id)
        ? "A review is due and fits this gap."
        : "Nothing is due. Reviewing the weakest concept that fits.",
    };
  }

  if (req.mode === "surprise") {
    const unseen = ready.filter((l) => !progress[l.conceptId]?.encountered);
    const away = unseen.filter((l) => {
      const cat = catalog.conceptMap[l.conceptId]?.category;
      return cat ? !recentCategories.includes(cat) : true;
    });
    const pick = pickBest(
      away.length ? away : unseen.length ? unseen : ready,
      req,
      progress,
      catalog,
      profile,
      options,
    );
    if (!pick) return fallbackUnready(fitting, req, progress, catalog, profile, options);
    return {
      lesson: pick,
      reason:
        away.length > 0
          ? "Outside the topics you have been studying lately."
          : "A concept you have not opened yet.",
    };
  }

  const unseen = ready.filter((l) => !progress[l.conceptId]?.encountered);
  const pick = pickBest(unseen.length ? unseen : ready, req, progress, catalog, profile, options);
  if (!pick) return fallbackUnready(fitting, req, progress, catalog, profile, options);
  return {
    lesson: pick,
    reason: unseen.length
      ? "A new concept whose prerequisites you already hold."
      : "You have seen the new units that fit. Revisiting the best match.",
  };
}

function pickWeakest(
  pool: Lesson[],
  progress: Record<string, ConceptProgress>,
): Lesson | undefined {
  if (pool.length === 0) return undefined;
  const rank = (u: ConceptProgress | undefined) => {
    if (!u) return 0;
    if (u.understanding === "didnt_get_it") return 0;
    if (u.understanding === "mostly") return 1;
    if (u.lastQuizScore !== null) return 1 + u.lastQuizScore;
    return 3;
  };
  return [...pool].sort((a, b) => rank(progress[a.conceptId]) - rank(progress[b.conceptId]))[0];
}

function fallbackUnready(
  fitting: Lesson[],
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  catalog: Catalog,
  profile: LocalProfile | undefined,
  options: SelectOptions,
): SelectionResult | null {
  const knownIds = profile?.knownConceptIds ?? [];
  const blocked = fitting.find((l) => missingPrereqs(l, progress, req.journalistDepth, catalog, knownIds).length > 0);
  if (!blocked) {
    const any = pickBest(fitting, req, progress, catalog, profile, options);
    return any ? { lesson: any, reason: "Best available unit for this time." } : null;
  }
  const missing = missingPrereqs(blocked, progress, req.journalistDepth, catalog, knownIds);
  const foundation = foundationFor(missing, req, progress, catalog, profile, options);
  if (!foundation) {
    const any = pickBest(fitting, req, progress, catalog, profile, options);
    return any ? { lesson: any, reason: "Best available unit for this time." } : null;
  }
  return {
    lesson: foundation,
    reason: `Needed first: ${catalog.conceptMap[foundation.conceptId]?.name ?? foundation.title}.`,
    blockedBy: missing,
  };
}

export function scoreMissingConcept(
  concept: Concept,
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  recentCategories: CategoryId[],
  catalog: Catalog,
  profile?: LocalProfile,
): number {
  let score = 0;
  const knownIds = profile?.knownConceptIds ?? [];
  const readyPrereqs = concept.prerequisites.filter((id) =>
    knownEnough(id, progress, req.journalistDepth, catalog, knownIds),
  );
  score += readyPrereqs.length * 2;
  if (concept.prerequisites.length === 0) score += 1;

  if (profile?.preferredTopics.includes(concept.category)) score += 5;
  if (profile?.avoidTopics.includes(concept.category)) score -= 20;
  if (req.category && req.category !== "random" && concept.category === req.category) score += 3;

  const parent = concept.parentId ? progress[concept.parentId] : undefined;
  if (parent?.understanding === "didnt_get_it" || (parent && (parent.lastQuizScore ?? 1) < 0.67)) {
    score += 4;
  }
  if (parent?.understanding === "got_it" || parent?.understanding === "mostly") score += 3;

  if (!progress[concept.id]?.encountered) score += 4;
  if (recentCategories.includes(concept.category)) score -= 3;

  if (concept.level === "intro") score += 1;
  if (concept.level === "core") score += 2;
  if (req.journalistDepth && concept.level === "journalist") score += 4;
  if (req.journalistDepth && concept.level === "intro") score -= 3;
  if (!req.journalistDepth && concept.level === "journalist") score -= 2;

  const siblings = catalog.concepts.filter(
    (c) => c.parentId === concept.parentId && c.category === concept.category && c.id !== concept.id,
  );
  const siblingLessons = siblings.flatMap((c) => lessonsForConcept(catalog, c.id));
  if (siblings.length > 0 && siblingLessons.length <= siblings.length) score += 2;

  let depth = 0;
  let walk = concept.parentId;
  while (walk) {
    depth += 1;
    walk = catalog.conceptMap[walk]?.parentId;
  }
  if (depth === 1) score += 1;

  return score;
}

export function missingConceptForGeneration(
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  recentCategories: CategoryId[],
  catalog: Catalog,
  profile?: LocalProfile,
  options: SelectOptions = {},
): { conceptId: string; reason: string } | null {
  const knownIds = profile?.knownConceptIds ?? [];
  const concepts = catalog.concepts.filter((c) => {
    if (req.category && req.category !== "random" && c.category !== req.category) return false;
    if (profile?.avoidTopics.includes(c.category)) return false;
    return c.prerequisites.every((id) => knownEnough(id, progress, req.journalistDepth, catalog, knownIds));
  });
  const withoutFit = concepts.filter((c) => {
    const units = lessonsForConcept(catalog, c.id).filter((l) => durationFits(l, req.minutes));
    return units.length === 0;
  });
  if (withoutFit.length === 0) return null;
  const scored = withoutFit.map((concept) => ({
    item: concept,
    score: scoreMissingConcept(concept, req, progress, recentCategories, catalog, profile),
  }));
  const pick = pickFromScored(scored, options.rng ?? Math.random, { topN: 4, decisiveGap: 3 });
  if (!pick) return null;
  return { conceptId: pick.id, reason: `No ${req.minutes}-minute unit exists for ${pick.name}.` };
}

export function childConcepts(catalog: Catalog, conceptId: string) {
  return catalog.concepts.filter((c) => c.parentId === conceptId);
}

export function categoryConcepts(catalog: Catalog, category: CategoryId) {
  return catalog.concepts.filter((c) => c.category === category);
}

export function nextConcepts(
  catalog: Catalog,
  progress: Record<string, ConceptProgress>,
  journalist: boolean,
  knownIds: string[],
) {
  return catalog.concepts.filter((c) => {
    if (progress[c.id]?.encountered) return false;
    return c.prerequisites.every((id) => knownEnough(id, progress, journalist, catalog, knownIds));
  });
}
