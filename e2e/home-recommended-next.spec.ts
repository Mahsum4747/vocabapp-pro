import { test, expect } from "./support/app";
import { queueLibrary } from "./support/library";
import { homeSignals, practiceSet, homeSeed } from "./support/recommendations";
import { buildAdaptiveStudyPlan } from "../src/lib/adaptive-recommendations";
import {
  recommendationCta,
  recommendationReason,
  recommendationTitle,
} from "../src/lib/primary-recommendation";
import { mkdirSync } from "node:fs";
const dir = "screenshots/home-recommended-next";
const cardTestId = "recommended-next";
const kinds = [
  "overdue",
  "due",
  "weak",
  "articles",
  "cases",
  "satzbau",
  "conjugation",
  "plural",
  "reading",
  "chooser",
  "write",
  "new",
];
for (const kind of kinds)
  test(`primary ${kind}: actual engine, honest CTA, destination`, async ({
    page,
    launch,
    isMobile,
  }, info) => {
    const s = homeSignals(kind),
      r = buildAdaptiveStudyPlan(s).primary!;
    const seed = homeSeed(kind);
    const h = await launch({ ...seed, handlers: { getLearningSignals: () => s } });
    await page.goto("/?view=mine");
    const panel = page.getByTestId(cardTestId);
    await expect(panel.getByRole("heading")).toHaveText(recommendationTitle(r));
    await expect(panel.getByText(recommendationReason(r), { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nouns", exact: true })).toBeVisible();
    await expect(panel).toHaveCount(1);
    const link = panel.getByRole("link", { name: recommendationCta(r), exact: true });
    await expect(link).toHaveAttribute("href", r.route);
    expect(await panel.locator("a a,a button,button a").count()).toBe(0);
    expect(await panel.locator("a,button").count()).toBe(1);
    expect(h.serverFns.callsTo("getLearningSignals")).toHaveLength(1);
    await panel.scrollIntoViewIfNeeded();
    const rect = await panel.boundingBox(),
      vp = page.viewportSize()!;
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(vp.width + 1);
    const size = await link.boundingBox();
    expect(size!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    mkdirSync(dir, { recursive: true });
    if (["overdue", "cases", "reading", "write"].includes(kind)) {
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `${dir}/final-${info.project.name}-${kind}.png`,
        fullPage: false,
      });
    }
    if (isMobile) await link.tap();
    else {
      await link.focus();
      await expect(link).toBeFocused();
      await page.keyboard.press("Enter");
    }
    await expect(page).toHaveURL(new RegExp(r.route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
  });
test("empty plan adds no surface and keeps Home intact", async ({ page, launch }, info) => {
  const h = await launch(homeSeed("empty"));
  await page.goto("/?view=mine");
  await expect(page.getByRole("heading", { name: "Nouns", exact: true })).toBeVisible();
  await expect.poll(() => h.serverFns.callsTo("getLearningSignals").length).toBe(1);
  await expect(page.getByTestId(cardTestId)).toHaveCount(0);
  await expect(page.getByRole("status", { name: "Loading recommendation" })).toHaveCount(0);
  await page.screenshot({ path: `${dir}/final-${info.project.name}-empty.png`, fullPage: false });
});
test("loading is independent, settles and does not duplicate reads", async ({
  page,
  launch,
}, info) => {
  let release!: (s: ReturnType<typeof homeSignals>) => void;
  const wait = new Promise<ReturnType<typeof homeSignals>>((resolve) => (release = resolve));
  const h = await launch({ ...queueLibrary(), handlers: { getLearningSignals: () => wait } });
  await page.goto("/?view=mine");
  await expect(page.getByRole("status", { name: "Loading recommendation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nouns", exact: true })).toBeVisible();
  await page.screenshot({ path: `${dir}/final-${info.project.name}-loading.png` });
  const before = await page.getByRole("link", { name: /Grammar practice Articles/ }).boundingBox();
  release(homeSignals("overdue"));
  await expect(page.getByTestId(cardTestId)).toBeVisible();
  expect(h.serverFns.callsTo("getLearningSignals")).toHaveLength(1);
  const after = await page.getByRole("link", { name: /Grammar practice Articles/ }).boundingBox();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(90);
});
test("error is quiet, retry succeeds, Home stays usable", async ({ page, launch }, info) => {
  let fail = true;
  const h = await launch({
    ...queueLibrary(),
    handlers: {
      getLearningSignals: () => {
        if (fail) throw new Error("PRIVATE fixture payload must never be visible");
        return homeSignals("overdue");
      },
    },
  });
  await page.goto("/?view=mine");
  const retry = page.getByRole("button", { name: "Try again", exact: true });
  await expect(retry).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nouns", exact: true })).toBeVisible();
  await expect(page.getByText("PRIVATE fixture payload")).toHaveCount(0);
  await page.screenshot({ path: `${dir}/final-${info.project.name}-error.png`, fullPage: false });
  fail = false;
  await retry.click();
  await expect(page.getByTestId(cardTestId)).toBeVisible();
  expect(h.serverFns.callsTo("getLearningSignals")).toHaveLength(2);
});
test("deleted set target is hidden without a new read", async ({ page, launch }) => {
  const h = await launch({
    ...queueLibrary(),
    handlers: { getLearningSignals: () => homeSignals("cases") },
  });
  await page.goto("/?view=mine");
  await expect(page.getByRole("heading", { name: "Nouns", exact: true })).toBeVisible();
  await expect.poll(() => h.serverFns.callsTo("getLearningSignals").length).toBe(1);
  await expect(page.getByTestId(cardTestId)).toHaveCount(0);
});
test("long translated copy wraps at320px and 200% desktop zoom equivalent", async ({
  page,
  launch,
}, info) => {
  const seed = queueLibrary();
  seed.sets.push(practiceSet());
  await launch({ ...seed, handlers: { getLearningSignals: () => homeSignals("cases") } });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/?view=mine");
  const panel = page.getByTestId(cardTestId);
  await expect(panel).toBeVisible();
  await panel
    .getByRole("heading")
    .evaluate(
      (el) =>
        (el.textContent = "Practice German sentence structure and Nebensatzwortstellungsregeln"),
    );
  await panel
    .locator("p")
    .last()
    .evaluate(
      (el) =>
        (el.textContent =
          "Repeated case and verb-position errors appeared in your recent writing practice. Open your German practice set to revisit these patterns at your own pace. Diese Empfehlung hilft dir, die Satzstellung und schwierige grammatische Zusammenhänge Schritt für Schritt zu üben."),
    );
  await panel.evaluate((el) =>
    window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - 96)),
  );
  const actionBounds = await panel.getByRole("link").boundingBox();
  expect(actionBounds!.y + actionBounds!.height).toBeLessThan(page.viewportSize()!.height - 88);
  await page.screenshot({ path: `${dir}/final-${info.project.name}-long.png`, fullPage: false });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // A 1280px desktop at 200% browser zoom has a 640px CSS layout viewport.
  await page.setViewportSize({ width: 640, height: 900 });
  await panel.evaluate((el) =>
    window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - 96)),
  );
  await expect(panel.getByRole("link")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await panel.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${dir}/final-${info.project.name}-zoom.png` });
});
test("dark mode and reduced motion retain clear action", async ({ page, launch }, info) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  const seed = queueLibrary();
  seed.sets.push(practiceSet());
  await launch({ ...seed, handlers: { getLearningSignals: () => homeSignals("cases") } });
  await page.goto("/?view=mine");
  const panel = page.getByTestId(cardTestId);
  await expect(panel).toBeVisible();
  await panel.getByRole("link").focus();
  await expect(panel.getByRole("link")).toBeFocused();
  await panel.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${dir}/final-${info.project.name}-dark.png`, fullPage: false });
});
test("signed-out Home never requests private recommendations", async ({ page, launch }) => {
  const h = await launch(queueLibrary());
  await page.route("**/api/auth/get-session", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "null" }),
  );
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Public Sets", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "No public sets", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Account menu", exact: true })).toHaveCount(0);
  expect(h.serverFns.callsTo("getLearningSignals")).toHaveLength(0);
  await expect(page.getByTestId(cardTestId)).toHaveCount(0);
});
test("unmount discards late results; revisiting loads fresh once", async ({ page, launch }) => {
  let release!: (s: ReturnType<typeof homeSignals>) => void;
  const pending = new Promise<ReturnType<typeof homeSignals>>((r) => (release = r));
  let first = true;
  const h = await launch({
    ...queueLibrary(),
    handlers: {
      getLearningSignals: () => {
        if (first) {
          first = false;
          return pending;
        }
        return homeSignals("overdue");
      },
    },
  });
  await page.goto("/?view=mine");
  await expect(page.getByRole("status", { name: "Loading recommendation" })).toBeVisible();
  await page.getByRole("link", { name: /Grammar practice Articles/ }).click();
  await expect(page).toHaveURL(/\/grammar$/);
  release(homeSignals("cases"));
  await expect(page.getByTestId(cardTestId)).toHaveCount(0);
  await page.goto("/?view=mine");
  await expect(page.getByTestId(cardTestId).getByRole("heading")).toHaveText(
    "Review overdue words",
  );
  expect(h.serverFns.callsTo("getLearningSignals")).toHaveLength(2);
});
test("recommendation text and CTA contrast hold in light and dark", async ({ page, launch }) => {
  await launch({
    ...homeSeed("cases"),
    handlers: { getLearningSignals: () => homeSignals("cases") },
  });
  await page.goto("/?view=mine");
  const panel = page.getByTestId(cardTestId);
  await expect(panel).toBeVisible();
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    const ratios = await panel.evaluate((el) => {
      const rgb = (value: string) => (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      const lum = (value: string) =>
        rgb(value)
          .map((v) => {
            v /= 255;
            return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          })
          .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i]!, 0);
      const ratio = (fg: string, bg: string) => {
        const a = lum(fg),
          b = lum(bg);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      };
      const bg = getComputedStyle(el).backgroundColor;
      const text = Array.from(el.querySelectorAll("p,h2")).map((e) =>
        ratio(getComputedStyle(e).color, bg),
      );
      const link = getComputedStyle(el.querySelector("a")!);
      return [...text, ratio(link.color, link.backgroundColor)];
    });
    for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
});
