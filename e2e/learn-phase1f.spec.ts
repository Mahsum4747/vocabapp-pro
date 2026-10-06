import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect, test } from "./support/app";
import { assessmentFixture } from "./support/assessment";
import { unit1Check as A, unit1CheckB as B } from "../src/content/curriculum/german-a1-unit1-check";
import type { AssessmentDefinition } from "../src/lib/curriculum/assessment";
import {
  ASSESSMENT_REQUEST,
  createAssessmentAttempt,
  submitAssessmentAttempt,
} from "../src/lib/curriculum/assessment.server";
import { USER_ID } from "./support/backend";
import { undersizedTargets } from "./support/touch";
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/phase1f", { recursive: true });
  await page.screenshot({ path: `screenshots/phase1f/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function fill(page: Page, form: AssessmentDefinition, wrong: number[] = []) {
  for (let i = 0; i < 8; i++) {
    const item = form.items[i];
    await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
    const value = wrong.includes(i)
      ? (item.options?.find((o) => !item.acceptedAnswers.includes(o)) ?? "wrong")
      : item.acceptedAnswers[0];
    if (item.options) await page.getByRole("radio", { name: value, exact: true }).check();
    else
      await page
        .getByLabel(item.type === "supported-field" ? "Name" : "Your response", { exact: true })
        .fill(value);
    if (i < 7) await page.getByRole("button", { name: "Next item", exact: true }).click();
  }
}
async function submit(page: Page, correct = 8) {
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: `Unit check: ${correct} / 8 correct`, exact: true }),
  ).toBeVisible();
}
test("A → alternate B → repeat A, combined evidence and exact old-form review", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(120_000);
  if (info.project.name === "mobile") await page.setViewportSize({ width: 390, height: 844 });
  const fixture = await assessmentFixture();
  await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn/units/DE.A1.U01");
  await expect(page.getByRole("link", { name: "Unit 1 Check", exact: true })).toBeVisible();
  await shot(page, `unit-before-${info.project.name}`);
  await page.getByRole("link", { name: "Unit 1 Check", exact: true }).click();
  await page.getByRole("button", { name: "Start Unit 1 Check", exact: true }).click();
  await expect(page.getByText("Form A · First observation", { exact: true })).toBeVisible();
  const aUrl = page.url();
  await shot(page, `form-a-${info.project.name}`);
  await fill(page, A);
  await submit(page);
  await expect(page.getByText("Demonstrated in one observation", { exact: true })).toHaveCount(6);
  await shot(page, `result-a-${info.project.name}`);
  await page.getByRole("link", { name: "← Unit 1", exact: true }).click();
  await expect(page.getByText("Form A · Saved attempt", { exact: true })).toBeVisible();
  await shot(page, `unit-after-a-${info.project.name}`);
  await page.getByRole("link", { name: "Review Unit 1 Check", exact: true }).click();
  await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
  await expect(page.getByText("Form B · Alternate form", { exact: true })).toBeVisible();
  expect(page.url()).not.toBe(aUrl);
  await shot(page, `form-b-${info.project.name}`);
  await page.getByRole("radio", { name: B.items[0].acceptedAnswers[0], exact: true }).check();
  if (info.project.name === "mobile") {
    const nextButton = page.getByRole("button", { name: "Next item", exact: true });
    await nextButton.scrollIntoViewIfNeeded();
    const bounds = await nextButton.boundingBox();
    expect(bounds!.y + bounds!.height).toBeLessThan(844 - 56);
    await page.screenshot({ path: "screenshots/phase1f/form-b-action-viewport-mobile.png" });
  }
  await page.getByRole("button", { name: "Next item", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.reload();
  await expect(page.getByText("Form B · Alternate form", { exact: true })).toBeVisible();
  await expect(page.getByText("Item 1 of 8 · 0 answered", { exact: true })).toBeVisible();
  await fill(page, B);
  await submit(page);
  await expect(page.getByText("Additional independent observation", { exact: true })).toBeVisible();
  await expect(page.getByText("Confirmed in an alternate form", { exact: true })).toHaveCount(6);
  await shot(page, `combined-b-${info.project.name}`);
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText("Form B · This saved attempt only", { exact: true })).toBeVisible();
  await expect(page.getByText(B.items[1].prompt, { exact: true })).toBeVisible();
  await shot(page, `review-b-${info.project.name}`);
  await page.getByRole("button", { name: "Repeat a check form", exact: true }).click();
  await expect(page.getByText("Form A · Repeated observation", { exact: true })).toBeVisible();
  await fill(page, A);
  await submit(page);
  await expect(page.getByText("Repeated observation", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Includes repeated observation; no additional independent form.", {
      exact: true,
    }),
  ).toHaveCount(1);
  await shot(page, `repeat-a-${info.project.name}`);
  await page.goto(aUrl);
  await expect(
    page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("First observation", { exact: true })).toBeVisible();
  await expect(page.getByText("Confirmed in an alternate form", { exact: true })).toHaveCount(6);
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText(A.items[0].stimulus!, { exact: true })).toBeVisible();
  await expect(page.getByText(B.items[0].prompt, { exact: true })).toHaveCount(0);
  await shot(page, `old-a-review-${info.project.name}`);
  expect(
    [...fixture.storage.records.values()].filter(
      (r) => (r as { assessmentId?: string }).assessmentId === A.id,
    ),
  ).toHaveLength(3);
});
test("B conflict stays cautious, dark 320px, failure/retry and lost acknowledgement recover the exact form", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(120_000);
  const fixture = await assessmentFixture();
  await launch({ sets: [], handlers: fixture.handlers });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/learn/check");
  await page.getByRole("button", { name: "Start Unit 1 Check", exact: true }).click();
  await fill(page, A);
  await submit(page);
  fixture.loseNextStartAck();
  await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Your result is saved");
  await page.getByRole("button", { name: "Retry retake", exact: true }).dblclick();
  await expect(page.getByText("Form B · Alternate form", { exact: true })).toBeVisible();
  await shot(page, `dark-320-b-${info.project.name}`);
  expect(await undersizedTargets(page)).toEqual([]);
  await fill(page, B, [3, 5]);
  fixture.loseNextAck();
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("could not be confirmed");
  await page.getByRole("button", { name: "Retry submission", exact: true }).dblclick();
  await expect(
    page.getByRole("heading", { name: "Unit check: 6 / 8 correct", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Needs more evidence", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Confirmed in an alternate form", { exact: true })).toHaveCount(4);
  await shot(page, `dark-320-conflict-${info.project.name}`);
  expect(await undersizedTargets(page)).toEqual([]);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Unit check: 6 / 8 correct", exact: true }),
  ).toBeVisible();
  expect(fixture.storage.writes.filter((p) => p.includes("/assessmentAttempts/"))).toHaveLength(4);
});
test("concurrent A drafts remain same-family repeats, never alternate confirmation", async ({
  page,
  launch,
}, info) => {
  const fixture = await assessmentFixture();
  const ids = [crypto.randomUUID(), crypto.randomUUID()];
  for (const attemptId of ids)
    await createAssessmentAttempt(
      fixture.storage.db,
      USER_ID,
      { ...ASSESSMENT_REQUEST, attemptId },
      100,
    );
  for (let i = 0; i < 2; i++)
    await submitAssessmentAttempt(
      fixture.storage.db,
      USER_ID,
      {
        ...ASSESSMENT_REQUEST,
        attemptId: ids[i],
        responses: A.items.map((item) => ({ itemId: item.id, response: item.acceptedAnswers[0] })),
      },
      200 + i,
    );
  await launch({ sets: [], handlers: fixture.handlers });
  await page.goto(`/learn/check?attempt=${ids[1]}`);
  await expect(page.getByText("Repeated observation", { exact: true })).toBeVisible();
  await expect(page.getByText("Demonstrated in one observation", { exact: true })).toHaveCount(6);
  await expect(page.getByText("Confirmed in an alternate form", { exact: true })).toHaveCount(0);
  await shot(page, `same-family-repeat-${info.project.name}`);
});
test("stale attempt URL and incompatible saved B cannot start a replacement or overwrite history", async ({
  page,
  launch,
}) => {
  const fixture = await assessmentFixture();
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto(`/learn/check?attempt=${crypto.randomUUID()}`);
  await expect(page.getByRole("alert")).toContainText("could not be loaded");
  expect(h.serverFns.callsTo("startUnitCheck")).toHaveLength(0);
  const ids = [crypto.randomUUID(), crypto.randomUUID()];
  await createAssessmentAttempt(
    fixture.storage.db,
    USER_ID,
    { ...ASSESSMENT_REQUEST, attemptId: ids[0] },
    100,
  );
  await submitAssessmentAttempt(
    fixture.storage.db,
    USER_ID,
    {
      ...ASSESSMENT_REQUEST,
      attemptId: ids[0],
      responses: A.items.map((i) => ({ itemId: i.id, response: i.acceptedAnswers[0] })),
    },
    200,
  );
  const b = await createAssessmentAttempt(
    fixture.storage.db,
    USER_ID,
    { ...ASSESSMENT_REQUEST, attemptId: ids[1] },
    300,
  );
  fixture.storage.records.set(`users/${USER_ID}/assessmentAttempts/${ids[1]}`, {
    ...b,
    compatibilityVersion: 99,
  });
  const before = fixture.storage.writes.length;
  await page.goto(`/learn/check?attempt=${ids[1]}`);
  await expect(page.getByRole("alert")).toContainText("could not be loaded");
  expect(fixture.storage.writes.length).toBe(before);
});

test("history read failure preserves exact attempt review and requires explicit retry before combined claims or retake", async ({
  page,
  launch,
}) => {
  const fixture = await assessmentFixture();
  const attemptId = crypto.randomUUID();
  await createAssessmentAttempt(
    fixture.storage.db,
    USER_ID,
    { ...ASSESSMENT_REQUEST, attemptId },
    100,
  );
  await submitAssessmentAttempt(
    fixture.storage.db,
    USER_ID,
    {
      ...ASSESSMENT_REQUEST,
      attemptId,
      responses: A.items.map((item) => ({ itemId: item.id, response: item.acceptedAnswers[0] })),
    },
    200,
  );
  fixture.failNextHistory();
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto(`/learn/check?attempt=${attemptId}`);
  await expect(
    page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("summary is unavailable");
  await expect(page.getByRole("list", { name: "Outcome evidence" })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Try the alternate form", exact: true }),
  ).toBeDisabled();
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText("Form A · This saved attempt only", { exact: true })).toBeVisible();
  expect(h.serverFns.callsTo("getUnitCheckHistory")).toHaveLength(1);
  await page.getByRole("button", { name: "Retry evidence history", exact: true }).click();
  await expect(page.getByText("Demonstrated in one observation", { exact: true })).toHaveCount(6);
  await expect(
    page.getByRole("button", { name: "Try the alternate form", exact: true }),
  ).toBeEnabled();
  expect(h.serverFns.callsTo("getUnitCheckHistory")).toHaveLength(2);
  expect(fixture.storage.writes.filter((p) => p.includes("/assessmentAttempts/"))).toHaveLength(2);
});
