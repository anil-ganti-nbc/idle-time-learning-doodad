import { loadModuleLessons } from "./load";
import problem from "./problem.json" with { type: "json" };
import linear from "./linear.json" with { type: "json" };
import gen from "./gen.json" with { type: "json" };
import opt from "./opt.json" with { type: "json" };

export const ML_FOUNDATIONS_LESSONS = [
  ...loadModuleLessons(problem),
  ...loadModuleLessons(linear),
  ...loadModuleLessons(gen),
  ...loadModuleLessons(opt),
];
