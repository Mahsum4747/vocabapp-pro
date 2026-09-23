import { useEffect, useMemo, useState } from "react";
import { useStudyStore } from "./store";
import { takeSession, type SetSession } from "./session-pass";
import { isCardActive, type Card } from "./types";

/**
 * A study mode's view of "this session" (session-pass.ts): a SNAPSHOT of the
 * user's cap and pass progress for this set, taken once when the mode opens.
 * Finishing a card updates the stored pass immediately, but the round on
 * screen must not rebuild under the learner — same rule as every mode's own
 * deck snapshot — so `session` stays frozen until the mode is reopened.
 *
 * `ready` waits for the profile (where this lives) to load or fail; a
 * signed-out visitor gets the defaults instead of an empty screen forever.
 */
export function useSessionPlan(setId: string | undefined) {
  const fetchProfile = useStudyStore((s) => s.fetchProfile);
  const markCardServed = useStudyStore((s) => s.markCardServed);
  const setSize = useStudyStore(
    (s) => s.sets.find((x) => x.id === setId || x.shareId === setId)?.cards.filter(isCardActive).length ?? 0,
  );
  const [snapshot, setSnapshot] = useState<{ key: string; session: SetSession } | null>(null);

  useEffect(() => {
    if (!setId) return;
    let cancelled = false;
    void (async () => {
      if (!useStudyStore.getState().profile) await fetchProfile();
      if (cancelled) return;
      const docId = useStudyStore.getState().sets.find((x) => x.id === setId || x.shareId === setId)?.id;
      if (!docId) return;
      const stored = useStudyStore.getState().profile?.setSessions?.[docId];
      setSnapshot({ key: setId, session: stored ?? { served: [] } });
    })();
    return () => {
      cancelled = true;
    };
  }, [setId, fetchProfile]);

  const session = snapshot && snapshot.key === setId ? snapshot.session : null;

  return useMemo(
    () => ({
      /** False until the snapshot exists; modes build no round before this. */
      ready: session !== null,
      /** Stable identity per open — safe to list in a round's memo deps. */
      session,
      /** This session's cards from a queue-ordered list. */
      take: <T extends Card>(ordered: readonly T[]): T[] =>
        session ? takeSession(ordered, session, setSize) : [...ordered],
      /** Record a finished card (rate / Continue) into this pass. */
      finish: (docSetId: string, cardId: string) => markCardServed(docSetId, cardId),
    }),
    [session, setSize, markCardServed],
  );
}
