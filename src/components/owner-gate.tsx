import { lazy, Suspense, type ReactNode } from "react";

// Lazy: RequireOwner pulls in the auth client (better-auth/react), which must
// stay out of every route's eager bundle graph — see AuthGate for why.
const RequireOwner = lazy(() =>
  import("@/lib/auth/gates").then((m) => ({ default: m.RequireOwner })),
);

/**
 * Wrap owner-only content (edit/delete/make-public controls) with this —
 * renders `fallback` for anyone viewing the set who isn't its owner
 * (including a signed-out visitor), e.g. someone else's public set.
 */
export function OwnerGate({
  ownerId,
  fallback,
  children,
}: {
  ownerId: string;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <RequireOwner ownerId={ownerId} fallback={fallback}>
        {children}
      </RequireOwner>
    </Suspense>
  );
}
