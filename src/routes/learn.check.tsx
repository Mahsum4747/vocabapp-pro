import { CP1_ID } from "@/lib/curriculum/checkpoint-identity";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const UnitCheckScreen = lazy(() =>
  import("@/components/learn/unit-check-screen").then((module) => ({
    default: module.UnitCheckScreen,
  })),
);
const CheckpointScreen = lazy(() =>
  import("@/components/learn/checkpoint-screen").then((module) => ({
    default: module.CheckpointScreen,
  })),
);
export const Route = createFileRoute("/learn/check")({
  // Browser navigation is permissive; the server UUID/owner schema remains authoritative.
  validateSearch: (search: Record<string, unknown>): { attempt?: string; assessment?: string } => ({
    attempt: typeof search.attempt === "string" ? search.attempt : undefined,
    assessment: typeof search.assessment === "string" ? search.assessment : undefined,
  }),
  component: UnitCheckRoute,
});
function UnitCheckRoute() {
  const { attempt, assessment } = Route.useSearch();
  return (
    <Suspense fallback={<p className="px-page-safe py-12 text-muted">Loading your check…</p>}>
      {assessment === CP1_ID ? (
        <CheckpointScreen key={attempt ?? "cp1-intro"} attemptId={attempt} />
      ) : (
        <UnitCheckScreen
          key={attempt ?? assessment ?? "intro"}
          attemptId={attempt}
          assessmentId={assessment}
        />
      )}
    </Suspense>
  );
}
