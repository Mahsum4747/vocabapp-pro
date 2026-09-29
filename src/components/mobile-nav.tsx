import { Link, useLocation } from "@tanstack/react-router";
import { Home, Library, User } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// CSS has no media query for "the on-screen keyboard is open" (it's not a
// viewport-size change the platform exposes that way) — this is the one
// spot in the mobile nav that genuinely needs JS instead of a media query.
// visualViewport shrinks by roughly the keyboard's height while
// window.innerHeight stays put, so a big relative drop is a reliable
// keyboard signal. Desktop browsers don't have a virtual keyboard, but we
// still gate on the same `md` breakpoint Tailwind uses for this nav
// (768px) so a desktop visualViewport resize — devtools bar, browser zoom —
// can never be mistaken for one.
const MOBILE_BREAKPOINT_PX = 768;
const KEYBOARD_HEIGHT_RATIO_THRESHOLD = 0.25;

function useIsKeyboardOpen() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      if (window.innerWidth >= MOBILE_BREAKPOINT_PX) {
        setIsKeyboardOpen(false);
        return;
      }
      const shrink = 1 - viewport.height / window.innerHeight;
      setIsKeyboardOpen(shrink > KEYBOARD_HEIGHT_RATIO_THRESHOLD);
    };

    handleResize();
    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }, []);

  return isKeyboardOpen;
}

// Lazy: pulls in the auth client (better-auth/react) — must stay out of the
// eager bundle for any component rendered on most routes. See AppShell's
// UserButton for the same pattern and why.
const AccountNavItem = lazy(() =>
  import("@/lib/auth/gates").then((m) => ({ default: m.AccountNavItem })),
);

const itemClass =
  "flex flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 text-2xs font-medium text-muted active:bg-surface-2";

export function MobileNav() {
  const location = useLocation();
  const search = location.search as { view?: string };
  const isLibrary = location.pathname === "/" && search.view === "mine";
  const isHome = location.pathname === "/" && !isLibrary;
  const isKeyboardOpen = useIsKeyboardOpen();

  return (
    <nav
      aria-label="Primary"
      data-keyboard-open={isKeyboardOpen ? "true" : "false"}
      className="fixed inset-x-0 bottom-0 z-40 flex translate-y-0 border-t border-border bg-surface/95 pb-safe-bottom pl-safe-left pr-safe-right backdrop-blur-sm transition-transform duration-200 data-[keyboard-open=true]:translate-y-full md:hidden"
    >
      <Link to="/" className={cn(itemClass, isHome && "text-primary-ink")}>
        <Home className="size-5" />
        Home
      </Link>
      <Link to="/" search={{ view: "mine" }} className={cn(itemClass, isLibrary && "text-primary-ink")}>
        <Library className="size-5" />
        My Library
      </Link>
      <Suspense
        fallback={
          <span className={itemClass}>
            <User className="size-5" />
            Account
          </span>
        }
      >
        <AccountNavItem className={itemClass} />
      </Suspense>
    </nav>
  );
}
