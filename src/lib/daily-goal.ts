/**
 * The daily goal: how many words the learner means to work on each day.
 *
 * The decisions live here as plain functions — what the allowed goals are,
 * what a user with no settings document gets, and how a stored document is
 * read back — so they can be tested without Firestore. The server function in
 * `study-sets.ts` only stores and fetches.
 */

/** The goals the UI offers. A free-form number would make the copy meaningless. */
export const DAILY_GOAL_OPTIONS = [5, 10, 20, 30] as const;

export type DailyGoalOption = (typeof DAILY_GOAL_OPTIONS)[number];

export const DEFAULT_DAILY_GOAL: DailyGoalOption = 10;

/**
 * The timezone assumed for a user who has never told us theirs.
 *
 * UTC is the honest default: it is what `user_streaks` already counts days in,
 * so an unset timezone leaves today's behaviour exactly as it is.
 */
export const DEFAULT_TIME_ZONE = "UTC";

export type UserSettings = {
  dailyGoal: DailyGoalOption;
  /** IANA zone name, e.g. "Europe/Berlin". */
  timeZone: string;
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  dailyGoal: DEFAULT_DAILY_GOAL,
  timeZone: DEFAULT_TIME_ZONE,
};

export function isDailyGoalOption(value: unknown): value is DailyGoalOption {
  return typeof value === "number" && (DAILY_GOAL_OPTIONS as readonly number[]).includes(value);
}

/**
 * Is this a plausible IANA timezone name?
 *
 * A shape check, not a lookup: the value ends up stored and later handed to
 * date formatting, and the point is to reject junk (path separators, control
 * characters, an essay) rather than to police the tz database, which changes
 * without us.
 */
export function isTimeZoneName(value: unknown): value is string {
  return (
    typeof value === "string" && /^[A-Za-z][A-Za-z0-9_+-]*(\/[A-Za-z0-9_+-]+){0,2}$/.test(value)
  );
}

/**
 * Read settings out of whatever is stored at `users/{uid}`.
 *
 * Every existing user has no document at all, and a document written by an
 * older version may be missing fields or carry a goal we no longer offer. All
 * three cases mean the same thing to the reader: fall back to the default,
 * field by field, rather than failing or returning a goal the UI can't show.
 */
export function readUserSettings(stored: unknown): UserSettings {
  const doc = (stored ?? {}) as Record<string, unknown>;
  return {
    dailyGoal: isDailyGoalOption(doc.dailyGoal) ? doc.dailyGoal : DEFAULT_DAILY_GOAL,
    timeZone: isTimeZoneName(doc.timeZone) ? doc.timeZone : DEFAULT_TIME_ZONE,
  };
}

/** Did the learner meet the goal on a day with this many unique words? */
export function goalMet(uniqueWordsReviewed: number, goal: number): boolean {
  return Number.isFinite(uniqueWordsReviewed) && uniqueWordsReviewed >= goal;
}
