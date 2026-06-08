# Mission OS — Build Skills (Claude Code)

21 packaged Claude Code skills (00–20) that drive Mission OS development end to
end. Each lives at `.claude/skills/<slug>/SKILL.md` with frontmatter, so Claude
Code auto-discovers them; invoke a skill by name (e.g. `skill-mission-engine`).

Differentiator (keep this in mind for every skill): **the product is not a habit
tracker. Mission drives identity, identity drives behavior, and behavior reinforces
the personality.**

## The 21 skills

| # | Skill | Purpose |
| --- | --- | --- |
| 00 | `skill-project-foundation` | Project skeleton (Next.js 15 + TS + Tailwind + Prisma) |
| 01 | `skill-domain-modeling` | DDD model for all 17 bounded contexts |
| 02 | `skill-database-prisma-schema` | Full PostgreSQL / Prisma schema |
| 03 | `skill-agent-architecture` | 16-agent system + registry + AI provider |
| 04 | `skill-worldview-engine` | Worldview Engine |
| 05 | `skill-mission-engine` | Mission Engine |
| 06 | `skill-identity-engine` | Identity Engine |
| 07 | `skill-values-engine` | Values Engine |
| 08 | `skill-belief-engine` | Belief Engine |
| 09 | `skill-mental-model-engine` | Mental Model Engine (Munger) |
| 10 | `skill-first-principle-engine` | First Principle Engine (Musk) |
| 11 | `skill-decision-engine` | Decision Engine |
| 12 | `skill-modeling-engine` | Excellence Modeling (Dilts) |
| 13 | `skill-habit-engine` | Identity-driven Habit Engine |
| 14 | `skill-reflection-engine` | Reflection Engine (Dalio) |
| 15 | `skill-shadow-engine` | Shadow Engine |
| 16 | `skill-mastery-engine` | Mastery Engine |
| 17 | `skill-digital-twin` | Digital Twin |
| 18 | `skill-growth-analytics` | Growth Analytics |
| 19 | `skill-dashboard-ux` | Dashboard UX |
| 20 | `skill-mvp-integration` | MVP integration |

## Recommended build order

```
00 → 01 → 02 → 03                      # foundation, domain, schema, agents
→ 05 → 06 → 13 → 14 → 19 → 20          # MVP core: Mission, Identity, Habit, Reflection, Dashboard, integrate
→ 08 → 12 → 11                         # Belief, Modeling, Decision
→ 09 → 10                              # Munger (Mental Models), Musk (First Principles)
→ 15 → 16 → 17 → 18                    # Shadow, Mastery, Digital Twin, Analytics
→ 04 → 07                              # Worldview, Values (fold in alongside Direction layer)
```

Phase 1 (ship a usable MVP first): **Mission · Identity · Habit · Reflection ·
Dashboard.** Phase 2: **Belief · Modeling · Decision.** Phase 3: **Munger · Musk ·
Shadow · Digital Twin · Analytics.**

> Note: much of the foundation these skills describe (00–03, plus Mission, Identity,
> Values, Decisions, Habits, Reflection, Mental Models, First Principles, Modeling,
> Shadow, Mastery, Leadership, Legacy, Analytics, Dashboard, auth, reviews, timeline)
> is already implemented in this repo — see `ARCHITECTURE.md` and `README.md`. Use
> the remaining skills (Worldview, Beliefs, Digital Twin) to extend it, and the
> others to regenerate/refine modules consistently.
