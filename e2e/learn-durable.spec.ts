import { mkdirSync } from "node:fs";
import { expect, test } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";
import { germanA1 } from "../src/content/curriculum/german-a1";
import {
  COURSE_SCOPE,
  type DurableProgress,
  type ProgressCommand,
} from "../src/lib/curriculum/course-progress";
import { courseProgressPath } from "../src/lib/curriculum/course-progress.server";
import { USER_ID } from "./support/backend";
const l02 = "/learn/DE.A1.U01.L02";
async function screenshot(page: import("@playwright/test").Page, name: string) {
  mkdirSync("screenshots/phase1c", { recursive: true });
  await page.screenshot({ path: `screenshots/phase1c/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
test("durable overview/unit/resume and historical completion survive reload and leaving Learn", async ({
  page,
  launch,
  isMobile,
}, info) => {
  // This scenario includes several hard reloads plus an exit/re-entry round trip.
  test.setTimeout(60_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const fixture = courseProgressFixture();
  await fixture.advanceLesson(0, 7);
  await fixture.advanceLesson(1, 4);
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn");
  await expect(page.getByText("Your next lesson", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue lesson", exact: true })).toBeVisible();
  await screenshot(page, `overview-${info.project.name}`);
  await page.getByRole("link", { name: "Open Unit 1" }).click();
  await expect(page.getByText("Finished", { exact: true })).toBeVisible();
  await expect(page.getByText("In progress", { exact: true })).toBeVisible();
  await screenshot(page, `unit-${info.project.name}`);
  await page.getByRole("link", { name: /Name people and things/ }).click();
  await expect(page.getByText("Lesson 2 · Step 5 of 8", { exact: true })).toBeVisible();
  await screenshot(page, `resume-${info.project.name}`);
  await page.getByLabel("German phrase for a woman").fill("eine Frau");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  const reads = h.serverFns.callsTo("getCourseProgress").length;
  await page.reload();
  await expect(page.getByLabel("German phrase for a woman")).toHaveValue("eine Frau");
  await expect(page.getByRole("status")).toContainText("That fits");
  expect(h.serverFns.callsTo("getCourseProgress")).toHaveLength(reads + 1);
  await page.getByRole("link", { name: "Unit 1", exact: true }).click();
  await page.getByRole("link", { name: /introduce yourself/ }).click();
  await expect(page.getByRole("heading", { name: "Lesson finished." })).toBeVisible();
  await page.getByRole("button", { name: "Practice lesson again" }).click();
  await expect(page.getByText("Lesson 1 · Step 1 of 7", { exact: true })).toBeVisible();
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Lesson 1 · Step 1 of 7", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Unit 1", exact: true }).click();
  await expect(page.getByText("Finished · Practicing again", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Learn overview" }).click();
  await page.getByRole("link", { name: "Karta home", exact: true }).click();
  await expect(page).not.toHaveURL(/\/learn/);
  await page.goto("/learn/units/DE.A1.U01");
  await expect(page.getByText("Finished · Practicing again", { exact: true })).toBeVisible();
  const mutations = h.serverFns.calls.filter((call) => !call.name.startsWith("get"));
  expect(mutations.every((call) => call.name === "acknowledgeCourseProgress")).toBe(true);
});
test("load failure, save failure and lost acknowledgement retry retain the same logical attempt", async ({
  page,
  launch,
  isMobile,
}, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const fixture = courseProgressFixture();
  await fixture.advanceLesson(1, 4);
  fixture.failNextLoad();
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto(l02);
  await expect(
    page.getByRole("heading", { name: "Your lesson progress couldn’t load." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Retry loading" }).click();
  await page.getByLabel("German phrase for a woman").fill("eine Frau");
  fixture.failNextSave();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByRole("button", { name: "Retry saving" })).toBeVisible();
  await expect(page.getByLabel("German phrase for a woman")).toHaveValue("eine Frau");
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeDisabled();
  await expect(page.getByText("Progress saved", { exact: true })).toHaveCount(0);
  await screenshot(page, `save-failure-${info.project.name}`);
  await page.getByRole("link", { name: "Unit 1", exact: true }).click();
  await page.getByRole("link", { name: "Karta home", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your answer hasn’t saved." })).toBeVisible();
  await expect(page).toHaveURL(/\/learn\/units\//);
  await page.getByRole("button", { name: "Stay in Learn" }).click();
  await page.getByRole("link", { name: /Name people and things/ }).click();
  await expect(page.getByLabel("German phrase for a woman")).toHaveValue("eine Frau");
  fixture.loseNextAcknowledgement();
  await page.getByRole("button", { name: "Retry saving" }).click();
  await expect(page.getByRole("button", { name: "Retry saving" })).toBeVisible();
  await page.getByRole("button", { name: "Retry saving" }).click();
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  const requests = h.serverFns
    .callsTo("acknowledgeCourseProgress")
    .map((call) => call.data as ProgressCommand);
  expect(requests).toHaveLength(3);
  expect(new Set(requests.map((request) => request.operationId)).size).toBe(1);
  expect(new Set(requests.map((request) => request.expectedRevision)).size).toBe(1);
  const stored = fixture.storage.records.get(
    courseProgressPath(USER_ID, { ...COURSE_SCOPE, lessonId: germanA1.lessons[1].id }),
  ) as DurableProgress;
  expect(stored.attempts).toBe(1);
  await page.reload();
  await expect(page.getByLabel("German phrase for a woman")).toHaveValue("eine Frau");
});
test("stale tab response stays local until explicit load; dark/narrow recovery remains usable", async ({
  page,
  launch,
}, info) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  const fixture = courseProgressFixture();
  await fixture.advanceLesson(1, 4);
  await launch({ sets: [], handlers: fixture.handlers });
  await page.goto(l02);
  await page.getByLabel("German phrase for a woman").fill("eine Frau");
  await fixture.advanceLesson(1, 5); // Another tab acknowledges and advances this step.
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByRole("button", { name: "Load saved progress" })).toBeVisible();
  await expect(page.getByLabel("German phrase for a woman")).toHaveValue("eine Frau");
  await screenshot(page, `conflict-dark-320-${info.project.name}`);
  await page.getByRole("button", { name: "Load saved progress" }).click();
  await expect(page.getByText("Lesson 2 · Step 6 of 8", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Lesson 2 · Step 6 of 8", { exact: true })).toBeVisible();
});
test("changed or withdrawn lesson preserves stored data and blocks old-answer grading", async ({
  page,
  launch,
}) => {
  const fixture = courseProgressFixture();
  await fixture.advanceLesson(1, 4);
  const path = courseProgressPath(USER_ID, { ...COURSE_SCOPE, lessonId: germanA1.lessons[1].id });
  const old = fixture.storage.records.get(path) as DurableProgress;
  fixture.storage.records.set(path, { ...old, resumeContractVersion: 2 });
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto(l02);
  await expect(
    page.getByRole("heading", { name: "Your saved lesson is unavailable." }),
  ).toBeVisible();
  await expect(page.getByText(/compatible replacement is not available/)).toBeVisible();
  expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
  expect(fixture.storage.records.get(path)).toEqual({ ...old, resumeContractVersion: 2 });
});

test("signed-out Learn redirects before reading or writing course progress", async ({
  page,
  launch,
}) => {
  const h = await launch({ sets: [], handlers: courseProgressFixture().handlers });
  await page.route("**/api/auth/get-session", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "null",
    }),
  );
  await page.goto(l02);
  await expect(page).toHaveURL(/\/login/);
  expect(h.serverFns.callsTo("getCourseProgress")).toHaveLength(0);
  expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
});

test("lost acknowledgement followed by another tab advancing requires explicit conflict recovery", async ({
  page,
  launch,
}) => {
  const fixture = courseProgressFixture();
  await fixture.advanceLesson(1, 4);
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto(l02);
  await page.getByLabel("German phrase for a woman").fill("eine Frau");
  fixture.loseNextAcknowledgement();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByRole("button", { name: "Retry saving" })).toBeVisible();
  await fixture.advanceLesson(1, 5);
  const writes = fixture.storage.writes.length;
  await page.getByRole("button", { name: "Retry saving" }).click();
  await expect(page.getByRole("button", { name: "Load saved progress" })).toBeVisible();
  await expect(page.getByLabel("German phrase for a woman")).toHaveValue("eine Frau");
  expect(fixture.storage.writes.length).toBe(writes);
  const commands = h.serverFns
    .callsTo("acknowledgeCourseProgress")
    .map((call) => call.data as ProgressCommand);
  expect(commands).toHaveLength(2);
  expect(commands[0]).toEqual(commands[1]);
  await page.getByRole("button", { name: "Load saved progress" }).click();
  await expect(page.getByText("Lesson 2 · Step 6 of 8", { exact: true })).toBeVisible();
});
