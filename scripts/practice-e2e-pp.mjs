#!/usr/bin/env node
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const DAU_PORT = 8090;
const PP_PORT = 8093;
const PP_ORIGIN = `http://localhost:${PP_PORT}`;
const LESSON_URL = `http://localhost:${DAU_PORT}/learn/cpu-pipeline-10`;

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
const pp = spawn("npm", ["run", "dev"], {
  cwd: new URL("../../pipeline-playground", import.meta.url).pathname, stdio: "ignore", detached: true,
});

try {
  await waitForServer(LESSON_URL);
  await waitForServer(`${PP_ORIGIN}/`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const host = await context.newPage();
  await host.goto(LESSON_URL, { waitUntil: "domcontentloaded" });

  const launchButton = host.getByRole("button", { name: "Practice in Pipeline Playground ↗" });
  await launchButton.waitFor({ timeout: 30_000 });
  console.log("✔ DAU lesson page surfaces Pipeline Playground");

  const popupPromise = context.waitForEvent("page");
  await launchButton.click();
  const lab = await popupPromise;
  await lab.waitForLoadState("domcontentloaded");
  if (!lab.url().startsWith(PP_ORIGIN)) fail(`popup went to ${lab.url()}`);
  await lab.getByText("Practice · cpu-pipeline · cpu-pipeline-10").waitFor({ timeout: 20_000 });
  console.log("✔ popup launched pipeline-playground with contract payload");

  const step = lab.getByRole("button", { name: "Step" });
  for (let i = 0; i < 30; i += 1) {
    if (!(await step.isEnabled())) break;
    await step.click();
    await lab.waitForTimeout(50);
  }
  const complete = lab.getByRole("button", { name: "Complete" });
  for (let i = 0; i < 20 && !(await complete.isEnabled()); i += 1) {
    if (await step.isEnabled()) { await step.click(); await lab.waitForTimeout(50); }
  }
  if (!(await complete.isEnabled())) fail("Complete never unlocked");
  await lab.getByRole("button", { name: "Locked" }).click();
  await complete.click();
  await lab.getByText("Result for DAU").waitFor({ timeout: 5_000 });
  console.log("✔ take completed inside pipeline-playground");

  await host.getByText(/Practice logged: cpu-pipeline-10/).waitFor({ timeout: 15_000 });
  console.log("✔ DAU toasted the returned practice result");

  const logged = await host.evaluate(() =>
    JSON.parse(window.localStorage.getItem("dau-practice-log-v1") ?? "[]"),
  );
  const entry = logged.find((e) => e.lessonId === "cpu-pipeline-10");
  if (!entry || entry.labId !== "pipeline-playground") fail(`bad log entry: ${JSON.stringify(logged)}`);
  console.log("✔ persisted:", JSON.stringify(entry));

  await browser.close();
  console.log("\n✅ FULL-STACK DAU → PIPELINE PLAYGROUND OK");
} finally {
  try { process.kill(-dau.pid); } catch {}
  try { process.kill(-pp.pid); } catch {}
}
