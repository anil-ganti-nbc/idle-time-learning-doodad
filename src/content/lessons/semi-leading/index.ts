import { loadModuleLessons } from "./load";
import highna from "./highna.json" with { type: "json" };
import limit from "./limit.json" with { type: "json" };
import device from "./device.json" with { type: "json" };
import pack from "./pack.json" with { type: "json" };

export const SEMI_LEADING_LESSONS = [
  ...loadModuleLessons(highna),
  ...loadModuleLessons(limit),
  ...loadModuleLessons(device),
  ...loadModuleLessons(pack),
];
