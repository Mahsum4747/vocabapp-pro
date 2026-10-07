import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { test, expect } from "./support/app";
import { challengeFixture } from "./support/challenge";
import { assessmentFixture } from "./support/assessment";
import { courseProgressFixture } from "./support/course-progress";
import { USER_ID, NOW } from "./support/backend";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { challengeForms } from "../src/content/curriculum/german-a1-challenges.server";
import { startChallenge, submitChallenge } from "../src/lib/curriculum/challenge.server";
import { COURSE_SCOPE } from "../src/lib/curriculum/course-progress";

const note = "You're studying ahead of your recommended path.";
async function clear(f: ReturnType<typeof challengeFixture>, unitId: string) {
  const req = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
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
    NOW + 1,
  );
}
test("open authored units and study ahead with no invented evidence", async ({
  page,
  launch,
  isMobile,
}, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = courseProgressFixture();
  const h = await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn");
  await expect(
    page.locator('[data-unit="DE.A1.U01"]').getByText("Recommended", { exact: true }),
  ).toBeVisible();
  for (const n of [3, 4, 5, 6]) {
    await expect(page.getByRole("link", { name: `Open Unit ${n}`, exact: true })).toBeVisible();
    await expect(
      page.locator(`[data-unit="DE.A1.U0${n}"]`).getByText("Available to explore", { exact: true }),
    ).toBeVisible();
    await expect(
      page
        .locator(`[data-unit="DE.A1.U0${n}"]`)
        .getByText(`Recommended after Unit ${n - 1}`, { exact: true }),
    ).toBeVisible();
  }
  await expect(page.getByRole("link", { name: "Open Unit 7", exact: true })).toHaveCount(0);
  mkdirSync("screenshots/open-navigation", { recursive: true });
  await page.screenshot({
    path: `screenshots/open-navigation/list-${info.project.name}.png`,
    fullPage: true,
  });
  for (const n of [4, 5]) {
    await page.getByRole("link", { name: `Open Unit ${n}`, exact: true }).click();
    await expect(page.getByText(note, { exact: true })).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Take Unit Challenge", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: `Unit ${n} Check`, exact: true })).toHaveCount(0);
    await page.screenshot({
      path: `screenshots/open-navigation/u${n}-${info.project.name}.png`,
      fullPage: true,
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole("link", { name: /Start Unit|Continue Unit/ }).click();
    await expect(page.getByText(note, { exact: true })).toHaveCount(1);
    expect(f.storage.writes).toHaveLength(n === 4 ? 0 : 1);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(
      page.getByRole("heading", {
        name: germanA1.lessons[(n - 1) * 4].steps[1].prompt,
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: germanA1.lessons[(n - 1) * 4].steps[1].prompt,
        exact: true,
      }),
    ).toBeVisible();
    await page.goto("/learn");
    await expect(
      page.locator('[data-unit="DE.A1.U01"]').getByText("Recommended", { exact: true }),
    ).toBeVisible();
  }
  expect(f.storage.writes.every((path) => path.includes("/courseProgress/"))).toBe(true);
  expect(h.serverFns.callsTo("finishUnitChallenge")).toHaveLength(0);
  expect(h.serverFns.callsTo("finishUnitCheck")).toHaveLength(0);
  await page.goto("/learn/DE.A1.U07.L01");
  await expect(
    page.getByRole("heading", { name: "This lesson is not yet authored", exact: true }),
  ).toBeVisible();
});
test("U3 and U4 6/8 challenge clearance advances only recommendation", async ({
  page,
  launch,
  isMobile,
}) => {
  test.setTimeout(120_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = challengeFixture();
  for (const id of ["DE.A1.U01", "DE.A1.U02"]) await clear(f, id);
  await launch({ sets: [], handlers: f.handlers });
  for (const n of [3, 4]) {
    await page.goto("/learn");
    await expect(
      page.getByText(`Unit ${n} · ${germanA1.units[n - 1].title}`, { exact: true }),
    ).toBeVisible();
    await page.getByRole("link", { name: `Open Unit ${n}`, exact: true }).click();
    await expect(page.getByText(note, { exact: true })).toHaveCount(0);
    await expect(page.getByText("0 of 4 lessons finished", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Take Unit Challenge", exact: true }).click();
    await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
    for (const [index, item] of challengeForms[`DE.A1.U0${n}`].A.entries()) {
      await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
      const answer =
        index < 6
          ? item.acceptedAnswers[0]
          : (item.options?.find((option) => !item.acceptedAnswers.includes(option)) ?? "wrong");
      if (item.options) await page.getByRole("radio", { name: answer, exact: true }).check();
      else await page.getByRole("textbox", { name: "Your answer", exact: true }).fill(answer);
      if (index < 7) await page.getByRole("button", { name: "Next task", exact: true }).click();
    }
    await page.getByRole("button", { name: "Submit challenge", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Cleared by challenge", exact: true }),
    ).toBeVisible();
    await page.goto(`/learn/units/DE.A1.U0${n}`);
    await expect(page.getByText("0 of 4 lessons finished", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: `Unit ${n} Check`, exact: true })).toHaveCount(0);
    await page.goto("/learn");
    await expect(
      page.getByText(`Unit ${n + 1} · ${germanA1.units[n].title}`, { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Open Checkpoint 1", exact: true })).toBeVisible();
  }
  expect(f.storage.writes.every((path) => path.includes("/unitChallenges/"))).toBe(true);
});
test("Unit Check still needs four actual lessons even ahead of recommendation", async ({
  page,
  launch,
}) => {
  const f = await assessmentFixture(false, 4);
  for (let i = 12; i < 15; i++) await f.course.advanceLesson(i, germanA1.lessons[i].steps.length);
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn/units/DE.A1.U04");
  await expect(page.getByText("3 of 4 lessons finished", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Unit 4 Check", exact: true })).toHaveCount(0);
  await f.course.advanceLesson(15, germanA1.lessons[15].steps.length);
  await page.reload();
  await expect(page.getByRole("link", { name: "Unit 4 Check", exact: true })).toBeVisible();
  await expect(page.getByText(note, { exact: true })).toBeVisible();
});
