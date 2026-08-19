import { loadModuleLessons } from "./load";
import move from "./move.json" with { type: "json" };

export const HORO_FOUNDATIONS_LESSONS = [...loadModuleLessons(move)];
