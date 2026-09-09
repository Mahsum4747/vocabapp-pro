import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, Trophy } from "lucide-react";
import { ACHIEVEMENTS, type AchievementId } from "@/lib/gamification";
import { playSound } from "@/lib/sound";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

/**
 * Celebrations: the visible half of a graded answer.
 *
 * Three tiers, all short, none of which take the learner's turn away. Tier 1
 * acknowledges a right answer and gets out of the way; tier 2 marks a badge
 * without interrupting the round; only tier 3 — finishing a whole set — is
 * worth a dialog, and it arrives when the work is already done.
 *
 * Sound is fired from here rather than by the callers, so a cue and its
 * animation can never come apart.
 */

export type SetCompletion = { setId: string; title: string; xp: number };

type Celebration = {
  /** A graded answer. `excellent` is the brighter cue for an easy recall. */
  correct: (variant: "correct" | "excellent") => void;
  /** A correct but effortful answer: a light, dull tone, no animation. */
  hard: () => void;
  /** A wrong answer: a low tone, no animation. Missing one is not an event. */
  wrong: () => void;
  achievements: (ids: AchievementId[]) => void;
  setCompleted: (completion: SetCompletion) => void;
  dailyGoalMet: () => void;
};

const noop: Celebration = {
  correct: () => {},
  hard: () => {},
  wrong: () => {},
  achievements: () => {},
  setCompleted: () => {},
  dailyGoalMet: () => {},
};

const CelebrationContext = createContext<Celebration>(noop);

/** Fire celebrations from anywhere under the provider. */
export function useCelebration(): Celebration {
  return useContext(CelebrationContext);
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const TICK_MS = 200;

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState<number | null>(null);
  const [badge, setBadge] = useState<AchievementId | null>(null);
  const [confetti, setConfetti] = useState<{ id: number; count: number; duration: number } | null>(
    null,
  );
  const [completion, setCompletion] = useState<SetCompletion | null>(null);
  const nextId = useRef(0);

  // The tier-1 pulse is a body attribute so the study surface can react to it
  // in CSS — no prop threaded through four study modes to move one element.
  useEffect(() => {
    if (tick === null || typeof document === "undefined") return;
    document.body.dataset.celebrate = "correct";
    const timer = window.setTimeout(() => {
      delete document.body.dataset.celebrate;
      setTick(null);
    }, TICK_MS);
    return () => window.clearTimeout(timer);
  }, [tick]);

  useEffect(() => {
    if (!badge) return;
    const timer = window.setTimeout(() => setBadge(null), 1600);
    return () => window.clearTimeout(timer);
  }, [badge]);

  const throwConfetti = useCallback((count: number, duration: number) => {
    if (prefersReducedMotion()) return;
    nextId.current += 1;
    setConfetti({ id: nextId.current, count, duration });
  }, []);

  const value: Celebration = {
    correct: useCallback((variant) => {
      playSound(variant === "excellent" ? "excellent" : "correct");
      setTick(Date.now());
    }, []),

    hard: useCallback(() => {
      playSound("hard");
    }, []),

    wrong: useCallback(() => {
      playSound("error");
    }, []),

    achievements: useCallback(
      (ids) => {
        if (ids.length === 0) return;
        playSound("achievement");
        setBadge(ids[0]);
        throwConfetti(8, 450);
      },
      [throwConfetti],
    ),

    setCompleted: useCallback(
      (next) => {
        playSound("setCompleted");
        // No screen flash: the dialog and a little drifting confetti are the
        // celebration. A full-screen tint reads as an arcade, and it is the
        // one effect a learner cannot look away from.
        throwConfetti(14, 800);
        setCompletion(next);
      },
      [throwConfetti],
    ),

    dailyGoalMet: useCallback(() => {
      playSound("dailyGoalSuccess");
    }, []),
  };

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      {tick !== null ? <CorrectMark key={tick} /> : null}
      {badge ? <BadgeToast id={badge} /> : null}
      {confetti ? (
        <Confetti
          key={confetti.id}
          count={confetti.count}
          duration={confetti.duration}
          onDone={() => setConfetti(null)}
        />
      ) : null}
      <SetCompleteDialog completion={completion} onClose={() => setCompletion(null)} />
    </CelebrationContext.Provider>
  );
}

/**
 * Tier 1: a tick that settles in and leaves.
 *
 * No overshoot and no bounce — it appears at rest. The ring behind it does the
 * work a bounce would otherwise do, and it expands outward rather than pushing
 * the eye around.
 */
function CorrectMark() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] grid place-items-center">
      <span className="relative grid size-12 place-items-center">
        <span className="celebrate-ring absolute inset-0 rounded-full border border-success" />
        <span className="celebrate-mark grid size-12 place-items-center rounded-full bg-success-soft text-success">
          <Check className="size-6" strokeWidth={2.5} />
        </span>
      </span>
    </div>
  );
}

/** Tier 2: a small pill naming the badge. No modal — the round continues. */
function BadgeToast({ id }: { id: AchievementId }) {
  const achievement = ACHIEVEMENTS.find((entry) => entry.id === id);
  if (!achievement) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[65] grid place-items-center px-4">
      <span className="celebrate-badge flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg shadow-[var(--shadow-card)]">
        <Trophy className="size-4" />
        {achievement.name}
      </span>
    </div>
  );
}

/** Tier 3: the one celebration that asks for a click. */
function SetCompleteDialog({
  completion,
  onClose,
}: {
  completion: SetCompletion | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={completion !== null} onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent title="Set complete" className="max-w-sm text-center">
        <p className="mt-3 text-muted">
          You completed <span className="font-medium text-fg">{completion?.title}</span>.
        </p>
        <p className="mt-4 font-display text-3xl font-medium tracking-tight tabular-nums">
          +{completion?.xp ?? 0} XP
        </p>
        <Button className="mt-6 w-full" onClick={onClose}>
          Nice
        </Button>
      </DialogContent>
    </Dialog>
  );
}

type Particle = {
  x: number;
  y: number;
  dy: number;
  dx: number;
  rotation: number;
  spin: number;
  color: string;
};

const CONFETTI_COLORS = [
  "var(--color-primary)",
  "var(--color-success)",
  "var(--color-danger)",
  "var(--color-slate)",
];

/**
 * Confetti as plain divs moved by one animation frame loop.
 *
 * A canvas library would be a dependency and a second rendering model for
 * twenty-four squares. Positions are written straight to the elements rather
 * than through state — re-rendering React sixty times a second to move a few
 * divs is how a celebration starts dropping frames.
 */
function Confetti({
  count,
  duration,
  onDone,
}: {
  count: number;
  duration: number;
  onDone: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  // Held in a ref so a re-render of the provider — a badge appearing, the
  // badge clearing — cannot restart the animation from the top.
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const host = container.current;
    if (!host) return;

    const height = window.innerHeight;
    const width = window.innerWidth;
    const nodes: HTMLDivElement[] = [];
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const particle: Particle = {
        x: Math.random() * width,
        y: -40 - Math.random() * 30,
        dy: Math.random() * 0.6,
        dx: (Math.random() - 0.5) * 1.4,
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      };
      const node = document.createElement("div");
      node.style.cssText = `position:absolute;top:0;left:0;width:5px;height:5px;border-radius:1px;opacity:0.75;background:${particle.color};will-change:transform`;
      host.appendChild(node);
      nodes.push(node);
      particles.push(particle);
    }

    let frame = 0;
    const started = performance.now();

    function step(nowMs: number) {
      const elapsed = nowMs - started;
      // Fade the whole layer out over the last third rather than per particle.
      const fadeFrom = duration * 0.66;
      if (host && elapsed > fadeFrom) {
        host.style.opacity = String(Math.max(0, 1 - (elapsed - fadeFrom) / (duration - fadeFrom)));
      }

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        // Gentle: pieces drift down rather than being thrown. Half the pull
        // of the first pass, which fell like a slot machine payout.
        particle.dy += 0.24;
        particle.y += particle.dy;
        particle.x += particle.dx;
        particle.rotation += particle.spin;
        nodes[i].style.transform =
          `translate3d(${particle.x}px, ${particle.y}px, 0) rotate(${particle.rotation}deg)`;
      }

      if (elapsed >= duration || particles.every((p) => p.y > height)) {
        done.current();
        return;
      }
      frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      for (const node of nodes) node.remove();
    };
  }, [count, duration]);

  return (
    <div ref={container} className="pointer-events-none fixed inset-0 z-[68] overflow-hidden" />
  );
}
