import { Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { lazy, Suspense, type ReactNode } from "react";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { Button } from "./ui/button";

// Lazy: this pulls in the auth client (better-auth/react), which must stay out
// of every route's eager bundle graph — see the "ssr_exports" incident where
// importing it eagerly here corrupted an unrelated Nitro SSR chunk.
const UserButton = lazy(() => import("@/lib/auth/gates").then((m) => ({ default: m.UserButton })));

export function AppShell({
  children,
  action,
  learnPresentation = false,
}: {
  children: ReactNode;
  action?: ReactNode;
  learnPresentation?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-surface pt-safe-top shadow-[var(--elevation-1)]">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-page-safe">
          <Logo />
          <div className="flex items-center gap-2">
            {action}
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
              <Link
                to="/learn"
                aria-current={learnPresentation ? "page" : undefined}
                className={learnPresentation ? "bg-primary-soft text-primary-ink" : undefined}
              >
                Learn
              </Link>
            </Button>
            {learnPresentation && (
              <Button asChild variant="ghost" size="icon">
                <Link to="/" search={{ view: "mine" }} aria-label="Search your library">
                  <Search aria-hidden="true" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              variant={learnPresentation ? "outline" : "default"}
              size="sm"
              className="tap-target"
            >
              <Link to="/create">
                <Plus />
                New set
              </Link>
            </Button>
            <div className="hidden md:block">
              <Suspense fallback={<div className="size-9" />}>
                <UserButton />
              </Suspense>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-page-safe py-section pb-nav-clearance md:pb-16">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
