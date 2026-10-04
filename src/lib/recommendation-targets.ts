import { CURRICULUM_TOPIC_IDS } from "./grammar-curriculum";
import type { LearningSignals } from "./learning-signals";
import type { ErrorCategory } from "./write-feedback-types";
import type { SetPracticeMode } from "./learning-signal-targets";
export const RECOMMENDATION_ROUTES = {
  review: "/review",
  weakReview: "/review?filter=weak",
  reading: "/grammar/lesen",
} as const;
export const WRITING_PRACTICE_MAP: Record<ErrorCategory, string | null> = {
  article_gender: "articles",
  case: "cases",
  verb_position: "satzbau",
  verb_conjugation: "conjugation",
  word_order_other: "satzbau",
  register: "write",
  missing_leitpunkt: "write",
  spelling: null,
  word_choice: null,
};
export type PracticeDestination = { key: string; route: string; topicId: string; setId?: string };
const setModes = new Set<string>(["articles", "cases", "conjugation", "satzbau", "cloze", "write"]);
/** Audited grammar routes have matching slugs; set modes require an eligible owned set. */
export function practiceDestination(
  topicId: string,
  signals: LearningSignals,
): PracticeDestination | null {
  if (setModes.has(topicId)) {
    const setId = signals.vocabulary.practiceTargets?.[topicId as SetPracticeMode];
    if (!setId || setId.includes("/")) return null;
    return {
      key: `${topicId}:${setId}`,
      route: `/sets/${encodeURIComponent(setId)}/${topicId}`,
      topicId,
      setId,
    };
  }
  if (topicId === "lesen") return { key: "lesen", route: RECOMMENDATION_ROUTES.reading, topicId };
  if (!CURRICULUM_TOPIC_IDS.includes(topicId)) return null;
  return { key: topicId, route: `/grammar/${topicId}`, topicId };
}
