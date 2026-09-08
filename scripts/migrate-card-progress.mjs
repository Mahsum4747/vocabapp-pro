#!/usr/bin/env node
/**
 * One-off migration: create a zeroed `cardProgress` row for every existing
 * card, so the review counters have somewhere to accumulate.
 *
 * These rows hold counters ONLY (totalReviews, correctReviews,
 * consecutiveCorrect, lastReviewedAt). Mastery is not copied here:
 * `Card.mastery` on the set document stays the single authority for the
 * mastery percentage and the Leitner boxes.
 *
 * Strictly speaking this backfill is optional — `recordReview` creates the
 * row on first review with a merge write. It exists so the collection
 * reflects the full card inventory up front.
 *
 * DRY RUN BY DEFAULT — it only reports. Pass `--apply` to actually write.
 *
 *   node scripts/migrate-card-progress.mjs            # report only
 *   node scripts/migrate-card-progress.mjs --apply    # write the changes
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

initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

const db = getFirestore();
const isApply = process.argv.includes("--apply");

async function runMigration() {
  console.log(`🚀 Starting CardProgress migration (Dry-run: ${!isApply})...\n`);

  const setsSnapshot = await db.collection("study_sets").get();
  let totalSets = 0;
  let totalCardsProcessed = 0;
  let skippedExisting = 0;
  const progressDocsToWrite = [];

  // Which cards already have a progress row, per owner. Writing a zeroed row
  // over a card that has since been reviewed would reset real counters, and
  // this script has to stay safe to re-run.
  const existingByOwner = new Map();
  async function existingFor(ownerId) {
    let existing = existingByOwner.get(ownerId);
    if (!existing) {
      const snap = await db.collection("users").doc(ownerId).collection("cardProgress").get();
      existing = new Set(snap.docs.map((d) => d.id));
      existingByOwner.set(ownerId, existing);
    }
    return existing;
  }

  for (const doc of setsSnapshot.docs) {
    const data = doc.data();
    const ownerId = data.ownerId;
    const cards = data.cards || [];

    if (!ownerId || !Array.isArray(cards)) continue;
    totalSets++;
    const existing = await existingFor(ownerId);

    for (const card of cards) {
      if (!card.id) continue;
      totalCardsProcessed++;

      if (existing.has(card.id)) {
        skippedExisting++;
        continue;
      }

      // Counters start at zero. There is no review history for these cards —
      // only Card.mastery, which stays where it is and remains the authority
      // for mastery and Leitner boxes. Deriving "12 reviews, all correct"
      // from a mastery level would invent a past that never happened and
      // poison anything later built on these numbers.
      progressDocsToWrite.push({
        userId: ownerId,
        cardId: card.id,
        setId: doc.id,
        totalReviews: 0,
        correctReviews: 0,
        consecutiveCorrect: 0,
        lastReviewedAt: null,
      });
    }
  }

  console.log(`📊 Scanned ${totalSets} sets and ${totalCardsProcessed} cards.`);
  console.log(`⏭️  Skipped ${skippedExisting} card(s) that already have progress.`);
  console.log(`📝 Prepared ${progressDocsToWrite.length} CardProgress records to migrate.`);

  // Show 5 sample records
  console.log("\n--- Sample Migrations (First 5) ---");
  progressDocsToWrite.slice(0, 5).forEach((p, idx) => {
    console.log(
      `[${idx + 1}] User: ${p.userId} | Card: ${p.cardId} | Set: ${p.setId} | ` +
        `reviews: ${p.totalReviews} | correct: ${p.correctReviews} | streak: ${p.consecutiveCorrect}`,
    );
  });
  console.log("------------------------------------\n");

  if (!isApply) {
    console.log("💡 This was a DRY RUN. No changes were written to Firestore.");
    console.log("👉 Run with '--apply' to actually execute the migration.");
    process.exit(0);
  }

  console.log("⚡ Applying changes to Firestore...");
  const batchSize = 400;
  for (let i = 0; i < progressDocsToWrite.length; i += batchSize) {
    const batch = db.batch();
    const chunk = progressDocsToWrite.slice(i, i + batchSize);

    for (const p of chunk) {
      const ref = db.collection("users").doc(p.userId).collection("cardProgress").doc(p.cardId);
      batch.set(ref, p, { merge: true });
    }

    await batch.commit();
    console.log(`✅ Committed batch ${Math.floor(i / batchSize) + 1} (${chunk.length} docs)`);
  }

  console.log("\n🎉 Migration completed successfully!");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
