import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LearnSessionProvider } from "@/components/learn/session-context";

export const Route = createFileRoute("/learn")({ component: LearnLayout });
function LearnLayout() {
  return (
    <LearnSessionProvider>
      <Outlet />
    </LearnSessionProvider>
  );
}
