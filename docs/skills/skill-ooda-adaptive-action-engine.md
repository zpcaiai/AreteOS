# Skill: OODA Adaptive Action Engine

You are a Principal Adaptive Strategy Architect, OODA Loop Systems Designer, Decision Scientist, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **OODA ADAPTIVE ACTION ENGINE**, inspired by John Boyd's OODA Loop. Do not copy copyrighted text. Build an original system around the cycle Observe → Orient → Decide → Act.

## Purpose
Help users and teams act faster and adapt better under uncertainty. Answer: What is actually happening? How should I interpret it? What options do I have? What action now? What feedback did the action produce? How should I update orientation?

## Core loop
Observe (collect signals) → Orient (interpret using models, context, identity, mission, constraints) → Decide (select action) → Act (execute and observe feedback) → repeat.

## Domain model (`src/domains/ooda/`)
Entities: OODACycle, Observation, Orientation, ActionOption, AdaptiveDecision, ActionExecution, FeedbackSignal, OrientationUpdate, OODAReview, OODAScoreSnapshot.

**OODACycle**: id, userId, title, contextType (personal | business | investment | product | leadership | learning), status (observing | orienting | deciding | acting | reviewing | completed), createdAt, updatedAt.
**Observation**: id, cycleId, signal, source, reliability, urgency, createdAt.
**Orientation**: id, cycleId, interpretation, assumptions(Json), constraints(Json), mentalModels(Json), risks(Json), createdAt.

## OODA workflow
1. Create cycle. 2. Capture observations. 3. Orient with context + models. 4. Generate options. 5. Decide. 6. Execute. 7. Capture feedback. 8. Update orientation. 9. Repeat.

## Use cases
Startup pivots, market changes, investment decisions, product iteration, team conflict, learning strategy, career decisions, crisis response.

## Scoring (0–100)
ObservationQualityScore, OrientationAccuracyScore, DecisionSpeedScore, ActionExecutionScore, FeedbackLearningScore, AdaptationScore.

`AdaptationScore = ObservationQuality × OrientationAccuracy × DecisionSpeed × FeedbackLearning × ActionExecution`.

## AI agents
ObservationCollector, OrientationAnalyst, OptionGenerator, AdaptiveDecisionCoach, FeedbackInterpreter, OODAReviewAgent.

## API routes
POST/GET `/api/ooda/cycle(s)` · POST `/observe` · POST `/orient` · POST `/decide` · POST `/act` · POST `/feedback` · POST `/review` · GET `/dashboard`.

## Frontend
Pages: `/ooda`, `/new`, `/cycle/[id]`, `/dashboard`. Components: OODACycleBoard, ObservationList, OrientationMap, OptionComparison, ActionExecutionPanel, FeedbackSignalList, AdaptationScoreCard.

## User flow
1. Create adaptive challenge. 2. Record observations. 3. Orient. 4. Generate options. 5. Choose action. 6. Record feedback. 7. Update orientation. 8. Repeat cycle.

## Integration
Decision Engine, First Principle Engine, Mental Model Engine, Cognitive Bias Engine, Reflection Engine, Management OS.

## Implementation order
1. Domain model → 2. Prisma schema → 3. OODA service → 4. Agents → 5. API routes → 6. UI board → 7. Dashboard → 8. Decision Engine integration.
