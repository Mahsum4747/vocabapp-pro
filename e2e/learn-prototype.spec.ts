import { mkdirSync } from "node:fs";
import { expect, test } from "./support/app";

const lessonUrl = "/learn/DE.A1.U01.L01";
async function noOverflow(page: import("@playwright/test").Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

test("Learn prototype: bounded lesson, retries, session resume and truthful completion", async ({
  page,
  launch,
  isMobile,
}, testInfo) => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const harness = await launch({ sets: [] });
  const writes: string[] = [];
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) writes.push(request.url());
  });
  mkdirSync("screenshots", { recursive: true });
  await page.goto("/learn");
  await expect(page.getByRole("heading", { name: "The course ahead" })).toBeVisible();
  await expect(page.locator("ol > li")).toHaveCount(10);
  await noOverflow(page);
  await page.screenshot({ path: `screenshots/learn-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole("link", { name: "Start lesson", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("radio", { name: "Du bist Nora.", exact: true }).check();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Try again");
  await page.getByRole("radio", { name: "Ich bin Nora.", exact: true }).check();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const input = page.getByLabel("Missing German word");
  await expect(page.getByRole("button", { name: "Check", exact: true })).toBeDisabled();
  await input.fill("bist");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Try again");
  await input.fill("bin");
  await page.screenshot({
    path: `screenshots/lesson-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await noOverflow(page);
  await page.getByRole("link", { name: "Learn", exact: true }).click();
  await page.getByRole("link", { name: "Continue lesson", exact: true }).click();
  await expect(page.getByLabel("Missing German word")).toHaveValue("bin");
  await expect(page.getByRole("button", { name: "Check", exact: true })).toBeEnabled();
  await page.getByLabel("Missing German word").press("Enter");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Your German sentence").fill("Ich bin Leo.");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Your introduction").fill("Ich bin Alex. ".repeat(12));
  await noOverflow(page);
  await expect(page.getByLabel("Your introduction")).toHaveAttribute("maxlength", "160");
  await page.getByLabel("Your introduction").fill("Ich bin Alex.");
  await page.getByRole("button", { name: "Record response", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("not been assessed");
  await page.screenshot({
    path: `screenshots/lesson-writing-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Missing word for this sentence").fill("bist");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await page.getByRole("button", { name: "Finish lesson", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "You finished your first lesson." }),
  ).toBeVisible();
  await expect(page.getByText(/does not establish skill mastery/)).toBeVisible();
  await page.getByRole("link", { name: "Return to Learn", exact: true }).click();
  await expect(page.getByText("Lesson finished in this session", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "View finished lesson", exact: true }).click();
  await page.getByRole("button", { name: "Practice lesson again", exact: true }).click();
  await expect(page.getByText("Lesson 1 · Step 1 of 7", { exact: true })).toBeVisible();
  // This additive flow must not invoke any learning server function, even reads.
  expect(harness.serverFns.calls).toEqual([]);
  expect(writes).toEqual([]);
  await page.reload();
  await expect(page.getByText("Lesson 1 · Step 1 of 7", { exact: true })).toBeVisible();
});

test("direct unavailable lesson and unknown ID remain unavailable", async ({ page, launch }) => {
  await launch({ sets: [] });
  await page.goto("/learn/DE.A1.U01.L02");
  await expect(
    page.getByRole("heading", { name: "This lesson is not yet authored" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Check", exact: true })).toHaveCount(0);
  await page.goto("/learn/unknown");
  await expect(page.getByRole("heading", { name: "Lesson not found" })).toBeVisible();
});

test("Learn and lesson dark mode, narrow layout and long writing remain readable", async ({
  page,
  launch,
  isMobile,
}, testInfo) => {
  await launch({ sets: [] });
  if (isMobile) await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/learn");
  await expect(page.getByRole("heading", { name: "The course ahead" })).toBeVisible();
  await page.screenshot({
    path: `screenshots/learn-dark-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.goto(lessonUrl);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Lesson 1 · Step 2 of 7", { exact: true })).toBeVisible();
  await page.screenshot({
    path: `screenshots/lesson-dark-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await noOverflow(page);
});
