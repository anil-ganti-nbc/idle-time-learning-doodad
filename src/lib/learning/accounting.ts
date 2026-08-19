export function isBillableAttempt(entry: {
  ok: boolean;
  cached?: boolean;
  billable?: boolean;
}): boolean {
  if (entry.cached) return false;
  if (typeof entry.billable === "boolean") return entry.billable;
  return entry.ok;
}

export function generationsToday(
  log: { at: string; ok: boolean; cached?: boolean; billable?: boolean }[],
  now = new Date(),
): number {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return log.filter((e) => isBillableAttempt(e) && new Date(e.at).getTime() >= start.getTime()).length;
}
