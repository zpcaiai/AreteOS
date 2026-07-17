# Launch readiness closure

This register is the authoritative P0/P1/P2 launch baseline. A checked engineering
control is implemented and tested; an unchecked evidence item requires a real
operator, provider, or qualified reviewer and remains fail-closed in code.

## P0 — customer safety and release integrity

- [x] Production registration is closed by default; invitation mode uses one-time,
  expiring, revocable database invitations and verified transactional email.
- [x] Real AI provider, credentials, recent real-request evidence, non-draft legal
  versions, operator details, retention configuration, database schema and strong
  auth secret are required by `/api/health`.
- [x] Production deploy order is CI/E2E → Neon direct migration → unaliased Vercel
  candidate → candidate verification → promotion → canonical commit smoke.
- [x] Pending clinical, child and payment features remain disabled and fail-closed.
- [ ] Provide real operator/legal text and counsel-approved terms/privacy versions.
- [ ] Fund and verify the production AI Gateway, then set `AI_RUNTIME_VERIFIED_AT`.
- [ ] Configure and exercise Resend before changing registration to invitation mode.

## P1 — industrial operations and security

- [x] Coach and agent cost controls use shared PostgreSQL rate-limit buckets rather
  than process-local memory.
- [x] Privileged, permission-changing, export, reset and deletion actions write a
  privacy-preserving durable security audit; administrators can review it.
- [x] Daily maintenance enforces analytics and audit retention windows and supports
  an explicit opt-in coach-content retention window.
- [x] Hourly production smoke enforces health/page latency SLOs and opens or updates
  a GitHub production incident on failure.
- [x] CodeQL, dependency review, Dependabot, production dependency audit and a
  release SBOM are automated.
- [ ] Complete and attest a real restore drill, incident exercise and access/security
  review; provider evidence must be retained outside this repository.

## P2 — pilot learning and template product loop

- [x] The workspace library contains granular business/scenario templates and never
  requires a blank start.
- [x] Saved workspaces retain template version and revision, support personal/team
  editing, and can be imported/exported as `arete-workspace-v1` JSON.
- [x] Users can submit a version-bound 1–5 rating, outcome and comment after saving;
  events are available for cohort analysis.
- [x] Template and feedback data are included in normal account rights, cascading
  deletion, migration verification and production health schema checks.
- [ ] Run a named 5–10 customer pilot and review activation, feedback and retention
  before widening registration or enabling paid/clinical profiles.
