import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* ───────────────────────── Management OS — Leverage Operating System ───────────────────────── */
const MGMT_TONE = BASE_TONE + " Management is system design, not people control. Inspired by widely-taught ideas: management leverage, knowledge-worker effectiveness, tacit-knowledge capture, and anti-fragility. No buzzwords, no motivational language — observable, measurable, transferable.";

/* MGMT-1 ─ ManagementArchitect */
export const ManagementArchitect = defineAgent({
  name: "ManagementArchitect",
  description: "Assess management maturity across the 7-level model and produce a growth roadmap.",
  system: `${MGMT_TONE} Score management dimensions (mission, leadership, knowledge, decisionQuality, delegation, alignment, resilience) 0..1, place the manager on the 7-level maturity model (Supervisor→Org Designer), and give a growth roadmap.`,
  inputSchema: z.object({ reflections: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ mission: scoreField, leadership: scoreField, knowledge: scoreField, decisionQuality: scoreField, delegation: scoreField, alignment: scoreField, resilience: scoreField }),
    level: z.enum(["SUPERVISOR","MANAGER","DIRECTOR","LEADER","VISIONARY","SYSTEM_ARCHITECT","ORG_DESIGNER"]),
    roadmap: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Reflections:\n${i.reflections.join("\n")}\nScore the dimensions, set the maturity level, and give a growth roadmap.`,
  example: {
    input: { reflections: ["I spend most of my week approving things and checking reports"] },
    output: { scores: { mission: 0.3, leadership: 0.4, knowledge: 0.3, decisionQuality: 0.5, delegation: 0.3, alignment: 0.4, resilience: 0.4 },
      level: "MANAGER", roadmap: ["Push decision rights down to reduce approvals", "Invest a fixed block weekly in leader development"] },
  },
});

/* MGMT-2 ─ LeverageAnalyzer */
export const LeverageAnalyzer = defineAgent({
  name: "LeverageAnalyzer",
  description: "Classify a manager's activities into low/medium/high leverage (Grove) and prescribe a shift.",
  system: `${MGMT_TONE} Classify each activity as low/medium/high leverage, estimate the time share at each tier (sum≈1), and prescribe how to move time toward high leverage.`,
  inputSchema: z.object({ activities: z.array(z.object({ activity: z.string(), hoursPerWeek: z.number() })).default([]) }),
  outputSchema: z.object({
    classified: z.array(z.object({ activity: z.string(), tier: z.enum(["LOW","MEDIUM","HIGH"]) })),
    shares: z.object({ low: scoreField, medium: scoreField, high: scoreField }),
    improvementPlan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Activities:\n${i.activities.map((a) => `${a.activity} (${a.hoursPerWeek}h)`).join("\n")}\nClassify by leverage, estimate time shares, and prescribe a shift to high leverage.`,
  example: {
    input: { activities: [{ activity: "Status meetings", hoursPerWeek: 10 }, { activity: "Architecture decisions", hoursPerWeek: 2 }] },
    output: { classified: [{ activity: "Status meetings", tier: "LOW" }, { activity: "Architecture decisions", tier: "HIGH" }],
      shares: { low: 0.7, medium: 0.15, high: 0.15 }, improvementPlan: ["Replace half the status meetings with an async dashboard", "Add 3h/week to architecture + leader development"] },
  },
});

/* MGMT-3 ─ KnowledgeArchitect */
export const KnowledgeArchitect = defineAgent({
  name: "KnowledgeArchitect",
  description: "Assess knowledge-worker effectiveness (Drucker) and name the binding constraint.",
  system: `${MGMT_TONE} Score clarity, autonomy, capability, tooling, focus (0..1) and name the productivity constraints.`,
  inputSchema: z.object({ subject: z.string().optional(), signals: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ clarity: scoreField, autonomy: scoreField, capability: scoreField, tooling: scoreField, focus: scoreField }),
    constraints: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Subject: ${i.subject ?? "team"}\nSignals:\n${i.signals.join("\n")}\nScore effectiveness dimensions and name the constraints.`,
  example: {
    input: { signals: ["Engineers wait days for unclear specs", "Constant context-switching"] },
    output: { scores: { clarity: 0.3, autonomy: 0.6, capability: 0.7, tooling: 0.6, focus: 0.3 },
      constraints: ["Unclear specs (clarity)", "Fragmented attention (focus)"] },
  },
});

/* MGMT-4 ─ KnowledgeExtractor */
export const KnowledgeExtractor = defineAgent({
  name: "KnowledgeExtractor",
  description: "Convert tacit expertise into reusable assets (Nonaka/SECI): playbooks, prompts, patterns.",
  system: `${MGMT_TONE} Externalize tacit knowledge into structured, reusable assets. Produce a playbook (steps + when-to-use), prompts, and expert heuristics.`,
  inputSchema: z.object({ topic: z.string(), notes: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    assetKind: z.enum(["PLAYBOOK","PROMPT_LIBRARY","EXPERT_PATTERN","DECISION_PATTERN","TROUBLESHOOTING","CUSTOMER","TECHNICAL"]),
    title: z.string(), playbookSteps: z.array(z.string()), whenToUse: z.string(),
    prompts: z.array(z.string()), heuristics: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Topic: ${i.topic}\nExpert notes:\n${i.notes.join("\n")}\nExternalize into a playbook + prompts + heuristics.`,
  example: {
    input: { topic: "Triaging a production incident", notes: ["Check the last deploy first"] },
    output: { assetKind: "TROUBLESHOOTING", title: "Incident Triage Playbook",
      playbookSteps: ["Confirm scope", "Check last deploy", "Roll back if correlated", "Communicate status"],
      whenToUse: "Any production alert with user impact.",
      prompts: ["Summarize the blast radius from these logs"], heuristics: ["Most incidents trace to the last change"] },
  },
});

/* MGMT-5 ─ DecisionGovernanceCoach */
export const DecisionGovernanceCoach = defineAgent({
  name: "DecisionGovernanceCoach",
  description: "Assess and improve organizational decision quality, consistency, speed, ownership, learning.",
  system: `${MGMT_TONE} Score decision governance dimensions (quality, consistency, speed, ownership, learning) 0..1 and prescribe governance upgrades.`,
  inputSchema: z.object({ decisions: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ quality: scoreField, consistency: scoreField, speed: scoreField, ownership: scoreField, learning: scoreField }),
    report: z.string(), upgrades: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Recent decisions:\n${i.decisions.join("\n")}\nScore decision governance and prescribe upgrades.`,
  example: {
    input: { decisions: ["Big calls re-litigated repeatedly; no clear owner"] },
    output: { scores: { quality: 0.5, consistency: 0.3, speed: 0.3, ownership: 0.3, learning: 0.4 },
      report: "Decisions lack single owners and are re-opened, slowing the org.", upgrades: ["Assign a DRI per decision", "Record decisions + rationale in one log"] },
  },
});

/* MGMT-6 ─ OrganizationalHealthCoach */
export const OrganizationalHealthCoach = defineAgent({
  name: "OrganizationalHealthCoach",
  description: "Measure organizational health (trust, communication, execution, ownership, learning, collaboration).",
  system: `${MGMT_TONE} Score the six health dimensions 0..1 and prescribe the highest-leverage interventions.`,
  inputSchema: z.object({ signals: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ trust: scoreField, communication: scoreField, execution: scoreField, ownership: scoreField, learning: scoreField, collaboration: scoreField }),
    interventions: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Signals:\n${i.signals.join("\n")}\nScore organizational health and prescribe interventions.`,
  example: {
    input: { signals: ["Teams hoard information; blame after failures"] },
    output: { scores: { trust: 0.3, communication: 0.4, execution: 0.5, ownership: 0.4, learning: 0.3, collaboration: 0.4 },
      interventions: ["Blameless post-mortems", "Default-open information sharing"] },
  },
});

/* MGMT-7 ─ OrganizationDesigner */
export const OrganizationDesigner = defineAgent({
  name: "OrganizationDesigner",
  description: "Design a scalable org: structure, decision rights, information flow, coordination cost.",
  system: `${MGMT_TONE} Produce an organization blueprint: structure, decision rights, information flow, an estimate of coordination cost (0..1), and scaling recommendations.`,
  inputSchema: z.object({ context: z.array(z.string()).default([]), goal: z.string().optional() }),
  outputSchema: z.object({
    structure: z.string(), decisionRights: z.array(z.string()), informationFlow: z.string(),
    coordinationCost: scoreField, scalingRecommendations: z.array(z.string()), designScore: scoreField,
  }),
  buildUserPrompt: (i) => `Context: ${i.context.join("; ")}\nGoal: ${i.goal ?? "scale without losing speed"}\nProduce an organization blueprint.`,
  example: {
    input: { context: ["40 people, everything routes through 2 founders"] },
    output: { structure: "Small autonomous pods with clear interfaces.", decisionRights: ["Pods own roadmap within guardrails"],
      informationFlow: "Weekly written updates; one shared metrics dashboard.", coordinationCost: 0.4,
      scalingRecommendations: ["Push decision rights to pod leads", "Document interfaces between pods"], designScore: 0.6 },
  },
});

/* MGMT-8 ─ ManagementTwinSimulator */
export const ManagementTwinSimulator = defineAgent({
  name: "ManagementTwinSimulator",
  description: "Build an organizational digital twin and simulate the effect of a change.",
  system: `${MGMT_TONE} Given a snapshot of mission/knowledge/decisions/culture, simulate a scenario and predict effects on leverage, health and resilience, with an accuracy caveat.`,
  inputSchema: z.object({ snapshot: z.record(z.string(), z.unknown()), scenario: z.string().optional() }),
  outputSchema: z.object({
    prediction: z.string(), effects: z.array(z.object({ dimension: z.string(), delta: z.string() })),
    accuracyScore: scoreField, risks: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Snapshot: ${JSON.stringify(i.snapshot)}\nScenario: ${i.scenario ?? "double headcount in 12 months"}\nSimulate and predict effects.`,
  example: {
    input: { snapshot: { dependency: 0.8 }, scenario: "Founder steps back from daily ops" },
    output: { prediction: "Short-term decision slowdown, then improved leverage if rights are delegated first.",
      effects: [{ dimension: "Decision speed", delta: "−20% for 6 weeks" }, { dimension: "Leverage", delta: "+15% after" }],
      accuracyScore: 0.5, risks: ["If decision rights aren't pre-delegated, throughput stalls"] },
  },
});

/* MGMT-9 ─ ManagementCoach */
export const ManagementCoach = defineAgent({
  name: "ManagementCoach",
  description: "Surface a manager's blind spots and produce a coaching + leadership development plan.",
  system: `${MGMT_TONE} From the inputs, name blind spots and growth areas, and produce a concrete coaching plan and leadership development plan.`,
  inputSchema: z.object({ context: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    blindSpots: z.array(z.string()), growthAreas: z.array(z.string()),
    coachingPlan: z.array(z.string()), developmentPlan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Context:\n${i.context.join("\n")}\nName blind spots, growth areas, and produce coaching + development plans.`,
  example: {
    input: { context: ["I solve problems for the team instead of developing them"] },
    output: { blindSpots: ["Rescuing reduces team capability"], growthAreas: ["Coaching instead of solving"],
      coachingPlan: ["Replace one rescue/day with a coaching question"], developmentPlan: ["Delegate one decision class fully this month"] },
  },
});
