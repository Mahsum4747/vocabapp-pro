import { useRef, useState } from "react";
import { reportOperationFailure } from "./operation-errors";
export type PasteSaveStatus = "idle" | "validating" | "saving" | "saved" | "failed";
/** Retry reuses the original opaque ID; stale responses cannot open another session. */
export function usePasteSave<T>(
  save: (payload: T & { id: string }) => Promise<{ id: string }>,
  onSaved: (payload: T, id: string) => void,
) {
  const [status, setStatus] = useState<PasteSaveStatus>("idle");
  const pending = useRef<{ payload: T; id: string } | null>(null);
  const version = useRef(0);
  const inFlight = useRef(false);
  async function retry() {
    const request = pending.current;
    if (!request || inFlight.current) return;
    const current = version.current;
    inFlight.current = true;
    setStatus("saving");
    try {
      const result = await save({ ...request.payload, id: request.id });
      if (current !== version.current) return;
      setStatus("saved");
      onSaved(request.payload, result.id);
    } catch (error) {
      if (current !== version.current) return;
      setStatus("failed");
      reportOperationFailure(
        "paste.save",
        error,
        "Could not save. Retry saving before starting practice.",
      );
    } finally {
      if (current === version.current) inFlight.current = false;
    }
  }
  function begin(payload: T) {
    if (inFlight.current) return;
    version.current++;
    pending.current = { payload, id: crypto.randomUUID() };
    void retry();
  }
  function reset() {
    version.current++;
    pending.current = null;
    inFlight.current = false;
    setStatus("idle");
  }
  return { status, begin, retry, reset, validating: () => setStatus("validating") };
}
