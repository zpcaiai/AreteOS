# Skill: Antifragile Life Engine

You are a Principal Resilience Systems Architect, Antifragility Designer, Risk Systems Engineer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **ANTIFRAGILE LIFE ENGINE**, inspired by Nassim Nicholas Taleb's antifragility concept. Do not copy copyrighted text. Build an original system based on the idea that some systems benefit from volatility, stress, errors, and uncertainty.

## Purpose
Help users design a life that is not merely robust but improves through volatility. Answer: Where am I fragile? Where am I over-dependent? What shocks could break me? How can I gain from uncertainty? What small stressors can make me stronger?

## Core concepts
Fragile: harmed by volatility. Robust: resists volatility. Antifragile: improves from volatility. Life domains: income, career, skills, health, relationships, psychology, reputation, knowledge, business, location, technology dependency.

## Domain model (`src/domains/antifragile-life/`)
Entities: FragilityProfile, FragilityAssessment, LifeDomainRisk, DependencyRisk, ShockScenario, StressTest, OptionalityAsset, BarbellStrategy, AntifragilePractice, ResilienceScoreSnapshot.

Risk types: single income dependency, single skill dependency, key person dependency, platform dependency, employer dependency, geographic dependency, health fragility, emotional fragility, debt fragility, reputation fragility, knowledge obsolescence.

## Assessment
1. What single failure would damage your life most? 2. What income source are you most dependent on? 3. What skill could become obsolete? 4. What relationship/institution do you over-rely on? 5. What stress do you avoid that would make you stronger? 6. What uncertainty could become opportunity? 7. What optionality are you building? 8. What small experiments can you run safely? 9. What downside must be capped? 10. What upside should remain open?

## Stress test engine
Tests: job loss, market crash, health interruption, platform ban, major customer loss, AI disruption, relocation, reputation challenge, project failure, relationship conflict. Output: impact, probability, preparedness, recovery options, antifragile upgrade.

## Barbell strategy engine
Safe base: emergency fund, stable routine, health foundation, core skill, trusted relationships. High-upside experiments: startup project, content asset, AI product, new skill, network expansion, investment in learning.

## Scoring
FragilityScore, ResilienceScore, OptionalityScore, StressRecoveryScore, AntifragilePracticeScore, GlobalAntifragileLifeScore.

`GlobalAntifragileLifeScore = (Resilience × Optionality × StressRecovery × AntifragilePractice) ÷ Fragility`.

## AI agents
FragilityAnalyzer, StressTestDesigner, OptionalityCoach, BarbellStrategyBuilder, AntifragilePracticeCoach, RiskReductionPlanner.

## API routes
POST `/api/antifragile/assessment` · GET `/profile` · POST `/stress-test` · POST `/barbell` · POST `/optionality` · GET `/dashboard`.

## Frontend
Pages: `/antifragile`, `/assessment`, `/stress-test`, `/barbell`, `/dashboard`. Components: FragilityMap, LifeDomainRiskCard, StressTestPanel, BarbellStrategyViewer, OptionalityAssetBoard, AntifragileScoreCard.

## User flow
1. Fragility assessment. 2. Build Fragility Profile. 3. Run stress tests. 4. Identify high-risk dependencies. 5. Create barbell strategy. 6. Recommend optionality assets. 7. Track antifragile practices.

## Integration
Naval Freedom Engine, Wealth Engine, Career Engine, Management OS, Decision Engine, Shadow Engine.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Risk assessment service → 4. Stress test engine → 5. Barbell strategy service → 6. Agents → 7. API routes → 8. UI → 9. Dashboard.
