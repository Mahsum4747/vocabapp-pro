import { addDays, format, isSameDay } from "date-fns";
import { isStudiableSet, isWeakWord, summarizeLibrary, weakCards } from "./srs/index.ts";
import { buildLibrarySession } from "./review-session.ts";
import { isCardActive, type CardProgress, type StudySet } from "./types.ts";

/**
 * The cached answer to "what does Today look like?", stored on `users/{uid}`
 * so Home costs one document read instead of a library-wide scan.
 *
 * Every count uses the definitions the /review route already runs on
 * (`summarizeLibrary`, `weakCards`, `buildLibrarySession`) — this file only
 * caches and patches them, it does not define due/new/weak a second time.
 */
export type TodaySummary = {
  /** Cards whose `dueAt` has passed (includes overdue). */
  due: number;
  /**
   * Never-studied cards in the library, NOT capped by the daily goal — the cap
   * depends on the goal, which lives beside this on the user doc, so it is
   * applied at read time (`newLeftToday`) and a goal change needs no rewrite.
   */
  new: number;
  /** Weak cards that are not already counted in `due`. */
  weak: number;
  /** Distinct cards reviewed on `dayKey`. Lazily reset by a rebuild. */
  studiedToday: number;
  /** UTC calendar day this summary describes, "YYYY-MM-DD". */
  dayKey: string;
  /** Soonest future `dueAt` among scheduled cards, or null if none. */
  nextDueAt: number | null;
  /** Epoch ms of the last full rebuild. */
  builtAt: number;
};

/** UTC "YYYY-MM-DD". UTC on purpose for now — no copy may call it "your day". */
export function utcDayKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * Can Home trust this stored summary as-is?
 *
 * Two independent ways it goes stale with no write event: the UTC day rolled
 * (`studiedToday` is yesterday's), or `nextDueAt` has passed (cards became due
 * while nobody was reviewing). Either forces a rebuild.
 */
export function isSummaryFresh(summary: TodaySummary | null, now: number): boolean {
  if (!summary) return false;
  if (summary.dayKey !== utcDayKey(now)) return false;
  return summary.nextDueAt === null || summary.nextDueAt > now;
}

/** Read whatever is stored on the user doc back into a summary, or null. */
export function readTodaySummary(stored: unknown): TodaySummary | null {
  if (!stored || typeof stored !== "object") return null;
  const raw = stored as Record<string, unknown>;
  const count = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : null;
  const due = count(raw.due);
  const fresh = count(raw.new);
  const weak = count(raw.weak);
  const studiedToday = count(raw.studiedToday);
  const builtAt = count(raw.builtAt);
  if (
    due === null ||
    fresh === null ||
    weak === null ||
    studiedToday === null ||
    builtAt === null ||
    typeof raw.dayKey !== "string"
  ) {
    return null;
  }
  const nextDueAt =
    typeof raw.nextDueAt === "number" && Number.isFinite(raw.nextDueAt) ? raw.nextDueAt : null;
  return { due, new: fresh, weak, studiedToday, dayKey: raw.dayKey, nextDueAt, builtAt };
}

/** Full rebuild from the library and every progress row. */
export function buildTodaySummary(
  sets: StudySet[],
  progress: Record<string, CardProgress>,
  now: number,
): TodaySummary {
  const dayKey = utcDayKey(now);
  const studiable = sets.filter(isStudiableSet);
  const { totals } = summarizeLibrary(studiable, progress, { now });

  // A weak card that is also due is already in `due`; count it once.
  let weak = 0;
  for (const set of studiable) {
    weak += weakCards(set.cards, progress, { now }).filter(
      (card) => !isDueNow(progress[card.id], now),
    ).length;
  }

  let studiedToday = 0;
  for (const set of studiable) {
    for (const card of set.cards) {
      if (!isCardActive(card)) continue;
      const at = progress[card.id]?.lastReviewedAt;
      if (typeof at === "number" && utcDayKey(at) === dayKey) studiedToday += 1;
    }
  }

  return {
    due: totals.due,
    new: totals.fresh,
    weak,
    studiedToday,
    dayKey,
    nextDueAt: buildLibrarySession(studiable, progress, { now }).nextDueAt,
    builtAt: now,
  };
}

function isDueNow(progress: CardProgress | undefined, now: number): boolean {
  return (
    !!progress &&
    progress.state !== "new" &&
    typeof progress.dueAt === "number" &&
    progress.dueAt <= now
  );
}

type Bucket = "new" | "due" | "weak" | "other";

/** Which of the summary's counters a card currently sits in. Mirrors `bandOf`. */
function bucketOf(progress: CardProgress | undefined, now: number): Bucket {
  if (!progress || progress.state === "new" || progress.dueAt === null) return "new";
  if (isDueNow(progress, now)) return "due";
  return isWeakWord(progress, { now }) ? "weak" : "other";
}

/**
 * Move one reviewed card between counters — the write-path patch that rides in
 * the review transaction.
 *
 * Returns null when the stored summary can't be safely patched (missing, a
 * different day, or `nextDueAt` already passed); the next Home read rebuilds
 * it, so skipping is always correct, just not free.
 */
export function applyReviewToSummary(
  summary: TodaySummary | null,
  input: { previous: CardProgress | null; next: CardProgress; now: number },
): TodaySummary | null {
  const { previous, next, now } = input;
  if (!summary || !isSummaryFresh(summary, now)) return null;

  const counts: Record<Bucket, number> = {
    new: summary.new,
    due: summary.due,
    weak: summary.weak,
    other: 0,
  };
  const from = bucketOf(previous ?? undefined, now);
  const to = bucketOf(next, now);
  if (from !== "other") counts[from] = Math.max(0, counts[from] - 1);
  if (to !== "other") counts[to] += 1;

  const today = summary.dayKey;
  const alreadyToday =
    previous?.lastReviewedAt != null && utcDayKey(previous.lastReviewedAt) === today;

  let nextDueAt = summary.nextDueAt;
  if (typeof next.dueAt === "number" && next.dueAt > now) {
    nextDueAt = nextDueAt === null ? next.dueAt : Math.min(nextDueAt, next.dueAt);
  }

  return {
    ...summary,
    due: counts.due,
    new: counts.new,
    weak: counts.weak,
    studiedToday: summary.studiedToday + (alreadyToday ? 0 : 1),
    nextDueAt,
  };
}

/** New cards still owed today: the goal minus what's been studied, capped by supply. */
export function newLeftToday(summary: TodaySummary, dailyGoal: number): number {
  return Math.max(0, Math.min(summary.new, dailyGoal - summary.studiedToday));
}

export type TodayQueue =
  | { kind: "items"; due: number; weak: number; newLeft: number; line: string }
  | { kind: "empty"; line: string; nextLine: string | null };

/** "Next review: tomorrow, 15:00" — shown in the viewer's own clock. */
export function formatNextReview(nextDueAt: number, now: number): string {
  const at = new Date(nextDueAt);
  const time = format(at, "HH:mm");
  if (isSameDay(at, now)) return `Next review: today, ${time}`;
  if (isSameDay(at, addDays(now, 1))) return `Next review: tomorrow, ${time}`;
  return `Next review: ${format(at, "EEE d MMM")}, ${time}`;
}

/**
 * Today's queue and its copy. Order is due → weak → new; the line never says
 * "caught up" while a new card is still owed.
 */
export function describeToday(summary: TodaySummary, dailyGoal: number, now: number): TodayQueue {
  const newLeft = newLeftToday(summary, dailyGoal);
  if (summary.due > 0 || summary.weak > 0 || newLeft > 0) {
    return {
      kind: "items",
      due: summary.due,
      weak: summary.weak,
      newLeft,
      line: `${summary.due} due · ${newLeft} new left for today's goal.`,
    };
  }
  return {
    kind: "empty",
    line: "Nothing due. You can still open a set.",
    nextLine: summary.nextDueAt === null ? null : formatNextReview(summary.nextDueAt, now),
  };
}
