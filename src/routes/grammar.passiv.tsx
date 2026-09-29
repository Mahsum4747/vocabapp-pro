import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPassivQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import { userVerbEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/passiv")({
  component: PassivDrillRoute,
});

/**
 * Passiv drill: the user's own German cards whose term
 * `lookupVerbConjugation` recognizes (`userVerbEligibleCards`, "any") are
 * prioritized — note some of those may lack a `partizipII` and so are
 * filtered out downstream by `buildPassivQuestion`'s caller assumption;
 * see below. werden + Partizip II per tense, the rest drawn from verbs in
 * `verb-conjugation-data.ts` that have a `partizipII` (`randomVerbSample`
 * already filters to that).
 */
function PassivDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(
    () => userVerbEligibleCards(sets, "any").filter((entry) => entry.partizipII),
    [sets],
  );
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Passiv"
        topic="passiv"
        userEntries={userEntries}
        fetchSample={() => Promise.resolve(randomVerbSample(12, "any"))}
        buildRound={(entries) => entries.map((entry) => buildPassivQuestion(entry))}
      />
    </AuthGate>
  );
}
