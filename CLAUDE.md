# Karta / vocabapp-pro

TanStack Start + React + Vite + Nitro. Production target: Vercel. Source and tests take precedence over historical agent notes.

## Architecture

- Auth: Better Auth and Neon Postgres; email/password UI. Retained preview broker providers are server configuration. Firebase Auth is not used for sign-in.
- Learning data: server-only Firestore Admin, dynamically imported in authenticated server handlers. No direct browser Firestore access. Cards are embedded in `study_sets`, not a separate collection.
- Store: Zustand (`src/lib/store.ts`), calling server functions. Grammar, reading, Paste and writing have their own server modules.
- Storage upload remains disabled by `IMAGE_UPLOAD_ENABLED`.

## Contracts

- Card identity is immutable and opaque. Editors carry IDs explicitly; term changes and duplicate terms retain independent identities. Copies/public copies get new UUIDs. Moves preserve IDs, vocabulary progress and article/case counters; progress `setId` follows the move. Never match edits by normalized term.
- Removed cards lose current progress/drill/session references. Append-only historical review/error events remain until account deletion.
- German enrichment applies only when `resolveSetLanguages(set).term === 'de'`. Preserve omitted examples, note, image and user enrichment on edits.
- Review validation checks set access and actual card membership inside its transaction.
- Grammar accuracy means question-weighted accuracy over the last 20 completed rounds. Store `recentRounds: {correct,total}[]`; never synthesize an order of answers from totals.
- Grammar/Lesen/Paste updates are transactional. Paste save identity is allocated once before saving; sessions open after save succeeds. Retry uses the same topic ID. Paste round receipt IDs make progress retries idempotent.
- Paste remains separate from the fixed grammar curriculum and bundled Lesen completion map.
- Account deletion follows `user-data-inventory.ts`, deletes owned sets and recursively all user roots. SQL identity deletion remains the separate authenticated endpoint.
- SRS parameters/semantics are unchanged. A future LearningSignals view must derive from existing sources, not create another stored truth.

## Reproducible validation

Node 24.20.0 (`.node-version`/`.nvmrc`), npm 11.19.0. Install with `npm ci --ignore-scripts` from the committed lockfile. Versions are not bumped by hardening.

- `npm run typecheck`
- `npm test` — script tests and automatically discovered `src/**/*.test.ts`; loader supports aliases and TSX.
- `npm run build:compile` — production compilation with backend credentials blanked; no migrations.
- `npm run test:e2e` — hermetic desktop/mobile Playwright; never real Firestore.
- `npm run build` includes `db:migrate`: do not use against a configured production database for local validation.

The old accepted baseline of 5 type errors / 13 script failures is obsolete. Full outcomes and schema reset guidance: `PREPROD_HARDENING.md`. The original dated audit remains in `CODEX_HANDOFF.md`, with a current hardening update.

## Safety and bundling

- Never stage `.env.local` or expose keys/tokens/private content in logs. Diagnostics use fixed operation names and safe error categories.
- Never change production environment values or run live reset/migration/deployment without explicit authorization.
- `scripts/reset-karta-test-data.mjs` defaults to dry-run and requires an exact project/user confirmation to delete test data. It is never run automatically.
- Keep Nitro `traceDeps: ["firebase-admin*"]`; plain externalization omits required runtime files.
- Keep Better Auth client imports lazy in shared UI; eager imports have broken SSR chunk splitting.
- Keep PreviewHostBridge and platform branding/PWA contracts.
- Hardening changes require review before merging; do not merge or push main automatically.
