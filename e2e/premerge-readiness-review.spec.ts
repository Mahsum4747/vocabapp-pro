// Hermetic readiness coverage retained to reproduce compiled legacy-entry failures.
import { mkdirSync } from "node:fs";
import { expect, test } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";
import { queueLibrary } from "./support/library";
test("premerge global navigation, legacy entries and browser history", async ({ page, launch, isMobile }, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const harness = await launch({ ...queueLibrary(), handlers: courseProgressFixture().handlers });
  mkdirSync("screenshots/premerge", { recursive: true });
  for (const [name, url] of [["home", "/"], ["grammar", "/grammar"], ["lesen", "/grammar/lesen"], ["overview", "/learn"], ["vocabulary", "/sets/set-verbs/learn"]]) {
    await page.goto(url);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main")).not.toHaveText("");
    if (name === "overview") await expect(page.getByRole("heading", { name: "The course ahead" })).toBeVisible();
    if (name === "vocabulary") await expect(page.getByRole("heading", { name: "to go", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `screenshots/premerge/${name}-${info.project.name}.png`, fullPage: true });
  }
  await page.goto("/learn");
  await page.getByRole("link", { name: "Open Unit 2", exact: true }).click();
  await expect(page.getByRole("heading", { name: "People, home and routine", exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "The course ahead" })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "People, home and routine", exact: true })).toBeVisible();
  expect(harness.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
});
test("premerge signed-out Learn is gated before durable requests", async ({ page, launch }, info) => {
  const harness = await launch({ sets: [], handlers: courseProgressFixture().handlers });
  await page.route("**/api/auth/get-session", route => route.fulfill({status:200,contentType:"application/json",body:"null"}));
  await page.goto("/learn");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", {name:"Sign in",exact:true})).toBeVisible();
  mkdirSync("screenshots/premerge", { recursive: true });
  await page.screenshot({path:`screenshots/premerge/signed-out-${info.project.name}.png`,fullPage:true});
  expect(harness.serverFns.callsTo("getCourseProgress")).toHaveLength(0);
});
