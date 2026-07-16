# Neon migrations

Production Neon is migrated automatically after every push to `main`.

The GitHub Actions `Deploy migrations to Neon` job waits for type checks, unit
tests, a clean-database build, clinical gates, dependency audit, and production
E2E to pass. It then runs:

```bash
prisma migrate deploy
prisma migrate status
```

against the production database. Pull requests cannot run this job and never
receive the production secret.

## One-time GitHub setup

1. In the Neon console, copy the **direct** connection string (hostname must not
   contain `-pooler`). Prisma Migrate requires a direct connection.
2. In GitHub, use the existing `Production` Environment and add an environment secret
   named `NEON_DIRECT_URL`.
3. Protect the `Production` Environment with required reviewers if your release
   policy requires manual approval.
4. Keep the pooled Neon URL in the application host as `DATABASE_URL`; never put
   either URL in source control.

The workflow serializes `main` pushes and does not cancel a migration in
progress. A missing or pooled `NEON_DIRECT_URL` fails closed before touching the
database. Production is never seeded automatically.

Vercel remains a second fail-safe. The `vercel-build` script runs:

```
prisma generate && prisma migrate deploy && next build
```

so a Vercel Git deployment cannot publish application code against a missing
schema even if its deployment races the GitHub release gate. `migrate deploy`
only applies pending migrations, so the second invocation is a no-op after a
successful GitHub deployment.

> The build now **fails** if `migrate deploy` fails. Previously it was
> `prisma migrate deploy || echo "…"`, which swallowed the error and let deploys ship
> against an un-migrated database.

## Required once: `migration_lock.toml`

`prisma/migrations/migration_lock.toml` (`provider = "postgresql"`) must exist, or Prisma
reports *"No migration found in prisma/migrations"* and applies nothing. It is now committed.

## One-time legacy production baseline

The original Neon production database was created before Prisma migration
history was enforced. It had business tables but no `_prisma_migrations` table,
and it was missing several later modules. Running `migrate deploy` directly in
that state would try to replay the initial migration over existing tables.

Before the first automated `main` deployment:

1. Generate a read-only Prisma schema diff from production to the current
   datamodel.
2. Apply the alignment SQL to an isolated Neon branch and verify data counts,
   constraints, and a zero Prisma schema diff.
3. Apply the tested alignment to the Neon main branch through the Neon migration
   approval workflow.
4. Mark every migration already represented by that aligned schema as applied
   with `prisma migrate resolve --applied <migration-name>`.
5. Confirm `prisma migrate status` reports the database is up to date.

The GitHub job contains a fail-closed guard: if `users` exists but
`_prisma_migrations` does not, it stops before `migrate deploy` can touch the
database. A genuinely empty database is still allowed to run all migrations.

## Daily flow

```bash
npm run db:migrate        # create a migration locally (docker)
git commit -am "…"
git push                  # main CI gates → Neon migration; Vercel also fails closed
```
