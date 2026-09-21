import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * `/signup` is the create-account panel on `/login`, not a page of its own —
 * redirecting keeps one form (and one place its validation lives) while making
 * the URL people naturally try work instead of 404ing.
 */
export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    throw redirect({ to: "/login", search: { mode: "signup" }, replace: true });
  },
});
