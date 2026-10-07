import { CP1_ID, CP2_ID, CP3_ID } from "@/lib/curriculum/checkpoint-identity";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export function CheckpointEntry({ checkpoint = 1 }: { checkpoint?: 1 | 2 | 3 }) {
  const final = checkpoint === 3;
  const second = checkpoint === 2;
  return (
    <section className="mt-6 border-t border-border pt-5" aria-label={`Checkpoint ${checkpoint}`}>
      <h2 className="font-display text-xl font-semibold">Checkpoint {checkpoint}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {final
          ? "Two independent 14-task sittings bring the text path together. Review seven practical outcomes and plan a later follow-up. Lessons, Unit Checks and test-out records stay separate."
          : second
            ? "Bring Units 1–6 together in 16 bounded tasks, including a three-point practical message. Cumulative practice and sampled evidence, not A1 certification. Your lessons and Unit Checks stay separate."
            : "Bring Units 1–3 together in 14 short tasks. Cumulative practice and bounded evidence, not A1 certification. Your lessons and Unit Checks stay separate."}
      </p>
      <Button asChild variant="outline" className="mt-4 h-auto min-h-11 whitespace-normal py-3">
        <Link to="/learn/check" search={{ assessment: final ? CP3_ID : second ? CP2_ID : CP1_ID }}>
          Open Checkpoint {checkpoint}
        </Link>
      </Button>
    </section>
  );
}
