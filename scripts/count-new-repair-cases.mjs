#!/usr/bin/env node
/**
 * Debug count only — no listing, no writes.
 *
 * Counts CardProgress rows where `totalReviews > 0` but `dueAt` is null:
 * cards that HAVE been reviewed at least once, yet would have been
 * mislabeled "new" by the old `bandOf`-derived "fresh" count (which the
 * canonical `isNew` in src/lib/srs/queue.ts no longer does — see that
 * function's doc comment for why this state exists: suspended cards,
 * leech-resets, any progress-repair path that clears `dueAt` without
 * resetting `totalReviews`).
 *
 * This script exists only to size how common that repair path is, so the
 * fix in this PR can be weighed against real data. It prints one number.
 *
 *   node scripts/count-new-repair-cases.mjs
 *
 * Needs FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in the environment.
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = "vocabappmm";

if (!privateKey || !clientEmail) {
  console.error("❌ Error: FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL must be set.");
  process.exit(1);
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

async function run() {
  // cardProgress is a subcollection under users/{userId}/cardProgress, not a
  // top-level collection — collectionGroup scans it across every user.
  const snapshot = await db.collectionGroup("cardProgress").get();
  let total = 0;
  let matching = 0;
  snapshot.forEach((doc) => {
    total += 1;
    const data = doc.data();
    if (typeof data.totalReviews === "number" && data.totalReviews > 0 && data.dueAt === null) {
      matching += 1;
    }
  });
  console.log(`cardProgress rows scanned: ${total}`);
  console.log(`totalReviews > 0 && dueAt === null: ${matching}`);
}

run().catch((error) => {
  console.error("❌ Failed:", error);
  process.exit(1);
});
