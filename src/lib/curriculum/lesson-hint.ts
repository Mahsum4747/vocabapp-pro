import type { LessonStep } from "./types";

const cleanTokens = (value: string) =>
  value
    .toLocaleLowerCase("de-DE")
    .replace(/[.,!?;:()„“"']/g, " ")
    .split(/\s+/)
    .filter(Boolean);

function missingExpectedTokens(expected: string, actual: string): string[] {
  const remaining = cleanTokens(actual);
  const missing: string[] = [];
  for (const token of cleanTokens(expected)) {
    const index = remaining.indexOf(token);
    if (index >= 0) remaining.splice(index, 1);
    else missing.push(token);
  }
  return missing;
}

/**
 * Teaching-only cue. Assessments never import this helper.
 *
 * The learner response is optional so legacy callers remain safe, but when it
 * is available we avoid generic advice the learner already followed and point
 * toward the actual remaining problem without immediately revealing the answer.
 */
export function lessonHint(step: LessonStep, learnerAnswer = "") {
  if (step.kind === "choice") {
    return `Compare the meaning of each option with the taught example. Look for the option that preserves the requested meaning, not just familiar words.`;
  }
  if (step.kind !== "text") return "";

  const answer = step.acceptedAnswers[0] ?? "";
  const actual = learnerAnswer.trim();

  if (/^\d+\./.test(answer))
    return "Use digits in day.month order. Read the date field, not the number field.";
  if (/^\d+$/.test(answer)) return "Use digits only. Find the number in the requested field.";

  if (actual && answer.includes(" ")) {
    const expectedTokens = cleanTokens(answer);
    const actualTokens = cleanTokens(actual);
    const missing = missingExpectedTokens(answer, actual);

    const startsCorrectly =
      expectedTokens.length > 0 &&
      actualTokens.length > 0 &&
      expectedTokens[0] === actualTokens[0];

    // High-value lexical-government case: the sentence frame is present but
    // the dative recipient is missing. Do not collapse this into "practice Dativ".
    if (
      /\bhelfen\b/i.test(`${step.prompt} ${answer}`) &&
      missing.length === 1 &&
      ["mir", "dir", "ihm", "ihr", "uns", "euch"].includes(missing[0]!)
    ) {
      return "Your request frame is mostly correct. Check who receives the help: helfen uses a dative person pronoun in this pattern.";
    }

    if (missing.length === 1 && actualTokens.length >= Math.max(2, expectedTokens.length - 2)) {
      return "Your sentence is mostly in place, but one required detail is missing. Re-read the task and check that every requested person, time or object is expressed.";
    }

    if (startsCorrectly) {
      return "Your opening is already correct. Compare the rest of your sentence with the taught pattern: check required details and the form/order of the remaining words.";
    }

    return `Compare your sentence with the taught frame. Check the opening, then the required details and word order.`;
  }

  if (/verb|Verb|possession/.test(step.inputLabel))
    return `Match the subject to its taught verb form. It begins “${answer.slice(0, 2)}” and ends “${answer.at(-1)}”.`;

  if (actual) {
    return `Check the exact detail requested by “${step.inputLabel}”. Use the taught example to decide which single word belongs here.`;
  }

  return `Write one ${step.inputLabel === "Adjective" ? "adjective" : "word"} using the detail requested, not the whole message.`;
}
