import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";
import { USER_ID, NOW } from "./support/backend";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { COURSE_SCOPE } from "../src/lib/curriculum/course-progress";
import { challengeForms } from "../src/content/curriculum/german-a1-challenges.server";
import {
  startChallenge,
  submitChallenge,
  readChallengeClearances,
} from "../src/lib/curriculum/challenge.server";
import { undersizedTargets } from "./support/touch";
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/learn-ui", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `screenshots/learn-ui/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if ((page.viewportSize()?.width ?? 1280) < 768) expect(await undersizedTargets(page)).toEqual([]);
}
test("Learn cards retain next lesson and all authored unit actions", async ({
  page,
  launch,
  isMobile,
}, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = courseProgressFixture();
  await launch({ sets: [], handlers: f.handlers });
  await page.goto("/learn");
  await expect(
    page.getByRole("heading", { name: "A small sentence. A first conversation." }),
  ).toBeVisible();
  await expect(
    page.locator("header").getByRole("link", { name: "Search your library" }),
  ).toHaveAttribute("href", "/?view=mine");
  const action = page.getByRole("region", { name: "Recommended learning action" });
  await expect(action.getByRole("progressbar", { name: "Saved lesson steps" })).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await expect(action.getByRole("link", { name: "Start lesson", exact: true })).toHaveAttribute(
    "href",
    "/learn/DE.A1.U01.L01",
  );
  for (let n = 1; n <= 8; n++)
    await expect(page.getByRole("link", { name: `Open Unit ${n}`, exact: true })).toBeVisible();
  for (let n = 9; n <= 10; n++) {
    const row = page.locator(`[data-unit="DE.A1.U${String(n).padStart(2, "0")}"]`);
    await expect(row.getByText("Not yet authored", { exact: true })).toBeVisible();
    await expect(row.getByRole("link")).toHaveCount(0);
  }
  await shot(page, `fresh-${info.project.name}`);
  expect(f.storage.writes).toHaveLength(0);
  await action.getByRole("link", { name: "Start lesson", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: germanA1.lessons[0].steps[0].prompt, exact: true }),
  ).toBeVisible();
  await page.goto("/learn");
  await page.getByRole("link", { name: "Open Unit 5", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Town and services", exact: true })).toBeVisible();
});
test("progress, completed and challenge states stay truthful at desktop, 390 and dark 320", async ({
  page,
  launch,
  isMobile,
}, info) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const f = courseProgressFixture();
  for (let i = 0; i < 4; i++) await f.advanceLesson(i, germanA1.lessons[i].steps.length);
  const unitId = "DE.A1.U02",
    req = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
  await startChallenge(f.storage.db, USER_ID, req, NOW);
  await submitChallenge(
    f.storage.db,
    USER_ID,
    {
      ...req,
      responses: challengeForms[unitId].A.map((item, i) => ({
        itemId: item.id,
        response:
          i < 6
            ? item.acceptedAnswers[0]
            : (item.options?.find((option) => !item.acceptedAnswers.includes(option)) ?? "wrong"),
      })),
    },
    NOW + 1,
  );
  await f.advanceLesson(8, 2);
  await launch({
    sets: [],
    handlers: {
      ...f.handlers,
      getCourseProgress: async (input: unknown) => ({
        ...(await f.handlers.getCourseProgress(input)),
        challengeClearances: await readChallengeClearances(f.storage.db, USER_ID, COURSE_SCOPE),
      }),
    },
  });
  const before = structuredClone([...f.storage.records.entries()]);
  await page.goto("/learn");
  await expect(
    page.locator('[data-unit="DE.A1.U01"]').getByText("Completed", { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('[data-unit="DE.A1.U02"]').getByText("Cleared by challenge", { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('[data-unit="DE.A1.U03"]').getByText("Recommended", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator('[data-unit="DE.A1.U03"]')
      .getByText("In progress · 0/4 lessons finished", { exact: true }),
  ).toBeVisible();
  const action = page.getByRole("region", { name: "Recommended learning action" });
  await expect(action.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    String((2 / germanA1.lessons[8].steps.length) * 100),
  );
  await expect(action.getByRole("link", { name: "Continue lesson", exact: true })).toHaveAttribute(
    "href",
    "/learn/DE.A1.U03.L01",
  );
  await shot(page, `states-${info.project.name}`);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 320, height: 844 });
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim(),
      ),
    )
    .toBe("#1c1b19");
  // Wait for existing color transitions to settle before inspecting dark contrast.
  await expect
    .poll(() =>
      page
        .locator('[data-unit="DE.A1.U01"] a')
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    )
    .toBe("rgb(36, 35, 32)");
  await shot(page, `dark-320-${info.project.name}`);
  expect([...f.storage.records.entries()]).toEqual(before);
  await action.getByRole("link", { name: "Continue lesson", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: germanA1.lessons[8].steps[2].prompt, exact: true }),
  ).toBeVisible();
});
test("cleared course keeps revisit action without synthetic lesson progress", async ({
  page,
  launch,
}, info) => {
  const f = courseProgressFixture();
  await launch({
    sets: [],
    handlers: {
      ...f.handlers,
      getCourseProgress: async (input: unknown) => ({
        ...(await f.handlers.getCourseProgress(input)),
        challengeClearances: germanA1.units.slice(0, 8).map((unit) => unit.id),
      }),
    },
  });
  await page.goto("/learn");
  const action = page.getByRole("region", { name: "Recommended learning action" });
  await expect(action.getByRole("link", { name: "Revisit Unit 8", exact: true })).toHaveAttribute(
    "href",
    "/learn/units/DE.A1.U08",
  );
  await expect(action.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  await shot(page, `cleared-${info.project.name}`);
  expect(f.storage.writes).toHaveLength(0);
});
