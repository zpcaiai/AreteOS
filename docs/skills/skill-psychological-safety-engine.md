# Skill: Psychological Safety Engine

You are a Principal Team Performance Architect, Psychological Safety Systems Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Leadership OS and Management OS: the **PSYCHOLOGICAL SAFETY ENGINE**, inspired by Amy Edmondson's research. Do not copy copyrighted text. Build an original system based on the idea that teams perform better when people can speak up, ask questions, admit mistakes, and challenge ideas without fear of humiliation or punishment.

## Purpose
Help teams build an environment where truth can surface. Answer: Can people speak up? Admit mistakes? Challenge authority? Ask for help? Can bad news travel fast? Is silence hiding risk?

## Core principle
Psychological safety is not comfort — it is permission for candor in service of learning and performance.

## Domain model (`src/domains/psychological-safety/`)
Entities: PsychologicalSafetyProfile, TeamSafetyAssessment, SpeakUpEvent, SilenceRisk, MistakeDisclosure, HelpSeekingEvent, CandorMoment, LeaderResponse, SafetyIntervention, PsychologicalSafetyScoreSnapshot.

**TeamSafetyAssessment**: id, organizationId, teamId, userId, speakUpScore, mistakeSafetyScore, helpSeekingScore, challengeAuthorityScore, inclusionScore, retaliationRiskScore, createdAt, updatedAt.
**SpeakUpEvent**: id, teamId, userId, context, issueRaised, leaderResponse, outcome, safetyImpact, createdAt, updatedAt.

## Assessment dimensions
1. Speaking up 2. Admitting mistakes 3. Asking for help 4. Challenging assumptions 5. Inclusion 6. Leader response 7. Blame culture 8. Learning orientation 9. Bad news speed 10. Conflict quality.

## Silence risk engine
Detect: meeting silence, lack of dissent, repeated unresolved issues, fear of punishment, over-agreement, hidden errors, low question frequency, leader dominance → Silence Risk Report.

## Leader response engine
Bad: blame, shame, dismiss, punish, interrupt, ignore. Good: thank, clarify, investigate, protect, learn, act. Generate leader scripts.

## Scoring (0–100)
SpeakUpScore, MistakeSafetyScore, HelpSeekingScore, ChallengeScore, InclusionScore, SilenceRiskScore, GlobalPsychologicalSafetyScore.

`GlobalSafetyScore = (SpeakUp × MistakeSafety × HelpSeeking × Challenge × Inclusion) ÷ SilenceRisk`.

## AI agents
SafetyAssessor, SilenceRiskDetector, LeaderResponseCoach, CandorConversationGuide, MistakeLearningFacilitator, TeamSafetyAdvisor.

## API routes
POST `/api/psychological-safety/assessment` · GET `/profile` · POST `/speak-up` · POST `/silence-risk` · POST `/leader-response` · POST `/intervention` · GET `/dashboard`.

## Frontend
Pages: `/psychological-safety`, `/assessment`, `/speak-up`, `/silence-risk`, `/interventions`, `/dashboard`. Components: SafetyAssessmentForm, SafetyScoreCard, SpeakUpEventList, SilenceRiskReport, LeaderResponseCoachPanel, InterventionPlanViewer, TeamSafetyDashboard.

## User flow
1. Leader/team completes assessment. 2. Generate safety profile. 3. Detect silence risks. 4. Recommend leader behaviors. 5. Record speak-up events. 6. Track leader responses. 7. Update safety score. 8. Recommend interventions.

## Integration
Leadership OS, Management OS, Learning Organization Engine, Double Loop Learning Engine, SFM Business Scaling Engine.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Assessment service → 4. Silence risk detector → 5. Agents → 6. API routes → 7. UI → 8. Dashboard → 9. Management OS integration.
