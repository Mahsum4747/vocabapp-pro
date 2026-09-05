import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useSet, useStudyStore } from "@/lib/store";

export const Route = createFileRoute("/sets/$setId")({
  component: SetLayout,
});

function SetLayout() {
  const { setId } = Route.useParams();
  const studySet = useSet(setId);
  const isLoaded = useStudyStore((s) => s.isLoaded);
  const fetchSetById = useStudyStore((s) => s.fetchSetById);
  const [checking, setChecking] = useState(!studySet);

  useEffect(() => {
    if (studySet || isLoaded) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    setChecking(true);
    fetchSetById(setId).finally(() => {
      if (!cancelled) setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [setId, studySet, isLoaded, fetchSetById]);

  // No blanket AuthGate here: this layout also serves someone else's public
  // set, which a signed-out visitor must be able to read and study. Each leaf
  // route (flashcards/learn/test/match/index) already renders "Set not found"
  // when `studySet` is undefined — which `getSetById` now returns for both a
  // truly missing set and a private one the caller can't see, so there's
  // nothing to leak either way. Owner-only actions (edit, delete, make
  // public/private) are gated separately, close to where they're rendered.
  return checking ? (
    <AppShell>
      <div className="py-24 text-center text-sm text-muted">Loading…</div>
    </AppShell>
  ) : (
    <Outlet />
  );
}
