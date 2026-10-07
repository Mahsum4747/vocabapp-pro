import { germanA1 } from "@/content/curriculum/german-a1";
import { unitProgress } from "./unit-progress";
import type { LessonSessions } from "./lesson-session";
export function checkpointAvailable(
  sessions: LessonSessions,
  blocked: readonly string[],
  clearedUnits: readonly string[] = [],
) {
  return (
    clearedUnits.includes("DE.A1.U03") ||
    unitProgress(germanA1, germanA1.units[2], sessions, blocked).status === "Unit lessons complete"
  );
}
