import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Pick a time gap",
    body: "Five, ten, twenty, or thirty minutes. DAU chooses one bounded unit that fits.",
  },
  {
    title: "Read, then three questions",
    body: "A concept, an example, and a short quiz. Then you say how well it sat so the review schedule can move.",
  },
  {
    title: "Progress stays on this device",
    body: "The graph, reviews, and history live in this browser. A hosted URL is not an account and does not sync.",
  },
  {
    title: "No streaks, XP, or nagging",
    body: "There are no gems, leaderboards, or daily-login tricks. A missed day is just a missed day.",
  },
  {
    title: "Export when you want a copy",
    body: "A versioned JSON archive is how you move or back up. Merge will not silently overwrite newer local work.",
  },
  {
    title: "AI is optional",
    body: "The seeded university is complete. Generation is an off-by-default extra, not a requirement for study.",
  },
];

export function HowItWorks({ className }: { className?: string }) {
  return (
    <ol className={cn("space-y-5", className)}>
      {STEPS.map((step, i) => (
        <li key={step.title} className="flex gap-3">
          <span className="mt-0.5 w-5 shrink-0 font-mono text-xs tabular-nums text-subtle">{i + 1}</span>
          <div className="min-w-0">
            <p className="font-medium text-fg">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
