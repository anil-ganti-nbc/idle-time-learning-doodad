import { createFileRoute, Link } from "@tanstack/react-router";
import { HydrateGate } from "@/components/hydrate";
import { coursesForCategory } from "@/lib/learning/curriculum";
import { useProgress } from "@/lib/learning/progress";
import { isConceptUnlocked, makeReadinessContext } from "@/lib/learning/readiness";
import { nextConcepts } from "@/lib/learning/select";
import { daysUntil, isDue } from "@/lib/learning/srs";
import { conceptState, stateLabel } from "@/lib/learning/state";
import type { Concept, ConceptProgress, ConceptState, Course } from "@/lib/learning/types";
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
  const courseRows = useProgress((s) => s.courses);
  const roots = catalog.concepts.filter((c) => !c.parentId);
  const known = profile.knownConceptIds;
  const next = nextConcepts(catalog, progress, journalist, known, courseRows).slice(0, 6);
  const weak = catalog.concepts.filter((c) => conceptState(progress[c.id], known.includes(c.id)) === "shaky").slice(0, 6);
  const readiness = makeReadinessContext(catalog, progress, profile, courseRows);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">Progression</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">Knowledge graph</h1>
      <p className="mt-2 text-sm text-muted">
        Courses group concepts into modules. A locked unit stays closed until its prerequisites are
        demonstrated — not merely opened, and not because journalist depth is on.
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
        {catalog.categories
          .filter((cat) => cat.status !== "retired" || catalog.concepts.some((c) => c.category === cat.id && progress[c.id]?.encountered))
          .map((cat) => {
          const courses = coursesForCategory(catalog, cat.id);
          if (courses.length > 0) {
            return (
              <div key={cat.id} className="space-y-10">
                {courses.map((course) => (
                  <CourseSection
                    key={course.id}
                    course={course}
                    categoryName={cat.name}
                    progress={progress}
                    known={known}
                    readiness={readiness}
                  />
                ))}
              </div>
            );
          }
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
                    readiness={readiness}
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

function CourseSection({
  course,
  categoryName,
  progress,
  known,
  readiness,
}: {
  course: Course;
  categoryName: string;
  progress: Record<string, ConceptProgress>;
  known: string[];
  readiness: ReturnType<typeof makeReadinessContext>;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-xl tracking-tight">{course.title}</h2>
          <p className="mt-1 text-xs text-muted">{categoryName}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/course/$courseId"
            params={{ courseId: course.id }}
            className="text-xs text-muted no-underline hover:text-fg"
          >
            Course
          </Link>
          <Link
            to="/session"
            search={{ category: course.categoryId }}
            className="text-xs text-muted no-underline hover:text-fg"
          >
            Study
          </Link>
        </div>
      </div>
      <div className="space-y-5">
        {course.modules
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((mod) => (
            <div key={mod.id}>
              <p className="text-xs tracking-wide text-muted uppercase">{mod.title}</p>
              <ul className="mt-1 space-y-1">
                {mod.conceptIds.map((id) => {
                  const concept = readiness.catalog.conceptMap[id];
                  if (!concept) return null;
                  return (
                    <ModuleRow
                      key={id}
                      concept={concept}
                      progress={progress}
                      known={known}
                      readiness={readiness}
                    />
                  );
                })}
              </ul>
            </div>
          ))}
      </div>
    </section>
  );
}

function ModuleRow({
  concept,
  progress,
  known,
  readiness,
}: {
  concept: Concept;
  progress: Record<string, ConceptProgress>;
  known: string[];
  readiness: ReturnType<typeof makeReadinessContext>;
}) {
  const p = progress[concept.id];
  const locked = !isConceptUnlocked(concept, readiness);
  const state = conceptState(p, known.includes(concept.id));
  const due = isDue(p);
  const until = daysUntil(p?.nextReviewAt ?? null);
  return (
    <li className="flex items-baseline justify-between gap-3 rounded-md py-1.5">
      <div className="min-w-0">
        <span className={cn("mr-2 inline-block size-1.5 rounded-full align-middle", DOT[state])} aria-hidden />
        <span className={cn("text-sm", locked && !p?.encountered ? "text-subtle" : "text-fg")}>
          {concept.name}
        </span>
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
    </li>
  );
}

function Node({
  concept,
  progress,
  depth,
  catalogConcepts,
  known,
  readiness,
}: {
  concept: Concept;
  progress: Record<string, ConceptProgress>;
  depth: number;
  catalogConcepts: Concept[];
  known: string[];
  readiness: ReturnType<typeof makeReadinessContext>;
}) {
  const children = catalogConcepts.filter((c) => c.parentId === concept.id);
  const p = progress[concept.id];
  const locked = !isConceptUnlocked(concept, readiness);
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
              readiness={readiness}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
