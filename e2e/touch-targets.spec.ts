import { expect, test } from "./support/app";
import { queueLibrary } from "./support/library";
import { undersizedTargets } from "./support/touch";

// Phones only: desktop keeps its denser sizes on purpose.
test.beforeEach(({ isMobile }) => {
  test.skip(!isMobile, "touch target sizes apply to touch devices");
});

const PAGES: Array<[string, string]> = [
  ["home", "/"],
  ["set page", "/sets/set-verbs"],
  ["set edit", "/sets/set-verbs/edit"],
  ["create", "/create"],
  ["account", "/account"],
  ["flashcards", "/sets/set-verbs/flashcards"],
  ["learn", "/sets/set-verbs/learn"],
  ["test", "/sets/set-verbs/test"],
  ["match", "/sets/set-verbs/match"],
];

for (const [name, path] of PAGES) {
  test(`${name}: every control has a 44px tap area`, async ({ page, launch }) => {
    await launch(queueLibrary());
    await page.goto(path);
    await page.waitForTimeout(1500); // routes hydrate and fetch at different speeds
    expect(await undersizedTargets(page)).toEqual([]);
  });
}

test("menus and dialogs: items and close buttons have a 44px tap area", async ({ page, launch }) => {
  await launch(queueLibrary());
  await page.goto("/sets/set-verbs");
  await expect(page.getByRole("heading", { name: "Verbs" })).toBeVisible();

  await page.getByRole("button", { name: "Sort" }).click();
  await expect(page.getByRole("menuitem", { name: "Starred first" })).toBeVisible();
  await page.waitForTimeout(400); // menus scale in from 95%; measure once settled
  expect(await undersizedTargets(page)).toEqual([]);
  await page.keyboard.press("Escape");

  await page.getByRole("checkbox", { name: "Select gehen" }).check({ force: true });
  await page.getByRole("button", { name: /Copy to/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: /Nouns/ })).toBeVisible();
  await page.waitForTimeout(400);
  expect(await undersizedTargets(page)).toEqual([]);
});
