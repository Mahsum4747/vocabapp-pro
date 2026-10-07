import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect } from "./support/app";
import { challengeFixture } from "./support/challenge";
import { assessmentFixture } from "./support/assessment";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { COURSE_SCOPE } from "../src/lib/curriculum/course-progress";
import { startChallenge, submitChallenge } from "../src/lib/curriculum/challenge.server";
import { challengeForms } from "../src/content/curriculum/german-a1-challenges.server";
import { USER_ID, NOW } from "./support/backend";
import { undersizedTargets } from "./support/touch";
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/unit-detail-ui", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `screenshots/unit-detail-ui/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if ((page.viewportSize()?.width ?? 1280) < 768) expect(await undersizedTargets(page)).toEqual([]);
}
test("shared U1/U3/U4 detail: start, rows, challenge and real lesson gate", async ({
  page,
  launch,
  isMobile,
}, info) => {
  test.setTimeout(90_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = challengeFixture();
  await launch({ sets: [], handlers: f.handlers });
  for (const n of [1, 3, 4]) {
    const unit = germanA1.units[n - 1],
      lesson = germanA1.lessons[(n - 1) * 4];
    await page.goto(`/learn/units/${unit.id}`);
    await expect(page.getByRole("heading", { name: unit.title, exact: true })).toBeVisible();
    const progress = page.getByRole("region", { name: "Unit lesson progress", exact: true });
    await expect(progress.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    await expect(
      page.getByText("Complete all 4 lessons to unlock the Unit Check.", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: `Unit ${n} Check`, exact: true })).toHaveCount(0);
    await expect(
      page.getByText("You're studying ahead of your recommended path.", { exact: true }),
    ).toHaveCount(n === 1 ? 0 : 1);
    await expect(progress.getByRole("link", { name: "Start Unit", exact: true })).toHaveAttribute(
      "href",
      `/learn/${lesson.id}`,
    );
    await shot(page, `u${n}-${info.project.name}`);
    await progress.getByRole("link", { name: "Start Unit", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: lesson.steps[0].prompt, exact: true }),
    ).toBeVisible();
    await page.goto(`/learn/units/${unit.id}`);
    await page
      .locator("main ol")
      .getByRole("link", { name: new RegExp(germanA1.lessons[(n - 1) * 4 + 1].title) })
      .click();
    await expect(page).toHaveURL(new RegExp(`${unit.id}.L02$`));
    await page.goto(`/learn/units/${unit.id}`);
    await page.getByRole("link", { name: "Take Unit Challenge", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Start unit challenge", exact: true }),
    ).toBeVisible();
  }
  expect(f.storage.writes).toHaveLength(0);
});
test("continue and completed lessons retain Check eligibility and CP1", async ({
  page,
  launch,
  isMobile,
}, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = await assessmentFixture(false, 3);
  await f.course.advanceLesson(8, germanA1.lessons[8].steps.length);
  await f.course.advanceLesson(9, 2);
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn/units/DE.A1.U03");
  const progress = page.getByRole("region", { name: "Unit lesson progress", exact: true });
  await expect(progress.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "25");
  await expect(progress.getByRole("link", { name: "Continue Unit", exact: true })).toHaveAttribute(
    "href",
    "/learn/DE.A1.U03.L02",
  );
  await expect(page.locator("main ol").getByText("Completed", { exact: true })).toHaveCount(1);
  await expect(
    page.getByText("Complete all 4 lessons to unlock the Unit Check.", { exact: true }),
  ).toBeVisible();
  await shot(page, `in-progress-${info.project.name}`);
  for (let n = 9; n < 12; n++) await f.course.advanceLesson(n, germanA1.lessons[n].steps.length);
  await page.reload();
  await expect(progress.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  await expect(page.getByRole("link", { name: "Unit 3 Check", exact: true })).toBeVisible();
  await expect(
    page.getByText("Complete all 4 lessons to unlock the Unit Check.", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Open Checkpoint 1", exact: true })).toBeVisible();
  await shot(page, `completed-${info.project.name}`);
});
test("challenge clearance remains distinct from lessons and Check in dark 320", async ({
  page,
  launch,
}, info) => {
  const f = challengeFixture(),
    unitId = "DE.A1.U04",
    req = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
  await startChallenge(f.storage.db, USER_ID, req, NOW);
  await submitChallenge(
    f.storage.db,
    USER_ID,
    {
      ...req,
      responses: challengeForms[unitId].A.map((item, n) => ({
        itemId: item.id,
        response:
          n < 6
            ? item.acceptedAnswers[0]
            : (item.options?.find((option) => !item.acceptedAnswers.includes(option)) ?? "wrong"),
      })),
    },
    NOW + 1,
  );
  await launch({ sets: [], handlers: f.handlers });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`/learn/units/${unitId}`);
  await expect(
    page
      .getByRole("region", { name: "Unit challenge", exact: true })
      .getByText("Cleared by challenge", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Unit lesson progress", exact: true })
      .getByRole("progressbar"),
  ).toHaveAttribute("aria-valuenow", "0");
  await expect(
    page.getByText("Complete all 4 lessons to unlock the Unit Check.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Unit 4 Check", exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Continue to next available unit", exact: true }),
  ).toHaveAttribute("href", "/learn/units/DE.A1.U05");
  await shot(page, `cleared-dark-320-${info.project.name}`);
  expect(f.storage.writes.every((path) => path.includes("/unitChallenges/"))).toBe(true);
});
