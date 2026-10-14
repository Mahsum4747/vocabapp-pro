import {
  eligibleBareDativeFrames,
  eligiblePrepositionalFrames,
  isPrepositionToken,
} from "../german/verb-valency-index";
import { lookupVerbConjugation } from "../german/verb-conjugation-data";
import { normalizeLessonAnswer } from "./lesson-session";
import type { LessonDefinition, LessonStep } from "./types";
import type { DiagnosticCategory, DiagnosticDomain } from "../learner-diagnostics";

export type LessonDiagnosticDraft = {
  domain: DiagnosticDomain;
  category: DiagnosticCategory;
  targetId?: string;
  targetLabel?: string;
  confidence: number;
  independent: boolean;
  support: "hint" | "example" | "reveal" | "choice" | "none";
};

const uniqueConstructions = <T extends { construction: string }>(frames: readonly T[]): T[] =>
  frames.filter(
    (frame, index) =>
      frames.findIndex((other) => other.construction === frame.construction) === index,
  );

const DATIVE_PRONOUNS = ["mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen"] as const;

// A1-safe case pairs: the two forms refer to the same person/number.
// Other contrasts (e.g. ihn -> mir) change the referent as well as the case.
const CROSS_CASE_PAIRS = new Set([
  "mich|mir",
  "mir|mich",
  "dich|dir",
  "dir|dich",
  "ihn|ihm",
  "ihm|ihn",
]);
const SEPARABLE_PREFIXES = [
  "ab",
  "an",
  "auf",
  "aus",
  "bei",
  "ein",
  "mit",
  "nach",
  "vor",
  "zu",
  "zurück",
  "weg",
];

/** Recognize only sourced inflections; never manufacture a lemma from a word. */
export function hasVerifiedVerbForm(sentenceTokens: readonly string[], lemma: string): boolean {
  const parts = lemma.split(/\s+/);
  if (
    parts[0] === "sich" &&
    !sentenceTokens.some((token) => ["mich", "dich", "sich", "uns", "euch"].includes(token))
  )
    return false;
  if (
    parts
      .slice(0, -1)
      .filter((part) => part !== "sich")
      .some((part) => !sentenceTokens.includes(tokens(part).join(" ")))
  )
    return false;
  const verb = parts[parts.length - 1];
  const paradigm = lookupVerbConjugation(verb);
  if (!paradigm) return sentenceTokens.includes(tokens(verb).join(" "));
  const forms = [
    paradigm.infinitive,
    paradigm.ich,
    paradigm.du,
    paradigm.er,
    paradigm.partizipII,
  ].filter((form): form is string => Boolean(form));
  // A stripped separable-prefix form (e.g. geht for fremdgehen) is not
  // independent evidence for that prefixed verb without the prefix.
  // Prefix spelling alone is not enough: antworten begins with "an" but
  // is not separable. A sourced finite form that keeps the prefix confirms
  // the verb is not being used as a stripped separable form.
  const prefixCandidate = [...SEPARABLE_PREFIXES]
    .sort((a, b) => b.length - a.length)
    .find((candidate) => verb.startsWith(candidate) && verb.length > candidate.length + 3);
  const prefix =
    prefixCandidate && !paradigm.er.toLowerCase().startsWith(prefixCandidate)
      ? prefixCandidate
      : null;
  return forms.some(
    (form) =>
      sentenceTokens.includes(tokens(form).join(" ")) &&
      (!prefix ||
        form.toLowerCase().includes(prefix) ||
        sentenceTokens.includes(tokens(prefix).join(" "))),
  );
}

const tokens = (value: string) => valencyDiagnosticTokens(value);
export function valencyDiagnosticTokens(value: string) {
  return normalizeLessonAnswer(value, false, true)
    .replace(/[,:;()]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function isAlreadyCorrect(step: Extract<LessonStep, { kind: "text" }>, response: string) {
  return step.acceptedAnswers.some(
    (answer) =>
      normalizeLessonAnswer(answer, Boolean(step.caseSensitive), step.answerLanguage === "de") ===
      normalizeLessonAnswer(response, Boolean(step.caseSensitive), step.answerLanguage === "de"),
  );
}

/**
 * Conservative deterministic diagnosis for bounded lesson responses.
 * Returns null when the response does not support a narrow diagnosis.
 * This never changes grading, completion, checks or mastery evidence.
 */
export function diagnoseLessonResponse(
  lesson: LessonDefinition,
  step: LessonStep,
  response: string,
  options: { hintUsed?: boolean; revealed?: boolean; attemptNumber?: number } = {},
): LessonDiagnosticDraft | null {
  if (step.kind !== "text" || !response.trim() || isAlreadyCorrect(step, response)) return null;

  const expected = step.acceptedAnswers[0] ?? "";
  const expectedTokens = tokens(expected);
  const actualTokens = tokens(response);
  const context = `${step.prompt} ${expected}`.toLocaleLowerCase("de-DE");

  const support: LessonDiagnosticDraft["support"] = options.revealed
    ? "reveal"
    : options.hintUsed
      ? "hint"
      : step.example
        ? "example"
        : "none";
  const independent = support === "none";

  if (context.includes("helfen")) {
    const expectedPronoun = expectedTokens.find((token) =>
      DATIVE_PRONOUNS.includes(token as (typeof DATIVE_PRONOUNS)[number]),
    );
    const hasHelpVerb = actualTokens.some((token) => /^helf|^hilf/.test(token));
    const omittedRecipient =
      expectedPronoun &&
      expectedTokens.length === actualTokens.length + 1 &&
      expectedTokens
        .filter((token, index) => index !== expectedTokens.indexOf(expectedPronoun))
        .join(" ") === actualTokens.join(" ");
    if (omittedRecipient && hasHelpVerb && expectedTokens.includes("helfen")) {
      return {
        domain: "grammar",
        category: "lexical_government",
        targetId: "DE.GRAMMAR.LEXICAL.HELFEN_DAT",
        targetLabel: "helfen + Dativ",
        confidence: 0.86,
        independent,
        support,
      };
    }
  }

  if (context.includes("mit ") || expectedTokens[0] === "mit") {
    const expectedArticle = expectedTokens.find((token) => ["dem", "der", "den"].includes(token));
    const hasMit = actualTokens.includes("mit");
    const articleIndex = expectedTokens.indexOf(expectedArticle ?? "");
    const onlyArticleChanged =
      articleIndex >= 0 &&
      expectedTokens.length === actualTokens.length &&
      expectedTokens.every(
        (token, index) => index === articleIndex || token === actualTokens[index],
      ) &&
      actualTokens[articleIndex] !== expectedArticle;
    if (expectedArticle && hasMit && onlyArticleChanged && expectedTokens.includes("mit")) {
      return {
        domain: "grammar",
        category: "case_form",
        targetId: "DE.GRAMMAR.PREPOSITION.MIT_DAT",
        targetLabel: "mit + Dativ",
        confidence: 0.8,
        independent,
        support,
      };
    }
  }

  const valencyDiagnostic = diagnoseValencyCaseContrast(expected, response, support);
  if (valencyDiagnostic) return valencyDiagnostic;

  // A case mismatch without a verified government frame is not proof of a rule.
  // Do not let the generic pronoun heuristic turn it into a confident diagnosis.
  if (
    expectedTokens.length === actualTokens.length &&
    expectedTokens.filter((token, index) => token !== actualTokens[index]).length === 1
  ) {
    const i = expectedTokens.findIndex((token, index) => token !== actualTokens[index]);
    const a = expectedTokens[i],
      b = actualTokens[i];
    const acc = ["mich", "dich", "ihn", "es"];
    const dat = ["mir", "dir", "ihm", "ihr", "ihnen"];
    if ((acc.includes(a) && dat.includes(b)) || (dat.includes(a) && acc.includes(b))) return null;
  }

  // Diagnose only when the authored expected response provides a reliable contrast.
  // Never treat a generic wrong answer as proof of a broad grammar weakness.
  const accusativePronouns = ["mich", "dich", "ihn", "sie", "es", "uns", "euch"];
  const dativePronouns = ["mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen"];
  const pronounSkills = new Set([
    "DE.A1.GRAMMAR.PRONOUNS.ACCUSATIVE",
    "DE.A1.GRAMMAR.PRONOUNS.DATIVE",
  ]);
  if (step.skillIds.some((id) => pronounSkills.has(id))) {
    const expectedPronoun = expectedTokens.find((token) =>
      [...accusativePronouns, ...dativePronouns].includes(token),
    );
    const suppliedPronoun = actualTokens.find((token) =>
      [...accusativePronouns, ...dativePronouns].includes(token),
    );
    if (
      expectedPronoun &&
      suppliedPronoun &&
      expectedPronoun !== suppliedPronoun &&
      expectedTokens.length === actualTokens.length &&
      expectedTokens
        .filter((token) => token !== expectedPronoun)
        .every((token) => actualTokens.includes(token))
    ) {
      return {
        domain: "grammar",
        category: "pronoun_form",
        targetLabel: "Object pronoun in this sentence",
        confidence: 0.76,
        independent,
        support,
      };
    }
  }

  const orderSkills = new Set([
    "DE.A1.GRAMMAR.ORDER.DECLARATIVE_V2",
    "DE.A1.GRAMMAR.ORDER.FRONTED_TIME",
  ]);
  if (
    step.skillIds.some((id) => orderSkills.has(id)) &&
    expectedTokens.length >= 3 &&
    expectedTokens.length === actualTokens.length &&
    expectedTokens[1] !== actualTokens[1] &&
    [...expectedTokens].sort().join(" ") === [...actualTokens].sort().join(" ")
  ) {
    return {
      domain: "grammar",
      category: "word_order",
      targetLabel: "Main-clause word order",
      confidence: 0.7,
      independent,
      support,
    };
  }

  // A lesson tag alone is no evidence that this response contains a case error.
  return null;
}

/** Shared bounded contrast for lessons and source-context pronoun practice. */
export function diagnoseValencyCaseContrast(
  expected: string,
  response: string,
  support: LessonDiagnosticDraft["support"] = "none",
): LessonDiagnosticDraft | null {
  const expectedTokens = tokens(expected);
  const actualTokens = tokens(response);
  const independent = support === "none";
  // Verified government: one aligned case substitution in an otherwise
  // identical authored answer. We do not parse arbitrary German sentences.
  const caseForms: Record<string, "akkusativ" | "dativ" | "ambiguous"> = {
    mich: "akkusativ",
    dich: "akkusativ",
    ihn: "akkusativ",
    es: "akkusativ",
    mir: "dativ",
    dir: "dativ",
    ihm: "dativ",
    ihr: "dativ",
    ihnen: "dativ",
    uns: "ambiguous",
    euch: "ambiguous",
    sie: "ambiguous",
  };
  if (expectedTokens.length === actualTokens.length) {
    const changes = expectedTokens.flatMap((token, index) =>
      token === actualTokens[index]
        ? []
        : [{ index, expected: token, actual: actualTokens[index] }],
    );
    if (changes.length === 1) {
      const change = changes[0];
      const expectedCase = caseForms[change.expected];
      const actualCase = caseForms[change.actual];
      if (
        expectedCase &&
        actualCase &&
        expectedCase !== actualCase &&
        expectedCase !== "ambiguous" &&
        actualCase !== "ambiguous" &&
        CROSS_CASE_PAIRS.has(`${change.expected}|${change.actual}`)
      ) {
        const preceding = expectedTokens[change.index - 1];
        // Only the immediately adjacent preposition can govern this pronoun.
        const prepFrames = uniqueConstructions(
          eligiblePrepositionalFrames(preceding ?? "", expectedCase).filter(
            (entry) =>
              hasVerifiedVerbForm(expectedTokens, entry.construction) &&
              (!entry.diagnosticConditions?.allowedNormalizedAnswers ||
                entry.diagnosticConditions.allowedNormalizedAnswers.includes(
                  expectedTokens.join(" "),
                )) &&
              (!entry.diagnosticConditions?.allowedPronounTargets ||
                entry.diagnosticConditions.allowedPronounTargets.some(
                  (target) =>
                    target.answer === expectedTokens.join(" ") && target.index === change.index,
                )),
          ),
        );
        // A prepositional object cannot be a bare dative argument.
        const dativeFrames =
          expectedCase === "dativ" && !isPrepositionToken(preceding ?? "")
            ? uniqueConstructions(
                eligibleBareDativeFrames().filter(
                  (entry) =>
                    hasVerifiedVerbForm(expectedTokens, entry.construction) &&
                    (!entry.diagnosticConditions?.allowedNormalizedAnswers ||
                      entry.diagnosticConditions.allowedNormalizedAnswers.includes(
                        expectedTokens.join(" "),
                      )) &&
                    (!entry.diagnosticConditions?.allowedPronounTargets ||
                      entry.diagnosticConditions.allowedPronounTargets.some(
                        (target) =>
                          target.answer === expectedTokens.join(" ") &&
                          target.index === change.index,
                      )),
                ),
              )
            : [];
        // Multiple candidates or unsupported prepositional roles are ambiguous.
        if (prepFrames.length === 1 && dativeFrames.length === 0) {
          const frame = prepFrames[0];
          return {
            domain: "grammar",
            category: "lexical_government",
            targetLabel: `${frame.construction} + ${frame.preposition} + ${expectedCase === "dativ" ? "Dativ" : "Akkusativ"}`,
            confidence: 0.88,
            independent,
            support,
          };
        }
        if (prepFrames.length === 0 && dativeFrames.length === 1) {
          return {
            domain: "grammar",
            category: "lexical_government",
            targetLabel: `${dativeFrames[0].construction} + Dativ`,
            confidence: 0.88,
            independent,
            support,
          };
        }
      }
    }
  }

  return null;
}
