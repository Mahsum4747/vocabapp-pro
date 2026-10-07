import { CP1_ID } from "@/lib/curriculum/checkpoint-identity";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export function CheckpointEntry() {
  return (
    <section className="mt-6 border-t border-border pt-5" aria-label="Checkpoint 1">
      <h2 className="font-display text-xl font-semibold">Checkpoint 1</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Bring Units 1–3 together in 14 short tasks. Cumulative practice and bounded evidence, not A1
        certification. Your lessons and Unit Checks stay separate.
      </p>
      <Button asChild variant="outline" className="mt-4 h-auto min-h-11 whitespace-normal py-3">
        <Link to="/learn/check" search={{ assessment: CP1_ID }}>
          Open Checkpoint 1
        </Link>
      </Button>
    </section>
  );
}
