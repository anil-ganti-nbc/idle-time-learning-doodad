import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { HydrateGate } from "@/components/hydrate";
import { JournalistToggle } from "@/components/journalist-toggle";
import { Button } from "@/components/ui/button";
import { generateLesson } from "@/lib/ai/client";
import { toGenerationLog } from "@/lib/ai/attempt";
import { useAiContext } from "@/lib/ai/use-ai";
import { startLive, getLive, generationsAfterStart } from "@/lib/learning/live";
import { coursesForCategory, inferTier, isRetiredBuiltInStudyTarget } from "@/lib/learning/curriculum";
import { declareKnown, pickPlacementItems, scorePlacement } from "@/lib/learning/placement";
import { useProgress } from "@/lib/learning/progress";
import { quizContextForConcept } from "@/lib/learning/quiz-context";
import { frontierConcepts, makeReadinessContext, pickCourseForLearner } from "@/lib/learning/readiness";
import { missingConceptForGeneration, selectLesson } from "@/lib/learning/select";
import { conceptState } from "@/lib/learning/state";
import type { CategoryId, Effort, Mode, TimeBudget } from "@/lib/learning/types";
import { isSelectableCategory } from "@/lib/learning/types";
import { useCatalog } from "@/lib/learning/use-catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/session")({
  validateSearch: (raw: Record<string, unknown>) => {
    const search: { category?: string; mode?: string } = {};
    if (typeof raw.category === "string") search.category = raw.category;
    if (typeof raw.mode === "string") search.mode = raw.mode;
    return search;
  },
  component: SessionPage,
});

const TIMES: { value: TimeBudget; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 20, label: "20 min" },
  { value: 30, label: "30+" },
];

const MODE_OPTS: { value: Mode; label: string; hint: string }[] = [
  { value: "explore", label: "Explore", hint: "Next unit you can actually hold" },
  { value: "reinforce", label: "Reinforce", hint: "Due reviews first" },
  { value: "surprise", label: "Surprise me", hint: "A different field, at your current position" },
];

const EFFORT_OPTS: { value: Effort | null; label: string }[] = [
  { value: null, label: "Any" },
  { value: "light", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "deep", label: "Deep" },
];

function SessionPage() {
  return (
    <HydrateGate>
      <SessionReady />
    </HydrateGate>
  );
}

function SessionReady() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const settings = useProgress((s) => s.settings);
  const profile = useProgress((s) => s.profile);
  const remember = useProgress((s) => s.rememberRouter);
  const progress = useProgress((s) => s.concepts);
  const recent = useProgress((s) => s.recentCategoryIds);
  const courseRows = useProgress((s) => s.courses);
  const applyPlacement = useProgress((s) => s.applyPlacement);
  const touchCourse = useProgress((s) => s.touchCourse);
  const upsertLesson = useProgress((s) => s.upsertLesson);
  const logGeneration = useProgress((s) => s.logGeneration);
  const ai = useProgress((s) => s.ai);
  const liveGens = getLive()?.generations ?? 0;
  const aiCtx = useAiContext(liveGens);

  const requestedFromUrl = typeof search.category === "string" ? search.category : null;
  const retiredRequested = isRetiredBuiltInStudyTarget(catalog, requestedFromUrl);
  const rawInitial =
    requestedFromUrl ?? settings.lastCategory ?? (profile.preferredTopics[0] ?? null);
  const initialCategory = isRetiredBuiltInStudyTarget(catalog, rawInitial) ? null : rawInitial;
  const initialMode = (search.mode as Mode | undefined) ?? settings.lastMode;

  const [minutes, setMinutes] = useState<TimeBudget>(settings.lastTime || settings.preferredDuration);
  const [category, setCategory] = useState<CategoryId | "random" | null>(initialCategory);
  const [effort, setEffort] = useState<Effort | null>(settings.lastEffort ?? settings.preferredEffort);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placePick, setPlacePick] = useState<number | null>(null);
  const [placeIndex, setPlaceIndex] = useState(0);
  const [placeAnswers, setPlaceAnswers] = useState<
    { conceptId: string; tier: 0 | 1 | 2 | 3 | 4 | 5; correct: boolean }[]
  >([]);

  const preview = useMemo(
    () =>
      selectLesson(
        { minutes, category, effort, mode, journalistDepth: settings.journalistDepth },
        progress,
        recent,
        catalog,
        profile,
        { courses: courseRows },
      ),
    [minutes, category, effort, mode, settings.journalistDepth, progress, recent, catalog, profile, courseRows],
  );

  const missing = useMemo(
    () =>
      missingConceptForGeneration(
        { minutes, category, effort, mode, journalistDepth: settings.journalistDepth },
        progress,
        recent,
        catalog,
        profile,
        { courses: courseRows },
      ),
    [minutes, category, effort, mode, settings.journalistDepth, progress, recent, catalog, profile, courseRows],
  );

  const readiness = makeReadinessContext(catalog, progress, profile, courseRows);
  const activeCourse =
    category && category !== "random"
      ? pickCourseForLearner(catalog, category, readiness) ?? coursesForCategory(catalog, category)[0]
      : undefined;
  const courseState = activeCourse ? courseRows[activeCourse.id] : undefined;
  const nextInCourse = activeCourse ? frontierConcepts(activeCourse, readiness)[0] : undefined;
  const placementItems = useMemo(
    () => (activeCourse ? pickPlacementItems(activeCourse, catalog) : []),
    [activeCourse, catalog],
  );
  const offerPlacement = Boolean(
    activeCourse && !courseState?.startedAt && !courseState?.placement && placementItems.length > 0,
  );

  function go(lessonId: string, live?: { generations?: number }) {
    remember({ lastTime: minutes, lastCategory: category, lastEffort: effort, lastMode: mode });
    if (activeCourse) touchCourse(activeCourse.id);
    startLive({
      lessonId,
      startedAt: new Date().toISOString(),
      mode,
      timeBudget: minutes,
      generations: live?.generations ?? 0,
    });
    void navigate({ to: "/learn/$lessonId", params: { lessonId } });
  }

  function start() {
    if (!preview) {
      setError("Nothing in the catalog fits this combination. Widen topic or time, or generate a unit.");
      return;
    }
    go(preview.lesson.id);
  }

  function beginAtStart() {
    if (activeCourse) touchCourse(activeCourse.id);
    start();
  }

  function markFoundationsKnown() {
    if (!activeCourse) return;
    const ids = activeCourse.modules
      .flatMap((m) => m.conceptIds)
      .filter((id) => inferTier(catalog.conceptMap[id]) <= 1);
    applyPlacement(activeCourse.id, declareKnown(activeCourse, catalog, ids));
    setPlacing(false);
    setPlaceIndex(0);
    setPlacePick(null);
    setPlaceAnswers([]);
  }

  function submitPlacementAnswer() {
    const item = placementItems[placeIndex];
    if (!item || placePick === null) return;
    const nextAnswers = [
      ...placeAnswers,
      {
        conceptId: item.conceptId,
        tier: item.tier,
        correct: placePick === item.question.answerIndex,
      },
    ];
    if (placeIndex + 1 < placementItems.length) {
      setPlaceAnswers(nextAnswers);
      setPlaceIndex((n) => n + 1);
      setPlacePick(null);
      return;
    }
    if (activeCourse) applyPlacement(activeCourse.id, scorePlacement(nextAnswers));
    setPlacing(false);
    setPlaceIndex(0);
    setPlacePick(null);
    setPlaceAnswers([]);
  }

  async function generateMissing() {
    if (!missing) return;
    const concept = catalog.conceptMap[missing.conceptId];
    if (!concept) return;
    setBusy(true);
    setError(null);
    const known = profile.knownConceptIds
      .map((id) => catalog.conceptMap[id])
      .filter(Boolean)
      .map((c) => ({ id: c.id, name: c.name }));
    const weak = Object.values(progress)
      .filter((p) => conceptState(p) === "shaky")
      .map((p) => ({ id: p.conceptId, name: catalog.conceptMap[p.conceptId]?.name ?? p.conceptId }));
    const result = await generateLesson(
      aiCtx,
      {
        concept,
        durationMin: minutes,
        effort: effort ?? "normal",
        journalist: settings.journalistDepth,
        known,
        weak,
        recent: [],
        adapt: settings.journalistDepth ? "skip-known" : undefined,
        quizContext: quizContextForConcept(concept, readiness, catalog, {
          journalist: settings.journalistDepth,
          history: useProgress.getState().assessmentHistory,
        }),
      },
      { hasLocalMatch: Boolean(preview) },
    );
    setBusy(false);
    logGeneration(
      toGenerationLog("lesson", result, {
        lessonId: result.ok ? result.value.id : undefined,
        conceptId: concept.id,
      }),
    );
    if (!result.ok) {
      setError(result.error + (result.issues ? ` ${result.issues[0]}` : ""));
      return;
    }
    upsertLesson(result.value);
    toast(result.cached ? "Reused a cached unit." : "Generated a structured unit.");
    go(result.value.id, { generations: generationsAfterStart(result.billable) });
  }

  const placeItem = placing ? placementItems[placeIndex] : undefined;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">Session</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">How long is the gap?</h1>
      <p className="mt-2 text-sm text-muted">One unit. No playlist. Options below are optional.</p>

      {retiredRequested && (
        <div className="mt-6 rounded-xl bg-raised p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]">
          <p className="text-sm font-medium text-fg">This field is archived</p>
          <p className="mt-1 text-sm text-muted">
            {catalog.categoryMap[requestedFromUrl ?? ""]?.name ?? "This subject"} is kept so old
            progress still reads. It is not an active built-in course, and Surprise Me will not open
            it. Open the library if you want to reread something you already studied.
          </p>
          <Link to="/library" className="mt-3 inline-block text-sm text-muted no-underline hover:text-fg">
            Open library
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TIMES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setMinutes(t.value)}
            className={cn(
              "min-h-16 rounded-lg text-base font-medium transition-[box-shadow,background-color] duration-150",
              minutes === t.value
                ? "bg-primary text-primary-fg"
                : "bg-surface text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-fg">Mode</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {MODE_OPTS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={cn(
                "min-h-16 rounded-lg px-3 py-3 text-left transition-[box-shadow] duration-150",
                mode === m.value
                  ? "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.18)]"
                  : "bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
              )}
            >
              <span className="block text-sm font-medium">{m.label}</span>
              <span className="mt-1 block text-xs text-muted">{m.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <details className="group rounded-xl bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <summary className="cursor-pointer list-none text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
            Narrow the field
            <span className="ml-2 font-normal text-muted">
              {category && category !== "random"
                ? catalog.categoryMap[category]?.name
                : "any topic"}
              {effort ? ` · ${effort}` : " · any effort"}
            </span>
          </summary>
          <div className="mt-4">
            <h2 className="text-xs tracking-wide text-muted uppercase">Topic</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip
                active={category === null || category === "random"}
                onClick={() => setCategory("random")}
              >
                Any / surprise
              </Chip>
              {catalog.categories.filter(isSelectableCategory).map((c) => (
                <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                  {c.name}
                </Chip>
              ))}
            </div>
            <h2 className="mt-6 text-xs tracking-wide text-muted uppercase">Mental effort</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {EFFORT_OPTS.map((e) => (
                <Chip key={e.label} active={effort === e.value} onClick={() => setEffort(e.value)}>
                  {e.label}
                </Chip>
              ))}
            </div>
          </div>
        </details>
      </section>

      <div className="mt-8 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <JournalistToggle />
      </div>

      {activeCourse && (
        <div className="mt-8 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <p className="text-xs tracking-[0.16em] text-muted uppercase">Course</p>
          <h2 className="mt-1 font-display text-xl tracking-tight">{activeCourse.title}</h2>
          {nextInCourse ? (
            <p className="mt-2 text-sm text-muted">
              Next open unit: <span className="text-fg">{nextInCourse.name}</span>
              {preview && preview.lesson.conceptId !== nextInCourse.id
                ? ` · router picked “${preview.lesson.title}” for this gap`
                : ""}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">
              The open units in this course are already underway. Reviews still fit.
            </p>
          )}
          <Link
            to="/course/$courseId"
            params={{ courseId: activeCourse.id }}
            className="mt-3 inline-block text-sm text-muted no-underline hover:text-fg"
          >
            See modules and sources
          </Link>
        </div>
      )}

      {offerPlacement && !placing && (
        <div className="mt-6 rounded-xl bg-raised p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]">
          <p className="text-sm font-medium text-fg">Starting this course</p>
          <p className="mt-1 text-sm text-muted">
            Default is the first foundation unit. A short check can waive introductions you already
            hold — it cannot open advanced material.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button type="button" onClick={beginAtStart}>
              Start at the beginning
            </Button>
            <Button type="button" variant="secondary" onClick={() => setPlacing(true)}>
              I know some of this
            </Button>
          </div>
        </div>
      )}

      {placing && placeItem && (
        <div className="mt-6 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <p className="font-mono text-xs tabular-nums text-muted">
            Placement {placeIndex + 1} / {placementItems.length}
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">{placeItem.question.prompt}</h2>
          <ul className="mt-5 space-y-2">
            {placeItem.question.choices.map((choice, i) => (
              <li key={`${placeItem.question.id}-${choice}`}>
                <button
                  type="button"
                  onClick={() => setPlacePick(i)}
                  className={cn(
                    "w-full rounded-lg px-4 py-3.5 text-left text-[15px] leading-snug transition-[box-shadow] duration-150",
                    placePick === i
                      ? "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.18)]"
                      : "bg-bg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)]",
                  )}
                >
                  {choice}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button type="button" disabled={placePick === null} onClick={submitPlacementAnswer}>
              {placeIndex + 1 < placementItems.length ? "Next" : "Place me"}
            </Button>
            <button
              type="button"
              className="text-sm text-muted hover:text-fg"
              onClick={() => {
                setPlacing(false);
                setPlaceIndex(0);
                setPlacePick(null);
                setPlaceAnswers([]);
              }}
            >
              Cancel
            </button>
            <button type="button" className="text-sm text-muted hover:text-fg" onClick={markFoundationsKnown}>
              I already know the foundations
            </button>
          </div>
        </div>
      )}

      {preview && !placing && (
        <p className="mt-8 text-sm leading-relaxed text-muted">
          Ready: <span className="text-fg">{preview.lesson.title}</span>
          {" · "}
          {preview.lesson.durationMin} min
          {" · "}
          {catalog.conceptMap[preview.lesson.conceptId]?.name}
          <span className="mt-1 block text-subtle">{preview.reason}</span>
        </p>
      )}

      {error && <p className="mt-4 text-sm text-bad">{error}</p>}

      {(!offerPlacement || courseState?.startedAt || courseState?.placement) && !placing && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="lg" className="w-full sm:w-auto" onClick={start} disabled={busy}>
            Start learning
          </Button>
          {ai.enabled && ai.policy !== "off" && missing && (
            <Button type="button" size="lg" variant="secondary" onClick={() => void generateMissing()} disabled={busy}>
              {busy ? "Generating…" : "Generate a missing unit"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-full px-3.5 text-sm transition-colors duration-150",
        active ? "bg-primary text-primary-fg" : "bg-raised text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
