import { buildCatalog } from "./catalog";
import type { Category, Concept, Lesson, Provenance } from "./types";

const src: Provenance = { type: "seed", schemaVersion: 1, author: "test" };

const q = (id: string) =>
  ({
    id,
    prompt: `Q ${id}`,
    choices: ["a", "b", "c", "d"] as [string, string, string, string],
    answerIndex: 1 as const,
    explanation: "because",
  });

export function lesson(partial: Partial<Lesson> & Pick<Lesson, "id" | "conceptId" | "durationMin">): Lesson {
  return {
    schemaVersion: 1,
    title: partial.title ?? partial.id,
    effort: "normal",
    level: "core",
    prerequisites: [],
    source: src,
    explanation: ["body"],
    example: "example text for the unit",
    whyItMatters: "it matters because the test said so",
    quiz: [q("1"), q("2"), q("3")],
    ...partial,
  };
}

export function testCatalog() {
  const categories: Category[] = [
    { id: "cpu", name: "CPU", blurb: "chips" },
    { id: "os", name: "OS", blurb: "kernels" },
  ];
  const concepts: Concept[] = [
    { id: "cpu-pipeline", name: "Pipelines", category: "cpu", prerequisites: [], level: "intro", summary: "s" },
    {
      id: "cpu-hazards",
      name: "Hazards",
      category: "cpu",
      parentId: "cpu-pipeline",
      prerequisites: ["cpu-pipeline"],
      level: "core",
      summary: "s",
    },
    { id: "os-process", name: "Processes", category: "os", prerequisites: [], level: "intro", summary: "s" },
  ];
  const lessons: Lesson[] = [
    lesson({ id: "pipe-5", conceptId: "cpu-pipeline", durationMin: 5, level: "intro", title: "Factory line" }),
    lesson({ id: "pipe-10", conceptId: "cpu-pipeline", durationMin: 10, level: "intro", title: "Factory line 10" }),
    lesson({
      id: "haz-10",
      conceptId: "cpu-hazards",
      durationMin: 10,
      prerequisites: ["cpu-pipeline"],
      title: "Three stalls",
    }),
    lesson({ id: "os-5", conceptId: "os-process", durationMin: 5, level: "intro", title: "Processes" }),
  ];
  return buildCatalog(categories, concepts, lessons);
}
