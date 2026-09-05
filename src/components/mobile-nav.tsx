import { Link, useLocation } from "@tanstack/react-router";
import { Home, Library, User } from "lucide-react";
import { lazy, Suspense } from "react";
import { cn } from "@/lib/utils";

// Lazy: pulls in the auth client (better-auth/react) — must stay out of the
// eager bundle for any component rendered on most routes. See AppShell's
// UserButton for the same pattern and why.
const AccountNavItem = lazy(() =>
  import("@/lib/auth/gates").then((m) => ({ default: m.AccountNavItem })),
);

const itemClass =
  "flex flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 text-[11px] font-medium text-muted";

export function MobileNav() {
  const location = useLocation();
  const search = location.search as { view?: string };
  const isLibrary = location.pathname === "/" && search.view === "mine";
  const isHome = location.pathname === "/" && !isLibrary;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
    >
      <Link to="/" className={cn(itemClass, isHome && "text-primary")}>
        <Home className="size-5" />
        Home
      </Link>
      <Link to="/" search={{ view: "mine" }} className={cn(itemClass, isLibrary && "text-primary")}>
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
