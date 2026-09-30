import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildKonjunktivEinsQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import { userExtendedVerbEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/konjunktiv1")({
  component: KonjunktivEinsDrillRoute,
});

/**
 * Konjunktiv I (indirekte Rede) drill — a USAGE drill (reported speech),
 * deliberately separate from `/grammar/konjunktiv`'s FORM drill (würde vs.
 * synthetic Konjunktiv II). See `buildKonjunktivEinsQuestion`'s own doc
 * comment.
 */
function KonjunktivEinsDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userExtendedVerbEligibleCards(sets), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Konjunktiv I"
        topic="konjunktiv1"
        userEntries={userEntries}
        fetchSample={() => Promise.resolve(randomVerbSample(12, "any"))}
        buildRound={(entries) => entries.map((entry) => buildKonjunktivEinsQuestion(entry))}
      />
    </AuthGate>
  );
}
