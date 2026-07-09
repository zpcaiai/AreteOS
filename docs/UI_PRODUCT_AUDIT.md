# UI and product audit — 2026-06

## Verdict

Arete has unusually broad and deep capability coverage, but it is not yet a fully
polished production experience. The most important product risk is **cognitive
overhead**: users see a large library before they reliably experience one meaningful
outcome. The default journey must remain a small loop; the rest should feel like an
available depth layer, not an exam syllabus.

This audit inspected the global shell, navigation, entry path, command palette,
modal behavior, recovery states, Project Foundry, and the main cross-engine flow.
Dynamic API paths could not be exercised end-to-end in this local session because the
Postgres service was unavailable. The UI now makes that condition recoverable instead
of silently empty, but a database-backed staging pass remains required before release.

## Fixed in this pass

| Finding | Impact | Fix |
| --- | --- | --- |
| The first item on `/start` described the first-run flow but linked to the AI coach. | The primary journey started in the wrong place. | It now links to `/onboarding` and says “Run first loop”. |
| Server-page failures could leave the content pane without a calm recovery action. | A temporary data/API fault reads as a broken product. | Added global `loading.tsx` and recoverable `error.tsx` surfaces. |
| Project Foundry depended on an API even for its static capability catalog. | A temporary database failure produced an apparently empty toolbox. | The pure catalog now renders locally; saved-blueprint availability is explained with retry. |
| Share Card and command-palette dialogs lacked complete focus containment and dialog semantics. | Keyboard and screen-reader users could lose their place. | Added focus restoration/trapping, dialog labels, combobox semantics, selected state and canvas text alternative. |

## Current product structure

Use three modes in product communication and navigation, even if the codebase keeps
all engines:

1. **Do today** — onboarding, one next action, practice, reflection, weekly review.
2. **Build something** — Project Foundry, assets, deep work, decisions, experiments.
3. **Explore deeply** — the full engine library, healing, organizational and specialist
   systems.

This prevents the 100+ route surface from competing with the user's immediate intent.

## Next highest-leverage improvements

### P0 — make the core loop unmistakable

- Add a **Today** surface that asks for available time and energy, then offers exactly
  one 5/25/60-minute action. It should write back to the active protocol.
- Replace score-first copy with outcome-first copy: “publish a useful draft”, “finish
  a difficult conversation”, “test an assumption”, then show the metric as evidence.
- Introduce a progressive-disclosure navigation mode: show *Do today / Build / Explore*
  first; keep specialist engines searchable and contextual rather than equally loud.
- Add structured API error/empty/retry states to the remaining data-driven screens,
  starting with Growth Protocol, Assets, Identity Tree and Life Capital.

### P1 — make progress valuable enough to return for

- Instrument activation, first meaningful action, weekly retained use, protocol-stage
  completion, and time-to-value. Evaluate flows by cohort, not page views.
- Add an ethical re-engagement system: a user-controlled weekly cadence, a concise
  “what changed / what matters now” digest, and no shame-based streak mechanics.
- Turn project blueprints into active workspaces: a chosen MVP, owner, evidence log,
  experiment queue, weekly review and launch readiness score.
- Add personal outcome baselines and periodic self-reports. Longitudinal evidence is
  more valuable than an isolated score or AI conversation.

### P2 — deepen defensibility and trust

- Build a privacy center with per-data-source permissions, retention windows, export,
  deletion and AI-memory controls in one place.
- Expand AI evaluation from schema checks to scenario suites: bad advice prevention,
  refusal/escalation, citation of user evidence, and plan usefulness judged after use.
- Add feature flags, release notes, funnel dashboards, SLOs and staged rollouts. The
  system is broad enough that every new engine needs a controlled release path.
- For wellbeing and child areas, run domain-expert review, age/role consent checks,
  regional crisis-resource configuration and an explicit “not diagnosis/treatment”
  boundary review before promotion.

## Release gate

Before calling the UI production-complete, verify on a staging database:

1. A new user completes onboarding to a real next action in under five minutes.
2. A returning user can do today’s action, see it reflected, and review it in under
   two minutes.
3. A Project Foundry blueprint saves, reloads, exports and resumes correctly.
4. Keyboard-only use works for navigation, command palette, Share Card and every
   primary form; test at 200% zoom and mobile widths.
5. Error, empty, loading, offline and upgrade paths are each intentional and readable.
