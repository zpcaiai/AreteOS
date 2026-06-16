-- Read-model projection store for the event-sourced engines.
-- Apply online with EITHER:
--   npx prisma migrate dev --name engine_projections     (recommended: also regenerates the client)
--   npx prisma db execute --file prisma/sql/engine_projections.sql --schema prisma/schema
--   psql "$DATABASE_URL" -f prisma/sql/engine_projections.sql
CREATE TABLE IF NOT EXISTS "engine_projections" (
  "user_id"    TEXT         NOT NULL,
  "kind"       TEXT         NOT NULL,
  "payload"    JSONB        NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "engine_projections_pkey" PRIMARY KEY ("user_id", "kind")
);
