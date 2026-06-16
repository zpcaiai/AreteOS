# Skill: Intrinsic Motivation Engine

You are a Principal Motivation Systems Designer, Self-Determination Theory Product Architect, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **INTRINSIC MOTIVATION ENGINE**, inspired by Self-Determination Theory (Deci & Ryan). Do not copy copyrighted content. Build an original system based on the idea that intrinsic motivation depends on autonomy, competence, and relatedness.

## Purpose
Help users understand why motivation fails and how to design sustainable motivation. Dimensions: Autonomy, Competence, Relatedness. Answer: Do I feel ownership? Do I feel capable? Do I feel connected? Is this goal internally meaningful or externally pressured?

## Domain model (`src/domains/intrinsic-motivation/`)
Entities: MotivationProfile, MotivationAssessment, AutonomySignal, CompetenceSignal, RelatednessSignal, MotivationBlocker, MotivationDesignPlan, MotivationScoreSnapshot.

**MotivationAssessment**: id, userId, contextType (habit | skill | work | project | relationship | mission), contextId?, autonomyScore, competenceScore, relatednessScore, externalPressureScore, intrinsicMotivationScore, blockers(Json), createdAt, updatedAt.

## Assessment questions
Autonomy: Did I choose this freely? Do I understand why this matters? Do I have meaningful options? Am I acting from values or pressure? Competence: Do I know the next step? Is the challenge appropriate? Am I getting feedback? Do I see progress? Relatedness: Do I feel supported? Does this connect me with people I value? Does this contribution matter? Do I feel seen or isolated?

## Motivation design
Low autonomy → provide choice, reconnect to mission, reduce coercion, clarify meaning. Low competence → reduce difficulty, create small wins, add feedback, create practice plan. Low relatedness → accountability partner, connect to service, join community, share progress.

## Scoring (0–100)
AutonomyScore, CompetenceScore, RelatednessScore, ExternalPressureScore, IntrinsicMotivationScore, MotivationSustainabilityScore.

`IntrinsicMotivationScore = (Autonomy × Competence × Relatedness) ÷ ExternalPressure`.

## AI agents
MotivationAssessor, AutonomyCoach, CompetenceBuilder, RelatednessConnector, MotivationDesigner.

## API routes
POST `/api/motivation/assess` · GET `/profile` · POST `/design` · POST `/blockers/analyze` · GET `/dashboard`.

## Frontend
Pages: `/motivation`, `/assessment`, `/design`, `/dashboard`. Components: MotivationAssessmentForm, AutonomyCard, CompetenceCard, RelatednessCard, MotivationBlockerList, MotivationDesignPlanViewer, MotivationTrendChart.

## User flow
1. Select goal/habit/project/skill. 2. Assess autonomy, competence, relatedness. 3. Identify blocker. 4. Generate redesign plan. 5. Apply changes. 6. Track sustainability.

## Integration
Habit Engine, Mission Engine, Identity Engine, Deliberate Practice Engine, Child Development OS, Management OS.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Score functions → 4. Assessment UI → 5. Agents → 6. API routes → 7. Dashboard integration.
