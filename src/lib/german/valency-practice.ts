import { listVerbLexicon } from "./verb-lexicon";
import { lookupAcceptedValencyReferences } from "./verb-valency-index";
import {
  diagnoseValencyCaseContrast,
  valencyDiagnosticTokens,
} from "../curriculum/lesson-diagnostics";
import type { DrillQuestion } from "../grammar-drills";

let acceptedVerbs: string[] | undefined;
export const acceptedValencyVerbs = () =>
  (acceptedVerbs ??= listVerbLexicon()
    .filter((entry) => lookupAcceptedValencyReferences(entry.lemma).length > 0)
    .map((entry) => entry.lemma));

/** Offer full reflexive constructions as well as base lemmas in the existing search. */
export const acceptedValencySearchTerms = () =>
  [
    ...new Set(
      acceptedValencyVerbs().flatMap((verb) => [
        verb,
        ...lookupAcceptedValencyReferences(verb).map((frame) => frame.construction),
      ]),
    ),
  ].sort();

export type ValencyPracticeQuestion = DrillQuestion & {
  valencyExample: {
    term: string;
    meaning: string;
    sourceURL: string;
    expected: string;
    index: number;
  };
};

/** Only already accepted, sentence-scoped source examples; no generated lesson or rule. */
export function sourceValencyPronounQuestions(term?: string): ValencyPracticeQuestion[] {
  const verbs = term ? [term] : acceptedValencyVerbs();
  const questions: ValencyPracticeQuestion[] = [];
  for (const verb of verbs)
    for (const frame of lookupAcceptedValencyReferences(verb)) {
      if (frame.review !== "eligible") continue;
      for (const target of frame.diagnosticConditions?.allowedPronounTargets ?? []) {
        const context = frame.context[0];
        const example = context?.examples.find(
          (entry): entry is { text: string; type: string } =>
            typeof entry === "object" &&
            entry !== null &&
            "text" in entry &&
            typeof entry.text === "string" &&
            "type" in entry &&
            entry.type === "example" &&
            valencyDiagnosticTokens(entry.text).join(" ") === target.answer,
        );
        if (!example) continue;
        const words = [...example.text.matchAll(/[^\s,:;()]+/g)];
        const slot = words[target.index];
        const correctAnswer = target.answer.split(" ")[target.index];
        if (!slot || valencyDiagnosticTokens(slot[0])[0] !== correctAnswer) continue;
        const contrast: Record<string, string> = {
          mir: "mich",
          dir: "dich",
          ihm: "ihn",
          mich: "mir",
          dich: "dir",
          ihn: "ihm",
        };
        const wrong = contrast[correctAnswer];
        if (!wrong) continue;
        const response = target.answer.split(" ");
        response[target.index] = wrong;
        const diagnosis = diagnoseValencyCaseContrast(target.answer, response.join(" "), "choice");
        if (!diagnosis?.targetLabel?.startsWith(frame.construction + " +")) continue;
        const sourceURL = `https://en.wiktionary.org/wiki/${encodeURIComponent(frame.lemma)}#German`;
        questions.push({
          lexicalFeedback: { [wrong]: diagnosis.targetLabel! },
          prompt:
            example.text.slice(0, slot.index) +
            "___" +
            example.text.slice(slot.index! + correctAnswer.length),
          options: [correctAnswer, wrong],
          correctAnswer,
          valencyExample: {
            term: frame.lemma,
            meaning: context.glosses.join("; "),
            sourceURL,
            expected: example.text,
            index: target.index,
          },
        });
      }
    }
  return questions;
}

/** Only the chosen target changes. Other wrong people/cases never create a lexical diagnosis. */
export function valencyPracticeFeedback(
  question: ValencyPracticeQuestion,
  response: string,
): string | null {
  const words = valencyDiagnosticTokens(question.valencyExample.expected);
  words[question.valencyExample.index] = response;
  return (
    diagnoseValencyCaseContrast(question.valencyExample.expected, words.join(" "), "choice")
      ?.targetLabel ?? null
  );
}
