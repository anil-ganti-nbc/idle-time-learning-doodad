import { loadModuleLessons } from "./load";
import lineage from "./lineage.json" with { type: "json" };
import scenes from "./scenes.json" with { type: "json" };
import branches from "./branches.json" with { type: "json" };

export const DM_HISTORY_LESSONS = [
  ...loadModuleLessons(lineage),
  ...loadModuleLessons(scenes),
  ...loadModuleLessons(branches),
];
