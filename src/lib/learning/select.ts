import { courseForCategory, courseForConcept, courseForRequest, inferTier, lessonsInCourse } from "./curriculum";
import {
  frontierConcepts,
  isConceptUnlocked,
  isDemonstrated,
  isLessonUnlocked,
  makeReadinessContext,
  type ReadinessContext,
} from "./readiness";
import { isDue } from "./srs";
import type {
  Catalog,
  CategoryId,
  Concept,
  ConceptProgress,
  Course,
  LocalProfile,
  SelectOptions,
  SelectionResult,
  SessionRequest,
} from "./types";

export function lessonsForConcept(catalog: Catalog, conceptId: string) {
  return catalog.lessons.filter((l) => l.conceptId === conceptId);
}

export function lessonById(catalog: Catalog, id: string) {
  return catalog.lessonMap[id];
}

function ctxOf(
  catalog: Catalog,
  progress: Record<string, ConceptProgress>,
  profile: LocalProfile | undefined,
  options: SelectOptions,
): ReadinessContext {
  return makeReadinessContext(catalog, progress, profile, options.courses);
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
  lesson: import("./types").Lesson,
  req: SessionRequest,
  progress: ConceptProgress | undefined,
  catalog: Catalog,
  profile: LocalProfile | undefined,
  now: Date,
  ctx?: ReadinessContext,
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
  const concept = catalog.conceptMap[lesson.conceptId];
  const cat = concept?.category;
  if (profile && cat) {
    if (profile.preferredTopics.includes(cat) && (!req.category || req.category === "random")) score += 2;
    if (profile.avoidTopics.includes(cat)) score -= 20;
  }
  if (ctx && concept) {
    const course = courseForConcept(catalog, concept.id);
    if (course) {
      const frontier = frontierConcepts(course, ctx).map((c) => c.id);
      if (frontier[0] === concept.id) score += 8;
      else if (frontier.includes(concept.id)) score += 5;
      const tier = inferTier(concept);
      if (req.journalistDepth) score += Math.min(tier, 3);
      else score -= Math.max(0, tier - 2);
    }
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
  pool: import("./types").Lesson[],
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  catalog: Catalog,
  profile: LocalProfile | undefined,
  options: SelectOptions,
  ctx: ReadinessContext,
) {
  const now = options.now ?? new Date();
  const rng = options.rng ?? Math.random;
  const scored = pool.map((lesson) => ({
    item: lesson,
    score: scoreLesson(lesson, req, progress[lesson.conceptId], catalog, profile, now, ctx),
  }));
  const surprise = req.mode === "surprise";
  return pickFromScored(scored, rng, {
    topN: surprise ? 5 : 4,
    decisiveGap: surprise ? 2.5 : 4,
  });
}

function durationFits(lesson: { durationMin: number }, minutes: number): boolean {
  if (minutes >= 30) return lesson.durationMin <= 30;
  return lesson.durationMin <= minutes;
}

function inCategory(
  lesson: { conceptId: string },
  category: CategoryId | "random" | null,
  catalog: Catalog,
): boolean {
  if (!category || category === "random") return true;
  return catalog.conceptMap[lesson.conceptId]?.category === category;
}

function notAvoided(lesson: { conceptId: string }, catalog: Catalog, profile?: LocalProfile): boolean {
  if (!profile || profile.avoidTopics.length === 0) return true;
  const cat = catalog.conceptMap[lesson.conceptId]?.category;
  return !cat || !profile.avoidTopics.includes(cat);
}

function restrictToFrontier(
  pool: import("./types").Lesson[],
  course: Course | undefined,
  ctx: ReadinessContext,
): import("./types").Lesson[] {
  if (!course) return pool;
  const frontier = new Set(frontierConcepts(course, ctx).map((c) => c.id));
  if (frontier.size === 0) return pool;
  const hit = pool.filter((l) => frontier.has(l.conceptId));
  return hit.length ? hit : pool;
}

function pickSurpriseCourse(
  ready: import("./types").Lesson[],
  recentCategories: CategoryId[],
  catalog: Catalog,
  rng: () => number,
): { course?: Course; categoryId?: string } {
  const categories = new Set(
    ready.map((l) => catalog.conceptMap[l.conceptId]?.category).filter((id): id is string => Boolean(id)),
  );
  const buckets: { key: string; categoryId: string; course?: Course; away: boolean }[] = [];
  for (const categoryId of categories) {
    const course = courseForCategory(catalog, categoryId);
    const away = !recentCategories.includes(categoryId);
    buckets.push({ key: course?.id ?? categoryId, categoryId, course, away });
  }
  const preferred = buckets.filter((b) => b.away);
  const pool = preferred.length ? preferred : buckets;
  if (pool.length === 0) return {};
  const pick = pool[Math.floor(rng() * pool.length)];
  return { course: pick.course, categoryId: pick.categoryId };
}

export function selectLesson(
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  recentCategories: CategoryId[],
  catalog: Catalog,
  profile?: LocalProfile,
  options: SelectOptions = {},
): SelectionResult | null {
  const ctx = ctxOf(catalog, progress, profile, options);
  const fitting = catalog.lessons.filter(
    (l) => durationFits(l, req.minutes) && inCategory(l, req.category, catalog) && notAvoided(l, catalog, profile),
  );
  const ready = fitting.filter((l) => isLessonUnlocked(l, ctx));
  const rng = options.rng ?? Math.random;

  if (req.mode === "reinforce") {
    const due = ready.filter((l) => isDue(progress[l.conceptId], options.now));
    const seen = ready.filter((l) => progress[l.conceptId]?.encountered);
    const pick =
      pickBest(due, req, progress, catalog, profile, options, ctx) ??
      pickWeakest(seen, progress) ??
      pickBest(ready, req, progress, catalog, profile, options, ctx);
    if (!pick) return fallbackUnready(fitting, req, progress, catalog, profile, options, ctx);
    return {
      lesson: pick,
      reason: due.some((l) => l.id === pick.id)
        ? "A review is due and fits this gap."
        : "Nothing is due. Reviewing the weakest concept that fits.",
    };
  }

  if (req.mode === "surprise") {
    const targeted = courseForRequest(req, catalog);
    const bucket = targeted
      ? { course: targeted, categoryId: targeted.categoryId }
      : pickSurpriseCourse(ready, recentCategories, catalog, rng);
    const inBucket = ready.filter((l) => {
      if (bucket.course) return courseForConcept(catalog, l.conceptId)?.id === bucket.course.id;
      if (bucket.categoryId) return catalog.conceptMap[l.conceptId]?.category === bucket.categoryId;
      return true;
    });
    const unseen = inBucket.filter((l) => !progress[l.conceptId]?.encountered);
    const positioned = restrictToFrontier(unseen.length ? unseen : inBucket, bucket.course, ctx);
    const pick =
      pickBest(positioned, req, progress, catalog, profile, options, ctx) ??
      pickBest(ready, req, progress, catalog, profile, options, ctx);
    if (!pick) return fallbackUnready(fitting, req, progress, catalog, profile, options, ctx);
    const course = courseForConcept(catalog, pick.conceptId);
    return {
      lesson: pick,
      reason: course
        ? `A ${bucket.course ? "fresh field" : "different course"}, at the next unit you can actually hold.`
        : recentCategories.includes(catalog.conceptMap[pick.conceptId]?.category ?? "")
          ? "A concept you have not opened yet."
          : "Outside the topics you have been studying lately.",
    };
  }

  const course = courseForRequest(req, catalog);
  const unseen = ready.filter((l) => !progress[l.conceptId]?.encountered);
  const positioned = restrictToFrontier(unseen.length ? unseen : ready, course, ctx);
  const pick = pickBest(positioned, req, progress, catalog, profile, options, ctx);
  if (!pick) return fallbackUnready(fitting, req, progress, catalog, profile, options, ctx);
  return {
    lesson: pick,
    reason: course
      ? unseen.length
        ? "Next unit in this course whose prerequisites you already hold."
        : "You have seen the open units that fit. Revisiting the best match."
      : unseen.length
        ? "A new concept whose prerequisites you already hold."
        : "You have seen the new units that fit. Revisiting the best match.",
  };
}

function pickWeakest(
  pool: import("./types").Lesson[],
  progress: Record<string, ConceptProgress>,
) {
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
  fitting: import("./types").Lesson[],
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  catalog: Catalog,
  profile: LocalProfile | undefined,
  options: SelectOptions,
  ctx: ReadinessContext,
): SelectionResult | null {
  const blocked = fitting.find((l) => !isLessonUnlocked(l, ctx));
  if (!blocked) {
    const any = pickBest(fitting, req, progress, catalog, profile, options, ctx);
    return any ? { lesson: any, reason: "Best available unit for this time." } : null;
  }
  const concept = catalog.conceptMap[blocked.conceptId];
  const missing = (concept?.prerequisites ?? blocked.prerequisites).filter(
    (id) => !isDemonstrated(id, ctx, inferTier(concept)),
  );
  const candidates = missing.flatMap((id) =>
    lessonsForConcept(catalog, id).filter((l) => durationFits(l, req.minutes) && isLessonUnlocked(l, ctx)),
  );
  const foundation = pickBest(candidates, req, progress, catalog, profile, options, ctx);
  if (!foundation) {
    const any = pickBest(fitting.filter((l) => isLessonUnlocked(l, ctx)), req, progress, catalog, profile, options, ctx);
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
  options: SelectOptions = {},
): number {
  const ctx = ctxOf(catalog, progress, profile, options);
  let score = 0;
  const readyPrereqs = concept.prerequisites.filter((id) => isDemonstrated(id, ctx, inferTier(concept)));
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

  const tier = inferTier(concept);
  if (tier <= 1) score += 2;
  if (tier === 2) score += 2;
  if (req.journalistDepth) score += Math.min(tier, 3);
  else if (tier >= 4) score -= 6;

  const course = courseForConcept(catalog, concept.id);
  if (course) {
    const frontier = frontierConcepts(course, ctx).map((c) => c.id);
    if (frontier.includes(concept.id)) score += 6;
    if (tier >= 4 && frontier.every((id) => inferTier(catalog.conceptMap[id]) <= 1)) score -= 20;
  }

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
  const ctx = ctxOf(catalog, progress, profile, options);
  const concepts = catalog.concepts.filter((c) => {
    if (req.category && req.category !== "random" && c.category !== req.category) return false;
    if (profile?.avoidTopics.includes(c.category)) return false;
    return isConceptUnlocked(c, ctx);
  });
  const withoutFit = concepts.filter((c) => {
    const units = lessonsForConcept(catalog, c.id).filter((l) => durationFits(l, req.minutes));
    return units.length === 0;
  });
  if (withoutFit.length === 0) return null;
  const scored = withoutFit.map((concept) => ({
    item: concept,
    score: scoreMissingConcept(concept, req, progress, recentCategories, catalog, profile, options),
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
  _journalist: boolean,
  knownIds: string[],
  courses?: SelectOptions["courses"],
) {
  const profile = { displayName: "", preferredTopics: [], knownConceptIds: knownIds, avoidTopics: [], customInterests: [] };
  const ctx = makeReadinessContext(catalog, progress, profile, courses);
  return catalog.concepts.filter((c) => {
    if (progress[c.id]?.encountered) return false;
    return isConceptUnlocked(c, ctx);
  });
}

export { lessonsInCourse };
