/**
 * The Lesen Paste JSON contract (see lesen-paste-prompt.ts for the text a
 * learner gives their own AI). Parsing is all-or-nothing, same discipline
 * as karta-import.ts/grammar-paste-import.ts: any schema violation returns
 * every error found and no usable round at all. Pure, no framework
 * imports, directly unit-testable.
 *
 * Unlike grammar-paste-import.ts, a question's "prompt" is a plain
 * comprehension question — NOT required to contain a "___" blank marker,
 * since this is reading comprehension, not fill-in-the-blank grammar.
 *
 * This output is NEVER written to `grammarProgress`/`lesenProgress` and
 * NEVER mixed into the bundled `LESEN_PASSAGES` pool — it only ever drives
 * a choice-style session (grammar.lesen-paste.tsx), saved to
 * its own separate `lesenPasteTopics` history. See that route's and
 * lesen-paste-topics.ts's own doc comments.
 */

export type LesenPasteQuestion = {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string | null;
};

export type LesenPasteRound = {
  title: string;
  text: string;
  questions: LesenPasteQuestion[];
};

export type LesenPasteParseResult =
  | { ok: true; value: LesenPasteRound }
  | { ok: false; errors: string[] };

const ROOT_KEYS = ["title", "text", "questions", "error"];
const QUESTION_KEYS = ["prompt", "options", "correctIndex", "explanation"];
const DEFAULT_QUESTION_COUNT = 5;
const OPTION_COUNT = 4;
const MAX_ERRORS = 20;
const MAX_TITLE_LENGTH = 200;
const MAX_TEXT_LENGTH = 4000;
const MIN_TEXT_LENGTH = 10;
const MAX_EXPLANATION_LENGTH = 400;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unknownKeys(obj: Record<string, unknown>, allowed: string[]): string[] {
  return Object.keys(obj).filter((k) => !allowed.includes(k));
}

export function parseLesenPasteJson(
  raw: string,
  expectedQuestionCount: number = DEFAULT_QUESTION_COUNT,
): LesenPasteParseResult {
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

  if (!isObject(data)) return { ok: false, errors: ["Top level must be a JSON object."] };

  // The prompt's own escape valve: the AI declined the topic outright.
  if (typeof data.error === "string" && data.questions === undefined) {
    return { ok: false, errors: [data.error.trim() || "The AI declined this topic."] };
  }

  const errors: string[] = [];
  const fail = (message: string) => {
    if (errors.length < MAX_ERRORS) errors.push(message);
  };

  for (const key of unknownKeys(data, ROOT_KEYS)) fail(`Unknown top-level field "${key}".`);

  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) fail('"title" must be a non-empty string.');
  if (title.length > MAX_TITLE_LENGTH) {
    fail(`"title" is too long (${title.length} chars, max ${MAX_TITLE_LENGTH}).`);
  }

  const passageText = typeof data.text === "string" ? data.text.trim() : "";
  if (passageText.length < MIN_TEXT_LENGTH) fail('"text" must be a real reading passage, not empty.');
  if (passageText.length > MAX_TEXT_LENGTH) {
    fail(`"text" is too long (${passageText.length} chars, max ${MAX_TEXT_LENGTH}).`);
  }

  const rawQuestions = data.questions;
  if (!Array.isArray(rawQuestions)) {
    return { ok: false, errors: [...errors, '"questions" must be an array.'] };
  }
  if (rawQuestions.length !== expectedQuestionCount) {
    return {
      ok: false,
      errors: [
        ...errors,
        `"questions" must have exactly ${expectedQuestionCount} entries, got ${rawQuestions.length}.`,
      ],
    };
  }

  const questions: LesenPasteQuestion[] = [];

  rawQuestions.forEach((entry, i) => {
    const at = `Question ${i + 1}`;
    if (!isObject(entry)) return fail(`${at}: must be an object.`);
    for (const key of unknownKeys(entry, QUESTION_KEYS)) fail(`${at}: unknown field "${key}".`);

    const prompt = typeof entry.prompt === "string" ? entry.prompt.trim() : "";
    if (!prompt) fail(`${at}: "prompt" must be a non-empty string.`);

    const rawOptions = entry.options;
    let options: string[] = [];
    if (!Array.isArray(rawOptions) || rawOptions.length !== OPTION_COUNT) {
      fail(`${at}: "options" must be an array of exactly ${OPTION_COUNT} strings.`);
    } else if (!rawOptions.every((o) => typeof o === "string" && o.trim())) {
      fail(`${at}: every "options" entry must be a non-empty string.`);
    } else {
      options = rawOptions.map((o) => (o as string).trim());
      if (new Set(options).size !== options.length) {
        fail(`${at}: "options" must be 4 distinct strings.`);
      }
    }

    const correctIndex = entry.correctIndex;
    if (typeof correctIndex !== "number" || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      fail(`${at}: "correctIndex" must be an integer from 0 to 3.`);
    }

    const rawExplanation = entry.explanation ?? null;
    let explanation: string | null = null;
    if (rawExplanation !== null && typeof rawExplanation !== "string") {
      fail(`${at}: "explanation" must be a string or null.`);
    } else if (typeof rawExplanation === "string") {
      explanation = rawExplanation.trim().slice(0, MAX_EXPLANATION_LENGTH) || null;
    }

    if (errors.length > 0 || !prompt || options.length !== OPTION_COUNT || typeof correctIndex !== "number") return;
    questions.push({
      prompt,
      options: options as [string, string, string, string],
      correctIndex: correctIndex as 0 | 1 | 2 | 3,
      explanation,
    });
  });

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: { title, text: passageText, questions },
  };
}
