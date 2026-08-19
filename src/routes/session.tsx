import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { HydrateGate } from "@/components/hydrate";
import { JournalistToggle } from "@/components/journalist-toggle";
import { Button } from "@/components/ui/button";
import { generateLesson } from "@/lib/ai/client";
import { useAiContext } from "@/lib/ai/use-ai";
import { startLive, getLive } from "@/lib/learning/live";
import { useProgress } from "@/lib/learning/progress";
import { missingConceptForGeneration, selectLesson } from "@/lib/learning/select";
import { conceptState } from "@/lib/learning/state";
import type { CategoryId, Effort, Mode, TimeBudget } from "@/lib/learning/types";
import { useCatalog } from "@/lib/learning/use-catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/session")({
  validateSearch: (raw: Record<string, unknown>) => {
    const search: { category?: string; mode?: string } = {};
    if (typeof raw.category === "string") search.category = raw.category;
    if (typeof raw.mode === "string") search.mode = raw.mode;
    return search;
  },
  component: SessionPage,
});

const TIMES: { value: TimeBudget; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 20, label: "20 min" },
  { value: 30, label: "30+" },
];

const MODE_OPTS: { value: Mode; label: string; hint: string }[] = [
  { value: "explore", label: "Explore", hint: "A new concept that fits" },
  { value: "reinforce", label: "Reinforce", hint: "Due reviews first" },
  { value: "surprise", label: "Surprise me", hint: "Away from recent topics" },
];

const EFFORT_OPTS: { value: Effort | null; label: string }[] = [
  { value: null, label: "Any" },
  { value: "light", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "deep", label: "Deep" },
];

function SessionPage() {
  return (
    <HydrateGate>
      <SessionReady />
    </HydrateGate>
  );
}

function SessionReady() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const settings = useProgress((s) => s.settings);
  const profile = useProgress((s) => s.profile);
  const remember = useProgress((s) => s.rememberRouter);
  const progress = useProgress((s) => s.concepts);
  const recent = useProgress((s) => s.recentCategoryIds);
  const upsertLesson = useProgress((s) => s.upsertLesson);
  const logGeneration = useProgress((s) => s.logGeneration);
  const ai = useProgress((s) => s.ai);
  const liveGens = getLive()?.generations ?? 0;
  const aiCtx = useAiContext(liveGens);

  const initialCategory =
    (search.category as CategoryId | "random" | undefined) ??
    settings.lastCategory ??
    (profile.preferredTopics[0] ?? null);
  const initialMode = (search.mode as Mode | undefined) ?? settings.lastMode;

  const [minutes, setMinutes] = useState<TimeBudget>(settings.lastTime || settings.preferredDuration);
  const [category, setCategory] = useState<CategoryId | "random" | null>(initialCategory);
  const [effort, setEffort] = useState<Effort | null>(settings.lastEffort ?? settings.preferredEffort);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const preview = useMemo(
    () =>
      selectLesson(
        { minutes, category, effort, mode, journalistDepth: settings.journalistDepth },
        progress,
        recent,
        catalog,
        profile,
      ),
    [minutes, category, effort, mode, settings.journalistDepth, progress, recent, catalog, profile],
  );

  const missing = useMemo(
    () =>
      missingConceptForGeneration(
        { minutes, category, effort, mode, journalistDepth: settings.journalistDepth },
        progress,
        catalog,
        profile,
      ),
    [minutes, category, effort, mode, settings.journalistDepth, progress, catalog, profile],
  );

  function go(lessonId: string) {
    remember({ lastTime: minutes, lastCategory: category, lastEffort: effort, lastMode: mode });
    startLive({
      lessonId,
      startedAt: new Date().toISOString(),
      mode,
      timeBudget: minutes,
    });
    void navigate({ to: "/learn/$lessonId", params: { lessonId } });
  }

  function start() {
    if (!preview) {
      setError("Nothing in the catalog fits this combination. Widen topic or time, or generate a unit.");
      return;
    }
    go(preview.lesson.id);
  }

  async function generateMissing() {
    if (!missing) return;
    const concept = catalog.conceptMap[missing.conceptId];
    if (!concept) return;
    setBusy(true);
    setError(null);
    const known = profile.knownConceptIds
      .map((id) => catalog.conceptMap[id])
      .filter(Boolean)
      .map((c) => ({ id: c.id, name: c.name }));
    const weak = Object.values(progress)
      .filter((p) => conceptState(p) === "shaky")
      .map((p) => ({ id: p.conceptId, name: catalog.conceptMap[p.conceptId]?.name ?? p.conceptId }));
    const result = await generateLesson(
      aiCtx,
      {
        concept,
        durationMin: minutes,
        effort: effort ?? "normal",
        journalist: settings.journalistDepth,
        known,
        weak,
        recent: [],
        adapt: settings.journalistDepth ? "skip-known" : undefined,
      },
      { hasLocalMatch: Boolean(preview) },
    );
    setBusy(false);
    if (!result.ok) {
      setError(result.error + (result.issues ? ` ${result.issues[0]}` : ""));
      return;
    }
    upsertLesson(result.value);
    logGeneration({
      id: `gen-${Date.now()}`,
      at: new Date().toISOString(),
      kind: "lesson",
      provider: result.provider,
      model: result.model,
      promptVersion: result.value.source.promptVersion ?? "dau-lesson-v1",
      ok: true,
      lessonId: result.value.id,
      conceptId: concept.id,
      cached: result.cached,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    });
    toast(result.cached ? "Reused a cached unit." : "Generated a structured unit.");
    go(result.value.id);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">Session</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">How long is the gap?</h1>
      <p className="mt-2 text-sm text-muted">One unit. No playlist. Options below are optional.</p>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TIMES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setMinutes(t.value)}
            className={cn(
              "min-h-16 rounded-lg text-base font-medium transition-[box-shadow,background-color] duration-150",
              minutes === t.value
                ? "bg-primary text-primary-fg"
                : "bg-surface text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-fg">Mode</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {MODE_OPTS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={cn(
                "min-h-16 rounded-lg px-3 py-3 text-left transition-[box-shadow] duration-150",
                mode === m.value
                  ? "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.18)]"
                  : "bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
              )}
            >
              <span className="block text-sm font-medium">{m.label}</span>
              <span className="mt-1 block text-xs text-muted">{m.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <details className="group rounded-xl bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <summary className="cursor-pointer list-none text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
            Narrow the field
            <span className="ml-2 font-normal text-muted">
              {category && category !== "random"
                ? catalog.categoryMap[category]?.name
                : "any topic"}
              {effort ? ` · ${effort}` : " · any effort"}
            </span>
          </summary>
          <div className="mt-4">
            <h2 className="text-xs tracking-wide text-muted uppercase">Topic</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip
                active={category === null || category === "random"}
                onClick={() => setCategory("random")}
              >
                Any / surprise
              </Chip>
              {catalog.categories.map((c) => (
                <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                  {c.name}
                </Chip>
              ))}
            </div>
            <h2 className="mt-6 text-xs tracking-wide text-muted uppercase">Mental effort</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {EFFORT_OPTS.map((e) => (
                <Chip key={e.label} active={effort === e.value} onClick={() => setEffort(e.value)}>
                  {e.label}
                </Chip>
              ))}
            </div>
          </div>
        </details>
      </section>

      <div className="mt-8 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <JournalistToggle />
      </div>

      {preview && (
        <p className="mt-8 text-sm leading-relaxed text-muted">
          Ready: <span className="text-fg">{preview.lesson.title}</span>
          {" · "}
          {preview.lesson.durationMin} min
          {" · "}
          {catalog.conceptMap[preview.lesson.conceptId]?.name}
          <span className="mt-1 block text-subtle">{preview.reason}</span>
        </p>
      )}

      {error && <p className="mt-4 text-sm text-bad">{error}</p>}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button type="button" size="lg" className="w-full sm:w-auto" onClick={start} disabled={busy}>
          Start learning
        </Button>
        {ai.enabled && ai.policy !== "off" && missing && (
          <Button type="button" size="lg" variant="secondary" onClick={() => void generateMissing()} disabled={busy}>
            {busy ? "Generating…" : "Generate a missing unit"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-full px-3.5 text-sm transition-colors duration-150",
        active ? "bg-primary text-primary-fg" : "bg-raised text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
