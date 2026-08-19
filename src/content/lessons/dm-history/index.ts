import { loadModuleLessons } from "./load";
import lineage from "./lineage.json" with { type: "json" };

export const DM_HISTORY_LESSONS = [...loadModuleLessons(lineage)];
