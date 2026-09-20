import type { Page } from "@playwright/test";
import { expect, test } from "./support/app";
import { queueLibrary } from "./support/library";

/** The terms currently listed, in order, read from each row's checkbox label. */
async function listedTerms(page: Page): Promise<string[]> {
  const labels = await page
    .getByRole("checkbox", { name: /^Select / })
    .evaluateAll((els) => els.map((el) => el.getAttribute("aria-label") ?? ""));
  return labels.map((l) => l.replace(/^Select /, ""));
}

/** Pick a sort option and wait for the menu to close (Radix hides the page from
 *  the accessibility tree while it is open, so reading the list earlier races). */
async function sortBy(page: Page, option: string) {
  await page.getByRole("button", { name: "Sort" }).click();
  await page.getByRole("menuitem", { name: option }).click();
  await expect(page.getByRole("menu")).toHaveCount(0);
}

test.describe("filtering the words in a set", () => {
  test.beforeEach(async ({ page, launch }) => {
    await launch(queueLibrary());
    await page.goto("/sets/set-verbs");
    await expect(page.getByRole("heading", { name: "Verbs" })).toBeVisible();
  });

  test("lists active and excluded cards, but not archived ones", async ({ page }) => {
    expect(await listedTerms(page)).toEqual([
      "gehen",
      "kommen",
      "bleiben",
      "lernen",
      "sprechen",
      "vergessen",
      "schlafen",
    ]);
    await expect(page.getByText("Excluded", { exact: true })).toBeVisible();
  });

  test("search matches the term, case-insensitively", async ({ page }) => {
    await page.getByLabel("Search cards").fill("GEH");
    expect(await listedTerms(page)).toEqual(["gehen"]);
  });

  test("search matches the definition and the example sentence", async ({ page }) => {
    await page.getByLabel("Search cards").fill("to c");
    expect(await listedTerms(page)).toEqual(["kommen"]);

    await page.getByLabel("Search cards").fill("nach hause");
    expect(await listedTerms(page)).toEqual(["gehen"]);
  });

  test("search ignores surrounding spaces and reports no match", async ({ page }) => {
    await page.getByLabel("Search cards").fill("  lernen  ");
    expect(await listedTerms(page)).toEqual(["lernen"]);

    await page.getByLabel("Search cards").fill("zzz");
    await expect(page.getByText("No cards match your search.")).toBeVisible();
    expect(await listedTerms(page)).toEqual([]);
  });

  test("search never surfaces an archived card in the normal view", async ({ page }) => {
    await page.getByLabel("Search cards").fill("warten");
    await expect(page.getByText("No cards match your search.")).toBeVisible();
  });

  test("the Archived tab shows only archived cards, and Cards brings the rest back", async ({
    page,
  }) => {
    await page.getByText("Archived (1)").click();
    expect(await listedTerms(page)).toEqual(["warten"]);

    await page.getByText("Cards", { exact: true }).click();
    expect((await listedTerms(page)).length).toBe(7);
  });

  test("sorting: A–Z and starred-first reorder the same words", async ({ page }) => {
    await sortBy(page, "Alphabetical (A–Z)");
    expect(await listedTerms(page)).toEqual([
      "bleiben",
      "gehen",
      "kommen",
      "lernen",
      "schlafen",
      "sprechen",
      "vergessen",
    ]);

    await sortBy(page, "Starred first");
    const starredFirst = await listedTerms(page);
    expect(starredFirst[0]).toBe("kommen"); // the only starred card
    expect(starredFirst).toHaveLength(7);
  });

  test("search and sort combine", async ({ page }) => {
    await page.getByLabel("Search cards").fill("to s");
    await sortBy(page, "Alphabetical (A–Z)");
    // "to stay", "to sleep", "to speak" — alphabetical by term.
    expect(await listedTerms(page)).toEqual(["bleiben", "schlafen", "sprechen"]);
  });
});
