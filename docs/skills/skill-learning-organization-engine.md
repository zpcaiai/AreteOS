# Skill: Learning Organization Engine

You are a Principal Learning Organization Architect, Management Systems Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Management OS: the **LEARNING ORGANIZATION ENGINE**, inspired by Peter Senge's learning organization concepts. Do not copy copyrighted text. Build an original system based on general ideas: systems thinking, personal mastery, mental models, shared vision, team learning.

## Purpose
Help teams and organizations become learning systems. Answer: Are we learning or repeating mistakes? What assumptions govern our team? Do we have a shared vision? Are people developing mastery? Are teams learning together? Where is the system producing failure?

## Core disciplines
1. Systems Thinking 2. Personal Mastery 3. Mental Models 4. Shared Vision 5. Team Learning.

## Domain model (`src/domains/learning-organization/`)
Entities: LearningOrganizationProfile, SystemsMap, PersonalMasteryProfile, TeamMentalModel, SharedVision, TeamLearningSession, OrganizationalLearningLoop, LearningOrganizationScoreSnapshot.

**TeamMentalModel**: id, organizationId, teamId, assumption, evidence, risk, replacementModel, createdAt, updatedAt.
**SharedVision**: id, organizationId, statement, alignmentScore, adoptionScore, driftRisk, createdAt, updatedAt.

## Systems thinking engine
Map feedback loops, delays, bottlenecks, incentives, unintended consequences, local optimization, systemic failure patterns.

## Team learning engine
Sessions: after action review, project retrospective, failure review, decision review, shared vision workshop, mental model challenge.

## Scoring
SystemsThinkingScore, PersonalMasteryScore, MentalModelClarityScore, SharedVisionAlignmentScore, TeamLearningScore, LearningOrganizationScore.

## AI agents
SystemsThinkingCoach, MentalModelFacilitator, SharedVisionBuilder, TeamLearningFacilitator, OrganizationalLearningAnalyst, BottleneckDetector.

## API routes
POST/GET `/api/learning-org/profile` · POST `/systems-map` · POST `/mental-models` · POST `/shared-vision` · POST `/team-learning-session` · GET `/dashboard`.

## Frontend
Pages: `/learning-org`, `/systems-map`, `/mental-models`, `/shared-vision`, `/team-learning`, `/dashboard`. Components: SystemsMapViewer, MentalModelBoard, SharedVisionAlignmentCard, TeamLearningSessionBoard, LearningOrganizationDashboard.

## User flow
1. Create organization profile. 2. Assess five disciplines. 3. Map shared vision. 4. Identify mental models. 5. Run learning session. 6. Track learning loops. 7. Dashboard shows learning maturity.

## Integration
Management OS, Double Loop Learning Engine, Psychological Safety Engine, Knowledge Capture Engine, Decision Governance Engine.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Five-discipline assessment → 4. Agents → 5. API routes → 6. UI → 7. Dashboard.
