import { createFileRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const AuthenticatedLearn = lazy(() =>
  import("@/lib/auth/gates").then((module) => ({
    default: module.AuthenticatedLearn,
  })),
);

export const Route = createFileRoute("/learn")({ component: LearnLayout });
function LearnLayout() {
  return (
    <Suspense fallback={<p className="px-page-safe py-12 text-muted">Loading your lessons…</p>}>
      <AuthenticatedLearn>
        <Outlet />
      </AuthenticatedLearn>
    </Suspense>
  );
}
