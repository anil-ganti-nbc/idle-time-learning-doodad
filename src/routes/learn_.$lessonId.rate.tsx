import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generateLesson } from "@/lib/ai/client";
import { toGenerationLog } from "@/lib/ai/attempt";
import { useAiContext } from "@/lib/ai/use-ai";
import { lessonsForConceptFrom } from "@/lib/learning/catalog";
import { courseForConcept } from "@/lib/learning/curriculum";
import { clearLive, elapsedMinutes, getLive, startLive, generationsAfterStart } from "@/lib/learning/live";
import { useProgress } from "@/lib/learning/progress";
import { isConceptUnlocked, isLessonUnlocked, makeReadinessContext } from "@/lib/learning/readiness";
import { daysUntil } from "@/lib/learning/srs";
import { conceptState } from "@/lib/learning/state";
import type { Understanding } from "@/lib/learning/types";
import { useCatalog } from "@/lib/learning/use-catalog";

export const Route = createFileRoute("/learn_/$lessonId/rate")({
  component: RatePage,
});

const RATINGS: { id: Understanding; label: string; hint: string }[] = [
  { id: "didnt_get_it", label: "Didn't get it", hint: "Review tomorrow" },
  { id: "mostly", label: "Mostly", hint: "Review in a few days" },
  { id: "got_it", label: "Got it", hint: "Stretch the interval" },
];

function RatePage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const lesson = catalog.lessonMap[lessonId];
  const record = useProgress((s) => s.recordSession);
  const lastMode = useProgress((s) => s.settings.lastMode);
  const lastTime = useProgress((s) => s.settings.lastTime);
  const progress = useProgress((s) => s.concepts);
  const profile = useProgress((s) => s.profile);
  const courseRows = useProgress((s) => s.courses);
  const upsertLesson = useProgress((s) => s.upsertLesson);
  const logGeneration = useProgress((s) => s.logGeneration);
  const ai = useProgress((s) => s.ai);
  const aiCtx = useAiContext(getLive()?.generations ?? 0);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const snapshot = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getLive();
  }, []);

  const stored = useProgress((s) => (doneId ? s.concepts[lesson?.conceptId ?? ""] : undefined));

  if (!lesson) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl">Unit not found</h1>
      </div>
    );
  }

  const unit = lesson;
  const concept = catalog.conceptMap[unit.conceptId];
  const course = courseForConcept(catalog, unit.conceptId);
  const readiness = makeReadinessContext(catalog, progress, profile, courseRows);
  const quizCorrect = snapshot?.quizCorrect ?? 0;
  const deeperSeed = unit.goDeeper
    ? lessonsForConceptFrom(catalog, unit.goDeeper).sort((a, b) => a.durationMin - b.durationMin)[0]
    : undefined;
  const deeperConcept = unit.goDeeper ? catalog.conceptMap[unit.goDeeper] : undefined;
  const deeperReady = Boolean(
    deeperSeed &&
      deeperConcept &&
      isConceptUnlocked(deeperConcept, readiness) &&
      isLessonUnlocked(deeperSeed, readiness),
  );

  function rate(understanding: Understanding) {
    let live = getLive();
    if (!live || live.lessonId !== unit.id) {
      live = startLive({
        lessonId: unit.id,
        startedAt: new Date().toISOString(),
        mode: lastMode,
        timeBudget: lastTime,
      });
    }
    const session = record({
      lessonId: unit.id,
      conceptId: unit.conceptId,
      categoryId: concept?.category ?? "history",
      startedAt: live.startedAt,
      estimatedMinutes: unit.durationMin,
      actualMinutes: elapsedMinutes(live.startedAt),
      quizCorrect: live.quizCorrect ?? quizCorrect,
      quizTotal: 3,
      understanding,
      mode: live.mode,
      timeBudget: live.timeBudget,
      sourceType: unit.source.type,
      sourceProvider: unit.source.provider,
      courseId: course?.id,
      assessmentItems: live.quizItems,
      positions: live.positions,
    });
    clearLive();
    setDoneId(session.id);
  }

  async function generateDeeper() {
    if (!concept) return;
    if (!isConceptUnlocked(concept, readiness)) {
      toast.error("This concept is not open yet. Finish its prerequisites first.");
      return;
    }
    setBusy(true);
    const known = Object.values(progress)
      .filter((p) => conceptState(p) === "strong" || conceptState(p) === "understood")
      .map((p) => ({ id: p.conceptId, name: catalog.conceptMap[p.conceptId]?.name ?? p.conceptId }));
    const result = await generateLesson(aiCtx, {
      concept: {
        ...concept,
        level: "journalist",
        summary: `Deeper follow-up after “${unit.title}”. Quiz ${stored?.lastQuizCorrect ?? quizCorrect}/${stored?.lastQuizTotal || 3}.`,
      },
      durationMin: unit.durationMin,
      effort: "deep",
      journalist: true,
      known,
      weak: [],
      recent: [{ title: unit.title, conceptId: unit.conceptId }],
      adapt: stored && (stored.lastQuizScore ?? 0) >= 0.67 ? "harder" : "simpler",
    });
    setBusy(false);
    logGeneration(
      toGenerationLog("deeper", result, {
        lessonId: result.ok ? result.value.id : undefined,
        conceptId: concept.id,
      }),
    );
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    upsertLesson(result.value);
    startLive({
      lessonId: result.value.id,
      startedAt: new Date().toISOString(),
      mode: "explore",
      timeBudget: result.value.durationMin,
      generations: generationsAfterStart(result.billable),
    });
    void navigate({ to: "/learn/$lessonId", params: { lessonId: result.value.id } });
  }

  if (doneId && stored) {
    const until = daysUntil(stored.nextReviewAt);
    return (
      <div className="mx-auto max-w-xl">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Logged</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Gap converted.</h1>
        <dl className="mt-8 grid grid-cols-2 gap-3">
          <Stat
            label="Quiz"
            value={`${stored.lastQuizCorrect ?? 0}/${stored.lastQuizTotal || 3}`}
          />
          <Stat label="Time" value={`${stored.actualMinutes}m`} hint={`est. ${unit.durationMin}m`} />
          <Stat label="Next review" value={until === null ? "—" : until <= 0 ? "now" : `${until}d`} />
          <Stat label="Times seen" value={String(stored.timesStudied)} />
        </dl>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {deeperReady && deeperSeed && (
            <Button
              type="button"
              onClick={() => {
                startLive({
                  lessonId: deeperSeed.id,
                  startedAt: new Date().toISOString(),
                  mode: "explore",
                  timeBudget: deeperSeed.durationMin,
                });
                void navigate({ to: "/learn/$lessonId", params: { lessonId: deeperSeed.id } });
              }}
            >
              Go deeper: {catalog.conceptMap[unit.goDeeper!]?.name}
            </Button>
          )}
          {!deeperReady && !deeperSeed && ai.enabled && ai.policy !== "off" && isConceptUnlocked(concept!, readiness) && (
            <Button type="button" onClick={() => void generateDeeper()} disabled={busy}>
              {busy ? "Writing follow-up…" : "Go deeper (generate)"}
            </Button>
          )}
          <Button asChild variant="secondary">
            <Link to="/" className="no-underline">
              Desk
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="font-mono text-xs tabular-nums text-muted">Quiz {quizCorrect}/3</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">How well did that sit?</h1>
      <p className="mt-2 text-sm text-muted">This schedules the next review. Honest beats optimistic.</p>
      <div className="mt-8 grid gap-2">
        {RATINGS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => rate(r.id)}
            className="min-h-16 rounded-lg bg-surface px-4 py-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-[box-shadow] duration-150 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.16)]"
          >
            <span className="block font-medium">{r.label}</span>
            <span className="mt-0.5 block text-sm text-muted">{r.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-xl tabular-nums">{value}</p>
      {hint && <p className="text-xs text-subtle">{hint}</p>}
    </div>
  );
}
