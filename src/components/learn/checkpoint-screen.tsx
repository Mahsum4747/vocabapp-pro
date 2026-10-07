import { checkpointAvailable } from "@/lib/curriculum/checkpoint-access";
import { Link, useBlocker, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cp1 } from "@/content/curriculum/german-a1-cp1";
import { germanA1 } from "@/content/curriculum/german-a1";
import { CP1_REQUEST, projectCheckpoint } from "@/lib/curriculum/checkpoint";
import {
  validateAttempt,
  type AssessmentAttempt,
  type AssessmentResponse,
} from "@/lib/curriculum/assessment";
import { useLearnSession } from "./session-context";
export function CheckpointScreen({ attemptId }: { attemptId?: string }) {
  const { sessions, blockedLessons } = useLearnSession();
  const available = checkpointAvailable(sessions, blockedLessons);
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [history, setHistory] = useState<AssessmentAttempt[]>([]);
  const [loading, setLoading] = useState(Boolean(attemptId));
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadToken, setLoadToken] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(false);
  const [conflict, setConflict] = useState(false);
  const startId = useRef<string | null>(null);
  const lock = useRef(false);
  const pending = useRef<AssessmentResponse[] | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const alive = useRef(true);
  const reads = useRef<{
    token: number;
    promise: Promise<[AssessmentAttempt | null, AssessmentAttempt[]]>;
  } | null>(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadFailed(false);
    if (reads.current?.token !== loadToken)
      reads.current = {
        token: loadToken,
        promise: import("@/lib/curriculum/assessment-api").then(async (api) => {
          const [record, rows] = await Promise.all([
            attemptId
              ? api.getUnitCheckAttempt({ data: { ...CP1_REQUEST, attemptId } })
              : Promise.resolve(null),
            api.getUnitCheckHistory({ data: CP1_REQUEST }),
          ]);
          if (record) validateAttempt(record, cp1, record.learnerId, attemptId);
          return [record, rows];
        }),
      };
    reads.current.promise
      .then(([record, rows]) => {
        if (!active) return;
        setAttempt(record);
        setHistory(rows);
        setLoading(false);
        if (record?.status === "submitted") {
          setAnswers({});
          pending.current = null;
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
  const submitted = attempt?.status === "submitted";
  useEffect(() => {
    if (!loading) heading.current?.focus();
  }, [loading, index, submitted]);
  const blocker = useBlocker({
    shouldBlockFn: () =>
      Boolean(
        !submitted && (pending.current || Object.values(answers).some((value) => value.trim())),
      ),
    enableBeforeUnload: Boolean(!submitted && Object.values(answers).some((value) => value.trim())),
    withResolver: true,
  });
  async function start() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setFailure(false);
    startId.current ??= crypto.randomUUID();
    try {
      const { startUnitCheck } = await import("@/lib/curriculum/assessment-api");
      const record = await startUnitCheck({
        data: { ...CP1_REQUEST, attemptId: startId.current },
      });
      if (alive.current)
        await navigate({
          to: "/learn/check",
          search: { assessment: cp1.id, attempt: record.attemptId },
        });
    } catch {
      if (alive.current) setFailure(true);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function submit() {
    if (!attempt || lock.current) return;
    lock.current = true;
    setBusy(true);
    setFailure(false);
    pending.current ??= cp1.items.map((item) => ({
      itemId: item.id,
      response: answers[item.id] ?? "",
    }));
    try {
      const { finishUnitCheck } = await import("@/lib/curriculum/assessment-api");
      const result = await finishUnitCheck({
        data: { ...CP1_REQUEST, attemptId: attempt.attemptId, responses: pending.current },
      });
      if (alive.current) {
        setAttempt(result.attempt);
        setConflict(result.kind === "conflict");
        setAnswers({});
        pending.current = null;
      }
    } catch {
      if (alive.current) setFailure(true);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  const groups = submitted && attempt ? projectCheckpoint(attempt, attempt.learnerId) : [];
  const item = cp1.items[index];
  const repeated = Boolean(
    attempt &&
    history.some(
      (row) =>
        row.attemptId !== attempt.attemptId && row.finishedAt! <= (attempt.finishedAt ?? Infinity),
    ),
  );
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link
          to="/learn"
          className="inline-flex min-h-11 items-center rounded-control text-sm text-muted focus-visible:ring-2 focus-visible:ring-focus"
        >
          ← Learn overview
        </Link>
        <p className="mt-5 text-sm font-medium text-primary-ink">
          German A1 · Units 1–3 · Checkpoint 1
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          {submitted ? "Your checkpoint result" : "Bring the foundations together"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Cumulative practice and bounded evidence. This does not certify A1 proficiency, speaking,
          free writing or mastery.
        </p>
        {loading ? (
          <p role="status" className="mt-6">
            Reading your checkpoint…
          </p>
        ) : loadFailed ? (
          <section role="alert" className="mt-6">
            <p>This checkpoint could not be loaded. Saved results remain safe.</p>
            <Button className="mt-4 min-h-11" onClick={() => setLoadToken((n) => n + 1)}>
              Retry load
            </Button>
          </section>
        ) : !attempt ? (
          <section className="mt-6 border-t border-border pt-6">
            {available ? (
              <>
                <p>
                  14 short tasks: a fictional form, practical notes, bounded sentences and a
                  targeted correction. Answer every task, then submit once. You can go back to edit.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Use only the fictional details supplied. Answers stay in this tab; leaving or
                  refreshing clears unfinished answers. Saved results contain correctness, not your
                  typed text. German keyboard fallbacks ae, oe, ue and ss are accepted.
                </p>
                <Button className="mt-6 min-h-11" disabled={busy} onClick={() => void start()}>
                  {busy ? "Starting…" : failure ? "Retry start" : "Start Checkpoint 1"}
                </Button>
                {failure && (
                  <p role="alert" className="mt-3">
                    Could not start. Retry uses the same attempt.
                  </p>
                )}
              </>
            ) : (
              <>
                <p>
                  Finish the four Unit 3 lessons before Checkpoint 1. Earlier units may be cleared
                  by challenge.
                </p>
                <Button asChild className="mt-4 min-h-11">
                  <Link to="/learn/units/$unitId" params={{ unitId: "DE.A1.U03" }}>
                    Return to Unit 3
                  </Link>
                </Button>
              </>
            )}
          </section>
        ) : submitted ? (
          <section className="mt-6 border-t border-border pt-6">
            <h2
              ref={heading}
              tabIndex={-1}
              className="font-display text-2xl font-semibold outline-none"
            >
              Checkpoint saved: {attempt.responses.filter((row) => row.correct).length} / 14 correct
            </h2>
            {conflict && (
              <p role="status" className="mt-3">
                Another tab submitted first. Its saved result is shown.
              </p>
            )}
            <p className="mt-3 text-sm text-muted">
              {repeated
                ? "Repeated practice with the same tasks; not independent confirmation."
                : "One bounded observation with these tasks."}{" "}
              This summary describes this saved attempt only. Earlier results stay separate.
            </p>
            <h3 className="mt-6 font-display text-xl font-semibold">
              Demonstrated foundational outcomes
            </h3>
            {groups.every((group) => !group.demonstrated) && (
              <p className="mt-3 text-muted">
                No complete outcome group was demonstrated in this attempt. Review the named tasks
                below.
              </p>
            )}
            <ul className="mt-3 divide-y divide-border">
              {groups
                .filter((group) => group.demonstrated)
                .map((group) => (
                  <li key={group.id} className="py-4">
                    <p className="font-medium">{group.label}</p>
                    <p className="mt-2 text-sm text-muted">{group.scope}</p>
                  </li>
                ))}
            </ul>
            <h3 className="mt-6 font-display text-xl font-semibold">Follow-up gaps</h3>
            <p className="mt-2 text-sm text-muted">
              A gap means at least one required task needs another look in this attempt; it is not a
              diagnosis of your overall ability.
            </p>
            {groups.every((group) => group.demonstrated) && (
              <p className="mt-3">
                No follow-up gaps in this sample. Optional practice remains available in Units 1–3.
              </p>
            )}
            <ul className="mt-3 divide-y divide-border">
              {groups
                .filter((group) => !group.demonstrated)
                .map((group) => (
                  <li key={group.id} className="py-4">
                    <p className="font-medium">{group.label}</p>
                    <p className="mt-2 text-sm text-muted">{group.scope}</p>
                    <p className="mt-3 text-sm font-medium">Recommended lessons to revisit</p>
                    <div className="mt-2 flex flex-col gap-1">
                      {group.lessonIds.map((id) => {
                        const lesson = germanA1.lessons.find((row) => row.id === id)!;
                        return (
                          <Link
                            key={id}
                            to="/learn/$lessonId"
                            params={{ lessonId: id }}
                            className="inline-flex min-h-11 items-center rounded-control text-sm text-primary-ink underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-focus"
                          >
                            Unit {Number(id.split(".")[2].slice(1))} · {lesson.title}
                          </Link>
                        );
                      })}
                    </div>
                  </li>
                ))}
            </ul>
            <details className="mt-5">
              <summary className="min-h-11 cursor-pointer py-3 font-medium focus-visible:ring-2 focus-visible:ring-focus">
                Review checkpoint tasks
              </summary>
              <ol className="divide-y divide-border">
                {cp1.items.map((task, i) => (
                  <li key={task.id} className="py-4">
                    <p className="text-sm text-muted">
                      Task {i + 1} ·{" "}
                      {attempt.responses[i].correct ? "Correct" : "Needs another look"}
                    </p>
                    <p className="mt-2">{task.prompt}</p>
                    {task.stimulus && (
                      <p lang="de" className="mt-2 whitespace-pre-line text-sm text-muted">
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
            <p className="mt-5 text-sm text-muted">
              Retries use the same tasks and are repeated practice. This checkpoint changes no
              lessons, Unit Checks or challenge clearance. Unit 4 is not yet authored.
            </p>
            <Button
              variant="outline"
              className="mt-5 min-h-11"
              disabled={busy || !available}
              onClick={() => void start()}
            >
              {busy ? "Starting…" : failure ? "Retry start" : "Try Checkpoint 1 again"}
            </Button>
            {failure && (
              <p role="alert" className="mt-3">
                Could not start a retry. This result is saved.
              </p>
            )}
            {history.length > 0 && (
              <details className="mt-5">
                <summary className="min-h-11 cursor-pointer py-3 font-medium">
                  Saved checkpoint attempts
                </summary>
                <ul>
                  {history.map((row) => (
                    <li key={row.attemptId}>
                      <Link
                        to="/learn/check"
                        search={{ assessment: cp1.id, attempt: row.attemptId }}
                        className="inline-flex min-h-11 items-center rounded-control text-sm underline focus-visible:ring-2 focus-visible:ring-focus"
                      >
                        {new Date(row.finishedAt!).toLocaleString()} ·{" "}
                        {row.responses.filter((r) => r.correct).length} / 14 correct
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        ) : (
          <section className="mt-6 border-t border-border pt-6">
            <p className="text-sm text-muted">
              Task {index + 1} of 14 ·{" "}
              {Object.values(answers).filter((value) => value.trim()).length} answered
              {repeated ? " · Repeated practice" : ""}
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
                if (index < 13) setIndex((n) => n + 1);
                else if (cp1.items.every((task) => answers[task.id]?.trim())) void submit();
              }}
            >
              <label htmlFor="checkpoint-answer" className="mb-2 block text-sm font-medium">
                {item.type === "supported-field" ? "Name field" : "Your response"}
              </label>
              <Input
                id="checkpoint-answer"
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
              <div className="mt-6 flex flex-wrap gap-3">
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    disabled={busy || Boolean(pending.current)}
                    onClick={() => setIndex((n) => n - 1)}
                  >
                    Previous task
                  </Button>
                )}
                <Button
                  type={pending.current ? "button" : "submit"}
                  className="min-h-11"
                  onClick={pending.current ? () => void submit() : undefined}
                  disabled={
                    busy ||
                    (!pending.current &&
                      (!answers[item.id]?.trim() ||
                        (index === 13 && !cp1.items.every((task) => answers[task.id]?.trim()))))
                  }
                >
                  {busy
                    ? "Submitting…"
                    : pending.current
                      ? "Retry submission"
                      : index < 13
                        ? "Next task"
                        : "Submit checkpoint"}
                </Button>
              </div>
            </form>
            {failure && (
              <section role="alert" className="mt-5">
                <p>Submission could not be confirmed. Retry sends the same answers.</p>
                <Button
                  variant="outline"
                  className="mt-3 min-h-11"
                  onClick={() => setLoadToken((n) => n + 1)}
                >
                  Check saved result
                </Button>
              </section>
            )}
            <p className="mt-5 text-sm leading-relaxed text-muted">
              No hints or answer reveal before submission. Answers are kept only in this tab;
              refreshing clears them. German keyboard fallbacks ae, oe, ue and ss are accepted.
            </p>
          </section>
        )}
        {blocker.status === "blocked" && (
          <section role="alert" className="mt-6 border border-border p-4">
            <p>Leave this checkpoint? Unsubmitted answers will be cleared.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="outline" className="min-h-11" onClick={() => blocker.reset()}>
                Keep answering
              </Button>
              <Button className="min-h-11" onClick={() => blocker.proceed()}>
                Leave checkpoint
              </Button>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
