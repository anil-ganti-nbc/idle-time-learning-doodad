import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getLive, patchLive, startLive } from "@/lib/learning/live";
import { useProgress } from "@/lib/learning/progress";
import { useCatalog } from "@/lib/learning/use-catalog";
import { presentQuiz, recordPositions } from "@/lib/quiz/shuffle";
import { cn } from "@/lib/utils";

const RECENT_KEY = "dau-quiz-positions";

function loadRecent(): number[] {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(positions: number[]) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(positions));
}

export const Route = createFileRoute("/learn_/$lessonId/quiz")({
  component: QuizPage,
});

function QuizPage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const lesson = catalog.lessonMap[lessonId];
  const lastMode = useProgress((s) => s.settings.lastMode);
  const lastTime = useProgress((s) => s.settings.lastTime);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const quiz = useMemo(() => {
    if (!lesson) return [];
    const recent = loadRecent();
    const presented = presentQuiz(lesson.quiz, Math.random, recent);
    saveRecent(recordPositions(presented, recent));
    return presented;
  }, [lesson]);

  if (!lesson || quiz.length < 3) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl">Unit not found</h1>
      </div>
    );
  }

  const unit = lesson;
  const question = quiz[index];
  const locked = picked !== null;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === question.answerIndex) setCorrect((c) => c + 1);
  }

  function next() {
    if (index < 2) {
      setIndex((n) => n + 1);
      setPicked(null);
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
    patchLive({ quizCorrect: correct, answered: 3 });
    void navigate({ to: "/learn/$lessonId/rate", params: { lessonId: unit.id } });
  }

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
          const mine = i === picked;
          return (
            <li key={`${question.id}-${choice}`}>
              <button
                type="button"
                onClick={() => choose(i)}
                disabled={locked}
                className={cn(
                  "w-full rounded-lg px-4 py-3.5 text-left text-[15px] leading-snug transition-[box-shadow,background-color] duration-150",
                  !show &&
                    "bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.16)]",
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
        <p className="mt-6 text-sm leading-relaxed text-muted">{question.explanation}</p>
      )}

      <div className="mt-8 flex items-center gap-3">
        <Button type="button" disabled={!locked} onClick={next}>
          {index < 2 ? "Next" : "Rate understanding"}
        </Button>
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
