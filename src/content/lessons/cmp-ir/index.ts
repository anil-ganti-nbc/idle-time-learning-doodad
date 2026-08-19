import { loadModuleLessons } from "./load";
import form from "./form.json" with { type: "json" };
import flow from "./flow.json" with { type: "json" };
import opt from "./opt.json" with { type: "json" };

export const CMP_IR_LESSONS = [
  ...loadModuleLessons(form),
  ...loadModuleLessons(flow),
  ...loadModuleLessons(opt),
];
