import { useEffect, useState } from "react";
import { toast } from "sonner";
import { effectiveCap, passRemaining, SESSION_CAP_STOPS } from "@/lib/session-pass";
import { useStudyStore } from "@/lib/store";
import { isCardActive, type StudySet } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * How many cards one session of this set serves. The set is the pool; a
 * session is a slice of it (see session-pass.ts). Changing it writes only
 * the cap — the pass progress and every due count stay as they were.
 */
export function SessionLength({ studySet, className }: { studySet: StudySet; className?: string }) {
  const profile = useStudyStore((s) => s.profile);
  const fetchProfile = useStudyStore((s) => s.fetchProfile);
  const setSessionCap = useStudyStore((s) => s.setSessionCap);

  useEffect(() => {
    if (!profile) void fetchProfile();
  }, [profile, fetchProfile]);

  const ids = studySet.cards.filter(isCardActive).map((c) => c.id);
  const size = ids.length;
  const session = profile?.setSessions?.[studySet.id] ?? { served: [] };
  const stored = effectiveCap(session.cap, size);
  // While dragging, show the thumb's value; the write happens on release.
  const [dragging, setDragging] = useState<number | null>(null);
  const shown = dragging ?? stored;

  if (size < 2 || !profile) return null;

  function commit(value: number) {
    setDragging(null);
    if (value === stored) return;
    void setSessionCap(studySet.id, value).catch(() =>
      toast.error("Couldn't save the session length."),
    );
  }

  // 10 / 20 stops only make sense when the set is bigger than the stop.
  const stops = [...SESSION_CAP_STOPS.filter((n) => n < size), size];

  return (
    <div className={cn("rounded-card bg-surface p-4 shadow-[var(--elevation-1)]", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Session length</p>
        <div className="flex gap-1">
          {stops.map((stop, i) => (
            <button
              key={stop}
              type="button"
              onClick={() => commit(stop)}
              aria-pressed={shown === stop}
              className={cn(
                "rounded-control px-3 py-1 text-xs font-medium tabular-nums transition-colors",
                shown === stop
                  ? "bg-primary text-primary-fg"
                  : "bg-surface-2 text-muted hover:text-fg",
              )}
            >
              {i === stops.length - 1 ? "All" : stop}
            </button>
          ))}
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={size}
        step={1}
        value={shown}
        aria-label="Cards per session"
        onChange={(e) => setDragging(Number(e.target.value))}
        onPointerUp={(e) => commit(Number(e.currentTarget.value))}
        onKeyUp={(e) => commit(Number(e.currentTarget.value))}
        onBlur={(e) => commit(Number(e.currentTarget.value))}
        className="mt-3 w-full accent-[var(--color-primary)]"
      />
      <p className="mt-1 text-xs text-muted tabular-nums">
        This session: {shown} / {size} · {passRemaining(session, ids)} left this pass
      </p>
    </div>
  );
}
