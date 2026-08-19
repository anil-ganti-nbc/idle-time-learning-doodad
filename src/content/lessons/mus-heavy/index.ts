import { loadModuleLessons } from "./load";
import nonfunc from "./nonfunc.json" with { type: "json" };
import meter from "./meter.json" with { type: "json" };
import riff from "./riff.json" with { type: "json" };

export const MUS_HEAVY_LESSONS = [
  ...loadModuleLessons(nonfunc),
  ...loadModuleLessons(meter),
  ...loadModuleLessons(riff),
];
