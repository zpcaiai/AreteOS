# Skill: Flow State Engine

You are a Principal Performance Systems Architect, Flow Research Product Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **FLOW STATE ENGINE**, inspired by Mihaly Csikszentmihalyi's flow theory. Do not copy copyrighted text. Build an original system based on general flow principles: clear goals, immediate feedback, challenge-skill balance, deep focus, and intrinsic engagement.

## Purpose
Help users design work, learning, and creative sessions that maximize deep engagement and high-quality output. Answer: When do I enter flow? What destroys it? Which tasks match my skill level? How can I design better focus sessions? How can I increase deep creative output?

## Core flow conditions (tracked)
1. Clear Goal 2. Challenge-Skill Balance 3. Immediate Feedback 4. Deep Focus 5. Low Distraction 6. Sense of Control 7. Intrinsic Interest 8. Time Distortion 9. Effortless Attention 10. Meaningful Task.

## Domain model (`src/domains/flow-state/`)
Entities: FlowProfile, FlowSession, FlowTrigger, FlowBlocker, ChallengeSkillAssessment, FocusEnvironment, FlowActivity, FlowScoreSnapshot.

**FlowSession**: id, userId, activity, startTime, endTime, durationMinutes, challengeLevel, skillLevel, distractionLevel, clarityLevel, feedbackLevel, interestLevel, energyBefore, energyAfter, flowDepthScore, notes, createdAt, updatedAt.

## Flow session workflow
Before: choose activity, define goal, estimate challenge, estimate skill, remove distractions, define feedback signal. During: timer, optional notes, distraction logging. After: flow score, blockers, energy shift, output quality, next adjustment.

## Challenge-skill matrix
Low challenge + low skill = apathy · Low challenge + high skill = boredom · High challenge + low skill = anxiety · High challenge + high skill = flow. Output: Flow Zone Recommendation.

## Scoring
FlowReadinessScore, FlowDepthScore, DistractionRiskScore, ChallengeSkillFitScore, FocusEnvironmentScore, GlobalFlowScore.

`FlowDepthScore = (ClearGoal × ChallengeSkillFit × Feedback × Focus × IntrinsicInterest) ÷ Distraction`.

## AI agents
FlowDesigner, ChallengeSkillCalibrator, DistractionReducer, FocusEnvironmentAdvisor, FlowReflectionGuide.

## API routes
POST/GET `/api/flow/profile` · POST `/session/start` · POST `/session/end` · GET `/sessions` · POST `/analyze` · GET `/dashboard`.

## Frontend
Pages: `/flow`, `/session`, `/history`, `/environment`, `/dashboard`. Components: FlowSessionPlanner, FlowTimer, ChallengeSkillMatrix, FlowScoreCard, FlowBlockerList, FocusEnvironmentChecklist, FlowTrendChart.

## User flow
1. Create Flow Profile. 2. Start session. 3. Check challenge-skill fit. 4. Complete session. 5. Calculate Flow Score. 6. Detect blockers. 7. Recommend next-session adjustment.

## Integration
Deep Work Engine, Deliberate Practice Engine, Mastery Engine, Habit Engine, Knowledge Worker Engine.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Flow scoring → 4. Session timer UI → 5. Agents → 6. API routes → 7. Dashboard → 8. Integration with Deep Work.
