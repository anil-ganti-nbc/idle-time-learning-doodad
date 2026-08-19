import { useProgress } from "@/lib/learning/progress";
import { cn } from "@/lib/utils";

export function JournalistToggle({ className }: { className?: string }) {
  const on = useProgress((s) => s.settings.journalistDepth);
  const set = useProgress((s) => s.setJournalist);

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-fg">Journalist depth</p>
        <p className="mt-0.5 text-sm leading-snug text-muted">
          Skip introductions you already meet at work. Prefer mechanisms: NA, overlay, stochastics, windows.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => set(!on)}
        className={cn(
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-150",
          on ? "bg-primary" : "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-6 rounded-full transition-transform duration-150",
            on ? "translate-x-5 bg-primary-fg" : "translate-x-0 bg-fg/80",
          )}
        />
        <span className="sr-only">Journalist depth</span>
      </button>
    </div>
  );
}
