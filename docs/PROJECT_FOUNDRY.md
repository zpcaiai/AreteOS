# Project Foundry — universal toolbox completion layer

Arete already contains the *capability engines* required for personal development,
learning, wellbeing support, decision making, organizations and family growth. What
was missing was a product-composition layer: a reliable way to decide which engines
belong in a new, smaller project and what must surround them for that project to ship.

`/project-foundry` closes that gap.

## What it centralizes

| Layer | Previously distributed across | Project Foundry makes selectable |
| --- | --- | --- |
| Discovery | Bottleneck, Evidence, Experiments, Decisions | problem framing, opportunity scoring, validation experiments |
| Product loop | Onboarding, Protocol, Habits, Reflection, Journey | onboarding, action protocol, practice, review, dashboard |
| Intelligence | Coach, memory, Cognitive OS, Personal OS, graph | AI coach, retrieval, decision support, plan compiler, graph |
| Growth | Assets, Capital, Membership, Community | asset pipeline, ledger, billing, community |
| Organizations | Archon, Oikos, Praxis, Genius Kids | team OS, learning studio, family space, role workspaces |
| Trust | Auth, Account, Safety, events | access control, privacy, moderation/escalation, audit history |
| Delivery | APIs, analytics, PWA/i18n, tests | integration, observability, localization/offline, release guardrails |

## Operating flow

1. Start with a ready-to-edit workspace template. Each template already contains a
   first user, concrete problem, scope boundary, and selected capabilities.
2. Adjust only the details that differ for the user's situation, then save it in
   **My Workspaces**. It can be opened and revised later.
3. Forge a blueprint when a hand-off snapshot is needed. Dependencies are added
   visibly; excess scope is deferred.
4. Use the generated MVP outcome, phases, risks and release checklist as the project
   hand-off. Export the JSON dossier when a separate repository or implementation
   thread is created.
5. Return after pilot feedback, revise the workspace, and forge the next version.

## Guardrails

- A capability module is not a promise to ship every underlying Arete screen. The
  blueprint deliberately constrains a new product to one user, one outcome and one
  primary path.
- Any health, child, community or AI-coach project automatically surfaces safety,
  privacy and escalation work. It should not make diagnostic or emergency claims.
- A project without an experiment or review is flagged because it lacks a learning
  loop; a project without observability is flagged because it cannot be operated.
- The first MVP is capped at eight product capabilities. Additional selected modules
  remain in the blueprint but move to later phases.

## Persistence model

Editable workspaces are stored as `ProjectFoundry:ProjectWorkspaceSaved` domain
events. The latest event is the visible workspace and older events stay as its revision
history. Generated hand-off snapshots are stored separately as
`ProjectFoundry:ProjectBlueprintCreated` events. This keeps the planning layer
exportable and versionable without a new database schema. The pure catalog and
compiler live in `src/lib/project-foundry-catalog.ts` and `src/lib/project-foundry.ts`,
so a future CLI/repository generator can consume the same output without duplicating
product logic.

## Ready workspace library

The workspace library is grouped in the UI so a large set remains navigable rather
than becoming one long list. The browser supports category counts and full-text
search across industry, scenario, organization size, audience, problem, and keywords.
The library currently includes 82 ready-to-edit templates across ten categories:

- **Software & AI**: B2B SaaS MVP, vertical AI copilot, developer tools, enterprise
  automation, and SaaS customer success.
- **Professional services**: consulting delivery, agencies, key-account management,
  recruiting, professional firms, research, and finance operations.
- **Commerce & industry**: DTC ecommerce, retail chains, wholesale distribution,
  franchise operations, manufacturing, supply chain, and construction projects.
- **Education, platforms & organizations**: education operations, paid courses,
  media production, marketplaces, member communities, startup teams, and nonprofit
  programs.
- **Local and space services**: property/space services, hospitality, restaurants,
  fitness studios, automotive aftersales, clinics' non-clinical operations, beauty
  and pet service chains, events, and travel services.
- **By organization and scale**: home services, small-business operations and
  digitalization, AI startup validation and governance, large-enterprise strategy
  execution and shared services, state-owned-enterprise operations, and public
  institution service or research programs.

Every template is a complete editable brief—not a title or a generic prompt—and
contains an audience, a concrete operating problem, scope constraints, and a selected
capability set.
