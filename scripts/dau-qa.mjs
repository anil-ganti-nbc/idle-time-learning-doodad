import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://127.0.0.1:8080";
const dir = "/workspace/screenshots";
await mkdir(dir, { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });

async function shot(page, name) {
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
}

const errors = [];
function attach(page, label) {
  page.on("pageerror", (e) => errors.push(`${label} pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${label} console: ${m.text()}`);
  });
}

const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
attach(desktop, "desktop");
await desktop.goto(base, { waitUntil: "networkidle" });
await desktop.waitForTimeout(400);
await desktop.getByRole("heading", { name: /time to kill/i }).waitFor({ timeout: 8000 });
await shot(desktop, "home-desktop");

const desktopNav = await desktop.locator("header nav").count();
const headerH = await desktop.locator("header").evaluate((el) => el.getBoundingClientRect().height);

await desktop.getByRole("link", { name: /i have time to kill/i }).click();
await desktop.waitForTimeout(300);
await desktop.getByRole("heading", { name: /how long is the gap/i }).waitFor();
await shot(desktop, "session");

await desktop.getByRole("button", { name: "5 min" }).click();
await desktop.getByRole("button", { name: "Start learning" }).click();
await desktop.waitForTimeout(400);
await desktop.locator("article h1, h1").first().waitFor();
await shot(desktop, "lesson");

await desktop.getByRole("button", { name: /three questions/i }).click();
await desktop.waitForTimeout(300);
await desktop.getByText("1 / 3").waitFor();
await shot(desktop, "quiz");

for (let i = 0; i < 3; i++) {
  const options = desktop.locator("ul li button");
  await options.first().click();
  await desktop.getByRole("button", { name: i < 2 ? "Next" : "Rate understanding" }).click();
  await desktop.waitForTimeout(200);
}

await desktop.getByRole("heading", { name: /how well did that sit/i }).waitFor();
await shot(desktop, "rate");
await desktop.getByRole("button", { name: /got it/i }).click();
await desktop.getByRole("heading", { name: /gap converted/i }).waitFor();
await shot(desktop, "done");

await desktop.goto(`${base}/graph`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(300);
await shot(desktop, "graph");

await desktop.goto(`${base}/library`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(300);
await shot(desktop, "library");

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
attach(mobile, "mobile");
await mobile.goto(base, { waitUntil: "networkidle" });
await mobile.waitForTimeout(400);
const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
await shot(mobile, "home-mobile");
await mobile.getByRole("link", { name: /i have time to kill/i }).click();
await mobile.waitForTimeout(300);
await shot(mobile, "session-mobile");

console.log(JSON.stringify({ desktopNav, headerH, overflow, errors }, null, 2));
await browser.close();
if (errors.length) process.exit(1);
