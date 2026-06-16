# Skill: Personal OS Compiler

You are a Principal AI Systems Architect, Human Development OS Designer, Product Architect, Agent Orchestration Engineer, and Life Strategy Compiler Designer. Build a production-grade subsystem inside Mission OS: the **PERSONAL OS COMPILER** — the highest-level module. Tagline: *compile an ideal identity into an executable life operating system.*

## Purpose
User inputs "I want to become an AI research entrepreneur." The system compiles: Mission, Identity Stack, Core Values, Principles, Mental Models, Skill Tree, Habit System, Deep Work Schedule, Practice Plan, Asset Roadmap, Decision Rules, Risk Map, Growth Protocol, Weekly Review, 90-Day Plan, AI Boardroom — a complete executable personal OS.

## Core principle
Mission OS shouldn't merely track life; it should compile identity into daily systems. Input: Desired Identity → Output: Executable Life System.

## Compiler pipeline
1. **Intent Parsing** → parsed aspiration. 2. **Mission Extraction** → mission statement. 3. **Identity Stack Construction** → primary/secondary/emerging/legacy. 4. **Values & Principles** → core values, non-negotiables, decision principles. 5. **Skill Tree Generation** → required skills, subskills, learning path, practice plan. 6. **Habit System Generation** → identity-based habits, tiny behaviors, check-in rules. 7. **Deep Work System** → weekly blocks, focus rituals, output targets. 8. **Asset Roadmap** → knowledge/code/product/media/reputation assets. 9. **Decision Rules** → checklist, bias warnings, boardroom advisors. 10. **Risk & Antifragility** → fragility map, downside protection, optionality. 11. **Growth Protocol** → Observe→Diagnose→Design→Practice→Reflect→Update→Compound. 12. **90-Day Execution Plan** → months 1–3, weekly milestones, daily minimums.

## Domain model (`src/domains/personal-os-compiler/`: types, events, repository, service, compiler, score, templates)
Entities: PersonalOSCompilation, PersonalOSIntent, CompiledMission, CompiledIdentityStack, CompiledValues, CompiledSkillTree, CompiledHabitSystem, CompiledDeepWorkSystem, CompiledAssetRoadmap, CompiledDecisionSystem, CompiledRiskMap, CompiledGrowthProtocol, CompiledNinetyDayPlan, CompilationReview, CompilationScoreSnapshot.

**PersonalOSCompilation**: id, userId, title, rawIntent, parsedIntent(Json), status, version, …
**CompiledIdentityStack**: id, compilationId, primaryIdentity, secondaryIdentities(Json), emergingIdentity, legacyIdentity, rationale, …
**CompiledSkillTree**: id, compilationId, skills(Json), subskills(Json), learningOrder(Json), practicePlan(Json), …
**CompiledHabitSystem**: id, compilationId, habits(Json), tinyBehaviors(Json), identityProofRules(Json), …
**CompiledAssetRoadmap**: id, compilationId, assetSequence(Json), firstAsset, ninetyDayAssetTarget, …
**CompiledNinetyDayPlan**: id, compilationId, monthOne(Json), monthTwo(Json), monthThree(Json), weeklyMilestones(Json), dailyMinimums(Json), …

## Input examples
"I want to become an AI research entrepreneur / a world-class systems architect / a founder building educational AI products / a disciplined investor / a creative technologist / a management thinker / a mentor and institution builder."

## Output example (AI research entrepreneur)
- **Mission:** Build AI systems that transform human learning and development.
- **Identity Stack:** Primary Researcher · Secondary Builder · Emerging Entrepreneur · Legacy Mentor.
- **Values:** Truth, Leverage, Usefulness, Long-termism, Integrity.
- **Skill Tree:** AI research, software architecture, product discovery, writing, distribution, business-model design.
- **Habits:** Read one paper daily; write one research note daily; build one prototype weekly; talk to one user weekly.
- **Deep Work:** 4 blocks/week.
- **Assets:** research memo, prototype, public essay, MVP, user-interview database.
- **Decision Rules:** evidence before enthusiasm; prototype before scaling; users before abstraction; long-term compounding over short-term attention.
- **90-Day Plan:** M1 research + problem discovery; M2 prototype + publish; M3 user feedback + MVP iteration.

## Compilation templates
Researcher OS, Builder OS, Founder OS, Investor OS, Creator OS, Leader OS, Mentor OS, System Architect OS, AI Entrepreneur OS, Knowledge Creator OS. Each includes: identity stack, core values, skill tree, habits, deep-work rhythm, asset roadmap, decision rules, failure modes, review system.

## Scoring (0–100)
CompilationCompletenessScore, IdentityFitScore, MissionClarityScore, ExecutionClarityScore, AssetRoadmapQualityScore, RiskAwarenessScore, SystemCoherenceScore, GlobalPersonalOSScore. `GlobalPersonalOSScore = (MissionClarity × IdentityFit × ExecutionClarity × AssetRoadmapQuality × SystemCoherence) ÷ RiskBlindness`.

## AI agents
IntentParser, MissionCompiler, IdentityStackCompiler, ValuesCompiler, SkillTreeCompiler, HabitSystemCompiler, DeepWorkCompiler, AssetRoadmapCompiler, DecisionSystemCompiler, RiskMapCompiler, NinetyDayPlanCompiler, PersonalOSSynthesizer. Each: system prompt, input/output schema, TS interface, examples, failure handling, memory policy.

## API routes
POST `/api/personal-os/compile` · GET `/compilations` · GET `/compilation/:id` · POST `/compilation/:id/recompile` · POST `/compilation/:id/review` · POST `/templates` · GET `/templates` · GET `/dashboard`.

## Frontend
Pages: `/personal-os`, `/compile`, `/compilation/[id]`, `/templates`, `/dashboard`. Components: PersonalOSIntentForm, CompilationProgressStepper, MissionOutputPanel, IdentityStackOutputPanel, SkillTreeViewer, HabitSystemViewer, DeepWorkScheduleViewer, AssetRoadmapViewer, DecisionRulesViewer, RiskMapViewer, NinetyDayPlanViewer, PersonalOSDashboard.

## User flow
1. Enter desired identity. 2. Parse intent. 3. Ask clarifying questions if needed. 4–13. Compile mission → identity stack → values → skill tree → habits → deep work → asset roadmap → decision rules → risk map → 90-day plan. 14. Activate plan. 15. Linked engines start tracking progress.

## Integration
Mission, Identity Library, Identity Evolution Tree, Principle-Centered Life, Specific Knowledge, Deep Work, Deliberate Practice, Asset-Based Growth, Decision, Antifragile Life, Growth Protocol, Growth Prescription, Personal Boardroom, Life Capital Ledger.

## Activation logic
After compilation, the user can activate: habits, deep-work blocks, skill practice plan, asset roadmap, decision rules, weekly review, 90-day plan. Activation creates records in the linked modules.

## Versioning
Support recompilation. Every compilation has: version number, reason for change, previous version, active version, archived versions.

## Implementation order
1. Domain types → 2. Prisma schema → 3. Templates → 4. Compiler pipeline → 5. Individual compiler agents → 6. Synthesizer → 7. API routes → 8. Compile flow UI → 9. Output viewer → 10. Activation logic → 11. Versioning → 12. Dashboard → 13. README. Before coding, output: compiler architecture, pipeline stages, template structure, integration map, checklist.

## Final standard
The product should feel like a compiler that converts ideal identity into executable life architecture — *"I described who I want to become, and the system generated the operating system for becoming that person."*
