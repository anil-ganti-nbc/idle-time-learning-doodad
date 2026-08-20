import { loadModuleLessons } from "./load";
import isa from "./isa.json" with { type: "json" };
import mem from "./mem.json" with { type: "json" };
import perf from "./perf.json" with { type: "json" };
import pipe from "./pipe.json" with { type: "json" };

export const CPU_FOUNDATIONS_LESSONS = [
  ...loadModuleLessons(perf),
  ...loadModuleLessons(isa),
  ...loadModuleLessons(pipe),
  ...loadModuleLessons(mem),
];
