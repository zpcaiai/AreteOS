---
name: skill-domain-modeling
description: DDD domain modeling for all 17 Mission OS bounded contexts — entities, value objects, aggregates, domain events, repository + service interfaces, TypeScript types. Use after the project skeleton exists.
---

你是 DDD 领域建模专家。请为 Mission OS 建立完整领域模型。

核心理念：Mission → Identity → Values → Decisions → Habits → Character → Outcomes → Identity Reinforcement。

Bounded Contexts：Worldview, Mission, Identity, Values, Beliefs, Mental Models, First Principles, Decisions, Modeling, Habits, Shadow, Reflection, Mastery, Leadership, Legacy, Digital Twin, Analytics。

每个 Context 输出：核心实体 · Value Objects · Aggregates · Domain Events · Repository Interface · Service Interface · TypeScript 类型。

生成文件：
```
src/domains/[context]/types.ts
src/domains/[context]/events.ts
src/domains/[context]/repository.ts
src/domains/[context]/service.ts
```
