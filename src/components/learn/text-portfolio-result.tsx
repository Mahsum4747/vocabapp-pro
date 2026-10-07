import type { RefObject } from "react";
import { assessmentForm } from "@/lib/curriculum/assessment-registry";
import { Link } from "@tanstack/react-router";
import { germanA1 } from "@/content/curriculum/german-a1";
import type { projectTextPortfolio } from "@/lib/curriculum/checkpoint3";
export function TextPortfolioResult({
  result,
  headingRef,
}: {
  result: ReturnType<typeof projectTextPortfolio>;
  headingRef?: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <section aria-label="Final text portfolio" className="mt-5">
      <h2
        ref={headingRef}
        tabIndex={headingRef ? -1 : undefined}
        className="font-display text-2xl font-semibold outline-none"
      >
        {result.status}
      </h2>
      <p className="mt-3 text-sm text-muted">
        This milestone covers reading and bounded writing. Listening and speaking remain outside it.
        Task accuracy does not replace any required outcome.
      </p>
      {!result.complete && (
        <div className="mt-4 space-y-2 text-sm" role="status">
          {result.missingLessons.length > 0 && (
            <p>
              {result.missingLessons.length} of 40 lesson completions still needed. Test-out does
              not replace them.
            </p>
          )}
          {result.missingChecks.length > 0 && (
            <p>Unit Checks still needed: {result.missingChecks.join(", ")}.</p>
          )}
          {result.missingCheckpoints.length > 0 && (
            <p>Checkpoints still needed: {result.missingCheckpoints.join(", ")}.</p>
          )}
          {result.missingSittings.length > 0 && (
            <p>
              CP3 sitting still needed:{" "}
              {result.missingSittings.map((s) => (s.endsWith("A") ? "A" : "B")).join(", ")}.
            </p>
          )}
          {result.delayedFollowup === "Pending" && (
            <p>
              Delayed follow-up pending. Start the alternate CP3 sitting at least 24 hours after
              finishing the earlier sitting. Same-session sittings do not supply delayed evidence.
            </p>
          )}
          {result.unresolvedTasks.length > 0 && (
            <p>
              {result.unresolvedTasks.length} assessed tasks still need follow-up. Stronger results
              elsewhere do not remove these gaps.
            </p>
          )}
        </div>
      )}
      {result.unresolvedTasks.length > 0 && (
        <details className="mt-4">
          <summary className="min-h-11 cursor-pointer py-3 font-medium">
            Assessed tasks to revisit
          </summary>
          <ul>
            {result.unresolvedTasks.map((t) => (
              <li key={`${t.attemptId}:${t.itemId}`}>
                <Link
                  to="/learn/check"
                  search={{ assessment: t.assessmentId, attempt: t.attemptId }}
                  className="inline-flex min-h-11 items-center py-2 text-sm text-primary-ink underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {
                    assessmentForm(t.assessmentId, t.formId).items.find((i) => i.id === t.itemId)!
                      .prompt
                  }
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
      {result.missingLessons.length > 0 && (
        <details className="mt-4">
          <summary className="min-h-11 cursor-pointer py-3 font-medium">
            Lessons still needed
          </summary>
          <ul>
            {result.missingLessons.map((id) => (
              <li key={id}>
                <Link
                  to="/learn/$lessonId"
                  params={{ lessonId: id }}
                  className="inline-flex min-h-11 items-center py-2 text-sm text-primary-ink underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-focus"
                >
                  Unit {Number(id.split(".")[2].slice(1))} ·{" "}
                  {germanA1.lessons.find((l) => l.id === id)!.title}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
      {result.delayedFollowup === "Recorded" && (
        <p className="mt-3 text-sm text-muted">
          Delayed follow-up recorded in an alternate sitting.
        </p>
      )}
      <ul className="mt-5 divide-y divide-border" aria-label="Essential text outcomes">
        {result.outcomes.map((o) => (
          <li key={o.id} className="py-4">
            <p className="font-medium">{o.label}</p>
            <p className="mt-1 text-sm text-primary-ink">{o.state}</p>
            <p className="mt-2 text-sm text-muted">{o.scope}</p>
            {o.lessonIds.length > 0 && (
              <>
                <p className="mt-3 text-sm font-medium">Recommended review</p>
                <div className="flex flex-col">
                  {o.lessonIds.map((id) => (
                    <Link
                      key={id}
                      to="/learn/$lessonId"
                      params={{ lessonId: id }}
                      className="inline-flex min-h-11 items-center py-2 text-sm text-primary-ink underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      {germanA1.lessons.find((l) => l.id === id)!.title}
                    </Link>
                  ))}
                </div>
              </>
            )}
            <details className="mt-2">
              <summary className="min-h-11 cursor-pointer py-3 text-sm">
                Recorded observations
              </summary>
              {o.observations.length ? (
                <ul className="space-y-2 text-sm text-muted">
                  {o.observations.map((row) => (
                    <li key={`${row.assessmentId}:${row.family}:${row.targetId}`}>
                      {row.label} ·{" "}
                      {row.correct ? "Demonstrated in these tasks" : "Follow-up needed"} ·{" "}
                      {row.scope}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">No accepted observations yet.</p>
              )}
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
