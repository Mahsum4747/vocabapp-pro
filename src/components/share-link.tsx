import { useEffect, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

/**
 * The public link to a set, built from its `shareId` rather than its Firestore
 * document id. Shown to the owner once the set is public.
 */
export function ShareLink({ shareId }: { shareId: string }) {
  // The origin is only knowable in the browser, so the field fills in after
  // mount instead of causing a hydration mismatch.
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = `${origin}/sets/${shareId}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Share link copied.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link — select it and copy manually.");
    }
  }

  return (
    <div className="mt-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
        <Link2 className="size-3.5" />
        Share link
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Public link to this set"
          className="min-w-0 flex-1 rounded-md bg-surface-2 px-3 py-2 font-mono text-xs text-fg"
        />
        <Button type="button" variant="outline" size="sm" onClick={copy} disabled={!origin}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <p className="mt-2 text-xs text-subtle">
        Anyone with this link can view and copy this set while it stays public.
      </p>
    </div>
  );
}
