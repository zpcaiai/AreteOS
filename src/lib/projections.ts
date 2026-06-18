// DB read-model projections for the event-sourced engines. Uses RAW SQL (no
// generated-client dependency) so it compiles + runs without `prisma generate`,
// and degrades gracefully if the `engine_projections` table hasn't been migrated
// yet (callers wrap in try/catch). Once the migration is applied, the heavy
// per-request recompute is replaced by a cheap upserted projection.

import { prisma } from "./db";

interface ProjRow { payload: unknown; updated_at: Date | string }

// Self-heal: create the cache table on first use so projections work on any
// Postgres (pooled DATABASE_URL) without depending on DIRECT_URL / migrations.
// Runs at most once per server instance.
let tableEnsured = false;
async function ensureTable(): Promise<void> {
  if (tableEnsured) return;
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS engine_projections (
      user_id    text        NOT NULL,
      kind       text        NOT NULL,
      payload    jsonb       NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, kind)
    )`;
  tableEnsured = true;
}

/** Read a projection if it exists and is fresher than maxAgeMs; else null. */
export async function readProjection<T>(userId: string, kind: string, maxAgeMs: number): Promise<T | null> {
  await ensureTable();
  const rows = await prisma.$queryRaw<ProjRow[]>`
    SELECT payload, updated_at FROM engine_projections WHERE user_id = ${userId} AND kind = ${kind} LIMIT 1`;
  const row = rows[0];
  if (!row) return null;
  if (Date.now() - new Date(row.updated_at).getTime() > maxAgeMs) return null;
  return row.payload as T;
}

/** Upsert a projection (last-writer-wins, updated_at = now). */
export async function writeProjection(userId: string, kind: string, payload: unknown): Promise<void> {
  await ensureTable();
  await prisma.$executeRaw`
    INSERT INTO engine_projections (user_id, kind, payload, updated_at)
    VALUES (${userId}, ${kind}, ${JSON.stringify(payload)}::jsonb, now())
    ON CONFLICT (user_id, kind) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`;
}

/** Invalidate a projection (call after a write that should refresh it). */
export async function clearProjection(userId: string, kind: string): Promise<void> {
  await prisma.$executeRaw`DELETE FROM engine_projections WHERE user_id = ${userId} AND kind = ${kind}`;
}
