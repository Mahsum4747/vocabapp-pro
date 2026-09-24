import { VERB_GOVERNMENT_DATA } from "./verb-government-data.ts";
import { DATIVE_VERB_DATA } from "./dative-verbs-data.ts";
import type { NounCase } from "../case-forms.ts";

/**
 * Source A of the two independent confirmations a verb-case hint needs —
 * Source B is case-forms.ts's own article-adjacency match, already what
 * picks the sentence in the first place. This file answers: does a verb
 * from the curated, hand-compiled datasets (verb-government-data.ts /
 * dative-verbs-data.ts) — never the 102k-lemma noun dictionary, never AI,
 * no new list — actually govern `nounCase` in THIS sentence?
 *
 * No inflected-form -> lemma resolver exists anywhere in this codebase
 * (checked enrich.server.ts and german/lookup.ts), and building one is out
 * of scope for this slice ("no new NLP"). Verb matching is therefore
 * mechanical only: the bare infinitive, plus regular weak-verb A1 present
 * tense (ich/du/er) and a best-effort participle, all derived from the
 * infinitive by suffix rule — see `mechanicalForms`. Irregular (strong)
 * verbs with a stem-vowel change (geben -> gibt, helfen -> hilft, sehen ->
 * sieht) are NOT specially handled: hardcoding their stem changes would be
 * a new curated verb list, forbidden here. Their real conjugated forms
 * simply never match what this generates, so a sentence using them falls
 * through to "unresolved" rather than a wrong or invented confirmation —
 * the intended, documented limitation, not a bug.
 */

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

  return false;
}
