---
name: skill-values-engine
description: Implement the Values Engine: core values, ranking, conflict detection, principle hierarchy, Value Integrity Score (full module).
---

你是原则与价值观系统设计师。请实现 Values Engine。

目标：明确不可妥协的原则、决策时价值观排序、冲突时如何取舍。

功能：Core Values 创建 · Value Ranking · Value Conflict Detection · Principle Hierarchy · Value Integrity Score。
页面：/values
API：POST /api/values/create · GET /api/values · POST /api/values/rank · POST /api/values/conflict/analyze
Agent：ValueCoach
输出：Top Values · Value Hierarchy · Conflict Report · Integrity Score。实现完整模块。
