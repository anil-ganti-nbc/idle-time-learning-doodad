import { useEffect, useState, type ReactNode } from "react";
import { useProgress } from "@/lib/learning/progress";

export function HydrateGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (useProgress.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return useProgress.persist.onFinishHydration(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="space-y-4" aria-hidden>
        <div className="h-10 w-48 animate-pulse rounded-md bg-raised" />
        <div className="h-24 w-full animate-pulse rounded-lg bg-raised" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 animate-pulse rounded-lg bg-raised" />
          <div className="h-20 animate-pulse rounded-lg bg-raised" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
