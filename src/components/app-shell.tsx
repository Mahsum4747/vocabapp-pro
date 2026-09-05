import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { lazy, Suspense, type ReactNode } from "react";
import { Logo } from "./logo";
import { Button } from "./ui/button";

// Lazy: this pulls in the auth client (better-auth/react), which must stay out
// of every route's eager bundle graph — see the "ssr_exports" incident where
// importing it eagerly here corrupted an unrelated Nitro SSR chunk.
const UserButton = lazy(() =>
  import("@/lib/auth/gates").then((m) => ({ default: m.UserButton })),
);

export function AppShell({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
          <Logo />
          <div className="flex items-center gap-2">
            {action}
            <Button asChild size="sm">
              <Link to="/create">
                <Plus />
                New set
              </Link>
            </Button>
            <Suspense fallback={<div className="size-9" />}>
              <UserButton />
            </Suspense>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-16">{children}</main>
    </div>
  );
}
