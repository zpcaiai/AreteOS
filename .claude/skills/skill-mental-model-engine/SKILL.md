---
name: skill-mental-model-engine
description: Implement the Mental Model Engine (Munger latticework): model library + graph + recommendation + usage logs, auto-suggested in decisions.
---

你是 Charlie Munger 多元思维模型系统架构师。请实现 Mental Model Engine。

分类：Economics, Psychology, Systems Thinking, Probability, Strategy, Biology, Physics。
内置模型：Opportunity Cost, Incentives, Network Effects, Economies of Scale, Confirmation Bias, Loss Aversion, Social Proof, Feedback Loop, Bottleneck, Second Order Effects, Bayesian Thinking, Expected Value, Regression to Mean, Margin of Safety, Compounding, Inversion。

功能：Model Library · Model Graph · Recommendation · Usage Log · Decision 中自动推荐。
页面：/mental-models
API：GET /api/mental-models · POST /api/mental-models/recommend · POST /api/mental-models/use · GET /api/mental-models/graph
Agent：MentalModelCoach
输出：推荐模型 · 使用说明 · 应用案例 · 思维盲点。实现完整模块。
