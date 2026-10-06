import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect, test } from "./support/app";
import { assessmentFixture } from "./support/assessment";
import { unit1Check, unit1CheckB } from "../src/content/curriculum/german-a1-unit1-check";
import { submitAssessmentAttempt } from "../src/lib/curriculum/assessment.server";
import { USER_ID } from "./support/backend";
import { undersizedTargets } from "./support/touch";
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/phase1e", { recursive: true });
  await page.screenshot({ path: `screenshots/phase1e/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function answer(page: Page, index: number, wrong = false, definition = unit1Check) {
  const item = definition.items[index];
  await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
  if (item.options)
    await page.getByRole("radio", { name: item.acceptedAnswers[0], exact: true }).check();
  else
    await page
      .getByLabel(item.type === "supported-field" ? "Name" : "Your response", { exact: true })
      .fill(wrong ? "wrong" : item.acceptedAnswers[0]);
}
async function fill(page: Page, mixed = false, definition = unit1Check) {
  for (let i = 0; i < unit1Check.items.length; i++) {
    await answer(page, i, mixed && [3, 5].includes(i), definition);
    if (i < unit1Check.items.length - 1)
      await page.getByRole("button", { name: "Next item", exact: true }).click();
  }
}
test("eight tasks, mixed evidence, durable reload, review and independent retake", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(90_000);
  if (info.project.name === "mobile") await page.setViewportSize({ width: 390, height: 844 });
  const fixture = await assessmentFixture();
  const courseBefore = structuredClone([...fixture.storage.records]);
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn/units/DE.A1.U01");
  await expect(page.getByRole("link", { name: "Unit 1 Check", exact: true })).toBeVisible();
  await shot(page, `unit-available-${info.project.name}`);
  await page.getByRole("link", { name: "Unit 1 Check", exact: true }).click();
  await page.getByRole("button", { name: "Start Unit 1 Check", exact: true }).click();
  await expect(page.getByText("Item 1 of 8 · 0 answered", { exact: true })).toBeVisible();
  const firstUrl = page.url();
  await shot(page, `check-${info.project.name}`);
  for (let i = 0; i < unit1Check.items.length; i++) {
    await answer(page, i, [3, 5].includes(i));
    if (i === 4) await shot(page, `mid-check-${info.project.name}`);
    if (info.project.name === "mobile") expect(await undersizedTargets(page)).toEqual([]);
    if (i < unit1Check.items.length - 1)
      await page.getByRole("button", { name: "Next item", exact: true }).click();
  }
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Unit check: 6 / 8 correct", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Unit check: 6 / 8 correct", exact: true }),
  ).toBeFocused();
  await expect(page.getByText("Needs more evidence", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Demonstrated in one observation", { exact: true })).toHaveCount(4);
  await shot(page, `result-mixed-${info.project.name}`);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Unit check: 6 / 8 correct", exact: true }),
  ).toBeVisible();
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText("Needs another look", { exact: false })).toHaveCount(2);
  await shot(page, `review-${info.project.name}`);
  await page.getByRole("link", { name: "← Unit 1", exact: true }).click();
  await expect(page.getByText("Last unit check: 6 / 8 correct", { exact: true })).toBeVisible();
  await expect(page.getByText("Unit lessons complete", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Review Unit 1 Check", exact: true }).click();
  await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
  await expect(page.getByText("Item 1 of 8 · 0 answered", { exact: true })).toBeVisible();
  expect(page.url()).not.toBe(firstUrl);
  await shot(page, `retake-${info.project.name}`);
  await fill(page, false, unit1CheckB);
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
  ).toBeVisible();
  const attempts = [...fixture.storage.records.values()].filter(
    (r) => (r as { assessmentId?: string }).assessmentId === unit1Check.id,
  );
  expect(attempts).toHaveLength(2);
  expect(attempts.map((r) => (r as { evidence: unknown[] }).evidence.length)).toEqual([8, 8]);
  for (const [path, record] of courseBefore)
    expect(fixture.storage.records.get(path)).toEqual(record);
  expect(
    fixture.storage.writes
      .slice(
        courseBefore.reduce((n, [, record]) => n + (record as { revision: number }).revision, 0),
      )
      .every((path) => path.includes("/assessmentAttempts/")),
  ).toBe(true);
  expect(
    h.serverFns.calls.every((call) =>
      [
        "getCourseProgress",
        "getLatestUnitCheck",
        "getUnitCheckHistory",
        "getUnitCheckAttempt",
        "startUnitCheck",
        "finishUnitCheck",
      ].includes(call.name),
    ),
  ).toBe(true);
});
test("refresh clears only local answers; load, start and submission failures recover without duplicate events", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(90_000);
  const fixture = await assessmentFixture();
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn/check");
  fixture.failNextStart();
  await page.getByRole("button", { name: "Start Unit 1 Check" }).click();
  await expect(page.getByRole("alert")).toContainText("Could not start");
  await page.getByRole("button", { name: "Retry start", exact: true }).click();
  await answer(page, 0);
  await page.getByRole("button", { name: "Next item", exact: true }).click();
  fixture.failNextLoad();
  page.once("dialog", (dialog) => dialog.accept());
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("could not be loaded");
  await page.getByRole("button", { name: "Retry load", exact: true }).click();
  await expect(page.getByText("Item 1 of 8 · 0 answered", { exact: true })).toBeVisible();
  await fill(page);
  fixture.failNextSubmit();
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("could not be confirmed");
  await shot(page, `submit-failure-${info.project.name}`);
  fixture.loseNextAck();
  await page.getByRole("button", { name: "Retry submission", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("could not be confirmed");
  await page.getByRole("button", { name: "Retry submission", exact: true }).dblclick();
  await expect(
    page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
  ).toBeVisible();
  expect(h.serverFns.callsTo("finishUnitCheck").length).toBe(3);
  const assessmentWrites = fixture.storage.writes.filter((path) =>
    path.includes("/assessmentAttempts/"),
  );
  expect(assessmentWrites).toHaveLength(2);
  await shot(page, `recovered-${info.project.name}`);
});
test("another tab wins changed submission and saved result remains authoritative", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(90_000);
  const fixture = await assessmentFixture();
  await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn/check");
  await page.getByRole("button", { name: "Start Unit 1 Check" }).click();
  await fill(page);
  const id = new URL(page.url()).searchParams.get("attempt")!;
  await submitAssessmentAttempt(fixture.storage.db, USER_ID, {
    assessmentId: unit1Check.id,
    compatibilityVersion: 1,
    attemptId: id,
    responses: unit1Check.items.map((item, i) => ({
      itemId: item.id,
      response: i === 3 ? "12" : item.acceptedAnswers[0],
    })),
  });
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Another tab already submitted" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Unit check: 7 / 8 correct", exact: true }),
  ).toBeVisible();
  await shot(page, `concurrent-result-${info.project.name}`);
});
test("dark 320px assessment/result, leave guard and touch targets", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(90_000);
  const fixture = await assessmentFixture();
  await launch({ sets: [], handlers: fixture.handlers });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/learn/check");
  await page.getByRole("button", { name: "Start Unit 1 Check" }).click();
  await answer(page, 0);
  await page.getByRole("link", { name: "← Unit 1", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Unsubmitted answers will be cleared");
  await page.getByRole("button", { name: "Keep answering", exact: true }).click();
  await shot(page, `dark-320-check-${info.project.name}`);
  expect(await undersizedTargets(page)).toEqual([]);
  await fill(page, true);
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your check result", exact: true })).toBeVisible();
  await shot(page, `dark-320-result-${info.project.name}`);
  expect(await undersizedTargets(page)).toEqual([]);
});
test("incomplete lessons show no check entry and direct navigation cannot start; signed-out route redirects", async ({
  page,
  launch,
}) => {
  const fixture = await assessmentFixture(false);
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn/units/DE.A1.U01");
  await expect(
    page.getByRole("heading", { name: "Foundations and identity", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Unit 1 Check", exact: true })).toHaveCount(0);
  await page.goto("/learn/check");
  await expect(
    page.getByText("Finish the four Unit 1 lessons before starting this check.", { exact: true }),
  ).toBeVisible();
  expect(h.serverFns.callsTo("startUnitCheck")).toHaveLength(0);
  await page.route("**/api/auth/get-session", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "null" }),
  );
  await page.reload();
  await expect(page).toHaveURL(/\/login/);
});

test("lost acknowledgement can recover by reading the accepted result, including after refresh", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(90_000);
  const fixture = await assessmentFixture();
  const h = await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn/check");
  await page.getByRole("button", { name: "Start Unit 1 Check" }).click();
  await fill(page);
  fixture.loseNextAck();
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("could not be confirmed");
  await page.getByRole("button", { name: "Check saved result", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
  ).toBeVisible();
  expect(h.serverFns.callsTo("finishUnitCheck")).toHaveLength(1);
  expect(fixture.storage.writes.filter((p) => p.includes("/assessmentAttempts/"))).toHaveLength(2);
  await page
    .getByRole("button", { name: "Try the alternate form", exact: true })
    .scrollIntoViewIfNeeded();
  const bounds = await page
    .getByRole("button", { name: "Try the alternate form", exact: true })
    .boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThan(844 - 56);
  await page.screenshot({
    path: `screenshots/phase1e/result-action-viewport-${info.project.name}.png`,
  });
});
test("Previous edits remain local, and a failed retake cannot overwrite the prior result", async ({
  page,
  launch,
}) => {
  test.setTimeout(90_000);
  const fixture = await assessmentFixture();
  await launch({ sets: [], handlers: fixture.handlers });
  await page.goto("/learn/check");
  await page.getByRole("button", { name: "Start Unit 1 Check" }).click();
  await answer(page, 0);
  await page.getByRole("button", { name: "Next item", exact: true }).click();
  await page.getByRole("button", { name: "Previous item", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: unit1Check.items[0].prompt, exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("radio", { name: "Omar", exact: true })).toBeChecked();
  await page.getByRole("radio", { name: "Anja", exact: true }).check();
  await fill(page);
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your check result", exact: true })).toBeVisible();
  fixture.failNextStart();
  await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Your result is saved");
  expect(
    [...fixture.storage.records.values()].filter(
      (r) => (r as { assessmentId?: string }).assessmentId === unit1Check.id,
    ),
  ).toHaveLength(1);
  await page.getByRole("button", { name: "Retry retake", exact: true }).click();
  await expect(page.getByText("Item 1 of 8 · 0 answered", { exact: true })).toBeVisible();
});
