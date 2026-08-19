import type { Lesson, SourceType } from "@/lib/learning/types";
import { cn } from "@/lib/utils";

const LABELS: Record<SourceType, string> = {
  seed: "Human (seed)",
  human: "Human",
  imported: "Imported",
  ai: "AI-generated",
};

export function sourceLabel(type: SourceType): string {
  return LABELS[type];
}

export function SourceBadge({ lesson, className }: { lesson: Lesson; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase",
        lesson.source.type === "ai" && "bg-raised text-warn",
        lesson.source.type === "imported" && "bg-raised text-muted",
        (lesson.source.type === "human" || lesson.source.type === "seed") && "bg-raised text-ok",
        className,
      )}
    >
      {LABELS[lesson.source.type]}
    </span>
  );
}

export function ProvenanceLine({ lesson }: { lesson: Lesson }) {
  const s = lesson.source;
  const bits = [
    LABELS[s.type],
    s.provider && s.provider !== "human" ? s.provider : null,
    s.model,
    s.promptVersion,
    s.generatedAt ? new Date(s.generatedAt).toLocaleString() : s.importedAt ? new Date(s.importedAt).toLocaleString() : null,
    s.author && s.author !== "Dead Air University" ? s.author : null,
  ].filter(Boolean);
  return (
    <p className="text-xs leading-relaxed text-subtle">
      {bits.join(" · ")}
      {s.links && s.links.length > 0 && (
        <>
          {" · "}
          {s.links.map((href) => (
            <a key={href} href={href} className="underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
              source
            </a>
          ))}
        </>
      )}
    </p>
  );
}
