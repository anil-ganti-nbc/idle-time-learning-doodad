import { createFileRoute, Link } from "@tanstack/react-router";
import { HydrateGate } from "@/components/hydrate";
import { inferTier } from "@/lib/learning/curriculum";
import { useProgress } from "@/lib/learning/progress";
import {
  frontierConcepts,
  isConceptUnlocked,
  isDemonstrated,
  makeReadinessContext,
} from "@/lib/learning/readiness";
import { conceptState, stateLabel } from "@/lib/learning/state";
import { useCatalog } from "@/lib/learning/use-catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/course/$courseId")({
  component: CoursePage,
});

function CoursePage() {
  return (
    <HydrateGate>
      <CourseReady />
    </HydrateGate>
  );
}

function CourseReady() {
  const { courseId } = Route.useParams();
  const catalog = useCatalog();
  const course = catalog.courseMap[courseId];
  const progress = useProgress((s) => s.concepts);
  const profile = useProgress((s) => s.profile);
  const courseRows = useProgress((s) => s.courses);
  const readiness = makeReadinessContext(catalog, progress, profile, courseRows);

  if (!course) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl">Course not found</h1>
        <Link to="/graph" className="mt-4 inline-block text-sm text-muted hover:text-fg">
          Back to the graph
        </Link>
      </div>
    );
  }

  const frontier = frontierConcepts(course, readiness);
  const next = frontier[0];
  const categoryName = catalog.categoryMap[course.categoryId]?.name ?? course.categoryId;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">{categoryName}</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">{course.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{course.description}</p>

      {next && (
        <p className="mt-5 text-sm text-muted">
          Open now: <span className="text-fg">{next.name}</span>
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link
          to="/session"
          search={{ category: course.categoryId }}
          className="text-fg no-underline hover:underline"
        >
          Study this course
        </Link>
        <Link to="/graph" className="text-muted no-underline hover:text-fg">
          Full graph
        </Link>
      </div>

      <ol className="mt-10 space-y-8">
        {course.modules
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((mod, index) => (
            <li key={mod.id}>
              <p className="font-mono text-[11px] tabular-nums text-subtle">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 font-display text-xl tracking-tight">{mod.title}</h2>
              {mod.blurb && <p className="mt-1 text-sm text-muted">{mod.blurb}</p>}
              <ul className="mt-3 space-y-1">
                {mod.conceptIds.map((id) => {
                  const concept = catalog.conceptMap[id];
                  if (!concept) return null;
                  const unlocked = isConceptUnlocked(concept, readiness);
                  const held = isDemonstrated(concept.id, readiness, inferTier(concept));
                  const state = conceptState(progress[id], profile.knownConceptIds.includes(id));
                  const isNext = next?.id === id;
                  return (
                    <li
                      key={id}
                      className={cn(
                        "flex items-baseline justify-between gap-3 rounded-md px-3 py-2",
                        isNext && "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                      )}
                    >
                      <span className={cn("text-sm", unlocked || held ? "text-fg" : "text-subtle")}>
                        {concept.name}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] tabular-nums text-subtle">
                        {held ? "held" : isNext ? "next" : unlocked ? stateLabel(state) : "locked"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
      </ol>

      {course.sourceReferences.length > 0 && (
        <section className="mt-12 border-t border-border/70 pt-6">
          <p className="text-xs tracking-[0.16em] text-muted uppercase">What informed this order</p>
          <ul className="mt-3 space-y-3">
            {course.sourceReferences.map((ref) => (
              <li key={ref.title} className="text-sm">
                {ref.url ? (
                  <a href={ref.url} className="text-fg underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
                    {ref.title}
                  </a>
                ) : (
                  <span className="text-fg">{ref.title}</span>
                )}
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">{ref.notes}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
