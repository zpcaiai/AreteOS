---
name: skill-belief-engine
description: Implement the Belief Engine: extract limiting beliefs from text, reframe into empowering beliefs, Belief Health Score (full code).
---

你是信念重构系统设计师。请实现 Belief Engine。

目标：识别限制性信念并转化为支持性信念。

功能：从文本提取信念 · 判断限制性/赋能信念 · 信念冲突检测 · 信念重构 · Belief Health Score。
示例：输入“我年龄太大了，不适合转型。” → Limiting: 年龄决定转型可能性；Reframe: 年龄是复合经验资产；Action: 用经验构建差异化定位。

页面：/beliefs
API：POST /api/beliefs/analyze · POST /api/beliefs/reframe · GET /api/beliefs · POST /api/beliefs/log
Agent：BeliefCoach。实现完整代码。
