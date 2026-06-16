# Mission OS / Arete — Skills Library (20 executable engine specs)

Each file in this folder is a **self-contained build prompt** for one subsystem of
Mission OS / Arete. They are written to be handed to Claude Code (or used as design
specs): every skill states its goal, domain model, database entities, scoring,
agents, API routes, pages, and implementation order. All are "inspired by" widely
taught ideas — no copyrighted text is reproduced.

> Note: these are **prompt/design documents**, not runtime Cowork skills. Move them
> to `.claude/skills/` if you want them discoverable by Claude Code, or keep them
> here as the canonical engine backlog.

## The 20 engines

| # | File | Engine |
|---|------|--------|
| 1 | `skill-specific-knowledge-engine.md` | Specific Knowledge (Naval) |
| 2 | `skill-archetype-identity-engine.md` | Archetype Identity (Jung) |
| 3 | `skill-principle-centered-life-engine.md` | Principle-Centered Life (Covey) |
| 4 | `skill-deliberate-practice-engine.md` | Deliberate Practice (Ericsson) |
| 5 | `skill-cognitive-bias-engine.md` | Cognitive Bias (Kahneman) |
| 6 | `skill-double-loop-learning-engine.md` | Double-Loop Learning (Argyris) |
| 7 | `skill-flow-state-engine.md` | Flow State (Csikszentmihalyi) |
| 8 | `skill-intrinsic-motivation-engine.md` | Intrinsic Motivation (Deci & Ryan) |
| 9 | `skill-antifragile-life-engine.md` | Antifragile Life (Taleb) |
| 10 | `skill-deep-work-engine.md` | Deep Work (Newport) |
| 11 | `skill-growth-mindset-engine.md` | Growth Mindset (Dweck) |
| 12 | `skill-behavior-design-engine.md` | Behavior Design (Fogg) |
| 13 | `skill-identity-based-habit-engine.md` | Identity-Based Habit |
| 14 | `skill-ooda-adaptive-action-engine.md` | OODA Adaptive Action (Boyd) |
| 15 | `skill-design-thinking-engine.md` | Design Thinking |
| 16 | `skill-creativity-capability-engine.md` | Creativity Capability (Amabile) |
| 17 | `skill-mastery-learning-engine.md` | Mastery Learning (Bloom) |
| 18 | `skill-experiential-learning-engine.md` | Experiential Learning (Kolb) |
| 19 | `skill-learning-organization-engine.md` | Learning Organization (Senge) |
| 20 | `skill-psychological-safety-engine.md` | Psychological Safety (Edmondson) |

## Recommended build order (product loops, not theory order)

**Personal high-leverage growth loop**
1. Specific Knowledge → 10. Deep Work → 4. Deliberate Practice → 7. Flow State

**Judgment & learning loop**
5. Cognitive Bias → 6. Double-Loop Learning → 3. Principle-Centered Life

**Identity & long-term life loop**
2. Archetype Identity → 8. Intrinsic Motivation → 9. Antifragile Life

**Then batch two (product loops)**
- Personal: 11. Growth Mindset → 12. Behavior Design → 13. Identity-Based Habit → 18. Experiential Learning
- Create & act: 14. OODA → 15. Design Thinking → 16. Creativity Capability
- Learning & org: 17. Mastery Learning → 19. Learning Organization → 20. Psychological Safety

## Layered capability map (how they compose)

```
Identity layer:      Archetype Identity · Identity-Based Habit
Belief layer:        Growth Mindset · Principle-Centered Life
Behavior layer:      Behavior Design · Deep Work · Flow
Capability layer:    Deliberate Practice · Mastery Learning · Experiential Learning
Cognition layer:     Cognitive Bias · Double-Loop Learning · OODA
Creation layer:      Design Thinking · Creativity Capability
Life-strategy layer: Specific Knowledge · Antifragile Life
Organization layer:  Learning Organization · Psychological Safety
```

Main throughline:

```
Identity → Specific Knowledge → Deep Work → Deliberate Practice → Flow
→ Judgment → Double-Loop Learning → Antifragility → Freedom
```

## House rules for every engine (apply when building)

- Fit the existing architecture: `src/lib/<engine>*` pure logic, agents in
  `src/lib/agents/*` (export only Agent instances), API under `src/app/api/<engine>/*`
  using `route()/parseBody/getUserId`, pages under `src/app/<engine>/*`.
- Keep all scoring as **pure functions in 0..1 / 0..100**, unit-tested.
- Persist via the event store (`domain_events`) where a new table isn't essential;
  add Prisma models only when needed (requires `prisma generate`).
- Gate premium engines with `requireFeature`; keep transparency/data-export open.
- "Inspired by" framing everywhere; never reproduce copyrighted text.

---

## ✅ Implementation status (2026-06) — all 20 are LIVE

Rather than 20 near-duplicate subsystems, the 20 engines ship through one DRY,
fully-typed framework (all scoring unit-tested; offline-safe via event sourcing):

- **Scoring core** — `src/lib/skills-scoring.ts` (`scoreEngine`: mean / geomean /
  bounded-ratio, 0–100). Each spec formula maps to one of these modes.
- **Catalog** — `src/lib/skills-catalog.ts`: all 20 engines as data (slug, tier,
  scoring mode, factors with **bilingual zh/en labels**, coach prompt, mock example).
- **Coaches** — `src/lib/agents/skills-coaches.ts`: a factory builds 20 coach agents
  sharing one input/output contract; each carries an engine-specific system prompt
  and runs offline under the mock provider.
- **Service** — `src/lib/skills-service.ts`: `assessSkill` scores the factors, runs
  the coach, and persists each assessment as a `Skill:<slug>` **domain event**
  (no new Prisma tables); `latestSkill` reads it back.
- **API** — `POST/GET /api/skills/[engine]` (one dynamic route for all 20). POST is
  membership-gated via `requireFeature(skill_<slug>)`; GET (latest) is open.
- **UI** — `src/components/SkillEngineRunner.tsx` + `src/app/skills/[engine]/page.tsx`:
  one bilingual page renders any engine (self-rate factors → score + coach guidance),
  with graceful upgrade prompts. Linked from the sidebar's **Skills Library** group.
- **Membership** — `src/lib/membership/plans.ts`: 12 engines at **Plus**, 8 at **Pro**.

Visit any engine at `/skills/<slug>` (e.g. `/skills/specific-knowledge`,
`/skills/deep-work`, `/skills/psychological-safety`). The original per-engine specs
above remain the blueprint if you later want to expand any one into a deeper,
bespoke subsystem (richer multi-agent flows, dedicated tables, custom visualizations).

---

## Orchestration layer (8 meta-engines)

The 20 engines above are capabilities. These 8 compose them into one closed loop —
diagnose → prescribe → practice → compound → re-compile. Build them in this order:

| # | File | Role |
|---|------|------|
| 1 | `skill-growth-protocol-engine.md` | The shared growth loop every engine maps to (Observe→Diagnose→Design→Practice→Reflect→Update→Compound) |
| 2 | `skill-bottleneck-diagnosis-engine.md` | Find the real constraint (16 bottleneck types, rules + AI) |
| 3 | `skill-growth-prescription-engine.md` | Turn a diagnosis into a precise, time-bounded intervention |
| 4 | `skill-identity-evolution-tree-engine.md` | Long-term identity progression (quests + unlocks) |
| 5 | `skill-asset-based-growth-engine.md` | Measure growth by durable, compounding assets |
| 6 | `skill-life-capital-ledger-engine.md` | Track 12 forms of life capital (deposits/withdrawals/balance sheet) |
| 7 | `skill-personal-boardroom-engine.md` | 10-advisor board for high-stakes decisions (extends the Mentor Council) |
| 8 | `skill-personal-os-compiler.md` | Top-level: compile a desired identity into an executable life OS |

Rationale: Growth Protocol is the substrate; Diagnosis finds the problem; Prescription
gives the plan; the Identity Tree gives the long path; Asset Growth makes it compound;
the Capital Ledger records the long-term balance sheet; the Boardroom raises decision
quality; and the Personal OS Compiler is the single top-level entry that wires them all.

Final product loop:

```
Who do I want to become?
  ↓  Personal OS Compiler compiles a life OS
  ↓  Bottleneck Diagnosis finds the constraint
  ↓  Growth Prescription generates the plan
  ↓  Execute: habits / deep work / deliberate practice
  ↓  Asset-Based Growth produces durable output
  ↓  Life Capital Ledger accumulates long-term capital
  ↓  Identity Evolution Tree advances the identity
  ↓  Re-compile a higher version of yourself
```

### How these map onto what's already built
- **Personal Boardroom** ≈ the shipped **Mentor Council** (`/council`) generalized to
  10 named advisors + a decision memo — reuse its orchestrator + consensus metrics.
- **Bottleneck → Prescription → Growth Protocol** can ride the shipped **Skills-Library
  framework** + **event sourcing** (`domain_events`) instead of new Prisma tables, so
  they stay offline-safe like the rest of this codebase.
- **Asset / Life-Capital / Identity-Tree** emit and read domain events, composing with
  the Evidence, Future-Self, and Narrative engines already in place.

> All 28 specs are blueprints. The 20 capability engines are **implemented** via the
> framework (see status above); these 8 orchestration engines are speced and ready to
> build next, in the order listed.


---

## ✅ Orchestration layer — chain 1 of 8 implemented (2026-06)

The diagnose→prescribe→loop→decide spine is now LIVE (offline-safe via event sourcing,
all scoring/rules unit-tested, membership-gated, bilingual UI):

- **Growth Protocol** — `/growth-protocol`, `src/lib/protocol-scoring.ts` + `growth-protocol.ts`.
  7-stage event-sourced runs; global score = geometric mean of stages (incomplete loops tank).
- **Bottleneck Diagnosis** — `/bottlenecks`, `src/lib/bottleneck-rules.ts` (16 types, rule map)
  + `BottleneckDiagnostician` agent. Rules first, AI refines.
- **Growth Prescription** — `/prescriptions`, `src/lib/prescription-templates.ts` (16 templates)
  + `PrescriptionGenerator`. Prefilled from your latest diagnosis → 7-day / 30-day plan.
- **Personal Boardroom** — `/boardroom`, 10 advisor lenses + synthesizer + decision-memo writer,
  reusing the shipped **Mentor Council** consensus math (`council-math.ts`).

API: `/api/{bottlenecks,prescriptions,growth-protocol,growth-protocol/[id],boardroom}`.
Membership: `bottleneck`/`prescription`/`growth_protocol` = Plus, `boardroom` = Pro.
Nav: sidebar group **Diagnose & Decide**. Remaining 4 meta-engines (Identity Evolution Tree,
Asset-Based Growth, Life Capital Ledger, Personal OS Compiler) are speced and queued.


---

## ✅ Flagship + remaining meta-engines implemented (2026-06)

- **Specific Knowledge · Flagship** — `/specific-knowledge`: rare-combination **graph viz** + two agents (`RareCombinationAnalyzer`, `AssetOpportunityGenerator`) + moat score. `specific-knowledge-math.ts`.
- **Identity Evolution Tree** — `/identity-tree`: 14-node tree **SVG** + evidence-based progress/unlock + quest agent. `identity-tree-catalog.ts`.
- **Asset-Based Growth** — `/assets`: 10-stage pipeline + portfolio score + build-planner agent. `asset-growth-math.ts`.
- **Life Capital Ledger** — `/life-capital`: 12 capital accounts (entries = events) + balance sheet + analyst. `capital-ledger-math.ts`.
- **Personal OS Compiler** — `/personal-os`: 10 OS templates + intent router + `PersonalOSSynthesizer` compiling a full executable life OS (versioned). `os-compiler-templates.ts`.

API under `/api/{specific-knowledge,identity-tree,assets/growth,life-capital,personal-os}`. Membership: `identity_tree`/`asset_growth`/`life_capital` = Plus, `personal_os` = Pro, Specific Knowledge reuses `skill_specific_knowledge`. Nav group **Identity & Life OS**. All scoring/rules/templates unit-tested; event-sourced; bilingual.

This completes all 8 orchestration meta-engines + the first capability flagship; the closed loop (compile → diagnose → prescribe → protocol → assets → capital → identity → recompile) is fully wired.


---

## ✅ Deep Work flagship + protocol orchestration (2026-06)

- **Deep Work · Flagship** — `/deep-work`: live focus **timer**, in-session **distraction telemetry**, a 28-day **calendar heatmap (SVG)**, focus-depth/consistency/output sub-scores, and a per-session review coach. `deep-work-math.ts` (session focus depth, bounded global, heatmap aggregation).
- **End-to-end orchestration** — Growth Protocol now DRIVES the engines: its **diagnose** stage runs the Bottleneck Diagnosis engine and its **design** stage runs the Growth Prescription engine (`orchestrateDiagnose`/`orchestrateDesign`; `/api/growth-protocol/[id]` actions `diagnose`/`design`; "Auto-diagnose / Auto-design" buttons on `/growth-protocol`).

The full loop is now executable inside one protocol run: compile → **observe → (auto) diagnose → (auto) design** → practice (Deep Work) → reflect → update → compound. Two capability flagships (Specific Knowledge, Deep Work) now ship with dedicated visualizations + multi-agent/telemetry depth.


---

## ✅ Protocol one-click full loop + Deep Work trends (2026-06)

- **Growth Protocol drives every engine** — the **practice** stage logs a Deep Work session, the **compound** stage creates an Asset + deposits Life Capital, and **`runFullLoop`** executes all 7 stages in one click (observe → Bottleneck diagnose → Prescription design → Deep Work practice → reflect → update → Asset/Capital compound). `/api/growth-protocol/[id]` actions: `practice`, `compound`, `full-loop`; the `/growth-protocol` page has a **⚡ Run full loop** button with a per-engine summary.
- **Deep Work trends** — the dashboard heatmap now has a **daily-minutes trend line** and a **4-week summary** (minutes / sessions / avg score) via `weeklySummary`.

The Human-Development OS is now a single closed loop you can run end-to-end: describe who you want to become → compile an OS → run a protocol that diagnoses, prescribes, has you practice deeply, and compounds the output into assets and life capital → re-compile a higher version.


---

## ✅ Onboarding first-run + mission control (2026-06)

- **First-run loop** — `/onboarding`: two questions (who you want to become + what's blocking you) → the app compiles a life OS, starts a protocol run, and runs the full loop in one pass, then shows your OS + the diagnose→design→practice→compound result with links into every engine. Chains `/api/personal-os` → `/api/growth-protocol` → `/api/growth-protocol/[id]` (full-loop); graceful upgrade prompt.
- **Mission control** — `/journey` + `GET /api/journey` (`journey.ts`): one page aggregating the latest state of every engine — protocol top score, current bottleneck, latest prescription, Deep Work score/minutes, Specific-Knowledge moat, asset portfolio, life-capital global + weakest, identity-tree unlock progress — each tile linking to its engine.

A brand-new user can now go from a sentence to a fully-executed growth loop in under a minute, then watch every engine's progress converge on `/journey`. Nav: **First Run · Full Loop** and **Journey · Mission Control** at the top of the sidebar.


---

## ✅ Dashboard landing + shareable growth card (2026-06)

- **Mission control on the home page** — the cross-engine overview is extracted into a reusable `JourneyTiles` component and now renders at the **top of `/dashboard`** (default landing) as well as on `/journey`. Eight tiles (protocol / bottleneck / prescription / deep work / specific knowledge / assets / life capital / identity tree), each linking to its engine.
- **Shareable growth card** — the `/onboarding` result screen has a **🪪 Create a shareable growth card** button that opens the existing `ShareCardModal` (1080×1350 PNG, 4 templates, download + copy-to-clipboard) pre-filled with the user's mission + first-loop summary (diagnose · Deep Work · protocol score) and identity stack as the byline.

New users now land in a guided first-run, walk the full loop, can share the result as an image, and return to `/dashboard` where the whole journey is aggregated by default.


---

## ✅ Journey sparklines + weekly growth card (2026-06)

- **Sparklines on every journey tile** — each `/journey` (and dashboard) tile now shows a small trend line; Deep Work uses daily session scores, Growth Protocol uses run scores, and Life Capital / Specific Knowledge use real history series (`capitalHistory`, `specificKnowledgeHistory`).
- **Weekly growth card + scheduled task** — `src/lib/growth-card.ts` composes a shareable weekly card (`composeCardText`, pure + tested) from the cross-engine overview + growth score, persisted as a `WeeklyCard` event. `GET/POST /api/growth-card`; **`npm run weekly`** (`scripts/weekly.ts`, cron `0 9 * * 1`) generates one for every user. The card surfaces on `/dashboard` via `WeeklyCardBanner` (the in-app "push") with a **Share card** button that reuses `ShareCardModal` (PNG export).

Set up the push with a scheduled task: `0 9 * * 1  cd <repo> && npm run weekly` (mirrors the existing nightly cron), or wire it to a Cowork scheduled task.


---

## ✅ Production weekly push — secret-protected cron endpoint (2026-06)

- **`GET/POST /api/cron/weekly`** (`src/app/api/cron/weekly/route.ts`) generates weekly growth cards for **all** users with no session — authorized by `CRON_SECRET` via `?secret=...` or `Authorization: Bearer <secret>` (Vercel-Cron style). Shares `runWeeklyForAllUsers()` with `npm run weekly`, so script and endpoint never drift.
- **Wire it up:** set `CRON_SECRET` in env, then trigger weekly from any cron:
  - Server crontab: `0 9 * * 1 curl -fsS "$APP_URL/api/cron/weekly?secret=$CRON_SECRET"`
  - Vercel Cron: add `{ "path": "/api/cron/weekly", "schedule": "0 9 * * 1" }` and send `Authorization: Bearer $CRON_SECRET`.
  - Cowork scheduled task: point the existing `areteos-weekly-growth-cards` task at the URL (fetch it) instead of `npm run weekly` — robust regardless of local toolchain or whether a machine is on.


---

## ✅ Optimization pass — architecture / loop / UI / flow (2026-06)

Acting on the architecture/loop/UI/flow review, in priority order:

- **[fixed] Onboarding no longer fabricates data** — `runFullLoop` is now non-destructive: it diagnoses + prescribes for real but records **practice/compound as plans** (and a persisted decision rule), never faking a Deep Work session / Asset / Life-Capital deposit. Onboarding is relabeled a *starting plan* ("complete each step for real to log progress"). Standalone `orchestratePractice/Compound` remain for genuine user-logged data.
- **[closed loop] `Update` actually changes the system** — `orchestrateUpdate` derives a decision rule from the prescription and persists it (`LoopUpdate`/`DecisionRuleUpdated`, readable via `latestDecisionRules`).
- **[closed loop] Evidence → diagnosis** — `evidenceSignalsFromGaps` maps identity-behavior overclaims onto bottleneck signals; `diagnoseBottleneck({ useEvidence })` merges them, and the full loop diagnoses with evidence on by default (toggle on `/bottlenecks`).
- **[UX] One next action** — `/api/next-action` + `NextActionBanner` pins the single highest-leverage action (latest prescription's first step / bottleneck recommendation) to the **top of `/dashboard`**.
- **[UX] Navigation consolidated** — the 20 Skills links collapse into a single searchable index at `/skills`.
- **[trust] Data lifecycle** — `POST /api/account/reset` wipes only the growth-loop events (sample data / fresh start), surfaced as a confirm-gated control on `/account`.

**Deferred (with reason):**
- *Read-model projection tables + projector* for the event-sourced engines (replace per-request replay/recompute) — requires `prisma generate`/migrations, blocked offline in this environment; do it once online. The pure-math cores are already separated so this is a mechanical follow-up.
- *Full i18n migration* of the 2026 pages into the central `t()` dictionary — large and risky; the pages are already fully bilingual via inline `T(zh,en)`, so this is cleanup, not a functionality gap.


---

## ✅ Projection cache + i18n unification (2026-06)

- **Projection cache** — `src/lib/cache.ts` (`cached`/`invalidateCache`, mirrors `computeScoresCached`). The heaviest read path, `journeyOverview` (8 engines + an events query, hit by `/dashboard`, `/journey`, and the weekly card), is now memoized with a 20s TTL — removing the per-request replay/recompute hot path.
  - *Note:* real DB read-model **projection tables + a projector** are still the proper fix but remain blocked offline (`prisma generate` → 403 on the engine download). The pure-math cores are already separated, so promoting them to tables is a mechanical follow-up once online.
- **i18n unified** — added `useT()` to `src/lib/i18n/client.tsx` and replaced the duplicated inline `const T = (zh,en) => …` closure in **18 pages/components** with `const T = useT()`. One bilingual helper, centralized; pages stay fully zh/en. (Full migration of every string into the central `t()` dictionary remains unnecessary churn — everything is already bilingual — so it's intentionally not done.)


---

### Projection table — ready to apply with one online command

`prisma generate`/`migrate` stay blocked in this offline sandbox (engine 403), so the projection **table** is shipped ready-to-apply, not applied here. The code is live and **degrades gracefully until the table exists**:

- `src/lib/projections.ts` — raw-SQL read/write/clear (no generated-client dependency).
- `journeyOverview` — two-tier: in-process 20s → DB projection 120s → recompute + persist (falls back to compute pre-migration).
- `prisma/schema/projections.prisma` (`EngineProjection`), migration `prisma/migrations/20260616090000_engine_projections/`, and `prisma/sql/engine_projections.sql`.
- **Apply:** `npx prisma migrate deploy` (prod) or `npx prisma migrate dev` (local). Nothing else changes.
