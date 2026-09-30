import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPartizipialQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import { userExtendedVerbEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/partizipial")({
  component: PartizipialDrillRoute,
});

/**
 * Partizipialkonstruktionen drill: the user's own German verb cards that
 * `lookupVerbConjugationExtended` also recognizes (`userExtendedVerbEligibleCards`)
 * are prioritized; the general pool is `randomVerbSample(12, "any")`, which
 * per `verb-conjugation-extended-data.ts`'s header comment is generated
 * from the SAME infinitives, so it always resolves too.
 */
function PartizipialDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userExtendedVerbEligibleCards(sets), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Partizipialkonstruktionen"
        topic="partizipialkonstruktionen"
        userEntries={userEntries}
        fetchSample={() => Promise.resolve(randomVerbSample(12, "any"))}
        buildRound={(entries) => entries.map((entry) => buildPartizipialQuestion(entry))}
      />
    </AuthGate>
  );
}
