import { buildAdaptiveStudyPlan, type StudyRecommendation } from "./adaptive-recommendations";
import type { LearningSignals } from "./learning-signals";
import { practiceDestination, RECOMMENDATION_ROUTES } from "./recommendation-targets";
import type { StudySet } from "./types";
import { isStudiableSet } from "./srs/queue";
import { isCardActive } from "./types";

/** One authenticated read, one derivation. No UI-specific policy or new query. */
export async function loadPrimaryRecommendation(
  load: () => Promise<LearningSignals>,
): Promise<StudyRecommendation | null> {
  return buildAdaptiveStudyPlan(await load()).primary;
}
export function recommendationCta(r: StudyRecommendation): string {
  if (r.action.type === "choose_reading_level" || r.action.type === "reading_passage")
    return "Open Lesen";
  if (r.action.type === "writing_task") return "Open Write";
  if (r.action.type === "weak_review") return "Practice weak words";
  if (r.action.type === "review" || r.action.type === "introduce_words") return "Open Review";
  return "Practice now";
}
/** Check destination identity against the same route registry, not ranking policy. */
export function hasSafeRecommendationRoute(r: StudyRecommendation): boolean {
  if (r.action.setId) {
    const dest = practiceDestination(r.action.targetId ?? "", {
      vocabulary: { practiceTargets: { [r.action.targetId ?? ""]: r.action.setId } },
    });
    return dest?.route === r.route;
  }
  if (r.action.type === "review" || r.action.type === "introduce_words")
    return r.route === RECOMMENDATION_ROUTES.review;
  if (r.action.type === "weak_review") return r.route === RECOMMENDATION_ROUTES.weakReview;
  if (r.action.type === "choose_reading_level" || r.action.type === "reading_passage")
    return r.route === RECOMMENDATION_ROUTES.reading;
  const dest = r.action.targetId
    ? practiceDestination(r.action.targetId, { vocabulary: { practiceTargets: {} } })
    : null;
  return dest?.route === r.route;
}
/** No fetch: local owned-set snapshot can hide known deleted/non-studiable targets.
 * Mode eligibility and ownership are rechecked by the destination itself. */
export function isKnownStaleRecommendation(
  r: StudyRecommendation,
  sets: StudySet[],
  isLoaded: boolean,
): boolean {
  if (!r.action.setId || !isLoaded) return false;
  const set = sets.find((s) => s.id === r.action.setId);
  return !set || !isStudiableSet(set) || !set.cards.some(isCardActive);
}

/** Copy-only cleanup: preserve observed numbers and navigation instructions. */
export function recommendationReason(r: StudyRecommendation): string {
  return r.reason
    .replace("reviewed words meet the existing weak-word criteria.", "words need more practice.")
    .replace("lifetime questions (legacy evidence)", "questions recorded so far")
    .replaceAll("saved writing feedback records", "writing feedback entries")
    .replaceAll("missing leitpunkt errors appeared in", "Required task points were missing in");
}

export function recommendationTitle(r: StudyRecommendation): string {
  return r.action.type === "writing_task" ? "Practice writing" : r.title;
}
