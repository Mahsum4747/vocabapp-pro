import { utcDayKey } from "./today-summary.ts";

/**
 * The AI budget: one counter for every Gemini call a user causes (set
 * generate/regenerate, per-card suggest, example suggest), per UTC day.
 *
 * Only calls that actually reach Gemini spend it — a cache hit is free — and a
 * set generation is ONE call however many cards it returns, never one per card.
 * Template-based feedback and TTS don't use Gemini and never touch this.
 */

/** Placeholder free cap: AI actions per user per UTC day. */
export const AI_DAILY_CAP_PER_USER = 5;

/**
 * Generate fails for everyone once project-wide usage reaches this share of
 * the console ceiling, leaving headroom for the cheaper per-card assists.
 */
export const GLOBAL_TRIPWIRE_FRACTION = 0.7;

/**
 * Project-wide requests per day the Gemini console allows. 20 is the free-tier
 * figure `example-suggestions.ts` already documents; set GEMINI_DAILY_CEILING to
 * whatever the console actually shows.
 */
export const DEFAULT_GLOBAL_CEILING = 20;

export const USER_CAP_MESSAGE =
  "You've used today's AI quota. Tomorrow's quota resets at midnight UTC.";
export const GLOBAL_TRIPWIRE_MESSAGE =
  "AI generation is paused for everyone right now. The quota resets at midnight UTC — try again tomorrow.";

/** `generate` is what the tripwire protects; `assist` (per-card) runs until the ceiling itself. */
export type AiActionKind = "generate" | "assist";

export type StoredAiActions = { dayKey: string; count: number };

/** Read `users/{uid}.aiActionsToday`, treating a missing or previous-day counter as zero. */
export function readAiActionsToday(stored: unknown, now: number): StoredAiActions {
  const dayKey = utcDayKey(now);
  const raw = (stored ?? {}) as Record<string, unknown>;
  const count =
    raw.dayKey === dayKey && typeof raw.count === "number" && Number.isFinite(raw.count)
      ? Math.max(0, Math.floor(raw.count))
      : 0;
  return { dayKey, count };
}

export type SpendDecision =
  | { ok: true; userCount: number; globalCount: number; remaining: number }
  | { ok: false; reason: "user_cap" | "global_tripwire"; error: string };

/** Pure: may this user spend one more AI action, given today's two counters? */
export function decideSpend(input: {
  kind: AiActionKind;
  userCount: number;
  globalCount: number;
  ceiling: number;
  cap?: number;
}): SpendDecision {
  const cap = input.cap ?? AI_DAILY_CAP_PER_USER;
  const limit =
    input.kind === "generate"
      ? Math.floor(input.ceiling * GLOBAL_TRIPWIRE_FRACTION)
      : input.ceiling;
  if (input.globalCount >= limit) {
    return { ok: false, reason: "global_tripwire", error: GLOBAL_TRIPWIRE_MESSAGE };
  }
  if (input.userCount >= cap) {
    return { ok: false, reason: "user_cap", error: USER_CAP_MESSAGE };
  }
  return {
    ok: true,
    userCount: input.userCount + 1,
    globalCount: input.globalCount + 1,
    remaining: cap - input.userCount - 1,
  };
}

/** The ceiling from the environment, falling back to the documented default. */
export function ceilingFromEnv(value: string | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_GLOBAL_CEILING;
}
