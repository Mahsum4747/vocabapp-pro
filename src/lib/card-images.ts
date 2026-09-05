import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth/middleware";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Matches study-sets.ts's uidServer() — avoids relying on crypto.randomUUID()
// being available in every server runtime this app is deployed to.
function uidServer(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Uploads one card image to Firebase Storage and returns its download URL.
 * Client sends a FormData with a single "file" entry — never talks to
 * Firebase directly (same server-only rule as Firestore in study-sets.ts).
 * Re-validates type/size server-side since the client check can be bypassed.
 */
export const uploadCardImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData) => data)
  .handler(async ({ context, data }) => {
    const file = data.get("file");
    if (!(file instanceof File)) {
      throw new Error("No image file provided.");
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      throw new Error("Only JPG, PNG, or WEBP images are allowed.");
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("Image is larger than 10MB.");
    }

    const { getAdminStorage } = await import("./firebase-admin.server");
    const bucket = getAdminStorage();

    const extension = EXTENSION_BY_TYPE[file.type] ?? "jpg";
    const objectPath = `card-images/${context.userId}/${uidServer()}.${extension}`;
    const downloadToken = uidServer();
    const buffer = Buffer.from(await file.arrayBuffer());

    await bucket.file(objectPath).save(buffer, {
      contentType: file.type,
      metadata: {
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      },
    });

    const encodedPath = encodeURIComponent(objectPath);
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`;
    return { url };
  });
