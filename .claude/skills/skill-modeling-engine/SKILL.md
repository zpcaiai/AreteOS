---
name: skill-modeling-engine
description: Implement the Modeling Engine (Dilts excellence modeling): role models → Excellence Blueprint → adapted persona blueprint across logical levels.
---

你是 Robert Dilts 卓越建模系统架构师。请实现 Modeling Engine。

建模层级：Mission, Identity, Values, Beliefs, Mental Models, Decision Rules, Capabilities, Habits, Environment。
示例：Einstein, Buffett, Munger, Musk, Disney, Jobs, Dalio, Drucker。

功能：创建 Role Model · 生成 Excellence Blueprint · 提取身份/信念/决策/习惯模式 · 生成用户适配 Persona Blueprint。
页面：/modeling
API：POST /api/modeling/create · POST /api/modeling/blueprint · POST /api/modeling/adapt · GET /api/modeling/models
Agent：ExcellenceModeler
输出：Role Model Profile · Excellence Blueprint · Adapted Persona Blueprint · Habit Recommendations · Decision Rules。实现完整模块。
