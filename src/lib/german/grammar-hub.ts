import { clozeBlankForCard } from "@/lib/cloze";
import { satzbauChipsForCard } from "@/lib/satzbau";
import { lookupVerbConjugation } from "@/lib/german/verb-conjugation-data";
import { masteryPercent, type ProgressMap } from "@/lib/quiz";
import { isCardActive, resolveSetLanguages } from "@/lib/types";
import { profileFor } from "@/lib/lang/profiles";
import type { Card, StudySet } from "@/lib/types";

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
