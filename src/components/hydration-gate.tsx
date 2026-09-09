import type { ReactNode } from "react";

/**
 * A no-op today: `useStudyStore` was never wrapped in Zustand's `persist`
 * middleware, so there is no persisted snapshot to rehydrate, and the store
 * fetches everything it needs from the server on mount instead. Kept as a
 * pass-through wrapper — rather than removed and unwrapped at every call
 * site — so nothing has to change if persistence is ever added back.
 */
export function HydrationGate({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
