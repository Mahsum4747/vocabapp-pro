/**
 * The AI budget: one counter for every Gemini call ANY user causes (set
 * generate/regenerate, per-card suggest, example suggest, WriteIt AI
 * feedback), per UTC day — a single project-wide pool, no per-user cap.
 *
 * Only calls that actually reach Gemini spend it — a cache hit is free — and a
 * set generation is ONE call however many cards it returns, never one per card.
 * Template-based feedback and TTS don't use Gemini and never touch this.
 *
 * There used to also be a per-user daily cap (`AI_DAILY_CAP_PER_USER`,
 * tracked in `users/{uid}.aiActionsToday`) on top of this pool. Removed:
 * the project-wide tripwire below is now the only limit — first-come,
 * first-served against the shared daily pool, no personal counter kept.
 */

/**
 * Generate fails for everyone once project-wide usage reaches this share of
 * the console ceiling, leaving headroom for the cheaper per-card assists.
 */
export const GLOBAL_TRIPWIRE_FRACTION = 0.7;

/**
 * Project-wide requests per day the Gemini console allows. 1,500 is the Flash
 * free-tier figure; the "20/day" mentioned in `example-suggestions.ts` is an
 * older quota and would trip the tripwire after a handful of users. Set
 * GEMINI_DAILY_CEILING to whatever AI Studio actually shows for this key.
 */
export const DEFAULT_GLOBAL_CEILING = 1500;

export const GLOBAL_TRIPWIRE_MESSAGE =
  "Today's shared AI quota is used up — it resets at midnight UTC.";

/** `generate` is what the tripwire protects; `assist` (per-card) runs until the ceiling itself. */
export type AiActionKind = "generate" | "assist";

export type SpendDecision =
  | { ok: true; globalCount: number; remaining: number }
  | { ok: false; reason: "global_tripwire"; error: string };

/** Pure: may the shared pool spend one more AI action today, given today's project-wide count? */
export function decideSpend(input: {
  kind: AiActionKind;
  globalCount: number;
  ceiling: number;
}): SpendDecision {
  const limit =
    input.kind === "generate"
      ? Math.floor(input.ceiling * GLOBAL_TRIPWIRE_FRACTION)
      : input.ceiling;
  if (input.globalCount >= limit) {
    return { ok: false, reason: "global_tripwire", error: GLOBAL_TRIPWIRE_MESSAGE };
  }
  return {
    ok: true,
    globalCount: input.globalCount + 1,
    remaining: limit - input.globalCount - 1,
  };
}

/** The ceiling from the environment, falling back to the documented default. */
export function ceilingFromEnv(value: string | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_GLOBAL_CEILING;
}
