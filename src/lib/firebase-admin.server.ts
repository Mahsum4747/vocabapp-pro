import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const PROJECT_ID = "vocabappmm";

function getAdminApp() {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY not set — cannot initialize Firebase Admin SDK.",
    );
  }

  return initializeApp({
    credential: cert({ projectId: PROJECT_ID, clientEmail, privateKey }),
  });
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}

/**
 * The default Storage bucket. Override with FIREBASE_STORAGE_BUCKET if the
 * project's bucket doesn't follow the `<projectId>.appspot.com` convention
 * (newer Firebase projects use `<projectId>.firebasestorage.app` instead).
 */
export function getAdminStorage() {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET || `${PROJECT_ID}.appspot.com`;
  return getStorage(getAdminApp()).bucket(bucketName);
}