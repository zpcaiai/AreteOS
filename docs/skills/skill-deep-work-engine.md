# Skill: Deep Work Engine

You are a Principal Knowledge Work Systems Architect, Deep Work Product Designer, AI Agent Architect, and Performance Engineer. Build a production-grade subsystem inside Mission OS: the **DEEP WORK ENGINE**, inspired by Cal Newport's concept of deep work. Do not copy copyrighted text. Build an original system based on the idea that high-value cognitive output requires focused, undistracted, cognitively demanding work.

## Purpose
Help users produce high-value work through structured deep focus. Answer: What work deserves deep focus? When should I do deep work? What distracts me? How much deep work did I actually do? What valuable asset did I produce?

## Core principle
Deep Work is not time spent. Deep Work = Focused attention × Cognitive difficulty × Low distraction × Valuable output.

## Domain model (`src/domains/deep-work/`)
Entities: DeepWorkProfile, DeepWorkSession, DeepWorkBlock, DistractionEvent, FocusEnvironment, DeepWorkGoal, CognitiveOutput, DeepWorkRitual, DeepWorkScoreSnapshot.

**DeepWorkSession**: id, userId, title, goal, outputType (writing | coding | research | design | strategy | learning | building), startTime, endTime, durationMinutes, distractionCount, focusDepth, cognitiveDifficulty, outputQuality, assetCreated, notes, createdAt, updatedAt.

## Deep work modes
1. Monastic (long isolation blocks). 2. Bimodal (dedicated deep days/half-days). 3. Rhythmic (daily scheduled). 4. Journalistic (flexible whenever possible). User selects a mode.

## Deep work ritual
Each block requires: location, time, duration, target output, allowed tools, forbidden distractions, starting ritual, shutdown ritual.

## Distraction engine
Track: phone, social media, email, messaging, meetings, noise, internal anxiety, unclear goal, multitasking, fatigue → Distraction Pattern Report.

## Output engine
Deep work must produce assets: article, code, research note, design, strategy memo, product feature, paper draft, course, framework, decision report → track CognitiveOutput.

## Scoring (0–100)
DeepWorkConsistencyScore, FocusDepthScore, DistractionControlScore, CognitiveDifficultyScore, OutputValueScore, GlobalDeepWorkScore.

`GlobalDeepWorkScore = (Consistency × FocusDepth × CognitiveDifficulty × OutputValue) ÷ Distraction`.

## AI agents
DeepWorkPlanner, FocusEnvironmentCoach, DistractionAnalyzer, OutputQualityReviewer, DeepWorkRitualDesigner, DeepWorkReviewCoach.

## API routes
POST/GET `/api/deep-work/profile` · POST `/session/start` · POST `/session/end` · GET `/sessions` · POST `/distraction` · POST `/ritual` · GET `/dashboard`.

## Frontend
Pages: `/deep-work`, `/session`, `/history`, `/rituals`, `/distractions`, `/dashboard`. Components: DeepWorkSessionPlanner, DeepWorkTimer, DistractionLogger, FocusDepthScoreCard, OutputTracker, DeepWorkCalendar, DeepWorkRitualViewer, DistractionPatternChart.

## User flow
1. Create profile. 2. Select mode. 3. Design ritual. 4. Schedule session. 5. Start timer. 6. Log distractions. 7. End session. 8. Record output. 9. Calculate score. 10. Recommend next improvement.

## Integration
Specific Knowledge identifies what to build → Deep Work creates the asset → Deliberate Practice improves the skill → Flow Engine improves session quality. Also Mastery Engine, Naval Asset Engine, Knowledge Worker Engine.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Session timer → 4. Scoring functions → 5. Agents → 6. API routes → 7. UI pages → 8. Dashboard → 9. Integration with Specific Knowledge and Flow.
