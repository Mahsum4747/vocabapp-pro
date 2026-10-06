import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect, test } from "./support/app";
import { assessmentFixture } from "./support/assessment";
import { unit2Check as A, unit2CheckB as B } from "../src/content/curriculum/german-a1-unit2-check";
import {
  unit1Check as U1,
  unit1CheckB as U1B,
} from "../src/content/curriculum/german-a1-unit1-check";
import type { AssessmentDefinition } from "../src/lib/curriculum/assessment";
import {
  createAssessmentAttempt,
  submitAssessmentAttempt,
} from "../src/lib/curriculum/assessment.server";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { USER_ID } from "./support/backend";
import { undersizedTargets } from "./support/touch";
const scope = (f = A) => ({ assessmentId: f.id, compatibilityVersion: f.compatibilityVersion });
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/phase2b", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `screenshots/phase2b/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function fill(page: Page, form: AssessmentDefinition, wrong: number[] = [], mid?: string) {
  for (let i = 0; i < form.items.length; i++) {
    const item = form.items[i];
    await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
    const value = wrong.includes(i)
      ? (item.options?.find((o) => !item.acceptedAnswers.includes(o)) ?? "wrong")
      : item.acceptedAnswers[0];
    if (item.options) await page.getByRole("radio", { name: value, exact: true }).check();
    else await page.getByLabel("Your response", { exact: true }).fill(value);
    if (i === 3 && mid) await shot(page, mid);
    if (i < form.items.length - 1)
      await page.getByRole("button", { name: "Next item", exact: true }).click();
  }
}
async function submit(page: Page, correct = 8) {
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: `Unit check: ${correct} / 8 correct`, exact: true }),
  ).toBeVisible();
}
async function seed(
  f: Awaited<ReturnType<typeof assessmentFixture>>,
  definition = A,
  time = 100,
  wrong: number[] = [],
) {
  const input = { ...scope(definition), attemptId: crypto.randomUUID() };
  const draft = await createAssessmentAttempt(f.storage.db, USER_ID, input, time);
  const form =
    draft.formId === A.formId
      ? A
      : draft.formId === B.formId
        ? B
        : draft.formId === U1.formId
          ? U1
          : U1B;
  await submitAssessmentAttempt(
    f.storage.db,
    USER_ID,
    {
      ...input,
      responses: form.items.map((i, n) => ({
        itemId: i.id,
        response: wrong.includes(n)
          ? (i.options?.find((o) => !i.acceptedAnswers.includes(o)) ?? "wrong")
          : i.acceptedAnswers[0],
      })),
    },
    time + 1,
  );
  return input.attemptId;
}
test("Unit 2 A → alternate B → repeat A, own history and exact A/B reviews", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(120_000);
  if (info.project.name === "mobile") await page.setViewportSize({ width: 390, height: 844 });
  const f = await assessmentFixture(true, 2);
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn/units/DE.A1.U02");
  await expect(page.getByRole("link", { name: "Unit 2 Check", exact: true })).toBeVisible();
  await shot(page, `unit-before-${info.project.name}`);
  await page.getByRole("link", { name: "Unit 2 Check", exact: true }).click();
  await shot(page, `intro-a-${info.project.name}`);
  await page.getByRole("button", { name: "Start Unit 2 Check", exact: true }).click();
  await expect(page.getByText("Form A · First observation", { exact: true })).toBeVisible();
  const aUrl = page.url();
  await shot(page, `form-a-${info.project.name}`);
  if (info.project.name === "mobile") expect(await undersizedTargets(page)).toEqual([]);
  await fill(page, A, [], `mid-a-${info.project.name}`);
  await submit(page);
  await expect(page.getByText("Demonstrated in one observation", { exact: true })).toHaveCount(6);
  await shot(page, `result-a-${info.project.name}`);
  await page.getByRole("link", { name: "← Unit 2", exact: true }).click();
  await expect(page.getByText("Form A · Saved attempt", { exact: true })).toBeVisible();
  await shot(page, `unit-after-a-${info.project.name}`);
  await page.getByRole("link", { name: "Review Unit 2 Check", exact: true }).click();
  await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
  await expect(page.getByText("Form B · Alternate form", { exact: true })).toBeVisible();
  const bUrl = page.url();
  await shot(page, `form-b-${info.project.name}`);
  await page.getByLabel("Your response", { exact: true }).fill("Wir lernen Deutsch.");
  page.once("dialog", (d) => d.accept());
  await page.reload();
  await expect(page.getByText("Item 1 of 8 · 0 answered", { exact: true })).toBeVisible();
  await expect(page.getByText("Form B · Alternate form", { exact: true })).toBeVisible();
  await fill(page, B);
  await submit(page);
  await expect(page.getByText("Additional independent observation", { exact: true })).toBeVisible();
  await expect(page.getByText("Confirmed in an alternate form", { exact: true })).toHaveCount(6);
  await shot(page, `combined-b-${info.project.name}`);
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText(B.items[2].prompt, { exact: true })).toBeVisible();
  await shot(page, `review-b-${info.project.name}`);
  await page.getByRole("button", { name: "Repeat a check form", exact: true }).click();
  await fill(page, A);
  await submit(page);
  await expect(page.getByText("Repeated observation", { exact: true })).toBeVisible();
  await shot(page, `repeat-a-${info.project.name}`);
  await page.goto(aUrl);
  await expect(page.getByText("First observation", { exact: true })).toBeVisible();
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText(A.items[0].prompt, { exact: true })).toBeVisible();
  await expect(page.getByText(B.items[0].prompt, { exact: true })).toHaveCount(0);
  await shot(page, `review-a-${info.project.name}`);
  await page.goto(bUrl);
  await expect(
    page.getByRole("heading", { name: "Unit check: 8 / 8 correct", exact: true }),
  ).toBeVisible();
  expect(f.storage.writes.filter((p) => p.includes("/assessmentAttempts/"))).toHaveLength(6);
});
test("dark 320px U02 contradiction, lost start/submission acknowledgements and history retry", async ({
  page,
  launch,
}, info) => {
  test.setTimeout(120_000);
  const f = await assessmentFixture(true, 2);
  await seed(f);
  await launch({ sets: [], handlers: f.handlers });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(`/learn/units/${A.unitId}`);
  await page.getByRole("link", { name: "Review Unit 2 Check", exact: true }).click();
  f.loseNextStartAck();
  await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Your result is saved");
  await page.getByRole("button", { name: "Retry retake", exact: true }).dblclick();
  await expect(page.getByText("Form B · Alternate form", { exact: true })).toBeVisible();
  await shot(page, `dark-320-check-${info.project.name}`);
  expect(await undersizedTargets(page)).toEqual([]);
  await fill(page, B, [0, 6]);
  f.loseNextAck();
  await page.getByRole("button", { name: "Submit check", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("could not be confirmed");
  await page.getByRole("button", { name: "Retry submission", exact: true }).dblclick();
  await expect(
    page.getByRole("heading", { name: "Unit check: 6 / 8 correct", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Needs more evidence", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Confirmed in an alternate form", { exact: true })).toHaveCount(4);
  await shot(page, `dark-320-contradiction-${info.project.name}`);
  expect(await undersizedTargets(page)).toEqual([]);
  f.failNextHistory();
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("summary is unavailable");
  await expect(page.getByRole("list", { name: "Outcome evidence" })).toHaveCount(0);
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText("Form B · This saved attempt only", { exact: true })).toBeVisible();
  await shot(page, `history-failed-${info.project.name}`);
  await page.getByRole("button", { name: "Retry evidence history", exact: true }).click();
  await expect(page.getByText("Needs more evidence", { exact: true })).toHaveCount(2);
  await shot(page, `history-recovered-${info.project.name}`);
  expect(f.storage.writes.filter((p) => p.includes("/assessmentAttempts/"))).toHaveLength(4);
});
test("cross-unit query and saved UUID render authoritative assessment; U01 URLs and B survive", async ({
  page,
  launch,
}, info) => {
  const f = await assessmentFixture(true, 2);
  for (let i = 0; i < 4; i++) await f.course.advanceLesson(i, germanA1.lessons[i].steps.length);
  const u1 = await seed(f, U1, 100);
  const u2 = await seed(f, A, 200);
  const u1b = await seed(f, U1, 300);
  await launch({ sets: [], handlers: f.handlers });
  await page.goto(`/learn/check?assessment=${A.id}&attempt=${u1}`);
  await expect(page.getByRole("link", { name: "← Unit 1", exact: true })).toBeVisible();
  await expect(page.getByText("Confirmed in an alternate form", { exact: true })).toHaveCount(6);
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText(U1.items[0].prompt, { exact: true })).toBeVisible();
  await shot(page, `u01-review-${info.project.name}`);
  await page.goto(`/learn/check?assessment=${U1.id}&attempt=${u2}`);
  await expect(page.getByRole("link", { name: "← Unit 2", exact: true })).toBeVisible();
  await expect(page.getByText("First observation", { exact: true })).toBeVisible();
  await expect(page.getByText("Demonstrated in one observation", { exact: true })).toHaveCount(6);
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText(A.items[0].prompt, { exact: true })).toBeVisible();
  await page.goto(`/learn/check?attempt=${u1b}`);
  await expect(
    page.getByText("Form B · Unit lessons complete · Check result saved.", { exact: true }),
  ).toBeVisible();
  await page.getByText("Review item results", { exact: true }).click();
  await expect(page.getByText(U1B.items[1].prompt, { exact: true })).toBeVisible();
  await shot(page, `u01-b-review-${info.project.name}`);
  await page.goto(`/learn/units/${A.unitId}`);
  await expect(page.getByText("Form A · Saved attempt", { exact: true })).toBeVisible();
  await page.goto(`/learn/units/${U1.unitId}`);
  await expect(page.getByText("Form B · Saved attempt", { exact: true })).toBeVisible();
});
test("Unit 2 eligibility hides action until all own lessons complete, independent of Unit 1", async ({
  page,
  launch,
}) => {
  const f = await assessmentFixture(false);
  for (let i = 4; i < 7; i++) await f.course.advanceLesson(i, germanA1.lessons[i].steps.length);
  const h = await launch({ sets: [], handlers: f.handlers });
  await page.goto(`/learn/units/${A.unitId}`);
  await expect(page.getByRole("link", { name: "Unit 2 Check", exact: true })).toHaveCount(0);
  await page.goto(`/learn/check?assessment=${A.id}`);
  await expect(
    page.getByText("Finish the four Unit 2 lessons before starting this check.", { exact: true }),
  ).toBeVisible();
  expect(h.serverFns.callsTo("startUnitCheck")).toHaveLength(0);
  await f.course.advanceLesson(7, germanA1.lessons[7].steps.length);
  await page.goto(`/learn/units/${A.unitId}`);
  await expect(page.getByRole("link", { name: "Unit 2 Check", exact: true })).toBeVisible();
  await page.goto(`/learn/units/${U1.unitId}`);
  await expect(page.getByRole("link", { name: "Unit 1 Check", exact: true })).toHaveCount(0);
});
test("U02 concurrent A drafts show repeated observation, never alternate confirmation", async ({
  page,
  launch,
}, info) => {
  const f = await assessmentFixture(true, 2);
  const ids = [crypto.randomUUID(), crypto.randomUUID()];
  await Promise.all(
    ids.map((attemptId) =>
      createAssessmentAttempt(f.storage.db, USER_ID, { ...scope(), attemptId }, 100),
    ),
  );
  await Promise.all(
    ids.map((attemptId, i) =>
      submitAssessmentAttempt(
        f.storage.db,
        USER_ID,
        {
          ...scope(),
          attemptId,
          responses: A.items.map((item) => ({
            itemId: item.id,
            response: item.acceptedAnswers[0],
          })),
        },
        200 + i,
      ),
    ),
  );
  await launch({ sets: [], handlers: f.handlers });
  await page.goto(`/learn/check?attempt=${ids[1]}`);
  await expect(page.getByText("Repeated observation", { exact: true })).toBeVisible();
  await expect(page.getByText("Demonstrated in one observation", { exact: true })).toHaveCount(6);
  await expect(page.getByText("Confirmed in an alternate form", { exact: true })).toHaveCount(0);
  await shot(page, `same-family-${info.project.name}`);
});
test("U02 stale/incompatible URLs and unknown assessment never silently create a replacement", async ({
  page,
  launch,
}) => {
  const f = await assessmentFixture(true, 2);
  const h = await launch({ sets: [], handlers: f.handlers });
  await page.goto(`/learn/check?assessment=${A.id}&attempt=${crypto.randomUUID()}`);
  await expect(page.getByRole("alert")).toContainText("could not be loaded");
  const input = { ...scope(), attemptId: crypto.randomUUID() };
  const draft = await createAssessmentAttempt(f.storage.db, USER_ID, input);
  f.storage.records.set(`users/${USER_ID}/assessmentAttempts/${input.attemptId}`, {
    ...draft,
    compatibilityVersion: 2,
  });
  await page.goto(`/learn/check?attempt=${input.attemptId}`);
  await expect(page.getByRole("alert")).toContainText("could not be loaded");
  await page.goto("/learn/check?assessment=unknown");
  await expect(page.getByRole("alert")).toContainText("unavailable");
  expect(h.serverFns.callsTo("startUnitCheck")).toHaveLength(0);
  expect(f.storage.writes.filter((p) => p.includes("/assessmentAttempts/"))).toHaveLength(1);
});
