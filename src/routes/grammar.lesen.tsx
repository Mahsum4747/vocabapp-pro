import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/grammar/lesen")({
  component: LesenRoute,
});

/**
 * SKELETON ONLY — no reading text, no comprehension questions. The task
 * explicitly forbids inventing real reading content here (that would be
 * fabricated, uncredited "AI knowledge" text, exactly what this German
 * enrichment pipeline has been careful to avoid elsewhere — see CLAUDE.md's
 * "Şu anki odak" on bundled Wiktionary data vs. AI generation). This route
 * exists only so the grammar hub has a real (if inert) destination for a
 * "Lesen" card, ready for real content later.
 */
function LesenRoute() {
  return (
    <AuthGate>
      <AppShell>
        <h1 className="font-display text-3xl font-medium tracking-tight">Lesen</h1>
        <div className="mt-6">
          <EmptyState
            title="Coming soon"
            description="Reading passages and comprehension questions aren't built yet."
            action={
              <Link
                to="/grammar"
                className="inline-flex h-11 items-center rounded-control bg-primary px-5 text-sm font-medium text-primary-fg"
              >
                Back to Grammar
              </Link>
            }
          />
        </div>
      </AppShell>
    </AuthGate>
  );
}
