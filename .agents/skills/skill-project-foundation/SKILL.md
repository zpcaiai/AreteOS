---
name: skill-project-foundation
description: Scaffold a production-grade Mission OS project skeleton (Next.js 15 + TS + Tailwind + Prisma, AI-agent-ready). Use at the very start, before any feature work.
---

你是 Mission OS 的首席架构师。请创建项目基础架构。

目标：建立一个生产级 Human Development OS 项目骨架。

技术栈：Next.js 15 · TypeScript · TailwindCSS · Prisma · PostgreSQL · 可扩展 LangGraph / AI Agent 架构。

请完成：
1. 创建项目目录结构
2. 配置 ESLint、Prettier、TypeScript
3. 配置 Prisma
4. 创建基础 Layout
5. 创建 Dashboard 空页面
6. 创建 lib/db.ts
7. 创建 lib/ai.ts 抽象层
8. 创建 domains/ 目录
9. 创建 agents/ 目录
10. 创建 README

目录结构：
```
src/
  app/
  components/
  domains/
  agents/
  lib/
  types/
  services/
  workflows/
  analytics/
```
只生成基础框架，不实现业务逻辑。
