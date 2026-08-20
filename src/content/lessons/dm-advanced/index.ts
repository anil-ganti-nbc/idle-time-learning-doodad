import { loadModuleLessons } from "./load";
import tech from "./tech.json" with { type: "json" };
import prog from "./prog.json" with { type: "json" };
import style from "./style.json" with { type: "json" };

export const DM_ADVANCED_LESSONS = [
  ...loadModuleLessons(tech),
  ...loadModuleLessons(prog),
  ...loadModuleLessons(style),
];
