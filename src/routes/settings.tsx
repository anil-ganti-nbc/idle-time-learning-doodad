import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { HydrateGate } from "@/components/hydrate";
import { JournalistToggle } from "@/components/journalist-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAiStatus } from "@/lib/ai/client";
import { PROVIDER_META } from "@/lib/ai/providers";
import { buildExport } from "@/lib/learning/export";
import { survives } from "@/lib/learning/persistence";
import { generationsToday, useProgress } from "@/lib/learning/progress";
import { loadSecrets, saveSecrets, secretFor, secretPatch } from "@/lib/learning/secrets";
import type { AiProviderId, AiSecrets, Effort, TimeBudget } from "@/lib/learning/types";
import { useCatalog } from "@/lib/learning/use-catalog";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <HydrateGate>
      <SettingsReady />
    </HydrateGate>
  );
}

function SettingsReady() {
  const catalog = useCatalog();
  const state = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState<string | null>(null);
  const [includeKeys, setIncludeKeys] = useState(false);
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [secrets, setSecrets] = useState<AiSecrets>({});
  const [xaiEnv, setXaiEnv] = useState(false);
  const [keySources, setKeySources] = useState<Record<string, string>>({});
  const [interest, setInterest] = useState("");

  useEffect(() => {
    setSecrets(loadSecrets());
    void getAiStatus().then((s) => {
      setXaiEnv(s.xaiEnv);
      setKeySources(s.sources ?? {});
    });
  }, []);

  function persistSecrets(next: AiSecrets) {
    setSecrets(next);
    saveSecrets(next);
  }

  function exportJson() {
    const bundle = buildExport(snapshot(), includeKeys ? secrets : undefined, includeKeys);
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dead-air-university-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNote("Exported a versioned JSON archive.");
  }

  function snapshot() {
    const s = useProgress.getState();
    return {
      profile: s.profile,
      settings: s.settings,
      ai: s.ai,
      concepts: s.concepts,
      sessions: s.sessions,
      recentCategoryIds: s.recentCategoryIds,
      customCategories: s.customCategories,
      customConcepts: s.customConcepts,
      customLessons: s.customLessons,
      generationLog: s.generationLog,
      pendingPath: s.pendingPath,
    };
  }

  function onFile(file: File) {
    void file.text().then((text) => {
      try {
        const parsed = JSON.parse(text) as unknown;
        const result = state.importBundle(parsed, mode);
        if (includeKeys && parsed && typeof parsed === "object" && "secrets" in (parsed as object)) {
          persistSecrets({ ...secrets, ...((parsed as { secrets?: AiSecrets }).secrets ?? {}) });
        }
        setNote(
          `Imported (${mode}). Backup taken at ${new Date(result.backupAt).toLocaleString()}. ${result.warnings[0] ?? ""}`.trim(),
        );
        if (result.warnings.length) toast(result.warnings[0]);
        else toast("Import complete.");
      } catch (err) {
        setNote(err instanceof Error ? err.message : "That file was not a progress export.");
      }
    });
  }

  const used = generationsToday(state.generationLog);

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">Local</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-muted">
        Optional profile and AI. Nothing here is required before a session. Progress stays on this
        device unless you export it. The server never holds your graph.
      </p>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-xl tracking-tight">Local profile</h2>
        <label className="block text-xs text-muted">
          Display name
          <Input
            className="mt-1"
            value={state.profile.displayName}
            onChange={(e) => state.updateProfile({ displayName: e.target.value })}
            placeholder="Optional"
          />
        </label>
        <fieldset>
          <legend className="text-xs text-muted">Preferred topics</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {catalog.categories.map((c) => {
              const on = state.profile.preferredTopics.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    state.updateProfile({
                      preferredTopics: on
                        ? state.profile.preferredTopics.filter((id) => id !== c.id)
                        : [...state.profile.preferredTopics, c.id],
                    })
                  }
                  className={
                    on
                      ? "rounded-full bg-primary px-3 py-1.5 text-xs text-primary-fg"
                      : "rounded-full bg-raised px-3 py-1.5 text-xs text-muted"
                  }
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-xs text-muted">Topics to avoid</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {catalog.categories.map((c) => {
              const on = state.profile.avoidTopics.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    state.updateProfile({
                      avoidTopics: on
                        ? state.profile.avoidTopics.filter((id) => id !== c.id)
                        : [...state.profile.avoidTopics, c.id],
                    })
                  }
                  className={
                    on
                      ? "rounded-full bg-bad/20 px-3 py-1.5 text-xs text-bad"
                      : "rounded-full bg-raised px-3 py-1.5 text-xs text-muted"
                  }
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className="block text-xs text-muted">
          Known concepts (comma-separated ids)
          <Input
            className="mt-1 font-mono"
            value={state.profile.knownConceptIds.join(", ")}
            onChange={(e) =>
              state.updateProfile({
                knownConceptIds: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="cpu-pipeline, cmp-front"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-muted">
            Preferred duration
            <select
              className="mt-1 block h-11 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
              value={state.settings.preferredDuration}
              onChange={(e) =>
                state.updateSettings({ preferredDuration: Number(e.target.value) as TimeBudget })
              }
            >
              {[5, 10, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n === 30 ? "30+" : n} min
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted">
            Preferred intensity
            <select
              className="mt-1 block h-11 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
              value={state.settings.preferredEffort ?? ""}
              onChange={(e) =>
                state.updateSettings({
                  preferredEffort: (e.target.value || null) as Effort | null,
                })
              }
            >
              <option value="">Any</option>
              <option value="light">Light</option>
              <option value="normal">Normal</option>
              <option value="deep">Deep</option>
            </select>
          </label>
        </div>
        <div className="flex gap-2">
          <Input
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="Custom interest, e.g. Indian economic history"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              const v = interest.trim();
              if (!v) return;
              state.updateProfile({ customInterests: [...state.profile.customInterests, v] });
              setInterest("");
            }}
          >
            Add
          </Button>
        </div>
        {state.profile.customInterests.length > 0 && (
          <p className="text-sm text-muted">{state.profile.customInterests.join(" · ")}</p>
        )}
      </section>

      <div className="mt-8 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <JournalistToggle />
      </div>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-xl tracking-tight">AI layer</h2>
        <p className="text-sm text-muted">
          Optional. Off by default. Generates structured lessons behind the same flow — never a
          chat window. xAI is wired if this environment has a key; other providers need a local
          key.
        </p>
        <label className="flex items-center justify-between gap-3 text-sm">
          Enable AI
          <input
            type="checkbox"
            checked={state.ai.enabled}
            onChange={(e) => state.updateAi({ enabled: e.target.checked })}
          />
        </label>
        <label className="block text-xs text-muted">
          Provider
          <select
            className="mt-1 block h-11 w-full rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
            value={state.ai.provider}
            onChange={(e) => {
              const provider = e.target.value as AiProviderId;
              state.updateAi({ provider, model: PROVIDER_META[provider].defaultModel });
            }}
          >
            {(Object.keys(PROVIDER_META) as AiProviderId[]).map((id) => (
              <option key={id} value={id}>
                {PROVIDER_META[id].label}
                {PROVIDER_META[id].wired ? " — wired" : " — key required"}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-muted">
          Model
          <Input
            className="mt-1 font-mono"
            value={state.ai.model}
            onChange={(e) => state.updateAi({ model: e.target.value })}
          />
        </label>
        <label className="block text-xs text-muted">
          When to generate
          <select
            className="mt-1 block h-11 w-full rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
            value={state.ai.policy}
            onChange={(e) => state.updateAi({ policy: e.target.value as typeof state.ai.policy })}
          >
            <option value="off">Never (keep the toggle but refuse calls)</option>
            <option value="manual">Manual only</option>
            <option value="missing-only">Only when no local unit fits</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-muted">
            Max / day
            <Input
              className="mt-1"
              type="number"
              min={0}
              value={state.ai.maxPerDay}
              onChange={(e) => state.updateAi({ maxPerDay: Number(e.target.value) || 0 })}
            />
          </label>
          <label className="text-xs text-muted">
            Max / gap
            <Input
              className="mt-1"
              type="number"
              min={0}
              value={state.ai.maxPerSession}
              onChange={(e) => state.updateAi({ maxPerSession: Number(e.target.value) || 0 })}
            />
          </label>
        </div>
        <p className="text-xs text-subtle">
          Used today: {used}/{state.ai.maxPerDay}
          {" · "}
          {describeKeySource(state.ai.provider, keySources[state.ai.provider], xaiEnv)}
        </p>
        <label className="block text-xs text-muted">
          {state.ai.provider === "local"
            ? "Browser fallback — local base URL"
            : `Browser fallback key for ${PROVIDER_META[state.ai.provider].label}`}
          {state.ai.provider === "local" ? (
            <Input
              className="mt-1 font-mono"
              value={secrets.localBaseUrl ?? ""}
              onChange={(e) => persistSecrets({ ...secrets, localBaseUrl: e.target.value })}
              placeholder="http://127.0.0.1:11434/v1"
            />
          ) : (
            <Input
              className="mt-1 font-mono"
              type="password"
              autoComplete="off"
              value={secretFor(state.ai.provider, secrets)}
              onChange={(e) => persistSecrets({ ...secrets, ...secretPatch(state.ai.provider, e.target.value) })}
              placeholder={
                keySources[state.ai.provider] === "env" || keySources[state.ai.provider] === "file"
                  ? "Ignored while an environment or server-file key is present"
                  : "Plaintext on this device only — last resort"
              }
            />
          )}
        </label>
        <p className="text-xs leading-relaxed text-subtle">
          Key lookup order: environment variable, then a local <span className="font-mono">.dau-secrets.json</span>{" "}
          next to the app, then this browser field. Environment and file keys never leave the server. This field is
          a labelled convenience fallback, not a vault.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl tracking-tight">Where this lives</h2>
        <p className="text-sm leading-relaxed text-muted">
          Progress, the knowledge graph, reviews, and custom lessons are stored in this browser.
          Refresh and restart keep them. Switching device or browser profile does not — export a
          JSON archive first. An unfinished lesson lives only in this tab.
        </p>
        <ul className="space-y-1.5 text-sm text-muted">
          <PersistLine event="refresh" />
          <PersistLine event="browserRestart" />
          <PersistLine event="serverRestart" />
          <PersistLine event="deviceChange" />
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl tracking-tight">Export / import</h2>
        <p className="text-sm text-muted">
          Versioned JSON. Import makes a backup first and will not silently overwrite newer local
          progress.
        </p>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={includeKeys} onChange={(e) => setIncludeKeys(e.target.checked)} />
          Include API keys in the file
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          Replace everything on import
          <input
            type="checkbox"
            checked={mode === "replace"}
            onChange={(e) => setMode(e.target.checked ? "replace" : "merge")}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={exportJson}>
            Export archive
          </Button>
          <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
            Import
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </div>
      </section>

      <div className="mt-8">
        <Link to="/topics" className="text-sm text-muted no-underline hover:text-fg">
          Custom topics and learning paths
        </Link>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="mt-8 text-bad"
        onClick={() => {
          if (confirm("Erase all local progress on this device?")) {
            state.resetAll();
            setNote("Progress cleared.");
          }
        }}
      >
        Reset all progress
      </Button>

      {note && <p className="mt-4 text-sm text-muted">{note}</p>}
    </div>
  );
}

function PersistLine({ event }: { event: "refresh" | "browserRestart" | "serverRestart" | "deviceChange" }) {
  const row = survives(event);
  const label =
    event === "refresh"
      ? "Browser refresh"
      : event === "browserRestart"
        ? "Browser restart"
        : event === "serverRestart"
          ? "App / server restart"
          : "Another device";
  return (
    <li>
      <span className="text-fg">{label}.</span> {row.note}
    </li>
  );
}

function describeKeySource(provider: AiProviderId, source: string | undefined, xaiEnv: boolean): string {
  if (source === "env" || (provider === "xai" && xaiEnv)) return "using environment key";
  if (source === "file") return "using local server secrets file";
  if (source === "none") return "no server key — browser fallback only";
  return "key source unknown";
}

