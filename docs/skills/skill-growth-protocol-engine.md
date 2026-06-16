# Skill: Growth Protocol Engine

You are a Principal Systems Architect, Human Development OS Designer, AI Agent Architect, and Growth Methodology Engineer. Build a production-grade subsystem inside Mission OS: the **GROWTH PROTOCOL ENGINE**. Tagline: *a unified protocol for human growth.*

## Purpose
Mission OS has many engines (Mission, Identity, Habit, Reflection, Specific Knowledge, Deep Work, Deliberate Practice, Cognitive Bias, Antifragile Life, Naval, Management, Leadership). Too many modules become a toolbox. The solution: one unified Growth Protocol every module follows, standardizing how growth works.

## Core principle
All human growth follows a reusable loop: **Observe → Diagnose → Design → Practice → Reflect → Update → Compound.** Every engine must eventually map to this protocol.

## Protocol stages
1. **Observe** — *What is happening?* Inputs: behavior data, reflections, habit logs, decisions, emotional patterns, asset output, identity signals, energy. Outputs: Observation Summary, Raw Signals, Behavior Evidence.
2. **Diagnose** — *What is the real bottleneck?* Inputs: observed data, goals, identity stack, mission, past failures. Outputs: Bottleneck, Root Cause, Misalignment, Risk Pattern.
3. **Design** — *What system should be created?* Outputs: Growth Design, Habit Design, Practice Plan, Environment Design, Decision Rule, Reflection Questions.
4. **Practice** — *What action should be repeated?* Outputs: Practice Session, Habit Check-in, Deep Work Block, Skill Drill, Behavior Experiment.
5. **Reflect** — *What did I learn?* Outputs: Reflection, Insight, Lesson, Updated Assumption.
6. **Update** — *What should change in the system?* Outputs: Updated Identity, Belief, Decision Rule, Habit, Practice Plan.
7. **Compound** — *What is accumulating?* Outputs: Asset, Skill Progress, Identity Reinforcement, Knowledge Capital, Reputation Capital.

## Domain model (`src/domains/growth-protocol/`: types, events, repository, service, score, workflow)
Entities: GrowthProtocolRun, GrowthObservation, GrowthDiagnosis, GrowthDesign, GrowthPractice, GrowthReflection, GrowthUpdate, GrowthCompoundResult, GrowthProtocolTemplate, GrowthProtocolScoreSnapshot.

**GrowthProtocolRun**: id, userId, title, sourceEngine, contextType, contextId?, currentStage, status, startedAt, completedAt, createdAt, updatedAt.
**GrowthObservation**: id, protocolRunId, rawSignals(Json), summary, evidence, …
**GrowthDiagnosis**: id, protocolRunId, bottleneckType, rootCause, confidence, misalignment, riskLevel, …
**GrowthDesign**: id, protocolRunId, designType, actionPlan(Json), environmentDesign(Json), habitDesign(Json), practicePlan(Json), …
**GrowthPractice**: id, protocolRunId, practiceType, action, frequency, duration, completed, evidence, …
**GrowthReflection**: id, protocolRunId, whatWorked, whatFailed, lesson, assumptionUpdated, …
**GrowthUpdate**: id, protocolRunId, updatedIdentity, updatedBelief, updatedHabit, updatedDecisionRule, updatedPlan, …
**GrowthCompoundResult**: id, protocolRunId, compoundType, assetCreated, skillImproved, identityReinforced, capitalIncreased, …

## Supported context types
identity_growth, skill_growth, habit_change, decision_improvement, deep_work, specific_knowledge, asset_building, leadership_growth, management_growth, child_development, antifragile_life, wealth_building, reflection, recovery, creativity.

## Scoring (0–100)
ObservationQualityScore, DiagnosisAccuracyScore, DesignQualityScore, PracticeConsistencyScore, ReflectionDepthScore, UpdateEffectivenessScore, CompoundResultScore, GlobalGrowthProtocolScore.

`GlobalGrowthProtocolScore = ObservationQuality × DiagnosisAccuracy × DesignQuality × PracticeConsistency × ReflectionDepth × UpdateEffectiveness × CompoundResult`.

## AI agents
GrowthObserver, GrowthDiagnostician, GrowthDesigner, GrowthPracticeCoach, GrowthReflectionGuide, GrowthUpdater, GrowthCompoundAnalyst. Each: system prompt, input/output schema, TS interface, examples, failure handling, memory policy.

## API routes
POST `/api/growth-protocol/run` · GET `/runs` · GET `/run/:id` · POST `/observe` `/diagnose` `/design` `/practice` `/reflect` `/update` `/compound` · GET `/dashboard`.

## Frontend
Pages: `/growth-protocol`, `/new`, `/run/[id]`, `/dashboard`. Components: GrowthProtocolStepper, ObservationPanel, DiagnosisPanel, DesignPanel, PracticePanel, ReflectionPanel, UpdatePanel, CompoundResultPanel, GrowthProtocolScoreCard.

## User flow
1. Create run. 2. Select context type. 3. Collect observations. 4. Diagnose bottleneck. 5. Design intervention. 6. Practice. 7. Reflect. 8. Update identity/habit/rule/plan. 9. Record compound result. 10. Dashboard shows progress.

## Integration
Must integrate with Mission, Identity, Habit, Reflection, Specific Knowledge, Deep Work, Deliberate Practice, Bottleneck Diagnosis, Growth Prescription, Personal OS Compiler. Expose interfaces so other engines can call: `createGrowthProtocolRun()`, `submitObservation()`, `requestDiagnosis()`, `generateDesign()`, `recordPractice()`, `recordReflection()`, `recordUpdate()`, `recordCompoundResult()`.

## Implementation order
1. Domain types → 2. Prisma schema → 3. Repository → 4. Service → 5. Workflow stage functions → 6. Scoring → 7. Agents → 8. API routes → 9. Frontend → 10. Dashboard → 11. Integration helpers → 12. README. Before coding, output: architecture summary, protocol stage map, database summary, implementation checklist.
