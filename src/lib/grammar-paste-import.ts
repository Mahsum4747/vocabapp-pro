/**
 * The Grammar Paste JSON contract (see grammar-paste-prompt.ts for the text
 * a learner gives their own AI). Parsing is all-or-nothing, same discipline
 * as karta-import.ts: any schema violation returns every error found and no
 * usable round at all. Pure, no framework imports, directly unit-testable.
 *
 * This output is NEVER written to `grammarProgress` and NEVER added to the
 * fixed 26-topic hub — it only ever drives one throwaway
 * `GrammarDrillRunner` session (grammar.paste.tsx), gone the moment the
 * learner navigates away. See that route's own doc comment.
 */

export type GrammarPasteQuestion = {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string | null;
};

export type GrammarPasteRound = {
  topic: string;
  ruleExplanation: string;
  questions: GrammarPasteQuestion[];
};

export type GrammarPasteParseResult =
  | { ok: true; value: GrammarPasteRound }
  | { ok: false; errors: string[] };

const ROOT_KEYS = ["topic", "ruleExplanation", "questions", "error"];
const QUESTION_KEYS = ["prompt", "options", "correctIndex", "explanation"];
const QUESTION_COUNT = 10;
const OPTION_COUNT = 4;
const MAX_ERRORS = 20;
const MAX_RULE_LENGTH = 1000;
const MAX_EXPLANATION_LENGTH = 400;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unknownKeys(obj: Record<string, unknown>, allowed: string[]): string[] {
  return Object.keys(obj).filter((k) => !allowed.includes(k));
}

export function parseGrammarPasteJson(raw: string): GrammarPasteParseResult {
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

  // The prompt's own escape valve: the AI declined the topic outright. A
  // single, direct error rather than "unknown field" noise about `error`.
  if (typeof data.error === "string" && data.questions === undefined) {
    return { ok: false, errors: [data.error.trim() || "The AI declined this topic."] };
  }

  const errors: string[] = [];
  const fail = (message: string) => {
    if (errors.length < MAX_ERRORS) errors.push(message);
  };

  for (const key of unknownKeys(data, ROOT_KEYS)) fail(`Unknown top-level field "${key}".`);

  const topic = typeof data.topic === "string" ? data.topic.trim() : "";
  if (!topic) fail('"topic" must be a non-empty string.');

  const ruleExplanation = typeof data.ruleExplanation === "string" ? data.ruleExplanation.trim() : "";
  if (!ruleExplanation) fail('"ruleExplanation" must be a non-empty string.');
  if (ruleExplanation.length > MAX_RULE_LENGTH) {
    fail(`"ruleExplanation" is too long (${ruleExplanation.length} chars, max ${MAX_RULE_LENGTH}).`);
  }

  const rawQuestions = data.questions;
  if (!Array.isArray(rawQuestions)) {
    return { ok: false, errors: [...errors, '"questions" must be an array.'] };
  }
  if (rawQuestions.length !== QUESTION_COUNT) {
    return {
      ok: false,
      errors: [...errors, `"questions" must have exactly ${QUESTION_COUNT} entries, got ${rawQuestions.length}.`],
    };
  }

  const questions: GrammarPasteQuestion[] = [];

  rawQuestions.forEach((entry, i) => {
    const at = `Question ${i + 1}`;
    if (!isObject(entry)) return fail(`${at}: must be an object.`);
    for (const key of unknownKeys(entry, QUESTION_KEYS)) fail(`${at}: unknown field "${key}".`);

    const prompt = typeof entry.prompt === "string" ? entry.prompt.trim() : "";
    if (!prompt) fail(`${at}: "prompt" must be a non-empty string.`);
    const blankCount = prompt ? (prompt.match(/___/g) ?? []).length : 0;
    if (prompt && blankCount !== 1) {
      fail(`${at}: "prompt" must contain the blank marker ___ exactly once, found ${blankCount}.`);
    }

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
    value: { topic, ruleExplanation, questions },
  };
}
