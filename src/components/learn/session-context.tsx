import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useBlocker } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { germanA1 } from "@/content/curriculum/german-a1";
import { COURSE_SCOPE, resumeProgress } from "@/lib/curriculum/course-progress-session";
import type {
  DurableProgress,
  CourseProgress,
  ProgressCommand,
} from "@/lib/curriculum/course-progress";
import {
  startLesson,
  sessionKey,
  transitionLesson,
  type LessonSessions,
  type LessonSession,
  type LessonAction,
} from "@/lib/curriculum/lesson-session";
import type { LessonDefinition } from "@/lib/curriculum/types";

type SaveState = {
  phase: "unsaved" | "saving" | "saved" | "failed" | "conflict" | "unavailable";
  current?: DurableProgress;
};
type Pending = { command: ProgressCommand; sending: boolean };
const Context = createContext<{
  sessions: LessonSessions;
  setSessions: Dispatch<SetStateAction<LessonSessions>>;
  dispatch: (lesson: LessonDefinition, action: LessonAction | { type: "restart" }) => void;
  retry: (lesson: LessonDefinition) => void;
  acceptSaved: (lesson: LessonDefinition) => void;
  saves: Record<string, SaveState>;
  blockedLessons: readonly string[];
} | null>(null);

/** Owned by an authenticated Learn route instance, remounted when owner changes. */
export function LearnSessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessionState] = useState<LessonSessions>({});
  const sessionRef = useRef<LessonSessions>({});
  const durable = useRef<Record<string, DurableProgress>>({});
  const versions = useRef<Record<string, string>>({});
  const pending = useRef<Record<string, Pending>>({});
  const alive = useRef(false);
  const loadGeneration = useRef(0);
  const loadRequest = useRef<Promise<CourseProgress> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saves, setSaves] = useState<Record<string, SaveState>>({});
  const [blockedLessons, setBlockedLessons] = useState<string[]>([]);
  const setSessions: Dispatch<SetStateAction<LessonSessions>> = useCallback((update) => {
    const next = typeof update === "function" ? update(sessionRef.current) : update;
    sessionRef.current = next;
    setSessionState(next);
  }, []);
  const load = useCallback(async () => {
    const generation = ++loadGeneration.current;
    setLoadFailed(false);
    try {
      const request =
        loadRequest.current ??
        import("@/lib/curriculum/course-progress-api").then(({ getCourseProgress }) =>
          getCourseProgress({ data: COURSE_SCOPE }),
        );
      loadRequest.current = request;
      const result = await request;
      if (!alive.current || generation !== loadGeneration.current) return;
      const restored: Record<string, LessonSession> = {};
      const states: Record<string, SaveState> = {};
      for (const descriptor of result.lessons) {
        versions.current[descriptor.lessonId] = descriptor.lessonVersion;
        const lesson = germanA1.lessons.find((candidate) => candidate.id === descriptor.lessonId)!;
        if (descriptor.progress) {
          durable.current[lesson.id] = descriptor.progress;
          restored[sessionKey(germanA1.id, lesson.id)] = resumeProgress(
            descriptor.progress,
            lesson,
          );
          states[lesson.id] = { phase: "saved" };
        }
      }
      setBlockedLessons(
        result.lessons.filter((lesson) => lesson.unavailable).map((lesson) => lesson.lessonId),
      );
      setSessions(restored);
      setSaves(states);
      setLoaded(true);
    } catch {
      if (alive.current && generation === loadGeneration.current) setLoadFailed(true);
    } finally {
      if (generation === loadGeneration.current) loadRequest.current = null;
    }
  }, [setSessions]);
  useEffect(() => {
    alive.current = true;
    void load();
    return () => {
      alive.current = false;
      // This ref is a request token, not a DOM node; invalidate the latest pending load.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ++loadGeneration.current;
    };
  }, [load]);
  const hasUnsaved = Object.values(saves).some((state) => state.phase !== "saved");
  const blocker = useBlocker({
    shouldBlockFn: ({ next }) => hasUnsaved && !/^\/learn(?:\/|$)/.test(next.pathname),
    enableBeforeUnload: hasUnsaved,
    withResolver: true,
  });
  function installProgress(
    lesson: LessonDefinition,
    progress: DurableProgress,
    preserveOpen = false,
  ) {
    const key = sessionKey(germanA1.id, lesson.id);
    const local = sessionRef.current[key];
    const restored = resumeProgress(progress, lesson);
    const step = lesson.steps[restored.stepIndex];
    if (preserveOpen && step.kind === "original" && local?.responses[step.id] && progress.checked) {
      restored.responses = { [step.id]: local.responses[step.id] };
      restored.feedback = local.feedback;
    }
    durable.current[lesson.id] = progress;
    setSessions((previous) => ({ ...previous, [key]: restored }));
  }
  async function send(lesson: LessonDefinition) {
    const operation = pending.current[lesson.id];
    if (!operation || operation.sending) return;
    operation.sending = true;
    setSaves((previous) => ({ ...previous, [lesson.id]: { phase: "saving" } }));
    try {
      const { acknowledgeCourseProgress } = await import("@/lib/curriculum/course-progress-api");
      const result = await acknowledgeCourseProgress({ data: operation.command });
      if (!alive.current) return;
      if (
        result.kind === "saved" &&
        result.progress.revision === operation.command.expectedRevision + 1
      ) {
        installProgress(lesson, result.progress, true);
        delete pending.current[lesson.id];
        setSaves((previous) => ({ ...previous, [lesson.id]: { phase: "saved" } }));
      } else {
        setSaves((previous) => ({
          ...previous,
          [lesson.id]:
            result.kind === "unavailable"
              ? { phase: "unavailable" }
              : { phase: "conflict", current: result.progress },
        }));
      }
    } catch {
      if (alive.current)
        setSaves((previous) => ({ ...previous, [lesson.id]: { phase: "failed" } }));
    } finally {
      operation.sending = false;
    }
  }
  function dispatch(lesson: LessonDefinition, action: LessonAction | { type: "restart" }) {
    if (!loaded || blockedLessons.includes(lesson.id) || pending.current[lesson.id]) return;
    const key = sessionKey(germanA1.id, lesson.id);
    const state = sessionRef.current[key] ?? startLesson(germanA1.id, lesson);
    if (action.type === "respond") {
      const next = transitionLesson(lesson, state, action);
      if (next === state) return;
      setSessions((previous) => ({ ...previous, [key]: next }));
      setSaves((previous) => ({ ...previous, [lesson.id]: { phase: "unsaved" } }));
      return;
    }
    const step = lesson.steps[state.stepIndex];
    if (action.type !== "restart") {
      const next = transitionLesson(lesson, state, action);
      if (next === state) return;
      // Check feedback is local immediately; traversal/completion waits for acknowledgement.
      if (action.type === "check") setSessions((previous) => ({ ...previous, [key]: next }));
    }
    const command: ProgressCommand = {
      ...COURSE_SCOPE,
      lessonId: lesson.id,
      lessonVersion: versions.current[lesson.id],
      expectedRevision: durable.current[lesson.id]?.revision ?? 0,
      operationId: crypto.randomUUID(),
      action:
        action.type === "restart"
          ? action
          : action.type === "check"
            ? {
                type: "check",
                stepId: step.id,
                ...(step.kind !== "original" ? { response: state.responses[step.id] ?? "" } : {}),
              }
            : { type: "continue", stepId: step.id },
    };
    pending.current[lesson.id] = { command, sending: false };
    void send(lesson);
  }
  function acceptSaved(lesson: LessonDefinition) {
    const current = saves[lesson.id]?.current;
    if (!current) return;
    installProgress(lesson, current);
    delete pending.current[lesson.id];
    setSaves((previous) => ({ ...previous, [lesson.id]: { phase: "saved" } }));
  }
  if (!loaded)
    return (
      <main className="mx-auto max-w-2xl px-page-safe py-12">
        <h1 className="text-xl font-semibold">
          {loadFailed ? "Your lesson progress couldn’t load." : "Loading your lessons…"}
        </h1>
        {loadFailed && (
          <>
            <p className="mt-3 text-muted">
              Your saved progress is safe. Try again before continuing.
            </p>
            <Button className="mt-5" onClick={() => void load()}>
              Retry loading
            </Button>
          </>
        )}
      </main>
    );
  return (
    <Context.Provider
      value={{
        sessions,
        setSessions,
        dispatch,
        retry: (lesson) => void send(lesson),
        acceptSaved,
        saves,
        blockedLessons,
      }}
    >
      {blocker.status === "blocked" && (
        <section role="alert" className="mx-auto max-w-2xl px-page-safe py-6">
          <h2 className="text-lg font-semibold">Your answer hasn’t saved.</h2>
          <p className="mt-2 text-muted">Stay to save it, or leave without this answer.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => blocker.reset()}>Stay in Learn</Button>
            <Button variant="outline" onClick={() => blocker.proceed()}>
              Leave without saving
            </Button>
          </div>
        </section>
      )}
      {children}
    </Context.Provider>
  );
}
export function useLearnSession() {
  const context = useContext(Context);
  if (!context) throw Error("Learn session provider is missing.");
  return context;
}
