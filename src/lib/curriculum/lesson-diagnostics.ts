import { DATIVE_VERB_DATA } from "../german/dative-verbs-data";
import { VERB_GOVERNMENT_DATA } from "../german/verb-government-data";
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

const DATIVE_PRONOUNS = ["mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen"] as const;

function tokens(value: string) {
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
    const omittedRecipient = expectedPronoun && expectedTokens.length === actualTokens.length + 1 &&
      expectedTokens.filter((token, index) => index !== expectedTokens.indexOf(expectedPronoun)).join(" ") === actualTokens.join(" ");
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
    const onlyArticleChanged = articleIndex >= 0 && expectedTokens.length === actualTokens.length &&
      expectedTokens.every((token, index) => index === articleIndex || token === actualTokens[index]) &&
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

  // Verified government: diagnose only a single case-form substitution in an
  // otherwise identical authored sentence. Never infer from a wrong sentence alone.
  const caseForms: Record<string, "akkusativ" | "dativ" | "ambiguous"> = {
    mich: "akkusativ", dich: "akkusativ", ihn: "akkusativ", es: "akkusativ",
    mir: "dativ", dir: "dativ", ihm: "dativ", ihr: "dativ", ihnen: "dativ",
    uns: "ambiguous", euch: "ambiguous", sie: "ambiguous",
  };
  if (expectedTokens.length === actualTokens.length) {
    const changes = expectedTokens.flatMap((token, index) =>
      token === actualTokens[index] ? [] : [{ index, expected: token, actual: actualTokens[index] }],
    );
    if (changes.length === 1) {
      const change = changes[0];
      const expectedCase = caseForms[change.expected];
      const actualCase = caseForms[change.actual];
      if (expectedCase && actualCase && expectedCase !== "ambiguous" &&
          actualCase !== "ambiguous" && expectedCase !== actualCase) {
        const preceding = expectedTokens[change.index - 1];
        const prepFrames = VERB_GOVERNMENT_DATA.filter((entry) =>
          entry.preposition === preceding && entry.case === expectedCase &&
          // Only a visible infinitive: conjugation/lemma resolution is not reliable here.
          expectedTokens.includes(entry.verb) && !entry.verb.includes(" "),
        );
        const dativeFrame = expectedCase === "dativ" &&
          DATIVE_VERB_DATA.some((entry) =>
            expectedTokens.includes(entry.verb) &&
            // Ditransitives have both Dativ and Akkusativ objects: do not guess roles.
            !["geben", "bringen", "schenken", "sagen", "schreiben", "zeigen", "schicken", "verkaufen", "erklären", "erzählen"].includes(entry.verb),
          );
        if (prepFrames.length === 1 || dativeFrame) {
          const frame = prepFrames[0];
          const targetLabel = frame
            ? `${frame.verb} + ${frame.preposition} + ${expectedCase === "dativ" ? "Dativ" : "Akkusativ"}`
            : `Dativ object with ${expectedTokens.find((token) => DATIVE_VERB_DATA.some((entry) => entry.verb === token))}`;
          return {
            domain: "grammar", category: "lexical_government", targetLabel,
            confidence: 0.88, independent, support,
          };
        }
      }
    }
  }

  // A case mismatch without a verified government frame is not proof of a rule.
  // Do not let the generic pronoun heuristic turn it into a confident diagnosis.
  if (expectedTokens.length === actualTokens.length &&
      expectedTokens.filter((token, index) => token !== actualTokens[index]).length === 1) {
    const i = expectedTokens.findIndex((token, index) => token !== actualTokens[index]);
    const a = expectedTokens[i], b = actualTokens[i];
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
    if (expectedPronoun && suppliedPronoun && expectedPronoun !== suppliedPronoun &&
        expectedTokens.length === actualTokens.length &&
        expectedTokens.filter((token) => token !== expectedPronoun).every((token) =>
          actualTokens.includes(token))) {
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
  if (step.skillIds.some((id) => orderSkills.has(id)) &&
      expectedTokens.length >= 3 &&
      expectedTokens.length === actualTokens.length &&
      expectedTokens[1] !== actualTokens[1] &&
      [...expectedTokens].sort().join(" ") === [...actualTokens].sort().join(" ")) {
    return {
      domain: "grammar",
      category: "word_order",
      targetLabel: "Main-clause word order",
      confidence: 0.7,
      independent,
      support,
    };
  }

  const dativeSkills = new Set([
    "DE.A1.GRAMMAR.PRONOUNS.DATIVE",
    "DE.A1.GRAMMAR.VERBS.DATIVE_FRAMES",
    "DE.A1.GRAMMAR.CASES.DATIVE_ARTICLES",
  ]);
  if (step.skillIds.some((id) => dativeSkills.has(id))) {
    return {
      domain: "grammar",
      category: "uncertain",
      targetLabel: "Dative in this lesson",
      confidence: 0.35,
      independent,
      support,
    };
  }

  return null;
}
