# MISSION OS — Architecture

**A Human Development Operating System.** Not a habit tracker, productivity app, or
self-help platform. It exists to help a person evolve into an increasingly capable,
effective, responsible, creative, and impactful version of themselves.

## Foundational loop

```
Worldview → Mission → Identity → Values → Mental Models → First Principles
→ Decisions → Behavior → Habits → Mastery → Leadership → Legacy
```

Reinforcement loop that drives evolution:

```
Mission → Identity → Values → Decisions → Habits → Character → Outcomes → (back to) Identity
```

## Four-layer architecture

| Layer | Name | Engines | Thinker | Question answered |
| --- | --- | --- | --- | --- |
| **1** | Worldview | Worldview | — | What is true? |
| **2** | Direction (Mission + Identity) | Mission, Identity, Values | **Dilts** (who to become), **Covey** (mission alignment) | Who am I becoming, and why? |
| **3** | Thinking | Mental Models, First Principles, Decisions, Excellence Modeling | **Munger** (how to think), **Musk** (how to break through), **Dilts** (model excellence) | How do I think and decide? |
| **4** | Execution | Habits, Mastery, Leadership, Legacy, Reflection, Shadow | **Drucker** (how to contribute), **Dalio** (how to reflect) | How do I act, improve, and contribute? |

Thinker mapping: **Dilts** → who to become; **Munger** → how to think; **Musk** →
how to break through; **Drucker** → how to contribute; **Dalio** → how to reflect;
**Covey** → how to align to mission.

## Personality Evolution State Machine

`UNAWARE → EXPLORER → BUILDER → OPERATOR → STRATEGIST → CREATOR → LEADER → LEGACY_BUILDER`

Each stage has a goal that gates transition (awareness → discover values/strengths →
identity formation → habit formation → decision optimization → mastery → influence →
institution building). Transitions are computed from scores + events (see
`src/lib/personality/stateMachine.ts`) and recorded in `personality_transitions`.

## 14 Engines → tables

1. **Worldview** — `worldviews`, `worldview_dimensions`, `worldview_assessments`
2. **Mission** — `missions`, `visions`, `life_themes`, `constitutions`
3. **Identity** — `identities`, `roles`, `identity_scores`, `identity_history`
4. **Values** — `values`, `value_rankings`, `value_conflicts`
5. **Mental Models** (Munger latticework) — `mental_models`, `model_connections`, `model_usage_logs`
6. **First Principles** (Musk) — `first_principle_maps`, `assumptions`, `root_causes`, `constraints`
7. **Decisions** — `decisions`, `decision_options`, `decision_reviews`
8. **Excellence Modeling** (Dilts) — `role_models`, `identity_patterns`, `decision_patterns`, `habit_patterns`
9. **Habits** — `habits`, `habit_logs`, `habit_identity_links`
10. **Shadow** — `shadow_patterns`, `shadow_events`, `interventions`
11. **Reflection** (Dalio) — `reflections`, `lessons`, `reviews`
12. **Mastery** — `skills`, `mastery_levels`, `skill_progress`
13. **Leadership** — `leadership_metrics`, `influence_logs`
14. **Legacy** — `legacy_projects`, `mentees`, `knowledge_assets`

Cross-cutting: `personality_states`/`personality_transitions`, `score_snapshots`,
`domain_events` (event store).

## DDD + Event Sourcing

- **Aggregates** (one per engine bounded context): MissionAggregate, IdentityAggregate,
  DecisionAggregate, HabitAggregate, MasteryAggregate, etc. Each owns its tables and
  invariants; cross-aggregate coordination is via events, not foreign keys.
- **Event store**: every state-changing command appends to `domain_events`
  (`aggregateType`, `aggregateId`, `type`, `payload`, `version`, `occurredAt`).
  Read models / scores / the Neo4j projection are derived from this log, so the
  **Growth Timeline** and **Identity Evolution** views are replayable history, not
  mutable snapshots.
- **Projections**: PostgreSQL read tables (`score_snapshots`, `reviews`,
  `identity_history`) + the Neo4j knowledge graph (`prisma/neo4j.cypher`).

```
Command → Aggregate (invariant check) → append DomainEvent → projectors update:
   ├─ Postgres read models (scores, reviews)
   ├─ Neo4j graph (latticework, identity graph)
   └─ Personality state machine (maybe transition)
```

## Scoring

All scores are 0..1 pure functions (`src/lib/scoring.ts`), snapshotted to
`score_snapshots` for trends.

- Mission Alignment, Identity Alignment, Value Integrity, Mental Model Usage,
  First Principle, Decision Quality, Habit Consistency, Mastery, Leadership, Legacy,
  Reflection.
- **Global Growth Score** = geometric mean of the core factors
  (Mission × Identity × Values × MentalModels × FirstPrinciples × Decisions × Habits
  × Reflection × Mastery) — a product, so any neglected layer drags the whole system
  down (no faking growth by maxing one axis).

## AI Agents (14)

Provider-agnostic TS layer (`src/lib/ai/`) over OpenAI / Anthropic / mock, with a
LangGraph-ready orchestration seam. Each agent = system prompt + zod input/output
schema + example + TS type (`src/lib/agents/`):

MissionCoach, WorldviewCoach, IdentityCoach, ValueCoach, MentalModelCoach,
FirstPrincipleCoach, DecisionArchitect, ExcellenceModeler, HabitArchitect,
ShadowDetector, ReflectionGuide, MasteryCoach, LeadershipAdvisor, LegacyAdvisor.

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS · PostgreSQL · Prisma ·
Neo4j (knowledge graph) · zod · LangGraph-ready agent layer (OpenAI/Anthropic).

## Build order (incremental)

1. ✅ System architecture (this doc)
2. ✅ Database design — `prisma/schema.prisma` (+ `prisma/neo4j.cypher`)
3. ✅ Domain models — `src/lib/domain/*`, `src/lib/scoring.ts`, state machine
4. ✅ Agent specifications — `src/lib/agents/*`
5. ⏳ REST APIs — `src/app/api/**`
6. ⏳ LangGraph workflows — `src/lib/ai/graphs/*`
7. ⏳ Dashboard pages + analytics + reviews + knowledge graph + timeline + identity viz
```
