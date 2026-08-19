import { loadModuleLessons } from "./load";
import problem from "./problem.json" with { type: "json" };

export const ML_FOUNDATIONS_LESSONS = [...loadModuleLessons(problem)];
