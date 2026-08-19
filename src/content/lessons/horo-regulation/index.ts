import { loadModuleLessons } from "./load";
import escape from "./escape.json" with { type: "json" };
import organ from "./organ.json" with { type: "json" };
import time from "./time.json" with { type: "json" };

export const HORO_REGULATION_LESSONS = [
  ...loadModuleLessons(escape),
  ...loadModuleLessons(organ),
  ...loadModuleLessons(time),
];
