import { existsSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  let next = specifier;
  if (specifier.startsWith("@/")) {
    next = pathToFileURL(join(process.cwd(), "src", specifier.slice(2))).href;
  }

  try {
    return await nextResolve(next, context);
  } catch (err) {
    const candidates = [];
    if (!extname(next) || next.endsWith("/")) {
      const base = next.startsWith("file:") ? fileURLToPath(next) : resolveRelative(next, context.parentURL);
      if (base) {
        candidates.push(`${base}.ts`, join(base, "index.ts"));
      }
    }
    for (const file of candidates) {
      if (existsSync(file)) {
        return nextResolve(pathToFileURL(file).href, context);
      }
    }
    throw err;
  }
}

function resolveRelative(spec, parentURL) {
  if (!parentURL) return null;
  if (!(spec.startsWith("./") || spec.startsWith("../"))) return null;
  return join(dirname(fileURLToPath(parentURL)), spec);
}
