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
8. `npm run check:release -- --profile=<profile>` passes in the exact production
   environment. External attestations are ISO timestamps and expire automatically.

## Deployment

1. Take a Neon restore point/snapshot according to the current plan and record the current commit SHA.
2. Push the reviewed commit to `main`. GitHub Actions runs all code gates, then applies migrations with the `Production` Environment secret `NEON_DIRECT_URL`. Vercel does not receive the direct database credential and does not run migrations during build.
3. After Neon is current, CI creates an unaliased production-target Vercel candidate. It checks the protected candidate's health and public pages, then promotes that exact deployment. Vercel's Git integration must remain disconnected so it cannot race the migration gate.
4. CI verifies the canonical URL and exact commit after promotion. Manually verify login, email verification, password reset, a personal workspace, a team workspace, and any enabled signed payment flow.
5. Review error rate, p95 latency, database connections, email delivery and payment reconciliation for at least 30 minutes.
6. Roll back application traffic on regression. Database migrations in this repository are forward-only; restore the snapshot only through the database incident procedure.

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

- Daily: payment/order reconciliation, backup status, error budget, failed email review, retention cleanup, and security-audit review.
- Weekly: dependency and secret scanning, stale session/token cleanup, rate-limit bucket cleanup, restore telemetry review.
- Monthly: access review, subprocessor/configuration audit and data-retention deletion job.
- Quarterly: restore drill, incident exercise, threat-model review and clinical safety review.

## Release profiles

- `pilot`: closed or invitation-only registration; payments, clinical and child
  features disabled. Requires a real AI provider, published non-draft legal
  documents, explicit retention windows, and production runtime controls.
- `paid`: adds real legal terms, transactional email, payment/refund evidence,
  real-provider AI evaluation, recovery, incident and security attestations.
- `clinical`: paid requirements plus named clinician sign-off for every promoted
  module and current regional crisis-resource verification.
- `family`: paid requirements plus guardian-consent enforcement and current child
  safeguarding/privacy reviews.
- `enterprise`: paid requirements plus owner/admin/member/viewer RBAC and a current
  access review.

Never change the profile merely to make the gate green. Disable unavailable features
and launch the narrower profile instead.
