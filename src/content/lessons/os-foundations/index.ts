import { loadModuleLessons } from "./load";
import kernel from "./kernel.json" with { type: "json" };
import proc from "./proc.json" with { type: "json" };
import switchMod from "./switch.json" with { type: "json" };

export const OS_FOUNDATIONS_LESSONS = [
  ...loadModuleLessons(kernel),
  ...loadModuleLessons(proc),
  ...loadModuleLessons(switchMod),
];
