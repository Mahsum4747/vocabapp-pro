import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPassiversatzformenQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import { userVerbEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/passiversatzformen")({
  component: PassiversatzformenDrillRoute,
});

/**
 * Passiversatzformen drill: the user's own German verb cards
 * (`userVerbEligibleCards`, "any" — any recognized verb works, see
 * `buildPassiversatzformenQuestion`'s own doc comment) are prioritized
 * over `randomVerbSample(12, "any")`.
 */
function PassiversatzformenDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userVerbEligibleCards(sets, "any"), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Passiversatzformen"
        topic="passiversatzformen"
        userEntries={userEntries}
        fetchSample={() => Promise.resolve(randomVerbSample(12, "any"))}
        buildRound={(entries) => entries.map((entry) => buildPassiversatzformenQuestion(entry))}
      />
    </AuthGate>
  );
}
