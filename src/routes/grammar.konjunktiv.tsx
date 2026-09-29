import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildKonjunktivQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import { userVerbEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/konjunktiv")({
  component: KonjunktivDrillRoute,
});

/**
 * Konjunktiv II drill: the user's own German cards whose term
 * `lookupVerbConjugation` recognizes (`userVerbEligibleCards`, "any") are
 * prioritized. würde + infinitive vs. hätte/wäre + infinitive (real
 * Konjunktiv II auxiliaries, wrong ones for a plain verb) and the plain
 * present-tense form, the rest drawn from `verb-conjugation-data.ts`.
 */
function KonjunktivDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userVerbEligibleCards(sets, "any"), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Konjunktiv II"
        topic="konjunktiv"
        userEntries={userEntries}
        fetchSample={() => Promise.resolve(randomVerbSample(12, "any"))}
        buildRound={(entries) => entries.map((entry) => buildKonjunktivQuestion(entry))}
      />
    </AuthGate>
  );
}
