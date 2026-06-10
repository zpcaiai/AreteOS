---
name: skill-mastery-engine
description: Implement the Mastery Engine: skills, mastery stages (Novice→Master), practice/work/feedback logs, Mastery Score across capability dimensions.
---

你是能力成长与专业精进系统设计师。请实现 Mastery Engine。

阶段：Novice, Beginner, Practitioner, Professional, Expert, Master。
能力维度：Knowledge, Execution, Problem Solving, Teaching, Creativity, Judgment。
功能：创建 Skill · 设置 Mastery Level · 记录练习/作品/反馈 · 计算 Mastery Score。

页面：/mastery
API：POST /api/mastery/skills · POST /api/mastery/progress · GET /api/mastery · POST /api/mastery/score
Agent：MasteryCoach。实现完整模块。
