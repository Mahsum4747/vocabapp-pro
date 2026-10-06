import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect, test } from "./support/app";
import { assessmentFixture } from "./support/assessment";
import { courseProgressFixture } from "./support/course-progress";
import { challengeFixture } from "./support/challenge";
import { undersizedTargets } from "./support/touch";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { unit3Check as A, unit3CheckB as B } from "../src/content/curriculum/german-a1-unit3-check";
import { challengeForms } from "../src/content/curriculum/german-a1-challenges.server";
import { startChallenge, submitChallenge } from "../src/lib/curriculum/challenge.server";
import { COURSE_SCOPE } from "../src/lib/curriculum/course-progress";
import { USER_ID, NOW } from "./support/backend";
import type { AssessmentDefinition } from "../src/lib/curriculum/assessment";
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/unit3", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `screenshots/unit3/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function prior(f: ReturnType<typeof courseProgressFixture>) {
  for (let i = 0; i < 8; i++) await f.advanceLesson(i, germanA1.lessons[i].steps.length);
}
async function fillCheck(page: Page, form: AssessmentDefinition) {
  for (const [index, item] of form.items.entries()) {
    await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
    const answer = item.acceptedAnswers[0].replaceAll("ü", "ue");
    if (item.options) await page.getByRole("radio", { name: answer, exact: true }).check();
    else await page.getByLabel("Your response", { exact: true }).fill(answer);
    if (index < 7) await page.getByRole("button", { name: "Next item", exact: true }).click();
  }
}
async function submitCheck(page: Page) {
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
  ).toBeVisible();
}
test("Unit 3 overview, complete shopping lesson and durable reload", async ({
  page,
  launch,
  isMobile,
}, info) => {
  test.setTimeout(90_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = courseProgressFixture();
  await prior(f);
  const harness = await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn");
  await expect(page.getByRole("link", { name: "Open Unit 3", exact: true })).toBeVisible();
  await shot(page, `overview-${info.project.name}`);
  await page.getByRole("link", { name: "Open Unit 3", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Shopping and objects", exact: true }),
  ).toBeVisible();
  await expect(page.locator("main ol > li a")).toHaveCount(4);
  await expect(page.getByRole("link", { name: "Unit 3 Check", exact: true })).toHaveCount(0);
  await shot(page, `unit-before-${info.project.name}`);
  const lesson = germanA1.lessons[8];
  await page
    .locator("main ol")
    .getByRole("link", { name: /Shopping: identify what is needed/ })
    .click();
  let reloaded = false;
  for (const [index, step] of lesson.steps.entries()) {
    await expect(page.getByRole("heading", { name: step.prompt, exact: true })).toBeVisible();
    if (step.kind !== "explanation") {
      if (step.kind === "choice")
        await page.getByRole("radio", { name: step.correctAnswer, exact: true }).check();
      else if (step.kind === "text")
        await page.getByLabel(step.inputLabel, { exact: true }).fill(step.acceptedAnswers[0]);
      await page.getByRole("button", { name: "Check", exact: true }).click();
      await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
      await expect(page.getByRole("status")).toContainText("That fits");
      if (!reloaded && step.kind === "text") {
        await page.reload();
        await expect(page.getByLabel(step.inputLabel, { exact: true })).toHaveValue(
          step.acceptedAnswers[0],
        );
        reloaded = true;
        await shot(page, `lesson-resumed-${info.project.name}`);
      }
    }
    await page
      .getByRole("button", {
        name: index === lesson.steps.length - 1 ? "Finish lesson" : "Continue",
        exact: true,
      })
      .click();
  }
  await expect(page.getByRole("heading", { name: "Lesson finished.", exact: true })).toBeVisible();
  await page.goto("/learn/units/DE.A1.U03");
  await expect(page.getByText("1 of 4 lessons finished")).toBeVisible();
  expect(harness.serverFns.callsTo("finishUnitCheck")).toHaveLength(0);
  expect(f.storage.writes.every((path) => path.includes("/courseProgress/"))).toBe(true);
});
test("Unit 3 German helper, fallback, hint and show-answer recovery at 390px and dark 320px", async ({
  page,
  launch,
  isMobile,
}, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = courseProgressFixture();
  await prior(f);
  const lesson = germanA1.lessons[11];
  await f.advanceLesson(
    11,
    lesson.steps.findIndex((step) => step.id.endsWith(".gern")),
  );
  const h = await launch({ sets: [], handlers: f.handlers });
  await page.goto(`/learn/${lesson.id}`);
  const adverb = page.getByLabel("Adverb", { exact: true });
  await expect(adverb).toBeVisible();
  await adverb.fill("Ich kaufe gern Buecher.");
  await adverb.press("Enter");
  await expect(page.getByRole("status")).toContainText("That fits");
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  await shot(page, `fallback-${info.project.name}`);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("radio", { name: "Costs", exact: true }).check();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const intensity = page.getByLabel("Adverb", { exact: true });
  await intensity.fill("x");
  await intensity.evaluate((el: HTMLInputElement) => el.setSelectionRange(0, 1));
  await page.getByRole("button", { name: "Insert ü", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(intensity).toHaveValue("ü");
  await expect(intensity).toBeFocused();
  await shot(page, `helper-${info.project.name}`);
  for (let count = 1; count <= 3; count++) {
    await intensity.fill(`wrong${count}`);
    await intensity.press("Enter");
    await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
    await expect(page.getByRole("status")).toContainText("Try again");
    if (count === 2) {
      await page.getByRole("button", { name: "Hint", exact: true }).click();
      await shot(page, `hint-${info.project.name}`);
    }
  }
  const writes = h.serverFns.callsTo("acknowledgeCourseProgress").length;
  await page.getByRole("button", { name: "Show answer", exact: true }).click();
  await expect(page.getByText("Answer: sehr", { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("not a correct answer");
  expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(writes);
  await shot(page, `shown-${info.project.name}`);
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
  await shot(page, `dark-320-${info.project.name}`);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Description sentence", { exact: true })).toBeVisible();
});
test("all-four Unit 3 completion enables Check A/B and exact own-form review; no Unit 4 or CP1", async ({
  page,
  launch,
  isMobile,
}, info) => {
  test.setTimeout(120_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = await assessmentFixture(false, 3);
  await prior(f.course);
  for (let index = 8; index < 12; index++)
    await f.course.advanceLesson(index, germanA1.lessons[index].steps.length);
  const before = structuredClone([...f.storage.records.entries()]);
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn/units/DE.A1.U03");
  await expect(
    page.getByText("4 of 4 lessons finished. This lesson sequence is finished."),
  ).toBeVisible();
  await shot(page, `all-complete-${info.project.name}`);
  await page.getByRole("link", { name: "Unit 3 Check", exact: true }).click();
  await page.getByRole("button", { name: "Start Unit 3 Check", exact: true }).click();
  await expect(page.getByText("Form A · First observation", { exact: true })).toBeVisible();
  const aUrl = page.url();
  await shot(page, `check-a-${info.project.name}`);
  await fillCheck(page, A);
  await submitCheck(page);
  await expect(page.getByText("Demonstrated in one observation", { exact: true })).toHaveCount(8);
  await shot(page, `result-a-${info.project.name}`);
  await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
  await expect(page.getByText("Form B · Alternate form", { exact: true })).toBeVisible();
  const bUrl = page.url();
  await fillCheck(page, B);
  await submitCheck(page);
  await expect(page.getByText("Confirmed in an alternate form", { exact: true })).toHaveCount(8);
  await shot(page, `result-b-${info.project.name}`);
  for (const [url, form, label] of [
    [aUrl, A, "Form A"],
    [bUrl, B, "Form B"],
  ] as const) {
    await page.goto(url);
    await expect(
      page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
    ).toBeVisible();
    await page.getByText("Review item results", { exact: true }).click();
    await expect(
      page.getByText(`${label} · This saved attempt only`, { exact: true }),
    ).toBeVisible();
    for (const item of form.items)
      await expect(page.locator("details").getByText(item.prompt, { exact: true })).toBeVisible();
    const other = form === A ? B : A;
    await expect(
      page.locator("details").getByText(other.items[0].prompt, { exact: true }),
    ).toHaveCount(0);
    await shot(page, `exact-${label}-${info.project.name}`);
  }
  for (const [path, value] of before) expect(f.storage.records.get(path)).toEqual(value);
  await page.goto("/learn");
  await expect(page.getByRole("link", { name: "Open Unit 4", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /CP1|Checkpoint/ })).toHaveCount(0);
});
test("Unit 3 access requires own Unit 2 completion or valid challenge; challenged lessons remain untouched", async ({
  page,
  launch,
  isMobile,
}, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = challengeFixture();
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn/units/DE.A1.U03");
  await expect(
    page.getByRole("heading", { name: "Continue with Unit 2 first", exact: true }),
  ).toBeVisible();
  await page.goto("/learn/DE.A1.U03.L01");
  await expect(
    page.getByRole("heading", { name: "Continue with Unit 2 first", exact: true }),
  ).toBeVisible();
  for (const unitId of ["DE.A1.U01", "DE.A1.U02"]) {
    const req = { ...COURSE_SCOPE, unitId, attemptId: crypto.randomUUID() };
    await startChallenge(f.storage.db, USER_ID, req, NOW);
    await submitChallenge(
      f.storage.db,
      USER_ID,
      {
        ...req,
        responses: challengeForms[unitId].A.map((item) => ({
          itemId: item.id,
          response: item.acceptedAnswers[0],
        })),
      },
      NOW,
    );
  }
  await page.goto("/learn");
  await expect(page.getByRole("link", { name: "Start lesson", exact: true })).toHaveAttribute(
    "href",
    "/learn/DE.A1.U03.L01",
  );
  await page.getByRole("link", { name: "Open Unit 3", exact: true }).click();
  await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
  await shot(page, `challenge-unlocked-${info.project.name}`);
  await page.getByRole("link", { name: /Next lesson: Shopping/ }).click();
  await expect(
    page.getByRole("heading", { name: germanA1.lessons[8].steps[0].prompt, exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  await page.goto("/learn/units/DE.A1.U02");
  await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Cleared by challenge", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Unit 2 Check", exact: true })).toHaveCount(0);
  expect(
    [...f.storage.records.keys()]
      .filter((path) => path.includes("/courseProgress/"))
      .every((path) => path.includes("U03")),
  ).toBe(true);
  expect([...f.storage.records.keys()].some((path) => path.includes("/assessmentAttempts/"))).toBe(
    false,
  );
});
