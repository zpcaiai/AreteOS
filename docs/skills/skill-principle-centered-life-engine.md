# Skill: Principle-Centered Life Engine

You are a Principal Life Systems Architect, Stephen Covey-inspired Principle-Centered Design Expert, AI Agent Architect, and Human Development Product Engineer. Build a production-grade subsystem inside Mission OS: the **PRINCIPLE-CENTERED LIFE ENGINE**, inspired by Stephen Covey's principle-centered life philosophy. Do not copy copyrighted content. Build an original system inspired by general ideas of principles, roles, mission, responsibility, and character-centered effectiveness.

## Purpose
Help users build a life governed by principles rather than moods, impulses, social pressure, or short-term goals. Answer: What principles guide my life? What roles must I steward? What responsibilities must I honor? What should I say no to? What is my personal constitution?

## Core philosophy
Principles are stable; moods are unstable; goals can be shallow; principles create character. Alignment: Mission → Roles → Principles → Decisions → Habits → Character → Contribution.

## Domain model (`src/domains/principle-centered-life/`)
Entities: LifePrinciple, PrincipleCategory, PersonalConstitution, LifeRole, RoleResponsibility, RoleGoal, PrincipleDecisionRule, PrincipleViolation, PrincipleAlignmentReview, WeeklyCompass, PrincipleScoreSnapshot.

Principle categories: Integrity, Responsibility, Contribution, Growth, Service, Excellence, Truth, Discipline, Relationships, Stewardship, Courage, Wisdom.

Life roles: Self, Family Member, Friend, Professional, Creator, Leader, Citizen, Learner, Mentor, Steward.

## Personal constitution
Generate with: 1. Mission Statement 2. Core Principles 3. Non-negotiables 4. Life Roles 5. Role Responsibilities 6. Decision Rules 7. Weekly Priorities 8. Renewal Practices 9. Contribution Commitments.

## Principle assessment
1. What principle do you refuse to violate? 2. Who do you want to be when nobody is watching? 3. Which role is neglected? 4. Which principle is compromised under pressure? 5. What responsibility are you avoiding? 6. What short-term desire overrides your values? 7. What would your future self protect? 8. What does integrity require this season?

## Weekly compass
For each week: select top roles, choose one priority per role, define principle alignment, define one hard no, define renewal action, define contribution action. Output: WeeklyCompassPlan.

## Principle violation engine
Detect: saying yes against values, neglecting important roles, urgency over importance, acting against integrity, violating long-term responsibility, over-optimizing one life area. Generate violation event, violated principle, root cause, repair action, prevention rule.

## Scoring (0–100)
PrincipleClarityScore, RoleAlignmentScore, IntegrityScore, WeeklyCompassScore, ResponsibilityScore, RenewalScore, GlobalPrincipleLifeScore.

`GlobalPrincipleLifeScore = PrincipleClarity × RoleAlignment × Integrity × WeeklyCompass × Renewal`.

## AI agents
PrincipleCoach, PersonalConstitutionBuilder, RoleStewardshipCoach, WeeklyCompassPlanner, PrincipleViolationAnalyzer, IntegrityReflectionGuide. Each: system prompt, input/output schema, TS interface, examples, failure handling.

## API routes
POST `/api/principles/assessment` · GET `/principles` · POST `/create` · POST `/constitution` · GET `/constitution` · POST `/weekly-compass` · GET `/weekly-compass` · POST `/violation/analyze` · GET `/dashboard`.

## Frontend
Pages: `/principles`, `/assessment`, `/constitution`, `/roles`, `/weekly-compass`, `/reflection`, `/dashboard`. Components: PrincipleCard, PrincipleAssessmentForm, PersonalConstitutionViewer, LifeRoleBoard, WeeklyCompassPlanner, PrincipleViolationReport, PrincipleAlignmentDashboard.

## User flow
1. Assessment. 2. Identify core principles. 3. Create life roles. 4. Generate constitution. 5. Create weekly compass. 6. Review alignment. 7. Track violations + repairs. 8. Update score.

## Implementation order
1. Domain types → 2. Prisma schema → 3. Service layer → 4. Score functions → 5. Agents → 6. API routes → 7. UI pages → 8. Seed principle categories → 9. Dashboard integration.
