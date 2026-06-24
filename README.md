# Arete — The Human Development OS

*Become who you are.* (formerly “Mission OS”.) An original system that helps a person — and the organizations they build — move from potential to **arete** (excellence). Inspired by widely-taught ideas; see `NOTICES.md`.

A **Human Development Operating System** — not a habit tracker or self-help app.
It helps a person evolve into an increasingly capable, effective, responsible,
creative and impactful version of themselves through 14 engines organized in a
four-layer architecture.

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the full design (layers, thinker
mapping, engines→tables, DDD + event sourcing, scoring, state machine).

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind · PostgreSQL · Prisma ·
Neo4j (knowledge graph) · zod · provider-agnostic agent layer (OpenAI/Anthropic/mock,
LangGraph-ready).

## Quick start
```bash
cp .env.example .env        # set DATABASE_URL; AI_PROVIDER defaults to "mock" (offline)
npm install
npm run prisma:generate
npm run db:push             # create schema in PostgreSQL
npm run db:seed             # demo user + starter data
npm run dev                 # http://localhost:3000
# Neo4j (optional, for the knowledge graph): apply prisma/neo4j.cypher
```

## What's implemented
- ✅ **Project Foundry (`/project-foundry`)** — a universal, composable capability catalog: select a solution pack or individual modules, then forge an exportable project blueprint with prerequisites, MVP boundary, phased delivery plan, risks and release checklist. See `docs/PROJECT_FOUNDRY.md`.
- ✅ Architecture (four layers, 14 engines) — `ARCHITECTURE.md`
- ✅ Database: `prisma/schema.prisma` (PostgreSQL) + `prisma/neo4j.cypher`
- ✅ Domain models: `src/lib/domain/`, `src/lib/scoring.ts`, personality state machine
- ✅ AI layer + **14 agents**: `src/lib/ai/`, `src/lib/agents/registry.ts`
- ✅ **REST APIs** for every engine: `/api/{mission,identity,values,decisions,
  decisions/:id/review,habits,habits/:id/log,reflection,mental-models,
  first-principles,modeling,shadow,mastery,leadership,legacy,analytics}` + `/api/agents/:name`
- ✅ **LangGraph-ready workflows**: `/api/workflows/:name` (onboarding · decision · daily) over `src/lib/ai/graph.ts`
- ✅ **Analytics + scoring**: `src/lib/analytics.ts` (all 11 scores + Growth + state-machine eval, score snapshots, growth timeline)
- ✅ **Dashboard + 10 pages**: dashboard, mission, identity, values, decisions, habits, reflection, role-models, mastery, legacy
- ✅ **Seed data**: `prisma/seed.ts` (coherent demo across all layers)

## Platform upgrades (2026-06)
- ✅ **AI Coach (`/coach`)** — stateful multi-turn coaching with **read-only tool calling** (score history, decisions, reflections, habits, shadow patterns, semantic memory recall) on OpenAI / Anthropic / Ollama, deterministic offline under mock. Turns stream live tool activity over **SSE**.
- ✅ **Personal memory (RAG)** — pgvector-backed `personal_memories` (`src/lib/memory.ts`); decisions/reflections/insights are remembered and recalled into coach + agent context. Falls back to a local hash embedding without an API key.
- ✅ **Structured outputs everywhere** — OpenAI `json_schema` strict mode, Anthropic forced tool-use, Ollama JSON-schema `format`; plus universal **prompt-injection hardening** (`src/lib/ai/sanitize.ts`) on every agent input.
- ✅ **Graph workflows** — `runGraph()` conditional state graphs with bounded loops (`decision-graph` re-scores weak decisions after first-principles + mental-model passes), alongside the sequential workflows.
- ✅ **What-if engine (`/twin`)** — deterministic counterfactual projection of the growth score from the live scoring math (`POST /api/whatif`).
- ✅ **Knowledge-graph insights (`/phronesis`)** — next-model recommendations (Neo4j traversal with Postgres fallback), latticework gaps, unresolved value tensions (`GET /api/graph/insights`).
- ✅ **Growth replay (`/timeline`)** — point-in-time event-sourcing replay slider (`POST /api/events/replay`).
- ✅ **Ambient insights** — nightly detectors: score drops, due decision reviews, shadow recurrence, habit adherence halving, reflection staleness → `/twin` + memory + events.
- ✅ **Eval harness** — `npm run eval:agents` (golden schema checks) and `-- --judge` (LLM-as-judge grading), writes `eval-report.json`.
- ✅ **i18n (zh/en)** + light/dark **theme toggle** + a11y (semantic landmarks, progressbar roles, skip link, focus rings).
- ✅ **PWA** — installable manifest + service worker with offline fallback; **React Query** data layer + shared client/server Zod validation.
- ✅ **Ops** — pino structured logs + Sentry hooks, API pagination, rate limits, `prisma migrate` baseline, parallel nightly job (`NIGHTLY_CONCURRENCY`), WeChat/Alipay webhook adapters.

## Key flows
- **Decision**: `POST /api/decisions` → `POST /api/decisions/:id/review` (runs DecisionArchitect, recomputes quality server-side, emits `DecisionReviewed`).
- **Daily loop**: `POST /api/reflection` (runs ReflectionGuide) and `POST /api/shadow` (runs ShadowDetector), or both via `POST /api/workflows/daily`.
- **Onboarding**: `POST /api/workflows/onboarding` chains Worldview → Mission → Identity → Value coaches.

## Notes
- Event sourcing: state changes append to `domain_events`; scores/timeline are projections.
- Neo4j knowledge graph is optional (apply `prisma/neo4j.cypher`); Postgres is the system of record.
- ✅ **Real auth**: cookie sessions (HMAC, `src/lib/session.ts`) + scrypt passwords; `/api/auth/{register,login,logout,me}`; `/login` page. `getUserId` prefers the session cookie and falls back to `DEV_USER_ID` for local dev. Demo login: `usr_demo@mission.local` / `mission1234`.
- ✅ **Reviews**: weekly/monthly/quarterly generators (`src/lib/reviews.ts`), `/api/reviews`, `/reviews` page.
- ✅ **Growth Timeline + Identity Evolution**: `/api/timeline`, `/timeline` page (score trends, personality-stage progression + transitions, per-identity alignment over time).

### Genius Strategies (inspired by cognitive-modeling ideas)
`/genius-strategies` reconstructs HOW a master thinks — high-leverage logical levels (identity/
beliefs/values/capabilities) plus the micro-strategy as a representational-system
sequence (V/A/K/Ad) and a T.O.T.E. loop — then turns it into an installable practice
protocol you can adopt and log fidelity against. `GeniusModeler` agent; APIs
`/api/genius-strategies` (list) + `/model` + `/adopt` + `/practice`. Seeded with 10 role models — Aristotle, Mozart, Walt Disney, Leonardo da Vinci, Nikola
Tesla, Einstein, Munger, Jobs, Dalio, Drucker (`npm run db:seed`).

### Excellence Reverse Engineering
Full pipeline: **Genius Library → Blueprint → Adapt to user → Learning Path.**
- `/models` library + `/model/[id]` six blueprint views (Identity / Belief / Decision / Creative / Learning / Failure).
- **PersonaAdapter** agent + `POST /api/excellence/adapt` + `/adaptation`: turns a genius blueprint into e.g. a *Leonardo-inspired Research Architect* for the user.
- **LearningPathGenerator** agent + `POST /api/excellence/learning-path` + `/learning-path`: a 7-stage Excellence Learning Loop (Observe→Imitate→Practice→Internalize→Adapt→Create→Teach) with step check-off.
- Neo4j Excellence Graph projection (`projectExcellenceGraph`).

### Performance & ops
- **Score cache**: read paths (dashboard, analytics, twin) use a 30s in-process TTL cache (`computeScoresCached`); writes call `invalidateScores`/`recordProgress`.
- **Live growth + state machine**: `recordProgress()` snapshots scores (deduped per day) and advances the personality stage on gate-clear; wired into reflection + decision-review writes and `POST /api/analytics/snapshot`.
- **Neo4j projection** (optional): set `NEO4J_HTTP_URL` to project the identity graph + mental-model latticework via Neo4j's HTTP API (inert when unset). Wired into identity / mental-model / modeling writes.
- **Nightly job**: `npm run nightly` (cron `0 3 * * *`) forces daily snapshots + stage eval for all users and generates weekly/monthly/quarterly reviews.
- **Auth gate**: `src/middleware.ts` redirects/401s unauthenticated requests when `AUTH_REQUIRED=true`.

### Production hardening (optional next)
- Set `AUTH_SECRET` and unset `DEV_USER_ID` to require login everywhere.
- Wire the Neo4j projection writes; add a nightly job calling `snapshotScores()` so the timeline fills automatically.
- Swap the dev-mock AI provider for OpenAI/Anthropic by setting `AI_PROVIDER` + keys.

## Agents
`GET /api/agents` lists all 14. Run one:
```bash
curl -X POST localhost:3000/api/agents/DecisionArchitect \
  -H 'content-type: application/json' \
  -d '{"title":"Take the manager role?","options":["Accept","Decline"],"identity":"Builder"}'
```
With `AI_PROVIDER=mock` each agent returns its typed example output, so the full
app runs without API keys.

## Scoring
Pure functions in `src/lib/scoring.ts` (all 0..1). Global **Growth Score** is the
geometric mean of the core layers — neglect any layer and the whole score drops.

## Membership (monthly / quarterly / annual)
Tiers **FREE → PLUS → PRO**, each available **monthly / quarterly / annual** (longer
terms are cheaper per month). Catalog + entitlements live in `src/lib/membership/plans.ts`;
`requireFeature(userId, key)` gates premium routes (throws `402`). Mock checkout
(`/api/membership/checkout` → `/api/membership/activate`) activates instantly and
**stacks remaining time**; a real Alipay / WeChat Pay notify callback can replace
`activate` in production. Pricing page at `/membership`. Pro-only features include
Digital Twin, Excellence adaptation, knowledge graph, and the two B2B engines below.

## SFM — Business Scaling Engine (Pro)
Turns founder intuition into a scalable operating system:
*Founder Genius → Success Factors → Shared Identity/Values → Decision Rules →
Operating Principles → Repeatable System → Scalable Organization.*
18 Prisma models, 11 agents (`FounderPatternExtractor` … `OrganizationalHealthAnalyst`),
pure scoring in `src/lib/praxis/scoring.ts` (**Replication Readiness** = Repeatability ×
ValuesAlignment × DecisionConsistency × CollaborationQuality × LeadershipMaturity ×
Resilience ÷ FounderDependency). 23 routes under `/api/praxis/*`; UI at `/praxis` (+ `/praxis/dashboard`).

## Leadership Leverage Engine (Pro)
Leadership across logical levels (inspired idea) — *the higher the level, the greater the leverage*:
Environment → Behavior → Capability → Belief → Identity → Mission, with roles
Caretaker → Guide → Coach → Mentor → Sponsor → Awakener. 14 Prisma models, 10 agents
(`LeadershipLeverageAnalyzer` … `AwakenerAgent`), scoring in `src/lib/archon/scoring.ts`
(**Global Leadership** = (Mission × Identity × Vision × Belonging × Readiness) ÷ BlindSpots).
13 routes under `/api/archon/*`; UI at `/archon` (+ `/archon/dashboard`).

## Genius Library
`prisma/seed-genius.ts` now seeds **20** structured Excellence Blueprints: the Strategies-of-Genius volumes
(Aristotle, Sherlock Holmes, Walt Disney, Mozart, Einstein, Freud, Leonardo da Vinci, Tesla),
SFM-era founders (Jobs, Musk, Bezos, Yunus, Munger, Dalio, Drucker), and the modern
learning/modeling set (Feynman, von Neumann, Gauss, Humboldt, Faraday). Run `npm run db:seed`.


## Management OS (Pro) — the Leverage Operating System
*Management is system design, not people control.* Inspired by widely-taught ideas — management
leverage, knowledge-worker effectiveness, tacit-knowledge capture, and anti-fragility. 7-level maturity model
(Supervisor → Org Designer). 16 Prisma models, 9 new agents (`ManagementArchitect`,
`LeverageAnalyzer`, `KnowledgeArchitect`, `KnowledgeExtractor`, `DecisionGovernanceCoach`,
`OrganizationalHealthCoach`, `OrganizationDesigner`, `ManagementTwinSimulator`, `ManagementCoach`;
reuses `AlignmentAnalyst` + `ResilienceStrategist`). Scoring in `src/lib/oikos/scoring.ts`
(**Global Management** = (Leverage × Knowledge × Alignment × DecisionQuality × Health ×
Resilience) ÷ DependencyRisk). 16 routes under `/api/oikos/*`; UI at `/oikos`
(+ `/oikos/dashboard`).


## Identity Library (the moat module)
*A Human Identity Operating System* — not personality typing. **10 identity families**
(Truth Seekers, Creators, Builders, Entrepreneurs, Investors, Leaders, Teachers,
Protectors, Transformers, Legacy Builders) and **55 seeded archetypes**, each a full
blueprint (mission, identity statement, values, beliefs, mental models, decision rules,
habits, capabilities, shadow patterns, failure modes, 8-stage growth path, legacy).
15 Prisma models, 7 agents (`IdentityExplorer`, `IdentityAssessor`, `IdentityStackBuilder`,
`IdentityConflictAnalyzer`, `IdentityEvolutionCoach`, `IdentityRecommendationAgent`,
`IdentityBlueprintGenerator`). Concepts: **Identity Stack** (primary/secondary/emerging/legacy),
**Conflict Engine**, **8-stage Evolution** (Discover→Legacy). Scoring in
`src/lib/ethos/scoring.ts` (**Global Identity** = geometric mean of clarity,
alignment, stability, conflict-resolution, evolution, integration). 8 routes under
`/api/ethos/*`; UI at `/ethos` (+ families, archetypes,
archetype/[id], assessment, stack, evolution). Seeded via `npm run db:seed`
(or `npm run db:seed:identity`).


## Cognitive OS (Pro) — judgment & decision OS
*Optimize judgment quality over information quantity.* Inspired by widely-taught ideas:
a latticework of mental models, decision quality, cognitive biases, reasoning under
uncertainty, and strategic diagnosis. 28 Prisma models (namespaced `Cog*` for the curated
library to stay distinct from the per-user mental-model engine), 9 new agents
(`LatticeworkBuilder`, `DecisionLensAnalyzer`, `BiasDetector`, `JudgmentCoach`,
`DecisionJournalGuide`, `MetaThinkingCoach`, `UncertaintyStrategist`,
`StrategicDiagnostician`, `WisdomMentor`). Seeded library: 18 core mental models, 10 biases,
8 decision lenses. Scoring in `src/lib/phronesis/scoring.ts` (**Global Cognitive** =
(ModelDiversity × Judgment × DecisionQuality × BiasResistance × Reflection × Wisdom) ÷ BlindSpots).
13 routes under `/api/phronesis/*`; UI at `/phronesis` (+ models library, dashboard).
Seeded via `npm run db:seed` (or `db:seed:cognitive`).


## Worldview OS — reality-interpretation OS
*Worldview → Mission → Identity → Beliefs → Decisions → Outcomes → (reinforce).* Extends the
original minimal Worldview engine. 10 dimensions (reality, human nature, meaning, success,
failure, responsibility, time, change, risk, purpose), 10 seeded archetypes, 6-stage evolution
(Inherited → Legacy). Reuses `Worldview`/`WorldviewDimension`/`WorldviewAssessment`/`Assumption`;
adds 8 models (WorldviewProfile, AssumptionConflict, WorldviewArchetype, MeaningProfile,
PersonalPhilosophy, LifePrinciple, WorldviewTwin, WorldviewEvolution). 6 new agents
(`AssumptionDetector`, `MeaningGuide`, `MissionGenerator`, `IdentityNavigator`,
`WorldviewSimulator`, `WorldviewTwinArchitect`) + reuses `WorldviewCoach` & `WisdomMentor`.
Scoring in `src/lib/cosmos/scoring.ts` (**Global Worldview** = geometric mean of clarity,
coherence, assumption-awareness, meaning, mission, identity, wisdom). 13 routes under
`/api/cosmos/*`; UI at `/cosmos` (+ archetypes, dashboard). By design: no political/
religious/ideological coercion — protects personal agency. Seeded via `npm run db:seed`.


## Child Development OS — Genius Kids (ages 6–18)
*Raise curious, capable, creative, resilient lifelong learners — not grades.* Optimizes the six
high-leverage capabilities (curiosity, creativity, agency, resilience, problem-solving, lifelong
learning). Inspired by widely-taught ideas: growth mindset, Montessori prepared environments,
Reggio-Emilia curiosity, and the three-role creative method. 14 Prisma models, 10 agents
(`IdentitySponsorAgent`, `GrowthMindsetCoach`, `ExplorerCoach`, `CreativityCoach`,
`MontessoriEnvironmentAdvisor`, `LearningAutonomyCoach`, `ProblemSolvingCoach`, `ProjectMentor`,
`ResilienceCoach`, `ParentCoach`). A parent account manages one or more children; child identities
(Explorer/Researcher/Creator/Builder/…) matter more than "top student". Scoring in
`src/lib/genius/scoring.ts` (**Global Child Development** = geometric mean of explorer, creator,
builder, researcher, problem-solver, resilience, autonomy, growth-mindset, parent-support).
14 routes under `/api/genius/*`; UI at `/genius` (+ per-child dashboard with a growth studio).

This completes the **Human Development Lifecycle OS**: Genius Kids (6–18) → Worldview/Identity/
Cognitive/Mission (adult growth) → Leadership/Management/SFM (organizational) → Legacy.


## 听书成长 — Audiobook / Listen-to-Grow (copyright-safe)
A study companion that reads the *ideas* behind every module aloud via the browser's Web Speech
API (TTS) — **no external service, no bundled book files**. For copyrighted works it plays
**original summaries**; public-domain works (Aristotle, Conan Doyle, Montessori, Sun Tzu, Marcus
Aurelius, Leonardo's notebooks) include longer excerpts; users may register their own legally-owned
PDF/EPUB as a personal reference and paste text from it. 4 models (AudioBook, ListeningProgress,
ListeningSession, BookNote), 6 routes under `/api/mnemosyne/*`, UI at `/mnemosyne` with a
play/pause/speed player and listening stats. Seeded catalog of 16 titles tagged by module
(`npm run db:seed` / `db:seed:audiobooks`). Carries the standard inspired-by disclaimer.

> Together the five HOOS product lines now exist in one codebase: **Mission OS** (personal
> growth) · **Worldview OS** · **Identity Library** · **Cognitive OS** (judgment) · **Leadership Leverage** ·
> **Management OS** · **SFM Scaling** · **Digital Twin** — the full HOOS stack from worldview to organizational legacy.

> After pulling these changes: `npx prisma generate && npx prisma db push && npm run typecheck`
> (the schema added 117 models — 187 total — and 81 agents).

## Attributions & legal
This is an **original** software system. It is **inspired by** general, widely-taught concepts
(which are not protected by copyright) and reproduces **no** copyrighted text, diagrams, or tables
from any book. It is **not affiliated with, endorsed by, sponsored by, or licensed from** any
author, estate, publisher, company, or rights-holder. Historical and contemporary figures in the
libraries are presented as **factual, educational case studies** and do not endorse this product.
Method and book names are used **descriptively only**, to credit the ideas that inspired the work.
See `NOTICES.md` and the in-app `/about/attributions` page. (Framing rule everywhere: "inspired by",
never "based on the book" or anything implying official authorization.)

## Testing & config
- `npm test` runs Vitest. `test/scoring.test.ts` covers the pure scoring functions across every
  engine (clamp/bounds, geometric-mean global scores, leverage weighting, divide-by-dependency
  formulas, and empty-input defaults).
- `npx tsc --noEmit` type-checks the whole project (passes clean).
- Prisma config now lives in `prisma.config.ts` (`defineConfig` from `prisma/config`), replacing the
  deprecated `package.json#prisma` key. It points at the multi-file `prisma/schema/` folder and wires
  `prisma db seed` to the full seed chain.

## Emporion — virtual-goods store (instant fulfillment)
Order flow for virtual goods: **checkout → pay → delivered & completed in the same
transaction** (no shipping state; gateway-retry-safe because fulfillment is idempotent).
Product kinds: `MEMBERSHIP_DAYS` (stacks days; guards against downgrading an active higher
tier), `CREDITS` (wallet + audit ledger), `CONTENT` (permanent unlocks). Models:
`VirtualProduct`, `StoreOrder`, `UserCredit`, `CreditLedger`, `ContentUnlock`
(`prisma/schema/emporion.prisma`). Routes under `/api/emporion/*` (catalog, checkout,
pay, orders); UI at `/emporion` (catalog, wallet, order history). Mock payment for now —
a verified Alipay/WeChat notify callback should call the same `payAndFulfill`.
Seed: `npm run db:seed:emporion` (wired into `db:seed` and `prisma db seed`).
> After pulling: run `npx prisma generate` — until then the 5 new models show expected
> stale-client type errors (19, all one cause); everything else compiles clean.

## Admin panel (/admin)
An integrated admin (ships with the Next app, no separate deploy). Gated by the
`ADMIN_EMAILS` env allowlist (`requireAdminPage` redirects non-admins; API routes
return 403 via `requireAdmin`). Pages under `/admin`: overview (users/orders/revenue/
membership-mix/recent activity), users (search + inline membership grant), orders
(view + refund/cancel), products (Emporion CRUD: create / re-price / toggle active),
memberships (manual grant/extend), and community moderation (delete posts/comments).
Routes under `/api/admin/*`. Set `ADMIN_EMAILS="you@example.com"` in Vercel env.

## Naval Life OS

A life-strategy subsystem inside Mission OS, inspired by the public ideas around
specific knowledge, judgment, leverage, wealth creation, long-term games, freedom
and happiness. It helps a user move from time-for-money work toward owned,
compounding assets and a balanced life. All content is original and educational —
it is **not** financial, legal, or medical advice.

### Core loop

> Specific knowledge → judgment → leverage → asset creation → wealth → freedom →
> happiness → better judgment → more specific knowledge.

### Thirteen engines

Specific Knowledge · Talent Stack · Leverage · Judgment · Decision Journal ·
Wealth Creation · Asset Builder · Permissionless Opportunities · Long-Term Games ·
Freedom · Happiness · Life Portfolio · Naval Digital Twin.

### Architecture

- **Schema** — `prisma/schema/naval.prisma` (28 models + 6 enums).
- **Scoring** — `src/lib/naval/scoring.ts`. Each score is the geometric mean of its
  0..1 factors × 100 (a near-zero factor still tanks the score). `GlobalNavalScore`
  is the geometric mean of the seven life drivers.
- **Agents** — `src/lib/agents/naval.ts` (13 agents, registered and exposed at
  `POST /api/agents/:name`). Tone: concise, strategic, non-motivational,
  non-therapeutic. Wealth and happiness agents carry explicit safety constraints.
- **Engine operations** — `src/lib/naval/engines.ts` runs each agent and persists
  the result via Prisma. **Read/compute** — `src/lib/naval/service.ts` assembles
  the dashboard, writes `NavalScoreSnapshot` trend rows, and generates the 90-day
  plan.
- **API** — `src/app/api/naval/*` (route groups per engine, plus `/dashboard` and
  `/plan/90-day`). Routes validate input, gate writes behind the `naval` Plus-tier
  feature, and delegate to the service layer.
- **UI** — pages under `src/app/naval/*` (overview, dashboard, and the 13 engines)
  with `src/components/naval/*` (interactive `EngineStudio`, `Radar`, `PlanButton`,
  config). Linked from the sidebar under "Naval Life OS".

### Membership

Naval engines require the **Plus** tier (`FEATURES.naval = 2`). Read endpoints are
open to any signed-in user; assessment/write endpoints call `requireFeature(userId, "naval")`.

### Seeding

`npm run db:seed:naval` (also part of `npm run db:seed`) creates a coherent
life-strategy slice for the demo user so `/naval` and the dashboard render
immediately.

### Safety

Wealth: educational framing only — no specific securities, no promised returns, no
regulated advice. Happiness: not therapy; the agent defers to professional support
on crisis/self-harm language. Business: long-term, ethical value creation only.

### Naval Life OS v2 — goals, plans, onboarding

Builds on the engines with persistence and a guided flow:

- **North-star goal** (`NavalGoal`) anchors plans and the digital twin.
- **Persisted 90-day plan** (`NavalPlan` + `NavalPlanTask`) — generated from your
  current state, with checkable tasks and a live progress bar. `/naval/plan`.
- **Onboarding** (`NavalOnboarding`) — the 11-step flow (Section 25) that resumes
  where you left off. `/naval/onboarding`.
- **Automatic digital twin** — `POST /api/naval/twin/auto` collects signals from
  every engine into `NavalTwinMemory`, then synthesizes the twin (no manual entry).
- **Due decision reviews** — `GET /api/naval/decision-journal/due` surfaces
  decisions whose review date has arrived, closing the judgment feedback loop.
- **Nightly snapshots** — set `NAVAL_NIGHTLY=true` so `npm run nightly` records a
  daily `NavalScoreSnapshot` per user for the dashboard trend line.

New v2 service logic lives in `src/lib/naval/plan.ts`; v2 routes under
`/api/naval/{goals,onboarding,plan/save,plan/active,plan/task,twin/auto,decision-journal/due}`.

## Innovation upgrades (2026-06) — depth, evidence & a mentor council

Six product innovations + four quality upgrades, all **additive** (no existing
signature changed), persisted via the existing `domain_events` event store (no new
Prisma models / migrations), with the pure math factored into dependency-light
`*-math` modules so it is exhaustively unit-tested.

### Creative engines
- **Mentor Council (`POST /api/council`)** — a panel of five thinking lenses
  (latticework / contribution / leverage / principles / first-principles) **debate**
  one question; the engine measures how much they actually agree (`consensusMetrics`:
  pairwise recommendation overlap + confidence polarization) before `CouncilModerator`
  synthesizes. The disagreement is the product. `src/lib/council*.ts`, 6 new agents.
- **Future-Self Monte Carlo (`POST /api/future-self`)** — projects a *distribution*
  of growth trajectories (p10/p50/p90 + "probability you beat today") under a
  sustained policy and volatility, then `FutureSelfAgent` writes a grounded letter
  from your future self. Deterministic & seeded. `src/lib/future-self*.ts`.
- **Growth Narrative (`POST /api/narrative`)** — turns your event-sourced history
  into the story of who you are becoming: trajectory, turning points, momentum and
  stage transitions (`assembleNarrativeSignals`) rendered by `GrowthNarrator`.
- **Evidence-driven measurement (`POST/GET /api/evidence`)** — ingests behavioral
  signals and contrasts **enacted** (decay-weighted) behavior with **stated** scores
  to expose the **identity-behavior gap** + an integrity score. `EvidenceInterpreter`
  proposes the cheapest test to close it. `src/lib/evidence*.ts`.
- **N-of-1 experiments (`/api/experiments`, `/:id`, `/:id/observe`)** — event-sourced
  hypothesis → baseline/intervention observations → causal readout (Cohen's d,
  Welch's t, approx p, plain-language verdict). Turns advice into personal science.
- **Knowledge-graph moat (`GET /api/graph/path`)** — graph-native queries over the
  mental-model latticework, Postgres-first: shortest learning path between two models,
  **emergent (predicted) connections** via common-neighbour link prediction, and the
  most central models. `src/lib/graph-path*.ts`.

### Quality upgrades
- **Measurement validity** — `scoring.ts` gains `wilsonInterval`, `sampleConfidence`,
  `withConfidence`, `compositeConfidence`: scores can now be shown as "73% ±12% (n=4)"
  instead of false precision.
- **Offline AI rubric** — `src/lib/eval/rubric.ts` grades agent outputs for
  specificity / concreteness / brevity / safety with no LLM (runs in CI under mock);
  wired into `npm run eval:agents` (adds `rubricScore` + `avgRubricScore`).
- **Trust architecture** — `GET /api/explain` (transparent Growth-Score breakdown:
  which layer drags it down and which single layer moves it most) and
  `GET /api/account/export` (portable JSON export of your own data).
- **Depth-first hero path** — `/start` page + `first-run` workflow
  (Worldview → Mission → Identity → first identity-behavior gap) so new users get one
  deep artifact instead of 14 engines at once.

### Testing
9 new Vitest suites (`test/{council,future-self,narrative,evidence,experiments,
graph-path,scoring-confidence,eval-rubric,explain}.test.ts`) cover every pure
function (consensus, Monte Carlo, narrative signals, decay/gap, graph algorithms,
Wilson/confidence, Welch/effect-size, rubric, geometric-mean leverage).
`npx tsc --noEmit` passes clean.

## UI pages + membership gates for the innovation engines (2026-06)

Each new engine now has a client page (React Query data layer, graceful 402 →
upgrade prompt via `src/components/UpgradeGate.tsx`), linked from a new **Innovation**
sidebar group:
- `/council` · `/future-self` · `/narrative` · `/evidence` · `/experiments` ·
  `/graph` · `/account` (transparency + data export).

Membership gates (`requireFeature`, `src/lib/membership/plans.ts`):
- **Pro (tier 2):** `council`, `future_self`, `graph_path`.
- **Plus (tier 1):** `narrative`, `evidence`, `experiments`.
- **Ungated by design:** `/api/explain` and `/api/account/export` — explainability and
  data portability are trust features, never paywalled. Experiment *reads* (list +
  readout) stay open; only create/observe are gated.
