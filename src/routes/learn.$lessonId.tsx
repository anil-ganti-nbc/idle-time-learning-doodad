import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LessonDiagram } from "@/components/diagrams";
import { HydrateGate } from "@/components/hydrate";
import { ProvenanceLine, SourceBadge } from "@/components/provenance";
import { Button } from "@/components/ui/button";
import { generateExplain, generateQuiz } from "@/lib/ai/client";
import { toGenerationLog } from "@/lib/ai/attempt";
import { useAiContext } from "@/lib/ai/use-ai";
import { courseForConcept } from "@/lib/learning/curriculum";
import {
  initPracticeResultListener,
  openPracticeLab,
  practiceLabsForLesson,
} from "@/lib/practice/labs";
import { getLive, startLive, bumpLiveGeneration } from "@/lib/learning/live";
import { useProgress } from "@/lib/learning/progress";
import { quizContextFor } from "@/lib/learning/quiz-context";
import { makeReadinessContext } from "@/lib/learning/readiness";
import { PROMPT_VERSION, type LessonFeedbackVerdict } from "@/lib/learning/types";
import { useCatalog } from "@/lib/learning/use-catalog";

export const Route = createFileRoute("/learn/$lessonId")({
  component: LessonPage,
});

function LessonPage() {
  return (
    <HydrateGate>
      <LessonReady />
    </HydrateGate>
  );
}

function LessonReady() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const lesson = catalog.lessonMap[lessonId];
  const lastMode = useProgress((s) => s.settings.lastMode);
  const lastTime = useProgress((s) => s.settings.lastTime);
  const applyVersion = useProgress((s) => s.applyLessonVersion);
  const addFeedback = useProgress((s) => s.addFeedback);
  const logGeneration = useProgress((s) => s.logGeneration);
  const archiveLesson = useProgress((s) => s.archiveLesson);
  const ai = useProgress((s) => s.ai);
  const progress = useProgress((s) => s.concepts);
  const profile = useProgress((s) => s.profile);
  const courseProgress = useProgress((s) => s.courses);
  const aiCtx = useAiContext(getLive()?.generations ?? 0);
  const [busy, setBusy] = useState<string | null>(null);
  const [styleOpen, setStyleOpen] = useState(false);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl">Unit not found</h1>
        <Link to="/session" className="mt-4 inline-block text-sm text-muted hover:text-fg">
          Back to the router
        </Link>
      </div>
    );
  }

  const unit = lesson;
  const course = courseForConcept(catalog, unit.conceptId);
  const concept = catalog.conceptMap[unit.conceptId];
  const categoryName = concept ? catalog.categoryMap[concept.category]?.name : "";
  const practiceLabs = practiceLabsForLesson(course?.id, unit.conceptId);
  const prereqNames = unit.prerequisites
    .map((id) => catalog.conceptMap[id]?.name ?? id)
    .filter(Boolean);

  useEffect(() => {
    return initPracticeResultListener((entry) => {
      if (entry.completed) {
        toast.success(`Practice logged: ${entry.lessonId}`, {
          description: `Chudbox take · ${Math.round(entry.timeSpentMs / 1000)}s${entry.selfRating ? ` · rated ${entry.selfRating}/3` : ""}`,
        });
      }
    });
  }, []);

  function beginQuiz() {
    const live = getLive();
    if (!live || live.lessonId !== unit.id) {
      startLive({
        lessonId: unit.id,
        startedAt: new Date().toISOString(),
        mode: lastMode,
        timeBudget: lastTime,
      });
    }
    void navigate({ to: "/learn/$lessonId/quiz", params: { lessonId: unit.id } });
  }

  async function explain(style: "analogy" | "technical" | "simpler" | "example") {
    setBusy("explain");
    const result = await generateExplain(aiCtx, unit, style);
    setBusy(null);
    setStyleOpen(false);
    if (result.billable) bumpLiveGeneration();
    logGeneration(toGenerationLog("explain", result, { lessonId: unit.id, conceptId: unit.conceptId }));
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    applyVersion(
      unit.id,
      {
        id: `v-${Date.now()}`,
        createdAt: new Date().toISOString(),
        kind: "explain-differently",
        explanation: result.value.explanation,
        example: result.value.example,
        provenance: {
          type: "ai",
          provider: result.provider,
          model: result.model,
          generatedAt: new Date().toISOString(),
          promptVersion: PROMPT_VERSION,
          schemaVersion: 1,
          notes: `explain:${style}`,
        },
      },
      {
        ...unit,
        explanation: result.value.explanation,
        example: result.value.example,
        custom: true,
      },
    );
    toast("Explanation rewritten.");
  }

  async function regenQuiz() {
    setBusy("quiz");
    const result = await generateQuiz(
      aiCtx,
      unit,
      quizContextFor(unit, makeReadinessContext(catalog, progress, profile, courseProgress), catalog, {
        journalist: useProgress.getState().settings.journalistDepth,
        history: useProgress.getState().assessmentHistory,
      }),
    );
    setBusy(null);
    if (result.billable) bumpLiveGeneration();
    logGeneration(toGenerationLog("quiz", result, { lessonId: unit.id, conceptId: unit.conceptId }));
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    applyVersion(
      unit.id,
      {
        id: `v-${Date.now()}`,
        createdAt: new Date().toISOString(),
        kind: "quiz-regen",
        quiz: [...result.value],
        provenance: {
          type: "ai",
          provider: result.provider,
          model: result.model,
          generatedAt: new Date().toISOString(),
          promptVersion: PROMPT_VERSION,
          schemaVersion: 1,
        },
      },
      { ...unit, quiz: result.value, custom: true },
    );
    toast("Quiz replaced.");
  }

  function feedback(verdict: LessonFeedbackVerdict) {
    addFeedback(unit.id, verdict);
    toast(`Marked ${verdict}.`);
  }

  return (
    <article className="mx-auto max-w-xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">
        {course ? course.title : categoryName} · {unit.durationMin} min · {unit.effort}
        {unit.level === "journalist" ? " · journalist" : ""}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <h1 className="font-display text-3xl leading-tight tracking-tight break-words sm:text-4xl">{unit.title}</h1>
        <SourceBadge lesson={unit} />
      </div>
      {prereqNames.length > 0 && (
        <p className="mt-3 text-sm text-muted">Assumes: {prereqNames.join(" · ")}</p>
      )}
      <div className="mt-3">
        <ProvenanceLine lesson={unit} />
      </div>
      {unit.versions && unit.versions.length > 0 ? (
        <p className="mt-2 text-xs text-subtle">
          {unit.versions.length} earlier version{unit.versions.length === 1 ? "" : "s"} kept
        </p>
      ) : null}

      <div className="mt-8 space-y-6 text-[17px] leading-[1.65] break-words text-fg">
        {unit.explanation.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <LessonDiagram name={unit.diagram} />

      <section className="mt-8 rounded-lg bg-surface px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <h2 className="text-xs tracking-[0.16em] text-muted uppercase">Example</h2>
        <p className="mt-2 text-[15px] leading-relaxed break-words text-fg">{unit.example}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xs tracking-[0.16em] text-muted uppercase">Why it matters</h2>
        <p className="mt-2 text-[15px] leading-relaxed break-words text-muted">{unit.whyItMatters}</p>
      </section>

      {unit.source.sourceExcerpt && (
        <section className="mt-6">
          <h2 className="text-xs tracking-[0.16em] text-muted uppercase">Grounded in source</h2>
          <p className="mt-2 text-sm leading-relaxed text-subtle">{unit.source.sourceExcerpt}</p>
        </section>
      )}

      {practiceLabs.length > 0 && (
        <section className="mt-8 rounded-lg bg-surface px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <h2 className="text-xs tracking-[0.16em] text-muted uppercase">Practice lab</h2>
          {practiceLabs.map((lab) => (
            <div key={lab.labId} className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] text-fg">{lab.name}</p>
                <p className="text-sm leading-relaxed text-muted">{lab.description}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  const launch = openPracticeLab({ id: unit.id, conceptId: unit.conceptId, title: unit.title });
                  if (!launch.ok) toast.error(launch.message ?? "Could not launch the practice lab.");
                }}
              >
                Practice in {lab.name} ↗
              </Button>
            </div>
          ))}
          <p className="mt-3 text-2xs leading-relaxed text-subtle">
            Opens in a new tab. When you complete a take there, the result is posted back and logged here.
          </p>
        </section>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button type="button" size="lg" onClick={beginQuiz}>
          Three questions
        </Button>
        <Link to="/session" className="text-sm text-muted no-underline hover:text-fg">
          Abort this gap
        </Link>
      </div>

      {ai.enabled && ai.policy !== "off" && (
        <div className="mt-8 border-t border-border/70 pt-6">
          <p className="text-xs tracking-wide text-muted uppercase">Rewrite this unit</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => setStyleOpen((v) => !v)} disabled={busy !== null}>
              {busy === "explain" ? "Rewriting…" : "Explain differently"}
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={() => void regenQuiz()} disabled={busy !== null}>
              {busy === "quiz" ? "Writing questions…" : "Regenerate quiz"}
            </Button>
          </div>
          {styleOpen && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(
                [
                  ["analogy", "Different analogy"],
                  ["technical", "More technical"],
                  ["simpler", "Simpler"],
                  ["example", "Another example"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => void explain(id)}
                  className="min-h-11 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {(unit.source.type === "ai" || unit.custom) && (
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>This unit:</span>
          {(["accurate", "unclear", "suspect"] as const).map((v) => (
            <button key={v} type="button" onClick={() => feedback(v)} className="rounded-full bg-raised px-3 py-1.5 hover:text-fg">
              {v}
            </button>
          ))}
          {unit.custom && (
            <button
              type="button"
              className="ml-auto text-bad"
              onClick={() => {
                archiveLesson(unit.id);
                toast("Archived.");
                void navigate({ to: "/library" });
              }}
            >
              Archive
            </button>
          )}
        </div>
      )}
    </article>
  );
}
