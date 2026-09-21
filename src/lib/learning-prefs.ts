/**
 * The two learning preferences on the user profile — and the only two.
 *
 * `explanationLanguage` is the language explanations (glosses, grammar notes)
 * should be written in; `direction` is which language the learner is studying
 * toward. Nothing else about the learner is asked for or stored: no age,
 * country, level or any other demographic field.
 */
export const EXPLANATION_LANGUAGES = ["en", "tr", "ku"] as const;
export type ExplanationLanguage = (typeof EXPLANATION_LANGUAGES)[number];
export const DEFAULT_EXPLANATION_LANGUAGE: ExplanationLanguage = "en";

export const DIRECTIONS = ["learn_de", "learn_tr", "learn_ku"] as const;
export type Direction = (typeof DIRECTIONS)[number];
export const DEFAULT_DIRECTION: Direction = "learn_de";

export type LearningPrefs = {
  explanationLanguage: ExplanationLanguage;
  direction: Direction;
};

export const DEFAULT_LEARNING_PREFS: LearningPrefs = {
  explanationLanguage: DEFAULT_EXPLANATION_LANGUAGE,
  direction: DEFAULT_DIRECTION,
};

export const EXPLANATION_LANGUAGE_LABELS: Record<ExplanationLanguage, string> = {
  en: "English",
  tr: "Türkçe",
  ku: "Kurdî",
};

export const DIRECTION_LABELS: Record<Direction, string> = {
  learn_de: "Learn German",
  learn_tr: "Learn Turkish",
  learn_ku: "Learn Kurdish",
};

export function isExplanationLanguage(value: unknown): value is ExplanationLanguage {
  return typeof value === "string" && (EXPLANATION_LANGUAGES as readonly string[]).includes(value);
}

export function isDirection(value: unknown): value is Direction {
  return typeof value === "string" && (DIRECTIONS as readonly string[]).includes(value);
}

/** Read prefs off a stored user doc, field by field, falling back to defaults. */
export function readLearningPrefs(stored: unknown): LearningPrefs {
  const doc = (stored ?? {}) as Record<string, unknown>;
  return {
    explanationLanguage: isExplanationLanguage(doc.explanationLanguage)
      ? doc.explanationLanguage
      : DEFAULT_EXPLANATION_LANGUAGE,
    direction: isDirection(doc.direction) ? doc.direction : DEFAULT_DIRECTION,
  };
}

/**
 * Pick the string for the learner's explanation language, falling back to
 * English — never blank. Kurdish is selectable before any Kurdish content
 * exists, so a missing (or empty) `ku` entry must read as English, not vanish.
 */
export function pickExplanation<T extends string>(
  strings: Partial<Record<ExplanationLanguage, T>> & { en: T },
  language: ExplanationLanguage,
): T {
  const chosen = strings[language];
  return chosen !== undefined && chosen.trim() !== "" ? chosen : strings.en;
}

/** How many graded reviews count as "a first study session" for the one-time prompt. */
export const FIRST_SESSION_MIN_REVIEWS = 5;

/**
 * Ask once, after the first study session, and only if the learner hasn't
 * already chosen. `prefsPrompted` is set the moment they save or dismiss, so it
 * never returns.
 */
export function shouldPromptForPrefs(input: {
  totalReviews: number;
  prefsPrompted: boolean;
}): boolean {
  return !input.prefsPrompted && input.totalReviews >= FIRST_SESSION_MIN_REVIEWS;
}
