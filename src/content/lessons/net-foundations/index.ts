import { loadModuleLessons } from "./load";
import pack from "./pack.json" with { type: "json" };
import link from "./link.json" with { type: "json" };
import ip from "./ip.json" with { type: "json" };
import host from "./host.json" with { type: "json" };

export const NET_FOUNDATIONS_LESSONS = [
  ...loadModuleLessons(pack),
  ...loadModuleLessons(link),
  ...loadModuleLessons(ip),
  ...loadModuleLessons(host),
];
