# Skill: Life Capital Ledger Engine

You are a Principal Life Systems Architect, Personal Capital Analyst, Human Development Data Architect, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **LIFE CAPITAL LEDGER ENGINE**. Tagline: *track the forms of capital that determine long-term life quality.*

## Purpose
Financial capital is only one kind. Life compounds through many: knowledge, skills, health, relationships, reputation, assets, freedom, judgment, meaning, energy. This engine tracks growth and depletion across capital forms.

## Core principle
What is not tracked is often depleted. Growth should increase life capital, not merely complete tasks.

## Capital categories
1. Knowledge 2. Skill 3. Health (physical + mental energy) 4. Relationship (trust, support, network) 5. Reputation (credibility, public trust) 6. Asset (durable outputs, ownership) 7. Financial 8. Freedom (optionality, autonomy) 9. Judgment (decision quality) 10. Meaning (mission, purpose, contribution) 11. Attention (focus, bandwidth) 12. Spiritual/Inner (peace, resilience — secular by default unless user opts otherwise).

## Domain model (`src/domains/life-capital-ledger/`: types, events, repository, service, score, ledger)
Entities: LifeCapitalAccount, LifeCapitalEntry, LifeCapitalTransaction, LifeCapitalBalance, CapitalCategory, CapitalAsset, CapitalLiability, CapitalReview, CapitalScoreSnapshot.

**LifeCapitalAccount**: id, userId, category, currentBalance, targetBalance, trend, riskLevel, …
**LifeCapitalEntry**: id, userId, category, entryType (deposit | withdrawal | transfer | investment | liability), amount, description, evidence, sourceEngine, …
**CapitalAsset**: id, userId, category, name, description, valueEstimate, durability, compoundingPotential, …
**CapitalLiability**: id, userId, category, name, description, severity, repaymentPlan, …

## Ledger events (examples)
Knowledge deposit: write research memo. Skill deposit: complete deliberate practice. Health withdrawal: 5 nights poor sleep. Relationship deposit: repair an important relationship. Reputation deposit: publish a useful asset. Attention withdrawal: 3 hrs low-quality distraction. Freedom deposit: reduce a dependency. Judgment deposit: review a decision and update a rule.

## Capital balance sheet
Assets: skills, knowledge assets, reputation, relationships, health, financial reserves, freedom options, decision principles, creative assets. Liabilities: debt, bad habits, fragile income, toxic commitments, unfinished obligations, attention pollution, identity conflict, unresolved relationship damage.

## Scoring (0–100)
CapitalBalanceScore, CapitalGrowthRate, CapitalDepletionRisk, CapitalDiversificationScore, CapitalCompoundingScore, GlobalLifeCapitalScore. `GlobalLifeCapitalScore = (CapitalBalance × GrowthRate × Diversification × Compounding) ÷ DepletionRisk`.

## AI agents
LifeCapitalAnalyst, CapitalEntryClassifier, CapitalBalanceSheetBuilder, CapitalLiabilityDetector, CapitalInvestmentAdvisor, MonthlyCapitalReviewCoach.

## API routes
POST `/api/life-capital/entry` · GET `/accounts` · GET `/balance-sheet` · POST `/review` · POST `/liability` · GET `/dashboard` · GET `/trends`.

## Frontend
Pages: `/life-capital`, `/ledger`, `/balance-sheet`, `/review`, `/dashboard`. Components: LifeCapitalDashboard, CapitalAccountCard, CapitalLedgerTable, CapitalBalanceSheet, CapitalTrendChart, CapitalLiabilityPanel, MonthlyCapitalReview.

## User flow
1. Initialize accounts. 2. User/engines create entries. 3. Update balances. 4. Detect depletion risk. 5. Monthly review. 6. Recommend capital investments. 7. Dashboard shows life-capital health.

## Integration
Specific Knowledge, Deep Work, Asset-Based Growth, Naval Life OS, Antifragile Life, Health Engine, Reflection, Personal OS Compiler. (Other engines emit capital entries as events — pairs naturally with the existing `domain_events` store.)

## Implementation order
1. Domain types → 2. Prisma schema → 3. Category seed → 4. Ledger service → 5. Balance sheet builder → 6. Scoring → 7. Agents → 8. API routes → 9. UI → 10. Integration event listeners. Before coding, output: capital category model, balance sheet design, database summary, checklist.
