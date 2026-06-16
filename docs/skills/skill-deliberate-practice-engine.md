# Skill: Deliberate Practice Engine

You are a Principal Skill Acquisition Architect, Expertise Researcher, AI Coach Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **DELIBERATE PRACTICE ENGINE**, inspired by Anders Ericsson's research. Do not copy copyrighted text. Build an original system based on the general concept that mastery requires structured practice, clear goals, feedback, stretch, correction, and repetition.

## Purpose
Transform vague skill improvement into structured mastery. Answer: What skill am I improving? What subskill is weakest? What is the next stretch challenge? What feedback do I need? What should I practice today? How do I know I am improving?

## Core principle
Practice is not repetition. Deliberate practice requires: specific goal, subskill isolation, stretch zone, immediate feedback, error correction, repetition, reflection, coaching, progression.

## Domain model (`src/domains/deliberate-practice/`)
Entities: PracticeSkill, SubSkill, PracticePlan, PracticeSession, PracticeDrill, FeedbackItem, ErrorPattern, StretchGoal, CoachFeedback, PerformanceBenchmark, PracticeScoreSnapshot.

**PracticeSkill**: id, userId, name, domain, targetLevel, currentLevel, whyItMatters, identityLink, createdAt, updatedAt.
**SubSkill**: id, skillId, name, description, currentScore, targetScore, priority, createdAt, updatedAt.
**PracticeSession**: id, userId, skillId, subSkillId, drillId, durationMinutes, difficulty, focusQuality, feedback, errors(Json), corrections(Json), reflection, createdAt, updatedAt.

## Skill decomposition
Example — Research Writing: problem framing, literature synthesis, argument structure, evidence selection, academic style, revision. Programming: debugging, architecture, testing, performance, API design, code reading.

## Practice loop
1. Choose skill. 2. Decompose. 3. Identify weakest subskill. 4. Create stretch drill. 5. Practice with timer. 6. Capture errors. 7. Receive feedback. 8. Correct. 9. Repeat. 10. Reflect. 11. Update score.

## Stretch zone engine
Classify too easy / optimal / too hard from success rate, frustration, error frequency, completion time, perceived difficulty → StretchZoneScore.

## Feedback engine
Types: self, AI, peer, mentor, benchmark. FeedbackItem: observation, error, correction, next drill, confidence, priority.

## Scoring (0–100)
PracticeConsistencyScore, StretchZoneScore, FeedbackQualityScore, ErrorCorrectionScore, SubSkillGrowthScore, MasteryProgressScore, GlobalDeliberatePracticeScore.

`GlobalDeliberatePracticeScore = Consistency × StretchZone × FeedbackQuality × ErrorCorrection × SubSkillGrowth`.

## AI agents
SkillDecomposer, PracticePlanner, DrillGenerator, FeedbackAnalyzer, ErrorPatternDetector, MasteryCoach. Each: system prompt, input/output schema, examples, TS interface.

## API routes
POST/GET `/api/practice/skills` · POST `/decompose` · POST `/plan` · POST `/session` · POST `/feedback` · GET `/progress` · GET `/dashboard`.

## Frontend
Pages: `/practice`, `/skills`, `/skill/[id]`, `/session`, `/progress`, `/dashboard`. Components: SkillCard, SubSkillTree, PracticePlanViewer, PracticeSessionTimer, ErrorPatternList, FeedbackPanel, MasteryProgressChart, StretchZoneIndicator.

## User flow
1. Create skill. 2. Decompose into subskills. 3. Choose target level. 4. Identify weakest subskill. 5. Weekly practice plan. 6. Complete sessions. 7. Record errors + feedback. 8. Recommend next drill. 9. Update mastery progress.

## Implementation order
1. Domain model → 2. Prisma models → 3. Skill decomposition service → 4. Scoring → 5. Agents → 6. API routes → 7. Practice session UI → 8. Progress dashboard → 9. README.
