import { createFileRoute, Link } from "@tanstack/react-router";
import { HydrateGate } from "@/components/hydrate";
import { useProgress } from "@/lib/learning/progress";
import { nextConcepts } from "@/lib/learning/select";
import { daysUntil, isDue } from "@/lib/learning/srs";
import { conceptState, stateLabel } from "@/lib/learning/state";
import type { Concept, ConceptProgress, ConceptState } from "@/lib/learning/types";
import { useCatalog } from "@/lib/learning/use-catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/graph")({ component: GraphPage });

const DOT: Record<ConceptState, string> = {
  unseen: "bg-subtle/50",
  introduced: "bg-muted",
  shaky: "bg-bad",
  understood: "bg-ok",
  due: "bg-warn",
  strong: "bg-primary",
};

function GraphPage() {
  return (
    <HydrateGate>
      <GraphReady />
    </HydrateGate>
  );
}

function GraphReady() {
  const catalog = useCatalog();
  const progress = useProgress((s) => s.concepts);
  const profile = useProgress((s) => s.profile);
  const journalist = useProgress((s) => s.settings.journalistDepth);
  const roots = catalog.concepts.filter((c) => !c.parentId);
  const known = profile.knownConceptIds;
  const next = nextConcepts(catalog, progress, journalist, known).slice(0, 6);
  const weak = catalog.concepts.filter((c) => conceptState(progress[c.id], known.includes(c.id)) === "shaky").slice(0, 6);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">Progression</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">Knowledge graph</h1>
      <p className="mt-2 text-sm text-muted">
        Prerequisites sit above their children. The selector will not open a locked unit until the
        parent is at least “mostly.”
      </p>

      <ul className="mt-6 flex flex-wrap gap-3 text-[11px] text-muted">
        {(Object.keys(DOT) as ConceptState[]).map((s) => (
          <li key={s} className="flex items-center gap-1.5">
            <span className={cn("size-1.5 rounded-full", DOT[s])} />
            {stateLabel(s)}
          </li>
        ))}
      </ul>

      {(next.length > 0 || weak.length > 0) && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <p className="text-xs tracking-wide text-muted uppercase">Logical next</p>
            {next.length === 0 ? (
              <p className="mt-2 text-sm text-subtle">Everything unlocked is already opened.</p>
            ) : (
              <ul className="mt-2 space-y-1">
                {next.map((c) => (
                  <li key={c.id} className="text-sm text-fg">
                    {c.name}
                    <span className="text-subtle"> · {catalog.categoryMap[c.category]?.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <p className="text-xs tracking-wide text-muted uppercase">Weak areas</p>
            {weak.length === 0 ? (
              <p className="mt-2 text-sm text-subtle">No shaky concepts yet.</p>
            ) : (
              <ul className="mt-2 space-y-1">
                {weak.map((c) => (
                  <li key={c.id} className="text-sm text-fg">
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 space-y-10">
        {catalog.categories.map((cat) => {
          const catRoots = roots.filter((c) => c.category === cat.id);
          if (catRoots.length === 0) return null;
          return (
            <section key={cat.id}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="font-display text-xl tracking-tight">{cat.name}</h2>
                <Link
                  to="/session"
                  search={{ category: cat.id }}
                  className="text-xs text-muted no-underline hover:text-fg"
                >
                  Study
                </Link>
              </div>
              <ul className="space-y-1">
                {catRoots.map((c) => (
                  <Node
                    key={c.id}
                    concept={c}
                    progress={progress}
                    depth={0}
                    catalogConcepts={catalog.concepts}
                    known={known}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Node({
  concept,
  progress,
  depth,
  catalogConcepts,
  known,
}: {
  concept: Concept;
  progress: Record<string, ConceptProgress>;
  depth: number;
  catalogConcepts: Concept[];
  known: string[];
}) {
  const children = catalogConcepts.filter((c) => c.parentId === concept.id);
  const p = progress[concept.id];
  const locked = concept.prerequisites.some((id) => {
    const parent = progress[id];
    return !(parent?.understanding === "got_it" || parent?.understanding === "mostly" || known.includes(id));
  });
  const state = conceptState(p, known.includes(concept.id));
  const due = isDue(p);
  const until = daysUntil(p?.nextReviewAt ?? null);

  return (
    <li>
      <div
        className="flex items-baseline justify-between gap-3 rounded-md py-1.5"
        style={{ paddingLeft: depth * 16 }}
      >
        <div className="min-w-0">
          <span className={cn("mr-2 inline-block size-1.5 rounded-full align-middle", DOT[state])} aria-hidden />
          <span className={cn("text-sm", locked && !p?.encountered ? "text-subtle" : "text-fg")}>
            {concept.name}
          </span>
          {concept.level === "journalist" && (
            <span className="ml-2 text-[10px] tracking-wide text-muted uppercase">J</span>
          )}
        </div>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-subtle">
          {due
            ? "due"
            : p?.understanding
              ? until !== null && until > 0
                ? `${until}d`
                : stateLabel(state)
              : locked
                ? "locked"
                : stateLabel(state)}
        </span>
      </div>
      {children.length > 0 && (
        <ul>
          {children.map((c) => (
            <Node
              key={c.id}
              concept={c}
              progress={progress}
              depth={depth + 1}
              catalogConcepts={catalogConcepts}
              known={known}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
