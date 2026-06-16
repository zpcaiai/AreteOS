# Skill: Design Thinking Engine

You are a Principal Innovation Systems Architect, Design Thinking Facilitator, Product Discovery Expert, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **DESIGN THINKING ENGINE**, inspired by modern design thinking practice. Do not copy copyrighted course content. Build an original system around empathy, problem definition, ideation, prototyping, and testing.

## Purpose
Help users transform vague ideas into validated solutions. Answer: Who is the user? What pain do they actually have? What problem are we solving? What ideas could solve it? What prototype can test it? What did we learn?

## Core process
Empathize → Define → Ideate → Prototype → Test → Learn → Iterate.

## Domain model (`src/domains/design-thinking/`)
Entities: DesignProject, UserPersona, EmpathyInterview, PainPoint, ProblemStatement, HowMightWeQuestion, Idea, Prototype, TestPlan, UserFeedback, DesignInsight, DesignIteration.

**DesignProject**: id, userId, title, contextType (product | education | personal | business | child_learning | management), status, createdAt, updatedAt.
**ProblemStatement**: id, projectId, userSegment, need, insight, statement, createdAt, updatedAt.

## Workflow
1. Create project. 2. Define target user. 3. Conduct empathy interviews. 4. Extract pains/needs. 5. Generate problem statement. 6. Generate HMW questions. 7. Generate ideas. 8. Select prototype. 9. Create test plan. 10. Capture feedback. 11. Generate insights. 12. Iterate.

## Scoring (0–100)
EmpathyDepthScore, ProblemClarityScore, IdeaDiversityScore, PrototypeSpeedScore, FeedbackQualityScore, IterationLearningScore, GlobalDesignThinkingScore.

## AI agents
EmpathyInterviewCoach, PainPointExtractor, ProblemStatementBuilder, HowMightWeGenerator, IdeaGenerator, PrototypePlanner, UserFeedbackAnalyzer.

## API routes
POST/GET `/api/design-thinking/project(s)` · POST `/interview` · POST `/pain-points` · POST `/problem-statement` · POST `/hmw` · POST `/ideas` · POST `/prototype` · POST `/test` · GET `/dashboard`.

## Frontend
Pages: `/design-thinking`, `/project/[id]`, `/empathy`, `/define`, `/ideate`, `/prototype`, `/test`, `/dashboard`. Components: DesignProjectCard, EmpathyInterviewForm, PainPointBoard, ProblemStatementCard, HMWQuestionList, IdeaBoard, PrototypePlanViewer, FeedbackAnalysisPanel.

## User flow
1. Create project. 2. Guide empathy research. 3. Extract problem. 4. Generate ideas. 5. Choose prototype. 6. Create test plan. 7. Record feedback. 8. Create next iteration.

## Integration
Disney Creativity Board, Startup Opportunity Engine, Child Development OS, Management OS, Product Builder modules.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Services → 4. Agents → 5. API routes → 6. UI workflow → 7. Dashboard → 8. Integration with Disney Board.
