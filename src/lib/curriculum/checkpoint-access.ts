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
/** Same eligibility contract as CP1; challenge clearance never synthesizes lessons. */
export function checkpoint2Available(
  sessions: LessonSessions,
  blocked: readonly string[],
  clearedUnits: readonly string[] = [],
) {
  return (
    clearedUnits.includes("DE.A1.U06") ||
    unitProgress(germanA1, germanA1.units[5], sessions, blocked).status === "Unit lessons complete"
  );
}

/** Portfolio access follows U10 clearance; final completion remains stricter. */
export function checkpoint3Available(
  sessions: LessonSessions,
  blocked: readonly string[],
  clearedUnits: readonly string[] = [],
) {
  return (
    clearedUnits.includes("DE.A1.U10") ||
    unitProgress(germanA1, germanA1.units[9], sessions, blocked).status === "Unit lessons complete"
  );
}
