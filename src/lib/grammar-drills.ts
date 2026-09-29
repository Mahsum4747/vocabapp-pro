import { shuffle } from "./utils.ts";
import type { Genus, NounEntry } from "./german/types.ts";

/**
 * Pure, testable question generators for the three set-independent German
 * grammar drills (plural, nicht/kein, mein/dein/sein). No FSRS/review-log
 * writes here or anywhere downstream of these functions — they only ever
 * turn a noun sample into a question + multiple-choice options + the
 * correct answer. The routes that render these are the only place that
 * touches an in-memory score counter, and never Firestore/FSRS.
 *
 * All three drills share one endings table (nominativ/akkusativ/dativ ×
 * m/f/n/pl), because kein and the possessives (mein/dein/sein/...) take the
 * IDENTICAL ending pattern per the task's fixed rule data — only the stem
 * differs.
 */

export type Case = "nominativ" | "akkusativ" | "dativ";
type GenusOrPlural = Genus | "pl";

/** kein/possessive ending per case × gender-or-plural. Empty string = no
 *  suffix on the stem (e.g. nominativ masculine "kein", "mein"). */
const ENDINGS: Record<Case, Record<GenusOrPlural, string>> = {
  nominativ: { m: "", f: "e", n: "", pl: "e" },
  akkusativ: { m: "en", f: "e", n: "", pl: "e" },
  dativ: { m: "em", f: "er", n: "em", pl: "en" },
};

function inflect(stem: string, genusOrPlural: GenusOrPlural, grammaticalCase: Case): string {
  return stem + ENDINGS[grammaticalCase][genusOrPlural];
}

const NOMINATIVE_ARTICLE: Record<Genus, string> = { m: "der", f: "die", n: "das" };

type Rng = () => number;

function pick<T>(items: readonly T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)]!;
}

export interface DrillQuestion {
  prompt: string;
  options: string[];
  correctAnswer: string;
}

// ---------------------------------------------------------------------------
// Plural drill
// ---------------------------------------------------------------------------

/** Vowel → its Umlaut, used only for a plausible-looking "-e"/"-er" distractor
 *  (never presented as a rule — see grammar-rules.ts's own "no fixed rule"
 *  intro). Applied to the LAST matching vowel in the lemma. */
const UMLAUT: Record<string, string> = { a: "ä", o: "ö", u: "ü" };

function withUmlaut(lemma: string): string {
  for (let i = lemma.length - 1; i >= 0; i--) {
    const lower = lemma[i]!.toLowerCase();
    if (lower in UMLAUT) {
      const replacement = lemma[i] === lower ? UMLAUT[lower]! : UMLAUT[lower]!.toUpperCase();
      return lemma.slice(0, i) + replacement + lemma.slice(i + 1);
    }
  }
  return lemma;
}

/** Every candidate plural the five common ending patterns would produce for
 *  `lemma`, keyed by pattern — used both to pick the "-e"/"-er"/"-n"/"-s"
 *  distractors and (by the caller) to filter out whichever happens to equal
 *  the real answer. */
function pluralCandidates(lemma: string): string[] {
  return [
    `${withUmlaut(lemma)}e`,
    `${lemma}e`,
    `${withUmlaut(lemma)}er`,
    `${lemma}er`,
    lemma.endsWith("e") ? `${lemma}n` : `${lemma}en`,
    `${lemma}s`,
    lemma,
  ];
}

export interface PluralQuestion extends DrillQuestion {
  lemma: string;
  genus: Genus;
}

/**
 * `entry` must have a non-empty `genus` and `plural` (the server-side
 * `randomNounSample` already filters to that). Picks the entry's first
 * genus/plural sense. Distractors are the OTHER common ending patterns
 * applied to the same lemma, so a wrong pick still looks like a real German
 * plural, never a random string.
 */
export function buildPluralQuestion(entry: NounEntry, rng: Rng = Math.random): PluralQuestion {
  const genus = entry.genus[0]!;
  const correctAnswer = entry.plural[0]!;
  const candidates = [...new Set(pluralCandidates(entry.lemma))].filter(
    (candidate) => candidate !== correctAnswer,
  );
  const distractors = shuffle(candidates).slice(0, 3);
  // Backfill with lemma-suffixed fallbacks on the rare lemma where the
  // pattern set collapses to fewer than 3 distinct wrong forms.
  while (distractors.length < 3) {
    const fallback = `${entry.lemma}${"x".repeat(distractors.length + 1)}`;
    if (!distractors.includes(fallback) && fallback !== correctAnswer) distractors.push(fallback);
  }
  const options = shuffle([correctAnswer, ...distractors]);
  const article = NOMINATIVE_ARTICLE[genus];
  return {
    lemma: entry.lemma,
    genus,
    prompt: `${article} ${entry.lemma} → die ___?`,
    options,
    correctAnswer,
  };
}

// ---------------------------------------------------------------------------
// nicht / kein drill
// ---------------------------------------------------------------------------

type NichtKeinTemplate = {
  build: (noun: string, article: string) => string;
  answer: (genus: Genus) => string; // "nicht" or a kein form
};

const NICHT_KEIN_TEMPLATES: NichtKeinTemplate[] = [
  {
    build: (noun) => `Ich habe ___ ${noun}.`,
    answer: (genus) => `kein${ENDINGS.akkusativ[genus]}`,
  },
  { build: () => `Das ist ___ teuer.`, answer: () => "nicht" },
  { build: () => `Ich komme ___.`, answer: () => "nicht" },
  {
    build: (noun, article) => `Das ist ___ ${article} ${noun}.`,
    answer: () => "nicht",
  },
];

/** Every kein form across all case × gender combos, for building distractors
 *  that are real inflections of "kein" rather than arbitrary strings. */
const ALL_KEIN_FORMS: string[] = (["nominativ", "akkusativ", "dativ"] as Case[]).flatMap(
  (grammaticalCase) =>
    (["m", "f", "n", "pl"] as GenusOrPlural[]).map((g) => inflect("kein", g, grammaticalCase)),
);

export interface NichtKeinQuestion extends DrillQuestion {
  lemma: string;
}

export function buildNichtKeinQuestion(
  entry: NounEntry,
  rng: Rng = Math.random,
): NichtKeinQuestion {
  const genus = entry.genus[0]!;
  const article = NOMINATIVE_ARTICLE[genus];
  const template = pick(NICHT_KEIN_TEMPLATES, rng);
  const correctAnswer = template.answer(genus);
  const pool = [...new Set(["nicht", ...ALL_KEIN_FORMS])].filter(
    (candidate) => candidate !== correctAnswer,
  );
  const distractors = shuffle(pool).slice(0, 3);
  const options = shuffle([correctAnswer, ...distractors]);
  return {
    lemma: entry.lemma,
    prompt: template.build(entry.lemma, article),
    options,
    correctAnswer,
  };
}

// ---------------------------------------------------------------------------
// mein / dein / sein (possessive) drill
// ---------------------------------------------------------------------------

export type Person = "ich" | "du" | "er" | "sie" | "wir" | "ihr" | "sie-Sie";

const STEM_FOR_PERSON: Record<Person, string> = {
  ich: "mein",
  du: "dein",
  er: "sein",
  sie: "ihr",
  wir: "unser",
  ihr: "euer",
  "sie-Sie": "ihr",
};

const PERSON_LABEL: Record<Person, string> = {
  ich: "ich",
  du: "du",
  er: "er / es",
  sie: "sie",
  wir: "wir",
  ihr: "ihr",
  "sie-Sie": "sie / Sie",
};

const PERSONS = Object.keys(STEM_FOR_PERSON) as Person[];
const CASES: Case[] = ["nominativ", "akkusativ", "dativ"];

export interface PossessiveQuestion extends DrillQuestion {
  lemma: string;
  person: Person;
  grammaticalCase: Case;
}

export function buildPossessiveQuestion(
  entry: NounEntry,
  rng: Rng = Math.random,
): PossessiveQuestion {
  const genus = entry.genus[0]!;
  const person = pick(PERSONS, rng);
  const grammaticalCase = pick(CASES, rng);
  const stem = STEM_FOR_PERSON[person];
  const correctAnswer = inflect(stem, genus, grammaticalCase);
  // Distractors: the same stem inflected for the OTHER cases/genders (real
  // possessive forms, just the wrong slot), so a wrong pick still looks
  // plausible rather than nonsensical.
  const allFormsForStem = CASES.flatMap((c) =>
    (["m", "f", "n", "pl"] as GenusOrPlural[]).map((g) => inflect(stem, g, c)),
  );
  const pool = [...new Set(allFormsForStem)].filter((candidate) => candidate !== correctAnswer);
  const distractors = shuffle(pool).slice(0, 3);
  const options = shuffle([correctAnswer, ...distractors]);
  return {
    lemma: entry.lemma,
    person,
    grammaticalCase,
    prompt: `${PERSON_LABEL[person]} → ___ ${entry.lemma}`,
    options,
    correctAnswer,
  };
}
