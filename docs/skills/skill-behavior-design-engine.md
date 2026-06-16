# Skill: Behavior Design Engine

You are a Principal Behavior Design Architect, Habit Systems Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **BEHAVIOR DESIGN ENGINE**, inspired by BJ Fogg's behavior model. Do not copy copyrighted text. Build an original system based on the idea that behavior happens when motivation, ability, and prompt converge.

## Purpose
Help users design behaviors that are easy, well-triggered, identity-aligned, and sustainable. Answer: Why did this behavior not happen? Was motivation too low? Ability too low? Prompt missing? How can it become easier? What tiny version can start today?

## Core model
Behavior happens when Motivation + Ability + Prompt converge at the same moment. Failure usually comes from: motivation too low, behavior too hard, prompt missing, context mismatch, identity misalignment, emotional resistance.

## Domain model (`src/domains/behavior-design/`)
Entities: BehaviorDesign, BehaviorTarget, TinyBehavior, BehaviorPrompt, AbilityAssessment, MotivationAssessment, BehaviorFriction, BehaviorExperiment, BehaviorScoreSnapshot.

**BehaviorTarget**: id, userId, name, desiredBehavior, identityLink, context, frequency, currentSuccessRate, createdAt, updatedAt.
**TinyBehavior**: id, behaviorTargetId, tinyVersion, minimumAction, estimatedDifficulty, trigger, celebration, createdAt, updatedAt.
**BehaviorPrompt**: id, behaviorTargetId, promptType (time | location | existing_routine | emotional | social | digital), promptDescription, reliabilityScore, createdAt, updatedAt.

## Behavior diagnosis
For each failed behavior diagnose: motivation level, ability level, prompt quality, friction, identity alignment, environment support, emotional resistance → Behavior Failure Report.

## Tiny behavior engine
Big "Read 1h daily" → Tiny "Read one paragraph after morning coffee." Big "Exercise daily" → Tiny "Two pushups after brushing teeth." Big "Write a paper" → Tiny "Write one sentence after opening laptop."

## Scoring (0–100)
BehaviorDesignScore, MotivationFitScore, AbilityFitScore, PromptReliabilityScore, FrictionScore, TinyBehaviorAdoptionScore.

`BehaviorDesignScore = (MotivationFit × AbilityFit × PromptReliability × IdentityAlignment) ÷ Friction`.

## AI agents
BehaviorDesigner, TinyBehaviorGenerator, PromptArchitect, FrictionAnalyzer, BehaviorExperimentCoach.

## API routes
POST/GET `/api/behavior-design` · POST `/create` · POST `/diagnose` · POST `/tiny` · POST `/prompt` · POST `/experiment` · GET `/dashboard`.

## Frontend
Pages: `/behavior-design`, `/create`, `/tiny`, `/diagnosis`, `/dashboard`. Components: BehaviorTargetForm, TinyBehaviorCard, PromptBuilder, FrictionReport, BehaviorExperimentBoard, BehaviorDesignScoreCard.

## User flow
1. Create desired behavior. 2. Diagnose motivation/ability/prompt. 3. Create tiny behavior. 4. Design prompt. 5. Test 7 days. 6. Analyze success rate. 7. Adjust design.

## Integration
Habit Engine, Identity Engine, Intrinsic Motivation Engine, Growth Mindset Engine, Deep Work Engine.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Diagnosis service → 4. Tiny behavior generator → 5. Scoring → 6. Agents → 7. API routes → 8. UI → 9. Habit Engine integration.
