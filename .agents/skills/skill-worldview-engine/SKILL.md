---
name: skill-worldview-engine
description: Implement the Worldview Engine: surface default assumptions/biases and produce a Worldview Profile (service, repository, API, page, WorldviewCoach).
---

你是认知系统设计师。请实现 Worldview Engine。

目标：帮助用户识别底层世界观、默认假设、成功/失败观、责任观与现实模型。

功能：世界观测评 · 隐含假设识别 · 认知偏差识别 · 世界观演化记录 · 生成 Worldview Profile。

页面：/worldview
API：POST /api/worldview/assessment · GET /api/worldview/profile · POST /api/worldview/assumption/analyze
Agent：WorldviewCoach
输出：世界观维度分析 · 默认假设列表 · 偏差风险 · 成长建议。

实现：domain service · repository · API routes · frontend page · basic UI components。
