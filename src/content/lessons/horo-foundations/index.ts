import { loadModuleLessons } from "./load";
import move from "./move.json" with { type: "json" };
import train from "./train.json" with { type: "json" };
import set from "./set.json" with { type: "json" };

export const HORO_FOUNDATIONS_LESSONS = [
  ...loadModuleLessons(move),
  ...loadModuleLessons(train),
  ...loadModuleLessons(set),
];
