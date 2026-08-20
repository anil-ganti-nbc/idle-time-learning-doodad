import { loadModuleLessons } from "./load";
import attn from "./attn.json" with { type: "json" };
import arch from "./arch.json" with { type: "json" };
import pre from "./pre.json" with { type: "json" };
import sys from "./sys.json" with { type: "json" };

export const ML_TRANSFORMERS_LESSONS = [
  ...loadModuleLessons(attn),
  ...loadModuleLessons(arch),
  ...loadModuleLessons(pre),
  ...loadModuleLessons(sys),
];
