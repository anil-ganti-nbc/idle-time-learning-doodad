export type JsonFail = { ok: false; error: string };
export type JsonOk = { ok: true; value: unknown };

export function extractJson(text: string): JsonOk | JsonFail {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return { ok: false, error: "Model did not return a JSON object." };
  }
  try {
    return { ok: true, value: JSON.parse(candidate.slice(start, end + 1)) };
  } catch {
    return { ok: false, error: "Model returned invalid JSON." };
  }
}
