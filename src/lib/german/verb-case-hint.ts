import { VERB_GOVERNMENT_DATA } from "./verb-government-data.ts";
import { DATIVE_VERB_DATA } from "./dative-verbs-data.ts";
import { VERB_CONJUGATION_DATA } from "./verb-conjugation-data.ts";
import type { NounCase } from "../case-forms.ts";

/**
 * Source A of the two independent confirmations a verb-case hint needs —
 * Source B is case-forms.ts's own article-adjacency match, already what
 * picks the sentence in the first place. This file answers: does something
 * curated actually confirm `nounCase` in THIS sentence — either a specific
 * verb from verb-government-data.ts/dative-verbs-data.ts governing it
 * (never the 102k-lemma noun dictionary, never AI, no new verb list), or,
 * for Akkusativ only, the absence of any curated reason to doubt the
 * default case (`defaultAkkusativApplies`, below)?
 *
 * No inflected-form -> lemma resolver exists anywhere in this codebase
 * (checked enrich.server.ts and german/lookup.ts), and building one is out
 * of scope for this slice ("no new NLP"). Verb forms are looked up first in
 * VERB_CONJUGATION_DATA — a real, sourced table of the exact ich/du/er/
 * participle forms for the verbs already in these two curated datasets
 * (see verb-conjugation-data.ts / UNIMORPH-ATTRIBUTION.md) — and only when
 * a verb isn't in that table does `mechanicalForms` fall back to its
 * original suffix rule (regular weak-verb present tense, derived from the
 * infinitive). That fallback still under-matches irregular verbs the table
 * doesn't cover (22 lemmas — see UNIMORPH-ATTRIBUTION.md, notably "sein"),
 * which is the same documented, accepted limitation this file always had:
 * their real conjugated forms simply don't match what the suffix rule
 * generates, so a sentence using them stays "unresolved" rather than a
 * wrong or invented confirmation.
 */

const conjugationIndex: Map<string, (typeof VERB_CONJUGATION_DATA)[number]> = new Map(
  VERB_CONJUGATION_DATA.map((entry) => [entry.infinitive, entry]),
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const INSEPARABLE_PREFIXES = ["be", "emp", "ent", "er", "ge", "miss", "ver", "zer"];
const SEPARABLE_PREFIX_RE =
  /^(ab|an|auf|aus|bei|ein|mit|nach|vor|zu|zurück|zusammen|weg|her|hin)[a-zäöüß]/;

function stem(infinitive: string): string {
  return infinitive.endsWith("en") ? infinitive.slice(0, -2) : infinitive.replace(/n$/, "");
}

/**
 * `infinitive` itself, its mechanically regular ich/du/er present-tense
 * forms, and (when the prefix shape is unambiguous) its regular participle.
 * A multi-word dataset entry ("sich ergeben", "bekannt geben") is reduced to
 * its last token first — the conjugatable verb — since "sich"/"bekannt" is
 * never itself inflected.
 */
function mechanicalForms(verbEntry: string): string[] {
  const infinitive = verbEntry.trim().split(/\s+/).pop() ?? verbEntry;

  const sourced = conjugationIndex.get(infinitive);
  if (sourced) {
    const forms = [sourced.infinitive, sourced.ich, sourced.du, sourced.er];
    if (sourced.partizipII) forms.push(sourced.partizipII);
    return forms;
  }

  const s = stem(infinitive);
  if (!s) return [infinitive];

  const needsE = /[dt]$/.test(s);
  const forms = new Set<string>([infinitive, `${s}e`, `${s}${needsE ? "est" : "st"}`, `${s}${needsE ? "et" : "t"}`]);

  // Participle: ge-stem-t for a plain verb, stem-t (no ge-) for a known
  // inseparable prefix. A separable-prefix verb's real participle inserts
  // "ge" AFTER the prefix ("aus" + "ge" + "geben" + "t") — that needs the
  // prefix boundary, which is skipped rather than guessed at, same
  // "don't invent" boundary as the stem-vowel-change limitation above.
  const isSeparable = SEPARABLE_PREFIX_RE.test(infinitive);
  if (!isSeparable) {
    const hasInseparablePrefix = INSEPARABLE_PREFIXES.some(
      (p) => infinitive.startsWith(p) && infinitive.length > p.length + 2,
    );
    forms.add(hasInseparablePrefix ? `${s}${needsE ? "et" : "t"}` : `ge${s}${needsE ? "et" : "t"}`);
  }
  return [...forms];
}

function sentenceHasWord(sentence: string, word: string): boolean {
  return new RegExp(`(?<![\\p{L}])${escapeRegExp(word)}(?![\\p{L}])`, "iu").test(sentence);
}

function sentenceHasVerb(sentence: string, verbEntry: string): boolean {
  return mechanicalForms(verbEntry).some((form) => sentenceHasWord(sentence, form));
}

/**
 * `preposition` immediately followed by `correctForm` immediately followed
 * by `term` — no adjective, no other word between any of the three.
 * Stricter than case-forms.ts's own noun-adjacency check (which allows up
 * to two in-between words, to tolerate an adjective before the headword):
 * this is a second, independent confirmation, and an adjective sitting
 * between preposition and article means this check can no longer tell
 * genuine prepositional government from coincidence, so it reports
 * unconfirmed rather than guessing through the gap.
 */
function prepositionAdjacent(
  sentence: string,
  preposition: string,
  correctForm: string,
  term: string,
): boolean {
  const re = new RegExp(
    `(?<![\\p{L}])${escapeRegExp(preposition)}\\s+${escapeRegExp(correctForm)}\\s+${escapeRegExp(term)}(?![\\p{L}])`,
    "iu",
  );
  return re.test(sentence);
}

/**
 * One curated entry's verb (its infinitive) plus every surface form it can
 * take, lower-cased — used only by the default-Akkusativ negative-control
 * check below, never by the positive checks above (which each match a
 * specific entry, not "any entry at all").
 */
type SurfaceFormEntry = { infinitive: string; forms: Set<string> };
function surfaceFormEntries(verbs: readonly string[]): SurfaceFormEntry[] {
  return verbs.map((verb) => {
    const infinitive = verb.trim().split(/\s+/).pop() ?? verb;
    return { infinitive, forms: new Set(mechanicalForms(verb).map((f) => f.toLowerCase())) };
  });
}
const curatedVerbEntries: SurfaceFormEntry[] = [
  ...surfaceFormEntries(DATIVE_VERB_DATA.map((e) => e.verb)),
  ...surfaceFormEntries(VERB_GOVERNMENT_DATA.map((e) => e.verb)),
];

/**
 * A separable-prefix verb's conjugation-table forms are already
 * prefix-stripped ("trage" for "beitragen" — see verb-conjugation-data.ts's
 * own header comment on why), which makes a bare form ambiguous with an
 * unrelated plain verb that conjugates the same way ("trage" is ALSO
 * "tragen"'s own ich-form). So a match against a separable-prefix curated
 * verb only disqualifies the default-Akkusativ rule when that verb's own
 * prefix is ALSO somewhere in the sentence — otherwise the match is most
 * likely the unrelated plain verb, not this curated one, and disqualifying
 * on it would silently block the exact common-verb case this rule exists
 * for ("Ich trage die Tasche." must not be blocked by "beitragen").
 */
function reallyMatches(entry: SurfaceFormEntry, sentence: string): boolean {
  const prefix = entry.infinitive.match(SEPARABLE_PREFIX_RE)?.[1];
  return prefix ? sentenceHasWord(sentence, prefix) : true;
}

/**
 * The word immediately before `correctForm term` (itself allowing up to two
 * in-between words, same as case-forms.ts's own adjacency rule) — or `null`
 * if `correctForm` opens the sentence, e.g. a fronted/topicalized object
 * ("Den Vater sehen wir."). That inversion, and any other non-SVO A1
 * structure, is an accepted miss for this rule, not a wrong guess: with no
 * preceding word to check, there is nothing to confirm against, so it
 * falls through to `false` rather than assuming a verb was there.
 */
function precedingWord(sentence: string, correctForm: string, term: string): string | null {
  const re = new RegExp(
    `(\\p{L}[\\p{L}-]*)\\s+${escapeRegExp(correctForm)}(?:\\s+[\\p{L}-]+){0,2}?\\s+${escapeRegExp(term)}(?![\\p{L}])`,
    "iu",
  );
  return re.exec(sentence)?.[1] ?? null;
}

/**
 * Default Akkusativ, negative-control: German's plain transitive verbs
 * (kaufen, mögen, sehen, tragen, ...) are the ordinary case, not an
 * exception — there is no positive, closed list of them to check against
 * the way there is for dativ (dative-verbs-data.ts is deliberately NOT
 * mirrored for akkusativ, see that file's own doc comment: a sampled list
 * would create false negatives on any common accusative verb missing from
 * the sample). So this never asks "is this verb accusative-governing?" —
 * it asks the opposite: is there any curated reason to doubt it?
 *
 * A bundled de.Wiktionary "transitiv" category dump exists
 * (src/content/karta-wiktionary-transitiv-de.json) but is deliberately NOT
 * consulted here — see its own attribution file: the category tagging is
 * incomplete (missing "sehen", "helfen", "geben", "rufen" themselves), so
 * using it as a gate would silently fail on exactly the common verbs this
 * rule exists to cover. It is attributed reference material only.
 *
 * Confirms Akkusativ when: the word immediately before `correctForm term`
 * exists (see `precedingWord` — a fronted sentence is an accepted miss,
 * not resolved here), is not a listed dative-verbs-data.ts verb form (that
 * would mean this NP is likely NOT the accusative object, or the verb is
 * one of the ditransitive dat+akk entries where this generic rule can't
 * tell which NP is which case), and is not a listed verb-government-data.ts
 * verb form (a prepositional-government verb already had its dedicated,
 * stricter check above; reaching here means that check did NOT confirm, so
 * defaulting to Akkusativ anyway would silently override a verb this
 * codebase already knows governs something else).
 */
function defaultAkkusativApplies(sentence: string, correctForm: string, term: string): boolean {
  const verb = precedingWord(sentence, correctForm, term);
  if (!verb) return false;
  const key = verb.toLowerCase();
  for (const entry of curatedVerbEntries) {
    if (entry.forms.has(key) && reallyMatches(entry, sentence)) return false;
  }
  return true;
}

/**
 * Whether a verb from the curated datasets confirms `nounCase` in
 * `sentence`, for the noun phrase `correctForm term` (e.g. "dem Kind").
 *
 * - dative-verbs-data.ts: any listed verb appearing anywhere in the
 *   sentence confirms dativ — the dataset carries no fixed syntactic
 *   position for its object to check against (see its own doc comment on
 *   why some entries are ditransitive dat+akk); this only ever confirms
 *   the dativ half of that, never akkusativ.
 * - verb-government-data.ts: the listed verb must appear somewhere in the
 *   sentence AND its preposition must sit immediately before
 *   `correctForm term` with nothing between (see `prepositionAdjacent`).
 *
 * No match in either dataset, a case mismatch, or the strict adjacency
 * failing (an adjective in the way, a different verb's preposition, a
 * wechsel verb whose direction/location this doesn't attempt to resolve)
 * all return `false`. A caller showing a hint only on `true` therefore
 * never asserts a case the sentence doesn't actually demonstrate.
 */
export function verbConfirmsCase(
  sentence: string,
  correctForm: string,
  term: string,
  nounCase: NounCase,
): boolean {
  const text = sentence.trim();
  if (!text || !correctForm.trim() || !term.trim()) return false;

  if (nounCase === "dativ") {
    for (const entry of DATIVE_VERB_DATA) {
      if (sentenceHasVerb(text, entry.verb)) return true;
    }
  }

  for (const entry of VERB_GOVERNMENT_DATA) {
    if (entry.case !== nounCase) continue;
    if (!sentenceHasVerb(text, entry.verb)) continue;
    if (prepositionAdjacent(text, entry.preposition, correctForm, term)) return true;
  }

  if (nounCase === "akkusativ" && defaultAkkusativApplies(text, correctForm, term)) return true;

  return false;
}
