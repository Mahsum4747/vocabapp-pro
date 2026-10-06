import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect, test } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";
import { germanA1 } from "../src/content/curriculum/german-a1";
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/postlaunch-ux", { recursive: true });
  await page.screenshot({ path: `screenshots/postlaunch-ux/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
test("typed equivalents, keyboard helper, retry hint reveal and corrected adjective", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(90_000);
  if (info.project.name === "mobile") await page.setViewportSize({ width: 390, height: 844 });
  const f = courseProgressFixture();
  const lesson = germanA1.lessons[7];
  await f.advanceLesson(
    7,
    lesson.steps.findIndex((s) => s.id.endsWith(".recall")),
  );
  const h = await launch({ sets: [], handlers: f.handlers });
  await page.goto(`/learn/${lesson.id}`);
  const input = page.getByLabel("Reading verb for du", { exact: true });
  await expect(input).toBeVisible();
  await shot(page, `typed-${info.project.name}`);
  await input.fill("Du liest.");
  await input.press("Enter");
  await expect(page.getByRole("status")).toContainText("That fits");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const sleep = page.getByLabel("Sleeping verb for Nora", { exact: true });
  await sleep.fill("schlft");
  await sleep.evaluate((el: HTMLInputElement) => el.setSelectionRange(4, 4));
  await page.getByRole("button", { name: "Insert ä", exact: true }).click();
  await expect(sleep).toHaveValue("schläft");
  await expect(sleep).toBeFocused();
  await shot(page, `characters-${info.project.name}`);
  const targets = await page
    .getByRole("group", { name: "German characters" })
    .getByRole("button")
    .evaluateAll((buttons) =>
      buttons.every((b) => {
        const r = b.getBoundingClientRect();
        return r.width >= 44 && r.height >= 44;
      }),
    );
  expect(targets).toBe(true);
  // Keyboard activation inserts at the saved cursor as well.
  await sleep.fill("x");
  await sleep.evaluate((el: HTMLInputElement) => el.setSelectionRange(0, 1));
  await page.getByRole("button", { name: "Insert ü", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(sleep).toHaveValue("ü");
  await expect(sleep).toBeFocused();
  for (let i = 1; i <= 3; i++) {
    await sleep.fill(`wrong${i}`);
    await sleep.press("Enter");
    await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
    await expect(page.getByRole("status")).toContainText("Try again");
    if (i === 1) {
      await expect(page.getByRole("button", { name: "Hint", exact: true })).toHaveCount(0);
      await shot(page, `wrong-${info.project.name}`);
      await page.getByRole("button", { name: "Retry", exact: true }).click();
      await expect(sleep).toBeFocused();
    }
    if (i === 2) {
      await page.getByRole("button", { name: "Hint", exact: true }).click();
      await expect(page.getByRole("note")).toContainText("begins");
      await shot(page, `hint-${info.project.name}`);
    }
  }
  const before = h.serverFns.callsTo("acknowledgeCourseProgress").length;
  await page.getByRole("button", { name: "Show answer", exact: true }).click();
  await expect(page.getByText("Answer: schläft", { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("not a correct answer");
  expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(before);
  await shot(page, `shown-${info.project.name}`);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("Joined statements", { exact: true })
    .fill("Nora liest und wir lernen Deutsch.");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const adjective = page.getByLabel("Adjective", { exact: true });
  await adjective.fill("gross");
  await adjective.press("Enter");
  await expect(page.getByRole("status")).toContainText("That fits");
  await shot(page, `adjective-${info.project.name}`);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim(),
      ),
    )
    .toBe("#1c1b19");
  await page.setViewportSize({ width: 320, height: 844 });
  await shot(page, `dark-320-${info.project.name}`);
  await page.reload();
  await expect(page.getByLabel("Adjective", { exact: true })).toHaveValue("gross");
});
test("Home course start and continuation visible with one course read per Home mount", async ({
  page,
  launch,
}, info) => {
  if (info.project.name === "mobile") await page.setViewportSize({ width: 390, height: 844 });
  const f = courseProgressFixture();
  const h = await launch({ sets: [], handlers: f.handlers });
  await page.goto("/");
  const card = page.getByRole("link", { name: "German A1 course", exact: true });
  await expect(card).toContainText("Start your first lesson");
  expect(h.serverFns.callsTo("getCourseProgress")).toHaveLength(1);
  await shot(page, `home-start-${info.project.name}`);
  await f.advanceLesson(0, 3);
  await page.reload();
  await expect(card).toContainText("Continue learning");
  await expect(card).toContainText("Unit 1 · Lesson 1");
  await shot(page, `home-continue-${info.project.name}`);
  await card.click();
  await expect(page.getByLabel("Missing German word", { exact: true })).toBeVisible();
});

for (const unit of [1, 2])
  test(`Unit ${unit} assessment has no teaching hints, reveal or character helper`, async ({
    page,
    launch,
  }) => {
    const { assessmentFixture } = await import("./support/assessment");
    const f = await assessmentFixture(true, unit);
    await launch({ sets: [], handlers: f.handlers });
    await page.goto(`/learn/units/DE.A1.U0${unit}`);
    await page.getByRole("link", { name: `Unit ${unit} Check`, exact: true }).click();
    await page.getByRole("button", { name: `Start Unit ${unit} Check`, exact: true }).click();
    await expect(page.getByRole("button", { name: "Hint", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Show answer", exact: true })).toHaveCount(0);
    await expect(page.getByRole("group", { name: "German characters", exact: true })).toHaveCount(
      0,
    );
    await expect(page.getByRole("button", { name: "Next item", exact: true })).toBeDisabled();
  });
