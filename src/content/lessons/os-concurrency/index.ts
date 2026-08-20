import { loadModuleLessons } from "./load";
import vm from "./vm.json" with { type: "json" };
import sched from "./sched.json" with { type: "json" };
import sync from "./sync.json" with { type: "json" };

export const OS_CONCURRENCY_LESSONS = [
  ...loadModuleLessons(vm),
  ...loadModuleLessons(sched),
  ...loadModuleLessons(sync),
];
