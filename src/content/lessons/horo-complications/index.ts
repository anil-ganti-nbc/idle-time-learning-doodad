import { loadModuleLessons } from "./load";
import time from "./time.json" with { type: "json" };
import chrono from "./chrono.json" with { type: "json" };
import show from "./show.json" with { type: "json" };

export const HORO_COMPLICATIONS_LESSONS = [
  ...loadModuleLessons(time),
  ...loadModuleLessons(chrono),
  ...loadModuleLessons(show),
];
