import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect, test } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";
import { undersizedTargets } from "./support/touch";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { COURSE_SCOPE } from "../src/lib/curriculum/course-progress";
import { courseProgressPath } from "../src/lib/curriculum/course-progress.server";
import { USER_ID } from "./support/backend";
async function screenshot(page: Page, name: string) {
  mkdirSync("screenshots/phase1d", { recursive: true });
  await page.screenshot({ path: `screenshots/phase1d/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
for (const index of [2, 3]) {
  const lesson = germanA1.lessons[index];
  test(`${lesson.id} generic engine, grading, checked reload and durable completion`, async ({
    page,
    launch,
  }, info) => {
    test.setTimeout(90_000);
    if (info.project.name === "mobile") await page.setViewportSize({ width: 390, height: 844 });
    const fixture = courseProgressFixture();
    for (let other = 0; other < index; other++)
      await fixture.advanceLesson(other, germanA1.lessons[other].steps.length);
    const before = structuredClone([...fixture.storage.records.entries()]);
    const h = await launch({ sets: [], handlers: fixture.handlers });
    await page.goto(`/learn/${lesson.id}`);
    await expect(page.getByRole("heading", { name: lesson.title, exact: true })).toBeVisible();
    await screenshot(page, `l0${index + 1}-start-${info.project.name}`);
    let testedRetry = false;
    let testedReload = false;
    for (const [stepIndex, step] of lesson.steps.entries()) {
      const task = page.getByRole("heading", { name: step.prompt, exact: true });
      await expect(task).toBeVisible();
      if (stepIndex > 0) await expect(task).toBeFocused();
      if (step.kind !== "explanation") {
        const answer =
          step.kind === "choice"
            ? step.correctAnswer
            : step.kind === "text"
              ? step.acceptedAnswers[0]
              : "Ich bin PRIVATE_NAME. Das Büro ist klein.";
        const check = page.getByRole("button", {
          name: step.kind === "original" ? "Record response" : "Check",
          exact: true,
        });
        await expect(check).toBeDisabled();
        if (step.kind === "choice") {
          if (!testedRetry) {
            await page
              .getByRole("radio", {
                name: step.options.find((option) => option !== step.correctAnswer)!,
                exact: true,
              })
              .check();
            await check.click();
            await expect(page.getByRole("status")).toContainText("Try again");
            testedRetry = true;
          }
          await page.getByRole("radio", { name: answer, exact: true }).check();
        } else await page.getByLabel(step.inputLabel, { exact: true }).fill(answer);
        await expect(check).toBeEnabled();
        if (step.kind === "text")
          await page.getByLabel(step.inputLabel, { exact: true }).press("Enter");
        else await check.click();
        await expect(page.getByRole("status")).toContainText(
          step.kind === "original" ? "unassessed" : "That fits",
        );
        await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
        await expect(
          page.getByRole("button", {
            name: stepIndex === lesson.steps.length - 1 ? "Finish lesson" : "Continue",
            exact: true,
          }),
        ).toBeEnabled();
        if (!testedReload && step.stage === "read") {
          await screenshot(page, `l0${index + 1}-read-${info.project.name}`);
          await page.reload();
          await expect(
            page.getByLabel(step.kind === "text" ? step.inputLabel : "", { exact: true }),
          ).toHaveValue(answer);
          await expect(page.getByRole("status")).toContainText("That fits");
          await screenshot(page, `l0${index + 1}-resumed-${info.project.name}`);
          testedReload = true;
        }
        if (step.kind === "original") {
          const command = h.serverFns.callsTo("acknowledgeCourseProgress").at(-1)!.data;
          expect(JSON.stringify(command)).not.toContain("PRIVATE_NAME");
          expect(command).toMatchObject({ action: { type: "check" } });
          expect((command as { action: object }).action).not.toHaveProperty("response");
          await page.reload();
          await expect(page.getByLabel(step.inputLabel, { exact: true })).toHaveValue("");
          await expect(page.getByRole("status")).toContainText("open writing was not stored");
        }
        if (step.id.endsWith("form-name")) await screenshot(page, `l04-form-${info.project.name}`);
      }
      const advance = page.getByRole("button", {
        name: stepIndex === lesson.steps.length - 1 ? "Finish lesson" : "Continue",
        exact: true,
      });
      await expect(advance).toBeEnabled();
      if (info.project.name === "mobile") expect(await undersizedTargets(page)).toEqual([]);
      await advance.press("Enter");
    }
    await expect(page.getByRole("heading", { name: "Lesson finished." })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Lesson finished." })).toBeVisible();
    await screenshot(page, `l0${index + 1}-finished-${info.project.name}`);
    for (const [path, record] of before) expect(fixture.storage.records.get(path)).toEqual(record);
    await page.getByRole("link", { name: `Return to Unit 1`, exact: true }).click();
    await expect(page.locator("main ol").getByText("Finished", { exact: true })).toHaveCount(
      index + 1,
    );
    if (index === 3) {
      await expect(page.getByText("Unit lessons complete", { exact: true })).toBeVisible();
      await expect(page.getByText(/Unit 2 is not yet available/)).toBeVisible();
      await screenshot(page, `unit-all-finished-${info.project.name}`);
      await page.getByRole("link", { name: "Learn overview", exact: true }).click();
      await expect(page.getByRole("link", { name: "Revisit Unit 1", exact: true })).toBeVisible();
      await screenshot(page, `overview-finished-${info.project.name}`);
      await page.getByRole("link", { name: "Revisit Unit 1", exact: true }).click();
      await page
        .locator("main ol")
        .getByRole("link", { name: /Give basic information/ })
        .click();
      await page.getByRole("button", { name: "Practice lesson again" }).click();
      await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
      await page.reload();
      await expect(page.getByText("Lesson 4 · Step 1 of 11", { exact: true })).toBeVisible();
      await page.getByRole("link", { name: "Unit 1", exact: true }).click();
      await expect(page.getByText("Unit lessons complete", { exact: true })).toBeVisible();
      await expect(page.getByText("Finished · Practicing again", { exact: true })).toBeVisible();
      await page.getByRole("link", { name: "Learn overview", exact: true }).click();
      await expect(page.getByText("Unit 1 lessons complete", { exact: true })).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Continue practice", exact: true }),
      ).toBeVisible();
    } else {
      await expect(page.getByText("3 of 4 lessons finished", { exact: true })).toBeVisible();
      await expect(page.getByText("Unit lessons complete", { exact: true })).toHaveCount(0);
      await expect(
        page.getByRole("link", { name: "Next lesson: Give basic information", exact: true }),
      ).toBeVisible();
    }
    expect(
      fixture.storage.writes.every((path) => path.startsWith(`users/${USER_ID}/courseProgress/`)),
    ).toBe(true);
    expect(
      h.serverFns.calls.every((call) =>
        ["getCourseProgress", "acknowledgeCourseProgress", "getLatestUnitCheck"].includes(
          call.name,
        ),
      ),
    ).toBe(true);
    expect(JSON.stringify([...fixture.storage.records.values()])).not.toContain("PRIVATE_NAME");
  });
}
test("overview and mixed unit show all four authored lessons, nine unavailable units and next unfinished", async ({
  page,
  launch,
}, info) => {
  if (info.project.name === "mobile") await page.setViewportSize({ width: 390, height: 844 });
  const fixture = courseProgressFixture();
  await fixture.advanceLesson(0, germanA1.lessons[0].steps.length);
  await fixture.advanceLesson(1, germanA1.lessons[1].steps.length);
  await fixture.advanceLesson(2, 1);
  await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn");
  await expect(page.locator("main ol > li")).toHaveCount(10);
  await expect(page.getByText("4 lessons planned · Not yet authored", { exact: true })).toHaveCount(
    9,
  );
  await expect(page.getByText("4 lessons available · In progress", { exact: true })).toBeVisible();
  await screenshot(page, `overview-${info.project.name}`);
  await page.getByRole("link", { name: "Continue lesson", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Ask for personal details", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Unit 1", exact: true }).click();
  await expect(page.locator("main ol > li a")).toHaveCount(4);
  await expect(page.getByText("2 of 4 lessons finished", { exact: true })).toBeVisible();
  await screenshot(page, `unit-mixed-${info.project.name}`);
  const path = courseProgressPath(USER_ID, { ...COURSE_SCOPE, lessonId: germanA1.lessons[3].id });
  expect(fixture.storage.records.has(path)).toBe(false);
  await page.goto("/learn/units/DE.A1.U02");
  await expect(page.locator("main ol").getByText("Not yet authored", { exact: true })).toHaveCount(
    4,
  );
  await expect(page.locator("main ol > li a")).toHaveCount(0);
});
test("dark 320px Unit 1 and both new reading/form lessons remain usable", async ({
  page,
  launch,
}, info) => {
  const fixture = courseProgressFixture();
  await fixture.advanceLesson(2, 5);
  await fixture.advanceLesson(3, 6);
  await launch({ sets: [], handlers: fixture.handlers });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  for (const [path, name] of [
    ["/learn/units/DE.A1.U01", "unit"],
    ["/learn/DE.A1.U01.L03", "l03"],
    ["/learn/DE.A1.U01.L04", "l04"],
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Reading saved progress…")).toHaveCount(0);
    await screenshot(page, `dark-320-${name}-${info.project.name}`);
    expect(await undersizedTargets(page)).toEqual([]);
  }
});
