import { loadModuleLessons } from "./load";
import riff from "./riff.json" with { type: "json" };
import rhythm from "./rhythm.json" with { type: "json" };
import form from "./form.json" with { type: "json" };

export const DM_CONSTRUCTION_LESSONS = [
  ...loadModuleLessons(riff),
  ...loadModuleLessons(rhythm),
  ...loadModuleLessons(form),
];
