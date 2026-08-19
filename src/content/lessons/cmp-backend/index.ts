import { loadModuleLessons } from "./load";
import sel from "./sel.json" with { type: "json" };
import abi from "./abi.json" with { type: "json" };
import rt from "./rt.json" with { type: "json" };

export const CMP_BACKEND_LESSONS = [
  ...loadModuleLessons(sel),
  ...loadModuleLessons(abi),
  ...loadModuleLessons(rt),
];
