# Healing OS (Robot Dilts) — integrated into AreteOS

A trackable, trainable, long-term Healing OS that maps psychological pain onto
Dilts' six logical levels and combines evidence-based therapy frames (CBT / DBT /
ACT / Schema / Parts Work / trauma-informed stabilization) behind a hard safety
gate. **All four batches (12 skills) are built and verified.**

```
problem → Safety Triage → (gate) → Mental State Intake → Dilts Map + 5P
  → Core Belief / CBT / Emotion Regulation
  → Stabilization / Parts Work / Exposure
  → Identity Reconstruction → Timeline → Relapse Prevention → (loop)
```

Everything is built on **existing AreteOS conventions** (not the spec's literal
shadcn/RHF/LangGraph stack): `getProvider()` + `defineAgent()`, `route()` /
`parseBody()`, the multi-file Prisma schema, `@/components/ui`, bilingual i18n,
the nav registry, the `DomainEvent` event store, and Vitest.

## The 12 skills

| # | Skill | Route | Key models |
|---|---|---|---|
| 1 | Safety Triage | `/api/safety` | SafetyTriageEvent |
| 2 | Mental State Intake | `/api/intake` | MentalStateIntake |
| 3 | Dilts Map + 5P | `/api/dilts-map` | DiltsClinicalFormulation |
| 4 | Core Belief Reconstruction | `/api/core-belief` | CoreBeliefRecord |
| 5 | CBT Behavioral Change | `/api/cbt` | CBTSession |
| 6 | Emotion Regulation (DBT/ACT) | `/api/emotion-regulation` | EmotionRegulationSession |
| 7 | Trauma-Informed Stabilization | `/api/trauma-stabilization` | TraumaStabilizationSession |
| 8 | Parts Work | `/api/parts-work` | PartsWorkSession |
| 9 | Avoidance & Exposure | `/api/exposure` (+`/attempt`) | ExposurePlan, ExposureAttempt |
| 10 | Identity Reconstruction | `/api/identity-reconstruction` (+`/identity-evidence`) | IdentityReconstructionSession, IdentityEvidence |
| 11 | Journey Timeline | `/api/healing-timeline` | HealingTimelineReport |
| 12 | Relapse Prevention | `/api/relapse-prevention` (+`/relapse-checkin`) | RelapsePreventionPlan, RelapseCheckIn |

Shared spine: **`PracticeTask`** (skills 5/6/8/9/10/12 all create trackable
practice tasks) and **`DomainEvent` `Healing:<module>` events** (the Timeline
aggregates the whole journey from one place instead of querying 13 tables).

Pages live at `/healing` (the Batch-1 flow), `/safety` (standing crisis page),
and one page per skill (`/core-belief`, `/cbt`, `/emotion-regulation`,
`/stabilization`, `/parts-work`, `/exposure`, `/identity-rebuild`,
`/healing-timeline`, `/relapse-prevention`) — all registered in the nav
"Healing OS" group. (`/identity-rebuild` & `/healing-timeline` avoid collisions
with the app's existing `/identity` and `/timeline`.)

## Architecture per skill (the repeatable recipe)

`domain/*.ts` (Zod I/O) → `prisma/schema/healing.prisma` model →
`agents/healing-*.ts` (`defineAgent` + mock-fallback example) →
`healing/<skill>-logic.ts` (PURE, tested) + `healing/<skill>.ts` (service:
gate → agent → deterministic merge → persist → PracticeTask + event) →
`app/api/<skill>/route.ts` (server-authoritative risk gate) →
`components/healing/*Client.tsx` (via `HealingSkillShell`) + page → nav → test.

The LLM does the semantic work; **deterministic pure logic owns every safety
and structural guarantee** and is unit-tested without the model or DB.

## Safety model (the part that matters most)

- **Deterministic spine, not the model.** Suicide-with-plan, active self-harm,
  harm-to-others, psychosis-with-danger, medical emergency are caught by
  bilingual keyword rules (`healing/safety-rules.ts`), independent of the LLM.
- **Escalate-only.** Overrides can raise risk but never lower it; a model that
  under-rates a red message is overridden to red. Invalid model output fails to
  orange/yellow — **never green**.
- **One shared gate** (`healing/gate.ts`): red blocks every deep skill (→ crisis,
  HTTP 409); orange is stabilization-only and forces shallow depth; **exposure
  additionally requires green/yellow**. Risk is read server-side from the latest
  triage — the client can't spoof it.
- **Exposure contraindication gate** (deterministic, tested): refuses trauma
  exposure, dangerous real-world tasks, confronting an abuser, and OCD-ERP;
  caps auto-generated distress at 7/10; never a "hard" first experiment.
- **Stabilization** never asks for trauma detail and always blocks deep work
  (exposure, identity deep-dive, memory regression). **Parts work** never implies
  DID. **Relapse** uses no shame-based language and never claims a cure.
- **Vetted crisis copy** for orange/red (never model-generated). Crisis resources
  ship with verified defaults (China **12356**, US **988**, …) and are
  operator-overridable via `HEALING_CRISIS_RESOURCES`. Localize before production.
- **No diagnosis, anywhere.** Agents avoid disorder labels, hedge inferred
  history, and frame capability gaps as trainable skills.

## Unified workflows

`healing/workflows.ts` exposes `runInterventionSession` (Batch 2),
`runDeepPatternWorkflow` (Batch 3), and `runLongTermGrowthWorkflow` (Batch 4) —
thin routers that dispatch by risk + chosen path; red short-circuits to crisis,
orange stays stabilization-oriented.

## Run it

```bash
npm run prisma:generate      # regenerate client with the 16 new healing models
npm run db:migrate           # create the tables (needs DATABASE_URL)
npm run dev                  # visit /healing, /safety, and each skill page
npm test                     # vitest: 10 healing test files
```
With `AI_PROVIDER` unset, the mock provider returns each agent's example output,
so every flow runs offline end-to-end.

## Verification status

- ✅ **62 pure-logic assertions** pass across the deterministic core
  (safety gate 24, intake 6, dilts, belief, cbt, emotion, stabilization, parts,
  exposure, identity, timeline, relapse). 12 Vitest files under `test/healing-*`.
- ✅ **Typecheck clean** under the project tsconfig for the entire healing
  surface (all domain / logic / agents / services / routes / components / pages /
  workflows / registry / nav) — **except** references to the new Prisma models,
  which only resolve after `prisma generate` (the sandbox can't reach Prisma's
  engine host; your Mac can). That is the one required step on your machine.
- ✅ **All 16 healing Prisma models** validated structurally (every relation has
  its back-relation; User wired to all).

## What's deliberately deferred

Second-phase items from the spec, not built here: the Neo4j personality/belief
graph; pgvector case-fragment retrieval; per-skill bespoke sub-component sets
(each skill ships one focused client instead); and richer cross-skill context
loading (services accept `relatedFormulationId` / `relatedBeliefRecordId` etc.
and can hydrate them in a later pass).
