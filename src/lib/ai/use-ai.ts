import { useMemo } from "react";
import { generationsToday } from "@/lib/learning/progress";
import { useProgress } from "@/lib/learning/progress";
import { loadSecrets } from "@/lib/learning/secrets";
import { useCatalog } from "@/lib/learning/use-catalog";
import type { GenerateContext } from "./client";

export function useAiContext(sessionGenerations = 0): GenerateContext {
  const settings = useProgress((s) => s.ai);
  const log = useProgress((s) => s.generationLog);
  const catalog = useCatalog();
  const secrets = useMemo(() => loadSecrets(), [settings.enabled, settings.provider]);
  return {
    settings,
    secrets,
    logCountToday: generationsToday(log),
    sessionGenerations,
    existingLessons: catalog.lessons,
    conceptIds: catalog.concepts.map((c) => c.id),
  };
}
