#!/usr/bin/env node
/**
 * Full-stack E2E: DAU launches Fab Lab as a practice lab.
 *
 *   DAU lesson page -> "Practice in Fab Lab" -> popup ?practice=...
 *   -> deck answered -> Complete -> postMessage back -> DAU logs it.
 *
 * Usage: node --experimental-strip-types --import ./scripts/register-ts.mjs scripts/practice-e2e-fab.mjs
 */
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const DAU_PORT = 8090;
const FAB_PORT = 8092;
const FAB_ORIGIN = `http://localhost:${FAB_PORT}`;
const LESSON_URL = `http://localhost:${DAU_PORT}/learn/semi-rayleigh-10`;

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

const dau = spawn("npm", ["run", "dev", "--", "--port", String(DAU_PORT), "--strictPort"], {
  cwd: new URL("..", import.meta.url).pathname,
  stdio: "ignore",
  detached: true,
});
const fab = spawn("npm", ["run", "dev"], {
  cwd: new URL("../../fab-lab", import.meta.url).pathname,
  stdio: "ignore",
  detached: true,
});

try {
  await waitForServer(LESSON_URL);
  await waitForServer(`${FAB_ORIGIN}/`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const host = await context.newPage();
  await host.goto(LESSON_URL, { waitUntil: "domcontentloaded" });

  const card = host.getByText("Practice lab");
  await card.waitFor({ timeout: 30_000 });
  const launchButton = host.getByRole("button", { name: "Practice in Fab Lab ↗" });
  await launchButton.waitFor({ timeout: 10_000 });
  console.log("✔ DAU lesson page surfaces Fab Lab as the practice lab");

  const popupPromise = context.waitForEvent("page");
  await launchButton.click();
  const lab = await popupPromise;
  await lab.waitForLoadState("domcontentloaded");
  if (!lab.url().startsWith(FAB_ORIGIN)) fail(`popup went to ${lab.url()}`);
  await lab.getByText("Practice · semi-rayleigh · semi-rayleigh-10").waitFor({ timeout: 20_000 });
  console.log(`✔ popup launched fab-lab with contract payload`);

  for (let i = 0; i < 4; i += 1) {
    const options = lab.locator(".stack .btn");
    await options.first().waitFor({ timeout: 10_000 });
    await options.first().click();
    await lab.waitForTimeout(2400);
  }

  const complete = lab.getByRole("button", { name: "Complete" });
  if (!(await complete.isEnabled())) fail("Complete did not enable after the deck");
  await lab.getByRole("button", { name: "Locked" }).click();
  await complete.click();
  await lab.getByText("Result for DAU").waitFor({ timeout: 5_000 });
  console.log("✔ take completed inside fab-lab");

  await host.getByText(/Practice logged: semi-rayleigh-10/).waitFor({ timeout: 15_000 });
  console.log("✔ DAU toasted the returned practice result");

  const logged = await host.evaluate(() =>
    JSON.parse(window.localStorage.getItem("dau-practice-log-v1") ?? "[]"),
  );
  const entry = logged.find((e) => e.lessonId === "semi-rayleigh-10");
  if (!entry) fail(`no log entry persisted; got ${JSON.stringify(logged)}`);
  if (entry.labId !== "fab-lab") fail(`entry labId wrong: ${entry.labId}`);
  console.log("✔ persisted:", JSON.stringify(entry));

  await host.screenshot({ path: "/tmp/opencode/dau-fab-after.png" });
  await browser.close();
  console.log("\n✅ FULL-STACK DAU → FAB LAB OK");
} finally {
  try {
    process.kill(-dau.pid);
  } catch {}
  try {
    process.kill(-fab.pid);
  } catch {}
}
