import { germanA1 } from "@/content/curriculum/german-a1";
import type { LessonSessions } from "./lesson-session";
import { courseLearningAction } from "./unit-progress";

/** Content access depends only on authorship, never progression evidence. */
export function unitAvailable(unitId: string) {
  const unit = germanA1.units.find((candidate) => candidate.id === unitId);
  return !!unit?.lessonIds.some((id) =>
    germanA1.lessons.some((lesson) => lesson.id === id && lesson.availability === "prototype"),
  );
}

/** Recommendation is the existing sequential path, independent of open access. */
export function unitAheadOfPath(
  unitId: string,
  sessions: LessonSessions,
  blockedLessons: readonly string[],
  clearedUnits: readonly string[],
) {
  const action = courseLearningAction(germanA1, sessions, blockedLessons, clearedUnits);
  return (
    !action.complete &&
    !!action.unit &&
    unitAvailable(unitId) &&
    germanA1.units.findIndex((unit) => unit.id === unitId) > germanA1.units.indexOf(action.unit)
  );
}
