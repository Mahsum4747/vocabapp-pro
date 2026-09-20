import { expect, test } from "./support/app";
import { card, DAY, NOW, reviewed, studySet, TODAY_KEY, type Seed } from "./support/backend";

const cardFace = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: /Show (definition|term)/ });

/** Four cards in identical, due-today state — only the grade will differ. */
function identicalDueCards(): Seed {
  const terms = ["eins", "zwei", "drei", "vier"];
  return {
    sets: [studySet("set-nums", "Numbers", terms.map((t) => card(t, `def ${t}`)))],
    progress: terms.map((t) => reviewed(t, "set-nums", { dueAt: NOW - 60 * 60 * 1000 })),
  };
}

test.describe("flipping and grading a card", () => {
  test("clicking or pressing Space flips between term and definition", async ({ page, launch }) => {
    await launch(identicalDueCards());
    await page.goto("/review");

    await expect(cardFace(page)).toContainText("eins");
    await expect(cardFace(page)).not.toContainText("def eins");

    await cardFace(page).click();
    await expect(cardFace(page)).toContainText("def eins");

    await page.keyboard.press("Space");
    await expect(cardFace(page)).toContainText("eins");
    await expect(cardFace(page)).not.toContainText("def eins");
  });

  test("each button sends its own rating for the card on screen", async ({ page, launch }) => {
    const { backend, serverFns } = await launch(identicalDueCards());
    await page.goto("/review");

    for (const [term, button] of [
      ["eins", "Again"],
      ["zwei", "Hard"],
      ["drei", "Good"],
      ["vier", "Easy"],
    ] as const) {
      await expect(cardFace(page)).toContainText(term);
      await cardFace(page).click(); // grading from the answer side, as a learner would
      await page.getByRole("button", { name: button, exact: true }).click();
    }
    await expect(page.getByRole("heading", { name: "Round over" })).toBeVisible();
    // Grading is fire-and-forget by design (the learner never waits on the
    // network), so the requests can land just after the UI has moved on.
    await expect.poll(() => serverFns.callsTo("recordReview").length).toBe(4);

    // What the browser actually sent to the server.
    const sent = serverFns.callsTo("recordReview").map((c) => c.data as Record<string, unknown>);
    expect(sent.map((d) => [d.cardId, d.rating])).toEqual([
      ["eins", "again"],
      ["zwei", "hard"],
      ["drei", "good"],
      ["vier", "easy"],
    ]);
    for (const data of sent) {
      expect(data.setId).toBe("set-nums");
      expect(data.date).toBe(TODAY_KEY); // the viewer's local day
      expect(typeof data.responseTimeMs).toBe("number");
    }
    expect(backend.reviews).toHaveLength(4);
  });

  test("the SRS interval follows the grade: again < hard < good < easy", async ({ page, launch }) => {
    const { backend } = await launch(identicalDueCards());
    await page.goto("/review");

    for (const button of ["Again", "Hard", "Good", "Easy"]) {
      await page.getByRole("button", { name: button, exact: true }).click();
    }
    await expect(page.getByRole("heading", { name: "Round over" })).toBeVisible();
    await expect.poll(() => backend.reviews.length).toBe(4); // writes are fire-and-forget

    // Identical starting rows, so any difference comes from the grade alone.
    const [again, hard, good, easy] = ["eins", "zwei", "drei", "vier"].map(
      (t) => backend.progressOf(t)!,
    );
    expect(again.intervalDays).toBeLessThan(hard.intervalDays);
    expect(hard.intervalDays).toBeLessThan(good.intervalDays);
    expect(good.intervalDays).toBeLessThan(easy.intervalDays);

    for (const row of [again, hard, good, easy]) {
      // The stored due date is the review time plus the stored interval
      // (to the millisecond: the date is rounded, the interval is fractional).
      expect(Math.abs(row.dueAt! - (NOW + row.intervalDays * DAY))).toBeLessThanOrEqual(1);
      expect(row.lastReviewedAt).toBe(NOW);
      expect(row.lastReviewedDate).toBe(TODAY_KEY);
      expect(row.totalReviews).toBe(5); // 4 before + this one
    }
    // A wrong answer breaks the correct-in-a-row run; the others extend it.
    expect(again.consecutiveCorrect).toBe(0);
    expect(good.consecutiveCorrect).toBe(5);
  });

  test("a graded card leaves the queue: nothing left due afterwards", async ({ page, launch }) => {
    const { backend } = await launch(identicalDueCards());
    await page.goto("/");
    await expect(page.getByText("4 words waiting")).toBeVisible();

    await page.getByRole("link", { name: /words waiting/ }).click();
    for (let i = 0; i < 4; i++) {
      await page.getByRole("button", { name: "Good", exact: true }).click();
    }
    await expect(page.getByRole("heading", { name: "Round over" })).toBeVisible();
    // Don't navigate away while a write is still in flight.
    await expect.poll(() => backend.reviews.length).toBe(4);

    // A fresh load reads the rescheduled rows back from the (mock) server.
    await page.goto("/");
    await expect(page.getByText(/words? waiting/)).toHaveCount(0);
    await page.goto("/review");
    await expect(page.getByRole("heading", { name: "You're all caught up" })).toBeVisible();
  });
});
