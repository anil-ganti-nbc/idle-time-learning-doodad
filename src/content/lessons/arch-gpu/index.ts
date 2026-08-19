import { loadModuleLessons } from "./load";
import simt from "./simt.json" with { type: "json" };
import resources from "./resources.json" with { type: "json" };
import schedule from "./schedule.json" with { type: "json" };
import systems from "./systems.json" with { type: "json" };

export const ARCH_GPU_LESSONS = [
  ...loadModuleLessons(simt),
  ...loadModuleLessons(resources),
  ...loadModuleLessons(schedule),
  ...loadModuleLessons(systems),
];
