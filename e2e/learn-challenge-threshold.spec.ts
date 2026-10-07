import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { test, expect } from "./support/app";
import { challengeFixture } from "./support/challenge";
import { USER_ID, NOW } from "./support/backend";
import { challengeForms } from "../src/content/curriculum/german-a1-challenges.server";
import { COURSE_SCOPE } from "../src/lib/curriculum/course-progress";
import { startChallenge, submitChallenge } from "../src/lib/curriculum/challenge.server";
import {
  createAssessmentAttempt,
  readAssessmentHistory,
  readAssessmentAttempt,
} from "../src/lib/curriculum/assessment.server";
import { cp1 } from "../src/content/curriculum/german-a1-cp1";
import { undersizedTargets } from "./support/touch";

test("6/8 Unit 3 challenge unlocks CP1 immediately with no lesson or Unit Check completion", async ({
  page,
  launch,
  isMobile,
}, info) => {
  test.setTimeout(60_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = challengeFixture();
  // Reach Unit 3 through real, owned challenge results, without lesson traversal.
  for (const unitId of ["DE.A1.U01", "DE.A1.U02"]) {
    const request = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
    await startChallenge(f.storage.db, USER_ID, request, NOW);
    await submitChallenge(
      f.storage.db,
      USER_ID,
      {
        ...request,
        responses: challengeForms[unitId].A.map((item, index) => ({
          itemId: item.id,
          response: index < 6 ? item.acceptedAnswers[0] : "wrong",
        })),
      },
      NOW + 1,
    );
  }
  const harness = await launch({
    sets: [],
    handlers: {
      ...f.handlers,
      getUnitCheckHistory: (input: unknown) => readAssessmentHistory(f.storage.db, USER_ID, input),
      getUnitCheckAttempt: (input: unknown) => readAssessmentAttempt(f.storage.db, USER_ID, input),
      startUnitCheck: (input: unknown) => createAssessmentAttempt(f.storage.db, USER_ID, input),
    },
  });
  await page.goto("/learn/units/DE.A1.U03");
  await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Checkpoint 1" })).toHaveCount(0);
  await page.getByRole("link", { name: "Test out of this unit" }).click();
  await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
  for (const [index, item] of challengeForms["DE.A1.U03"].A.entries()) {
    await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
    await page
      .getByRole("textbox", { name: "Your answer" })
      .fill(index < 6 ? item.acceptedAnswers[0] : "wrong");
    if (index < 7) await page.getByRole("button", { name: "Next task", exact: true }).click();
  }
  await page.getByRole("button", { name: "Submit challenge", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Cleared by challenge" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Checkpoint 1" })).toBeVisible();
  mkdirSync("screenshots/challenge-threshold", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `screenshots/challenge-threshold/cleared-${info.project.name}.png`,
    fullPage: true,
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (isMobile) expect(await undersizedTargets(page)).toEqual([]);
  await page.getByRole("link", { name: "Study these lessons optionally" }).click();
  await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
  await expect(page.getByRole("link", { name: /Take Unit 3 Check/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Open Checkpoint 1" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("link", { name: "Open Checkpoint 1" })).toBeVisible();
  await page.goto("/learn");
  await expect(page.getByRole("link", { name: "Open Checkpoint 1" })).toBeVisible();
  await page.getByRole("link", { name: "Open Checkpoint 1" }).click();
  await expect(page.getByRole("button", { name: "Start Checkpoint 1" })).toBeVisible();
  await page.getByRole("button", { name: "Start Checkpoint 1" }).click();
  await expect(page.getByRole("heading", { name: cp1.items[0].prompt, exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `screenshots/challenge-threshold/cp1-${info.project.name}.png`,
    fullPage: true,
  });
  expect([...f.storage.records.keys()].some((path) => path.includes("/courseProgress/"))).toBe(
    false,
  );
  expect(harness.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
  expect(harness.serverFns.callsTo("finishUnitCheck")).toHaveLength(0);
  expect(
    [...f.storage.records.values()].filter(
      (row) =>
        (row as { purpose?: string }).purpose === "unit-challenge" &&
        (row as { unitId?: string }).unitId === "DE.A1.U03",
    ),
  ).toHaveLength(2);
});
