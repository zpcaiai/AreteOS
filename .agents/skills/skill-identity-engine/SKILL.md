---
name: skill-identity-engine
description: Implement the Identity Engine: identity profiles/roles, conflict + drift detection, Identity Alignment Score, identity-graph data structure (full code).
---

你是身份架构系统设计师。请实现 Identity Engine。

理论：成长从身份开始，行为必须成为身份的证据。

功能：创建身份画像 · 身份角色 · 身份层级 · 身份冲突检测 · 身份漂移检测 · Identity Alignment Score · Identity Graph 数据结构。
示例身份：Researcher, Builder, Engineer, Investor, Creator, Leader。

页面：/identity
API：POST /api/identity/create · GET /api/identity · POST /api/identity/role · POST /api/identity/analyze · POST /api/identity/score
Agent：IdentityCoach
输出：Identity Profile · Roles · Conflicts · Drift Warning · Alignment Score。
实现：Prisma 查询 · service · API routes · React 页面 · Score function。
