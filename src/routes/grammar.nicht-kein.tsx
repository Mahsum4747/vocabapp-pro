import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildNichtKeinQuestion } from "@/lib/grammar-drills";
import { userNounEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/nicht-kein")({
  component: NichtKeinDrillRoute,
});

/**
 * nicht/kein drill: the user's own German cards with a known gender
 * (`userNounEligibleCards`) are prioritized, the whole dictionary fills the
 * rest. For each noun, one of a fixed 4-template sentence pool (see
 * `NICHT_KEIN_TEMPLATES` in grammar-drills.ts) is filled in and the learner
 * picks whether the blank is "nicht" or the correctly inflected "kein"
 * form. No AppShell — see the plural route's comment on why
 * (GrammarDrillRunner already renders StudySessionShell's full-page
 * chrome).
 */
function NichtKeinDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userNounEligibleCards(sets), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="nicht / kein"
        topic="nicht-kein"
        userEntries={userEntries}
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildNichtKeinQuestion(entry))}
      />
    </AuthGate>
  );
}
