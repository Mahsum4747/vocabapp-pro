import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { test, expect } from "./support/app";
import { USER_ID } from "./support/backend";
import { courseProgressFixture } from "./support/course-progress";
import { cp1 } from "../src/content/curriculum/german-a1-cp1";
import { germanA1 } from "../src/content/curriculum/german-a1";
import {
  createAssessmentAttempt,
  readAssessmentAttempt,
  readAssessmentHistory,
  submitAssessmentAttempt,
} from "../src/lib/curriculum/assessment.server";
import { undersizedTargets } from "./support/touch";
async function fixture(complete = true) {
  const course = courseProgressFixture();
  if (complete)
    for (let i = 0; i < 12; i++) await course.advanceLesson(i, germanA1.lessons[i].steps.length);
  let loseStart = false,
    loseSubmit = false,
    failRead = false;
  return {
    course,
    storage: course.storage,
    loseStart: () => {
      loseStart = true;
    },
    loseSubmit: () => {
      loseSubmit = true;
    },
    failRead: () => {
      failRead = true;
    },
    handlers: {
      ...course.handlers,
      getUnitCheckHistory: async (input: unknown) =>
        readAssessmentHistory(course.storage.db, USER_ID, input),
      getUnitCheckAttempt: async (input: unknown) => {
        if (failRead) {
          failRead = false;
          throw Error("Fixture read offline");
        }
        return readAssessmentAttempt(course.storage.db, USER_ID, input);
      },
      startUnitCheck: async (input: unknown) => {
        const result = await createAssessmentAttempt(course.storage.db, USER_ID, input);
        if (loseStart) {
          loseStart = false;
          throw Error("Fixture lost start ack");
        }
        return result;
      },
      finishUnitCheck: async (input: unknown) => {
        const result = await submitAssessmentAttempt(course.storage.db, USER_ID, input);
        if (loseSubmit) {
          loseSubmit = false;
          throw Error("Fixture lost submit ack");
        }
        return result;
      },
    },
  };
}
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/cp1", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `screenshots/cp1/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function fill(page: Page, wrong = false) {
  for (const [index, item] of cp1.items.entries()) {
    await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Hint|Show answer/ })).toHaveCount(0);
    await expect(page.getByText(/Accepted response:/)).toHaveCount(0);
    await page
      .getByLabel(index === 0 ? "Name field" : "Your response", { exact: true })
      .fill(
        wrong && [9, 13].includes(index) ? "wrong" : item.acceptedAnswers[0].replaceAll("ü", "ue"),
      );
    if (index < 13) await page.getByRole("button", { name: "Next task", exact: true }).click();
  }
}
test("CP1 completes, names gaps and lesson recommendations, reloads exact result and retries without progression writes", async ({
  page,
  launch,
  isMobile,
}, info) => {
  test.setTimeout(90_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = await fixture();
  const before = structuredClone(f.storage.records);
  const writes = f.storage.writes.length;
  const harness = await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn");
  await expect(page.getByRole("link", { name: "Open Checkpoint 1" })).toBeVisible();
  await page.goto("/learn/units/DE.A1.U03");
  await expect(page.getByRole("link", { name: "Open Checkpoint 1" })).toBeVisible();
  await page.getByRole("link", { name: "Open Checkpoint 1" }).click();
  await expect(page.getByRole("button", { name: "Start Checkpoint 1" })).toBeVisible();
  await shot(page, `intro-${info.project.name}`);
  await page.getByRole("button", { name: "Start Checkpoint 1" }).click();
  await expect(page.getByRole("heading", { name: cp1.items[0].prompt, exact: true })).toBeVisible();
  if (isMobile) expect(await undersizedTargets(page)).toEqual([]);
  await shot(page, `form-${info.project.name}`);
  await fill(page, true);
  await page.getByRole("button", { name: "Submit checkpoint" }).click();
  await expect(
    page.getByRole("heading", { name: "Checkpoint saved: 12 / 14 correct" }),
  ).toBeVisible();
  const firstUrl = page.url();
  await expect(page.getByRole("heading", { name: "Follow-up gaps" })).toBeVisible();
  await expect(page.locator('a[href="/learn/DE.A1.U02.L04"]')).toHaveCount(1);
  await expect(page.locator('a[href="/learn/DE.A1.U03.L04"]')).toHaveCount(1);
  await shot(page, `gaps-${info.project.name}`);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Checkpoint saved: 12 / 14 correct" }),
  ).toBeVisible();
  await page.getByText("Review checkpoint tasks", { exact: true }).click();
  await expect(page.getByText("Accepted response:", { exact: false })).toHaveCount(14);
  await page.getByRole("button", { name: "Try Checkpoint 1 again" }).click();
  await expect(page.getByRole("heading", { name: cp1.items[0].prompt, exact: true })).toBeVisible();
  await expect(page.getByText(/Repeated practice/)).toBeVisible();
  await fill(page);
  await page.getByRole("button", { name: "Submit checkpoint" }).click();
  await expect(
    page.getByRole("heading", { name: "Checkpoint saved: 14 / 14 correct" }),
  ).toBeVisible();
  await expect(page.getByText(/No follow-up gaps in this sample/)).toBeVisible();
  await expect(page.getByText(/Repeated practice with the same tasks/)).toBeVisible();
  await shot(page, `success-${info.project.name}`);
  await page.goto(firstUrl);
  await expect(
    page.getByRole("heading", { name: "Checkpoint saved: 12 / 14 correct" }),
  ).toBeVisible();
  for (const [path, value] of before) expect(f.storage.records.get(path)).toEqual(value);
  expect(
    f.storage.writes.slice(writes).every((path) => path.includes("/assessmentAttempts/")),
  ).toBe(true);
  expect(
    harness.serverFns
      .callsTo("finishUnitCheck")
      .every((call) => JSON.stringify(call).includes(cp1.id)),
  ).toBe(true);
  expect(harness.serverFns.callsTo("finishUnitChallenge")).toHaveLength(0);
  expect(harness.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
  await page.goto("/learn");
  expect(await page.locator('a[href*="U04"]').count()).toBe(0);
});
test("CP1 eligibility, unfinished refresh privacy, leave warning and dark 320px", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(60_000);
  const f = await fixture(false);
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn");
  await expect(page.getByRole("link", { name: "Open Checkpoint 1" })).toHaveCount(0);
  await page.goto("/learn/check?assessment=DE.A1.CP1.PROTOTYPE.1");
  await expect(page.getByText(/Finish the four Unit 3 lessons or clear Unit 3 by challenge/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Start Checkpoint 1" })).toHaveCount(0);
  for (let i = 0; i < 12; i++) await f.course.advanceLesson(i, germanA1.lessons[i].steps.length);
  await page.reload();
  await page.getByRole("button", { name: "Start Checkpoint 1" }).click();
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.getByLabel("Name field")).toBeVisible();
  expect(await undersizedTargets(page)).toEqual([]);
  await shot(page, `dark-320-${info.project.name}`);
  await page.getByLabel("Name field").fill("private-unsaved-text");
  await page.getByRole("link", { name: "Learn overview" }).click();
  await expect(
    page.getByText("Leave this checkpoint? Unsubmitted answers will be cleared."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep answering" }).click();
  await expect(page.getByLabel("Name field")).toHaveValue("private-unsaved-text");
  page.once("dialog", (dialog) => dialog.accept());
  await page.reload();
  await expect(page.getByLabel("Name field")).toHaveValue("");
  expect(JSON.stringify([...f.storage.records.values()])).not.toContain("private-unsaved-text");
  await page.getByLabel("Name field").fill("Mara");
  await page.getByRole("link", { name: "Learn overview" }).click();
  await page.getByRole("button", { name: "Leave checkpoint", exact: true }).click();
  await expect(page.getByRole("link", { name: "Open Checkpoint 1" })).toBeVisible();
});
test("CP1 lost acknowledgements recover same draft and saved submission, unavailable read retries safely", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(60_000);
  const f = await fixture();
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn/check?assessment=DE.A1.CP1.PROTOTYPE.1");
  f.loseStart();
  await page.getByRole("button", { name: "Start Checkpoint 1" }).click();
  await expect(page.getByRole("button", { name: "Retry start", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Retry start", exact: true }).click();
  await fill(page);
  f.loseSubmit();
  await page.getByRole("button", { name: "Submit checkpoint" }).click();
  await expect(page.getByRole("button", { name: "Retry submission" })).toBeVisible();
  await page.getByRole("button", { name: "Retry submission" }).click();
  await expect(
    page.getByRole("heading", { name: "Checkpoint saved: 14 / 14 correct" }),
  ).toBeVisible();
  expect(
    [...f.storage.records.keys()].filter((path) => path.includes("/assessmentAttempts/")),
  ).toHaveLength(1);
  f.failRead();
  await page.reload();
  await expect(page.getByRole("button", { name: "Retry load" })).toBeVisible();
  await page.getByRole("button", { name: "Retry load" }).click();
  await expect(
    page.getByRole("heading", { name: "Checkpoint saved: 14 / 14 correct" }),
  ).toBeVisible();
  await shot(page, `recovered-${info.project.name}`);
});
