import { shuffle } from "./utils.ts";
import { separablePrefixOf } from "./german/verb-conjugation-data.ts";
import type { Genus, NounEntry } from "./german/types.ts";
import type { VerbConjugationEntry } from "./german/verb-conjugation-data.ts";

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

// ---------------------------------------------------------------------------
// Trennbare Verben (separable verbs) drill
// ---------------------------------------------------------------------------

function capitalize(word: string): string {
  return word.length === 0 ? word : word[0]!.toUpperCase() + word.slice(1);
}

export interface TrennbareVerbenQuestion extends DrillQuestion {
  infinitive: string;
  prefix: string;
}

/**
 * `entry` must be separable (`separablePrefixOf(entry.infinitive) !== null`
 * — the server/client-side `randomVerbSample(count, "separable")` already
 * filters to that). Asks where the prefix goes in the main clause: the
 * correct answer is the prefix itself, distractors are the unsplit
 * infinitive (a real, just-wrong-here form) plus other real separable
 * prefixes from the fixed list.
 */
export function buildTrennbareVerbenQuestion(
  entry: VerbConjugationEntry,
  rng: Rng = Math.random,
): TrennbareVerbenQuestion {
  const prefix = separablePrefixOf(entry.infinitive)!;
  const otherPrefixes = ["an", "auf", "aus", "mit", "zu", "ab", "bei", "ein", "vor", "nach", "zurück", "weg"].filter(
    (p) => p !== prefix,
  );
  const pool = [...new Set([entry.infinitive, ...shuffle(otherPrefixes)])].filter((c) => c !== prefix);
  const distractors = pool.slice(0, 3);
  const options = shuffle([prefix, ...distractors]);
  return {
    infinitive: entry.infinitive,
    prefix,
    prompt: `Ich ${entry.ich} dich ___.`,
    options,
    correctAnswer: prefix,
  };
}

// ---------------------------------------------------------------------------
// Modalverben drill
// ---------------------------------------------------------------------------

export type ModalPerson = "ich" | "du" | "er";
export type ModalVerb = "können" | "müssen" | "dürfen" | "wollen" | "sollen" | "möchten";

/** Fixed per the task's rule data — not derived from any file. */
const MODAL_FORMS: Record<ModalVerb, Record<ModalPerson, string>> = {
  können: { ich: "kann", du: "kannst", er: "kann" },
  müssen: { ich: "muss", du: "musst", er: "muss" },
  dürfen: { ich: "darf", du: "darfst", er: "darf" },
  wollen: { ich: "will", du: "willst", er: "will" },
  sollen: { ich: "soll", du: "sollst", er: "soll" },
  möchten: { ich: "möchte", du: "möchtest", er: "möchte" },
};
const MODAL_VERBS = Object.keys(MODAL_FORMS) as ModalVerb[];
const MODAL_PERSONS: ModalPerson[] = ["ich", "du", "er"];

export interface ModalverbenQuestion extends DrillQuestion {
  modal: ModalVerb;
  person: ModalPerson;
}

/** Set-independent (no noun/verb sample needed — the fixed 6-modal table is
 *  the whole pool), so callers pass any sample array purely to drive round
 *  size; its contents are ignored. */
export function buildModalverbenQuestion(rng: Rng = Math.random): ModalverbenQuestion {
  const modal = pick(MODAL_VERBS, rng);
  const person = pick(MODAL_PERSONS, rng);
  const correctAnswer = MODAL_FORMS[modal][person];
  const pool = new Set<string>();
  for (const m of MODAL_VERBS) for (const p of MODAL_PERSONS) pool.add(MODAL_FORMS[m][p]);
  pool.delete(correctAnswer);
  const distractors = shuffle([...pool]).slice(0, 3);
  const options = shuffle([correctAnswer, ...distractors]);
  return {
    modal,
    person,
    prompt: `${person} ___ gut schwimmen. (${modal})`,
    options,
    correctAnswer,
  };
}

// ---------------------------------------------------------------------------
// Imperativ drill
// ---------------------------------------------------------------------------

export type ImperativTarget = "du" | "ihr" | "Sie";
const IMPERATIV_TARGETS: ImperativTarget[] = ["du", "ihr", "Sie"];

export interface ImperativQuestion extends DrillQuestion {
  infinitive: string;
  target: ImperativTarget;
}

/**
 * `entry` should be a non-separable verb (`randomVerbSample(count, "any")`)
 * — separable-prefix repositioning in the imperative is out of scope here.
 * du-imperative uses the `ich` form (the standard textbook shortcut), ihr
 * uses `du` with -st replaced by -t, Sie uses the bare infinitive + "Sie".
 * Distractors are the OTHER two persons' real imperative forms for the
 * same verb, so a wrong pick is still a real imperative, just the wrong
 * person.
 */
export function buildImperativQuestion(
  entry: VerbConjugationEntry,
  rng: Rng = Math.random,
): ImperativQuestion {
  const forms: Record<ImperativTarget, string> = {
    du: `${capitalize(entry.ich)}!`,
    ihr: `${capitalize(entry.du.replace(/st$/, "t"))}!`,
    Sie: `${capitalize(entry.infinitive)} Sie!`,
  };
  const target = pick(IMPERATIV_TARGETS, rng);
  const correctAnswer = forms[target];
  // Only 3 real imperative forms exist per verb (du/ihr/Sie) — the bare
  // infinitive is a real word too, just not a valid imperative, so it
  // rounds the option count out to 4 without inventing a fake string.
  const distractors = [
    ...IMPERATIV_TARGETS.filter((t) => t !== target).map((t) => forms[t]),
    entry.infinitive,
  ];
  const options = shuffle([correctAnswer, ...distractors]);
  return {
    infinitive: entry.infinitive,
    target,
    prompt: `${entry.infinitive} — Imperativ (${target}):`,
    options,
    correctAnswer,
  };
}

// ---------------------------------------------------------------------------
// Pronomen (Akkusativ/Dativ personal pronouns) drill
// ---------------------------------------------------------------------------

export type PronounPerson = "ich" | "du" | "er" | "sie" | "wir" | "ihr";
export type PronounCase = "akkusativ" | "dativ";

/** Fixed per the task's rule data. */
const PRONOUN_TABLE: Record<PronounPerson, Record<PronounCase, string>> = {
  ich: { akkusativ: "mich", dativ: "mir" },
  du: { akkusativ: "dich", dativ: "dir" },
  er: { akkusativ: "ihn", dativ: "ihm" },
  sie: { akkusativ: "sie", dativ: "ihr" },
  wir: { akkusativ: "uns", dativ: "uns" },
  ihr: { akkusativ: "euch", dativ: "euch" },
};
const PRONOUN_PERSONS = Object.keys(PRONOUN_TABLE) as PronounPerson[];

export interface PronomenQuestion extends DrillQuestion {
  person: PronounPerson;
  pronounCase: PronounCase;
}

/** Set-independent — see buildModalverbenQuestion's doc comment on the same
 *  pattern (fixed table, sample contents ignored). */
export function buildPronomenQuestion(rng: Rng = Math.random): PronomenQuestion {
  const person = pick(PRONOUN_PERSONS, rng);
  const pronounCase = pick<PronounCase>(["akkusativ", "dativ"], rng);
  const correctAnswer = PRONOUN_TABLE[person][pronounCase];
  const pool = new Set<string>();
  for (const p of PRONOUN_PERSONS) {
    pool.add(PRONOUN_TABLE[p].akkusativ);
    pool.add(PRONOUN_TABLE[p].dativ);
  }
  pool.delete(correctAnswer);
  const distractors = shuffle([...pool]).slice(0, 3);
  const options = shuffle([correctAnswer, ...distractors]);
  return {
    person,
    pronounCase,
    prompt: `${person} → ___ (${pronounCase === "akkusativ" ? "Akkusativ" : "Dativ"})`,
    options,
    correctAnswer,
  };
}

// ---------------------------------------------------------------------------
// Adjektivendungen drill
// ---------------------------------------------------------------------------

/** A short, fixed list of common German adjectives — not from any data
 *  file, since nouns-data.ts has no adjective column (per the task spec). */
const ADJECTIVES = ["groß", "klein", "gut", "neu", "alt"] as const;

/** Definite-article form per case × genus/plural, used only to render the
 *  prompt's article + noun (not the answer itself). */
const DEFINITE_ARTICLE: Record<Case, Record<GenusOrPlural, string>> = {
  nominativ: { m: "der", f: "die", n: "das", pl: "die" },
  akkusativ: { m: "den", f: "die", n: "das", pl: "die" },
  dativ: { m: "dem", f: "der", n: "dem", pl: "den" },
};

/** Adjective endings after a der-word, per the task's fixed rule: -e
 *  everywhere, except masculine akkusativ and every dativ/plural form,
 *  which take -en. */
const ADJ_ENDINGS: Record<Case, Record<GenusOrPlural, string>> = {
  nominativ: { m: "e", f: "e", n: "e", pl: "en" },
  akkusativ: { m: "en", f: "e", n: "e", pl: "en" },
  dativ: { m: "en", f: "en", n: "en", pl: "en" },
};

/** Every ending the der-word/adjective paradigm can take (the two real
 *  der-word endings, "-e"/"-en", plus the two real ein-word/unarticled
 *  endings, "-er"/"-es", which are wrong here but still genuine German
 *  adjective endings — never an invented suffix). */
const ALL_ADJ_ENDINGS = ["e", "en", "er", "es"];

export interface AdjektivendungenQuestion extends DrillQuestion {
  lemma: string;
  adjective: string;
  grammaticalCase: Case;
}

export function buildAdjektivendungenQuestion(
  entry: NounEntry,
  rng: Rng = Math.random,
): AdjektivendungenQuestion {
  const genus = entry.genus[0]!;
  const grammaticalCase = pick(CASES, rng);
  const adjective = pick(ADJECTIVES, rng);
  const correctAnswer = ADJ_ENDINGS[grammaticalCase][genus];
  const distractors = ALL_ADJ_ENDINGS.filter((e) => e !== correctAnswer);
  const options = shuffle([correctAnswer, ...distractors]);
  const caseLabel = grammaticalCase[0]!.toUpperCase() + grammaticalCase.slice(1);
  return {
    lemma: entry.lemma,
    adjective,
    grammaticalCase,
    prompt: `${DEFINITE_ARTICLE[grammaticalCase][genus]} ${adjective}___ ${entry.lemma} (${caseLabel})`,
    options,
    correctAnswer,
  };
}

// ---------------------------------------------------------------------------
// Steigerung (comparison) drill
// ---------------------------------------------------------------------------

type SteigerungForm = "komparativ" | "superlativ";

interface SteigerungEntry {
  base: string;
  komparativ: string;
  superlativ: string;
}

/** Fixed per the task's rule data: a few regular adjectives plus the four
 *  named irregulars (groß/gut/viel/gern). */
const STEIGERUNG_ADJECTIVES: SteigerungEntry[] = [
  { base: "klein", komparativ: "kleiner", superlativ: "am kleinsten" },
  { base: "schnell", komparativ: "schneller", superlativ: "am schnellsten" },
  { base: "schön", komparativ: "schöner", superlativ: "am schönsten" },
  { base: "alt", komparativ: "älter", superlativ: "am ältesten" },
  { base: "groß", komparativ: "größer", superlativ: "am größten" },
  { base: "gut", komparativ: "besser", superlativ: "am besten" },
  { base: "viel", komparativ: "mehr", superlativ: "am meisten" },
  { base: "gern", komparativ: "lieber", superlativ: "am liebsten" },
];

export interface SteigerungQuestion extends DrillQuestion {
  base: string;
  form: SteigerungForm;
}

/** Set-independent (fixed adjective list) — see buildModalverbenQuestion's
 *  doc comment on the same pattern. */
export function buildSteigerungQuestion(rng: Rng = Math.random): SteigerungQuestion {
  const entry = pick(STEIGERUNG_ADJECTIVES, rng);
  const form = pick<SteigerungForm>(["komparativ", "superlativ"], rng);
  const correctAnswer = entry[form];
  const pool = STEIGERUNG_ADJECTIVES.flatMap((e) => [e.komparativ, e.superlativ]).filter(
    (candidate) => candidate !== correctAnswer,
  );
  const distractors = shuffle([...new Set(pool)]).slice(0, 3);
  const options = shuffle([correctAnswer, ...distractors]);
  return {
    base: entry.base,
    form,
    prompt: `${entry.base} → ___ (${form === "komparativ" ? "Komparativ" : "Superlativ"})`,
    options,
    correctAnswer,
  };
}

// ---------------------------------------------------------------------------
// Passiv drill
// ---------------------------------------------------------------------------

export type PassivTense = "präsens" | "präteritum" | "perfekt";
const PASSIV_TENSES: PassivTense[] = ["präsens", "präteritum", "perfekt"];

function passivForm(entry: VerbConjugationEntry, tense: PassivTense): string {
  if (tense === "präsens") return `wird ${entry.partizipII}`;
  if (tense === "präteritum") return `wurde ${entry.partizipII}`;
  return `ist ${entry.partizipII} worden`;
}

export interface PassivQuestion extends DrillQuestion {
  infinitive: string;
  tense: PassivTense;
}

/** `entry` must have `partizipII` (`randomVerbSample`'s pools already
 *  filter to that). werden + Partizip II per tense; the fourth (wrong)
 *  option is the plain active-voice `er`-form, so a wrong pick is still a
 *  real conjugated form of the same verb, just active instead of passive. */
export function buildPassivQuestion(
  entry: VerbConjugationEntry,
  rng: Rng = Math.random,
): PassivQuestion {
  const tense = pick(PASSIV_TENSES, rng);
  const correctAnswer = passivForm(entry, tense);
  const otherTenseForms = PASSIV_TENSES.filter((t) => t !== tense).map((t) => passivForm(entry, t));
  const options = shuffle([correctAnswer, ...otherTenseForms, entry.er]);
  return {
    infinitive: entry.infinitive,
    tense,
    prompt: `${entry.infinitive} — Passiv (${tense}): Es ___.`,
    options,
    correctAnswer,
  };
}

// ---------------------------------------------------------------------------
// Konjunktiv II drill
// ---------------------------------------------------------------------------

export interface KonjunktivQuestion extends DrillQuestion {
  infinitive: string;
}

/** würde + infinitive (the general-purpose Konjunktiv II construction) vs.
 *  hätte/wäre + infinitive (real Konjunktiv II auxiliaries, just the wrong
 *  one for a plain verb) and the plain present-tense `ich`-form, as
 *  distractors. */
export function buildKonjunktivQuestion(
  entry: VerbConjugationEntry,
  rng: Rng = Math.random,
): KonjunktivQuestion {
  void rng;
  const correctAnswer = `würde ${entry.infinitive}`;
  const distractors = [`hätte ${entry.infinitive}`, `wäre ${entry.infinitive}`, `ich ${entry.ich}`];
  const options = shuffle([correctAnswer, ...distractors]);
  return {
    infinitive: entry.infinitive,
    prompt: `Konjunktiv II: ich ___`,
    options,
    correctAnswer,
  };
}

// ---------------------------------------------------------------------------
// Relativsätze drill
// ---------------------------------------------------------------------------

/** Relative pronoun per case × genus/plural — identical to the definite
 *  article, per the task's fixed rule (no plural-dative "denen" special
 *  case is drilled here, keeping this table symmetric with
 *  DEFINITE_ARTICLE/ADJ_ENDINGS above; the rule's intro text still notes
 *  the real "denen" exception for readers who open "See the rule"). */
const RELATIVE_PRONOUN: Record<Case, Record<GenusOrPlural, string>> = DEFINITE_ARTICLE;

const RELATIVSATZ_TEMPLATE: Record<Case, (article: string, lemma: string) => string> = {
  nominativ: (article, lemma) => `${article} ${lemma}, ___ da drüben steht.`,
  akkusativ: (article, lemma) => `${article} ${lemma}, ___ ich kenne.`,
  dativ: (article, lemma) => `${article} ${lemma}, ___ ich helfe.`,
};

export interface RelativsatzQuestion extends DrillQuestion {
  lemma: string;
  grammaticalCase: Case;
}

export function buildRelativsatzQuestion(
  entry: NounEntry,
  rng: Rng = Math.random,
): RelativsatzQuestion {
  const genus = entry.genus[0]!;
  const grammaticalCase = pick(CASES, rng);
  const correctAnswer = RELATIVE_PRONOUN[grammaticalCase][genus];
  const pool = new Set<string>();
  for (const c of CASES) for (const g of ["m", "f", "n", "pl"] as GenusOrPlural[]) pool.add(RELATIVE_PRONOUN[c][g]);
  pool.delete(correctAnswer);
  const distractors = shuffle([...pool]).slice(0, 3);
  const options = shuffle([correctAnswer, ...distractors]);
  return {
    lemma: entry.lemma,
    grammaticalCase,
    prompt: RELATIVSATZ_TEMPLATE[grammaticalCase](NOMINATIVE_ARTICLE[genus], entry.lemma),
    options,
    correctAnswer,
  };
}
