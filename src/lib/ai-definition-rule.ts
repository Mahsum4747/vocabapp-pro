/**
 * What a card's `definition` field must contain, stated once for every AI
 * path that produces one.
 *
 * Both `suggest-card.ts` (one manual card) and `generate-set.ts` (a whole set
 * from a topic) ask Gemini for the same field and must describe it
 * identically. They used to word it separately, which is exactly how they
 * drifted: a fix to one left the other still emitting dictionary-style
 * descriptions ("the male parent of a child") instead of the translation
 * ("baba") a flashcard actually needs. Keeping the wording here means there
 * is only one place to change it, and no way for the two to disagree.
 *
 * Pure strings, no framework imports — so this is directly unit-testable,
 * unlike the server-function modules that use it.
 */

/** Description for the `definition` property of Gemini's `responseSchema`. */
export const DEFINITION_SCHEMA_DESCRIPTION =
  "The term's DIRECT TRANSLATION into the definition language — a single word " +
  'or a very short equivalent phrase (e.g. "the father", "bagaj"). Never a ' +
  "dictionary definition, an explanation, or a description of what the term " +
  "means. No example sentence, no quotes, no labels, no line breaks.";

/** Description for the optional `definition2` property (same rule, other language). */
export const SECOND_DEFINITION_SCHEMA_DESCRIPTION =
  'The same translation as "definition", but written in the second definition ' +
  "language instead. Same rules — a direct translation only, never a " +
  "description, no example, no quotes, no labels.";

/**
 * The prompt lines describing the `definition` field, indented to sit under
 * whichever field list the caller is building.
 */
export function definitionRuleLines(definitionLanguage: string, indent: string): string[] {
  return [
    `${indent}"definition": the term's DIRECT TRANSLATION into ${definitionLanguage} — a single`,
    `${indent}  word or a very short equivalent phrase. Write ONLY the translation: never a`,
    `${indent}  dictionary definition, an explanation, or a description of what the term means.`,
    `${indent}  (If the term is already in that language, give the shortest equivalent synonym`,
    `${indent}  instead.) No quotes, no labels, no line breaks, no ending punctuation.`,
  ];
}

/** The same rule for the optional second definition language. */
export function secondDefinitionRuleLines(definitionLanguage2: string, indent: string): string[] {
  return [
    `${indent}"definition2": the same translation as "definition", but in ${definitionLanguage2}`,
    `${indent}  instead. Same rules — a direct translation only, never a description.`,
  ];
}

/**
 * Worked pairs showing the difference the rule above keeps failing on in
 * prose alone. Each wrong line is a real shape the model produced before:
 * grammatical, accurate, and useless on a flashcard.
 */
export function definitionExampleLines(indent: string): string[] {
  return [
    `${indent}term "Vater", definition language English -> "the father"   CORRECT`,
    `${indent}term "Vater", definition language English -> "the male parent of a child"   WRONG (a description)`,
    `${indent}term "Vater", definition language Turkish -> "baba"   CORRECT`,
    `${indent}term "Vater", definition language Turkish -> "seni dünyaya getiren erkek ebeveyn"   WRONG (a description)`,
    `${indent}term "Luggage", definition language Turkish -> "bagaj"   CORRECT`,
    `${indent}term "Luggage", definition language Turkish -> "Yolculuk sırasında taşınan bavul ve çantalar"   WRONG (a description)`,
  ];
}
