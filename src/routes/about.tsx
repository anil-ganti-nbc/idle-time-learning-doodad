import { createFileRoute, Link } from "@tanstack/react-router";
import { HowItWorks } from "@/components/how-it-works";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">About</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">How Dead Air University works</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        A university for gaps. Local-first. No account required.
      </p>
      <HowItWorks className="mt-8" />
      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link to="/session" className="text-fg no-underline hover:underline">
          Start a gap
        </Link>
        <Link to="/settings" className="text-muted no-underline hover:text-fg">
          Back up your university
        </Link>
        <Link to="/" className="text-muted no-underline hover:text-fg">
          Desk
        </Link>
      </div>
    </div>
  );
}
