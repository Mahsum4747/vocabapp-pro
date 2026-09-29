import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildKonjunktivQuestion } from "@/lib/grammar-drills";
import { randomVerbSample } from "@/lib/german/verb-conjugation-data";
import type { VerbConjugationEntry } from "@/lib/german/verb-conjugation-data";

export const Route = createFileRoute("/grammar/konjunktiv")({
  component: KonjunktivDrillRoute,
});

/**
 * Set-independent Konjunktiv II drill: würde + infinitive vs. hätte/wäre +
 * infinitive (real Konjunktiv II auxiliaries, wrong ones for a plain verb)
 * and the plain present-tense form, drawn from `verb-conjugation-data.ts`.
 */
function KonjunktivDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<VerbConjugationEntry>
        mode="Konjunktiv II"
        topic="konjunktiv"
        fetchSample={() => Promise.resolve(randomVerbSample(12, "any"))}
        buildRound={(entries) => entries.map((entry) => buildKonjunktivQuestion(entry))}
      />
    </AuthGate>
  );
}
