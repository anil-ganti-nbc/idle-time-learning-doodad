import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { HydrateGate } from "@/components/hydrate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateLesson, generatePath } from "@/lib/ai/client";
import { toGenerationLog } from "@/lib/ai/attempt";
import { useAiContext } from "@/lib/ai/use-ai";
import { makeId } from "@/lib/learning/catalog";
import { useProgress } from "@/lib/learning/progress";
import type { Effort, Level } from "@/lib/learning/types";
import { useCatalog } from "@/lib/learning/use-catalog";

export const Route = createFileRoute("/topics")({ component: TopicsPage });

function TopicsPage() {
  return (
    <HydrateGate>
      <TopicsReady />
    </HydrateGate>
  );
}

function TopicsReady() {
  const catalog = useCatalog();
  const customCategories = useProgress((s) => s.customCategories);
  const upsertCategory = useProgress((s) => s.upsertCategory);
  const upsertConcept = useProgress((s) => s.upsertConcept);
  const upsertLesson = useProgress((s) => s.upsertLesson);
  const removeCategory = useProgress((s) => s.removeCategory);
  const pending = useProgress((s) => s.pendingPath);
  const setPending = useProgress((s) => s.setPendingPath);
  const approvePath = useProgress((s) => s.approvePath);
  const logGeneration = useProgress((s) => s.logGeneration);
  const profile = useProgress((s) => s.profile);
  const ai = useProgress((s) => s.ai);
  const aiCtx = useAiContext(0);

  const [name, setName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [subject, setSubject] = useState("");
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [conceptName, setConceptName] = useState("");
  const [conceptCat, setConceptCat] = useState(customCategories[0]?.id ?? "");

  function addTopic() {
    if (!name.trim()) return;
    const id = makeId("topic", name);
    upsertCategory({ id, name: name.trim(), blurb: blurb.trim() || "Custom field.", custom: true });
    setConceptCat(id);
    setName("");
    setBlurb("");
  }

  function addConcept() {
    if (!conceptName.trim() || !conceptCat) return;
    upsertConcept({
      id: makeId("c", conceptName),
      name: conceptName.trim(),
      category: conceptCat,
      prerequisites: [],
      level: "intro",
      summary: conceptName.trim(),
      custom: true,
      createdAt: new Date().toISOString(),
    });
    setConceptName("");
  }

  async function proposePath() {
    if (!subject.trim()) return;
    setBusy(true);
    const result = await generatePath(aiCtx, subject.trim(), profile.customInterests);
    setBusy(false);
    logGeneration(toGenerationLog("path", result));
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setPending(result.value);
  }

  async function fromSource() {
    if (!source.trim() || !conceptCat) {
      toast.error("Pick a topic and paste source text.");
      return;
    }
    const existing = catalog.concepts.find((c) => c.category === conceptCat);
    const concept = existing ?? {
      id: makeId("c", "source"),
      name: name || "Sourced concept",
      category: conceptCat,
      prerequisites: [],
      level: "core" as Level,
      summary: "Generated from supplied notes.",
      custom: true,
    };
    if (!catalog.conceptMap[concept.id]) upsertConcept(concept);
    setBusy(true);
    const result = await generateLesson(aiCtx, {
      concept,
      durationMin: 10,
      effort: "normal" as Effort,
      journalist: false,
      known: [],
      weak: [],
      recent: [],
      sourceText: source,
    });
    setBusy(false);
    logGeneration(
      toGenerationLog("source", result, {
        lessonId: result.ok ? result.value.id : undefined,
        conceptId: concept.id,
      }),
    );
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    upsertLesson({
      ...result.value,
      source: { ...result.value.source, sourceExcerpt: source.slice(0, 400) },
    });
    toast("Grounded lesson saved.");
    setSource("");
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">Your catalog</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">Custom topics</h1>
      <p className="mt-2 text-sm text-muted">
        Same model as the seeded fields: a topic, concepts with prerequisites, then lessons. AI
        may propose a path — it does not become real until you approve it.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-medium">New field</h2>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Byzantine history" />
        <Input value={blurb} onChange={(e) => setBlurb(e.target.value)} placeholder="Short blurb" />
        <Button type="button" variant="secondary" onClick={addTopic}>
          Add topic
        </Button>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-sm font-medium">Add a concept</h2>
        <select
          className="h-11 w-full rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
          value={conceptCat}
          onChange={(e) => setConceptCat(e.target.value)}
        >
          <option value="">Choose a topic</option>
          {customCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Input value={conceptName} onChange={(e) => setConceptName(e.target.value)} placeholder="Theme parks of Constantinople" />
        <Button type="button" variant="secondary" onClick={addConcept}>
          Add concept
        </Button>
      </section>

      {customCategories.length > 0 && (
        <ul className="mt-8 space-y-2">
          {customCategories.map((c) => {
            const concepts = catalog.concepts.filter((x) => x.category === c.id);
            return (
              <li key={c.id} className="rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-fg">{c.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {concepts.map((x) => x.name).join(" · ") || "No concepts yet"}
                    </p>
                  </div>
                  <button type="button" className="text-xs text-bad" onClick={() => removeCategory(c.id)}>
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {ai.enabled && (
        <>
          <section className="mt-10 space-y-3">
            <h2 className="text-sm font-medium">Build a learning path</h2>
            <p className="text-sm text-muted">e.g. “Teach me compiler design”</p>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Teach me jazz harmony" />
            <Button type="button" onClick={() => void proposePath()} disabled={busy}>
              {busy ? "Proposing…" : "Propose path"}
            </Button>
          </section>

          {pending && (
            <section className="mt-6 rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <p className="text-xs tracking-wide text-warn uppercase">Needs your approval</p>
              <h3 className="mt-2 font-display text-2xl">{pending.title}</h3>
              <p className="mt-1 text-sm text-muted">{pending.blurb}</p>
              <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm">
                {pending.sequence.map((id) => {
                  const c = pending.concepts.find((x) => x.id === id);
                  return <li key={id}>{c?.name ?? id}</li>;
                })}
              </ol>
              <div className="mt-5 flex gap-2">
                <Button type="button" onClick={() => approvePath(pending)}>
                  Approve into catalog
                </Button>
                <Button type="button" variant="secondary" onClick={() => setPending(null)}>
                  Discard
                </Button>
              </div>
            </section>
          )}

          <section className="mt-10 space-y-3">
            <h2 className="text-sm font-medium">Lesson from source</h2>
            <p className="text-sm text-muted">Paste notes or Markdown. The unit stays grounded in that text.</p>
            <Textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Paste article text or notes…"
            />
            <Button type="button" variant="secondary" onClick={() => void fromSource()} disabled={busy}>
              Generate from source
            </Button>
          </section>
        </>
      )}
    </div>
  );
}
