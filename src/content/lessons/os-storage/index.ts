import { loadModuleLessons } from "./load";
import fs from "./fs.json" with { type: "json" };
import io from "./io.json" with { type: "json" };
import isol from "./isol.json" with { type: "json" };

export const OS_STORAGE_LESSONS = [
  ...loadModuleLessons(fs),
  ...loadModuleLessons(io),
  ...loadModuleLessons(isol),
];
