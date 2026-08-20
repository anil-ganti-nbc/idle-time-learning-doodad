import { Link, useRouterState } from "@tanstack/react-router";
import { SignedIn, UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/library", label: "Library" },
  { to: "/graph", label: "Graph" },
  { to: "/history", label: "History" },
  { to: "/reviews", label: "Reviews" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/85 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 text-fg no-underline">
            <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.1)]" aria-hidden>
              <span className="flex gap-0.5">
                <span className="h-3 w-0.5 rounded-full bg-primary" />
                <span className="h-3 w-0.5 rounded-full bg-primary" />
              </span>
            </span>
            <span className="truncate font-display text-[15px] tracking-tight">Dead Air University</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm no-underline transition-colors duration-150",
                    active ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/about"
              className={cn(
                "hidden text-sm no-underline sm:inline",
                pathname === "/about" ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              How it works
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border/60 px-2 py-1 sm:hidden">
          {[...NAV, { to: "/about", label: "About", exact: true }].map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "min-h-10 shrink-0 rounded-sm px-3 py-2 text-sm no-underline",
                  active ? "text-fg" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 overflow-x-hidden px-4 py-8 sm:py-12">{children}</main>
    </div>
  );
}
