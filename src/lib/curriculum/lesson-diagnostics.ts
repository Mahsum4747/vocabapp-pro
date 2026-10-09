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
    if (expectedPronoun && hasHelpVerb && !actualTokens.includes(expectedPronoun)) {
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
    if (expectedArticle && hasMit && !actualTokens.includes(expectedArticle)) {
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
