# Skill: Mastery Learning Engine

You are a Principal Mastery Learning Architect, Education Systems Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **MASTERY LEARNING ENGINE**, inspired by Benjamin Bloom's mastery learning approach. Do not copy copyrighted content. Build an original system based on the idea that learners progress by mastering prerequisites before moving forward.

## Purpose
Help users learn systematically by diagnosing gaps, practicing prerequisites, and only advancing after mastery. Answer: What do I already understand? What prerequisite am I missing? What should I learn next? Have I mastered this enough to advance? What remediation do I need?

## Core model
Diagnostic Assessment → Knowledge Map → Prerequisite Detection → Targeted Practice → Mastery Check → Remediation → Advancement.

## Domain model (`src/domains/mastery-learning/`)
Entities: LearningDomain, LearningObjective, Prerequisite, DiagnosticAssessment, MasteryCheck, LearningGap, RemediationPlan, MasteryPath, MasteryProgressSnapshot.

**LearningObjective**: id, domainId, title, description, difficulty, prerequisiteIds(Json), masteryCriteria(Json), createdAt, updatedAt.

## Mastery criteria
For each objective: knowledge recall, conceptual understanding, application, transfer, explanation ability, error rate threshold.

## Diagnostic engine
Detect: missing prerequisite, partial understanding, misconception, shallow memorization, application failure, transfer failure.

## Scoring
ObjectiveMasteryScore, PrerequisiteReadinessScore, LearningGapScore, RemediationCompletionScore, GlobalMasteryLearningScore.

## AI agents
LearningPathBuilder, DiagnosticAssessor, PrerequisiteMapper, GapAnalyzer, RemediationCoach, MasteryCheckGenerator.

## API routes
POST `/api/mastery-learning/domain` · POST `/objective` · POST `/diagnostic` · GET `/path` · POST `/mastery-check` · POST `/remediation` · GET `/dashboard`.

## Frontend
Pages: `/mastery-learning`, `/domain/[id]`, `/diagnostic`, `/path`, `/gaps`, `/dashboard`. Components: LearningDomainCard, KnowledgeMap, PrerequisiteGraph, DiagnosticAssessmentForm, LearningGapReport, RemediationPlanViewer, MasteryProgressChart.

## User flow
1. Select domain. 2. Build objectives. 3. Complete diagnostic. 4. Detect gaps. 5. Recommend remediation. 6. Complete mastery check. 7. Unlock next objective.

## Integration
Deliberate Practice Engine, Mastery Engine, Child Development OS, Research Skill Engine, Language Learning modules.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Learning objective service → 4. Diagnostic engine → 5. Agents → 6. API routes → 7. UI → 8. Dashboard.
