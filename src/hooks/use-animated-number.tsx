import { useEffect, useRef, useState } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * Eases a displayed number from its previous value to `value` over `duration`ms.
 * Never changes what the number IS or when it updates — only the transition
 * between two already-decided values. Snaps instantly under reduced motion.
 */
export function useAnimatedNumber(value: number, duration = 450): number {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      displayRef.current = value;
      setDisplay(value);
      return;
    }
    if (displayRef.current === value) return;

    const from = displayRef.current;
    const start = performance.now();

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const next = from + (value - from) * easeOutCubic(t);
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return Math.round(display);
}

/** JSX convenience wrapper around {@link useAnimatedNumber} for use inline or in lists. */
export function AnimatedNumber({ value, duration }: { value: number; duration?: number }) {
  return <>{useAnimatedNumber(value, duration)}</>;
}
