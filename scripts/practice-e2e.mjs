#!/usr/bin/env node
/**
 * Full-stack E2E: DAU (idle-time-learning-doodad) launches Chudbox as a
 * practice lab through the dau-practice-labs contract.
 *
 *   DAU lesson page -> "Practice in Chudbox" -> popup loads ?practice=...
 *   -> take completed in Chudbox -> postMessage back -> DAU logs it.
 *
 * Prereq: chudbox dev server already running on :8080 (the registry default).
 * Usage: node --experimental-strip-types --import ./scripts/register-ts.mjs scripts/practice-e2e.mjs
 */
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const DAU_PORT = 8090;
const CHUDBOX_ORIGIN = "http://localhost:8080";
const LESSON_URL = `http://localhost:${DAU_PORT}/learn/dm-riff-cell-10`;

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

async function waitForServer(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  fail(`server not ready: ${url}`);
}

const vite = spawn("npm", ["run", "dev", "--", "--port", String(DAU_PORT), "--strictPort"], {
  cwd: new URL("..", import.meta.url).pathname,
  stdio: "ignore",
  detached: true,
});

try {
  await waitForServer(LESSON_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const dau = await context.newPage();
  const consoleErrors = [];
  dau.on("pageerror", (err) => consoleErrors.push(String(err?.message || err)));
  await dau.goto(LESSON_URL, { waitUntil: "domcontentloaded" });

  // 1. Lesson page shows the practice card for a compatible concept.
  const card = dau.getByText("Practice lab");
  await card.waitFor({ timeout: 30_000 });
  const launchButton = dau.getByRole("button", { name: "Practice in Chudbox ↗" });
  await launchButton.waitFor({ timeout: 10_000 });
  console.log("✔ DAU lesson page surfaces Chudbox as a practice lab");

  // 2. Click through: popup must be chudbox with the contract payload.
  const popupPromise = context.waitForEvent("page");
  await launchButton.click();
  const lab = await popupPromise;
  await lab.waitForLoadState("domcontentloaded");
  if (!lab.url().startsWith(CHUDBOX_ORIGIN)) fail(`popup went to ${lab.url()}`);
  const header = lab.getByText("Practice · dm-riff-cell · dm-riff-cell-10");
  await header.waitFor({ timeout: 20_000 });
  console.log(`✔ popup launched chudbox with contract payload: ${lab.url().slice(0, 58)}...`);

  // 3. Complete a take inside chudbox.
  await lab.getByText("Hits on this take: 0").waitFor({ timeout: 10_000 });
  await lab.getByRole("button", { name: "Locked" }).click();
  await lab.getByRole("button", { name: "Complete" }).click();
  await lab.getByText("Result for DAU").waitFor({ timeout: 10_000 });
  console.log("✔ take rated and completed inside chudbox");

  // 4. DAU receives, adapts, and logs the result.
  await dau
    .getByText(/Practice logged: dm-riff-cell-10/)
    .waitFor({ timeout: 15_000 });
  console.log("✔ DAU toasted the returned practice result");

  const logged = await dau.evaluate(() =>
    JSON.parse(window.localStorage.getItem("dau-practice-log-v1") ?? "[]"),
  );
  const entry = logged.find((e) => e.lessonId === "dm-riff-cell-10");
  if (!entry) fail(`no practice log entry persisted; got ${JSON.stringify(logged)}`);
  if (!entry.completed || entry.selfRating !== 3) fail(`unexpected entry: ${JSON.stringify(entry)}`);
  console.log("✔ persisted to dau-practice-log-v1:", JSON.stringify(entry));

  if (consoleErrors.length > 0) {
    console.warn("⚠ page errors observed:", consoleErrors);
  }
  await dau.screenshot({ path: "/tmp/opencode/dau-host-after.png" });
  await lab.screenshot({ path: "/tmp/opencode/chudbox-lab-after.png" });
  await browser.close();
  console.log("\n✅ FULL-STACK PRACTICE LOOP OK");
} finally {
  try {
    process.kill(-vite.pid);
  } catch {}
}
