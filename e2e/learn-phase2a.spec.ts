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
  mkdirSync("screenshots/phase2a", { recursive: true });
  await page.screenshot({ path: `screenshots/phase2a/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
for (const index of [4, 5, 6, 7]) {
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
    await screenshot(page, `l0${index - 3}-start-${info.project.name}`);
    let testedRetry = false;
    let testedReload = false;
    for (const [stepIndex, step] of lesson.steps.entries()) {
      const task = page.getByRole("heading", { name: step.prompt, exact: true });
      await expect(task).toBeVisible();
      if (step.stage === "read" || step.id.endsWith(".revise"))
        await screenshot(page, `l0${index - 3}-${step.stage}-before-${info.project.name}`);
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
        if (!testedReload && step.kind === "text") {
          await screenshot(page, `l0${index - 3}-read-${info.project.name}`);
          await page.reload();
          await expect(
            page.getByLabel(step.kind === "text" ? step.inputLabel : "", { exact: true }),
          ).toHaveValue(answer);
          await expect(page.getByRole("status")).toContainText("That fits");
          await screenshot(page, `l0${index - 3}-resumed-${info.project.name}`);
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
        if (step.id.endsWith(".revise") || step.id.endsWith(".contrast"))
          await screenshot(page, `l0${index - 3}-task-${info.project.name}`);
      }
      const advance = page.getByRole("button", {
        name: stepIndex === lesson.steps.length - 1 ? "Finish lesson" : "Continue",
        exact: true,
      });
      await expect(advance).toBeEnabled();
      await advance.scrollIntoViewIfNeeded();
      const bounds = await advance.boundingBox();
      // Scrolling is rounded to device pixels; compare whole CSS pixels.
      expect(Math.round(bounds!.y + bounds!.height)).toBeLessThanOrEqual(
        page.viewportSize()!.height,
      );
      if (info.project.name === "mobile") expect(await undersizedTargets(page)).toEqual([]);
      await advance.press("Enter");
    }
    await expect(page.getByRole("heading", { name: "Lesson finished." })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Lesson finished." })).toBeVisible();
    await screenshot(page, `l0${index - 3}-finished-${info.project.name}`);
    for (const [path, record] of before) expect(fixture.storage.records.get(path)).toEqual(record);
    await page.getByRole("link", { name: `Return to Unit 2`, exact: true }).click();
    await expect(page.locator("main ol").getByText("Finished", { exact: true })).toHaveCount(
      index - 3,
    );
    await screenshot(page, `unit-after-l0${index - 3}-${info.project.name}`);
    expect(
      fixture.storage.writes.every((path) => path.startsWith(`users/${USER_ID}/courseProgress/`)),
    ).toBe(true);
    expect(JSON.stringify([...fixture.storage.records.values()])).not.toContain("PRIVATE_NAME");
    const beforeRestart = structuredClone([...fixture.storage.records.entries()]);
    await page.goto(`/learn/${lesson.id}`);
    await page.getByRole("button", { name: "Practice lesson again" }).click();
    await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: lesson.steps[0].prompt, exact: true }),
    ).toBeVisible();
    await screenshot(page, `l0${index - 3}-restart-${info.project.name}`);
    await page.getByRole("link", { name: "Unit 2", exact: true }).click();
    await expect(page.getByText("Finished · Practicing again", { exact: true })).toBeVisible();
    for (const [path, record] of beforeRestart)
      if (path !== courseProgressPath(USER_ID, { ...COURSE_SCOPE, lessonId: lesson.id }))
        expect(fixture.storage.records.get(path)).toEqual(record);
    if (index === 7)
      await expect(page.getByText("Unit lessons complete", { exact: true })).toBeVisible();
    expect(
      h.serverFns.calls.every((call) =>
        ["getCourseProgress", "acknowledgeCourseProgress", "getLatestUnitCheck"].includes(
          call.name,
        ),
      ),
    ).toBe(true);
  });
}

test("Unit 1 traversal selects Unit 2 without assessment; fresh/mixed/complete states remain separate", async ({
  page,
  launch,
}, info) => {
  const fixture = courseProgressFixture();
  for (let i = 0; i < 4; i++) await fixture.advanceLesson(i, germanA1.lessons[i].steps.length);
  const before = structuredClone([...fixture.storage.records.entries()]);
  await launch({ sets: [], handlers: fixture.handlers });
  if (info.project.name === "mobile") await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn");
  await expect(page.getByText("4 lessons planned · Not yet authored", { exact: true })).toHaveCount(
    8,
  );
  await expect(page.getByText("Everyday actions and routine", { exact: true })).toBeVisible();
  await screenshot(page, `overview-unit2-next-${info.project.name}`);
  await page.getByRole("link", { name: "Open Unit 2", exact: true }).click();
  await expect(page.getByText("Not started", { exact: true })).toBeVisible();
  await expect(page.locator("main ol > li a")).toHaveCount(4);
  await expect(page.getByRole("link", { name: /Start Unit 2 Check/ })).toHaveCount(0);
  await screenshot(page, `unit-fresh-${info.project.name}`);
  await fixture.advanceLesson(4, germanA1.lessons[4].steps.length);
  await fixture.advanceLesson(5, 1);
  await page.reload();
  await expect(page.getByText("1 of 4 lessons finished", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Next lesson: People, belongings and plurals", exact: true }),
  ).toBeVisible();
  await screenshot(page, `unit-mixed-${info.project.name}`);
  await page.goto("/learn");
  await page.getByRole("link", { name: "Continue lesson", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: germanA1.lessons[5].steps[1].prompt, exact: true }),
  ).toBeVisible();
  for (let i = 5; i < 8; i++) await fixture.advanceLesson(i, germanA1.lessons[i].steps.length);
  await page.goto("/learn/units/DE.A1.U02");
  await expect(page.getByText("Unit lessons complete", { exact: true })).toBeVisible();
  await expect(
    page.getByText("4 of 4 lessons finished. This lesson sequence is finished.", { exact: true }),
  ).toBeVisible();
  await screenshot(page, `unit-complete-${info.project.name}`);
  await page.goto("/learn");
  await expect(page.getByRole("link", { name: "Revisit Unit 2", exact: true })).toBeVisible();
  await screenshot(page, `overview-complete-${info.project.name}`);
  for (const [path, record] of before) expect(fixture.storage.records.get(path)).toEqual(record);
  expect(fixture.storage.records.size).toBe(8);
});

test("dark 320px Unit 2, agreement and negation controls fit and remain accessible", async ({
  page,
  launch,
}, info) => {
  const fixture = courseProgressFixture();
  await fixture.advanceLesson(4, 2);
  await fixture.advanceLesson(6, 3);
  await launch({ sets: [], handlers: fixture.handlers });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("karta-theme", "dark"));
  for (const [url, name] of [
    ["/learn/units/DE.A1.U02", "unit-dark320"],
    ["/learn/DE.A1.U02.L01", "l01-dark320"],
    ["/learn/DE.A1.U02.L03", "l03-dark320"],
  ]) {
    await page.goto(url);
    await expect(page.locator("main h1")).toBeVisible();
    expect(await undersizedTargets(page)).toEqual([]);
    await screenshot(page, `${name}-${info.project.name}`);
  }
});
