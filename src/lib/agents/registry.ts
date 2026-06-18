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
import * as council from "./council";
import * as future from "./future";
import * as narrative from "./narrative";
import * as evidence from "./evidence";
import * as bottleneck from "./bottleneck";
import * as prescription from "./prescription";
import * as sk from "./specific-knowledge";
import * as identityTree from "./identity-tree";
import * as assetGrowth from "./asset-growth";
import * as capitalLedger from "./capital-ledger";
import * as osCompiler from "./os-compiler";
import * as deepWork from "./deep-work";
import * as healing from "./healing";
import * as healingCoreBelief from "./healing-core-belief";
import * as healingCbt from "./healing-cbt";
import * as healingEmotion from "./healing-emotion";
import * as healingStab from "./healing-stabilization";
import * as healingParts from "./healing-parts";
import * as healingExposure from "./healing-exposure";
import * as healingIdentity from "./healing-identity";
import * as healingTimeline from "./healing-timeline";
import * as healingRelapse from "./healing-relapse";

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
export * from "./council";
export * from "./future";
export * from "./narrative";
export * from "./evidence";
export * from "./bottleneck";
export * from "./prescription";
export * from "./specific-knowledge";
export * from "./identity-tree";
export * from "./asset-growth";
export * from "./capital-ledger";
export * from "./os-compiler";
export * from "./deep-work";
export * from "./healing";
export * from "./healing-core-belief";
export * from "./healing-cbt";
export * from "./healing-emotion";
export * from "./healing-stabilization";
export * from "./healing-parts";
export * from "./healing-exposure";
export * from "./healing-identity";
export * from "./healing-timeline";
export * from "./healing-relapse";

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
  ...council,
  ...future,
  ...narrative,
  ...evidence,
  ...bottleneck,
  ...prescription,
  ...sk,
  ...identityTree,
  ...assetGrowth,
  ...capitalLedger,
  ...osCompiler,
  ...deepWork,
  ...healing,
  ...healingCoreBelief,
  ...healingCbt,
  ...healingEmotion,
  ...healingStab,
  ...healingParts,
  ...healingExposure,
  ...healingIdentity,
  ...healingTimeline,
  ...healingRelapse,
};

export type AgentName = keyof typeof AGENTS;

export function getAgent(name: AgentName): Agent<unknown, unknown> {
  return AGENTS[name] as unknown as Agent<unknown, unknown>;
}
