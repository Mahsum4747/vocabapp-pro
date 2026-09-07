#!/usr/bin/env node
/**
 * One-off migration: lift the example sentence out of `definition` into the
 * card's own `example` field.
 *
 * Cards generated before the `example` field existed store two lines in
 * `definition`: the meaning, then a quoted example sentence. This walks every
 * study set, moves that quoted last line into `example`, and leaves the
 * meaning behind as the definition.
 *
 * DRY RUN BY DEFAULT — it only reports. Pass `--apply` to actually write.
 *
 *   node scripts/migrate-card-examples.mjs            # report only
 *   node scripts/migrate-card-examples.mjs --apply    # write the changes
 *
 * Needs FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in the environment
 * (same credentials the server uses).
 *
 * `updatedAt` is deliberately left alone: this is a storage-shape fix, not a
 * content edit, and bumping it would reshuffle every "recently updated" list.
 */
import { pathToFileURL } from "node:url";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "vocabappmm";
const SAMPLE_COUNT = 5;

/**
 * Quote pairs an example sentence might be wrapped in. Straight quotes first;
 * the AI prompt asked for `"..."`, but hand-edited cards drift into typographic
 * ones.
 */
const QUOTE_PAIRS = [
  ['"', '"'],
  ["“", "”"], // “ ”
  ["«", "»"], // « »
  ["‘", "’"], // ‘ ’
];

function unquote(line) {
  for (const [open, close] of QUOTE_PAIRS) {
    if (
      line.length >= open.length + close.length + 1 &&
      line.startsWith(open) &&
      line.endsWith(close)
    ) {
      return line.slice(open.length, line.length - close.length).trim();
    }
  }
  return null;
}

/**
 * Split a legacy `definition` into `{ definition, example }`, or return null
 * when there's nothing to migrate. Conservative on purpose: it only fires when
 * the last line is quoted AND at least one line of meaning survives, so a
 * definition is never emptied out.
 */
export function splitLegacyDefinition(definition) {
  if (typeof definition !== "string") return null;
  const lines = definition
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return null;

  const example = unquote(lines[lines.length - 1]);
  if (!example) return null;

  const rest = lines.slice(0, -1).join("\n").trim();
  if (!rest) return null;

  return { definition: rest, example };
}

/** The migrated version of one card, or null when it needs no change. */
export function migrateCard(card) {
  // Never clobber an example that's already there.
  if (typeof card.example === "string" && card.example.trim()) return null;
  const split = splitLegacyDefinition(card.definition);
  if (!split) return null;
  return { ...card, definition: split.definition, example: split.example };
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
  const samples = [];
  const pending = []; // { ref, cards, changed }
  let totalCards = 0;
  let changedCards = 0;

  for (const doc of snap.docs) {
    const cards = doc.data()?.cards;
    if (!Array.isArray(cards)) continue;
    totalCards += cards.length;

    let changedHere = 0;
    const nextCards = cards.map((card) => {
      const migrated = migrateCard(card);
      if (!migrated) return card;
      changedHere += 1;
      if (samples.length < SAMPLE_COUNT) {
        samples.push({
          set: doc.data()?.title ?? doc.id,
          before: { definition: card.definition, example: card.example ?? null },
          after: { definition: migrated.definition, example: migrated.example },
        });
      }
      return migrated;
    });

    if (changedHere > 0) {
      changedCards += changedHere;
      pending.push({ ref: doc.ref, cards: nextCards, changed: changedHere });
    }
  }

  console.log(`\nMode:            ${apply ? "APPLY (writing)" : "DRY RUN (no writes)"}`);
  console.log(`Sets scanned:    ${snap.size}`);
  console.log(`Cards scanned:   ${totalCards}`);
  console.log(`Sets affected:   ${pending.length}`);
  console.log(`Cards to change: ${changedCards}`);

  if (samples.length > 0) {
    console.log(`\n--- ${samples.length} sample transformation(s) ---`);
    for (const [i, s] of samples.entries()) {
      console.log(`\n[${i + 1}] set: ${s.set}`);
      console.log(`  BEFORE definition: ${JSON.stringify(s.before.definition)}`);
      console.log(`  BEFORE example:    ${JSON.stringify(s.before.example)}`);
      console.log(`  AFTER  definition: ${JSON.stringify(s.after.definition)}`);
      console.log(`  AFTER  example:    ${JSON.stringify(s.after.example)}`);
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
    for (const { ref, cards } of pending.slice(i, i + 400)) {
      batch.update(ref, { cards });
    }
    await batch.commit();
  }
  console.log(`\nWrote ${pending.length} set(s), ${changedCards} card(s) migrated.\n`);
}

// Only connect when run directly — the unit test imports the pure helpers above.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
