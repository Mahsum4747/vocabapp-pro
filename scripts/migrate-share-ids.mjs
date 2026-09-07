#!/usr/bin/env node
/**
 * One-off migration: give every existing study set a `shareId` (and a
 * `copyCount` of 0 where it's missing).
 *
 * Sets created before share links existed have no `shareId`, so their only
 * addressable id is the Firestore document id. This backfills one short,
 * unguessable id per set, matching what `createSet` now generates.
 *
 * DRY RUN BY DEFAULT — it only reports. Pass `--apply` to actually write.
 *
 *   node scripts/migrate-share-ids.mjs            # report only
 *   node scripts/migrate-share-ids.mjs --apply    # write the changes
 *
 * Needs FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in the environment
 * (same credentials the server uses).
 *
 * `updatedAt` is deliberately left alone: this backfills an internal
 * identifier, and bumping it would reshuffle every "recently updated" list.
 */
import { pathToFileURL } from "node:url";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "vocabappmm";
const SAMPLE_COUNT = 5;

// Kept in sync with `shareIdServer` in src/lib/study-sets.ts: 64 URL-safe
// characters, a power of two, so `byte % length` is unbiased.
const SHARE_ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const SHARE_ID_LENGTH = 10;

export function makeShareId(randomBytes = crypto.getRandomValues(new Uint8Array(SHARE_ID_LENGTH))) {
  let out = "";
  for (const byte of randomBytes) out += SHARE_ID_ALPHABET[byte % SHARE_ID_ALPHABET.length];
  return out;
}

/** True when the set still needs a share id. */
export function needsShareId(data) {
  return typeof data?.shareId !== "string" || data.shareId.trim() === "";
}

function connect() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) {
    console.error(
      "FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY are not set — cannot reach Firestore.",
    );
    process.exit(1);
  }
  initializeApp({ credential: cert({ projectId: PROJECT_ID, clientEmail, privateKey }) });
  return getFirestore();
}

async function main() {
  const apply = process.argv.includes("--apply");
  const db = connect();

  const snap = await db.collection("study_sets").get();

  // Every id already in use, so a generated one can't collide with an
  // existing set (astronomically unlikely at 60 bits, but free to rule out).
  const taken = new Set();
  for (const doc of snap.docs) {
    const existing = doc.data()?.shareId;
    if (typeof existing === "string" && existing) taken.add(existing);
  }

  const pending = [];
  const samples = [];
  let missingCopyCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data() ?? {};
    const patch = {};

    if (needsShareId(data)) {
      let shareId = makeShareId();
      while (taken.has(shareId)) shareId = makeShareId();
      taken.add(shareId);
      patch.shareId = shareId;
    }
    if (typeof data.copyCount !== "number") {
      patch.copyCount = 0;
      missingCopyCount += 1;
    }
    if (Object.keys(patch).length === 0) continue;

    pending.push({ ref: doc.ref, patch });
    if (samples.length < SAMPLE_COUNT) {
      samples.push({ title: data.title ?? doc.id, docId: doc.id, patch });
    }
  }

  console.log(`\nMode:             ${apply ? "APPLY (writing)" : "DRY RUN (no writes)"}`);
  console.log(`Sets scanned:     ${snap.size}`);
  console.log(`Sets to change:   ${pending.length}`);
  console.log(`  ...needing shareId:   ${pending.filter((p) => p.patch.shareId).length}`);
  console.log(`  ...needing copyCount: ${missingCopyCount}`);

  if (samples.length > 0) {
    console.log(`\n--- ${samples.length} sample change(s) ---`);
    for (const [i, s] of samples.entries()) {
      console.log(`\n[${i + 1}] ${s.title}  (doc ${s.docId})`);
      console.log(`  patch: ${JSON.stringify(s.patch)}`);
      if (s.patch.shareId) console.log(`  link:  /sets/${s.patch.shareId}`);
    }
  }

  if (!apply) {
    console.log("\nDry run — nothing was written. Re-run with --apply to commit these changes.\n");
    return;
  }
  if (pending.length === 0) {
    console.log("\nNothing to write.\n");
    return;
  }

  // Firestore caps a batch at 500 writes.
  for (let i = 0; i < pending.length; i += 400) {
    const batch = db.batch();
    for (const { ref, patch } of pending.slice(i, i + 400)) {
      batch.update(ref, patch);
    }
    await batch.commit();
  }
  console.log(`\nWrote ${pending.length} set(s).\n`);
}

// Only connect when run directly — the unit test imports the pure helpers above.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
