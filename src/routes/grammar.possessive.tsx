import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPossessiveQuestion } from "@/lib/grammar-drills";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/possessive")({
  component: PossessiveDrillRoute,
});

/**
 * Set-independent mein/dein/sein drill: for each noun in the sample, a
 * random person (ich/du/er.../wir/ihr/sie-Sie) and case (Nominativ/
 * Akkusativ/Dativ) are chosen, and the learner picks the correctly
 * inflected possessive form — same ending pattern as kein
 * (`ENDINGS`/`inflect` in grammar-drills.ts), different stem. No AppShell —
 * see the plural route's comment on why.
 */
function PossessiveDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="mein / dein / sein"
        topic="possessive"
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildPossessiveQuestion(entry))}
      />
    </AuthGate>
  );
}
