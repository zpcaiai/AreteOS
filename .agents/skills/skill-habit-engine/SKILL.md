---
name: skill-habit-engine
description: Implement the identity-driven Habit Engine: identity-linked habits, daily check-in with identity proof, streaks, Habit Consistency + Identity Reinforcement scores.
---

你是身份驱动习惯系统设计师。请实现 Habit Engine。

核心：习惯不是任务，是身份的证据。

功能：创建习惯 · 绑定身份 · 每日 check-in · 记录 identity proof · streak 计算 · Habit Consistency Score · Identity Reinforcement Score。
示例：Identity=Researcher, Habit=Read 1 paper daily, Proof=“今天我通过阅读论文证明自己是研究者。”

页面：/habits
API：POST /api/habits/create · POST /api/habits/checkin · GET /api/habits · GET /api/habits/stats
Agent：HabitArchitect。实现完整模块。
