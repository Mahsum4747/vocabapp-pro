import { germanA1 } from "@/content/curriculum/german-a1";
import { lessonStatus, type LessonSessions } from "./lesson-session";
const prior = germanA1.units.find((unit) => unit.id === "DE.A1.U02")!;
/** Unit 3's authored availability policy; no mastery or synthetic lesson completion. */
export function unit3PrerequisiteMet(
  finishedLessonIds: readonly string[],
  clearedUnits: readonly string[],
) {
  return (
    clearedUnits.includes(prior.id) || prior.lessonIds.every((id) => finishedLessonIds.includes(id))
  );
}
export function unit3Available(
  sessions: LessonSessions,
  blockedLessons: readonly string[],
  clearedUnits: readonly string[],
) {
  const finished = germanA1.lessons
    .filter(
      (lesson) =>
        !blockedLessons.includes(lesson.id) &&
        lessonStatus(germanA1.id, lesson, sessions) === "Finished",
    )
    .map((lesson) => lesson.id);
  return unit3PrerequisiteMet(finished, clearedUnits);
}
