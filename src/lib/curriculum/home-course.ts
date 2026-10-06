import { germanA1 } from "@/content/curriculum/german-a1";
import { resumeProgress } from "./course-progress-session";
import { sessionKey, type LessonSessions } from "./lesson-session";
import { courseLearningAction } from "./unit-progress";
import type { CourseProgress } from "./course-progress";

export function homeCourseAction(progress: CourseProgress) {
  const sessions: Record<string, LessonSessions[string]> = {};
  const blocked: string[] = [];
  for (const entry of progress.lessons) {
    const lesson = germanA1.lessons.find((candidate) => candidate.id === entry.lessonId);
    if (!lesson) continue;
    if (entry.unavailable) blocked.push(lesson.id);
    else if (entry.progress)
      sessions[sessionKey(germanA1.id, lesson.id)] = resumeProgress(entry.progress, lesson);
  }
  const action = courseLearningAction(germanA1, sessions, blocked, progress.challengeClearances);
  return {
    ...action,
    started: Object.keys(sessions).length > 0 || !!progress.challengeClearances?.length,
    unitNumber: action.unit ? germanA1.units.indexOf(action.unit) + 1 : null,
    lessonNumber:
      action.unit && action.lesson ? action.unit.lessonIds.indexOf(action.lesson.id) + 1 : null,
  };
}
