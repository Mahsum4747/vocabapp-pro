import { caseFormFor, sentenceHasForm } from "./case-forms.ts";
import type { CaseExamples, CardEnrichment, GrammaticalGender } from "./types.ts";

/**
 * The Karta JSON upload contract (see karta-prompt.ts for the text a learner
 * gives their own AI). Parsing is all-or-nothing: any schema violation
 * returns every error found and NO cards — a partly-written import is never
 * produced. Pure, no framework imports, directly unit-testable.
 *
 * Maps onto LIVE Card fields only: term → `term`, gloss → `definition`,
 * examples.nom → `example` (what Cloze/Satzbau read), examples → `examples`,
 * gender/plural/noPlural → `enrichment` (source "user", so the dictionary
 * never overwrites it). `pos` is used to validate and is not stored.
 */
export type KartaCard = {
  term: string;
  definition: string;
  example: string | null;
  examples: CaseExamples | null;
  enrichment: CardEnrichment | null;
};

export type KartaImport = {
  title: string;
  pair: "de-en" | "de-tr";
  level: "A1" | "A2";
  cards: KartaCard[];
  /** Non-fatal notes: what was left out of Articles/Cases and why. */
  warnings: string[];
};

export type KartaParseResult =
  | { ok: true; value: KartaImport }
  | { ok: false; errors: string[] };

const ROOT_KEYS = ["title", "pair", "level", "cards"];
const CARD_KEYS = ["term", "pos", "gender", "plural", "noPlural", "gloss", "examples"];
const EXAMPLE_KEYS = ["nom", "akk", "dat"];
const POS = ["noun", "verb", "adj", "other"];
const GENDER_TO_CODE: Record<string, GrammaticalGender> = { der: "m", die: "f", das: "n" };
const MAX_ERRORS = 20;
export const MIN_CARDS = 8;
export const MAX_CARDS = 200;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unknownKeys(obj: Record<string, unknown>, allowed: string[]): string[] {
  return Object.keys(obj).filter((k) => !allowed.includes(k));
}

export function parseKartaJson(raw: string): KartaParseResult {
  // Tolerate a fenced ```json block: chat models add it despite the prompt.
  const text = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (error) {
    return {
      ok: false,
      errors: [`Not valid JSON: ${error instanceof Error ? error.message : "parse error"}.`],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const fail = (message: string) => {
    if (errors.length < MAX_ERRORS) errors.push(message);
  };

  if (!isObject(data)) return { ok: false, errors: ["Top level must be a JSON object."] };
  for (const key of unknownKeys(data, ROOT_KEYS)) fail(`Unknown top-level field "${key}".`);

  const title = data.title;
  if (typeof title !== "string" || !title.trim()) fail('"title" must be a non-empty string.');
  const pair = data.pair;
  if (pair !== "de-en" && pair !== "de-tr") fail('"pair" must be "de-en" or "de-tr".');
  const level = data.level;
  if (level !== "A1" && level !== "A2") fail('"level" must be "A1" or "A2".');
  const rawCards = data.cards;
  if (!Array.isArray(rawCards) || rawCards.length === 0) {
    fail('"cards" must be a non-empty array.');
    return { ok: false, errors };
  }
  if (rawCards.length < MIN_CARDS || rawCards.length > MAX_CARDS) {
    return {
      ok: false,
      errors: [
        `${rawCards.length} cards: an import needs at least ${MIN_CARDS} and at most ${MAX_CARDS}.`,
        ...errors,
      ],
    };
  }

  const cards: KartaCard[] = [];
  let nounsWithoutGender = 0;
  let droppedExamples = 0;

  rawCards.forEach((entry, i) => {
    const at = `Card ${i + 1}`;
    if (!isObject(entry)) return fail(`${at}: must be an object.`);
    for (const key of unknownKeys(entry, CARD_KEYS)) fail(`${at}: unknown field "${key}".`);

    const term = typeof entry.term === "string" ? entry.term.trim() : "";
    if (!term) fail(`${at}: "term" must be a non-empty string.`);
    const pos = entry.pos;
    if (typeof pos !== "string" || !POS.includes(pos)) {
      fail(`${at} (${term || "?"}): "pos" must be noun, verb, adj or other.`);
    }
    const gloss = typeof entry.gloss === "string" ? entry.gloss.trim() : "";
    if (!gloss) fail(`${at} (${term || "?"}): "gloss" must be a non-empty string.`);

    const genderWord = entry.gender ?? null;
    if (genderWord !== null && !(typeof genderWord === "string" && genderWord in GENDER_TO_CODE)) {
      fail(`${at} (${term}): "gender" must be der, die, das or null.`);
    }
    const plural = entry.plural ?? null;
    if (plural !== null && typeof plural !== "string") {
      fail(`${at} (${term}): "plural" must be a string or null.`);
    }
    const noPluralRaw = entry.noPlural ?? false;
    if (typeof noPluralRaw !== "boolean") fail(`${at} (${term}): "noPlural" must be true or false.`);
    const noPlural = noPluralRaw === true;
    if (noPlural && typeof plural === "string" && plural.trim()) {
      fail(`${at} (${term}): "noPlural" is true but "plural" is set.`);
    }

    if (pos === "noun" && /^(der|die|das)\s/i.test(term)) {
      fail(`${at}: "${term}" has the article inside term; put it in "gender".`);
    }
    if (pos !== "noun" && genderWord !== null) {
      fail(`${at} (${term}): "gender" must be null unless pos is "noun".`);
    }

    const rawExamples = entry.examples ?? null;
    if (rawExamples !== null && !isObject(rawExamples)) {
      fail(`${at} (${term}): "examples" must be an object or null.`);
    }
    const ex: Record<string, string | null> = { nom: null, akk: null, dat: null };
    if (isObject(rawExamples)) {
      for (const key of unknownKeys(rawExamples, EXAMPLE_KEYS)) {
        fail(`${at} (${term}): unknown examples field "${key}".`);
      }
      for (const key of EXAMPLE_KEYS) {
        const value = rawExamples[key] ?? null;
        if (value !== null && typeof value !== "string") {
          fail(`${at} (${term}): examples.${key} must be a string or null.`);
        } else {
          ex[key] = value?.trim() || null;
        }
      }
    }

    // The learner's sentence must actually use the case it is filed under —
    // otherwise Cases would show a wrong-case sentence. Wrong ones are
    // dropped (reported), never rewritten or invented.
    const code = typeof genderWord === "string" ? GENDER_TO_CODE[genderWord] : undefined;
    if (pos === "noun" && !code) nounsWithoutGender += 1;
    for (const [key, nounCase] of [
      ["akk", "akkusativ"],
      ["dat", "dativ"],
    ] as const) {
      const sentence = ex[key];
      if (!sentence) continue;
      if (!code || !sentenceHasForm(sentence, caseFormFor(code, nounCase))) {
        ex[key] = null;
        droppedExamples += 1;
      }
    }

    if (errors.length > 0 || !term || !gloss) return;
    const enrichment: CardEnrichment | null =
      pos === "noun" && (code || noPlural || (typeof plural === "string" && plural.trim()))
        ? {
            ...(code ? { gender: code } : {}),
            ...(typeof plural === "string" && plural.trim() ? { plural: plural.trim() } : {}),
            ...(noPlural ? { noPlural: true as const } : {}),
            source: "user",
          }
        : null;
    const examples: CaseExamples | null = ex.nom || ex.akk || ex.dat ? { nom: ex.nom, akk: ex.akk, dat: ex.dat } : null;
    cards.push({ term, definition: gloss, example: ex.nom, examples, enrichment });
  });

  if (errors.length > 0) return { ok: false, errors };

  if (nounsWithoutGender > 0) {
    warnings.push(
      `${nounsWithoutGender} noun${nounsWithoutGender === 1 ? "" : "s"} without a gender: imported, but kept out of Articles/Cases.`,
    );
  }
  if (droppedExamples > 0) {
    warnings.push(
      `${droppedExamples} akk/dat sentence${droppedExamples === 1 ? "" : "s"} left out: they didn't contain the case's article form.`,
    );
  }
  return {
    ok: true,
    value: {
      title: (title as string).trim(),
      pair: pair as "de-en" | "de-tr",
      level: level as "A1" | "A2",
      cards,
      warnings,
    },
  };
}
