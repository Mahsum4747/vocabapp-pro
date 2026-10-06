import { mkdirSync } from "node:fs";
import { expect, test } from "./support/app";
import { queueLibrary } from "./support/library";

test("compiled legacy entries, Grammar index and browser history", async ({
  page,
  launch,
  isMobile,
}, info) => {
  test.setTimeout(60_000);
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  const harness = await launch({
    ...queueLibrary(),
    handlers: {
      updateSetSession: (data) => {
        expect(data).toEqual(
          expect.objectContaining({
            setId: "set-verbs",
            served: expect.arrayContaining(["gehen"]),
          }),
        );
        return undefined;
      },
    },
  });
  const grammar = page.getByRole("heading", { name: "Grammar practice", exact: true });
  for (const path of ["/grammar", "/grammar/"]) {
    await page.goto(path);
    await expect(grammar).toBeVisible();
    await page.reload();
    await expect(grammar).toBeVisible();
  }
  mkdirSync("screenshots/compiled-legacy", { recursive: true });
  await page.screenshot({
    path: `screenshots/compiled-legacy/grammar-${info.project.name}.png`,
    fullPage: true,
  });
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await page.getByRole("link", { name: /^Grammar practice/ }).click();
  await expect(grammar).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("main")).toBeVisible();
  await page.goForward();
  await expect(grammar).toBeVisible();
  await page.getByRole("link", { name: /^Lesen / }).click();
  await expect(page.getByRole("button", { name: /Start A1/ })).toBeVisible();
  await page.screenshot({
    path: `screenshots/compiled-legacy/lesen-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(grammar).toBeVisible();
  await page.goto("/sets/set-verbs/learn");
  await expect(page.getByRole("heading", { name: "to go", exact: true })).toBeVisible();
  await page.screenshot({
    path: `screenshots/compiled-legacy/vocabulary-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("textbox", { name: "Type the term", exact: true }).fill("gehen");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeVisible();
  await expect.poll(() => harness.serverFns.callsTo("updateSetSession").length).toBe(1);
  await page.getByRole("link", { name: "Back to set", exact: true }).click();
  await page.getByRole("link", { name: "Library", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("main")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("signed-out Grammar redirects without legacy data reads", async ({ page, launch }) => {
  const harness = await launch(queueLibrary());
  await page.route("**/api/auth/get-session", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "null" }),
  );
  await page.goto("/grammar");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();
  expect(harness.serverFns.callsTo("getGrammarProgress")).toHaveLength(0);
  expect(harness.serverFns.callsTo("fetchSets")).toHaveLength(0);
});
