import { addDays, format, isSameDay } from "date-fns";
import { isStudiableSet, isWeakWord, summarizeLibrary } from "./srs/index.ts";
import { buildLibrarySession } from "./review-session.ts";
import { isCardActive, type Card, type CardProgress, type StudySet } from "./types.ts";

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

  const counted = countedCards(studiable);
  let weak = 0;
  for (const card of counted) if (isWeakAtRest(progress[card.id])) weak += 1;

  let studiedToday = 0;
  for (const card of counted) {
    const at = progress[card.id]?.lastReviewedAt;
    if (typeof at === "number" && utcDayKey(at) === dayKey) studiedToday += 1;
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

/**
 * The cards Today counts: active cards of studiable sets — exactly the pool
 * /review builds its round from.
 */
function countedCards(sets: StudySet[]): Card[] {
  return sets.filter(isStudiableSet).flatMap((set) => set.cards.filter(isCardActive));
}

/** Ids of the cards this set contributes to Today (none if it isn't studiable). */
export function countedCardIds(set: StudySet | null): Set<string> {
  return new Set(set ? countedCards([set]).map((card) => card.id) : []);
}

/**
 * Is this card weak on the strength of its own row alone?
 *
 * `isWeakWord` with the clock taken out: its fourth signal ("past its due
 * date") is the only one that changes without a write, and a counter kept in
 * step by writes can only track signals that move on writes. When nothing is
 * due — the only time Home shows the weak count — the two agree exactly.
 */
export function isWeakAtRest(progress: CardProgress | undefined): boolean {
  return isWeakWord(progress, { now: Number.NEGATIVE_INFINITY });
}

const isFresh = (p: CardProgress | undefined) => !p || p.state === "new" || p.dueAt === null;

/** What one card contributes to each counter, given its progress row (if any). */
export type CardCounts = { new: number; due: number; weak: number };

export function cardCounts(progress: CardProgress | undefined, now: number): CardCounts {
  return {
    new: isFresh(progress) ? 1 : 0,
    due: isDueNow(progress, now) ? 1 : 0,
    weak: isWeakAtRest(progress) ? 1 : 0,
  };
}

const clamp0 = (n: number) => Math.max(0, n);

/**
 * Sentinel for "the clock-dependent fields (`due`, `nextDueAt`) need a
 * re-count": `nextDueAt` at or before now already fails `isSummaryFresh`, so
 * setting it to `now` is exactly the existing rebuild trigger, no new field.
 */
function markClockStale(summary: TodaySummary, now: number): TodaySummary {
  return { ...summary, nextDueAt: now };
}

/**
 * The write-path patch for one graded review, applied inside its transaction.
 *
 * `new`, `weak` and `studiedToday` are always patched — they move only on
 * writes. `due`/`nextDueAt` are patched only while the clock fields are still
 * trustworthy; otherwise they are marked for a re-count rather than nudged from
 * a stale base. A rolled UTC day resets `studiedToday` here too, so the first
 * review after midnight is not lost to the lazy reset.
 */
export function applyReviewToSummary(
  summary: TodaySummary | null,
  input: { previous: CardProgress | null; next: CardProgress; now: number },
): TodaySummary | null {
  const { previous, next, now } = input;
  if (!summary) return null;

  const today = utcDayKey(now);
  const rolled = summary.dayKey !== today;
  const clockFresh = isSummaryFresh(summary, now);
  const before = cardCounts(previous ?? undefined, now);
  const after = cardCounts(next, now);
  const alreadyToday =
    previous?.lastReviewedAt != null && utcDayKey(previous.lastReviewedAt) === today;

  let out: TodaySummary = {
    ...summary,
    new: clamp0(summary.new + after.new - before.new),
    weak: clamp0(summary.weak + after.weak - before.weak),
    studiedToday: (rolled ? 0 : summary.studiedToday) + (alreadyToday ? 0 : 1),
    dayKey: today,
  };

  if (clockFresh) {
    let nextDueAt = summary.nextDueAt;
    if (typeof next.dueAt === "number" && next.dueAt > now) {
      nextDueAt = nextDueAt === null ? next.dueAt : Math.min(nextDueAt, next.dueAt);
    }
    out = { ...out, due: clamp0(summary.due + after.due - before.due), nextDueAt };
  } else {
    out = markClockStale(out, now);
  }
  return out;
}

/**
 * Apply cards entering or leaving Today's pool (set created/deleted/copied
 * into, card added/removed/archived, a set becoming studiable, progress reset).
 *
 * `new` and `weak` shift by the cards' own contributions. `due` shifts only
 * while the clock fields are trustworthy — a stale base gets re-counted on the
 * next read anyway. Never touches `dayKey`/`studiedToday`: the work already done
 * today doesn't change because a card left.
 */
export function applyCountDelta(
  summary: TodaySummary | null,
  delta: { added: CardCounts; removed: CardCounts },
  now: number,
): TodaySummary | null {
  if (!summary) return null;
  const move = (a: number, r: number) => a - r;
  return {
    ...summary,
    new: clamp0(summary.new + move(delta.added.new, delta.removed.new)),
    weak: clamp0(summary.weak + move(delta.added.weak, delta.removed.weak)),
    due: isSummaryFresh(summary, now)
      ? clamp0(summary.due + move(delta.added.due, delta.removed.due))
      : summary.due,
  };
}

/** Sum of `cardCounts` over rows; `undefined` = a card with no progress row. */
export function sumCounts(rows: (CardProgress | undefined)[], now: number): CardCounts {
  return rows.reduce<CardCounts>(
    (acc, row) => {
      const c = cardCounts(row, now);
      return { new: acc.new + c.new, due: acc.due + c.due, weak: acc.weak + c.weak };
    },
    { new: 0, due: 0, weak: 0 },
  );
}

/**
 * Re-count the clock fields onto a stored summary: `due` and `nextDueAt` from
 * the caller's aggregation/limit-1 query. `new`/`weak` are kept as counted by
 * the write paths; `studiedToday` restarts only if the UTC day really rolled.
 */
export function refreshClockFields(
  summary: TodaySummary,
  fresh: { due: number; nextDueAt: number | null },
  now: number,
): TodaySummary {
  const today = utcDayKey(now);
  return {
    ...summary,
    due: fresh.due,
    nextDueAt: fresh.nextDueAt,
    dayKey: today,
    studiedToday: summary.dayKey === today ? summary.studiedToday : 0,
  };
}

/** A full rebuild is forced after this long, as the drift safety net. */
export const FULL_REBUILD_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

/** Should a clock-triggered refresh be a full recompute instead of ~2 reads? */
export function needsFullRebuild(summary: TodaySummary | null, now: number): boolean {
  return !summary || now - summary.builtAt > FULL_REBUILD_AFTER_MS;
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
