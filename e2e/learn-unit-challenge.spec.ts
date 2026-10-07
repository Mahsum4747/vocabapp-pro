import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { test, expect } from "./support/app";
import { challengeFixture } from "./support/challenge";
import { challengeForms } from "../src/content/curriculum/german-a1-challenges.server";
import { CHALLENGE_RETRY_MS } from "../src/lib/curriculum/challenge";
import { undersizedTargets } from "./support/touch";
async function fill(page: Page, unitId: string, formId: "A" | "B" = "A", wrongCount = 0) {
  for (const [index, item] of challengeForms[unitId][formId].entries()) {
    await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
    const answer = index < wrongCount ? "wrong" : item.acceptedAnswers[0];
    if (item.options) await page.getByRole("radio", { name: answer, exact: true }).check();
    else
      await page
        .getByRole("textbox", { name: "Your answer" })
        .fill(answer.replaceAll("ü", "ue").replaceAll("ä", "ae").replaceAll("ß", "ss"));
    if (index < 7) await page.getByRole("button", { name: "Next task", exact: true }).click();
  }
}
async function fits(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
test("6/8 Unit 1 and 2 clearance persists, guides progression and leaves every lesson untouched", async ({
  page,
  launch,
  isMobile,
}, info) => {
  // This case traverses both eight-item challenges, reloads and course/Home navigation.
  test.setTimeout(60_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const fixture = challengeFixture();
  const harness = await launch({ sets: [], handlers: fixture.handlers });
  mkdirSync("screenshots", { recursive: true });
  for (const unitId of ["DE.A1.U01", "DE.A1.U02"]) {
    await page.goto(`/learn/units/${unitId}`);
    await expect(page.getByRole("heading", { name: "Learn the unit" })).toBeVisible();
    await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
    await page.screenshot({
      path: `screenshots/challenge-unit-page-${unitId}-${info.project.name}.png`,
      fullPage: true,
    });
    await page.getByRole("link", { name: "Test out of this unit" }).click();
    await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
    await fits(page);
    if (isMobile) expect(await undersizedTargets(page)).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `screenshots/challenge-${unitId}-${info.project.name}.png`,
      fullPage: true,
    });
    await fill(page, unitId, "A", 2);
    await page.getByRole("button", { name: "Submit challenge", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Cleared by challenge" })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `screenshots/challenge-cleared-${unitId}-${info.project.name}.png`,
      fullPage: true,
    });
    if (unitId === "DE.A1.U01")
      await expect(
        page.getByRole("link", { name: "Continue to next available unit" }),
      ).toHaveAttribute("href", "/learn/units/DE.A1.U02");
    else
      await expect(
        page.getByRole("link", { name: "Continue to next available unit" }),
      ).toHaveAttribute("href", "/learn/units/DE.A1.U03");
    await page.reload();
    await expect(page.getByRole("heading", { name: "Cleared by challenge" })).toBeVisible();
    await page.getByRole("link", { name: "Study these lessons optionally" }).click();
    await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
    await expect(page.locator("main ol").getByText("Available", { exact: true })).toHaveCount(4);
    await expect(page.getByRole("link", { name: /Take Unit .*Check/ })).toHaveCount(0);
    await page.goto("/learn");
    if (unitId === "DE.A1.U01")
      await expect(page.getByRole("link", { name: "Start lesson" })).toHaveAttribute(
        "href",
        "/learn/DE.A1.U02.L01",
      );
    else
      await expect(page.getByRole("link", { name: "Start lesson", exact: true })).toHaveAttribute(
        "href",
        "/learn/DE.A1.U03.L01",
      );
    if (unitId === "DE.A1.U01") {
      await page.goto("/");
      await expect(page.getByRole("link", { name: "German A1 course" })).toHaveAttribute(
        "href",
        "/learn/DE.A1.U02.L01",
      );
    }
  }
  expect(fixture.storage.writes.every((path) => path.includes("/unitChallenges/"))).toBe(true);
  expect(harness.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
  expect(harness.serverFns.callsTo("finishUnitCheck")).toHaveLength(0);
});
test("failed challenge reveals no keys, permits study and a delayed alternate retry", async ({
  page,
  launch,
  isMobile,
}, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const fixture = challengeFixture();
  await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn/challenge?unitId=DE.A1.U02");
  await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
  await fill(page, "DE.A1.U02", "A", 3);
  await page.getByRole("button", { name: "Submit challenge", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Review these lessons" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Try again later" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Start unit challenge" })).toHaveCount(0);
  for (const item of challengeForms["DE.A1.U02"].A)
    await expect(page.getByText(item.acceptedAnswers[0], { exact: true })).toHaveCount(0);
  await fits(page);
  if (isMobile) expect(await undersizedTargets(page)).toEqual([]);
  mkdirSync("screenshots", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `screenshots/challenge-failed-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "Review these lessons" }).click();
  await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
  fixture.advanceTime(CHALLENGE_RETRY_MS);
  await page.goto("/learn/challenge?unitId=DE.A1.U02");
  await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
  await fill(page, "DE.A1.U02", "B");
  await page.getByRole("button", { name: "Submit challenge", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Cleared by challenge" })).toBeVisible();
});
test("lost acknowledgements safely resume the same draft and submitted result", async ({
  page,
  launch,
}) => {
  const fixture = challengeFixture();
  await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn/challenge?unitId=DE.A1.U01");
  fixture.loseNextStartAck();
  await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
  await fill(page, "DE.A1.U01");
  fixture.loseNextSubmitAck();
  await page.getByRole("button", { name: "Submit challenge", exact: true }).click();
  await expect(page.getByRole("button", { name: "Retry submission" })).toBeVisible();
  await page.getByRole("button", { name: "Retry submission" }).click();
  await expect(page.getByRole("heading", { name: "Cleared by challenge" })).toBeVisible();
  expect(fixture.storage.records.size).toBe(2);
});
test("narrow dark mobile challenge layout", async ({ page, launch }, info) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ colorScheme: "dark" });
  await launch({ sets: [], handlers: challengeFixture().handlers });
  await page.goto("/learn/challenge?unitId=DE.A1.U02");
  await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: challengeForms["DE.A1.U02"].A[0].prompt, exact: true }),
  ).toBeVisible();
  await fits(page);
  expect(await undersizedTargets(page)).toEqual([]);
  mkdirSync("screenshots", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `screenshots/challenge-dark-320-${info.project.name}.png`,
    fullPage: true,
  });
});
