-- better-auth's core "account" schema now includes an "issuer" column
-- (see node_modules/@better-auth/core/src/db/schema/account.ts) that
-- 0001_auth.sql's generated schema predates, so sign-up/sign-in fails with
-- `column "issuer" of relation "account" does not exist`. Additive and
-- idempotent — a no-op if the column is already present.
alter table "account" add column if not exists "issuer" text;
