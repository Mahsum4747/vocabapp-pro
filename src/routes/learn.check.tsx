import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const UnitCheckScreen = lazy(() =>
  import("@/components/learn/unit-check-screen").then((module) => ({
    default: module.UnitCheckScreen,
  })),
);
export const Route = createFileRoute("/learn/check")({
  // Browser navigation is permissive; the server UUID/owner schema remains authoritative.
  validateSearch: (search: Record<string, unknown>): { attempt?: string } => ({
    attempt: typeof search.attempt === "string" ? search.attempt : undefined,
  }),
  component: UnitCheckRoute,
});
function UnitCheckRoute() {
  const { attempt } = Route.useSearch();
  return (
    <Suspense fallback={<p className="px-page-safe py-12 text-muted">Loading your check…</p>}>
      <UnitCheckScreen key={attempt ?? "intro"} attemptId={attempt} />
    </Suspense>
  );
}
