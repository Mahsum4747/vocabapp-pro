import { expect, test } from "./support/app";
import { card, DAY, NOW, reviewed, studySet, type Seed } from "./support/backend";

function oneDueSet(extra: Partial<Seed>): Seed {
  return {
    sets: [studySet("set-a", "Verbs", [card("gehen", "to go"), card("kommen", "to come")])],
    progress: [
      reviewed("gehen", "set-a", { dueAt: NOW - 60 * 60 * 1000 }),
      reviewed("kommen", "set-a", { dueAt: NOW - 60 * 60 * 1000 }),
    ],
    ...extra,
  };
}

/**
 * These check how the streak the server REPORTS is shown. The streak's own
 * rules (extend on the next day, reset after a gap) live server-side in
 * src/lib/streak.ts and are covered by src/lib/streak.test.ts — a browser test
 * over a mocked server could only echo whatever the mock says.
 */
test.describe("streak on the home screen", () => {
  test("shows the streak the server reports", async ({ page, launch }) => {
    await launch(oneDueSet({ streak: { currentStreak: 5, lastStudiedDate: "2026-03-09" } }));
    await page.goto("/");
    await expect(page.getByText("streak")).toBeVisible();
    await expect(page.getByText(/5\s*days streak/)).toBeVisible();
  });

  test("shows no streak when the server reports it broken (0)", async ({ page, launch }) => {
    await launch(
      oneDueSet({
        streak: {
          currentStreak: 0,
          lastStudiedDate: new Date(NOW - 3 * DAY).toISOString().slice(0, 10),
        },
      }),
    );
    await page.goto("/");
    await expect(page.getByText(/words? waiting/)).toBeVisible();
    await expect(page.getByText(/days? streak/)).toHaveCount(0);
  });

  test("picks up the new streak after a review, without a reload", async ({ page, launch }) => {
    const { backend } = await launch(
      oneDueSet({
        streak: { currentStreak: 0, lastStudiedDate: null },
        streakAfterReview: { currentStreak: 1, lastStudiedDate: "2026-03-10" },
      }),
    );
    await page.goto("/");
    await expect(page.getByText(/days? streak/)).toHaveCount(0);

    await page.getByRole("link", { name: /words waiting/ }).click();
    await page.getByRole("button", { name: "Good", exact: true }).click();
    await expect.poll(() => backend.reviews.length).toBe(1); // the write is fire-and-forget
    await page.getByRole("link", { name: "Back to library" }).click();

    await expect(page.getByText(/1\s*day streak/)).toBeVisible();
  });
});
