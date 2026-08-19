import type { ConceptProgress, SessionRecord } from "./types";
import { isDue } from "./srs";

export interface HomeMetrics {
  monthMinutes: number;
  conceptsLearned: number;
  retention7: number | null;
  reviewsDue: number;
  totalSessions: number;
}

export function computeMetrics(
  sessions: SessionRecord[],
  concepts: Record<string, ConceptProgress>,
  now = new Date(),
): HomeMetrics {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const weekAgo = now.getTime() - 7 * 86_400_000;

  const monthMinutes = sessions
    .filter((s) => new Date(s.completedAt).getTime() >= monthStart)
    .reduce((sum, s) => sum + s.actualMinutes, 0);

  const conceptsLearned = Object.values(concepts).filter(
    (c) => c.understanding === "got_it" || c.understanding === "mostly",
  ).length;

  const recent = sessions.filter((s) => new Date(s.completedAt).getTime() >= weekAgo);
  const retained = recent.filter(
    (s) => s.understanding === "got_it" || s.quizCorrect >= 2,
  );
  const retention7 = recent.length === 0 ? null : Math.round((retained.length / recent.length) * 100);

  const reviewsDue = Object.values(concepts).filter((c) => isDue(c, now)).length;

  return {
    monthMinutes,
    conceptsLearned,
    retention7,
    reviewsDue,
    totalSessions: sessions.length,
  };
}

export function formatDuration(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
