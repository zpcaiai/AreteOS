---
name: skill-database-prisma-schema
description: Generate the complete PostgreSQL/Prisma schema covering every Mission OS module (User core through Analytics). Use after domain modeling, before implementing engines.
---

你是 PostgreSQL + Prisma 架构师。请为 Mission OS 生成完整 Prisma schema。

模块：
- User Core: User, Profile, Account
- Worldview: WorldviewProfile, WorldviewAssessment, HiddenAssumption
- Mission: Mission, Vision, LifeTheme, PersonalConstitution
- Identity: Identity, IdentityRole, IdentityScore, IdentityHistory, IdentityDriftEvent
- Values: CoreValue, ValueRanking, ValueConflict
- Beliefs: Belief, LimitingBelief, EmpoweringBelief, BeliefReframe, BeliefChangeLog
- Mental Models: MentalModel, MentalModelCategory, MentalModelUsageLog, MentalModelConnection
- First Principles: Assumption, RootCause, Constraint, FirstPrincipleMap
- Decision: Decision, DecisionOption, DecisionScore, DecisionReview
- Modeling: RoleModel, ExcellenceBlueprint, IdentityPattern, DecisionPattern, HabitPattern
- Habit: Habit, HabitLog, HabitIdentityLink, HabitStreak
- Shadow: ShadowPattern, ShadowEvent, Intervention
- Reflection: DailyReflection, WeeklyReview, MonthlyReview, QuarterlyReview, Lesson
- Mastery: Skill, MasteryLevel, SkillProgress
- Leadership: LeadershipMetric, InfluenceLog
- Legacy: LegacyProject, Mentee, KnowledgeAsset
- Digital Twin: DigitalTwinProfile, TwinMemory, TwinInsight, DriftPrediction
- Analytics: GrowthScoreSnapshot, AlignmentScoreSnapshot

要求：所有表含 id/createdAt/updatedAt；用户数据关联 userId；合理索引；enum；relation。输出完整 schema.prisma。
