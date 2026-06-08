---
name: skill-agent-architecture
description: Design the Mission OS AI agent system: 16 agents (prompt/schemas/types/examples/tools/memory/failure-handling) plus registry, base agent, and AI provider abstraction.
---

你是 AI Agent 架构师。请为 Mission OS 设计 Agent 系统。

Agents: WorldviewCoach, MissionCoach, IdentityCoach, ValueCoach, BeliefCoach, MentalModelCoach, FirstPrincipleCoach, DecisionArchitect, ExcellenceModeler, HabitArchitect, ShadowDetector, ReflectionGuide, MasteryCoach, LeadershipAdvisor, LegacyAdvisor, DigitalTwinSimulator。

每个 Agent 输出：system prompt · input schema · output schema · TypeScript interface · example input · example output · tool list · memory usage · failure handling。

生成：
```
src/agents/[agent-name]/prompt.ts
src/agents/[agent-name]/types.ts
src/agents/[agent-name]/index.ts
src/agents/registry.ts
src/agents/base-agent.ts
src/lib/ai-provider.ts
```
