import { isReady } from "./state";
import { isDue } from "./srs";
import type {
  Catalog,
  CategoryId,
  ConceptProgress,
  Lesson,
  LocalProfile,
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

function scoreLesson(
  lesson: Lesson,
  req: SessionRequest,
  seen: boolean,
  catalog: Catalog,
  profile?: LocalProfile,
): number {
  let score = 0;
  const target = req.minutes >= 30 ? 30 : req.minutes;
  score -= Math.abs(lesson.durationMin - target) * 4;
  if (req.effort && lesson.effort === req.effort) score += 3;
  if (req.journalistDepth && lesson.level === "journalist") score += 6;
  if (req.journalistDepth && lesson.level === "intro") score -= 5;
  if (!req.journalistDepth && lesson.level === "journalist") score -= 2;
  if (!seen) score += 4;
  const cat = catalog.conceptMap[lesson.conceptId]?.category;
  if (profile && cat) {
    if (profile.preferredTopics.includes(cat) && (!req.category || req.category === "random")) score += 2;
    if (profile.avoidTopics.includes(cat)) score -= 20;
  }
  return score;
}

function pickBest(
  pool: Lesson[],
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  catalog: Catalog,
  profile?: LocalProfile,
) {
  if (pool.length === 0) return undefined;
  return [...pool].sort((a, b) => {
    const sa = scoreLesson(a, req, Boolean(progress[a.conceptId]?.encountered), catalog, profile);
    const sb = scoreLesson(b, req, Boolean(progress[b.conceptId]?.encountered), catalog, profile);
    return sb - sa;
  })[0];
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
  profile?: LocalProfile,
): Lesson | undefined {
  const knownIds = profile?.knownConceptIds ?? [];
  const candidates = missing.flatMap((id) =>
    lessonsForConcept(catalog, id).filter((l) => durationFits(l, req.minutes)),
  );
  const ready = candidates.filter((l) => prereqsMet(l, progress, req.journalistDepth, catalog, knownIds));
  return pickBest(ready.length ? ready : candidates, req, progress, catalog, profile);
}

export function selectLesson(
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  recentCategories: CategoryId[],
  catalog: Catalog,
  profile?: LocalProfile,
): SelectionResult | null {
  const knownIds = profile?.knownConceptIds ?? [];
  const fitting = catalog.lessons.filter(
    (l) => durationFits(l, req.minutes) && inCategory(l, req.category, catalog) && notAvoided(l, catalog, profile),
  );
  const ready = fitting.filter((l) => prereqsMet(l, progress, req.journalistDepth, catalog, knownIds));

  if (req.mode === "reinforce") {
    const due = ready.filter((l) => isDue(progress[l.conceptId]));
    const seen = ready.filter((l) => progress[l.conceptId]?.encountered);
    const pick =
      pickBest(due, req, progress, catalog, profile) ??
      pickWeakest(seen, progress) ??
      pickBest(ready, req, progress, catalog, profile);
    if (!pick) return fallbackUnready(fitting, req, progress, catalog, profile);
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
    const pick = pickBest(away.length ? away : unseen.length ? unseen : ready, req, progress, catalog, profile);
    if (!pick) return fallbackUnready(fitting, req, progress, catalog, profile);
    return {
      lesson: pick,
      reason:
        away.length > 0
          ? "Outside the topics you have been studying lately."
          : "A concept you have not opened yet.",
    };
  }

  const unseen = ready.filter((l) => !progress[l.conceptId]?.encountered);
  const pick = pickBest(unseen.length ? unseen : ready, req, progress, catalog, profile);
  if (!pick) return fallbackUnready(fitting, req, progress, catalog, profile);
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
    if (u.lastQuizScore !== null && u.quizTotal > 0) return 1 + u.lastQuizScore;
    return 3;
  };
  return [...pool].sort((a, b) => rank(progress[a.conceptId]) - rank(progress[b.conceptId]))[0];
}

function fallbackUnready(
  fitting: Lesson[],
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  catalog: Catalog,
  profile?: LocalProfile,
): SelectionResult | null {
  const knownIds = profile?.knownConceptIds ?? [];
  const blocked = fitting.find((l) => missingPrereqs(l, progress, req.journalistDepth, catalog, knownIds).length > 0);
  if (!blocked) {
    const any = pickBest(fitting, req, progress, catalog, profile);
    return any ? { lesson: any, reason: "Best available unit for this time." } : null;
  }
  const missing = missingPrereqs(blocked, progress, req.journalistDepth, catalog, knownIds);
  const foundation = foundationFor(missing, req, progress, catalog, profile);
  if (!foundation) {
    const any = pickBest(fitting, req, progress, catalog, profile);
    return any ? { lesson: any, reason: "Best available unit for this time." } : null;
  }
  return {
    lesson: foundation,
    reason: `Needed first: ${catalog.conceptMap[foundation.conceptId]?.name ?? foundation.title}.`,
    blockedBy: missing,
  };
}

export function missingConceptForGeneration(
  req: SessionRequest,
  progress: Record<string, ConceptProgress>,
  catalog: Catalog,
  profile?: LocalProfile,
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
  const unseen = withoutFit.filter((c) => !progress[c.id]?.encountered);
  const pick = unseen[0] ?? withoutFit[0];
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
