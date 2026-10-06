import { lessonStatus, sessionKey, type LessonSessions } from "./lesson-session";
import type { CurriculumRelease, LessonDefinition, UnitDefinition } from "./types";

/** Historical traversal only, derived from lesson acknowledgements; no unit record or mastery. */
export function unitProgress(
  release: CurriculumRelease,
  unit: UnitDefinition,
  sessions: LessonSessions,
  blockedLessons: readonly string[] = [],
) {
  const lessons = unit.lessonIds.map((id) => release.lessons.find((lesson) => lesson.id === id));
  const authored = lessons.filter(
    (lesson): lesson is LessonDefinition => lesson?.availability === "prototype",
  );
  const available = authored.filter((lesson) => !blockedLessons.includes(lesson.id));
  const finishedCount = available.filter(
    (lesson) => lessonStatus(release.id, lesson, sessions) === "Finished",
  ).length;
  const complete = lessons.length > 0 && finishedCount === lessons.length;
  const started =
    finishedCount > 0 || available.some((lesson) => sessions[sessionKey(release.id, lesson.id)]);
  return {
    status: complete
      ? "Unit lessons complete"
      : !authored.length
        ? "Not yet authored"
        : started
          ? "In progress"
          : "Not started",
    authoredCount: authored.length,
    finishedCount,
    total: lessons.length,
    nextLesson: available.find(
      (lesson) => lessonStatus(release.id, lesson, sessions) !== "Finished",
    ),
    repeatLesson: available.find((lesson) => {
      const state = sessions[sessionKey(release.id, lesson.id)];
      return state?.historicallyFinished && state.status === "in-progress";
    }),
  };
}
