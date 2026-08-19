import { loadModuleLessons } from "./load";
import net from "./net.json" with { type: "json" };
import train from "./train.json" with { type: "json" };
import rep from "./rep.json" with { type: "json" };

export const ML_NEURAL_LESSONS = [
  ...loadModuleLessons(net),
  ...loadModuleLessons(train),
  ...loadModuleLessons(rep),
];
