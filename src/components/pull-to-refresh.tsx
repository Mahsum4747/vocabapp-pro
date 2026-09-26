import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, Loader2 } from "lucide-react";

const PULL_THRESHOLD = 70;
const MAX_PULL = 100;
// Resistance so the gesture doesn't track the finger 1:1 — same "damped
// drag" feel as a native sheet, and it keeps MAX_PULL reachable without the
// finger having to travel 100px+ on a small phone screen.
const PULL_DAMPING = 0.5;

/**
 * Dependency-free pull-to-refresh, opt-in per page (Home, a set's overview —
 * see those routes for the call sites) rather than wired into AppShell: the
 * app disables the browser's own pull-to-refresh globally
 * (`overscroll-behavior-y: none` in styles.css, added specifically so a
 * pull-down mid-review doesn't reload the page and lose the round), so
 * without this component there is no way to refresh at all on mobile, but
 * an active study session (Flashcards/Test/Match/…) must never gain one —
 * that's exactly the reload-loses-progress case the CSS rule exists to
 * prevent. Only wrap read-mostly pages, never a session screen.
 *
 * Detection is plain touch events, not a library: touchstart records the
 * start point ONLY when the page itself is scrolled to the top
 * (`window.scrollY === 0`) — anywhere else this is an ordinary scroll and
 * the gesture is ignored entirely, so scrolling down through a long page
 * never fights this. touchmove tracks how far past that point the finger
 * has moved and calls `preventDefault()` on the pull itself (not on
 * unrelated touches) so the page doesn't also try to rubber-band. Past
 * PULL_THRESHOLD on release, `onRefresh` runs — re-fetching this page's own
 * data through the existing store actions, never a location.reload().
 */
export function PullToRefresh({
  onRefresh,
  children,
  className,
}: {
  /** Re-fetch whatever data this page shows. Never a full page reload. */
  onRefresh: () => Promise<unknown> | unknown;
  children: ReactNode;
  className?: string;
}) {
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const pullDistanceRef = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const setDistance = useCallback((value: number) => {
    pullDistanceRef.current = value;
    setPullDistance(value);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function reset() {
      startYRef.current = null;
      setDistance(0);
    }

    function onTouchStart(e: TouchEvent) {
      // Already showing the spinner, or mid-release animation back to 0 —
      // don't let a second gesture start until this one has fully settled.
      if (pullDistanceRef.current > 0) return;
      if (window.scrollY > 0) return;
      startYRef.current = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      if (startYRef.current === null) return;
      const delta = e.touches[0].clientY - startYRef.current;
      // Finger moved up, or the page scrolled away from the top mid-gesture
      // (content above grew) — this was never a pull-down, abandon it.
      if (delta <= 0 || window.scrollY > 0) {
        reset();
        return;
      }
      setDistance(Math.min(MAX_PULL, delta * PULL_DAMPING));
      e.preventDefault();
    }

    async function onTouchEnd() {
      if (startYRef.current === null) return;
      startYRef.current = null;
      if (pullDistanceRef.current < PULL_THRESHOLD) {
        setDistance(0);
        return;
      }
      setRefreshing(true);
      setDistance(PULL_THRESHOLD);
      try {
        await onRefreshRef.current();
      } finally {
        setRefreshing(false);
        setDistance(0);
      }
    }

    // touchmove must be non-passive: it calls preventDefault() while
    // actively pulling, so the browser doesn't also try to scroll/rubber-band.
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", reset, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", reset);
    };
  }, [setDistance]);

  return (
    <div ref={containerRef} className={className}>
      <div
        className="flex items-center justify-center overflow-hidden transition-[height] duration-200 ease-out"
        style={{ height: pullDistance }}
        aria-hidden={pullDistance === 0}
      >
        {refreshing ? (
          <Loader2 className="size-5 animate-spin text-primary-ink" />
        ) : (
          <ArrowDown
            className="size-5 text-primary-ink transition-transform duration-150"
            style={{
              transform: pullDistance >= PULL_THRESHOLD ? "rotate(180deg)" : "rotate(0deg)",
              opacity: Math.min(1, pullDistance / PULL_THRESHOLD),
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
}
