import type { CardEnrichment, GrammaticalGender } from "./types.ts";

/**
 * The decision "what enrichment does this card get, on this save" — pure
 * and independent of Firestore, HTTP, and the German dictionary itself, so
 * it's exactly the same logic at every write path that constructs a `Card`
 * (create, edit) and is unit-testable without either. `study-sets.ts` wires
 * this to `enrichGermanTerm` for German sets; every other language passes a
 * lookup that always returns null, so the same code path runs everywhere
 * and there's no `if (language === 'de')` duplicated per call site.
 */

const VALID_GENDERS: readonly GrammaticalGender[] = ["m", "f", "n"];

/**
 * Narrows an untyped value — this arrives over the wire, same as every
 * other field on these endpoints — to a genuine user correction. Anything
 * else (wrong shape, an invalid gender, a `source` other than `"user"`) is
 * treated as absent rather than trusted: a client cannot fabricate a fake
 * dictionary or AI derivation by simply claiming a different `source`, and
 * cannot smuggle in a gender value this app doesn't recognize.
 */
export function sanitizeUserEnrichment(value: unknown): CardEnrichment | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (record.source !== "user") return null;

  const gender = VALID_GENDERS.includes(record.gender as GrammaticalGender)
    ? (record.gender as GrammaticalGender)
    : undefined;
  const plural =
    typeof record.plural === "string" && record.plural.trim() ? record.plural.trim() : undefined;

  return { source: "user", ...(gender ? { gender } : {}), ...(plural ? { plural } : {}) };
}

interface EnrichmentContext {
  isGermanTermLanguage: boolean;
  /** `enrichGermanTerm` in production; a fixture in tests, so this module
   *  never has to load the real 102k-record dictionary to be exercised. */
  dictLookup: (term: string) => CardEnrichment | null;
}

/**
 * The enrichment for a card whose write included an `enrichment` field —
 * every create, and the "the editor sent it" half of the
 * omitted-vs-sent convention `example`/`definition2` already use on edits.
 *
 * A user's own correction always wins, verbatim: never re-derived, never
 * merged with a fresh dictionary answer, whatever `dictLookup` would say.
 * Otherwise the field is (re)computed fresh from the dictionary every save
 * when the set's resolved term language is German, and left `null` for
 * every other language — this feature doesn't exist for them yet.
 * Recomputing rather than trusting a `"dict"`-sourced incoming value keeps
 * one source of truth: the server, not whatever a client happened to send.
 */
export function resolveEnrichment(
  term: string,
  incoming: unknown,
  context: EnrichmentContext,
): CardEnrichment | null {
  const userOverride = sanitizeUserEnrichment(incoming);
  if (userOverride) return userOverride;
  return context.isGermanTermLanguage ? context.dictLookup(term) : null;
}

/**
 * The enrichment a card keeps across an edit-page save when the editor
 * omitted the `enrichment` field entirely — an older client build that
 * doesn't know about it yet, the "omitted" half of the same convention.
 *
 * A previously-recorded user correction survives untouched. Anything else
 * is recomputed exactly as `resolveEnrichment` would on create, so a fix to
 * the dictionary (or to this code) reaches an existing card the next time
 * it's saved, rather than a stale value lingering on it forever.
 */
export function resolveEnrichmentOnOmit(
  term: string,
  prior: CardEnrichment | null | undefined,
  context: EnrichmentContext,
): CardEnrichment | null {
  if (prior?.source === "user") return prior;
  return context.isGermanTermLanguage ? context.dictLookup(term) : null;
}
