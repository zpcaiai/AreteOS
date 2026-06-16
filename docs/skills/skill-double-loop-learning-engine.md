# Skill: Double-Loop Learning Engine

You are a Principal Organizational Learning Architect, Human Learning Systems Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **DOUBLE LOOP LEARNING ENGINE**, inspired by Chris Argyris' double-loop learning. Do not copy copyrighted text. Build an original system based on the idea that deep learning requires questioning underlying assumptions, not merely correcting actions.

## Purpose
Help users and teams learn deeper. Single-loop: result failed → change action. Double-loop: result failed → examine assumption → revise mental model → change decision rule → change action. Core question: *What assumption created this action?*

## Domain model (`src/domains/double-loop-learning/`)
Entities: LearningEvent, OutcomeGap, ActionCorrection, UnderlyingAssumption, MentalModelRevision, DecisionRuleUpdate, DoubleLoopReview, LearningInsight, LearningScoreSnapshot.

**LearningEvent**: id, userId, title, context, expectedOutcome, actualOutcome, gapDescription, emotionalReaction, createdAt, updatedAt.
**UnderlyingAssumption**: id, learningEventId, assumption, evidenceFor, evidenceAgainst, validityScore, replacementAssumption, createdAt, updatedAt.
**DecisionRuleUpdate**: oldRule, newRule, triggerContext, futureApplication.

## Learning workflow
1. Capture event. 2. Compare expected vs actual. 3. Identify action error. 4. Ask what assumption produced this action. 5. Test assumption. 6. Revise mental model. 7. Update decision rule. 8. Design new experiment. 9. Track future results.

## Question framework
What did I expect? What happened? What action did I take? Why did that action make sense? What assumption was I relying on? Was it true? What evidence contradicts it? What better assumption replaces it? What decision rule should change? What will I do differently?

## Scoring
ReflectionDepthScore, AssumptionDetectionScore, MentalModelRevisionScore, DecisionRuleUpdateScore, BehaviorChangeScore, DoubleLoopLearningScore.

`DoubleLoopLearningScore = ReflectionDepth × AssumptionDetection × MentalModelRevision × DecisionRuleUpdate × BehaviorChange`.

## AI agents
LearningEventAnalyzer, AssumptionExtractor, MentalModelRevisionCoach, DecisionRuleUpdater, ExperimentDesigner, LearningPatternDetector.

## API routes
POST/GET `/api/double-loop/events` · POST `/analyze` · POST `/assumptions` · POST `/revise-model` · POST `/update-rule` · POST `/experiment` · GET `/dashboard`.

## Frontend
Pages: `/double-loop`, `/new`, `/event/[id]`, `/assumptions`, `/decision-rules`, `/dashboard`. Components: LearningEventForm, OutcomeGapViewer, AssumptionMap, MentalModelRevisionPanel, DecisionRuleUpdateCard, ExperimentPlanViewer, LearningTimeline.

## User flow
1. Record failure/surprise/conflict/unexpected result. 2. Identify outcome gap. 3. Extract assumptions. 4. Evaluate validity. 5. Recommend revised mental model. 6. Create new decision rule. 7. Create experiment. 8. Future outcomes update learning score.

## Integration
Reflection Engine, Decision Engine, Management OS, SFM Business Scaling Engine, Cognitive Bias Engine.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Question framework → 4. Services → 5. Agents → 6. API routes → 7. UI pages → 8. Dashboard integration.
