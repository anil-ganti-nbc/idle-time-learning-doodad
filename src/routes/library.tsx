import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HydrateGate } from "@/components/hydrate";
import { SourceBadge } from "@/components/provenance";
import { Input } from "@/components/ui/input";
import { startLive } from "@/lib/learning/live";
import { useProgress } from "@/lib/learning/progress";
import { conceptState } from "@/lib/learning/state";
import { useCatalog } from "@/lib/learning/use-catalog";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({ component: LibraryPage });

function LibraryPage() {
  return (
    <HydrateGate>
      <LibraryReady />
    </HydrateGate>
  );
}

function LibraryReady() {
  const catalog = useCatalog();
  const progress = useProgress((s) => s.concepts);
  const lastMode = useProgress((s) => s.settings.lastMode);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [source, setSource] = useState<"all" | "seed" | "ai" | "imported" | "human">("all");

  const lessons = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return catalog.lessons.filter((l) => {
      if (source !== "all") {
        if (source === "human" && l.source.type !== "human" && l.source.type !== "seed") return false;
        if (source !== "human" && l.source.type !== source) return false;
      }
      if (!needle) return true;
      const concept = catalog.conceptMap[l.conceptId];
      const cat = concept ? catalog.categoryMap[concept.category]?.name : "";
      return [l.title, concept?.name, cat, l.conceptId].some((s) => s?.toLowerCase().includes(needle));
    });
  }, [catalog, q, source]);

  function open(id: string, minutes: 5 | 10 | 20 | 30) {
    startLive({ lessonId: id, startedAt: new Date().toISOString(), mode: lastMode, timeBudget: minutes });
    void navigate({ to: "/learn/$lessonId", params: { lessonId: id } });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">Catalog</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">Library</h1>
      <p className="mt-2 text-sm text-muted">
        {catalog.lessons.length} units across {catalog.categories.length} fields. Search or open a
        unit directly — the router is still the fastest path.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/topics" className="text-sm text-muted no-underline hover:text-fg">
          Custom topics
        </Link>
        <span className="text-subtle">·</span>
        <Link to="/session" className="text-sm text-muted no-underline hover:text-fg">
          Time router
        </Link>
        {catalog.courses.map((course) => (
          <span key={course.id} className="contents">
            <span className="text-subtle">·</span>
            <Link
              to="/course/$courseId"
              params={{ courseId: course.id }}
              className="text-sm text-muted no-underline hover:text-fg"
            >
              {course.title}
            </Link>
          </span>
        ))}
      </div>

      <div className="mt-6">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search lessons or concepts"
          aria-label="Search lessons"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {(["all", "seed", "human", "imported", "ai"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSource(s)}
              className={
                source === s
                  ? "rounded-full bg-primary px-3 py-1.5 text-xs text-primary-fg"
                  : "rounded-full bg-raised px-3 py-1.5 text-xs text-muted"
              }
            >
              {s === "seed" ? "seeded" : s}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-8 space-y-2">
        {catalog.categories.map((cat) => {
          const concepts = catalog.concepts.filter((c) => c.category === cat.id);
          const units = lessons.filter((l) => concepts.some((c) => c.id === l.conceptId));
          if (units.length === 0 && q) return null;
          const seen = concepts.filter((c) => progress[c.id]?.encountered).length;
          return (
            <li key={cat.id} className="rounded-lg bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <details>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 [&::-webkit-details-marker]:hidden">
                  <div>
                    <p className="text-sm font-medium text-fg">
                      {cat.name}
                      {cat.custom ? <span className="ml-2 text-[10px] tracking-wide text-muted uppercase">yours</span> : null}
                    </p>
                    <p className="mt-1 text-sm text-muted">{cat.blurb}</p>
                  </div>
                  <p className="shrink-0 font-mono text-xs tabular-nums text-subtle">
                    {seen}/{concepts.length} · {units.length}u
                  </p>
                </summary>
                <ul className="border-t border-border/60 px-2 py-2">
                  {units.map((l) => {
                    const concept = catalog.conceptMap[l.conceptId];
                    const state = conceptState(progress[l.conceptId]);
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          onClick={() => open(l.id, l.durationMin)}
                          className="flex w-full items-start justify-between gap-3 rounded-md px-2 py-2.5 text-left hover:bg-raised"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm text-fg">{l.title}</p>
                            <p className="mt-0.5 text-xs text-muted">
                              {concept?.name} · {l.durationMin}m · {l.effort} · {state}
                              {concept?.prerequisites.length
                                ? ` · assumes ${concept.prerequisites.map((id) => catalog.conceptMap[id]?.name ?? id).join(", ")}`
                                : ""}
                            </p>
                          </div>
                          <SourceBadge lesson={l} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
