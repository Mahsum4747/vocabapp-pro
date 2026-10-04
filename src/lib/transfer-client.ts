import type { Card, CardProgress, StudySet } from "./types";
import type { UserProfile } from "./gamification";
import type { SetSession } from "./session-pass";

/** Apply the committed move response, including current memory/pass references. */
export function movedClientState(
  state: {
    sets: StudySet[];
    publicSets: StudySet[];
    progress: Record<string, CardProgress>;
    profile: UserProfile | null;
  },
  source: string,
  target: string,
  movedIds: string[],
  result: {
    sourceCards: Card[];
    targetCards: Card[];
    movedProgress: CardProgress[];
    sessions: Record<string, SetSession>;
    updatedAt: number;
  },
) {
  const patch = (sets: StudySet[]) =>
    sets.map((s) =>
      s.id === source
        ? { ...s, cards: result.sourceCards, updatedAt: result.updatedAt }
        : s.id === target
          ? { ...s, cards: result.targetCards, updatedAt: result.updatedAt }
          : s,
    );
  const progress = { ...state.progress };
  // An absent server row means fresh, even if this tab cached deleted memory.
  for (const id of movedIds) delete progress[id];
  for (const row of result.movedProgress) progress[row.cardId] = row;
  return {
    sets: patch(state.sets),
    publicSets: patch(state.publicSets),
    progress,
    profile: state.profile
      ? { ...state.profile, setSessions: { ...state.profile.setSessions, ...result.sessions } }
      : null,
    todaySummary: null,
  };
}
