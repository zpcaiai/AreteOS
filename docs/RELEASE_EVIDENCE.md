# Release evidence register

The application now distinguishes code completion from external release evidence.
Run `npm run check:release -- --profile=paid` against production configuration to
see the current blocking items.

## Attestation rules

Attestations are ISO timestamps stored as production secrets. Set one only after the
named exercise has been completed and its evidence has been retained outside the
application repository.

| Variable | Evidence required | Maximum age |
| --- | --- | --- |
| `LEGAL_REVIEW_ATTESTED_AT` | Qualified counsel reviewed the rendered terms/privacy policy for the operating regions | 365 days |
| `AI_RUNTIME_VERIFIED_AT` | A real provider request and the blocking scenario suite completed successfully | 7 days |
| `AI_EVAL_ATTESTED_AT` | Real-provider agent and scenario reports passed, with model/version, commit, latency and cost retained | 30 days |
| `PAYMENT_E2E_ATTESTED_AT` | Sandbox and low-value live payment, duplicate webhook, invalid signature, refund and reconciliation passed | 90 days |
| `RESTORE_DRILL_ATTESTED_AT` | Isolated Neon point-in-time branch restored and `npm run verify:restore` passed | 100 days |
| `INCIDENT_DRILL_ATTESTED_AT` | Incident owner, containment, notification assessment, recovery and postmortem exercise completed | 100 days |
| `SECURITY_REVIEW_ATTESTED_AT` | Threat model, session/auth, authorization, dependency and secret review completed | 180 days |
| `CRISIS_RESOURCES_VERIFIED_AT` | Enabled regions' crisis resources checked by a responsible reviewer | 90 days |
| `CHILD_SAFETY_REVIEWED_AT` | Child safeguarding review completed | 365 days |
| `CHILD_PRIVACY_REVIEWED_AT` | Child privacy and guardian-consent review completed | 365 days |
| `ACCESS_REVIEW_ATTESTED_AT` | Enterprise roles, team membership and administrator access reviewed | 90 days |
| `RETENTION_JOB_VERIFIED_AT` | Scheduled cleanup was run against production-like data and its deletion counts reviewed | 100 days |

## Fail-closed defaults

- Public registration is closed.
- Payments and provider refunds are disabled.
- Pending clinical modules are disabled.
- Child features and guardian consent are disabled.
- The paid, clinical, family and enterprise gates stay red until real evidence is
  supplied. Automated tests never manufacture these approvals.
- Every profile stays red while terms/privacy versions contain `draft`, operator
  details are blank, or retention windows are not explicit.
