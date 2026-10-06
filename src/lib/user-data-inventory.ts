/** Canonical inventory shared by account deletion and explicit development reset. */
export const USER_DOCUMENT_COLLECTIONS = [
  "users",
  "user_streaks",
  "grammarProgress",
  "lesenProgress",
] as const;
export function userDocumentPaths(userId: string): string[] {
  if (
    !userId.trim() ||
    userId.length > 200 ||
    userId.includes("/") ||
    userId === "." ||
    userId === ".." ||
    userId.startsWith("--")
  )
    throw new Error("Invalid user ID");
  return USER_DOCUMENT_COLLECTIONS.map((collection) => `${collection}/${userId}`);
}

/** Removed recursively by deleting users/{uid}; histories are not separate roots. */
export const USER_SUBCOLLECTIONS = [
  "cardProgress",
  "reviewEvents",
  "dailyStats",
  "articleDrillProgress",
  "articleDrillErrors",
  "grammarPasteTopics",
  "lesenPasteTopics",
  "aiFeedbackLog",
  "courseProgress",
  "unitChallenges", // Includes nested challenge attempts; no raw answer history.
  "assessmentAttempts", // Submitted truth and embedded immutable evidence; no separate root.
] as const;
// Profile fields include preferences, sound settings, setSessions, Today cache,
// XP, completedSets and achievements. Paste roundReceipts are nested beneath topics.
