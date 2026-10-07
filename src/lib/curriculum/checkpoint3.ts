import { germanA1 } from "@/content/curriculum/german-a1";
import { cp3 } from "@/content/curriculum/german-a1-cp3";
import { assessmentForm, assessmentRegistry, compatibleHistory } from "./assessment-registry";
import { validateAttempt, type AssessmentAttempt } from "./assessment";
import { unitProgress } from "./unit-progress";
import type { LessonSessions } from "./lesson-session";
export const CP3_REQUEST = { assessmentId: cp3.id, compatibilityVersion: cp3.compatibilityVersion };
/** Prototype policy: at least 24 real hours between a completed sitting and the START
 * of an alternate-family sitting. This is an observable interval, not an efficacy claim. */
export const CP3_DELAY_MS = 24 * 60 * 60 * 1000;
const followups: Record<string, readonly string[]> = {
  personal: ["DE.A1.U01.L01", "DE.A1.U10.L03"],
  familiar: ["DE.A1.U02.L01", "DE.A1.U02.L03"],
  reading: ["DE.A1.U10.L01"],
  practical: ["DE.A1.U09.L02", "DE.A1.U10.L02"],
  message: ["DE.A1.U09.L04", "DE.A1.U10.L03"],
  recent: ["DE.A1.U06.L03", "DE.A1.U09.L03"],
  transfer: ["DE.A1.U10.L02", "DE.A1.U10.L04"],
};
/** Reviewed supplemental target mappings. A mapped observation credits only the
 * elicited target's scope, never the entire essential outcome. Complete coverage
 * still requires both independently authored CP3 families for every outcome. */
export const portfolioTargetMap: Record<string, string> = {
  "U01.person": "personal",
  "U01.form": "personal",
  "U01.details": "reading",
  "U01.question": "practical",
  "U01.statements": "personal",
  "U02.routine": "familiar",
  "U02.belongings": "familiar",
  "U02.reference": "reading",
  "U02.corrected-information": "reading",
  "U02.revision": "transfer",
  "U03.object": "familiar",
  "U03.availability": "practical",
  "U03.context": "reading",
  "U03.alternative": "practical",
  "U03.preference-focus": "transfer",
  "U04.changed-plan": "recent",
  "U04.request": "practical",
  "U04.rule": "practical",
  "U04.alternative": "practical",
  "U05.route": "practical",
  "U05.help-register": "practical",
  "U05.form": "personal",
  "U05.instruction": "practical",
  "U05.message": "message",
  "U06.frame": "recent",
  "U06.email": "reading",
  "U06.sequence": "recent",
  "U06.state": "recent",
  "U06.purpose": "reading",
  "U06.transfer": "transfer",
  "U06.message": "message",
  "U06.relevance": "reading",
  "U07.detail": "reading",
  "U07.change": "reading",
  "U07.ticket": "practical",
  "U07.room": "practical",
  "U07.enquiry": "practical",
  "U07.relation": "practical",
  "U07.arrival": "practical",
  "U07.message": "message",
  "U07.transfer": "transfer",
  "U08.fields": "personal",
  "U08.relevance": "reading",
  "U08.question": "practical",
  "U08.change": "reading",
  "U08.obligation": "practical",
  "U08.alternative": "practical",
  "U08.service": "practical",
  "U08.register": "practical",
  "U08.revision": "transfer",
  "U09.need": "familiar",
  "U09.notice": "reading",
  "U09.permission": "practical",
  "U09.instruction": "practical",
  "U09.invite": "message",
  "U09.details": "practical",
  "U09.purpose": "reading",
  "U09.register": "practical",
  "U09.next": "message",
  "U10.reading": "reading",
  "U10.corrected": "reading",
  "U10.relevance": "reading",
  "U10.question": "practical",
  "U10.response": "practical",
  "U10.object": "familiar",
  "U10.transfer": "transfer",
  "U10.form": "personal",
  "U10.message": "message",
  "U10.revision": "transfer",
  "CP1.identity": "personal",
  "CP1.details": "reading",
  "CP1.people": "familiar",
  "CP1.reference": "familiar",
  "CP1.shopping": "practical",
  "CP1.preference": "practical",
  "CP1.revision": "transfer",
  "CP2.personal": "personal",
  "CP2.familiar": "familiar",
  "CP2.reading": "reading",
  "CP2.time": "practical",
  "CP2.place": "practical",
  "CP2.rules": "practical",
  "CP2.message": "message",
  "CP2.recent": "recent",
  "CP2.transfer": "transfer",
};
/** Read-only, owner/version/provenance validated. Latest attempt per family supersedes
 * its own earlier observation only. Contradictions in another family remain visible.
 * Practice, Challenges and FSRS supply NO assessment evidence. */
export function projectTextPortfolio(
  history: readonly AssessmentAttempt[],
  ownerId: string,
  sessions: LessonSessions,
  blocked: readonly string[] = [],
  now = Date.now(),
) {
  const accepted: AssessmentAttempt[] = [];
  for (const row of history) {
    if (
      row.learnerId !== ownerId ||
      row.status !== "submitted" ||
      row.finishedAt === null ||
      row.finishedAt > now ||
      !assessmentRegistry.some((r) => r.definition.id === row.assessmentId)
    )
      continue;
    try {
      accepted.push(validateAttempt(row, assessmentForm(row.assessmentId, row.formId), ownerId));
    } catch {
      /* Invalid historical evidence never earns coverage. No record is rewritten. */
    }
  }
  const latest = assessmentRegistry.flatMap((reg) => {
    const rows = compatibleHistory(reg.definition, accepted, ownerId);
    return reg.forms.flatMap(
      (form) => rows.find((a) => a.formFamilyId === form.formFamilyId) ?? [],
    );
  });
  const cpRows = latest.filter((a) => a.assessmentId === cp3.id);
  const observations = latest.flatMap((a) => {
    const form = assessmentForm(a.assessmentId, a.formId);
    return form.targets.map((t) => {
      const items = form.items.filter((i) => i.targetId === t.id);
      const results = a.responses.filter((e) => e.targetId === t.id);
      return {
        assessmentId: a.assessmentId,
        family: a.formFamilyId,
        targetId: t.id,
        label: t.label,
        scope: t.scope,
        outcome: a.assessmentId === cp3.id ? t.id.slice(4) : portfolioTargetMap[t.id],
        correct:
          items.length > 0 && results.length === items.length && results.every((e) => e.correct),
      };
    });
  });
  const outcomes = cp3.targets.map((t) => {
    const key = t.id.slice(4);
    const rows = observations.filter((o) => o.outcome === key);
    const core = rows.filter((o) => o.assessmentId === cp3.id);
    const state = rows.some((o) => !o.correct)
      ? ("Follow-up needed" as const)
      : core.length === 2 && core.every((o) => o.correct)
        ? ("Demonstrated" as const)
        : ("Insufficient evidence" as const);
    return {
      ...t,
      state,
      lessonIds: state === "Demonstrated" ? [] : followups[key],
      observations: rows,
    };
  });
  const missingLessons = germanA1.units.flatMap((u) =>
    unitProgress(germanA1, u, sessions, blocked).status === "Unit lessons complete"
      ? []
      : u.lessonIds.filter(
          (id) =>
            unitProgress(germanA1, { ...u, lessonIds: [id] }, sessions, blocked).finishedCount !==
            1,
        ),
  );
  const missingChecks = assessmentRegistry
    .filter(
      (r) => r.kind === "unit-check" && !latest.some((a) => a.assessmentId === r.definition.id),
    )
    .map((r) => r.unitNumber);
  const missingCheckpoints = assessmentRegistry
    .filter(
      (r) => r.kind === "checkpoint" && !latest.some((a) => a.assessmentId === r.definition.id),
    )
    .flatMap((r) => (r.kind === "checkpoint" ? [r.checkpointNumber] : []));
  const missingSittings = ["CP3.FAMILY.A", "CP3.FAMILY.B"].filter(
    (f) => !cpRows.some((a) => a.formFamilyId === f),
  );
  const delayedRows = accepted.filter((a) => a.assessmentId === cp3.id);
  const delayed = delayedRows.some((a) =>
    delayedRows.some(
      (b) => b.formFamilyId !== a.formFamilyId && b.startedAt >= a.finishedAt! + CP3_DELAY_MS,
    ),
  );
  // Unmapped atomic dimensions are never broadened into essential credit. Failed latest
  // results still block completion explicitly rather than disappearing from the criterion.
  const unresolvedTasks = latest.flatMap((a) =>
    a.responses
      .filter((row) => !row.correct)
      .map((row) => ({
        assessmentId: a.assessmentId,
        attemptId: a.attemptId,
        formId: a.formId,
        itemId: row.itemId,
        targetId: row.targetId,
      })),
  );
  const complete =
    !missingLessons.length &&
    !missingChecks.length &&
    !missingCheckpoints.length &&
    !missingSittings.length &&
    delayed &&
    outcomes.every((o) => o.state === "Demonstrated") &&
    !unresolvedTasks.length;
  return {
    complete,
    status: complete ? "A1 text-learning path complete" : "A1 text-learning path still in progress",
    outcomes,
    missingLessons,
    missingChecks,
    missingCheckpoints,
    missingSittings,
    delayedFollowup: delayed ? ("Recorded" as const) : ("Pending" as const),
    unresolvedTasks,
  };
}
