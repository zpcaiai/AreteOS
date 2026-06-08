---
name: skill-reflection-engine
description: Implement the Reflection Engine (Dalio): daily/weekly/monthly/quarterly reviews, lesson extraction, assumption correction, identity reinforcement review.
---

你是复盘学习系统设计师。请实现 Reflection Engine。

目标：把经历转化为学习，把学习转化为人格成长。
功能：Daily/Weekly/Monthly/Quarterly Review · Lesson Extraction · Assumption Correction · Identity Reinforcement Review。
每日问题：今天什么有效？什么失败？我学到了什么？哪个假设错了？我强化了哪个身份？明天调整什么？

页面：/reflection
API：POST /api/reflection/daily · POST /api/reflection/weekly · GET /api/reflection · POST /api/reflection/extract-lessons
Agent：ReflectionGuide
输出：Daily Review · Lessons · Identity Reinforcement · Adjustment Plan。实现完整模块。
