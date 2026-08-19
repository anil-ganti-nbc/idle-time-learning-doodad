import { loadModuleLessons } from "./load";
import lex from "./lex.json" with { type: "json" };
import parse from "./parse.json" with { type: "json" };
import sem from "./sem.json" with { type: "json" };

export const CMP_FRONTEND_LESSONS = [
  ...loadModuleLessons(lex),
  ...loadModuleLessons(parse),
  ...loadModuleLessons(sem),
];
