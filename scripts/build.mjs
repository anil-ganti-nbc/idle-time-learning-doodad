#!/usr/bin/env node
/**
 * Portable production build: Vite, then the same migrate step Vercel runs.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const viteJs = join(root, "node_modules", "vite", "bin", "vite.js");
const migrateJs = join(root, "scripts", "migrate.mjs");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status) process.exit(result.status);
}

run(process.execPath, [viteJs, "build"]);
run(process.execPath, [migrateJs]);
