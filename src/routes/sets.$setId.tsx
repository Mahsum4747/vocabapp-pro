import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
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

  return (
    <AuthGate>
      {checking ? (
        <AppShell>
          <div className="py-24 text-center text-sm text-muted">Loading…</div>
        </AppShell>
      ) : (
        <Outlet />
      )}
    </AuthGate>
  );
}
