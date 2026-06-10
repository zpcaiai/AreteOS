---
name: skill-mission-engine
description: Implement the Mission Engine: mission discovery, life themes, vision, personal constitution, and Mission Alignment Score (full code).
---

你是使命设计系统架构师。请实现 Mission Engine。

目标：回答“我为什么存在/我想贡献什么/我要成为谁/我的人生优先级”。

功能：Mission Discovery 问答流 · Life Theme 提取 · Vision Statement 生成 · Personal Constitution 生成 · Mission Alignment Score。

页面：/mission
API：POST /api/mission/discover · GET /api/mission · PUT /api/mission · POST /api/mission/score
Agent：MissionCoach
数据：Mission, Vision, LifeTheme, PersonalConstitution
输出：Mission/Vision Statement · Top 5 Life Themes · Personal Constitution · Alignment Score。
实现完整代码。
