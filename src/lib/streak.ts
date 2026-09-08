import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth/middleware";

export type StreakInfo = {
  currentStreak: number;
  lastStudiedDate: string | null;
};

/** Calendar date (UTC) as "YYYY-MM-DD" — the unit a streak day is counted in. */
function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(laterDate: string, earlierDate: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const later = new Date(`${laterDate}T00:00:00Z`).getTime();
  const earlier = new Date(`${earlierDate}T00:00:00Z`).getTime();
  return Math.round((later - earlier) / msPerDay);
}

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
    if (!doc.exists) return { currentStreak: 0, lastStudiedDate: null };
    const data = doc.data() as { lastStudiedDate: string; currentStreak: number };
    const gap = daysBetween(todayUTC(), data.lastStudiedDate);
    if (gap > 1) return { currentStreak: 0, lastStudiedDate: data.lastStudiedDate };
    return { currentStreak: data.currentStreak, lastStudiedDate: data.lastStudiedDate };
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
  const today = todayUTC();
  const previous = doc.exists
    ? (doc.data() as { lastStudiedDate: string; currentStreak: number })
    : null;

  let currentStreak: number;
  if (!previous) {
    currentStreak = 1;
  } else if (previous.lastStudiedDate === today) {
    currentStreak = previous.currentStreak;
  } else if (daysBetween(today, previous.lastStudiedDate) === 1) {
    currentStreak = previous.currentStreak + 1;
  } else {
    currentStreak = 1;
  }

  const next: StreakInfo = { currentStreak, lastStudiedDate: today };
  await ref.set(next);
  return next;
}
