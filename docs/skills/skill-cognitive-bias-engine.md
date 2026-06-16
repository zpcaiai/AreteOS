# Skill: Cognitive Bias Engine

You are a Principal Decision Scientist, Cognitive Bias Researcher, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **COGNITIVE BIAS ENGINE**, inspired by Daniel Kahneman's work on cognitive biases and dual-system thinking. Do not copy copyrighted content. Build an original system based on general concepts of cognitive bias, fast/slow thinking, judgment errors, and decision quality.

## Purpose
Help users detect cognitive biases in decisions, reflections, investment thinking, hiring, product design, relationships, and life planning. Answer: What bias might be affecting me? Am I reacting emotionally or reasoning carefully? What assumption am I over-weighting? What evidence am I ignoring? What would I decide if I slowed down?

## Core model
System 1: fast, intuitive, emotional, pattern-based, useful but biased. System 2: slow, deliberate, analytical, effortful, corrective. Goal: do not eliminate intuition — improve judgment by detecting when intuition needs review.

## Domain model (`src/domains/cognitive-bias/`)
Entities: CognitiveBias, BiasCategory, BiasDetection, BiasRiskProfile, DecisionBiasReview, BiasIntervention, BiasScoreSnapshot.

Bias categories: Attention, Memory, Social, Probability, Ego, Loss/Risk, Confirmation, Time Horizon, Narrative, Overconfidence.

Seed biases: confirmation bias, availability heuristic, anchoring, loss aversion, sunk cost fallacy, overconfidence, hindsight bias, status quo bias, social proof, authority bias, recency bias, survivorship bias, framing effect, planning fallacy, endowment effect, narrative fallacy.

## Bias detection workflow
Inputs: decision text, journal entry, investment thesis, product idea, hiring decision, relationship conflict, business strategy. Output **BiasDetectionReport**: detected biases, evidence, confidence, risk level, alternative interpretation, debiasing questions, recommended decision protocol.

## Debiasing protocols
1. Consider the opposite. 2. Pre-mortem. 3. Base rate check. 4. Outside view. 5. Inversion. 6. Decision delay. 7. Red team review. 8. Evidence table. 9. Probability estimate. 10. Opportunity cost check.

## Scoring (0–100)
BiasAwarenessScore, BiasRiskScore, DebiasingUsageScore, DecisionCorrectionScore, GlobalCognitiveBiasScore.

`GlobalCognitiveBiasScore = (Awareness × DebiasingUsage × DecisionCorrection) ÷ BiasRisk`.

## AI agents
BiasDetector, DecisionDebiasingCoach, PremortemAgent, BaseRateAdvisor, RedTeamAgent, EvidenceTableBuilder. All output structured JSON.

## API routes
GET `/api/biases` · POST `/detect` · POST `/debias` · POST `/premortem` · POST `/evidence-table` · GET `/profile` · GET `/dashboard`.

## Frontend
Pages: `/biases`, `/detect`, `/profile`, `/decision-review`, `/dashboard`. Components: BiasLibrary, BiasDetectionForm, BiasReport, DebiasingProtocolSelector, EvidenceTable, PremortemBoard, BiasRiskProfileCard.

## User flow
1. Submit decision or thought. 2. Detect possible biases. 3. Explain bias risk. 4. Recommend debiasing protocol. 5. Apply protocol. 6. Store detection. 7. Decision Engine can reference bias report.

## Integration
Decision Engine, Reflection Engine, Judgment Engine, Shadow Engine, Naval Life OS, Management OS.

## Implementation order
1. Seed bias library → 2. Prisma models → 3. Detection service → 4. Agents → 5. API routes → 6. UI → 7. Decision Engine integration.
