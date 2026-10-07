import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";
import { assessmentFixture } from "./support/assessment";
import { challengeFixture } from "./support/challenge";
import { USER_ID, NOW } from "./support/backend";
import { undersizedTargets } from "./support/touch";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { unit4CheckForms } from "../src/content/curriculum/german-a1-unit4-check";
import { unit5CheckForms } from "../src/content/curriculum/german-a1-unit5-check";
import { challengeForms } from "../src/content/curriculum/german-a1-challenges.server";
import { startChallenge, submitChallenge } from "../src/lib/curriculum/challenge.server";
import { COURSE_SCOPE } from "../src/lib/curriculum/course-progress";
async function clear(
  f: ReturnType<typeof courseProgressFixture> | ReturnType<typeof challengeFixture>,
  unitId: string,
) {
  const req = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
  await startChallenge(f.storage.db, USER_ID, req, NOW);
  await submitChallenge(
    f.storage.db,
    USER_ID,
    {
      ...req,
      responses: challengeForms[unitId].A.map((i) => ({
        itemId: i.id,
        response: i.acceptedAnswers[0],
      })),
    },
    NOW + 1,
  );
}
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/batch-a", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `screenshots/batch-a/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
for (const index of [12, 16])
  test(`complete ${germanA1.lessons[index].id}, persist and reload`, async ({
    page,
    launch,
    isMobile,
  }, info) => {
    test.setTimeout(90_000);
    if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
    const f = courseProgressFixture(),
      lesson = germanA1.lessons[index];
    await clear(f, `DE.A1.U0${index === 12 ? 3 : 4}`);
    const h = await launch({
      sets: [],
      handlers: {
        ...f.handlers,
        getCourseProgress: async (input: unknown) => ({
          ...(await f.handlers.getCourseProgress(input)),
          challengeClearances: [`DE.A1.U0${index === 12 ? 3 : 4}`],
        }),
      },
    });
    await page.goto("/learn");
    await expect(
      page.getByRole("link", { name: `Open Unit ${index === 12 ? 4 : 5}`, exact: true }),
    ).toBeVisible();
    await page.goto(`/learn/${lesson.id}`);
    let reloaded = false;
    for (const [n, step] of lesson.steps.entries()) {
      await expect(page.getByRole("heading", { name: step.prompt, exact: true })).toBeVisible();
      if (step.kind !== "explanation") {
        if (step.kind === "choice")
          await page.getByRole("radio", { name: step.correctAnswer, exact: true }).check();
        else if (step.kind === "text")
          await page
            .getByLabel(step.inputLabel, { exact: true })
            .fill(step.acceptedAnswers[0].replaceAll("ü", "ue"));
        await page.getByRole("button", { name: "Check", exact: true }).click();
        await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
        await expect(page.getByRole("status")).toContainText("That fits");
        if (step.kind === "text" && !reloaded) {
          await page.reload();
          await expect(page.getByRole("status")).toContainText("That fits");
          reloaded = true;
          await shot(page, `lesson-${index}-${info.project.name}`);
        }
      }
      await page
        .getByRole("button", {
          name: n === lesson.steps.length - 1 ? "Finish lesson" : "Continue",
          exact: true,
        })
        .click();
    }
    await expect(
      page.getByRole("heading", { name: "Lesson finished.", exact: true }),
    ).toBeVisible();
    await page.goto(`/learn/units/${lesson.unitId}`);
    await expect(page.getByText("1 of 4 lessons finished")).toBeVisible();
    expect(h.serverFns.callsTo("finishUnitCheck")).toHaveLength(0);
  });
test("German helper, hint and answer recovery remain teaching only at 390px and dark 320px", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 390, height: 844 });
  const f = courseProgressFixture();
  await clear(f, "DE.A1.U03");
  const lesson = germanA1.lessons[15],
    n = lesson.steps.findIndex((s) => s.id.endsWith(".may"));
  await f.advanceLesson(15, n);
  const h = await launch({
    sets: [],
    handlers: {
      ...f.handlers,
      getCourseProgress: async (input: unknown) => ({
        ...(await f.handlers.getCourseProgress(input)),
        challengeClearances: ["DE.A1.U03"],
      }),
    },
  });
  await page.goto(`/learn/${lesson.id}`);
  const input = page.getByLabel("Your German response", { exact: true });
  await input.fill("d");
  await page.getByRole("button", { name: "Insert ü", exact: true }).click();
  await expect(input).toHaveValue("dü");
  await input.fill("duerfen");
  await input.press("Enter");
  await expect(page.getByRole("status")).toContainText("That fits");
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  for (let count = 1; count <= 3; count++) {
    await input.fill(`wrong${count}`);
    await input.press("Enter");
    await expect(page.getByRole("status")).toContainText("Try again");
    await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
    if (count === 2) {
      await page.getByRole("button", { name: "Hint", exact: true }).click();
      await shot(page, `hint-${info.project.name}`);
    }
  }
  const writes = h.serverFns.callsTo("acknowledgeCourseProgress").length;
  await page.getByRole("button", { name: "Show answer", exact: true }).click();
  await expect(
    page.getByText("Answer: Du darfst hier nicht essen.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("not a correct answer");
  expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(writes);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 320, height: 844 });
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim(),
      ),
    )
    .toBe("#1c1b19");
  expect(await undersizedTargets(page)).toEqual([]);
  await shot(page, `recovery-dark-320-${info.project.name}`);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: lesson.steps[n + 2].prompt, exact: true }),
  ).toBeVisible();
});
for (const [number, forms] of [
  [4, unit4CheckForms],
  [5, unit5CheckForms],
] as const)
  test(`Unit ${number} completion enables Check A/B, exact review and no pre-result support`, async ({
    page,
    launch,
    isMobile,
  }, info) => {
    test.setTimeout(120_000);
    if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
    const f = await assessmentFixture(false, number);
    await clear(f.course, `DE.A1.U0${number - 1}`);
    for (let n = (number - 1) * 4; n < number * 4; n++)
      await f.course.advanceLesson(n, germanA1.lessons[n].steps.length);
    const before = structuredClone([...f.storage.records.entries()]);
    await launch({
      sets: [],
      handlers: {
        ...f.handlers,
        getCourseProgress: async (input: unknown) => ({
          ...(await f.course.handlers.getCourseProgress(input)),
          challengeClearances: [`DE.A1.U0${number - 1}`],
        }),
      },
    });
    await page.goto(`/learn/units/DE.A1.U0${number}`);
    await expect(
      page.getByText("4 of 4 lessons finished. This lesson sequence is finished."),
    ).toBeVisible();
    await page.getByRole("link", { name: `Unit ${number} Check`, exact: true }).click();
    await page.getByRole("button", { name: `Start Unit ${number} Check`, exact: true }).click();
    for (const [j, form] of forms.entries()) {
      if (j)
        await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
      for (const [n, item] of form.items.entries()) {
        await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
        await expect(page.getByRole("button", { name: "Hint", exact: true })).toHaveCount(0);
        await expect(page.getByRole("button", { name: "Show answer", exact: true })).toHaveCount(0);
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
        page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
      ).toBeVisible();
      await page.getByText("Review item results", { exact: true }).click();
      for (const item of form.items)
        await expect(page.locator("details").getByText(item.prompt, { exact: true })).toBeVisible();
      await shot(page, `check-u${number}-${j}-${info.project.name}`);
    }
    for (const [path, value] of before) expect(f.storage.records.get(path)).toEqual(value);
  });
for (const correct of [5, 6])
  test(`U4 challenge ${correct}/8: truthful clearance, open U5 exploration and U6 unavailable`, async ({
    page,
    launch,
    isMobile,
  }, info) => {
    test.setTimeout(90_000);
    if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
    const f = challengeFixture();
    for (const unitId of ["DE.A1.U01", "DE.A1.U02", "DE.A1.U03"]) await clear(f, unitId);
    const h = await launch({ sets: [], handlers: f.handlers });
    await page.goto("/learn/units/DE.A1.U04");
    await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
    await page.getByRole("link", { name: "Test out of this unit", exact: true }).click();
    await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
    for (const [n, item] of challengeForms["DE.A1.U04"].A.entries()) {
      await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Hint", exact: true })).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Show answer", exact: true })).toHaveCount(0);
      const answer =
        n < correct
          ? item.acceptedAnswers[0]
          : (item.options?.find((o) => !item.acceptedAnswers.includes(o)) ?? "wrong");
      if (item.options) await page.getByRole("radio", { name: answer, exact: true }).check();
      else await page.getByRole("textbox", { name: "Your answer", exact: true }).fill(answer);
      if (n < 7) await page.getByRole("button", { name: "Next task", exact: true }).click();
    }
    await page.getByRole("button", { name: "Submit challenge", exact: true }).click();
    if (correct === 6) {
      await expect(
        page.getByRole("heading", { name: "Cleared by challenge", exact: true }),
      ).toBeVisible();
      await page.getByRole("link", { name: "Study these lessons optionally", exact: true }).click();
      await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
      await expect(page.getByRole("link", { name: "Unit 4 Check", exact: true })).toHaveCount(0);
      await page.goto("/learn/DE.A1.U04.L01");
      await expect(
        page.getByRole("heading", { name: germanA1.lessons[12].steps[0].prompt, exact: true }),
      ).toBeVisible();
      await page.goto("/learn/units/DE.A1.U05");
      await expect(
        page.getByRole("heading", { name: "Town and services", exact: true }),
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: "Cleared by challenge", exact: true }),
      ).toHaveCount(0);
      await page.goto("/learn/units/DE.A1.U05");
      await expect(
        page.getByText("You're studying ahead of your recommended path.", { exact: true }),
      ).toBeVisible();
    }
    await shot(page, `challenge-${correct}-${info.project.name}`);
    await page.goto("/learn");
    await expect(page.getByRole("link", { name: "Open Unit 6", exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Open Checkpoint 1", exact: true })).toBeVisible();
    expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
    expect(h.serverFns.callsTo("finishUnitCheck")).toHaveLength(0);
    expect(
      [...f.storage.records.keys()].some(
        (p) => p.includes("/courseProgress/") || p.includes("/assessmentAttempts/"),
      ),
    ).toBe(false);
  });
test("Direct U4/U5 links allow exploration and U6 remains unauthored", async ({ page, launch }) => {
  await launch({ sets: [], handlers: courseProgressFixture().handlers });
  for (const unit of [4, 5]) {
    for (const path of [`/learn/units/DE.A1.U0${unit}`, `/learn/DE.A1.U0${unit}.L01`]) {
      await page.goto(path);
      await expect(
        page.getByText("You're studying ahead of your recommended path.", { exact: true }),
      ).toBeVisible();
    }
  }
  await page.goto("/learn/DE.A1.U06.L01");
  await expect(
    page.getByRole("heading", { name: "This lesson is not yet authored", exact: true }),
  ).toBeVisible();
});
