import { expect, test } from "./support/app";
import { queueLibrary } from "./support/library";

const cardFace = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: /Show (definition|term)/ });

test.describe("Start review → the right words", () => {
  test("banner counts only due words, and the round serves them in priority order", async ({
    page,
    launch,
  }) => {
    const { serverFns } = await launch(queueLibrary());
    await page.goto("/");

    // Due = overdue (gehen) + due (kommen) + due in another set (Tisch).
    // Excluded, archived, reference-set and one-card-set cards are not counted,
    // nor is the not-due, new or weak material.
    await expect(page.getByText("3 words waiting")).toBeVisible();
    await expect(page.getByText("1 overdue · 3 due total")).toBeVisible();

    await page.getByRole("link", { name: /words waiting/ }).click();
    await expect(page).toHaveURL(/\/review$/);

    // Overdue first, then due (in library order), then a weak card, then new.
    const expected: Array<[string, string, string]> = [
      ["gehen", "Overdue", "Verbs"],
      ["kommen", "Due today", "Verbs"],
      ["Tisch", "Due today", "Nouns"],
      ["sprechen", "Needs practice", "Verbs"],
      ["lernen", "New", "Verbs"],
    ];
    for (const [index, [term, band, setTitle]] of expected.entries()) {
      await expect(page.getByText(`${index + 1} / ${expected.length}`)).toBeVisible();
      await expect(cardFace(page)).toContainText(term);
      await expect(page.getByText(band, { exact: true })).toBeVisible();
      await expect(page.getByText(setTitle, { exact: true }).last()).toBeVisible();
      // Move on without grading, so nothing is written.
      await page.keyboard.press("ArrowRight");
    }
    // Exactly five cards: bleiben/vergessen (not due), schlafen (excluded),
    // warten (archived), the reference set and the one-card set never appear.
    await expect(page.getByRole("heading", { name: "Round over" })).toBeVisible();
    // Browsing a round writes nothing.
    expect(serverFns.callsTo("recordReview")).toHaveLength(0);
  });

  test("the weak filter is a different question: only weak words, worst first", async ({
    page,
    launch,
  }) => {
    await launch(queueLibrary());
    await page.goto("/review?filter=weak");

    // Lowest mastery first: vergessen (30) before sprechen (40). Both carry
    // the round's own label, not a per-card band.
    await expect(page.getByText("1 / 2")).toBeVisible();
    await expect(cardFace(page)).toContainText("vergessen");
    await expect(page.getByText("Weak words", { exact: true }).first()).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(cardFace(page)).toContainText("sprechen");
  });

  test("with nothing due, the round says so and offers nothing to click", async ({
    page,
    launch,
  }) => {
    const seed = queueLibrary();
    // Only comfortable, not-due cards: no fresh, weak or due material.
    seed.sets = seed.sets.filter((s) => s.id === "set-nouns");
    seed.progress = seed.progress!.filter((p) => p.setId === "set-nouns").map((p) => ({ ...p, dueAt: p.dueAt! + 30 * 24 * 60 * 60 * 1000 }));
    await launch(seed);
    await page.goto("/review");
    await expect(page.getByRole("heading", { name: "You're all caught up" })).toBeVisible();
    await expect(page.getByText(/Nothing is due yet\. Your next card comes up/)).toBeVisible();
  });
});
