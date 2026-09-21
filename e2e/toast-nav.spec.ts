import { expect, test } from "./support/app";
import { queueLibrary } from "./support/library";

test("a toast sits above the mobile bottom nav, not under it", async ({ page, launch, isMobile }) => {
  test.skip(!isMobile, "the bottom nav only exists on phones");
  await launch(queueLibrary());
  await page.goto("/sets/set-verbs");
  await expect(page.getByRole("heading", { name: "Verbs" })).toBeVisible();

  await page.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: "Export" }).click();
  const toast = page.locator("[data-sonner-toast]").first();
  await expect(toast).toBeVisible();
  await page.waitForTimeout(500); // let the enter animation settle

  const nav = page.getByRole("navigation", { name: "Primary" });
  const [toastBox, navBox] = await Promise.all([toast.boundingBox(), nav.boundingBox()]);
  expect(toastBox!.y + toastBox!.height).toBeLessThanOrEqual(navBox!.y);
});
