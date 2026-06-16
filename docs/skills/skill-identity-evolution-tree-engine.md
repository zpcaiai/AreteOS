# Skill: Identity Evolution Tree Engine

You are a Principal Identity Architect, Human Development Game Systems Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **IDENTITY EVOLUTION TREE ENGINE**. Tagline: *a long-term identity progression system.*

## Purpose
Show users their long-term identity evolution as a structured tree. Answer: Who am I now? Who am I becoming next? What path am I walking? What capabilities unlock the next identity? What habits/assets prove it? What shadows block evolution?

## Core principle
Identity evolves through evidence — not selected once, but practiced, proven, stabilized, integrated, and eventually transmitted.

## Evolution stages
1. Discovery 2. Selection 3. Experimentation 4. Practice 5. Stabilization 6. Integration 7. Mastery 8. Teaching 9. Legacy.

## Identity tree examples
- Explorer → Researcher → Systems Thinker → Architect → Builder → Founder → Leader → Mentor → Legacy Builder.
- Learner → Practitioner → Craftsman → Expert → Master → Teacher → Institution Builder.
- Creator → Designer → Product Builder → Entrepreneur → Market Creator → Culture Builder.

## Domain model (`src/domains/identity-evolution-tree/`: types, events, repository, service, score, tree)
Entities: IdentityNode, IdentityTree, IdentityEvolutionPath, IdentityUnlockRequirement, IdentityMilestone, IdentityQuest, IdentityEvidence, IdentityEvolutionSnapshot, UserIdentityTreeProgress.

**IdentityNode**: id, name, family, level, description, mission, coreValues(Json), requiredCapabilities(Json), requiredHabits(Json), requiredAssets(Json), shadowPatterns(Json), nextIdentityIds(Json), …
**IdentityUnlockRequirement**: id, identityNodeId, requirementType (habit | skill | asset | decision | reflection | contribution | teaching), description, targetValue, evidenceRequired, …
**IdentityQuest**: id, identityNodeId, title, description, questType, difficulty, estimatedDays, successCriteria(Json), …
**UserIdentityTreeProgress**: id, userId, identityNodeId, stage, progressPercent, unlocked, active, evidence(Json), …

## Quest system
E.g. Researcher → "Write a 1000-word research memo" (read 3 sources, define one question, write one argument, reflect on what changed). Builder → "Ship one working prototype" (define problem, build MVP, get one user feedback, document lesson).

## Unlock system
Unlock the next identity when: required habits completed, required asset created, required reflection completed, skill threshold reached, identity proof accumulated, shadow risk reduced.

## Scoring (0–100)
IdentityProgressScore, IdentityEvidenceScore, IdentityStabilityScore, IdentityEvolutionVelocity, IdentityMasteryScore, IdentityLegacyScore. `IdentityProgressScore = HabitEvidence × SkillEvidence × AssetEvidence × ReflectionEvidence × ShadowReduction`.

## AI agents
IdentityPathDesigner, IdentityQuestGenerator, IdentityUnlockEvaluator, IdentityEvolutionCoach, IdentityShadowBlockerAnalyzer, IdentityLegacyAdvisor.

## API routes
GET `/api/identity-tree` · GET `/node/:id` · POST `/path` · GET `/progress` · POST `/quest` · POST `/evidence` · POST `/unlock-check` · GET `/dashboard`.

## Frontend
Pages: `/identity-tree`, `/path`, `/node/[id]`, `/quests`, `/progress`, `/dashboard`. Components: IdentityTreeGraph, IdentityNodeCard, IdentityPathViewer, IdentityQuestCard, IdentityUnlockPanel, IdentityEvidenceTimeline, IdentityEvolutionDashboard.

## User flow
1. Select/import Identity Stack. 2. Recommend a path. 3. Select active node. 4. Generate quests. 5. Complete habits/assets/reflections. 6. Store evidence. 7. Unlock evaluator checks progress. 8. Unlock next identity. 9. Dashboard shows evolution.

## Integration
Identity Library, Identity-Based Habit, Asset-Based Growth, Deep Work, Deliberate Practice, Growth Prescription, Personal OS Compiler.

## Implementation order
1. Domain types → 2. Prisma schema → 3. Seed nodes/paths → 4. Tree service → 5. Quest generator → 6. Unlock evaluator → 7. Scoring → 8. Agents → 9. API routes → 10. UI graph → 11. Dashboard. Before coding, output: identity tree model, unlock design, data model, checklist.
