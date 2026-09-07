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

// Mapping function: 0-5 to 0-100
function mapMasteryToScore(mastery) {
  const m = typeof mastery === "number" ? mastery : 0;
  switch (Math.min(5, Math.max(0, m))) {
    case 1: return 20;
    case 2: return 40;
    case 3: return 60;
    case 4: return 80;
    case 5: return 100;
    default: return 0;
  }
}

async function runMigration() {
  console.log(`🚀 Starting CardProgress migration (Dry-run: ${!isApply})...\n`);

  const setsSnapshot = await db.collection("study_sets").get();
  let totalSets = 0;
  let totalCardsProcessed = 0;
  let progressDocsToWrite = [];

  for (const doc of setsSnapshot.docs) {
    const data = doc.data();
    const ownerId = data.ownerId;
    const cards = data.cards || [];

    if (!ownerId || !Array.isArray(cards)) continue;
    totalSets++;

    for (const card of cards) {
      if (!card.id) continue;
      totalCardsProcessed++;

      const masteryScore = mapMasteryToScore(card.mastery);
      const state = masteryScore === 100 ? "mastered" : masteryScore > 0 ? "learning" : "new";

      progressDocsToWrite.push({
        userId: ownerId,
        cardId: card.id,
        setId: doc.id,
        state,
        masteryScore,
        totalReviews: card.mastery ? card.mastery * 2 : 0,
        correctReviews: card.mastery ? card.mastery * 2 : 0,
        consecutiveCorrect: card.mastery || 0,
        lastReviewedAt: null,
        nextReviewAt: null,
      });
    }
  }

  console.log(`📊 Scanned ${totalSets} sets and ${totalCardsProcessed} cards.`);
  console.log(`📝 Prepared ${progressDocsToWrite.length} CardProgress records to migrate.`);

  // Show 5 sample records
  console.log("\n--- Sample Migrations (First 5) ---");
  progressDocsToWrite.slice(0, 5).forEach((p, idx) => {
    console.log(`[${idx + 1}] User: ${p.userId} | Card: ${p.cardId} | Score: ${p.masteryScore}% | State: ${p.state}`);
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