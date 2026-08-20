import { loadModuleLessons } from "./load";
import pred from "./pred.json" with { type: "json" };
import ooo from "./ooo.json" with { type: "json" };
import memsys from "./memsys.json" with { type: "json" };
import mp from "./mp.json" with { type: "json" };

export const CPU_MICROARCH_LESSONS = [
  ...loadModuleLessons(pred),
  ...loadModuleLessons(ooo),
  ...loadModuleLessons(memsys),
  ...loadModuleLessons(mp),
];
