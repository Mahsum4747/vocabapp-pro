import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout-only route. TanStack Router's dot-file convention makes every
 * `grammar.<name>.tsx` file (grammar.plural.tsx, grammar.diktat.tsx, ...) a
 * CHILD of this route, matched here purely on the shared `/grammar` prefix
 * — this file itself renders nothing but the matched child via `<Outlet />`
 * (same split `sets.$setId.tsx`/`sets.$setId.index.tsx` already use: a thin
 * parent layout + an `.index.tsx` for the bare path). The actual hub page
 * lives in `grammar.index.tsx` (`/grammar/`); each drill has its own
 * `AppShell`-free page via `StudySessionShell`, so no chrome is duplicated
 * here.
 */
export const Route = createFileRoute("/grammar")({
  component: () => <Outlet />,
});
