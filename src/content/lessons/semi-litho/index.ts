import { loadModuleLessons } from "./load";
import basics from "./basics.json" with { type: "json" };
import limits from "./limits.json" with { type: "json" };
import duv from "./duv.json" with { type: "json" };
import euv from "./euv.json" with { type: "json" };

export const SEMI_LITHO_LESSONS = [
  ...loadModuleLessons(basics),
  ...loadModuleLessons(limits),
  ...loadModuleLessons(duv),
  ...loadModuleLessons(euv),
];
