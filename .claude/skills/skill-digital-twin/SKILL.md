---
name: skill-digital-twin
description: Implement the Digital Twin: dynamic model of the user's mission/identity/decisions/habits/reflections with memory, drift detection, prediction, simulation.
---

你是 AI Digital Twin 架构师。请实现 Mission OS Digital Twin。

目标：构建用户人格/使命/身份/决策/习惯/反思的动态数字孪生。
存储：Mission, Identity, Values, Beliefs, Mental Models, Decisions, Habits, Reflections, Shadow Patterns, Mastery Progress。
功能：Twin Profile · Twin Memory · Growth Timeline · Identity Drift Detection · Future Behavior Prediction · Simulation。

页面：/twin
API：GET /api/twin/profile · POST /api/twin/insight · POST /api/twin/simulate · GET /api/twin/timeline
Agent：DigitalTwinSimulator
输出：当前人格画像 · 漂移风险 · 成长趋势 · 模拟建议。实现完整模块。
