import { expect, test } from "./support/app";
import { courseProgressFixture } from "./support/course-progress";

test("Karta home, grammar reference and lesson shell remain usable", async ({ page, launch }) => {
  await launch({ sets: [], handlers: courseProgressFixture().handlers });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Keep learning with Karta" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Grammar Reference/i })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.goto("/grammar/rules");
  await expect(page.getByRole("heading", { name: "Grammar Reference" })).toBeVisible();
  const search = page.getByPlaceholder("Search rules by topic…");
  await search.fill("helfen");
  await expect(page.getByText("helfen + Dativ", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create personal AI note" })).toBeVisible();

  await page.goto("/learn/DE.A1.U01.L01");
  await expect(page.getByRole("heading", { name: /You meet someone in a German course/i })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Ich bin Mira.", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    const bodyMinWidth = await page.evaluate(() => getComputedStyle(document.body).minWidth);
    expect(bodyMinWidth === "0px" || bodyMinWidth === "auto").toBe(true);
  }
});
