#!/usr/bin/env node
/**
 * Cross-platform test runner. Collects the same suites the previous npm script
 * globbed, then hands them to Node's built-in test runner.
 */
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

function collect(dir, pred, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) collect(full, pred, acc);
    else if (pred(full)) acc.push(full);
  }
  return acc;
}

function under(relDir, suffix) {
  return collect(join(root, relDir), (file) => file.endsWith(suffix)).map((file) =>
    relative(root, file),
  );
}

const files = [
  ...under("src/lib/learning", ".test.ts"),
  ...under("src/lib/ai", ".test.ts"),
  ...under("src/lib/quiz", ".test.ts"),
  ...under("src/content", ".test.ts"),
  ...under("scripts", ".test.mjs"),
].sort();

if (files.length === 0) {
  console.error("No test files found.");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ["--experimental-strip-types", "--import", "./scripts/register-ts.mjs", "--test", ...files],
  { cwd: root, stdio: "inherit", env: process.env },
);

process.exit(result.status ?? 1);
