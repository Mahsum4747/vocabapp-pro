import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";
import { assessmentFixture } from "./support/assessment";
import { challengeFixture } from "./support/challenge";
import { USER_ID, NOW } from "./support/backend";
import { undersizedTargets } from "./support/touch";
import { germanA1 } from "../src/content/curriculum/german-a1";
import { unit9CheckForms } from "../src/content/curriculum/german-a1-unit9-check";
import { unit10CheckForms } from "../src/content/curriculum/german-a1-unit10-check";
import { challengeForms } from "../src/content/curriculum/german-a1-challenges.server";
import { startChallenge, submitChallenge } from "../src/lib/curriculum/challenge.server";
import { COURSE_SCOPE } from "../src/lib/curriculum/course-progress";
async function shot(page: Page, name: string) {
  mkdirSync("screenshots/batch-d", { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `screenshots/batch-d/${name}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if ((page.viewportSize()?.width ?? 1280) < 768) expect(await undersizedTargets(page)).toEqual([]);
}
async function noSupport(page: Page) {
  await expect(page.getByRole("button", { name: /^Hint$|^Show answer$/ })).toHaveCount(0);
  await expect(page.getByText(/Accepted response:/)).toHaveCount(0);
}
for (const index of [32, 39])
  test(`${germanA1.lessons[index].id}: open exploration, truthful completion, reload and teaching support`, async ({
    page,
    launch,
    isMobile,
  }, info) => {
    test.setTimeout(90_000);
    if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
    const f = courseProgressFixture();
    const h = await launch({ sets: [], handlers: f.handlers });
    const lesson = germanA1.lessons[index];
    await page.goto("/learn");
    for (const unit of [9, 10])
      await expect(
        page.getByRole("link", { name: `Open Unit ${unit}`, exact: true }),
      ).toBeVisible();
    await expect(page.getByRole("link", { name: "Open Unit 11", exact: true })).toHaveCount(0);
    await page.goto(`/learn/units/${lesson.unitId}`);
    await expect(
      page.getByText("You're studying ahead of your recommended path.", { exact: true }),
    ).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Take Unit Challenge", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: `Unit ${index < 36 ? 9 : 10} Check`, exact: true }),
    ).toHaveCount(0);
    await shot(page, `unit-${index}-${info.project.name}`);
    await page.goto(`/learn/${lesson.id}`);
    let reloaded = false;
    for (const [n, step] of lesson.steps.entries()) {
      await expect(page.getByRole("heading", { name: step.prompt, exact: true })).toBeVisible();
      if (index === 39 && n === 5) {
        const input = page.getByLabel("Your German response", { exact: true });
        await input.fill("d");
        await page.getByRole("button", { name: "Insert ü", exact: true }).click();
        await expect(input).toHaveValue("dü");
        for (let wrong = 1; wrong <= 3; wrong++) {
          await input.fill(`wrong${wrong}`);
          await input.press("Enter");
          await expect(page.getByRole("status")).toContainText("Try again");
          await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
          if (wrong === 2) await page.getByRole("button", { name: "Hint", exact: true }).click();
        }
        const writes = h.serverFns.callsTo("acknowledgeCourseProgress").length;
        await page.getByRole("button", { name: "Show answer", exact: true }).click();
        await expect(page.getByRole("status")).toContainText("not a correct answer");
        expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(writes);
        await page.emulateMedia({ colorScheme: "dark" });
        await page.setViewportSize({ width: 320, height: 844 });
        await shot(page, `revision-recovery-dark-320-${info.project.name}`);
      } else if (step.kind !== "explanation") {
        if (step.kind === "choice")
          await page.getByRole("radio", { name: step.correctAnswer, exact: true }).check();
        else if (step.kind === "text")
          await page
            .getByLabel(step.inputLabel, { exact: true })
            .fill(step.acceptedAnswers[0].replaceAll("ü", "ue"));
        else if (step.kind === "original")
          await page
            .getByLabel(step.inputLabel, { exact: true })
            .fill("PRIVATE ORIGINAL: Hallo Ada! Ich bin in Bonn. Ich kann morgen kommen.");
        await page
          .getByRole("button", {
            name: step.kind === "original" ? "Record response" : "Check",
            exact: true,
          })
          .click();
        await expect(page.getByText("Progress saved", { exact: true })).toBeVisible();
        if (step.kind === "original") {
          await expect(page.getByRole("status")).toContainText("open writing is unassessed");
          await page.reload();
          await expect(page.getByRole("status")).toContainText("open writing was not stored");
          expect(JSON.stringify(h.serverFns.callsTo("acknowledgeCourseProgress"))).not.toContain(
            "PRIVATE ORIGINAL",
          );
          expect(JSON.stringify([...f.storage.records.values()])).not.toContain("PRIVATE ORIGINAL");
          await shot(page, `unassessed-original-${info.project.name}`);
        } else {
          await expect(page.getByRole("status")).toContainText("That fits");
          if (!reloaded) {
            await page.reload();
            await expect(page.getByRole("status")).toContainText("That fits");
            reloaded = true;
            await shot(page, `lesson-${index}-${info.project.name}`);
          }
        }
      }
      await page
        .getByRole("button", {
          name: n === lesson.steps.length - 1 ? "Finish lesson" : "Continue",
          exact: true,
        })
        .click();
    }
    await expect(
      page.getByRole("heading", { name: "Lesson finished.", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Lesson finished.", exact: true }),
    ).toBeVisible();
    await page.goto(`/learn/units/${lesson.unitId}`);
    await expect(page.getByText("1 of 4 lessons finished")).toBeVisible();
    await page.goto("/learn");
    await expect(
      page
        .getByRole("region", { name: "Recommended learning action" })
        .getByRole("link", { name: "Start lesson", exact: true }),
    ).toHaveAttribute("href", "/learn/DE.A1.U01.L01");
    expect(f.storage.writes.every((p) => p.includes("/courseProgress/"))).toBe(true);
    expect(h.serverFns.callsTo("finishUnitCheck")).toHaveLength(0);
    expect(h.serverFns.callsTo("finishUnitChallenge")).toHaveLength(0);
  });
for (const [number, forms] of [
  [9, unit9CheckForms],
  [10, unit10CheckForms],
] as const)
  test(`Unit ${number} real completions enable Check A/B with exact result review`, async ({
    page,
    launch,
    isMobile,
  }, info) => {
    test.setTimeout(120_000);
    if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
    const f = await assessmentFixture(true, number);
    const before = structuredClone([...f.storage.records.entries()]);
    const writes = f.storage.writes.length;
    await launch({ sets: [], handlers: f.handlers });
    await page.goto(`/learn/units/DE.A1.U${String(number).padStart(2, "0")}`);
    await page.getByRole("link", { name: `Unit ${number} Check`, exact: true }).click();
    await page.getByRole("button", { name: `Start Unit ${number} Check`, exact: true }).click();
    for (const [trial, form] of forms.entries()) {
      if (trial)
        await page.getByRole("button", { name: "Try the alternate form", exact: true }).click();
      for (const [n, item] of form.items.entries()) {
        await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
        await noSupport(page);
        if (item.options)
          await page.getByRole("radio", { name: item.acceptedAnswers[0], exact: true }).check();
        else await page.getByRole("textbox").fill(item.acceptedAnswers[0].replaceAll("ü", "ue"));
        if (n < form.items.length - 1)
          await page.getByRole("button", { name: "Next item", exact: true }).click();
      }
      await page.getByRole("button", { name: "Submit check", exact: true }).click();
      await expect(
        page.getByRole("heading", {
          name: `Unit check: ${form.items.length} / ${form.items.length} correct`,
          exact: true,
        }),
      ).toBeVisible();
      await page.getByText("Review item results", { exact: true }).click();
      for (const item of form.items)
        await expect(page.locator("details").getByText(item.prompt, { exact: true })).toBeVisible();
      if (trial) {
        await page.emulateMedia({ colorScheme: "dark" });
        await page.setViewportSize({ width: 320, height: 844 });
      }
      await shot(page, `check-${number}-${trial}-${info.project.name}`);
      await page.reload();
      await expect(
        page.getByRole("heading", {
          name: `Unit check: ${form.items.length} / ${form.items.length} correct`,
          exact: true,
        }),
      ).toBeVisible();
    }
    for (const [path, value] of before) expect(f.storage.records.get(path)).toEqual(value);
    expect(f.storage.writes.slice(writes).every((p) => p.includes("/assessmentAttempts/"))).toBe(
      true,
    );
  });
for (const number of [9, 10])
  for (const correct of [5, 6])
    test(`Unit ${number} challenge ${correct}/8 keeps lessons separate and recommends the next authored unit`, async ({
      page,
      launch,
      isMobile,
    }, info) => {
      test.setTimeout(90_000);
      if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
      const f = challengeFixture();
      for (let unit = 1; unit < number; unit++) {
        const unitId = `DE.A1.U${String(unit).padStart(2, "0")}`;
        const req = { ...COURSE_SCOPE, unitId, attemptId: randomUUID() };
        await startChallenge(f.storage.db, USER_ID, req, NOW);
        await submitChallenge(
          f.storage.db,
          USER_ID,
          {
            ...req,
            responses: challengeForms[unitId].A.map((i) => ({
              itemId: i.id,
              response: i.acceptedAnswers[0],
            })),
          },
          NOW + 1,
        );
      }
      const before = structuredClone([...f.storage.records.entries()]);
      const writes = f.storage.writes.length;
      const h = await launch({ sets: [], handlers: f.handlers });
      const unitId = `DE.A1.U${String(number).padStart(2, "0")}`;
      await page.goto("/learn");
      await expect(
        page
          .getByRole("region", { name: "Recommended learning action" })
          .getByRole("link", { name: "Start lesson", exact: true }),
      ).toHaveAttribute("href", `/learn/${unitId}.L01`);
      await page.goto(`/learn/units/${unitId}`);
      await page.getByRole("link", { name: "Take Unit Challenge", exact: true }).click();
      await page.getByRole("button", { name: "Start unit challenge", exact: true }).click();
      for (const [n, item] of challengeForms[unitId].A.entries()) {
        await expect(page.getByRole("heading", { name: item.prompt, exact: true })).toBeVisible();
        await noSupport(page);
        const answer =
          n < correct
            ? item.acceptedAnswers[0]
            : (item.options?.find((o) => !item.acceptedAnswers.includes(o)) ?? "wrong");
        if (item.options) await page.getByRole("radio", { name: answer, exact: true }).check();
        else
          await page
            .getByRole("textbox", { name: "Your answer" })
            .fill(answer.replaceAll("ü", "ue"));
        if (n < 7) await page.getByRole("button", { name: "Next task", exact: true }).click();
      }
      await page.getByRole("button", { name: "Submit challenge", exact: true }).click();
      await expect(
        page.getByRole("heading", {
          name: correct === 6 ? "Cleared by challenge" : "Review these lessons",
          exact: true,
        }),
      ).toBeVisible();
      await shot(page, `challenge-${number}-${correct}-${info.project.name}`);
      await page.reload();
      await expect(
        page.getByRole("heading", {
          name: correct === 6 ? "Cleared by challenge" : "Review these lessons",
          exact: true,
        }),
      ).toBeVisible();
      await page.goto(`/learn/units/${unitId}`);
      await expect(page.getByText("0 of 4 lessons finished")).toBeVisible();
      await expect(
        page.getByRole("link", { name: `Unit ${number} Check`, exact: true }),
      ).toHaveCount(0);
      for (const id of germanA1.units[number - 1].lessonIds)
        await expect(page.locator(`main ol a[href="/learn/${id}"]`)).toBeVisible();
      await page.goto("/learn");
      const action = page.getByRole("region", { name: "Recommended learning action" });
      if (correct === 6 && number === 10)
        await expect(
          action.getByRole("link", { name: "Continue to final portfolio", exact: true }),
        ).toBeVisible();
      else
        await expect(
          action.getByRole("link", { name: "Start lesson", exact: true }),
        ).toHaveAttribute(
          "href",
          `/learn/DE.A1.U${String(correct === 6 ? number + 1 : number).padStart(2, "0")}.L01`,
        );
      await expect(page.getByRole("link", { name: "Open Unit 11", exact: true })).toHaveCount(0);
      for (const [path, value] of before) expect(f.storage.records.get(path)).toEqual(value);
      expect(f.storage.writes.slice(writes).every((p) => p.includes("/unitChallenges/"))).toBe(
        true,
      );
      expect(h.serverFns.callsTo("acknowledgeCourseProgress")).toHaveLength(0);
      expect(h.serverFns.callsTo("finishUnitCheck")).toHaveLength(0);
    });
