export type StreakInfo = {
  currentStreak: number;
  lastStudiedDate: string | null;
};

/** What is stored for a user who has studied at least once. */
export type StoredStreak = { lastStudiedDate: string; currentStreak: number };

/** Calendar date (UTC) as "YYYY-MM-DD" — the unit a streak day is counted in. */
export function todayUTC(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function daysBetween(laterDate: string, earlierDate: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const later = new Date(`${laterDate}T00:00:00Z`).getTime();
  const earlier = new Date(`${earlierDate}T00:00:00Z`).getTime();
  return Math.round((later - earlier) / msPerDay);
}

/**
 * The streak as it reads on `today`. Doesn't change what is stored — if a day
 * was missed since `lastStudiedDate`, the streak reads as broken (0) here even
 * though the stored doc isn't reset until the next study session.
 */
export function readStreak(stored: StoredStreak | null, today: string): StreakInfo {
  if (!stored) return { currentStreak: 0, lastStudiedDate: null };
  const gap = daysBetween(today, stored.lastStudiedDate);
  if (gap > 1) return { currentStreak: 0, lastStudiedDate: stored.lastStudiedDate };
  return { currentStreak: stored.currentStreak, lastStudiedDate: stored.lastStudiedDate };
}

/**
 * The streak after a review on `today`: same-day reviews are idempotent, a gap
 * of exactly one day extends the streak, any longer gap (or no prior record)
 * restarts it at 1.
 */
export function nextStreak(previous: StoredStreak | null, today: string): StreakInfo {
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
  return { currentStreak, lastStudiedDate: today };
}
