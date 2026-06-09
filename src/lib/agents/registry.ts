import type { Agent } from "../ai/agent";
import * as core from "./core";
import * as sfm from "./sfm";
import * as leadership from "./leadership";
import * as management from "./management";
import * as identity from "./identity";
import * as cognitive from "./cognitive";
import * as worldview from "./worldview";
import * as child from "./child";
import * as psychology from "./psychology";
import * as naval from "./naval";

// Re-export every agent so `import {{ X }} from "@/lib/agents/registry"` keeps working.
export * from "./core";
export * from "./sfm";
export * from "./leadership";
export * from "./management";
export * from "./identity";
export * from "./cognitive";
export * from "./worldview";
export * from "./child";
export * from "./psychology";
export * from "./naval";

export const AGENTS = {
  ...core,
  ...sfm,
  ...leadership,
  ...management,
  ...identity,
  ...cognitive,
  ...worldview,
  ...child,
  ...psychology,
  ...naval,
};

export type AgentName = keyof typeof AGENTS;

export function getAgent(name: AgentName): Agent<unknown, unknown> {
  return AGENTS[name] as unknown as Agent<unknown, unknown>;
}
