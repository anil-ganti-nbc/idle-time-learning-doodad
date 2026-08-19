import { loadModuleLessons } from "./load";
import rel from "./rel.json" with { type: "json" };
import cc from "./cc.json" with { type: "json" };
import mod from "./mod.json" with { type: "json" };

export const NET_TRANSPORT_LESSONS = [
  ...loadModuleLessons(rel),
  ...loadModuleLessons(cc),
  ...loadModuleLessons(mod),
];
