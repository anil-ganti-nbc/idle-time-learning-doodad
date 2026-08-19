import { loadModuleLessons } from "./load";
import elem from "./elem.json" with { type: "json" };

export const MUS_FOUNDATIONS_LESSONS = [...loadModuleLessons(elem)];
