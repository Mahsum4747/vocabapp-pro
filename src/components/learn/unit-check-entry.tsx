import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { unit1Check } from "@/content/curriculum/german-a1-unit1-check";
import type { AssessmentAttempt } from "@/lib/curriculum/assessment";
import { Button } from "@/components/ui/button";

export function UnitCheckEntry() {
  const [latest, setLatest] = useState<AssessmentAttempt | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [retry, setRetry] = useState(0);
  const loadRequest = useRef<{ token: number; promise: Promise<AssessmentAttempt | null> } | null>(
    null,
  );
  useEffect(() => {
    let alive = true;
    setState("loading");
    if (loadRequest.current?.token !== retry) {
      loadRequest.current = {
        token: retry,
        promise: import("@/lib/curriculum/assessment-api").then(({ getLatestUnitCheck }) =>
          getLatestUnitCheck({
            data: {
              assessmentId: unit1Check.id,
              compatibilityVersion: unit1Check.compatibilityVersion,
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
  }, [retry]);
  return (
    <section className="mt-6 border-y border-border py-5" aria-label="Unit 1 Check">
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
                {unit1Check.items.length} correct
              </p>
              <p className="mt-1 text-sm text-muted">
                {latest.formId === "U01.FORM.B" ? "Form B" : "Form A"} · Saved attempt
              </p>
            </div>
          )}
          <Button asChild variant="outline" className="mt-4 min-h-11">
            <Link to="/learn/check" search={latest ? { attempt: latest.attemptId } : {}}>
              {latest ? "Review Unit 1 Check" : "Unit 1 Check"}
            </Link>
          </Button>
        </>
      )}
    </section>
  );
}
