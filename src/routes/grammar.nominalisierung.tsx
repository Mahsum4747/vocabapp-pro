import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth-gate";
import { GrammarDrillRunner } from "@/components/grammar-drill-runner";
import { buildNominalisierungQuestion } from "@/lib/grammar-drills";
import { fetchRandomNominalisierungSample } from "@/lib/german/grammar-drill-sample";
import type { NominalisierungSampleEntry } from "@/lib/german/grammar-drill-sample";

export const Route = createFileRoute("/grammar/nominalisierung")({
  component: NominalisierungDrillRoute,
});

/**
 * Nominalisierung drill: the question pool is now DERIVED, not hand-written
 * — `fetchRandomNominalisierungSample` (nominalisierung.server.ts) matches
 * `verb-conjugation-data.ts`'s 6659 infinitives against `nouns-data.ts`'s
 * -ung nouns (1,322 real pairs, e.g. entscheiden → die Entscheidung) and
 * separately offers every infinitive as its own bare-infinitive-as-noun
 * form (das Lesen, das Schreiben — no matching needed, always valid).
 *
 * The two kinds are MIXED within this one round/route rather than split
 * into a second hub tile: `buildPassivQuestion` (Präsens/Präteritum/
 * Perfekt) and `buildKonjunktivQuestion` (würde-form/synthetic) already mix
 * multiple question variants inside one mode the same way, so this follows
 * the codebase's own existing precedent instead of adding a 27th hub entry,
 * a new `ModeId`, and a second `grammarProgress` topicId for what is still
 * conceptually one skill (turning a verb into a noun).
 *
 * No `userEntries`/`fetchSample` default: this always needs a fresh
 * server-computed sample (the -ung pool is server-only, see
 * nominalisierung.server.ts), so `fetchRandomNominalisierungSample` is
 * passed directly as `fetchSample`.
 */
function NominalisierungDrillRoute() {
  return (
    <AuthGate>
      <GrammarDrillRunner<NominalisierungSampleEntry>
        mode="Nominalisierung"
        topic="nominalisierung"
        fetchSample={() => fetchRandomNominalisierungSample({ data: { count: 12 } })}
        buildRound={(entries) => entries.map((entry) => buildNominalisierungQuestion(entry))}
      />
    </AuthGate>
  );
}
