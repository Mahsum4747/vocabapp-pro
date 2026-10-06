import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/middleware";
import {
  assessmentRequestSchema,
  attemptRequestSchema,
  submitAssessmentSchema,
} from "./assessment";

export const getLatestUnitCheck = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => assessmentRequestSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { requireCourseAuthentication } = await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    const { readLatestAssessment } = await import("./assessment.server");
    return readLatestAssessment(getAdminFirestore(), context.userId, data);
  });
export const getUnitCheckHistory = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => assessmentRequestSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { requireCourseAuthentication } = await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    const { readAssessmentHistory } = await import("./assessment.server");
    return readAssessmentHistory(getAdminFirestore(), context.userId, data);
  });
export const getUnitCheckAttempt = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => attemptRequestSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { requireCourseAuthentication } = await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    const { readAssessmentAttempt } = await import("./assessment.server");
    return readAssessmentAttempt(getAdminFirestore(), context.userId, data);
  });
export const startUnitCheck = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => attemptRequestSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { requireCourseAuthentication } = await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    const { createAssessmentAttempt } = await import("./assessment.server");
    return createAssessmentAttempt(getAdminFirestore(), context.userId, data);
  });
export const finishUnitCheck = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => submitAssessmentSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { requireCourseAuthentication } = await import("./course-progress.server");
    await requireCourseAuthentication();
    const { getAdminFirestore } = await import("../firebase-admin.server");
    const { submitAssessmentAttempt } = await import("./assessment.server");
    return submitAssessmentAttempt(getAdminFirestore(), context.userId, data);
  });
