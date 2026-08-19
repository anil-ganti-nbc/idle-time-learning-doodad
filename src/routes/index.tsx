import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HydrateGate } from "@/components/hydrate";
import { JournalistToggle } from "@/components/journalist-toggle";
import { Button } from "@/components/ui/button";
import { computeMetrics, formatDuration } from "@/lib/learning/metrics";
import { useProgress } from "@/lib/learning/progress";
import { isDue } from "@/lib/learning/srs";
import { useCatalog } from "@/lib/learning/use-catalog";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <HydrateGate>
      <HomeReady />
    </HydrateGate>
  );
}

function HomeReady() {
  const catalog = useCatalog();
  const sessions = useProgress((s) => s.sessions);
  const concepts = useProgress((s) => s.concepts);
  const profile = useProgress((s) => s.profile);
  const metrics = computeMetrics(sessions, concepts);
  const dueNames = Object.values(concepts)
    .filter((c) => isDue(c))
    .slice(0, 3)
    .map((c) => catalog.conceptMap[c.conceptId]?.name ?? c.conceptId);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">Dead air is a curriculum</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl">
        {profile.displayName ? `${profile.displayName.split(" ")[0]}, I have time to kill.` : "I have time to kill."}
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        Pick a gap. Get one unit that fits. No streaks, no gems — just a concept, an example, and
        three questions.
      </p>

      <Button asChild variant="primary" size="xl" className="mt-8 w-full sm:w-auto">
        <Link to="/session" className="no-underline">
          I have time to kill
          <ArrowRight className="size-5" />
        </Link>
      </Button>

      <section className="mt-12 grid grid-cols-2 gap-3">
        <Metric label="Downtime this month" value={formatDuration(metrics.monthMinutes)} />
        <Metric label="New concepts learned" value={String(metrics.conceptsLearned)} />
        <Metric
          label="7-day retention"
          value={metrics.retention7 === null ? "—" : `${metrics.retention7}%`}
        />
        <Metric label="Reviews due" value={String(metrics.reviewsDue)} />
      </section>

      {metrics.totalSessions === 0 && (
        <p className="mt-6 text-sm text-subtle">
          No sessions on this device yet. Five minutes is enough to start the graph.
        </p>
      )}

      {dueNames.length > 0 && (
        <p className="mt-6 text-sm text-muted">
          Waiting: {dueNames.join(" · ")}
          {metrics.reviewsDue > dueNames.length ? "…" : ""}.{" "}
          <Link to="/reviews" className="text-fg underline-offset-4 hover:underline">
            Open reviews
          </Link>
        </p>
      )}

      <div className="mt-12 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <JournalistToggle />
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link to="/library" className="text-muted no-underline hover:text-fg">
          Browse topics
        </Link>
        <Link to="/graph" className="text-muted no-underline hover:text-fg">
          Knowledge graph
        </Link>
        <Link to="/history" className="text-muted no-underline hover:text-fg">
          History
        </Link>
        <Link to="/settings" className="text-muted no-underline hover:text-fg">
          Settings
        </Link>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      <p className="text-xs tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl tabular-nums tracking-tight text-fg">{value}</p>
    </div>
  );
}
