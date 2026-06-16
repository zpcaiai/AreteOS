# Skill: Asset-Based Growth Engine

You are a Principal Asset-Based Growth Architect, Creator Economy Systems Designer, Knowledge Asset Strategist, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **ASSET-BASED GROWTH ENGINE**. Tagline: *growth measured by durable outputs, not activity.*

## Purpose
Most systems track habits, time, tasks, check-ins. Mission OS should track assets, outputs, reusable knowledge, products, intellectual capital, systems, and reputation-building work. This engine turns growth into durable assets.

## Core principle
If growth does not compound, it is fragile. An asset is anything that keeps creating value after the initial effort.

## Asset types
1. Knowledge (article, research note, framework, report, memo) 2. Code (software, script, automation, API, library) 3. Product (MVP, SaaS, template, course, tool) 4. Media (video, podcast, newsletter, essay) 5. Brand (profile, portfolio, reputation signal) 6. Community (group, audience, network, forum) 7. Decision (decision journal, principle library, playbook) 8. Learning (notes, curriculum, knowledge map) 9. Business (offer, sales page, customer list, process) 10. AI (agent, prompt system, workflow, knowledge base).

## Domain model (`src/domains/asset-based-growth/`: types, events, repository, service, score, asset-types)
Entities: GrowthAsset, AssetCategory, AssetPipeline, AssetBuildPlan, AssetMilestone, AssetFeedback, AssetImpact, AssetCompoundLog, AssetPortfolio, AssetScoreSnapshot.

**GrowthAsset**: id, userId, title, assetType, description, linkedIdentityId?, linkedMissionId?, linkedSpecificKnowledgeId?, status (idea | planned | building | published | validated | compounding | retired), valueHypothesis, audience, distributionChannel, …
**AssetBuildPlan**: id, assetId, objective, milestones(Json), deepWorkBlocksRequired, deadline, …
**AssetImpact**: id, assetId, views, users, revenue, feedbackCount, citations, shares, leads, qualitativeImpact, …

## Asset pipeline
Idea → Clarified → Planned → Draft → Built → Published → Feedback → Improved → Repurposed → Compounding.

## Creation workflow
1. Choose identity. 2. Choose specific knowledge. 3. Generate asset ideas. 4. Select asset. 5. Build plan. 6. Schedule deep work. 7. Build v1. 8. Publish/share. 9. Collect feedback. 10. Improve. 11. Track compounding.

## Identity-asset mapping
Researcher → research memo, paper, literature map, knowledge graph. Builder → prototype, code library, product feature. Teacher → lesson, course, explanation thread. Investor → thesis memo, decision journal, company analysis. Founder → MVP, offer, sales page, interview database. Leader → operating principle, playbook, team memo.

## Scoring (0–100)
AssetCreationScore, AssetQualityScore, AssetLeverageScore, AssetFeedbackScore, AssetCompoundingScore, AssetPortfolioScore. `AssetCompoundingScore = Durability × Reusability × Distribution × Feedback × ImprovementRate`. `GlobalAssetGrowthScore = AssetCreation × AssetQuality × AssetLeverage × AssetCompounding`.

## AI agents
AssetOpportunityGenerator, AssetBuildPlanner, AssetQualityReviewer, AssetRepurposingAdvisor, AssetPortfolioStrategist, AssetFeedbackAnalyzer.

## API routes
POST `/api/assets/growth/ideas` · POST `/create` · GET `/` · GET `/:id` · POST `/build-plan` · POST `/milestone` · POST `/feedback` · POST `/impact` · GET `/portfolio` · GET `/dashboard`.

## Frontend
Pages: `/assets`, `/ideas`, `/[id]`, `/pipeline`, `/portfolio`, `/dashboard`. Components: AssetIdeaGenerator, AssetCard, AssetPipelineBoard, AssetBuildPlanViewer, AssetImpactPanel, AssetPortfolioMap, AssetCompoundingChart, AssetDashboard.

## User flow
1. Select identity + specific knowledge. 2. Generate ideas. 3. Select asset. 4. Build plan. 5. Schedule deep work. 6. Build + publish. 7. Collect feedback. 8. Improve. 9. Track compounding. 10. Asset feeds identity evolution.

## Integration
Specific Knowledge, Deep Work, Identity Evolution Tree, Naval Life OS, Growth Prescription, Personal OS Compiler, Legacy Engine.

## Implementation order
1. Domain types → 2. Prisma schema → 3. Asset type seed → 4. Pipeline service → 5. Scoring → 6. Agents → 7. API routes → 8. UI pipeline → 9. Portfolio dashboard → 10. Integration with Deep Work. Before coding, output: asset taxonomy, pipeline model, database summary, checklist.
