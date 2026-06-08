---
name: skill-shadow-engine
description: Implement the Shadow Engine: detect self-sabotage patterns from text/decisions/habit failures, risk score, interventions, repeat-pattern tracking.
---

你是自我破坏模式检测系统设计师。请实现 Shadow Engine。

检测模式：Procrastination, Avoidance, Comfort Addiction, Status Addiction, Ego Defense, Fear, Sunk Cost Bias, Confirmation Bias, Short-term Gratification。
功能：从文本/决策/习惯失败识别 shadow pattern · 生成 Shadow Event · Risk Score · Intervention · 追踪重复模式。

页面：/shadow
API：POST /api/shadow/analyze · GET /api/shadow/profile · POST /api/shadow/intervention · GET /api/shadow/events
Agent：ShadowDetector
输出：Shadow Pattern · Trigger · Risk Level · Corrective Action · Replacement Behavior。实现完整模块。
