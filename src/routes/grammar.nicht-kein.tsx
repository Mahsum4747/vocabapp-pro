import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildNichtKeinQuestion } from "@/lib/grammar-drills";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/nicht-kein")({
  component: NichtKeinDrillRoute,
});

/**
 * Set-independent nicht/kein drill: for each noun in the sample, one of a
 * fixed 4-template sentence pool (see `NICHT_KEIN_TEMPLATES` in
 * grammar-drills.ts) is filled in and the learner picks whether the blank
 * is "nicht" or the correctly inflected "kein" form. No AppShell — see the
 * plural route's comment on why (GrammarDrillRunner already renders
 * StudySessionShell's full-page chrome).
 */
function NichtKeinDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="nicht / kein"
        topic="nicht-kein"
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildNichtKeinQuestion(entry))}
      />
    </AuthGate>
  );
}
