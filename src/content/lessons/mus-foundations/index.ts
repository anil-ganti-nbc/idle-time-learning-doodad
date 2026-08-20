import { loadModuleLessons } from "./load";
import elem from "./elem.json" with { type: "json" };
import pitch from "./pitch.json" with { type: "json" };
import rhythm from "./rhythm.json" with { type: "json" };

export const MUS_FOUNDATIONS_LESSONS = [
  ...loadModuleLessons(elem),
  ...loadModuleLessons(pitch),
  ...loadModuleLessons(rhythm),
];
