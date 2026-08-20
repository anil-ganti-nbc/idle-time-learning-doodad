import { loadModuleLessons } from "./load";
import wafer from "./wafer.json" with { type: "json" };
import front from "./front.json" with { type: "json" };
import shape from "./shape.json" with { type: "json" };
import integrate from "./integrate.json" with { type: "json" };

export const SEMI_PROCESS_LESSONS = [
  ...loadModuleLessons(wafer),
  ...loadModuleLessons(front),
  ...loadModuleLessons(shape),
  ...loadModuleLessons(integrate),
];
