import type { Firestore } from "firebase-admin/firestore";
import {
  buildLearningSignals,
  signalDayKeys,
  REVIEW_SIGNAL_WINDOW,
  WRITING_SIGNAL_WINDOW,
  type LearningSignals,
  type LearningSignalsInput,
} from "./learning-signals";
import { readUserSettings } from "./daily-goal";
import { LESEN_PASSAGES } from "./german/lesen-data";

/** Only called after authentication. This service has no mutation methods. */
export async function readLearningSignalsFor(
  db: Firestore,
  userId: string,
  now: number,
): Promise<LearningSignals> {
  if (!userId || userId.includes("/")) throw new Error("Invalid verified user");
  const user = db.collection("users").doc(userId);
  const profileDoc = await user.get();
  const profile = profileDoc.data() ?? {};
  const dates = signalDayKeys(now, readUserSettings(profile).timeZone).keys;
  const [
    sets,
    progress,
    drills,
    events,
    grammar,
    lesen,
    grammarPaste,
    lesenPaste,
    writing,
    writingCount,
    days,
    streak,
  ] = await Promise.all([
    db.collection("study_sets").where("ownerId", "==", userId).get(),
    user.collection("cardProgress").get(),
    user.collection("articleDrillProgress").get(),
    user.collection("reviewEvents").orderBy("reviewedAt", "desc").limit(REVIEW_SIGNAL_WINDOW).get(),
    db.collection("grammarProgress").doc(userId).get(),
    db.collection("lesenProgress").doc(userId).get(),
    user
      .collection("grammarPasteTopics")
      .select("topic", "accuracy", "totalAttempts", "recentRounds", "lastPracticedAt")
      .get(),
    user
      .collection("lesenPasteTopics")
      .select("title", "level", "accuracy", "totalAttempts", "recentRounds", "lastPracticedAt")
      .get(),
    user
      .collection("aiFeedbackLog")
      .orderBy("createdAt", "desc")
      .limit(WRITING_SIGNAL_WINDOW)
      .select("createdAt", "errorTags")
      .get(),
    user.collection("aiFeedbackLog").count().get(),
    db.getAll(...dates.map((date) => user.collection("dailyStats").doc(date))),
    db.collection("user_streaks").doc(userId).get(),
  ]);
  // Identity is scoped by query/path, not a persisted id field or client input.
  const input: LearningSignalsInput = {
    now,
    profile,
    sets: sets.docs.map((d) => ({ ...d.data(), id: d.id })) as LearningSignalsInput["sets"],
    progress: progress.docs.map((d) => ({
      ...d.data(),
      cardId: d.id,
    })) as LearningSignalsInput["progress"],
    drills: drills.docs.map((d) => d.data()) as LearningSignalsInput["drills"],
    reviewEvents: events.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    })) as LearningSignalsInput["reviewEvents"],
    grammar: grammar.data() ?? {},
    lesen: lesen.data() ?? {},
    grammarPaste: grammarPaste.docs.map((d) => ({ ...d.data(), id: d.id })),
    lesenPaste: lesenPaste.docs.map((d) => ({ ...d.data(), id: d.id })),
    writing: writing.docs.map((d) => ({ ...d.data(), id: d.id })),
    totalWritingSubmissions: writingCount.data().count,
    dailyStats: dates.map((date, i) => ({ date, data: days[i]?.data() ?? null })),
    streak: (streak.data() ?? null) as LearningSignalsInput["streak"],
    passages: LESEN_PASSAGES,
  };
  return buildLearningSignals(input);
}

/** Defense in depth: unlike generic auth-off helpers, this API requires a session. */
export async function readSignalsForSession(
  db: Firestore,
  contextUserId: string,
  session: { id: string } | null,
  now: number,
): Promise<LearningSignals> {
  if (!session || session.id !== contextUserId) {
    const error = new Error("Unauthorized");
    Object.assign(error, { status: 401 });
    throw error;
  }
  return readLearningSignalsFor(db, session.id, now);
}
