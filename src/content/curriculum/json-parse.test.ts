import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const workspace = join(fileURLToPath(new URL(".", import.meta.url)), "../../..");

function collectJson(dir: string, acc: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) collectJson(full, acc);
    else if (name.endsWith(".json")) acc.push(full);
  }
  return acc;
}

describe("curriculum JSON", () => {
  it("parses every on-disk curriculum and lesson JSON strictly", () => {
    const files = [
      ...collectJson(join(workspace, "src/content/curriculum/data")),
      ...collectJson(join(workspace, "src/content/lessons")),
    ].sort();
    assert.ok(files.length >= 100, `expected a full curriculum tree, found ${files.length}`);
    const issues: string[] = [];
    for (const file of files) {
      const rel = relative(workspace, file);
      try {
        JSON.parse(readFileSync(file, "utf8"));
      } catch (err) {
        issues.push(`${rel}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    assert.deepEqual(issues, []);
  });
});
