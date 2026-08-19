import { loadModuleLessons } from "./load";
import func from "./func.json" with { type: "json" };
import voice from "./voice.json" with { type: "json" };
import chrom from "./chrom.json" with { type: "json" };

export const MUS_HARMONY_LESSONS = [
  ...loadModuleLessons(func),
  ...loadModuleLessons(voice),
  ...loadModuleLessons(chrom),
];
