#!/usr/bin/env node
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const DAU_PORT = 8090;
const PL_PORT = 8095;
const PL_ORIGIN = `http://localhost:${PL_PORT}`;
const LESSON_URL = `http://localhost:${DAU_PORT}/learn/net-handshake-10`;

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
const pl = spawn("npm", ["run", "dev"], {
  cwd: new URL("../../packet-lab", import.meta.url).pathname, stdio: "ignore", detached: true,
});

try {
  await waitForServer(LESSON_URL);
  await waitForServer(`${PL_ORIGIN}/`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const host = await context.newPage();
  await host.goto(LESSON_URL, { waitUntil: "domcontentloaded" });

  const launchButton = host.getByRole("button", { name: "Practice in Packet Lab ↗" });
  await launchButton.waitFor({ timeout: 30_000 });
  console.log("✔ DAU lesson page surfaces Packet Lab");

  const popupPromise = context.waitForEvent("page");
  await launchButton.click();
  const lab = await popupPromise;
  await lab.waitForLoadState("domcontentloaded");
  if (!lab.url().startsWith(PL_ORIGIN)) fail(`popup went to ${lab.url()}`);
  await lab.getByText("Practice · net-handshake · net-handshake-10").waitFor({ timeout: 20_000 });
  console.log("✔ popup launched packet-lab with contract payload");

  for (let i = 0; i < 3; i += 1) {
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
  console.log("✔ take completed inside packet-lab");

  await host.getByText(/Practice logged: net-handshake-10/).waitFor({ timeout: 15_000 });
  console.log("✔ DAU toasted the returned practice result");

  const logged = await host.evaluate(() =>
    JSON.parse(window.localStorage.getItem("dau-practice-log-v1") ?? "[]"),
  );
  const entry = logged.find((e) => e.lessonId === "net-handshake-10");
  if (!entry || entry.labId !== "packet-lab") fail(`bad log entry: ${JSON.stringify(logged)}`);
  console.log("✔ persisted:", JSON.stringify(entry));

  await browser.close();
  console.log("\n✅ FULL-STACK DAU → PACKET LAB OK");
} finally {
  try { process.kill(-dau.pid); } catch {}
  try { process.kill(-pl.pid); } catch {}
}
