# Skill: Experiential Learning Engine

You are a Principal Experiential Learning Architect, Reflection Systems Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **EXPERIENTIAL LEARNING ENGINE**, inspired by Kolb's experiential learning cycle. Do not copy copyrighted text. Build an original system around Experience → Reflection → Conceptualization → Experimentation.

## Purpose
Help users convert experience into knowledge, knowledge into experiments, and experiments into growth. Answer: What happened? What did I notice? What principle can I extract? What experiment should I try next? What did the next experiment teach me?

## Core loop
Concrete Experience → Reflective Observation → Abstract Conceptualization → Active Experimentation → New Experience.

## Domain model (`src/domains/experiential-learning/`)
Entities: ExperienceRecord, ObservationNote, ConceptualInsight, LearningPrinciple, ExperimentPlan, ExperimentResult, LearningCycle, ExperientialLearningScoreSnapshot.

**ExperienceRecord**: id, userId, title, context, whatHappened, emotionalState, outcome, createdAt, updatedAt.
**ConceptualInsight**: id, experienceId, insight, principle, confidence, applicationContext, createdAt, updatedAt.
**ExperimentPlan**: id, userId, principleId, hypothesis, action, successCriteria, dueDate, status, createdAt, updatedAt.

## Workflow
1. Record experience. 2. Reflect on what happened. 3. Extract observations. 4. Generate abstract principle. 5. Design experiment. 6. Execute. 7. Record result. 8. Update principle.

## Scoring
ExperienceCaptureScore, ReflectionQualityScore, InsightExtractionScore, ExperimentExecutionScore, LearningCycleCompletionScore, GlobalExperientialLearningScore.

## AI agents
ExperienceRecorder, ReflectionQuestioner, InsightExtractor, PrincipleBuilder, ExperimentDesigner, LearningCycleCoach.

## API routes
POST/GET `/api/experiential-learning/experience(s)` · POST `/reflect` · POST `/insight` · POST `/experiment` · POST `/result` · GET `/dashboard`.

## Frontend
Pages: `/experiential-learning`, `/new`, `/cycle/[id]`, `/experiments`, `/dashboard`. Components: ExperienceRecordForm, ReflectionPanel, InsightExtractorCard, LearningPrincipleCard, ExperimentPlanViewer, LearningCycleTimeline.

## User flow
1. Record experience. 2. Ask reflection questions. 3. Extract insight. 4. Create principle. 5. Create experiment. 6. Execute + log result. 7. Complete learning cycle.

## Integration
Reflection Engine, Double Loop Learning Engine, Decision Journal, Management OS, Child Development OS.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Learning cycle service → 4. Agents → 5. API routes → 6. UI → 7. Dashboard.
