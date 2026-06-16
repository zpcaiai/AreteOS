# Skill: Identity-Based Habit Engine

You are a Principal Identity-Based Habit Architect, Behavior Systems Designer, AI Agent Architect, and Product Engineer. Build a production-grade subsystem inside Mission OS: the **IDENTITY-BASED HABIT ENGINE**, inspired by the idea that habits are votes for identity. Do not copy copyrighted text. Build an original system around the principle that habits reinforce self-concept.

## Purpose
Help users build habits that prove and reinforce desired identities. Answer: What identity does this habit reinforce? What habit proves I'm becoming this person? What small action casts a vote for my desired identity? Which habits contradict my identity? How stable is my identity based on repeated behavior?

## Core principle
Habit is not merely behavior — it is identity evidence. Every repetition says: *this is who I am becoming.*

## Domain model (`src/domains/identity-based-habit/`)
Entities: IdentityHabitProfile, IdentityHabit, IdentityVote, IdentityProof, HabitContradiction, IdentityReinforcementLog, IdentityHabitScoreSnapshot.

**IdentityHabit**: id, userId, identityId, name, description, minimumVersion, idealVersion, frequency, identityStatement, proofStatementTemplate, createdAt, updatedAt.
**IdentityVote**: id, userId, identityId, habitId, voteType (positive | negative | neutral), proofStatement, strength, createdAt, updatedAt.
**HabitContradiction**: id, userId, identityId, behavior, contradictionDescription, severity, replacementHabit, createdAt, updatedAt.

## Identity–habit mapping
Researcher → read papers, write notes, ask questions, run experiments. Builder → ship prototypes, fix bugs, simplify systems, build daily. Investor → read annual reports, journal decisions, study incentives, avoid impulsive trades.

## Check-in system
Daily check-in: 1. Did you perform the habit? 2. What identity did it reinforce? 3. What proof did it provide? 4. What did you learn? 5. What is tomorrow's smallest identity vote? Output IdentityProof, e.g. "Today I read one paper. This proves I am becoming a disciplined researcher."

## Scoring (0–100)
IdentityHabitConsistencyScore, IdentityVoteScore, IdentityProofQualityScore, IdentityContradictionRiskScore, IdentityStabilityScore.

`IdentityStabilityScore = (HabitConsistency × PositiveVotes × ProofQuality) ÷ ContradictionRisk`.

## AI agents
IdentityHabitMapper, IdentityProofCoach, ContradictionDetector, TinyIdentityVoteGenerator, IdentityStabilityCoach.

## API routes
POST/GET `/api/identity-habits` · POST `/create` · POST `/checkin` · POST `/proof` · POST `/contradictions` · GET `/dashboard`.

## Frontend
Pages: `/identity-habits`, `/create`, `/checkin`, `/proofs`, `/dashboard`. Components: IdentityHabitCard, IdentityVoteButton, IdentityProofJournal, ContradictionWarning, IdentityStabilityChart, TinyIdentityVotePanel.

## User flow
1. Select desired identity. 2. Recommend identity habits. 3. Create habit. 4. Check in daily. 5. Generate identity proof. 6. Detect contradictions. 7. Update Identity Stability Score.

## Integration
Identity Engine, Identity Library Engine, Habit Engine, Behavior Design Engine, Reflection Engine.

## Implementation order
1. Domain model → 2. Prisma schema → 3. Identity-habit mapping service → 4. Scoring → 5. Agents → 6. API routes → 7. UI → 8. Dashboard integration.
