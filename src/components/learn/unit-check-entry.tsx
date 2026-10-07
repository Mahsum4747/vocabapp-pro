import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  registeredAssessment,
  checkFormLabel,
  assessmentForm,
} from "@/lib/curriculum/assessment-registry";
import type { AssessmentAttempt } from "@/lib/curriculum/assessment";
import { Button } from "@/components/ui/button";

export function UnitCheckEntry({
  assessmentId,
  unitNumber,
}: {
  assessmentId: string;
  unitNumber: number;
}) {
  const definition = registeredAssessment(assessmentId).definition;
  const [latest, setLatest] = useState<AssessmentAttempt | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [retry, setRetry] = useState(0);
  const loadRequest = useRef<{ token: string; promise: Promise<AssessmentAttempt | null> } | null>(
    null,
  );
  useEffect(() => {
    let alive = true;
    setState("loading");
    const token = `${definition.id}:${retry}`;
    if (loadRequest.current?.token !== token) {
      loadRequest.current = {
        token,
        promise: import("@/lib/curriculum/assessment-api").then(({ getLatestUnitCheck }) =>
          getLatestUnitCheck({
            data: {
              assessmentId: definition.id,
              compatibilityVersion: definition.compatibilityVersion,
            },
          }),
        ),
      };
    }
    loadRequest.current.promise
      .then((value) => {
        if (alive) {
          setLatest(value);
          setState("ready");
        }
      })
      .catch(() => {
        if (alive) setState("failed");
      });
    return () => {
      alive = false;
    };
  }, [retry, definition.id, definition.compatibilityVersion]);
  return (
    <section
      className="mt-6 rounded-card border border-border bg-surface p-5 shadow-[var(--elevation-1)] sm:p-6"
      aria-label={`Unit ${unitNumber} Check`}
    >
      <h2 className="font-display text-xl font-semibold">Check what you can do</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Eight short tasks, separate from lesson completion. Results describe only what this check
        sampled.
      </p>
      {state === "loading" && (
        <p role="status" className="mt-3 text-sm text-muted">
          Reading your last check…
        </p>
      )}
      {state === "failed" && (
        <div role="alert" className="mt-3 text-sm">
          <p>Your last check could not be loaded.</p>
          <Button
            variant="outline"
            className="mt-3 min-h-11"
            onClick={() => setRetry((n) => n + 1)}
          >
            Retry check history
          </Button>
        </div>
      )}
      {state === "ready" && (
        <>
          {latest && (
            <div className="mt-3">
              <p className="font-medium">
                Last unit check: {latest.responses.filter((r) => r.correct).length} /{" "}
                {assessmentForm(latest.assessmentId, latest.formId).items.length} correct
              </p>
              <p className="mt-1 text-sm text-muted">
                {checkFormLabel(latest.formId)} · Saved attempt
              </p>
            </div>
          )}
          <Button asChild variant="outline" className="mt-4 min-h-11">
            <Link
              to="/learn/check"
              search={
                latest
                  ? { assessment: definition.id, attempt: latest.attemptId }
                  : { assessment: definition.id }
              }
            >
              {latest ? `Review Unit ${unitNumber} Check` : `Unit ${unitNumber} Check`}
            </Link>
          </Button>
        </>
      )}
    </section>
  );
}
