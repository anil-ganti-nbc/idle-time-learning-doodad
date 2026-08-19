import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HydrateGate } from "@/components/hydrate";
import { Button } from "@/components/ui/button";
import { lessonsForConceptFrom } from "@/lib/learning/catalog";
import { startLive } from "@/lib/learning/live";
import { useProgress } from "@/lib/learning/progress";
import { daysUntil, isDue } from "@/lib/learning/srs";
import { useCatalog } from "@/lib/learning/use-catalog";

export const Route = createFileRoute("/reviews")({ component: ReviewsPage });

function ReviewsPage() {
  return (
    <HydrateGate>
      <ReviewsReady />
    </HydrateGate>
  );
}

function ReviewsReady() {
  const navigate = useNavigate();
  const catalog = useCatalog();
  const concepts = useProgress((s) => s.concepts);
  const due = Object.values(concepts)
    .filter((c) => isDue(c) || (daysUntil(c.nextReviewAt) ?? 99) <= 0)
    .sort((a, b) => (a.nextReviewAt ?? "").localeCompare(b.nextReviewAt ?? ""));
  const upcoming = Object.values(concepts)
    .filter((c) => c.nextReviewAt && !due.includes(c))
    .sort((a, b) => (a.nextReviewAt ?? "").localeCompare(b.nextReviewAt ?? ""))
    .slice(0, 8);

  function open(conceptId: string) {
    const lesson = lessonsForConceptFrom(catalog, conceptId)[0];
    if (!lesson) return;
    startLive({
      lessonId: lesson.id,
      startedAt: new Date().toISOString(),
      mode: "reinforce",
      timeBudget: lesson.durationMin,
    });
    void navigate({ to: "/learn/$lessonId", params: { lessonId: lesson.id } });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">Spaced review</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">Reviews</h1>
      <p className="mt-2 text-sm text-muted">
        Due items first. Intervals come from rating, quiz, encounters, and recent review history —
        not a streak clock.
      </p>

      {due.length === 0 ? (
        <p className="mt-10 text-sm text-subtle">Nothing is due. The next review will appear here.</p>
      ) : (
        <ul className="mt-8 space-y-2">
          {due.map((c) => (
            <Row
              key={c.conceptId}
              name={catalog.conceptMap[c.conceptId]?.name ?? c.conceptId}
              topic={catalog.categoryMap[catalog.conceptMap[c.conceptId]?.category ?? ""]?.name ?? ""}
              meta="Due now"
              onOpen={() => open(c.conceptId)}
            />
          ))}
        </ul>
      )}

      {upcoming.length > 0 && (
        <>
          <h2 className="mt-12 text-sm font-medium">Upcoming</h2>
          <ul className="mt-3 space-y-2">
            {upcoming.map((c) => {
              const d = daysUntil(c.nextReviewAt);
              return (
                <Row
                  key={c.conceptId}
                  name={catalog.conceptMap[c.conceptId]?.name ?? c.conceptId}
                  topic={catalog.categoryMap[catalog.conceptMap[c.conceptId]?.category ?? ""]?.name ?? ""}
                  meta={d === null ? "" : d <= 0 ? "today" : `${d}d`}
                  onOpen={() => open(c.conceptId)}
                />
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function Row({
  name,
  topic,
  meta,
  onOpen,
}: {
  name: string;
  topic: string;
  meta: string;
  onOpen: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      <div className="min-w-0">
        <p className="truncate text-sm text-fg">{name}</p>
        <p className="text-xs text-muted">
          {topic} · {meta}
        </p>
      </div>
      <Button type="button" size="sm" variant="secondary" onClick={onOpen}>
        Review
      </Button>
    </li>
  );
}
