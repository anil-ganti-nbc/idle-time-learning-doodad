import { RETIRED_SEEDED_CATEGORY_IDS } from "@/lib/learning/types";
import type { Category, CategoryId } from "@/lib/learning/types";

const RETIRED = new Set<string>(RETIRED_SEEDED_CATEGORY_IDS);

export const CATEGORIES: Category[] = [
  { id: "cpu", name: "CPU / GPU architecture", blurb: "Pipelines, prediction, caches, and out-of-order guts." },
  { id: "semiconductors", name: "Semiconductor manufacturing", blurb: "How chips are printed, aligned, and yielded." },
  { id: "os", name: "Operating systems", blurb: "Processes, memory, and the scheduler that lies to you." },
  { id: "networking", name: "Networking", blurb: "Packets, congestion, and how the internet actually routes." },
  { id: "compilers", name: "Compilers", blurb: "From source text to registers, via IR." },
  { id: "ml", name: "Machine learning", blurb: "Gradients, attention, and what the math is actually doing." },
  { id: "astronomy", name: "Astronomy", blurb: "Stars, distances, and how we know what we claim." },
  { id: "evo-bio", name: "Evolutionary biology", blurb: "Selection, development, and what evolution is not." },
  { id: "economics", name: "Economics", blurb: "Trade-offs, money, and models that break in public." },
  { id: "statistics", name: "Statistics", blurb: "Uncertainty, bias, and the difference between signal and luck." },
  { id: "horology", name: "Horology", blurb: "Escapements, regulation, and why a watch keeps time." },
  { id: "audio", name: "Audio engineering", blurb: "Frequency, dynamics, and the physics of a mix." },
  { id: "music-theory", name: "Music theory", blurb: "Intervals, modes, and why some clashes work." },
  { id: "death-metal", name: "Death metal", blurb: "History, technique, and how the music is built." },
  { id: "history", name: "General history", blurb: "Events as mechanisms, not trivia." },
].map((c) => ({ ...c, status: RETIRED.has(c.id) ? ("retired" as const) : ("active" as const) }));

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export const ACTIVE_CATEGORIES = CATEGORIES.filter((c) => c.status !== "retired");
