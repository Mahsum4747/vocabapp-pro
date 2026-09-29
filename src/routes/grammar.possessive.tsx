import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPossessiveQuestion } from "@/lib/grammar-drills";
import { userNounEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/possessive")({
  component: PossessiveDrillRoute,
});

/**
 * mein/dein/sein drill: the user's own German cards with a known gender
 * (`userNounEligibleCards`) are prioritized, the whole dictionary fills the
 * rest. For each noun, a random person (ich/du/er.../wir/ihr/sie-Sie) and
 * case (Nominativ/Akkusativ/Dativ) are chosen, and the learner picks the
 * correctly inflected possessive form — same ending pattern as kein
 * (`ENDINGS`/`inflect` in grammar-drills.ts), different stem. No AppShell —
 * see the plural route's comment on why.
 */
function PossessiveDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userNounEligibleCards(sets), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="mein / dein / sein"
        topic="possessive"
        userEntries={userEntries}
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildPossessiveQuestion(entry))}
      />
    </AuthGate>
  );
}
