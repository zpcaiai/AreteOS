# Arete production runbook

## Release gate

A customer release is allowed only when all items are green:

1. A fresh PostgreSQL 16 + pgvector database completes `npm run db:migrate:deploy`, `npm run db:seed`, and `npm run build`.
2. `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run check:clinical`, and `npm audit --omit=dev --audit-level=high` pass in CI.
3. `/api/health` returns HTTP 200 in the production environment.
4. Real-provider scenario evaluation passes all blocking scenarios. Mock-provider output is never release evidence.
5. Every clinical module listed in `docs/clinical-review.md` has named expert approval. The automated gate checks structure; it does not replace human review.
6. The privacy policy and terms contain the actual legal entity, address, support/privacy contact, region-specific refund rules, governing law, subprocessors, and data regions.
7. Alipay or WeChat Pay sandbox and production tests prove: correct amount, duplicate notification idempotency, invalid signature rejection, refund/chargeback handling, and reconciliation.

## Deployment

1. Take a Neon restore point/snapshot according to the current plan and record the current commit SHA.
2. Push the reviewed commit to `main`. GitHub Actions runs all release gates, then applies migrations with the `Production` Environment secret `NEON_DIRECT_URL`. Confirm both `Deploy migrations to Neon` steps are green before shifting traffic.
3. Deploy the immutable build. Verify `/api/health`, login, email verification, password reset, a personal workspace, a team workspace, checkout, and signed webhook settlement.
4. Review error rate, p95 latency, database connections, email delivery and payment reconciliation for at least 30 minutes.
5. Roll back application traffic on regression. Database migrations in this repository are forward-only; restore the snapshot only through the database incident procedure.

## Backup and restore

- Enable provider point-in-time recovery and daily encrypted snapshots. Retain daily backups for 35 days and monthly backups for 12 months, adjusted to the signed retention policy.
- Run a restore drill into an isolated project at least quarterly. Apply migrations, run consistency queries, start the app and verify a sampled export before marking the drill successful.
- Never restore production data into developer laptops. Use masked fixtures for testing.

## Incident response

1. Declare severity and an incident owner; preserve timestamps and request IDs.
2. Contain: revoke affected sessions, rotate credentials, disable payment or AI providers, and restrict traffic as appropriate.
3. Preserve audit evidence without copying user content into chat or tickets.
4. Assess affected users, data categories, duration and legal notification deadlines.
5. Communicate status, recover from a verified state, reconcile payments, and write a blameless post-incident review with owned actions.

## Scheduled maintenance

- Daily: payment/order reconciliation, backup status, error budget and failed email review.
- Weekly: dependency and secret scanning, stale session/token cleanup, rate-limit bucket cleanup, restore telemetry review.
- Monthly: access review, subprocessor/configuration audit and data-retention deletion job.
- Quarterly: restore drill, incident exercise, threat-model review and clinical safety review.
