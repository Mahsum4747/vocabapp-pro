import { languageByCode, type LanguageCode } from "./languages.ts";

/**
 * A language as the forms hold it while editing: the canonical code when we
 * recognize it, plus the text actually shown in the field.
 *
 * Both halves are kept because they answer different questions — the code is
 * what features branch on, the text is what the set displays and what gets
 * sent to Gemini. `code: null` with non-empty text is the "Other" case: an
 * unrecognized language the user typed anyway, which still gets stored as
 * free text.
 */
export type LanguageChoice = {
  code: LanguageCode | null;
  text: string;
};

/** An empty choice — no language selected. */
export const NO_LANGUAGE: LanguageChoice = { code: null, text: "" };

/** The choice for a known code, labelled in English. */
export function languageChoice(code: LanguageCode): LanguageChoice {
  return { code, text: languageByCode(code).label };
}

/**
 * Rebuild a choice from what a set has stored: the resolved code (which may
 * itself have come from the free text) plus the free text to display. Falls
 * back to the code's English label when a set has a code but no free text —
 * the primary definition language, which has no free-text field at all.
 */
export function storedLanguageChoice(
  code: LanguageCode | null,
  freeText: string | undefined,
): LanguageChoice {
  const text = freeText?.trim() ? freeText : code ? languageByCode(code).label : "";
  return { code, text };
}
