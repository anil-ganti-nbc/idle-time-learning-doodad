import type { CognitiveType, Tier } from "@/lib/learning/types";
import { plannedMix } from "./mix";

export function questionKindsForTier(tier: Tier): string[] {
  if (tier <= 1) return ["recognize", "distinguish", "identify", "basic mechanism", "direct cause/effect"];
  if (tier === 2) return ["apply", "predict", "compare", "trace a short process"];
  if (tier === 3) return ["integrate with a prerequisite", "reason about trade-offs", "diagnose a result"];
  if (tier === 4) {
    return ["multi-step reasoning", "architecture/design trade-offs", "interacting constraints", "realistic edge cases"];
  }
  return ["subtle interactions", "competing explanations", "non-obvious trade-offs", "synthesis across modules"];
}

export function quizGuidanceForTier(tier: Tier): string {
  const kinds = questionKindsForTier(tier).join("; ");
  const mix = plannedMix(tier).join(", ");
  if (tier <= 1) {
    return `Foundation/introductory items. Prefer: ${kinds}. Requested mix: ${mix}. Do not require untaught vocabulary. Do not ask trivia.`;
  }
  if (tier === 2) {
    return `Core items. Prefer: ${kinds}. Requested mix: ${mix}. May use prerequisite concepts that have already been established.`;
  }
  if (tier === 3) {
    return `Intermediate items. Prefer: ${kinds}. Requested mix: ${mix}. Combine earlier modules. Do not invent new machinery.`;
  }
  if (tier === 4) {
    return `Advanced items. Prefer: ${kinds}. Requested mix: ${mix}. "Advanced" means tighter reasoning, not obscure trivia.`;
  }
  return `Specialist items. Prefer: ${kinds}. Requested mix: ${mix}. Only previously demonstrated concepts. No hidden university-course assumptions.`;
}

export function defaultCognitiveForSlot(tier: Tier, index: number): CognitiveType {
  return plannedMix(tier)[Math.min(index, 2)];
}
