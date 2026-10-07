import { Link, useBlocker, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLearnSession } from "./session-context";
import { germanA1 } from "@/content/curriculum/german-a1";
import { unit1Check } from "@/content/curriculum/german-a1-unit1-check";
import {
  assessmentForm,
  registeredAssessment,
  checkFormLabel,
} from "@/lib/curriculum/assessment-registry";
import { unitProgress } from "@/lib/curriculum/unit-progress";
import type { AssessmentAttempt, AssessmentResponse } from "@/lib/curriculum/assessment";
import {
  projectOutcomes,
  observationKind,
  nextFormLabel,
} from "@/lib/curriculum/assessment-projection";
export function UnitCheckScreen(props: { attemptId?: string; assessmentId?: string }) {
  if (!props.attemptId && props.assessmentId) {
    try {
      if (registeredAssessment(props.assessmentId).kind !== "unit-check")
        throw Error("Not a Unit Check.");
    } catch {
      return (
        <AppShell>
          <p role="alert">This check is unavailable.</p>
        </AppShell>
      );
    }
  }
  return <CheckScreen {...props} />;
}
function CheckScreen({ attemptId, assessmentId }: { attemptId?: string; assessmentId?: string }) {
  const { sessions, blockedLessons } = useLearnSession();
  const navigate = useNavigate();
  const [history, setHistory] = useState<AssessmentAttempt[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyFailed, setHistoryFailed] = useState(false);
  const [historyToken, setHistoryToken] = useState(0);
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [loading, setLoading] = useState(Boolean(attemptId));
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadToken, setLoadToken] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(false);
  const [conflict, setConflict] = useState(false);
  const startId = useRef<string | null>(null);
  const submitting = useRef(false);
  const pending = useRef<AssessmentResponse[] | null>(null);
  const alive = useRef(true);
  const heading = useRef<HTMLHeadingElement>(null);
  const loadRequest = useRef<{ token: number; promise: Promise<AssessmentAttempt> } | null>(null);
  const definition = attempt
    ? assessmentForm(attempt.assessmentId, attempt.formId)
    : registeredAssessment((!attemptId && assessmentId) || unit1Check.id).definition;
  const unit = germanA1.units.find((u) => u.id === definition.unitId)!;
  const unitNumber = germanA1.units.indexOf(unit) + 1;
  const complete =
    unitProgress(germanA1, unit, sessions, blockedLessons).status === "Unit lessons complete";
  const request = {
    assessmentId: definition.id,
    compatibilityVersion: definition.compatibilityVersion,
  };
  const next = nextFormLabel(history, definition, attempt?.learnerId);
  const formLabel = checkFormLabel(definition.formId);
  const historyRequest = useRef<{ token: string; promise: Promise<AssessmentAttempt[]> } | null>(
    null,
  );
  const canReadHistory = !attemptId || Boolean(attempt);
  useEffect(() => {
    if (!canReadHistory) return;
    let active = true;
    setHistoryFailed(false);
    const token = `${definition.id}:${historyToken}`;
    setHistoryLoading(true);
    if (historyRequest.current?.token !== token)
      historyRequest.current = {
        token,
        promise: import("@/lib/curriculum/assessment-api").then(({ getUnitCheckHistory }) =>
          getUnitCheckHistory({
            data: {
              assessmentId: definition.id,
              compatibilityVersion: definition.compatibilityVersion,
            },
          }),
        ),
      };
    historyRequest.current.promise
      .then((value) => {
        if (active) {
          setHistory(value);
          setHistoryLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setHistoryFailed(true);
          setHistoryLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [historyToken, definition, canReadHistory]);
  const dirty = attempt?.status === "in-progress" && Object.values(answers).some(Boolean);
  const blocker = useBlocker({
    shouldBlockFn: () => Boolean(dirty),
    enableBeforeUnload: Boolean(dirty),
    withResolver: true,
  });
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (!attemptId) return;
    let active = true;
    setLoading(true);
    setLoadFailed(false);
    // Effect re-entry shares the same read, including its failure. Explicit retry starts a new one.
    if (loadRequest.current?.token !== loadToken) {
      loadRequest.current = {
        token: loadToken,
        promise: import("@/lib/curriculum/assessment-api").then(({ getUnitCheckAttempt }) =>
          getUnitCheckAttempt({ data: { attemptId } }),
        ),
      };
    }
    loadRequest.current.promise
      .then((value) => {
        if (registeredAssessment(value.assessmentId).kind !== "unit-check")
          throw Error("Not a Unit Check.");
        if (active) {
          setAttempt(value);
          if (value.status === "submitted" && pending.current) {
            setHistoryToken((n) => n + 1);
            setAnswers({});
            pending.current = null;
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoadFailed(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [attemptId, loadToken]);
  useEffect(() => {
    if (!loading && attempt?.status) heading.current?.focus();
  }, [index, attempt?.status, loading]);
  async function start() {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setFailure(false);
    startId.current ??= crypto.randomUUID();
    try {
      const { startUnitCheck } = await import("@/lib/curriculum/assessment-api");
      const value = await startUnitCheck({ data: { ...request, attemptId: startId.current } });
      if (alive.current)
        await navigate({
          to: "/learn/check",
          search: { assessment: value.assessmentId, attempt: value.attemptId },
        });
    } catch {
      if (alive.current) setFailure(true);
    } finally {
      submitting.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function submit() {
    if (!attempt || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setFailure(false);
    pending.current ??= definition.items.map((item) => ({
      itemId: item.id,
      response: answers[item.id] ?? "",
    }));
    try {
      const { finishUnitCheck } = await import("@/lib/curriculum/assessment-api");
      const result = await finishUnitCheck({
        data: { ...request, attemptId: attempt.attemptId, responses: pending.current },
      });
      if (alive.current) {
        setAttempt(result.attempt);
        setHistory((rows) => [
          ...rows.filter((a) => a.attemptId !== result.attempt.attemptId),
          result.attempt,
        ]);
        setHistoryToken((n) => n + 1);
        setConflict(result.kind === "conflict");
        setAnswers({});
        pending.current = null;
      }
    } catch {
      if (alive.current) setFailure(true);
    } finally {
      submitting.current = false;
      if (alive.current) setBusy(false);
    }
  }
  const projections = projectOutcomes(definition, history, attempt?.learnerId);
  const item = definition.items[index];
  const submitted = attempt?.status === "submitted";
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link
          to="/learn/units/$unitId"
          params={{ unitId: definition.unitId }}
          className="inline-flex min-h-11 items-center rounded-control text-sm text-muted focus-visible:ring-2 focus-visible:ring-focus"
        >
          ← Unit {unitNumber}
        </Link>
        <p className="mt-5 text-sm font-medium text-primary-ink">
          German A1 · Unit {unitNumber} Check · Prototype
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          {submitted ? "Your check result" : "Check what you can do"}
        </h1>
        {loading ? (
          <p role="status" className="mt-6 text-muted">
            Reading your check…
          </p>
        ) : loadFailed ? (
          <section role="alert" className="mt-6">
            <p>This check could not be loaded. Saved submissions remain safe.</p>
            <Button className="mt-4 min-h-11" onClick={() => setLoadToken((n) => n + 1)}>
              Retry load
            </Button>
          </section>
        ) : !complete && !attempt ? (
          <p className="mt-5 text-muted">
            Finish the four Unit {unitNumber} lessons before starting this check.
          </p>
        ) : !attempt ? (
          <section className="mt-6 border-t border-border pt-6">
            <p className="leading-relaxed">
              Eight short tasks using Unit {unitNumber} language. Answer all items, then submit
              once. You can go back to edit before submitting.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Answers stay in this tab until submission. Refreshing or leaving clears unfinished
              answers. Accepted results are saved. Use fictional information only.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This samples bounded text tasks, not general proficiency. No open writing or speaking
              is assessed.
            </p>
            <Button className="mt-6 min-h-11" disabled={busy} onClick={() => void start()}>
              {busy ? "Starting…" : failure ? "Retry start" : `Start Unit ${unitNumber} Check`}
            </Button>
            {failure && (
              <p role="alert" className="mt-3 text-sm">
                Could not start. Retry uses the same attempt.
              </p>
            )}
          </section>
        ) : submitted ? (
          <section className="mt-6 border-t border-border pt-6">
            {conflict && (
              <p role="status" className="mb-5 text-sm leading-relaxed">
                Another tab already submitted this attempt. Its saved result is shown; your
                different answers were not applied.
              </p>
            )}
            <h2
              ref={heading}
              tabIndex={-1}
              className="font-display text-2xl font-semibold outline-none"
            >
              Unit check: {attempt.responses.filter((r) => r.correct).length} /{" "}
              {definition.items.length} correct
            </h2>
            <p className="mt-2 text-sm text-muted">
              {formLabel} · Unit lessons complete · Check result saved.
            </p>
            <p className="mt-2 text-sm font-medium text-primary-ink">
              {!historyLoading && !historyFailed
                ? observationKind(attempt, history)
                : "Saved observation"}
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Your score is for this saved attempt. Evidence below uses saved checks; it does not
              certify free writing, speaking or mastery.
            </p>
            <h3 className="mt-6 font-display text-xl font-semibold">Combined evidence</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Latest observation in each form. Older item reviews stay separate.
            </p>
            {historyFailed && (
              <div role="alert" className="mt-3 text-sm">
                <p>
                  Combined history could not be refreshed. This attempt remains saved; the summary
                  is unavailable.
                </p>
                <Button
                  variant="outline"
                  className="mt-3 min-h-11"
                  onClick={() => setHistoryToken((n) => n + 1)}
                >
                  Retry evidence history
                </Button>
              </div>
            )}
            {historyLoading && (
              <p role="status" className="mt-3 text-sm text-muted">
                Reading combined evidence…
              </p>
            )}
            {!historyFailed && !historyLoading && projections.some((p) => p.repeatedForms > 0) && (
              <p className="mt-2 text-sm text-muted">
                Includes repeated observation; no additional independent form.
              </p>
            )}
            {!historyFailed &&
              !historyLoading &&
              projections.some((p) => p.state === "needs more evidence") && (
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Follow-up:{" "}
                  {definition.targets
                    .filter((target) =>
                      projections.some(
                        (p) => p.targetId === target.id && p.state === "needs more evidence",
                      ),
                    )
                    .map((target) => target.label)
                    .join("; ")}
                  . Revisit these tasks before another check.
                </p>
              )}
            {!historyFailed && !historyLoading && (
              <ul
                className="mt-6 divide-y divide-border border-y border-border"
                aria-label="Outcome evidence"
              >
                {projections.map((projection) => {
                  const target = definition.targets.find((t) => t.id === projection.targetId)!;
                  return (
                    <li key={target.id} className="py-4">
                      <p className="font-medium">{target.label}</p>
                      <p
                        className={`mt-1 text-sm ${projection.state !== "needs more evidence" && projection.state !== "no evidence" ? "text-primary-ink" : "text-muted"}`}
                      >
                        {projection.state.charAt(0).toUpperCase() + projection.state.slice(1)}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{target.scope}</p>
                    </li>
                  );
                })}
              </ul>
            )}
            <details className="mt-5">
              <summary className="min-h-11 cursor-pointer py-3 font-medium focus-visible:ring-2 focus-visible:ring-focus">
                Review item results
              </summary>
              <p className="py-3 text-sm text-muted">{formLabel} · This saved attempt only</p>
              <ol className="divide-y divide-border">
                {definition.items.map((task, i) => (
                  <li key={task.id} className="py-4">
                    <p className="text-sm text-muted">
                      Item {i + 1} ·{" "}
                      {attempt.responses[i].correct ? "Correct" : "Needs another look"}
                    </p>
                    <p className="mt-2">{task.prompt}</p>
                    {task.stimulus && (
                      <p
                        lang="de"
                        className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted"
                      >
                        {task.stimulus}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-muted">
                      Accepted response: <span lang="de">{task.acceptedAnswers[0]}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </details>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {historyFailed || historyLoading
                ? "Read the saved history before choosing another check."
                : next.repeated
                  ? `Next: ${checkFormLabel(next.formId)} again. A repeated observation, not another independent form.`
                  : "Next: Form B with alternate tasks for an additional independent observation."}{" "}
              These prototype forms have not been validated as equivalent tests.
            </p>
            <Button
              variant={next.repeated ? "outline" : "default"}
              className="mt-5 min-h-11"
              disabled={busy || historyLoading || historyFailed}
              onClick={() => void start()}
            >
              {busy
                ? "Starting…"
                : failure
                  ? "Retry retake"
                  : next.repeated
                    ? "Repeat a check form"
                    : "Try the alternate form"}
            </Button>
            {failure && (
              <p role="alert" className="mt-3 text-sm">
                Could not create another attempt. Your result is saved.
              </p>
            )}
          </section>
        ) : (
          <section className="mt-6 border-t border-border pt-6">
            <p className="mb-3 text-sm font-medium text-primary-ink">
              {formLabel} ·{" "}
              {historyFailed || historyLoading
                ? "Saved form"
                : history.some((a) => a.formId === attempt.formId)
                  ? "Repeated observation"
                  : checkFormLabel(attempt.formId) === "Form B"
                    ? "Alternate form"
                    : "First observation"}
            </p>
            <p className="text-sm tabular-nums text-muted">
              Item {index + 1} of {definition.items.length} ·{" "}
              {Object.values(answers).filter((value) => value.trim()).length} answered
            </p>
            <h2
              ref={heading}
              tabIndex={-1}
              className="mt-4 font-display text-xl font-semibold leading-snug outline-none sm:text-2xl"
            >
              {item.prompt}
            </h2>
            {item.stimulus && (
              <p
                lang="de"
                className="mt-5 whitespace-pre-line border-l-2 border-primary/30 pl-4 font-serif text-xl leading-relaxed"
              >
                {item.stimulus}
              </p>
            )}
            <form
              className="mt-6"
              onSubmit={(event) => {
                event.preventDefault();
                if (busy || pending.current || !answers[item.id]?.trim()) return;
                if (index < definition.items.length - 1) setIndex((n) => n + 1);
                else if (definition.items.every((task) => answers[task.id]?.trim())) void submit();
              }}
            >
              {item.options ? (
                <fieldset disabled={busy || Boolean(pending.current)}>
                  <legend className="sr-only">Choose one response</legend>
                  <div className="space-y-3">
                    {item.options.map((option) => (
                      <label
                        key={option}
                        className="flex min-h-12 cursor-pointer items-center gap-3 rounded-control border border-border px-4 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5 focus-within:ring-2 focus-within:ring-focus"
                      >
                        <input
                          type="radio"
                          name={item.id}
                          value={option}
                          checked={answers[item.id] === option}
                          onChange={() => setAnswers((prev) => ({ ...prev, [item.id]: option }))}
                          className="size-4 accent-primary"
                        />
                        <span lang="de">{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <>
                  <label htmlFor="check-answer" className="mb-2 block text-sm font-medium">
                    {item.type === "supported-field" ? "Name" : "Your response"}
                  </label>
                  <Input
                    id="check-answer"
                    lang="de"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={160}
                    disabled={busy || Boolean(pending.current)}
                    value={answers[item.id] ?? ""}
                    onChange={(event) =>
                      setAnswers((prev) => ({ ...prev, [item.id]: event.target.value }))
                    }
                    className="min-h-12"
                  />
                </>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    disabled={busy || Boolean(pending.current)}
                    onClick={() => setIndex((n) => n - 1)}
                  >
                    Previous item
                  </Button>
                )}
                {!pending.current && (
                  <Button
                    type="submit"
                    className="min-h-11"
                    disabled={
                      busy ||
                      !answers[item.id]?.trim() ||
                      (index === definition.items.length - 1 &&
                        !definition.items.every((task) => answers[task.id]?.trim()))
                    }
                  >
                    {busy
                      ? "Submitting…"
                      : index < definition.items.length - 1
                        ? "Next item"
                        : "Submit check"}
                  </Button>
                )}
                {pending.current && (
                  <Button
                    type="button"
                    className="min-h-11"
                    disabled={busy}
                    onClick={() => void submit()}
                  >
                    {busy ? "Submitting…" : "Retry submission"}
                  </Button>
                )}
              </div>
            </form>
            {failure && (
              <div role="alert" className="mt-5 text-sm leading-relaxed">
                <p>
                  Submission could not be confirmed. Your answers remain in this tab. Retry sends
                  the same submission.
                </p>
                <Button
                  variant="outline"
                  className="mt-3 min-h-11"
                  onClick={() => setLoadToken((n) => n + 1)}
                >
                  Check saved result
                </Button>
              </div>
            )}
            <p className="mt-5 text-sm leading-relaxed text-muted">
              No answers are saved until final submission. Refreshing clears unfinished answers. The
              item order stays the same.
            </p>
          </section>
        )}
        {blocker.status === "blocked" && (
          <section role="alert" className="mt-6 rounded-control border border-border p-4">
            <p>Leave this check? Unsubmitted answers will be cleared.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="outline" className="min-h-11" onClick={() => blocker.reset()}>
                Keep answering
              </Button>
              <Button className="min-h-11" onClick={() => blocker.proceed()}>
                Leave check
              </Button>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
