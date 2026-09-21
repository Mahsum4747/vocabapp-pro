import { expect, test } from "./support/app";
import { queueLibrary } from "./support/library";

test("term fields turn off the phone keyboard's capitalise / correct / spellcheck", async ({
  page,
  launch,
}) => {
  await launch(queueLibrary());
  await page.goto("/create");
  const term = page.getByLabel("Term", { exact: true }).first();
  await expect(term).toBeVisible();
  await expect(term).toHaveAttribute("autocapitalize", "none");
  await expect(term).toHaveAttribute("autocorrect", "off");
  await expect(term).toHaveAttribute("spellcheck", "false");
});
