import { createFsrsScheduler } from "./fsrs.ts";
import type { Scheduler } from "./scheduler.ts";

/**
 * The scheduler the app runs on. Swapping strategies — a retuned weight
 * vector, or the upstream `ts-fsrs` package behind the same interface — is a
 * change to this one binding; every caller depends on `Scheduler`, not on FSRS.
 */
export const defaultScheduler: Scheduler = createFsrsScheduler();

export { createFsrsScheduler, DEFAULT_WEIGHTS, retrievability } from "./fsrs.ts";
export type { FsrsOptions, FsrsWeights } from "./fsrs.ts";
export { leitnerBoxOfScore, masteryScoreOf, MASTERY_TARGET_STABILITY_DAYS } from "./mastery.ts";
export { buildReviewQueue, queuedCards, DEFAULT_QUEUE_WEIGHTS } from "./queue.ts";
export type { QueueEntry, QueueOptions, QueueWeights } from "./queue.ts";
export type { LearningState, ReviewInput, Scheduler, SchedulerState } from "./scheduler.ts";
