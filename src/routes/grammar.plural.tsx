import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildPluralQuestion } from "@/lib/grammar-drills";
import type { NounEntry } from "@/lib/german/types";

export const Route = createFileRoute("/grammar/plural")({
  component: PluralDrillRoute,
});

/**
 * Set-independent plural drill: one question per noun in the sample, drawn
 * from the whole `nouns-data.ts` dictionary (via `fetchRandomNounSample`),
 * never from any one set's own cards. See `buildPluralQuestion`
 * (src/lib/grammar-drills.ts) for how distractors are generated (the
 * other common ending patterns applied to the same lemma) — no AI call.
 *
 * No AppShell here: `GrammarDrillRunner` renders `StudySessionShell`, which
 * is already a full-page chrome (same as every other study-mode route,
 * e.g. sets.$setId.cases.tsx) — wrapping it in AppShell would double the
 * page shell.
 */
function PluralDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner
        mode="Plural"
        topic="plural"
        buildRound={(entries: NounEntry[]) => entries.map((entry) => buildPluralQuestion(entry))}
      />
    </AuthGate>
  );
}
