import { lazy, Suspense, type ReactNode } from "react";

// Lazy: RequireAuth pulls in the auth client (better-auth/react), which must
// stay out of every route's eager bundle graph — see the "ssr_exports"
// incident in AppShell's UserButton for why an eager import here breaks the
// Nitro SSR chunk.
const RequireAuth = lazy(() =>
  import("@/lib/auth/gates").then((m) => ({ default: m.RequireAuth })),
);

/** Wrap a protected route's content with this to redirect signed-out visitors to /login. */
export function AuthGate({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <RequireAuth>{children}</RequireAuth>
    </Suspense>
  );
}
