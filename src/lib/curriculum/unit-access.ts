import { germanA1 } from "@/content/curriculum/german-a1";
import { lessonStatus, type LessonSessions } from "./lesson-session";
import { unit3Available, unit3PrerequisiteMet } from "./unit3-access";
/** Only authored successors have entry gates. Unit 1/2 and the existing Unit 3
 * policy retain their meanings; an unavailable future unit is never unlocked. */
export function priorUnitFor(unitId: string) {
  const index = germanA1.units.findIndex((u) => u.id === unitId);
  return index >= 2 && index <= 4 ? germanA1.units[index - 1] : undefined;
}
export function unitPrerequisiteMet(
  unitId: string,
  finishedLessonIds: readonly string[],
  clearedUnits: readonly string[],
) {
  if (unitId === "DE.A1.U03") return unit3PrerequisiteMet(finishedLessonIds, clearedUnits);
  const prior = priorUnitFor(unitId);
  return (
    !prior ||
    clearedUnits.includes(prior.id) ||
    prior.lessonIds.every((id) => finishedLessonIds.includes(id))
  );
}
export function unitAvailable(
  unitId: string,
  sessions: LessonSessions,
  blockedLessons: readonly string[],
  clearedUnits: readonly string[],
) {
  const unit = germanA1.units.find((u) => u.id === unitId);
  if (
    !unit ||
    !unit.lessonIds.some((id) =>
      germanA1.lessons.some((l) => l.id === id && l.availability === "prototype"),
    )
  )
    return false;
  if (unitId === "DE.A1.U03") return unit3Available(sessions, blockedLessons, clearedUnits);
  const finished = germanA1.lessons
    .filter(
      (l) =>
        !blockedLessons.includes(l.id) && lessonStatus(germanA1.id, l, sessions) === "Finished",
    )
    .map((l) => l.id);
  return unitPrerequisiteMet(unitId, finished, clearedUnits);
}
