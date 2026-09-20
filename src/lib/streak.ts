import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth/middleware";
import { nextStreak, readStreak, todayUTC, type StoredStreak, type StreakInfo } from "./streak-rules.ts";

export type { StreakInfo } from "./streak-rules.ts";

/**
 * The user's streak as it stands right now. Doesn't write — if a day was
 * missed since `lastStudiedDate`, the streak reads as broken (0) here even
 * though the stored doc isn't reset until the next study session.
 */
export const getStreak = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<StreakInfo> => {
    const { getAdminFirestore } = await import("./firebase-admin.server");
    const db = getAdminFirestore();
    const doc = await db.collection("user_streaks").doc(context.userId).get();
    return readStreak(doc.exists ? (doc.data() as StoredStreak) : null, todayUTC());
  });

/**
 * Records study activity for today (UTC) for one user.
 *
 * Same-day calls are idempotent; a gap of exactly one day extends the streak;
 * any longer gap (or no prior record) restarts it at 1.
 *
 * Server-side helper rather than a server function, because the caller is
 * `recordReview` — a streak day is earned by actually completing a review, not
 * by opening a study mode and walking away.
 */
export async function recordStudyActivityFor(userId: string): Promise<StreakInfo> {
  const { getAdminFirestore } = await import("./firebase-admin.server");
  const db = getAdminFirestore();
  const ref = db.collection("user_streaks").doc(userId);
  const doc = await ref.get();
  const previous = doc.exists ? (doc.data() as StoredStreak) : null;

  const next = nextStreak(previous, todayUTC());
  await ref.set(next);
  return next;
}
