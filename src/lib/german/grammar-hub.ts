import { clozeBlankForCard } from "@/lib/cloze";
import { satzbauChipsForCard } from "@/lib/satzbau";
import { lookupVerbConjugation, separablePrefixOf } from "@/lib/german/verb-conjugation-data";
import { masteryPercent, type ProgressMap } from "@/lib/quiz";
import { isCardActive, resolveSetLanguages } from "@/lib/types";
import { profileFor } from "@/lib/lang/profiles";
import type { Card, StudySet } from "@/lib/types";
import type { NounEntry } from "@/lib/german/types";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

/**
 * The five real grammar-mode eligibility checks, factored out of
 * sets.$setId.index.tsx so both that page and the grammar hub (route
 * /grammar) compute "does this set qualify for this mode" the exact same
 * way. Each function is set-scoped and pure — no store reads, no progress —
 * matching the inline booleans sets.$setId.index.tsx used to compute itself.
 */

/** Article drill + case grid share this same eligibility pool (known gender
 *  on a German card) — same as the inline checks on the set page. */
export function hasArticleDrillCards(set: StudySet): boolean {
  const termProfile = profileFor(resolveSetLanguages(set).term);
  return termProfile.hasNounEnrichment && set.cards.some((card) => card.enrichment?.gender);
}

/** Case grid uses the identical pool as the article drill — kept as its own
 *  named function so a future divergence doesn't require renaming call sites. */
export function hasCaseDrillCards(set: StudySet): boolean {
  return hasArticleDrillCards(set);
}

export function hasClozeCards(set: StudySet): boolean {
  return set.cards.some((card) => isCardActive(card) && clozeBlankForCard(card) !== null);
}

export function hasSatzbauCards(set: StudySet): boolean {
  return set.cards.some((card) => isCardActive(card) && satzbauChipsForCard(card) !== null);
}

export function hasConjugationCards(set: StudySet): boolean {
  return set.cards.some(
    (card) => isCardActive(card) && lookupVerbConjugation(card.term) !== null,
  );
}

/** Every active card in `set` this specific mode is eligible on, used to
 *  scope a masteryPercent computation to just the cards a mode exercises
 *  rather than the whole set. */
function eligibleCardsFor(
  mode: "cloze" | "satzbau" | "conjugation",
  set: StudySet,
): Card[] {
  const active = set.cards.filter(isCardActive);
  if (mode === "cloze") return active.filter((card) => clozeBlankForCard(card) !== null);
  if (mode === "satzbau") return active.filter((card) => satzbauChipsForCard(card) !== null);
  return active.filter((card) => lookupVerbConjugation(card.term) !== null);
}

/** masteryPercent (real FSRS-backed) over just the cards eligible for one of
 *  the three modes that ride the normal box-filtered review path — never
 *  over the whole set, which would dilute the number with cards the mode
 *  never touches. */
export function masteryPercentForMode(
  mode: "cloze" | "satzbau" | "conjugation",
  sets: StudySet[],
  progress: ProgressMap,
): number {
  const cards = sets.flatMap((set) => eligibleCardsFor(mode, set));
  return masteryPercent(cards, progress);
}

/** Only German (`termLangCode === "de"`) sets participate in the grammar
 *  hub — the five modes below are German-only, same gate the article drill
 *  and case grid already use via `hasNounEnrichment`/`profileFor`. */
export function isGermanSet(set: StudySet): boolean {
  return resolveSetLanguages(set).term === "de";
}

/**
 * The three set-independent grammar drills (plural, nicht/kein,
 * mein/dein/sein) draw their noun pool from `nouns-data.ts`'s ~102k-entry
 * dictionary, not from any one set's own cards — that pool always exists,
 * so unlike `hasArticleDrillCards`/`hasClozeCards`/etc these have no
 * per-set eligibility to compute. Always `true`, kept as a function (not a
 * bare constant) only so a caller can treat all eight grammar-hub entries
 * uniformly as `(set) => boolean`.
 */
export function alwaysEligible(): boolean {
  return true;
}

/**
 * User-library sourcing for the noun-based standalone grammar drills
 * (Plural, nicht/kein, mein/dein/sein, Adjektivendungen, Relativsätze):
 * every active card across the user's German sets that has a known
 * `enrichment.gender` maps to a `NounEntry`, so the user's own vocabulary is
 * tried before falling back to the general `nouns-data.ts` pool
 * (`GrammarDrillRunner`'s `userEntries` prop does that mixing). `pos` is
 * left empty — none of these drills' builders read it — and only the first
 * plural form a card records is used (a `Card` only ever stores one).
 */
export function userNounEligibleCards(sets: StudySet[]): NounEntry[] {
  return sets
    .filter(isGermanSet)
    .flatMap((set) => set.cards)
    .filter((card) => isCardActive(card) && card.enrichment?.gender)
    .map((card) => ({
      lemma: card.term,
      genus: [card.enrichment!.gender!],
      plural: card.enrichment!.plural ? [card.enrichment!.plural!] : [],
      pos: [],
    }));
}

/**
 * Same as `userNounEligibleCards`, but additionally requires a known plural
 * — the Plural drill's `buildPluralQuestion` needs a non-empty
 * `entry.plural[0]` to have a correct answer at all (see its own doc
 * comment).
 */
export function userPluralEligibleCards(sets: StudySet[]): NounEntry[] {
  return userNounEligibleCards(sets).filter((entry) => entry.plural.length > 0);
}

/**
 * User-library sourcing for the verb-based standalone grammar drills
 * (Trennbare Verben, Imperativ, Passiv, Konjunktiv): every active card
 * across the user's German sets whose term `lookupVerbConjugation`
 * recognizes — the REAL UniMorph conjugation for that exact verb, not a
 * synthetic one — is used as-is. `filter`:
 * - "separable": only verbs with a recognized separable prefix (Trennbare
 *   Verben's only eligible pool, same restriction `randomVerbSample`
 *   applies to the general pool).
 * - "any": every recognized verb (Imperativ/Passiv/Konjunktiv), same as
 *   `randomVerbSample(count, "any")`'s general pool.
 */
export function userVerbEligibleCards(
  sets: StudySet[],
  filter: "separable" | "any" = "any",
): VerbConjugationEntry[] {
  const entries = sets
    .filter(isGermanSet)
    .flatMap((set) => set.cards)
    .filter(isCardActive)
    .map((card) => lookupVerbConjugation(card.term))
    .filter((entry): entry is VerbConjugationEntry => entry !== null);
  if (filter === "any") return entries;
  return entries.filter((entry) => separablePrefixOf(entry.infinitive) !== null);
}
