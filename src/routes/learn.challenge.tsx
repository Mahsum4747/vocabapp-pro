import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const ChallengeScreen = lazy(() =>
  import("@/components/learn/unit-challenge-screen").then((module) => ({
    default: module.UnitChallengeScreen,
  })),
);
export const Route = createFileRoute("/learn/challenge")({
  validateSearch: (search: Record<string, unknown>) => ({
    unitId: typeof search.unitId === "string" ? search.unitId : "",
  }),
  component: ChallengeRoute,
});
function ChallengeRoute() {
  const { unitId } = Route.useSearch();
  return (
    <Suspense fallback={<p className="p-8">Loading challenge…</p>}>
      <ChallengeScreen key={unitId} unitId={unitId} />
    </Suspense>
  );
}
