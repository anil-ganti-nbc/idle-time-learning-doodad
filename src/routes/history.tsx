import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HydrateGate } from "@/components/hydrate";
import { sourceLabel } from "@/components/provenance";
import { useProgress } from "@/lib/learning/progress";
import { useCatalog } from "@/lib/learning/use-catalog";
import type { DifficultyNote } from "@/lib/learning/types";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function HistoryPage() {
  return (
    <HydrateGate>
      <HistoryReady />
    </HydrateGate>
  );
}

function HistoryReady() {
  const catalog = useCatalog();
  const sessions = useProgress((s) => s.sessions);
  const [topic, setTopic] = useState<string>("all");
  const [from, setFrom] = useState("");

  const filtered = useMemo(() => {
    const start = from ? new Date(from).getTime() : 0;
    return sessions.filter((s) => {
      if (topic !== "all" && s.categoryId !== topic) return false;
      if (start && new Date(s.completedAt).getTime() < start) return false;
      return true;
    });
  }, [sessions, topic, from]);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">Log</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">Session history</h1>
      <p className="mt-2 text-sm text-muted">
        What you actually did with the gap — not a streak, just a record.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <label className="text-xs text-muted">
          Topic
          <select
            className="mt-1 block h-11 min-w-40 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="all">All</option>
            {catalog.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 block h-11 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-subtle">No sessions match.</p>
      ) : (
        <ul className="mt-8 space-y-2">
          {filtered.map((s) => {
            const lesson = catalog.lessonMap[s.lessonId];
            const concept = catalog.conceptMap[s.conceptId];
            const cat = catalog.categoryMap[s.categoryId];
            return (
              <li
                key={s.id}
                className="rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-fg">{lesson?.title ?? s.lessonId}</p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(s.completedAt).toLocaleString()} · {cat?.name ?? s.categoryId} ·{" "}
                      {concept?.name}
                    </p>
                    <p className="mt-1 font-mono text-[11px] leading-relaxed break-words tabular-nums text-subtle">
                      {s.timeBudget}m asked · {s.actualMinutes}m used · quiz {s.quizCorrect}/
                      {s.quizTotal ?? 3} · {s.understanding.replace("_", " ")} · {s.mode} ·{" "}
                      {sourceLabel(s.sourceType)}
                      {s.difficultyNote ? ` · ${difficultyLabel(s.difficultyNote)}` : ""}
                    </p>
                  </div>
                  {lesson && (
                    <Link
                      to="/learn/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="shrink-0 text-xs text-muted no-underline hover:text-fg"
                    >
                      Open
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function difficultyLabel(note: DifficultyNote): string {
  if (note === "too_easy") return "too easy";
  if (note === "right_level") return "right level";
  if (note === "too_hard") return "too hard";
  return "unclear";
}

