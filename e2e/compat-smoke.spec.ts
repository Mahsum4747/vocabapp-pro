import { expect, test } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { diagnoseLessonResponse } from "../src/lib/curriculum/lesson-diagnostics";

test("Karta home, grammar reference and lesson shell remain usable", async ({ page, launch }) => {
  await launch({ sets: [], handlers: courseProgressFixture().handlers });

  // Let route hydration and module requests settle before the next full navigation.
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Keep learning with Karta" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Grammar Reference/i })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.goto("/grammar/rules", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Grammar Reference" })).toBeVisible();
  const search = page.getByPlaceholder("Search rules by topic…");
  await search.fill("helfen");
  await expect(page.getByText("helfen + Dativ", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create personal AI note" })).toBeVisible();

  await page.goto("/learn/DE.A1.U01.L01", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: /You meet someone in a German course/i })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Ich bin Mira.", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    const bodyMinWidth = await page.evaluate(() => getComputedStyle(document.body).minWidth);
    expect(bodyMinWidth === "0px" || bodyMinWidth === "auto").toBe(true);
  }
});

test("current lesson saves a corrected answer, resumes and completes after a bounded diagnosis", async ({ page, launch }) => {
  test.setTimeout(60_000);
  const lessonIndex = 17;
  const lesson = germanA1.lessons[lessonIndex];
  const step = lesson.steps.at(-1)!;
  expect(step.id).toBe("U05.L02.check");
  const fixture = courseProgressFixture();
  await fixture.advanceLesson(lessonIndex, lesson.steps.length - 1);
  const diagnoses: ReturnType<typeof diagnoseLessonResponse>[] = [];
  const harness = await launch({
    sets: [],
    handlers: {
      ...fixture.handlers,
      recordLessonDiagnostic: async (input: unknown) => {
        const data = input as { lessonId: string; stepId: string; response: string };
        expect(data.lessonId).toBe(lesson.id);
        expect(data.stepId).toBe(step.id);
        const draft = diagnoseLessonResponse(lesson, step, data.response);
        diagnoses.push(draft);
        return { recorded: Boolean(draft) };
      },
    },
  });
  await page.goto(`/learn/${lesson.id}`);
  await expect(page.getByRole("heading", { name: step.prompt, exact: true })).toBeVisible();
  await page.locator("#lesson-answer").fill("Ich danke dich.");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.locator("#lesson-feedback")).toContainText("Not quite");
  await expect.poll(() => diagnoses.length).toBe(1);
  expect(diagnoses[0]?.targetLabel).toBe("danken + Dativ");
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await page.locator("#lesson-answer").fill("Ich danke dir.");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.locator("#lesson-feedback")).toContainText("That fits");
  await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator("#lesson-answer")).toHaveValue("Ich danke dir.");
  await expect(page.locator("#lesson-feedback")).toContainText("That fits");
  await page.getByRole("button", { name: "Finish lesson", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Lesson finished.", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Lesson finished.", exact: true })).toBeVisible();
  expect(harness.serverFns.callsTo("recordLessonDiagnostic")).toHaveLength(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
