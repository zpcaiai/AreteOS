// MISSION OS — workflow runner. A lightweight, dependency-free sequential graph
// over agents. This is the LangGraph-ready seam: when AGENT_ORCHESTRATOR=langgraph
// these workflow definitions can be compiled into a real LangGraph StateGraph
// (each node = an agent, edges = the `steps` order), without changing callers.

import { AGENTS, type AgentName } from "../agents/registry";

export interface WorkflowStep {
  agent: AgentName;
  /** Map the running context to that agent's input. */
  input: (ctx: Record<string, unknown>) => unknown;
  /** Key under which to store the agent's output in the context. */
  as: string;
}

export interface Workflow {
  name: string;
  description: string;
  steps: WorkflowStep[];
}

/** Run a workflow sequentially, threading a shared context between agents. */
export async function runWorkflow(wf: Workflow, initial: Record<string, unknown>) {
  const ctx: Record<string, unknown> = { ...initial };
  const trace: { agent: string; output: unknown }[] = [];
  for (const step of wf.steps) {
    const agent = AGENTS[step.agent];
    const out = await agent.run(step.input(ctx) as never);
    ctx[step.as] = out;
    trace.push({ agent: step.agent, output: out });
  }
  return { context: ctx, trace };
}

// ── Workflow definitions ───────────────────────────────────────────
/** Onboarding: worldview → mission → identity → values (Layers 1-2). */
export const onboardingWorkflow: Workflow = {
  name: "onboarding",
  description: "Worldview → Mission → Identity → Values",
  steps: [
    { agent: "WorldviewCoach", as: "worldview", input: (c) => ({ answers: (c.answers as unknown[]) ?? [] }) },
    { agent: "MissionCoach", as: "mission", input: (c) => ({ reflections: (c.reflections as string[]) ?? [], lifeThemes: (c.lifeThemes as string[]) ?? [] }) },
    {
      agent: "IdentityCoach",
      as: "identity",
      input: (c) => ({ mission: (c.mission as { missionStatement?: string })?.missionStatement, currentIdentities: (c.currentIdentities as string[]) ?? [] }),
    },
    { agent: "ValueCoach", as: "values", input: (c) => ({ values: (c.values as string[]) ?? ["Truth", "Excellence", "Integrity"] }) },
  ],
};

/** Decision flow: first principles → mental models → decision architect (Layer 3). */
export const decisionWorkflow: Workflow = {
  name: "decision",
  description: "First Principles → Mental Models → Decision",
  steps: [
    { agent: "FirstPrincipleCoach", as: "principles", input: (c) => ({ problem: c.title as string, assumptions: (c.assumptions as string[]) ?? [] }) },
    { agent: "MentalModelCoach", as: "models", input: (c) => ({ problem: c.title as string, knownModels: (c.knownModels as string[]) ?? [] }) },
    {
      agent: "DecisionArchitect",
      as: "decision",
      input: (c) => ({ title: c.title as string, context: (c.context as string) ?? "", options: (c.options as string[]) ?? [], mission: c.mission as string, identity: c.identity as string, values: (c.values as string[]) ?? [] }),
    },
  ],
};

/** Daily loop: reflection → shadow detection (Layer 4). */
export const dailyWorkflow: Workflow = {
  name: "daily",
  description: "Reflection → Shadow detection",
  steps: [
    { agent: "ReflectionGuide", as: "reflection", input: (c) => ({ worked: (c.worked as string) ?? "", failed: (c.failed as string) ?? "", learned: (c.learned as string) ?? "", wrongAssumptions: (c.wrongAssumptions as string) ?? "" }) },
    { agent: "ShadowDetector", as: "shadow", input: (c) => ({ recentBehaviors: (c.recentBehaviors as string[]) ?? [(c.failed as string) ?? "reviewed nothing"] }) },
  ],
};

export const WORKFLOWS: Record<string, Workflow> = {
  onboarding: onboardingWorkflow,
  decision: decisionWorkflow,
  daily: dailyWorkflow,
};
