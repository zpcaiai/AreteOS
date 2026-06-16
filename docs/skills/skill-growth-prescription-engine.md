# Skill: Growth Prescription Engine

You are a Principal Growth Systems Architect, AI Intervention Designer, Human Development Coach Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **GROWTH PRESCRIPTION ENGINE**. Tagline: *turn diagnosis into a precise growth intervention.*

## Purpose
Receive a bottleneck diagnosis and generate a concrete prescription — not generic advice. A prescription is targeted, time-bounded, identity-aligned, measurable, behaviorally designed, integrated with existing engines, and reviewed after execution.

## Core principle
Diagnosis without prescription creates awareness but not change. Prescription translates: Bottleneck → Intervention → Practice → Review → Update.

## Prescription types
1. Mission Clarification 2. Identity Alignment 3. Belief Reframe 4. Motivation Redesign 5. Energy Recovery 6. Focus Restoration 7. Skill Practice 8. Deep Work 9. Decision Quality 10. Environment Redesign 11. Behavior Design 12. Shadow Intervention 13. Leverage Upgrade 14. Asset Creation 15. Relationship Support 16. Antifragile Upgrade.

## Domain model (`src/domains/growth-prescription/`: types, events, repository, service, score, templates)
Entities: GrowthPrescription, PrescriptionStep, PrescriptionProtocol, PrescriptionSchedule, PrescriptionReview, PrescriptionOutcome, PrescriptionTemplate, PrescriptionScoreSnapshot.

**GrowthPrescription**: id, userId, diagnosisId, title, bottleneckType, prescriptionType, rationale, expectedOutcome, durationDays, difficulty, status, …
**PrescriptionStep**: id, prescriptionId, order, title, description, actionType, linkedEngine, estimatedMinutes, frequency, completed, …
**PrescriptionReview**: id, prescriptionId, completedSteps, outcome, whatWorked, whatFailed, nextAdjustment, …

## Prescription structure
Every prescription contains: 1. Diagnosis Summary 2. Target Bottleneck 3. Why This Matters 4. 7-Day Action Plan 5. 30-Day Practice Plan 6. Metrics 7. Review Questions 8. Linked Mission OS Modules 9. Failure Mode Warning 10. Adjustment Rules.

## Example prescription
Input — Primary Bottleneck: Asset Bottleneck (user consumes extensively but creates no durable output). Output — *30-Day Knowledge Asset Creation Prescription*: Week 1 identify a domain + outline; Week 2 two deep-work blocks + first draft; Week 3 publish v1 + collect feedback; Week 4 revise into reusable asset. Metrics: deep-work sessions, asset created, feedback received, identity proof generated.

## Prescription templates
One per bottleneck type, each defining: objective, required modules, daily actions, weekly actions, review questions, success metrics, failure modes, adjustment logic.

## Scoring (0–100)
PrescriptionFitScore, ExecutionClarityScore, CompletionScore, OutcomeImpactScore, BehaviorChangeScore, IdentityReinforcementScore, GlobalPrescriptionScore.

`GlobalPrescriptionScore = PrescriptionFit × ExecutionClarity × Completion × OutcomeImpact × IdentityReinforcement`.

## AI agents
PrescriptionGenerator, PrescriptionPersonalizer, PrescriptionScheduler, PrescriptionReviewCoach, PrescriptionAdjuster, InterventionSelector. Each: system prompt, input/output schema, examples, TS interface, failure handling.

## API routes
POST `/api/prescriptions/generate` · GET `/prescriptions` · GET `/:id` · POST `/:id/step` · POST `/:id/review` · POST `/:id/adjust` · GET `/dashboard`.

## Frontend
Pages: `/prescriptions`, `/generate`, `/[id]`, `/review`, `/dashboard`. Components: PrescriptionCard, PrescriptionStepList, PrescriptionScheduleView, PrescriptionMetricsPanel, PrescriptionReviewForm, PrescriptionAdjustmentPanel, PrescriptionDashboard.

## User flow
1. Diagnosis created. 2. "Generate Prescription". 3. Select template. 4. AI personalizes. 5. 7-day + 30-day plan. 6. Complete steps. 7. Review. 8. Adjust or complete. 9. Outcome updates Growth Protocol.

## Integration
Bottleneck Diagnosis, Growth Protocol, Identity, Habit, Deep Work, Deliberate Practice, Reflection, Asset-Based Growth, Personal OS Compiler.

## Implementation order
1. Domain types → 2. Prisma schema → 3. Templates → 4. Service → 5. Scoring → 6. Agents → 7. API routes → 8. UI → 9. Dashboard → 10. Integration with Bottleneck Diagnosis. Before coding, output: prescription taxonomy, template structure, database summary, checklist.
