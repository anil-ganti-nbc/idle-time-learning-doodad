import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HydrateGate } from "@/components/hydrate";
import { Button } from "@/components/ui/button";
import { courseForConcept, moduleForConcept } from "@/lib/learning/curriculum";
import { getLive, patchLive, startLive } from "@/lib/learning/live";
import { useProgress } from "@/lib/learning/progress";
import { useCatalog } from "@/lib/learning/use-catalog";
import type { AssessmentItemRecord } from "@/lib/learning/types";
import { presentQuiz, recordPositions } from "@/lib/quiz/shuffle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn_/$lessonId/quiz")({
  component: QuizPage,
});

function QuizPage() {
  return (
    <HydrateGate>
      <QuizReady />
    </HydrateGate>
  );
}

function QuizReady() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const lesson = catalog.lessonMap[lessonId];
  const lastMode = useProgress((s) => s.settings.lastMode);
  const lastTime = useProgress((s) => s.settings.lastTime);
  const recentPositions = useProgress((s) => s.assessmentHistory?.recentPositions ?? []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [items, setItems] = useState<AssessmentItemRecord[]>([]);
  const quiz = useMemo(() => {
    if (!lesson) return [];
    return presentQuiz(lesson.quiz, Math.random, recentPositions);
    // Shuffle once per lesson open. Do not reshuffle if history identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  if (!lesson || quiz.length < 3) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl">Unit not found</h1>
      </div>
    );
  }

  const unit = lesson;
  const question = quiz[index];
  const concept = catalog.conceptMap[unit.conceptId];
  const course = courseForConcept(catalog, unit.conceptId);
  const mod = moduleForConcept(catalog, unit.conceptId);

  function confirm() {
    if (selected === null || locked) return;
    const right = selected === question.answerIndex;
    if (right) setCorrect((c) => c + 1);
    setLocked(true);
    const record: AssessmentItemRecord = {
      at: new Date().toISOString(),
      lessonId: unit.id,
      conceptId: unit.conceptId,
      questionId: question.id,
      courseId: course?.id,
      moduleId: mod?.id,
      objectiveIds: question.objectiveIds ?? [],
      cognitiveType: question.cognitiveType,
      difficultyTier: question.difficultyTier,
      answerIndex: selected as 0 | 1 | 2 | 3,
      correct: right,
      generationKind: unit.source.type === "ai" ? "generated" : "seeded",
      promptVersion: unit.source.promptVersion,
      provider: unit.source.provider,
      model: unit.source.model,
    };
    setItems((prev) => [...prev, record]);
  }

  function next() {
    if (index < 2) {
      setIndex((n) => n + 1);
      setSelected(null);
      setLocked(false);
      return;
    }
    const live = getLive();
    if (!live || live.lessonId !== unit.id) {
      startLive({
        lessonId: unit.id,
        startedAt: new Date().toISOString(),
        mode: lastMode,
        timeBudget: lastTime,
      });
    }
    const positions = recordPositions(quiz, recentPositions);
    patchLive({ quizCorrect: correct, answered: 3, quizItems: items, positions });
    void navigate({ to: "/learn/$lessonId/rate", params: { lessonId: unit.id } });
  }

  const selectedRationale =
    locked && selected !== null && selected !== question.answerIndex
      ? question.distractors?.find((d) => d.text === question.choices[selected])?.rationale
      : undefined;

  return (
    <div className="mx-auto max-w-xl">
      <p className="font-mono text-xs tabular-nums text-muted">{index + 1} / 3</p>
      <h1 className="mt-2 font-display text-2xl leading-snug tracking-tight sm:text-3xl">
        {question.prompt}
      </h1>

      <ul className="mt-8 space-y-2">
        {question.choices.map((choice, i) => {
          const show = locked;
          const right = i === question.answerIndex;
          const mine = i === selected;
          return (
            <li key={`${question.id}-${choice}`}>
              <button
                type="button"
                onClick={() => {
                  if (!locked) setSelected(i);
                }}
                disabled={locked}
                className={cn(
                  "w-full rounded-lg px-4 py-3.5 text-left text-[15px] leading-snug transition-[box-shadow,background-color] duration-150",
                  !show &&
                    !mine &&
                    "bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.16)]",
                  !show &&
                    mine &&
                    "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.18)]",
                  show && right && "bg-ok/15 shadow-[0_0_0_1px_rgba(138,163,154,0.45)]",
                  show && mine && !right && "bg-bad/15 shadow-[0_0_0_1px_rgba(196,137,130,0.45)]",
                  show && !right && !mine && "bg-raised text-muted",
                )}
              >
                {choice}
              </button>
            </li>
          );
        })}
      </ul>

      {locked && (
        <div className="mt-6 space-y-3">
          <p className="text-sm leading-relaxed text-muted">{question.explanation}</p>
          {selectedRationale ? (
            <p className="mt-0 text-sm leading-relaxed text-muted">The option you picked: {selectedRationale}</p>
          ) : null}
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        {!locked ? (
          <Button type="button" disabled={selected === null} onClick={confirm}>
            Check answer
          </Button>
        ) : (
          <Button type="button" onClick={next}>
            {index < 2 ? "Next" : "Rate understanding"}
          </Button>
        )}
        <Link
          to="/learn/$lessonId"
          params={{ lessonId: unit.id }}
          className="text-sm text-muted no-underline hover:text-fg"
        >
          Reread
        </Link>
      </div>
    </div>
  );
}
