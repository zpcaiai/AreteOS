# Neon migrations

Production Neon is migrated **automatically by Vercel**. The `vercel-build` script runs:

```
prisma generate && prisma migrate deploy && next build
```

so on every deploy, any new migration under `prisma/migrations/` is applied to the Neon
database configured in the Vercel project before the new code goes live. No git hook is used.

> The build now **fails** if `migrate deploy` fails. Previously it was
> `prisma migrate deploy || echo "…"`, which swallowed the error and let deploys ship
> against an un-migrated database.

## Required once: `migration_lock.toml`

`prisma/migrations/migration_lock.toml` (`provider = "postgresql"`) must exist, or Prisma
reports *"No migration found in prisma/migrations"* and applies nothing. It is now committed.

## Clear the P3009 failure on prod Neon (one time, if present)

A failed row `20260618062503_add_healing_os` blocks `migrate deploy`. It's a local attempt
that was deleted and recreated on disk as `20260618130000_add_healing_os`. Until it's cleared,
the migrate step fails on every deploy — and that now fails the whole Vercel build.

Run against prod Neon (export its strings locally, or run in a Vercel shell):

```bash
export DIRECT_URL="<prod Neon direct>" DATABASE_URL="<prod Neon pooled>"
npx prisma migrate status                                                # applied / pending / failed
# if 062503 shows as failed:
npx prisma migrate resolve --rolled-back 20260618062503_add_healing_os
```

Then handle `20260618130000_add_healing_os` based on whether its 16 tables already exist
(the migration uses plain `CREATE TABLE`, so a partial apply can collide):

```bash
npx prisma db execute --url "$DIRECT_URL" --stdin <<< "SELECT to_regclass('public.safety_triage_events');"
```

- **NULL (absent):** the next deploy's `migrate deploy` applies it.
- **All 16 already present** (prior `db push`): `npx prisma migrate resolve --applied 20260618130000_add_healing_os`.
- **Partial:** drop the stray healing tables, then let deploy apply it.

Verify: `npx prisma migrate status` → *"Database schema is up to date!"*

## Daily flow

```bash
npm run db:migrate        # create a migration locally (docker)
git commit -am "…"
git push                  # Vercel-connected branch → Vercel applies it to Neon on deploy
```
