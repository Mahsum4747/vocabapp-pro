import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect } from "./support/app";
import { assessmentFixture } from "./support/assessment";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { cp3Forms } from "../src/content/curriculum/german-a1-cp3";
import { assessmentRegistry } from "../src/lib/curriculum/assessment-registry";
import {
  createAssessmentAttempt,
  submitAssessmentAttempt,
} from "../src/lib/curriculum/assessment.server";
import { CP3_ID } from "../src/lib/curriculum/checkpoint-identity";
import { CP3_DELAY_MS } from "../src/lib/curriculum/checkpoint3";
import type { AssessmentDefinition } from "../src/lib/curriculum/assessment";
import { USER_ID, NOW, DAY } from "./support/backend";
import { undersizedTargets } from "./support/touch";
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/batch-d", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `screenshots/batch-d/portfolio-${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if ((page.viewportSize()?.width ?? 1280) < 768) expect(await undersizedTargets(page)).toEqual([]);
}
async function fixture(all = true) {
  const f = await assessmentFixture(false, 10);
  for (let n = all ? 0 : 36; n < 40; n++)
    await f.course.advanceLesson(n, germanA1.lessons[n].steps.length);
  async function record(form: AssessmentDefinition, start: number, wrong = false) {
    const req = { assessmentId: form.id, compatibilityVersion: 1, attemptId: randomUUID() };
    const draft = await createAssessmentAttempt(f.storage.db, USER_ID, req, start);
    expect(draft.formId).toBe(form.formId);
    const { attempt } = await submitAssessmentAttempt(
      f.storage.db,
      USER_ID,
      {
        ...req,
        responses: form.items.map((i) => ({
          itemId: i.id,
          response: wrong && i.targetId === "CP3.message" ? "wrong" : i.acceptedAnswers[0],
        })),
      },
      start + 1,
    );
    return attempt;
  }
  if (all)
    for (const r of assessmentRegistry.filter((r) => r.definition.id !== CP3_ID))
      await record(r.forms[0], NOW - 3 * DAY);
  return {
    ...f,
    record,
    handlers: {
      ...f.handlers,
      startUnitCheck: (input: unknown) =>
        createAssessmentAttempt(f.storage.db, USER_ID, input, NOW),
      finishUnitCheck: (input: unknown) =>
        submitAssessmentAttempt(f.storage.db, USER_ID, input, NOW),
    },
  };
}
async function answerSitting(page: Page, form: AssessmentDefinition) {
  for (const [n, i] of form.items.entries()) {
    await expect(page.getByRole("heading", { name: i.prompt, exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Hint$|^Show answer$/ })).toHaveCount(0);
    await expect(page.getByText(/Accepted response:/)).toHaveCount(0);
    if (i.options)
      await page.getByRole("radio", { name: i.acceptedAnswers[0], exact: true }).check();
    else await page.getByRole("textbox").fill(i.acceptedAnswers[0].replaceAll("ü", "ue"));
    if (n < 13) await page.getByRole("button", { name: "Next task", exact: true }).click();
  }
  await page.getByRole("button", { name: "Submit checkpoint", exact: true }).click();
  await expect(page.getByText(/Sitting [AB] saved: 14 \/ 14 correct/)).toBeVisible();
}
test("CP3 Sitting A then B: independent matrix, truthful same-session delayed follow-up", async ({
  page,
  launch,
  isMobile,
}, info) => {
  test.setTimeout(150_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = await fixture(false);
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn/units/DE.A1.U10");
  await page.getByRole("link", { name: "Open Checkpoint 3", exact: true }).click();
  await expect(page.getByText(/Sitting A and Sitting B each have 14 tasks/)).toBeVisible();
  await page.getByRole("button", { name: "Start Checkpoint 3", exact: true }).click();
  await answerSitting(page, cp3Forms[0]);
  await expect(page.getByText(/CP3 sitting still needed: B/)).toBeVisible();
  expect(
    await page
      .getByRole("list", { name: "Essential text outcomes" })
      .getByText("Insufficient evidence", { exact: true })
      .count(),
  ).toBe(7);
  await page.getByRole("button", { name: "Try Checkpoint 3 again", exact: true }).click();
  await answerSitting(page, cp3Forms[1]);
  await expect(page.getByText(/Delayed follow-up pending/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "A1 text-learning path still in progress", exact: true }),
  ).toBeVisible();
  expect(
    await page
      .getByRole("list", { name: "Essential text outcomes" })
      .getByText("Demonstrated", { exact: true })
      .count(),
  ).toBe(7);
  await page.getByText("Review checkpoint tasks", { exact: true }).click();
  await expect(page.getByText(cp3Forms[1].items[8].prompt, { exact: true })).toBeVisible();
  await expect(page.getByText(/The portfolio combines accepted observations/)).toBeVisible();
  await shot(page, `sittings-${info.project.name}`);
  await page.reload();
  await expect(page.getByText(/Delayed follow-up pending/)).toBeVisible();
  expect([...f.storage.records.keys()].filter((p) => p.includes("assessmentAttempts")).length).toBe(
    2,
  );
});
for (const gap of [false, true])
  test(`CP3 final projection: ${gap ? "essential writing gap blocks completion" : "fully satisfied delayed portfolio is complete"}`, async ({
    page,
    launch,
    isMobile,
  }, info) => {
    test.setTimeout(120_000);
    if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
    const f = await fixture();
    await f.record(cp3Forms[0], NOW - 2 * DAY);
    const b = await f.record(cp3Forms[1], NOW - DAY + 10, gap);
    const before = structuredClone([...f.storage.records]);
    const writes = f.storage.writes.length;
    await launch({ sets: [], handlers: f.handlers });
    await page.goto(`/learn/check?assessment=${CP3_ID}&attempt=${b.attemptId}`);
    await expect(
      page.getByRole("heading", {
        name: gap ? "A1 text-learning path still in progress" : "A1 text-learning path complete",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Delayed follow-up recorded in an alternate sitting.", { exact: true }),
    ).toBeVisible();
    if (gap) {
      const row = page
        .getByRole("list", { name: "Essential text outcomes" })
        .getByRole("listitem")
        .filter({ hasText: "A practical message with necessary points" });
      await expect(row.getByText("Follow-up needed", { exact: true })).toBeVisible();
      await expect(
        row.getByRole("link", { name: "A form and a message", exact: true }),
      ).toBeVisible();
      await page.emulateMedia({ colorScheme: "dark" });
      await page.setViewportSize({ width: 320, height: 844 });
    }
    await shot(page, `${gap ? "gap-dark320" : "complete"}-${info.project.name}`);
    await expect(
      page.getByText(
        /You mastered A1|You are A1 certified|You passed CEFR A1|Full German proficiency/,
      ),
    ).toHaveCount(0);
    await page.goto("/learn");
    for (let u = 1; u <= 10; u++)
      await expect(page.getByRole("link", { name: `Open Unit ${u}`, exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open Unit 11", exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Open Checkpoint 3", exact: true })).toBeVisible();
    expect(f.storage.writes.length).toBe(writes);
    expect([...f.storage.records]).toEqual(before);
    expect(NOW - DAY + 10 - (NOW - 2 * DAY + 1)).toBeGreaterThanOrEqual(CP3_DELAY_MS);
  });
