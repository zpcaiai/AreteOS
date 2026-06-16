# Skill: Archetype Identity Engine

You are a Principal Identity Architect, Jungian Archetype Systems Designer, Human Development Researcher, AI Agent Architect, and Product Architect. Build a production-grade subsystem inside Mission OS: the **ARCHETYPE IDENTITY ENGINE**, inspired by Carl Jung's archetype theory and modern identity design. Do not build a shallow personality quiz, astrology-like categorization, or reduce users to labels. Build an identity architecture system that helps users discover, combine, evolve, and integrate deep identity archetypes.

## Purpose
Help users answer: Who am I becoming? Which archetypal identity patterns drive me? Which archetypes support my mission? Which conflict? Which should I develop next?

## Core principle
Occupation is not identity. Identity is a stable organizing pattern shaping attention, values, beliefs, choices, habits, relationships, purpose, and long-term behavior. Archetypes are reusable identity patterns.

## Archetype families (12, seeded)
1. Sage (truth) — Researcher, Thinker, Scholar, Philosopher, Systems Thinker
2. Creator (create new realities) — Artist, Inventor, Designer, Builder, Storyteller
3. Explorer (discover) — Adventurer, Experimenter, Futurist, Pioneer
4. Hero (overcome) — Warrior, Founder, Athlete, Performer, Challenger
5. Ruler (order/governance) — Leader, Executive, Institution Builder, Strategist
6. Caregiver (protect/nurture) — Mentor, Healer, Teacher, Parent, Steward
7. Magician (transform) — Visionary, Innovator, Scientist, Technologist
8. Everyman (belong) — Collaborator, Community Builder, Friend
9. Rebel (challenge broken systems) — Reformer, Change Agent, Disruptor
10. Lover (beauty, intimacy, devotion) — Artist, Connector, Relationship Builder
11. Jester (play, humor, freedom) — Entertainer, Improviser, Creative Facilitator
12. Innocent (trust, hope, renewal) — Beginner, Learner, Idealist

## Domain model (`src/domains/archetype-identity/`: types, events, repository, service, score, assessment)
Entities: ArchetypeFamily, Archetype, ArchetypeTrait, ArchetypeValue, ArchetypeBelief, ArchetypeHabit, ArchetypeShadow, ArchetypeGift, ArchetypeConflict, UserArchetypeProfile, UserArchetypeStack, ArchetypeEvolutionPath, ArchetypeScoreSnapshot.

**Archetype**: id, name, family, description, coreDesire, coreFear, coreQuestion, gift, shadow, values(Json), beliefs(Json), habits(Json), decisionRules(Json), growthPath(Json), createdAt, updatedAt.

**UserArchetypeProfile**: id, userId, primaryArchetypeId, secondaryArchetypeIds, suppressedArchetypeIds, emergingArchetypeIds, shadowArchetypeIds, profileSummary, createdAt, updatedAt.

## Assessment engine
Dimensions: truth seeking, creation, exploration, courage, leadership, care, transformation, belonging, rebellion, beauty, play, innocence/trust. Evaluate motivation, fear, preferred role, repeated behavior, decision style, conflict style, aspiration, shadow reaction. Sample questions: When facing uncertainty, do you seek truth, action, connection, or control? What do you most fear losing? What role do you take in a group? What problems energize you? What praise feels meaningful? What failure pattern repeats? What do you protect? What future self attracts you?

## Identity stack
Primary, Secondary, Emerging, Suppressed, Shadow, Legacy. Example: Primary Sage · Secondary Creator · Emerging Ruler · Shadow Rebel · Legacy Mentor/Caregiver.

## Conflict engine
Detect conflicts and output description, life domains affected, integration strategy, decision guidance, habit recommendations. Examples: Sage vs Hero (overthinking vs action), Creator vs Ruler (freedom vs structure), Caregiver vs Explorer (responsibility vs independence), Rebel vs Ruler (disruption vs order).

## Scoring (0–100)
ArchetypeClarityScore, ArchetypeIntegrationScore, ArchetypeConflictScore, ArchetypeShadowRiskScore, ArchetypeEvolutionScore, GlobalArchetypeIdentityScore.

## AI agents
ArchetypeAssessor, ArchetypeStackBuilder, ArchetypeConflictAnalyzer, ArchetypeShadowCoach, ArchetypeEvolutionGuide, ArchetypeIdentityNarrativeBuilder. Each: system prompt, input/output schema, TS interface, examples, failure handling, memory policy.

## API routes
GET `/api/archetypes` · GET `/:id` · POST `/assessment` · GET `/profile` · POST `/stack` · POST `/conflicts` · POST `/evolution-path` · GET `/dashboard`.

## Frontend
Pages: `/archetypes`, `/assessment`, `/profile`, `/stack`, `/conflicts`, `/evolution`. Components: ArchetypeCard, ArchetypeFamilyGrid, ArchetypeAssessmentForm, ArchetypeStackViewer, ArchetypeConflictMap, ArchetypeShadowPanel, ArchetypeEvolutionTimeline.

## User flow
1. Complete assessment. 2. Generate primary. 3. Generate secondary + emerging. 4. Detect conflicts. 5. Generate identity narrative. 6. Recommend habits + decision rules. 7. Track evolution.

## Seed data
Seed all 12 archetypes with description, core desire, core fear, values, beliefs, habits, decision rules, gifts, shadows, failure modes, growth paths.

## Implementation order
1. Domain types → 2. Prisma models → 3. Seed archetypes → 4. Assessment engine → 5. Score functions → 6. Agents → 7. API routes → 8. UI pages → 9. Dashboard integration → 10. README.
