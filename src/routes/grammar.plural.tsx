import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPluralQuestion } from "@/lib/grammar-drills";
import { userPluralEligibleCards } from "@/lib/german/grammar-hub";
import { useStudyStore } from "@/lib/store";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/plural")({
  component: PluralDrillRoute,
});

/**
 * Plural drill: the user's own German cards with a known gender AND plural
 * (`userPluralEligibleCards`) are prioritized, the whole `nouns-data.ts`
 * dictionary (via `fetchRandomNounSample`) fills the rest — see
 * `GrammarDrillRunner`'s `userEntries` doc comment for the exact mixing
 * rule. See `buildPluralQuestion` (src/lib/grammar-drills.ts) for how
 * distractors are generated (the other common ending patterns applied to
 * the same lemma) — no AI call.
 *
 * No AppShell here: `GrammarDrillRunner` renders `StudySessionShell`, which
 * is already a full-page chrome (same as every other study-mode route,
 * e.g. sets.$setId.cases.tsx) — wrapping it in AppShell would double the
 * page shell.
 */
function PluralDrillRoute() {
  const sets = useStudyStore((s) => s.sets);
  const userEntries = useMemo(() => userPluralEligibleCards(sets), [sets]);
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="Plural"
        topic="plural"
        userEntries={userEntries}
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildPluralQuestion(entry))}
      />
    </AuthGate>
  );
}
