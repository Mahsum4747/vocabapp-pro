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
  /**
   * Every word this language's nouns can start with an article — the same
   * three words `articleFor` can produce, just as a flat list rather than a
   * per-gender lookup. `[]` for a language with none.
   *
   * This is what a grading call site hands to `answersMatch`'s
   * `ignorableLeadingWords`, so a typed "der Tisch" is accepted for a card
   * whose gender is known — see sets.$setId.learn.tsx / .test.tsx. It is
   * NOT which article is correct for a given gender: judging that is a
   * separate, harder question this list doesn't answer, deliberately (a
   * future article-specific drill's job, not this one's).
   */
  articleWords: readonly string[];
  /**
   * Whether AI example-sentence suggestions (Phase 3C) are enabled for this
   * language. Independent of `hasNounEnrichment` — a language can get one
   * before the other, and this is the single place that decision is made,
   * the same reasoning as `hasNounEnrichment` itself: gates the editor's
   * "Suggest example" affordance AND the server handler's own refusal to
   * spend quota on a language that hasn't been enabled, so the two can't
   * drift apart into "the button is hidden but the endpoint still answers."
   *
   * Only German is `true` today — a product decision (Gemini's Kurmancî/
   * Turkish example quality hasn't been reviewed), not a technical limit:
   * the server function and cache key are already language-agnostic.
   * Enabling English, Turkish, or Kurdish later means adding or editing a
   * profile with this flag `true`, not new code.
   */
  hasExampleSuggestions: boolean;
}

const GERMAN_ARTICLES: Record<GrammaticalGender, string> = { m: "der", f: "die", n: "das" };

const GERMAN_PROFILE: LanguageProfile = {
  hasNounEnrichment: true,
  articleFor: (gender) => GERMAN_ARTICLES[gender],
  articleWords: Object.values(GERMAN_ARTICLES),
  hasExampleSuggestions: true,
};

/** Every language without a profile below: no enrichment, no per-language
 *  rendering. Every set made before this feature existed resolves here. */
export const EMPTY_PROFILE: LanguageProfile = {
  hasNounEnrichment: false,
  articleWords: [],
  hasExampleSuggestions: false,
};

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

/**
 * The word list to hand `answersMatch`'s `ignorableLeadingWords` for one
 * card's typed-term answer.
 *
 * Two independent gates collapse into one call: non-empty only when BOTH
 * this card has a known gender AND the profile actually has articles for
 * it. That second gate matters on its own — a card whose `enrichment.gender`
 * is set but whose set isn't German (a malformed value, or a card copied
 * out of its original German set into a set with a different language)
 * still gets `[]`, exactly like a German card with no gender recorded at
 * all. Neither caller needs to reason about that combination separately.
 */
export function articleWordsForAnswer(
  enrichment: CardEnrichment | null | undefined,
  profile: LanguageProfile,
): readonly string[] {
  return enrichment?.gender ? profile.articleWords : [];
}

/**
 * `term` with a leading article word stripped, if `profile.articleWords`
 * has one and `term` starts with it — case-insensitive, and requiring the
 * same word-boundary space `answersMatch`'s leniency does, so "Derby" is
 * never treated as "Der" + "by". Returns `term` (just trimmed) unchanged
 * when nothing matches, or the profile has no article words at all.
 *
 * This is the write/lookup-key side of the exact problem
 * `articleWordsForAnswer` solves on the grading side: a cache keyed on the
 * raw term would treat "der Sohn" and "Sohn" as different words and never
 * share a Gemini result between them. Called before hashing an AI-cache
 * key (see example-suggestions.ts) — never on anything that reaches
 * `term` itself, which must stay exactly what the user typed.
 */
export function stripArticle(term: string, profile: LanguageProfile): string {
  const trimmed = term.trim();
  const lower = trimmed.toLowerCase();
  for (const word of profile.articleWords) {
    const prefix = `${word.toLowerCase()} `;
    if (lower.startsWith(prefix)) return trimmed.slice(prefix.length).trim();
  }
  return trimmed;
}
