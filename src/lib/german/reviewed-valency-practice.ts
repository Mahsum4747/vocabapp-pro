import reviewData from "../../content/kaikki-fixed-item-review-2026-10-14.json" with { type: "json" };
import remainingData from "../../content/kaikki-remaining-fixed-review-2026-10-15.json" with { type: "json" };
import { lookupVerbValency } from "./verb-valency-index";
import type { ValencySourceContext } from "./valency-source-context";
import type { DrillQuestion } from "../grammar-drills";

type ReviewRecord = (typeof reviewData.records)[number] | (typeof remainingData.records)[number];
const records: ReviewRecord[] = [
  ...new Map(
    [...reviewData.records, ...remainingData.records].map((record) => [record.recordId, record]),
  ).values(),
];
const sourceReviewedIds = new Set(
  remainingData.records.filter((r) => r.review.exercise).map((r) => r.recordId),
);
export type ReviewedExerciseKind = "personal_pronoun_case" | "determiner_case";
export type FixedValencySelection = {
  exerciseId: string;
  version: string;
  recordId: string;
  senseId: string;
  sentence: string;
};
const caseNames: Record<string, string> = { dat: "dativ", akk: "akkusativ", gen: "genitiv" };

function sourceArgument(context: ValencySourceContext) {
  if (context.evidence.kind !== "structured-obj-template") return null;
  const templates = context.senseMetadata.info_templates;
  if (!Array.isArray(templates)) return null;
  const template = templates[context.evidence.templateIndex];
  return template?.name === "+obj" && template?.args?.["1"] === "de"
    ? (template.args["2"] ?? null)
    : null;
}

/** Match published fixed reviews to exact source evidence; lexical diagnostic trust stays separate. */
function sourceMatches(record: ReviewRecord) {
  return lookupVerbValency(record.lemma).some(
    (frame) =>
      frame.source === "kaikki-current" &&
      (frame.referenceAcceptance === "accepted" || sourceReviewedIds.has(record.recordId)) &&
      frame.construction === record.construction &&
      frame.preposition === record.preposition &&
      frame.case === caseNames[record.sourceCase] &&
      sourceArgument(frame.context[0]) === record.usageConditions.argumentSpecificationVerbatim &&
      frame.context[0]?.requiredReflexive === record.usageConditions.requiredReflexive &&
      JSON.stringify(frame.context[0]?.tags) === JSON.stringify(record.usageConditions.tags) &&
      frame.context[0]?.senseId === record.senseId &&
      frame.context[0]?.source.snapshotSha256 === record.snapshotSha256 &&
      frame.context[0]?.source.recordSha256 === record.recordSha256,
  );
}
function isActivatable(record: ReviewRecord) {
  const review = record.review;
  if (
    !review.exercise ||
    !record.exerciseVersion ||
    !sourceMatches(record) ||
    review.automaticFreeTextDiagnosisAllowed !== false ||
    review.sourceSenseMustRemainBound !== true
  )
    return false;
  if (review.decision === "recommend_fixed_item_diagnosis")
    return review.recommendedCase === record.sourceCase;
  const correction = review.sourceCorrection;
  return (
    review.decision === "correct_source_case_before_use" &&
    correction?.sourceURL === reviewData.sourceCorrectionVerification.URL &&
    correction?.proposedCase === review.recommendedCase &&
    correction?.originalRecordMustNotBeEnabled === true
  );
}

/** Exact fixed item only: neither sentence similarity nor a lemma/case rule is accepted. */
export function evaluateReviewedValencyAnswer(
  selection: FixedValencySelection,
  answer: string,
): { outcome: "correct" | "wrong_case_for_this_item"; feedback: string | null } | null {
  const record = records.find((record) => record.recordId === selection.recordId);
  if (!record || !isActivatable(record)) return null;
  const exercise = record.review.exercise!;
  if (
    exercise.exerciseId !== selection.exerciseId ||
    record.exerciseVersion !== selection.version ||
    record.senseId !== selection.senseId ||
    exercise.correctSentence !== selection.sentence
  )
    return null;
  if (exercise.acceptedAnswers.includes(answer)) return { outcome: "correct", feedback: null };
  if (exercise.wrongCaseAnswers.includes(answer))
    return { outcome: "wrong_case_for_this_item", feedback: exercise.feedbackTr };
  return null;
}

export function reviewedValencyQuestions(
  term?: string,
  kind?: ReviewedExerciseKind,
): DrillQuestion[] {
  const normalized = term?.trim().toLocaleLowerCase("de-DE");
  return records.flatMap((record) => {
    if (
      !isActivatable(record) ||
      (normalized && normalized !== record.lemma && normalized !== record.construction)
    )
      return [];
    const exercise = record.review.exercise!;
    if (kind && exercise.kind !== kind) return [];
    const descriptor: FixedValencySelection = {
      exerciseId: exercise.exerciseId,
      version: record.exerciseVersion!,
      recordId: record.recordId,
      senseId: record.senseId,
      sentence: exercise.correctSentence,
    };
    return [
      {
        prompt: exercise.prompt.replace("____", "___"),
        options: [...exercise.options],
        correctAnswer: exercise.acceptedAnswers[0],
        reviewedValencyItem: {
          ...descriptor,
          kind: exercise.kind,
          sourceQuotation: exercise.sourceQuotation,
          instruction: exercise.instructionTr,
          meaning: exercise.meaningContextTr,
          warning: exercise.alternativeReadingWarning,
          registerLabels: record.review.registerLabelsToDisplay,
          sourceURL:
            record.review.sourceCorrection?.sourceURL ??
            `https://en.wiktionary.org/wiki/${encodeURIComponent(record.lemma)}#German`,
          lemma: record.lemma,
          construction: record.construction,
          case: record.review.recommendedCase,
          preposition: record.preposition,
        },
        checkAnswer: (question: DrillQuestion, answer: string) => {
          if (
            question.prompt !== exercise.prompt.replace("____", "___") ||
            !question.reviewedValencyItem
          )
            return null;
          return evaluateReviewedValencyAnswer(question.reviewedValencyItem, answer);
        },
      },
    ];
  });
}

/** Separate visible correction; raw source text and all lexical diagnostic gates stay intact. */
export function reviewedSourceCorrection(senseId: string | null, recordSha256: string) {
  const record = records.find(
    (record) =>
      record.senseId === senseId &&
      record.recordSha256 === recordSha256 &&
      record.review.sourceCorrection,
  );
  return record && isActivatable(record) ? record.review.sourceCorrection : null;
}

/** Fixed-source acceptance does not alter the lexical diagnostic indexes. */
export function reviewedValencyReferences(lemma: string) {
  return lookupVerbValency(lemma).filter(
    (frame) =>
      frame.referenceAcceptance === "accepted" ||
      records.some(
        (record) =>
          record.lemma === frame.lemma &&
          isActivatable(record) &&
          record.senseId === frame.sense &&
          record.construction === frame.construction &&
          record.preposition === frame.preposition &&
          caseNames[record.sourceCase] === frame.case,
      ),
  );
}
export const reviewedValencyTerms = () => [
  ...new Set(records.filter(isActivatable).map((r) => r.construction)),
];
