import type { Tier } from "@/lib/learning/types";

export function questionKindsForTier(tier: Tier): string[] {
  if (tier <= 1) {
    return ["identify", "distinguish", "explain a basic mechanism", "simple cause/effect"];
  }
  if (tier === 2) {
    return ["apply", "predict", "compare", "trace a mechanism"];
  }
  if (tier === 3) {
    return ["combine prior concepts", "reason about trade-offs", "diagnose an outcome", "select between plausible mechanisms"];
  }
  return [
    "multi-step reasoning",
    "edge cases",
    "architecture/design trade-offs",
    "distinguish closely related explanations",
    "apply multiple previously taught concepts",
  ];
}

export function quizGuidanceForTier(tier: Tier): string {
  const kinds = questionKindsForTier(tier).join("; ");
  if (tier <= 1) {
    return `Foundation/introductory items. Prefer: ${kinds}. Do not require untaught vocabulary. Do not ask trivia.`;
  }
  if (tier === 2) {
    return `Core items. Prefer: ${kinds}. May use prerequisite concepts that have already been established.`;
  }
  if (tier === 3) {
    return `Intermediate items. Prefer: ${kinds}. Combine earlier modules. Do not invent new machinery.`;
  }
  return `Advanced items. Prefer: ${kinds}. "Advanced" means tighter reasoning, not obscure trivia or gotchas.`;
}
