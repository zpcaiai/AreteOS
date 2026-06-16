# Skill: Creativity Capability Engine

You are a Principal Creativity Systems Architect, Human Potential Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **CREATIVITY CAPABILITY ENGINE**, inspired by Teresa Amabile's componential theory of creativity and modern creativity research. Do not copy copyrighted text. Build an original system based on the idea that creativity emerges from domain skill, creative thinking skill, and intrinsic motivation.

## Purpose
Help users increase creative output by developing: 1. Domain Expertise 2. Creative Thinking Skills 3. Intrinsic Motivation 4. Environment Support 5. Iterative Experimentation.

## Core model
Creativity = Domain Expertise × Creative Thinking × Intrinsic Motivation × Environment Support × Experimentation.

## Domain model (`src/domains/creativity-capability/`)
Entities: CreativityProfile, CreativeDomain, CreativeProject, CreativeThinkingSkill, IdeaGenerationSession, CreativeBlock, CreativeExperiment, CreativeOutput, CreativityScoreSnapshot.

Creative thinking skills: divergent thinking, analogy, recombination, inversion, constraint play, metaphor, pattern recognition, perspective shifting.

## Creativity workflow
1. Choose domain. 2. Assess expertise. 3. Assess motivation. 4. Generate ideas. 5. Use creative thinking prompts. 6. Prototype. 7. Get feedback. 8. Iterate. 9. Build creative portfolio.

## Creative block detection
fear of judgment, perfectionism, lack of input, unclear constraint, excessive criticism, low energy, low autonomy, missing feedback, weak domain knowledge.

## Scoring (0–100)
DomainExpertiseScore, CreativeThinkingScore, IntrinsicMotivationScore, ExperimentationScore, CreativeOutputScore, CreativeBlockRiskScore, GlobalCreativityScore.

`GlobalCreativityScore = (Expertise × CreativeThinking × IntrinsicMotivation × Experimentation) ÷ CreativeBlockRisk`.

## AI agents
CreativityAssessor, IdeaGenerationCoach, CreativeBlockAnalyzer, CreativeExperimentDesigner, CreativePortfolioCoach, AnalogyGenerator.

## API routes
POST/GET `/api/creativity/profile` · POST `/ideas` · POST `/block/analyze` · POST `/experiment` · POST `/output` · GET `/dashboard`.

## Frontend
Pages: `/creativity`, `/profile`, `/ideas`, `/experiments`, `/portfolio`, `/dashboard`. Components: CreativityProfileCard, IdeaGenerationBoard, CreativeThinkingPromptPanel, CreativeBlockReport, ExperimentPlanCard, CreativeOutputPortfolio, CreativityScoreCard.

## User flow
1. Select domain. 2. Assess creativity profile. 3. Start idea session. 4. Provide thinking prompts. 5. Create experiment. 6. Log output. 7. Update creativity score.

## Integration
Disney Creativity Board, Design Thinking Engine, Flow State Engine, Deep Work Engine, Child Development OS.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Creativity scoring → 4. Idea generation agents → 5. API routes → 6. UI → 7. Dashboard.
