import { courseForConcept, coursesForCategory, inferTier, moduleForConcept, prereqClosure } from "./curriculum";
import type {
  Catalog,
  Concept,
  ConceptProgress,
  Course,
  CourseProgress,
  LocalProfile,
  Tier,
} from "./types";

export interface ReadinessContext {
  catalog: Catalog;
  progress: Record<string, ConceptProgress>;
  profile?: LocalProfile;
  courses?: Record<string, CourseProgress>;
}

export function evidenceScore(progress: ConceptProgress | undefined): number {
  if (!progress?.encountered) return 0;
  const last = progress.lastQuizScore ?? 0;
  const lifetime = progress.quizTotal > 0 ? progress.quizCorrect / progress.quizTotal : 0;
  const rating =
    progress.understanding === "got_it"
      ? 1
      : progress.understanding === "mostly"
        ? 0.62
        : progress.understanding === "didnt_get_it"
          ? 0.12
          : 0.35;
  const repeats = Math.min(progress.timesStudied, 3) / 3;
  const lapse = Math.min(progress.lapseCount ?? 0, 4) * 0.08;
  return clamp(0.34 * last + 0.18 * lifetime + 0.33 * rating + 0.15 * repeats - lapse, 0, 1);
}

export function thresholdFor(dependentTier: Tier): { score: number; minSessions: number } {
  if (dependentTier <= 1) return { score: 0.4, minSessions: 1 };
  if (dependentTier === 2) return { score: 0.52, minSessions: 1 };
  if (dependentTier === 3) return { score: 0.62, minSessions: 1 };
  return { score: 0.7, minSessions: 2 };
}

export function isWaived(conceptId: string, ctx: ReadinessContext): boolean {
  if (ctx.profile?.knownConceptIds.includes(conceptId)) return true;
  for (const row of Object.values(ctx.courses ?? {})) {
    if (row.waivedConceptIds.includes(conceptId)) return true;
    if (row.placement?.waivedConceptIds.includes(conceptId)) return true;
  }
  return false;
}

/**
 * Journalist depth is intentionally unused here. It may rank deeper unlocked
 * units higher; it must not satisfy a prerequisite.
 */
export function isDemonstrated(conceptId: string, ctx: ReadinessContext, dependentTier: Tier): boolean {
  if (isWaived(conceptId, ctx)) return true;
  if (implicitlySatisfied(conceptId, ctx)) return true;
  const progress = ctx.progress[conceptId];
  if (!progress?.encountered) return false;
  const need = thresholdFor(dependentTier);
  if ((progress.timesStudied ?? 0) < need.minSessions) {
    if (dependentTier >= 4) return false;
    if (dependentTier === 3 && evidenceScore(progress) < 0.78) return false;
  }
  return evidenceScore(progress) >= need.score;
}

function implicitlySatisfied(conceptId: string, ctx: ReadinessContext): boolean {
  const concept = ctx.catalog.conceptMap[conceptId];
  if (!concept || inferTier(concept) > 1) return false;
  const course = courseForConcept(ctx.catalog, conceptId);
  if (!course) return false;
  for (const other of course.modules.flatMap((m) => m.conceptIds)) {
    if (other === conceptId) continue;
    if (!prereqClosure(ctx.catalog, other).has(conceptId)) continue;
    const row = ctx.progress[other];
    if (row?.encountered && evidenceScore(row) >= thresholdFor(2).score) return true;
  }
  return false;
}

export function isModuleSpineCleared(
  moduleId: string,
  course: Course,
  ctx: ReadinessContext,
  forTier: Tier,
): boolean {
  const mod = course.modules.find((m) => m.id === moduleId);
  if (!mod) return false;
  const spine = mod.spineIds.length > 0 ? mod.spineIds : mod.conceptIds.slice(0, 1);
  return spine.every((id) => isDemonstrated(id, ctx, forTier));
}

export function isConceptUnlocked(concept: Concept, ctx: ReadinessContext): boolean {
  // Already-started or waived units stay available for review. Journalist
  // depth is not consulted — it cannot open a concept the graph has not.
  // Module order is a hint; the concept prerequisite graph is authoritative.
  if (isWaived(concept.id, ctx)) return true;
  if (ctx.progress[concept.id]?.encountered) return true;
  const tier = inferTier(concept);
  return concept.prerequisites.every((id) => isDemonstrated(id, ctx, tier));
}

export function isLessonUnlocked(
  lesson: { conceptId: string; prerequisites: string[] },
  ctx: ReadinessContext,
): boolean {
  const concept = ctx.catalog.conceptMap[lesson.conceptId];
  if (concept && !isConceptUnlocked(concept, ctx)) return false;
  const tier = inferTier(concept);
  return lesson.prerequisites.every((id) => isDemonstrated(id, ctx, tier));
}

export function frontierConcepts(course: Course, ctx: ReadinessContext): Concept[] {
  const unlocked: Concept[] = [];
  for (const concept of course.modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .flatMap((m) => m.conceptIds.map((id) => ctx.catalog.conceptMap[id]))
    .filter((c): c is Concept => Boolean(c))) {
    if (!isConceptUnlocked(concept, ctx)) continue;
    if (isDemonstrated(concept.id, ctx, inferTier(concept))) continue;
    unlocked.push(concept);
  }
  return unlocked.sort((a, b) => {
    const ma = moduleForConcept(ctx.catalog, a.id)?.order ?? 99;
    const mb = moduleForConcept(ctx.catalog, b.id)?.order ?? 99;
    if (ma !== mb) return ma - mb;
    return inferTier(a) - inferTier(b);
  });
}

/** Pick the earliest course in a subject that still has work the learner can hold. */
export function pickCourseForLearner(
  catalog: Catalog,
  categoryId: string | null | undefined,
  ctx: ReadinessContext,
): Course | undefined {
  const courses = coursesForCategory(catalog, categoryId);
  if (courses.length === 0) return undefined;
  for (const course of courses) {
    if (frontierConcepts(course, ctx).length > 0) return course;
  }
  for (const course of courses) {
    if (ctx.courses?.[course.id]?.startedAt) return course;
  }
  return courses[0];
}

export function makeReadinessContext(
  catalog: Catalog,
  progress: Record<string, ConceptProgress>,
  profile?: LocalProfile,
  courses?: Record<string, CourseProgress>,
): ReadinessContext {
  return { catalog, progress, profile, courses };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
