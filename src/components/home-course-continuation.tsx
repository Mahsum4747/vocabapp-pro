import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { COURSE_SCOPE } from "@/lib/curriculum/course-progress-session";
import { homeCourseAction } from "@/lib/curriculum/home-course";
import type { CourseProgress } from "@/lib/curriculum/course-progress";

/** One owner-scoped course read; vocabulary recommendations remain independent. */
export function HomeCourseContinuation({ owner }: { owner: string | null }) {
  const request = useRef<{ owner: string; promise: Promise<CourseProgress> } | null>(null);
  const [snapshot, setSnapshot] = useState<{ owner: string; progress: CourseProgress } | null>(
    null,
  );
  useEffect(() => {
    if (!owner) {
      request.current = null;
      return;
    }
    let active = true;
    if (request.current?.owner !== owner)
      request.current = {
        owner,
        promise: import("@/lib/curriculum/course-progress-api").then(({ getCourseProgress }) =>
          getCourseProgress({ data: COURSE_SCOPE }),
        ),
      };
    request.current.promise
      .then((progress) => {
        if (active) setSnapshot({ owner, progress });
      })
      .catch(() => {
        if (active) request.current = null;
      });
    return () => {
      active = false;
    };
  }, [owner]);
  if (!owner) return null;
  const action = snapshot?.owner === owner ? homeCourseAction(snapshot.progress) : null;
  const content = (
    <>
      <div className="min-w-0">
        <p className="font-medium">German A1</p>
        {action?.started && action.lesson && (
          <p className="mt-1 text-sm text-muted">
            Unit {action.unitNumber} · Lesson {action.lessonNumber}
          </p>
        )}
        <p className="mt-2 text-sm font-medium text-primary-ink">
          {!action
            ? "Open your course"
            : action.complete
              ? "Revisit your lessons"
              : action.started
                ? "Continue learning"
                : "Start your first lesson"}{" "}
          →
        </p>
      </div>
      <ArrowRight className="size-4 shrink-0 text-primary-ink" aria-hidden="true" />
    </>
  );
  const className =
    "mt-5 flex min-h-11 items-center justify-between gap-4 rounded-card border border-border px-card py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";
  return action?.lesson ? (
    <Link
      aria-label="German A1 course"
      to="/learn/$lessonId"
      params={{ lessonId: action.lesson.id }}
      className={className}
    >
      {content}
    </Link>
  ) : (
    <Link aria-label="German A1 course" to="/learn" className={className}>
      {content}
    </Link>
  );
}
