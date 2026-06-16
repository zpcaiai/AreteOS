# Skill: Specific Knowledge Engine

You are a Principal Product Architect, AI Agent Architect, Life Strategy Designer, and Naval-inspired Specific Knowledge Systems Designer. Build a production-grade subsystem inside Mission OS: the **SPECIFIC KNOWLEDGE ENGINE**, inspired by Naval Ravikant's idea of Specific Knowledge. Do not copy copyrighted material or quote large passages. Build an original system inspired by the general concept that each person has unique, hard-to-replicate knowledge formed by curiosity, experience, talent, obsession, and context.

## Purpose
Help users discover, validate, develop, and compound their Specific Knowledge.

Specific Knowledge is NOT: generic skill, job title, school subject, certificate, resume keyword.
Specific Knowledge IS a rare combination of: natural curiosity, lived experience, hard-earned insight, personal obsession, technical skill, taste, judgment, domain exposure, unusual background, market relevance.

Core question: *What do I uniquely understand, notice, or build that others cannot easily replicate?*

## Core loop
Curiosity → Exploration → Skill Formation → Pattern Recognition → Specific Knowledge → Asset Creation → Leverage → Market Feedback → Compounding Advantage.

## Bounded context (modules)
- `src/domains/specific-knowledge/` — `types.ts, events.ts, repository.ts, service.ts, score.ts, questions.ts, validators.ts`
- `src/services/specific-knowledge/`
- `src/agents/specific-knowledge/`
- `src/components/specific-knowledge/`
- Pages: `src/app/specific-knowledge/{page,assessment/page,profile/page,graph/page,roadmap/page}.tsx`

## Domain entities (TypeScript types + Prisma models)
SpecificKnowledgeProfile, SpecificKnowledgeSignal, SpecificKnowledgeAsset, SpecificKnowledgeEvidence, CuriosityCluster, TalentSignal, ExperienceSignal, ObsessionSignal, RareCombination, MarketRelevance, SpecificKnowledgeGrowthPlan, SpecificKnowledgeScoreSnapshot.

**SpecificKnowledgeProfile**: id, userId, summary, primaryDomain, secondaryDomains, rareCombinationStatement, unfairAdvantageStatement, marketRelevanceSummary, compoundingPotential, createdAt, updatedAt.

**SpecificKnowledgeSignal**: id, userId, type (curiosity | talent | experience | obsession | market | pain | repeated_feedback), title, description, evidence, intensityScore, rarityScore, energyScore, createdAt, updatedAt.

**SpecificKnowledgeAsset**: id, userId, name, type (article | software | course | agent | template | framework | dataset | community | service | research_report), relatedKnowledgeProfileId, status (idea | building | launched | validated | retired), leverageType (code | media | ai_agent | community | capital | labor), createdAt, updatedAt.

**RareCombination**: id, userId, skills(Json), experiences(Json), domains(Json), combinationStatement, defensibilityScore, marketScore, identityAlignmentScore, createdAt, updatedAt.

**SpecificKnowledgeGrowthPlan**: id, userId, profileId, ninetyDayPlan(Json), weeklyActions(Json), recommendedAssets(Json), recommendedLearning(Json), createdAt, updatedAt.

## Assessment question bank
1. What do you learn without being forced?
2. What topics can you explore for years without external reward?
3. What do people ask you for help with?
4. What problems do you notice earlier than others?
5. What has life forced you to learn deeply?
6. What unusual combination of skills do you have?
7. What do you understand that seems obvious to you but not to others?
8. What do you enjoy explaining?
9. What are you willing to study even when difficult?
10. What domain gives you energy instead of draining you?
11. What repeated feedback have others given you?
12. What would you build if nobody gave you permission?
13. What can you keep improving for 10 years?
14. What is your unfair learning advantage?
15. What market problem intersects with your curiosity?

## Scoring (`score.ts`, normalize 0–100)
CuriosityDepthScore, ExperienceDepthScore, SkillRarityScore, EnergyScore, MarketRelevanceScore, CompoundingPotentialScore, SpecificKnowledgeScore.

`SpecificKnowledgeScore = (CuriosityDepth + ExperienceDepth + SkillRarity + Energy + MarketRelevance + CompoundingPotential) / 6`. Also emit SpecificKnowledgeScoreSnapshot.

## AI agents
SpecificKnowledgeCoach, TalentSignalExtractor, RareCombinationAnalyzer, MarketRelevanceMapper, AssetOpportunityGenerator, SpecificKnowledgeRoadmapBuilder. For each: system prompt, input/output schema, TypeScript interface, example input/output, failure handling, safety constraints.

SpecificKnowledgeCoach should ask clarifying questions, extract signals, avoid generic career advice, identify rare intersections, recommend asset-building paths, and return structured JSON:
```json
{ "specificKnowledgeSummary": "...", "rareCombination": "...", "topSignals": [], "marketRelevance": [], "recommendedAssets": [], "ninetyDayPlan": {} }
```

## API routes
POST `/api/specific-knowledge/assessment` · GET `/profile` · POST `/signals` · POST `/analyze` · POST `/rare-combination` · POST `/market-map` · POST `/growth-plan` · GET/POST `/assets` · GET `/dashboard`. Validate with zod, return typed JSON, use the service layer (no direct Prisma in handlers), include error handling.

## Frontend
Pages: `/specific-knowledge`, `/assessment`, `/profile`, `/graph`, `/assets`, `/roadmap`. Components: SpecificKnowledgeAssessmentForm, SpecificKnowledgeProfileCard, SignalList, RareCombinationMap, MarketRelevanceCard, AssetOpportunityBoard, SpecificKnowledgeScoreCard, NinetyDayGrowthPlan. UI: calm, strategic, clean, high-agency, no motivational clichés.

## User flow
1. Complete assessment. 2. Extract curiosity/talent/experience/obsession/market signals. 3. Generate profile. 4. Identify rare combinations. 5. Map market relevance. 6. Recommend 3–5 assets. 7. Create 90-day plan. 8. Track weekly progress. 9. Update Specific Knowledge Score.

## Implementation order
1. Domain types → 2. Prisma models → 3. Repository interfaces → 4. Services → 5. Score functions → 6. Agents → 7. API routes → 8. Frontend pages → 9. Seed data → 10. Dashboard integration. Before coding, output: architecture summary, data-model summary, implementation checklist.
