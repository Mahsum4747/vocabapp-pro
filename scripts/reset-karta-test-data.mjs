#!/usr/bin/env node
import { userDocumentPaths } from "../src/lib/user-data-inventory.ts";
/** Explicit operator action only; never loaded by build/startup. */
export function resetOptions(args) {
  const value = (name) => args[args.indexOf(name) + 1];
  const userId = args.includes("--uid") ? value("--uid") : "";
  const projectId = args.includes("--project") ? value("--project") : "";
  if (!userId || !projectId || !/^[a-z][a-z0-9-]*$/.test(projectId))
    throw new Error("Required: --project PROJECT --uid USER_ID");
  const paths = userDocumentPaths(userId);
  const execute = args.includes("--execute");
  if (execute && value("--confirm") !== `${projectId}:${userId}`)
    throw new Error("Execution requires --confirm PROJECT:USER_ID");
  return { projectId, userId, paths, execute };
}
export async function main(args) {
  const options = resetOptions(args);
  const { initializeApp, cert } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey)
    throw new Error(
      "Set Firebase credentials explicitly in the environment. No dotenv files are loaded.",
    );
  const db = getFirestore(
    initializeApp({ credential: cert({ projectId: options.projectId, clientEmail, privateKey }) }),
  );
  const sets = await db.collection("study_sets").where("ownerId", "==", options.userId).get();
  const plan = {
    project: options.projectId,
    user: options.userId,
    mode: options.execute ? "EXECUTE" : "DRY RUN",
    recursiveRoots: options.paths,
    ownedSetIds: sets.docs.map((doc) => doc.id),
    excludes: ["Better Auth identity", "shared AI caches", "ai_usage", "other users"],
  };
  console.log(JSON.stringify(plan, null, 2));
  if (!options.execute) return;
  for (const doc of sets.docs) await db.recursiveDelete(doc.ref);
  for (const path of options.paths) await db.recursiveDelete(db.doc(path));
  console.log("Selected Firestore test data removed. Sign in and create/import sets to reseed.");
}
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main(process.argv.slice(2)).catch(() => {
    console.error("Reset aborted; check explicit options and credentials.");
    process.exitCode = 1;
  });
}
