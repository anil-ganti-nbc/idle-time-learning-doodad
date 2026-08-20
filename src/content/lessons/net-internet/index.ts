import { loadModuleLessons } from "./load";
import fwd from "./fwd.json" with { type: "json" };
import igp from "./igp.json" with { type: "json" };
import bgp from "./bgp.json" with { type: "json" };
import sys from "./sys.json" with { type: "json" };

export const NET_INTERNET_LESSONS = [
  ...loadModuleLessons(fwd),
  ...loadModuleLessons(igp),
  ...loadModuleLessons(bgp),
  ...loadModuleLessons(sys),
];
