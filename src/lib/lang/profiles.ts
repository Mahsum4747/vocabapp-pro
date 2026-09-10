import type { LanguageCode } from "./languages.ts";
import type { CardEnrichment, GrammaticalGender } from "../types.ts";

/**
 * Everything the app's language-AGNOSTIC UI needs to know about one specific
 * language: whether it has noun enrichment at all, and how to render a
 * gender into an article. Separate from `languages.ts` (just names/codes)
 * and from any one language's server-only implementation
 * (src/lib/german/*) — this file must stay importable from client code, so
 * it never reaches into a feature's dictionary. Importing the German noun
 * dictionary here would put its 2.9 MB in reach of the client bundle.
 *
 * One real profile today ('de'). Do not add a profile for en/tr/ku ahead of
 * a real feature that needs one — an unused profile is upkeep with nothing
 * behind it.
 */
export interface LanguageProfile {
  /**
   * Whether this language has a noun-enrichment dictionary. The single
   * place that decision is made — gates both the editor's enrichment row
   * and the server's fill-on-save step, rather than `termLangCode === 'de'`
   * checks scattered across routes and components.
   */
  hasNounEnrichment: boolean;
  /** The nominative definite article for a gender ("der"/"die"/"das"), or
   *  undefined if this language doesn't have one. Absent entirely when
   *  `hasNounEnrichment` is false. */
  articleFor?(gender: GrammaticalGender): string | undefined;
}

const GERMAN_ARTICLES: Record<GrammaticalGender, string> = { m: "der", f: "die", n: "das" };

const GERMAN_PROFILE: LanguageProfile = {
  hasNounEnrichment: true,
  articleFor: (gender) => GERMAN_ARTICLES[gender],
};

/** Every language without a profile below: no enrichment, no per-language
 *  rendering. Every set made before this feature existed resolves here. */
export const EMPTY_PROFILE: LanguageProfile = { hasNounEnrichment: false };

const PROFILES: Partial<Record<LanguageCode, LanguageProfile>> = {
  de: GERMAN_PROFILE,
};

/** The profile for a resolved term-language code, or `EMPTY_PROFILE` for
 *  every language without one (including `null`, for a set with no
 *  resolved language at all). Never throws, never guesses. */
export function profileFor(code: LanguageCode | null | undefined): LanguageProfile {
  return (code && PROFILES[code]) || EMPTY_PROFILE;
}

/**
 * "der Tisch" for display, or the bare term when the profile has nothing to
 * add — no gender on the card, or a language with no `articleFor` at all.
 *
 * A RENDERING helper only. Its output must never be written back into
 * `term`, fed to `answersMatch`, or stored anywhere: `term` itself stays
 * "Tisch" everywhere on the write path (see the tests in card-copy.test.ts
 * and study-sets.test.ts) so card identity, search, sort and grading are
 * unaffected by whether a caller happens to display the article.
 */
export function articleizedTerm(
  term: string,
  enrichment: CardEnrichment | null | undefined,
  profile: LanguageProfile,
): string {
  const article = enrichment?.gender && profile.articleFor?.(enrichment.gender);
  return article ? `${article} ${term}` : term;
}
