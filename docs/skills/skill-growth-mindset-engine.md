# Skill: Growth Mindset Engine

You are a Principal Growth Mindset Systems Designer, Educational Psychologist, AI Agent Architect, and Human Development Product Engineer. Build a production-grade subsystem inside Mission OS: the **GROWTH MINDSET ENGINE**, inspired by Carol Dweck's growth mindset theory. Do not copy copyrighted text. Build an original system based on the general distinction between fixed and growth mindset.

## Purpose
Help users identify fixed mindset patterns and transform them into growth-oriented beliefs. Answer: Where do I believe ability is fixed? What challenges do I avoid to protect identity? What failures do I treat as proof I'm not capable? How can I reinterpret failure as feedback? What process/strategy/effort should I improve?

## Core principle
Fixed: ability is static, failure threatens identity, challenge avoided, feedback feels like judgment. Growth: ability develops, failure is feedback, challenge builds capacity, feedback improves strategy.

## Domain model (`src/domains/growth-mindset/`)
Entities: MindsetProfile, MindsetAssessment, FixedMindsetStatement, GrowthMindsetReframe, ChallengeAvoidancePattern, FailureInterpretation, EffortStrategyLog, FeedbackResponse, MindsetScoreSnapshot.

**MindsetProfile**: id, userId, dominantPattern, fixedMindsetDomains(Json), growthMindsetDomains(Json), challengeAvoidanceSummary, feedbackSensitivityScore, createdAt, updatedAt.
**FixedMindsetStatement**: id, userId, domain, statement, trigger, identityThreat, avoidanceBehavior, reframeId?, createdAt, updatedAt.
**GrowthMindsetReframe**: id, userId, originalStatement, reframedStatement, strategySuggestion, practiceAction, createdAt, updatedAt.

## Assessment questions
1. What skill do you believe you're simply not good at? 2. When do you avoid challenges? 3. What feedback feels threatening? 4. When do you compare negatively to others? 5. What failure still defines you? 6. What do you avoid for fear of looking incompetent? 7. What do you say after failing? 8. What strategy could improve performance? 9. What would you attempt if failure were data? 10. What area do you want to improve over 90 days?

## Reframe engine
Input "I am bad at math." → Fixed belief: "My math ability is permanent." → Growth reframe: "My current strategies are insufficient, but ability can improve through better practice and feedback." → Action: "Practice one targeted subskill 15 min daily and track errors."

## Scoring (0–100)
GrowthMindsetScore, FixedMindsetRiskScore, ChallengeToleranceScore, FeedbackLearningScore, EffortStrategyScore, GlobalMindsetScore.

`GlobalMindsetScore = (GrowthMindset × ChallengeTolerance × FeedbackLearning × EffortStrategy) ÷ FixedMindsetRisk`.

## AI agents
MindsetAssessor, FixedMindsetDetector, GrowthReframeCoach, ChallengeDesigner, FeedbackLearningCoach. Each: system prompt, input/output schema, TS interface, examples, error handling.

## API routes
POST `/api/growth-mindset/assessment` · GET `/profile` · POST `/detect` · POST `/reframe` · POST `/challenge` · GET `/dashboard`.

## Frontend
Pages: `/growth-mindset`, `/assessment`, `/reframes`, `/challenges`, `/dashboard`. Components: MindsetAssessmentForm, FixedMindsetStatementCard, GrowthReframePanel, ChallengeDesignerCard, MindsetScoreCard, MindsetTrendChart.

## User flow
1. Assessment. 2. Identify fixed domains. 3. Submit limiting statement. 4. Generate reframe. 5. Recommend small challenge. 6. Track attempt. 7. Update score.

## Integration
Belief Engine, Deliberate Practice Engine, Habit Engine, Child Development OS, Reflection Engine.

## Implementation order
1. Domain types → 2. Prisma models → 3. Reframe service → 4. Scoring → 5. Agents → 6. API routes → 7. Frontend pages → 8. Dashboard integration.
