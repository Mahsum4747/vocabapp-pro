import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { test, expect } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";
import { assessmentFixture } from "./support/assessment";
import { challengeFixture } from "./support/challenge";
import { USER_ID } from "./support/backend";
import { undersizedTargets } from "./support/touch";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { unit6CheckForms } from "../src/content/curriculum/german-a1-unit6-check";
import { cp2Forms } from "../src/content/curriculum/german-a1-cp2";
import { challengeForms } from "../src/content/curriculum/german-a1-challenges.server";
import {
  createAssessmentAttempt,
  readAssessmentAttempt,
  readAssessmentHistory,
  submitAssessmentAttempt,
} from "../src/lib/curriculum/assessment.server";
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/batch-b", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `screenshots/batch-b/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if ((page.viewportSize()?.width ?? 1280) < 768) expect(await undersizedTargets(page)).toEqual([]);
}
async function noSupport(page: Page) {
  await expect(page.getByRole("button", { name: /^Hint$|^Show answer$/ })).toHaveCount(0);
  await expect(page.getByText(/Accepted response:/)).toHaveCount(0);
}
test("U6 is open ahead, Perfekt lesson persists and recovers without prior completion", async ({
  page,
  launch,
  isMobile,
}, info) => {
  test.setTimeout(90_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = courseProgressFixture();
  const h = await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn");
  await expect(page.getByRole("link", { name: "Open Unit 6", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Unit 7", exact: true })).toHaveCount(0);
  await expect(
    page.locator('[data-unit="DE.A1.U07"]').getByText("Not yet authored", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Open Unit 6", exact: true }).click();
  await expect(
    page.getByText("You're studying ahead of your recommended path.", { exact: true }),
  ).toHaveCount(1);
  await expect(
    page.getByText("Complete all 4 lessons to unlock the Unit Check.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Take Unit Challenge", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Checkpoint 2", exact: true })).toHaveCount(0);
  await shot(page, `unit-ahead-${info.project.name}`);
  const lesson = germanA1.lessons[20];
  await page.goto(`/learn/${lesson.id}`);
  for (const [n, step] of lesson.steps.entries()) {
    await expect(page.getByRole("heading", { name: step.prompt, exact: true })).toBeVisible();
    if (n === 3) {
      const input = page.getByLabel("Your German response", { exact: true });
      for (let wrong = 1; wrong <= 3; wrong++) {
        await input.fill(`wrong${wrong}`);
        await input.press("Enter");
        await expect(page.getByRole("status")).toContainText("Try again");
        await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
        if (wrong === 2) await page.getByRole("button", { name: "Hint", exact: true }).click();
      }
      const writes = h.serverFns.callsTo("acknowledgeCourseProgress").length;
      await page.getByRole("button", { name: "Show answer", exact: true }).click();
      await expect(page.getByRole("status")).toContainText("not a correct answer");
      expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(writes);
      await page.emulateMedia({ colorScheme: "dark" });
      await page.setViewportSize({ width: 320, height: 844 });
      await shot(page, `perfekt-recovery-dark-320-${info.project.name}`);
    } else if (step.kind !== "explanation") {
      if (step.kind === "choice")
        await page.getByRole("radio", { name: step.correctAnswer, exact: true }).check();
      else if (step.kind === "text")
        await page.getByLabel(step.inputLabel, { exact: true }).fill(step.acceptedAnswers[0]);
      await page.getByRole("button", { name: "Check", exact: true }).click();
      await expect(page.getByRole("status")).toContainText("That fits");
      await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
    }
    await page
      .getByRole("button", {
        name: n === lesson.steps.length - 1 ? "Finish lesson" : "Continue",
        exact: true,
      })
      .click();
  }
  await expect(page.getByRole("heading", { name: "Lesson finished.", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Lesson finished.", exact: true })).toBeVisible();
  await page.goto("/learn/units/DE.A1.U06");
  await expect(page.getByText("1 of 4 lessons finished")).toBeVisible();
  await expect(page.getByRole("link", { name: "Unit 6 Check", exact: true })).toHaveCount(0);
  await page.goto("/learn");
  await expect(
    page
      .getByRole("region", { name: "Recommended learning action" })
      .getByRole("link", { name: "Start lesson", exact: true }),
  ).toHaveAttribute("href", "/learn/DE.A1.U01.L01");
  expect(f.storage.writes.every((p) => p.includes("/courseProgress/"))).toBe(true);
  expect(h.serverFns.callsTo("finishUnitChallenge")).toHaveLength(0);
  expect(h.serverFns.callsTo("finishUnitCheck")).toHaveLength(0);
});
test("all four U6 lessons enable Check A/B and CP2; checks preserve lesson records", async ({
  page,
  launch,
  isMobile,
}, info) => {
  test.setTimeout(120_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = await assessmentFixture(true, 6);
  const before = structuredClone([...f.storage.records.entries()]);
  const writes = f.storage.writes.length;
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn/units/DE.A1.U06");
  await expect(page.getByRole("link", { name: "Open Checkpoint 2", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Unit 6 Check", exact: true }).click();
  await page.getByRole("button", { name: "Start Unit 6 Check", exact: true }).click();
  for (const [j, form] of unit6CheckForms.entries()) {
    if (j) await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
    for (const [n, item] of form.items.entries()) {
      await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
      await noSupport(page);
      if (item.options)
        await page.getByRole("radio", { name: item.acceptedAnswers[0], exact: true }).check();
      else
        await page
          .getByLabel("Your response", { exact: true })
          .fill(item.acceptedAnswers[0].replaceAll("ü", "ue"));
      if (n < form.items.length - 1)
        await page.getByRole("button", { name: "Next item", exact: true }).click();
    }
    await page.getByRole("button", { name: "Submit check", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Unit check: 10 / 10 correct", exact: true }),
    ).toBeVisible();
    await shot(page, `check-${j}-${info.project.name}`);
  }
  for (const [path, value] of before) expect(f.storage.records.get(path)).toEqual(value);
  expect(f.storage.writes.slice(writes).every((p) => p.includes("/assessmentAttempts/"))).toBe(
    true,
  );
});
for (const correct of [5, 6])
  test(`U6 challenge ${correct}/8: truthful clearance and CP2 eligibility`, async ({
    page,
    launch,
    isMobile,
  }, info) => {
    test.setTimeout(120_000);
    if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
    const f = challengeFixture();
    const h = await launch({
      sets: [],
      handlers: {
        ...f.handlers,
        getUnitCheckHistory: async (input: unknown) =>
          readAssessmentHistory(f.storage.db, USER_ID, input),
        getUnitCheckAttempt: async (input: unknown) =>
          readAssessmentAttempt(f.storage.db, USER_ID, input),
        startUnitCheck: async (input: unknown) =>
          createAssessmentAttempt(f.storage.db, USER_ID, input),
        finishUnitCheck: async (input: unknown) =>
          submitAssessmentAttempt(f.storage.db, USER_ID, input),
      },
    });
    await page.goto("/learn/units/DE.A1.U06");
    await page.getByRole("link", { name: "Take Unit Challenge", exact: true }).click();
    await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
    for (const [n, item] of challengeForms["DE.A1.U06"].A.entries()) {
      await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
      await noSupport(page);
      const answer =
        n < correct
          ? item.acceptedAnswers[0]
          : (item.options?.find((option) => !item.acceptedAnswers.includes(option)) ?? "wrong");
      if (item.options) await page.getByRole("radio", { name: answer, exact: true }).check();
      else await page.getByRole("textbox", { name: "Your answer" }).fill(answer);
      if (n < 7) await page.getByRole("button", { name: "Next task", exact: true }).click();
    }
    await page.getByRole("button", { name: "Submit challenge", exact: true }).click();
    await expect(
      page.getByRole("heading", {
        name: correct === 6 ? "Cleared by challenge" : "Review these lessons",
        exact: true,
      }),
    ).toBeVisible();
    await shot(page, `challenge-${correct}-${info.project.name}`);
    await page.goto("/learn/units/DE.A1.U06");
    await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
    await expect(page.getByRole("link", { name: "Unit 6 Check", exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Open Checkpoint 2", exact: true })).toHaveCount(
      correct === 6 ? 1 : 0,
    );
    expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
    if (correct === 5) {
      expect(f.storage.writes.every((p) => p.includes("/unitChallenges/"))).toBe(true);
      return;
    }
    await page.getByRole("link", { name: "Open Checkpoint 2", exact: true }).click();
    await expect(page.getByText(/Insufficient evidence until you submit/)).toBeVisible();
    await shot(page, `cp2-intro-${info.project.name}`);
    const before = structuredClone([...f.storage.records.entries()]);
    const writes = f.storage.writes.length;
    await page.getByRole("button", { name: "Start Checkpoint 2", exact: true }).click();
    let savedUrl = "";
    for (let trial = 0; trial < 3; trial++) {
      const form = cp2Forms[trial === 1 ? 1 : 0];
      if (trial)
        await page.getByRole("button", { name: "Try Checkpoint 2 again", exact: true }).click();
      for (const [n, item] of form.items.entries()) {
        await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
        await noSupport(page);
        if (n === 0) {
          if (trial === 0) await shot(page, `cp2-form-${info.project.name}`);
          if (trial === 2) await expect(page.getByText(/Repeated practice/)).toBeVisible();
        }
        await page
          .getByRole("textbox")
          .fill(
            trial === 0 && n === 15
              ? "wrong"
              : item.acceptedAnswers[0].replaceAll("ü", "ue").replaceAll("ß", "ss"),
          );
        if (n < 15) await page.getByRole("button", { name: "Next task", exact: true }).click();
      }
      await page.getByRole("button", { name: "Submit checkpoint", exact: true }).click();
      await expect(
        page.getByRole("heading", {
          name: `Checkpoint saved: ${trial === 0 ? 15 : 16} / 16 correct`,
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "Demonstrated", exact: true })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Follow-up needed", exact: true }),
      ).toBeVisible();
      if (trial === 0) {
        savedUrl = page.url();
        await expect(
          page.getByText(
            "Your practical message needs follow-up. Other outcome groups do not replace it.",
            { exact: true },
          ),
        ).toBeVisible();
        await expect(page.getByText("Practical message fulfilment", { exact: true })).toBeVisible();
        await expect(page.getByRole("link", { name: /Unit 6 · Earlier states/ })).toBeVisible();
        await page.emulateMedia({ colorScheme: "dark" });
        await page.setViewportSize({ width: 320, height: 844 });
        await shot(page, `cp2-gap-dark-320-${info.project.name}`);
        await page.reload();
        await expect(
          page.getByRole("heading", { name: "Checkpoint saved: 15 / 16 correct", exact: true }),
        ).toBeVisible();
      } else await expect(page.getByText(/No follow-up gaps in this sample/)).toBeVisible();
    }
    await page.goto(savedUrl);
    await expect(
      page.getByRole("heading", { name: "Checkpoint saved: 15 / 16 correct", exact: true }),
    ).toBeVisible();
    for (const [path, value] of before) expect(f.storage.records.get(path)).toEqual(value);
    expect(f.storage.writes.slice(writes).every((p) => p.includes("/assessmentAttempts/"))).toBe(
      true,
    );
    expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
    await page.goto("/learn");
    await expect(page.getByRole("link", { name: "Open Unit 7", exact: true })).toHaveCount(0);
  });
test("CP2 remains unavailable before U6 clearance in dark 320px", async ({
  page,
  launch,
}, info) => {
  const f = courseProgressFixture();
  const h = await launch({
    sets: [],
    handlers: {
      ...f.handlers,
      getUnitCheckHistory: async (input: unknown) =>
        readAssessmentHistory(f.storage.db, USER_ID, input),
    },
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/learn/check?assessment=DE.A1.CP2.PROTOTYPE.1");
  await expect(
    page.getByText(
      "Finish the four Unit 6 lessons or clear Unit 6 by challenge before Checkpoint 2.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Start Checkpoint 2", exact: true })).toHaveCount(
    0,
  );
  await shot(page, `cp2-unavailable-dark-320-${info.project.name}`);
  expect(h.serverFns.callsTo("startUnitCheck")).toHaveLength(0);
  expect(f.storage.writes).toHaveLength(0);
});
