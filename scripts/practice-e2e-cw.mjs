#!/usr/bin/env node
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const DAU_PORT = 8090;
const CW_PORT = 8094;
const CW_ORIGIN = `http://localhost:${CW_PORT}`;
const LESSON_URL = `http://localhost:${DAU_PORT}/learn/cmp-const-fold-10`;

function fail(m) { console.error(`✖ ${m}`); process.exit(1); }
async function waitForServer(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try { const r = await fetch(url); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  fail(`server not ready: ${url}`);
}

const dau = spawn("npm", ["run", "dev", "--", "--port", String(DAU_PORT), "--strictPort"], {
  cwd: new URL("..", import.meta.url).pathname, stdio: "ignore", detached: true,
});
const cw = spawn("npm", ["run", "dev"], {
  cwd: new URL("../../compiler-workbench", import.meta.url).pathname, stdio: "ignore", detached: true,
});

try {
  await waitForServer(LESSON_URL);
  await waitForServer(`${CW_ORIGIN}/`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const host = await context.newPage();
  await host.goto(LESSON_URL, { waitUntil: "domcontentloaded" });

  const launchButton = host.getByRole("button", { name: "Practice in Compiler Workbench ↗" });
  await launchButton.waitFor({ timeout: 30_000 });
  console.log("✔ DAU lesson page surfaces Compiler Workbench");

  const popupPromise = context.waitForEvent("page");
  await launchButton.click();
  const lab = await popupPromise;
  await lab.waitForLoadState("domcontentloaded");
  if (!lab.url().startsWith(CW_ORIGIN)) fail(`popup went to ${lab.url()}`);
  await lab.getByText("Practice · cmp-const-fold · cmp-const-fold-10").waitFor({ timeout: 20_000 });
  console.log("✔ popup launched compiler-workbench with contract payload");

  for (let i = 0; i < 4; i += 1) {
    const options = lab.locator(".stack .btn");
    await options.first().waitFor({ timeout: 10_000 });
    await options.first().click();
    await lab.waitForTimeout(2200);
  }
  const complete = lab.getByRole("button", { name: "Complete" });
  if (!(await complete.isEnabled())) fail("Complete did not enable");
  await lab.getByRole("button", { name: "Locked" }).click();
  await complete.click();
  await lab.getByText("Result for DAU").waitFor({ timeout: 5_000 });
  console.log("✔ take completed inside compiler-workbench");

  await host.getByText(/Practice logged: cmp-const-fold-10/).waitFor({ timeout: 15_000 });
  console.log("✔ DAU toasted the returned practice result");

  const logged = await host.evaluate(() =>
    JSON.parse(window.localStorage.getItem("dau-practice-log-v1") ?? "[]"),
  );
  const entry = logged.find((e) => e.lessonId === "cmp-const-fold-10");
  if (!entry || entry.labId !== "compiler-workbench") fail(`bad log entry: ${JSON.stringify(logged)}`);
  console.log("✔ persisted:", JSON.stringify(entry));

  await browser.close();
  console.log("\n✅ FULL-STACK DAU → COMPILER WORKBENCH OK");
} finally {
  try { process.kill(-dau.pid); } catch {}
  try { process.kill(-cw.pid); } catch {}
}
