import { courseProgressFixture } from "./support/course-progress";
import { mkdirSync } from "node:fs";
import { expect, test } from "./support/app";
import { queueLibrary } from "./support/library";
import { undersizedTargets } from "./support/touch";
async function overflow(page: import("@playwright/test").Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
test("two lessons retain independent sessions, unit states and keyboard flow with isolated course writes", async ({
  page,
  launch,
  isMobile,
}, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const harness = await launch({ sets: [], handlers: courseProgressFixture().handlers });
  const writes: string[] = [];
  page.on("request", (r) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(r.method())) writes.push(r.url());
  });
  mkdirSync("screenshots", { recursive: true });
  await page.goto("/learn");
  await expect(page.getByText("2 lessons available · 2 not yet authored")).toBeVisible();
  await page.screenshot({
    path: `screenshots/phase1b-overview-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "Open Unit 1" }).click();
  await expect(page.locator("main ol > li")).toHaveCount(4);
  await page.screenshot({
    path: `screenshots/phase1b-unit-${info.project.name}.png`,
    fullPage: true,
  });
  await overflow(page);
  await page.getByRole("link", { name: /introduce yourself/i }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.screenshot({
    path: `screenshots/phase1b-l01-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "Unit 1", exact: true }).click();
  await page.getByRole("link", { name: /Name people and things/ }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Keep the article with the noun." }),
  ).toBeFocused();
  await page.screenshot({
    path: `screenshots/phase1b-l02-${info.project.name}.png`,
    fullPage: true,
  });
  await overflow(page);
  if (isMobile) expect(await undersizedTargets(page)).toEqual([]);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  for (const answer of ["das Telefon", "A place"]) {
    await page.getByRole("radio", { name: answer, exact: true }).check();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await page.getByLabel("German phrase for a woman").fill("eine frau");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Try again");
  await page.getByLabel("German phrase for a woman").fill("eine Frau");
  await page.getByRole("link", { name: "Unit 1", exact: true }).click();
  await expect(page.getByText("In progress", { exact: true })).toHaveCount(2);
  await page.getByRole("link", { name: /introduce yourself/i }).click();
  await expect(page.getByText("Lesson 1 · Step 2 of 7", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Unit 1", exact: true }).click();
  await page.getByRole("link", { name: /Name people and things/ }).click();
  await expect(page.getByLabel("German phrase for a woman")).toHaveValue("eine Frau");
  for (const [label, answer] of [
    ["German phrase for a woman", "eine Frau"],
    ["Name from the label", "Nora"],
    ["Your German noun phrase", "ein Büro"],
  ]) {
    await page.getByLabel(label).fill(answer);
    await expect(page.getByRole("button", { name: "Check", exact: true })).toBeEnabled();
    await page.getByLabel(label).press("Enter");
    await expect(page.getByRole("status")).toContainText("That fits");
    await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeEnabled();
    await page.getByRole("button", { name: "Continue", exact: true }).press("Enter");
  }
  await page.getByRole("radio", { name: "Die Frau", exact: true }).check();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await page.getByRole("button", { name: "Finish lesson", exact: true }).click();
  await expect(
    page.getByText("The next lesson is not yet authored. This unit is still in progress."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Practice lesson again" }).click();
  await page.getByRole("link", { name: "Unit 1", exact: true }).click();
  await page.getByRole("link", { name: /introduce yourself/i }).click();
  await expect(page.getByText("Lesson 1 · Step 2 of 7", { exact: true })).toBeVisible();
  expect(
    harness.serverFns.calls.every((call) =>
      ["getCourseProgress", "acknowledgeCourseProgress"].includes(call.name),
    ),
  ).toBe(true);
  expect(writes.every((url) => url.includes("/_serverFn/"))).toBe(true);
  await page.reload();
  await expect(page.getByText("Lesson 1 · Step 2 of 7", { exact: true })).toBeVisible();
});
test("dark 320px unit and lesson render without overflow", async ({ page, launch }, info) => {
  await launch({ sets: [], handlers: courseProgressFixture().handlers });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/learn/units/DE.A1.U01");
  await expect(page.getByRole("heading", { name: "Foundations and identity" })).toBeVisible();
  await page.screenshot({
    path: `screenshots/phase1b-dark-unit-${info.project.name}.png`,
    fullPage: true,
  });
  await overflow(page);
  await page.getByRole("link", { name: /Name people and things/ }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.screenshot({
    path: `screenshots/phase1b-dark-lesson-${info.project.name}.png`,
    fullPage: true,
  });
  await overflow(page);
});
test("legacy vocabulary Learn still renders its existing interactive flow", async ({
  page,
  launch,
}) => {
  const harness = await launch({
    ...queueLibrary(),
    handlers: { updateSetSession: () => ({ served: ["card-gehen"] }) },
  });
  await page.goto("/sets/set-verbs/learn");
  await expect(page.getByRole("heading", { name: "to go", exact: true })).toBeVisible();
  await page.getByPlaceholder("Type the term").fill("gehen");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByText("Correct ·", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Learn · 2 / 4", { exact: true })).toBeVisible();
  await expect(page.getByText("Name people and things")).toHaveCount(0);
  expect(harness.backend.reviews).toHaveLength(1);
});
