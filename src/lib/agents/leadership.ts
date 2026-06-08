import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* ───────────────────────── Leadership Leverage Engine ───────────────────────── */
const LDR_TONE = BASE_TONE + " Leadership is leverage through logical levels (environment→behavior→capability→belief→identity→mission). The goal is to elevate people, not control them. Make every insight observable and scorable.";

/* LDR-1 ─ LeadershipLeverageAnalyzer */
export const LeadershipLeverageAnalyzer = defineAgent({
  name: "LeadershipLeverageAnalyzer",
  description: "Diagnose where a leader spends attention across the six logical levels.",
  system: `${LDR_TONE} From the inputs, estimate how attention distributes across environment/behavior/capability/belief/identity/telos (each 0..1), and name overfocus + blind spots.`,
  inputSchema: z.object({ inputs: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    distribution: z.object({ environment: scoreField, behavior: scoreField, capability: scoreField, belief: scoreField, identity: scoreField, mission: scoreField }),
    overfocus: z.array(z.string()), blindSpots: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Leadership inputs (meetings, 1:1s, reviews, journals):\n${i.inputs.join("\n")}\nEstimate the leverage distribution and name overfocus + blind spots.`,
  example: {
    input: { inputs: ["Most 1:1s are status updates and task lists"] },
    output: { distribution: { environment: 0.3, behavior: 0.7, capability: 0.4, belief: 0.2, identity: 0.1, mission: 0.1 },
      overfocus: ["Behavior (task management)"], blindSpots: ["Identity", "Mission — rarely discussed"] },
  },
});

/* LDR-2 ─ RoleTransformationCoach */
export const RoleTransformationCoach = defineAgent({
  name: "RoleTransformationCoach",
  description: "Help a leader move upward through Caretaker→Guide→Coach→Mentor→Sponsor→Awakener.",
  system: `${LDR_TONE} Identify the leader's current role, the next role, and a concrete development plan with success metrics and failure modes.`,
  inputSchema: z.object({ current: z.string().optional(), context: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    currentRole: z.enum(["CARETAKER","GUIDE","COACH","MENTOR","SPONSOR","AWAKENER"]),
    nextRole: z.enum(["CARETAKER","GUIDE","COACH","MENTOR","SPONSOR","AWAKENER"]),
    developmentPlan: z.array(z.string()), successMetrics: z.array(z.string()), failureModes: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Current role: ${i.current ?? "unknown"}\nContext: ${i.context.join("; ")}\nIdentify current role, next role, and a development plan.`,
  example: {
    input: { current: "Coach" },
    output: { currentRole: "COACH", nextRole: "MENTOR", developmentPlan: ["Move from 'how' to 'why' in 1:1s", "Surface each report's operating beliefs"],
      successMetrics: ["Reports articulate their own values"], failureModes: ["Imposing your beliefs as 'the' beliefs"] },
  },
});

/* LDR-3 ─ IdentitySponsor */
export const IdentitySponsor = defineAgent({
  name: "IdentitySponsor",
  description: "Strengthen a person's identity through recognition and narrative.",
  system: `${LDR_TONE} Convert achievement feedback into identity-level sponsorship (from 'you did good work' to 'you are becoming X').`,
  inputSchema: z.object({ recipient: z.string(), evidence: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    recognition: z.string(), identityStatement: z.string(), narrative: z.string(), growthPlan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Recipient: ${i.recipient}\nEvidence: ${i.evidence.join("; ")}\nProduce identity-level recognition, an identity statement, a narrative, and a growth plan.`,
  example: {
    input: { recipient: "Maya", evidence: ["Led the incident calmly", "Mentored two juniors"] },
    output: { recognition: "You held the team steady under pressure.", identityStatement: "You are becoming a leader people trust in a crisis.",
      narrative: "From strong IC to a calm anchor others orient around.", growthPlan: ["Own the next incident review", "Sponsor one junior's identity in turn"] },
  },
});

/* LDR-4 ─ VisionArchitect */
export const VisionArchitect = defineAgent({
  name: "VisionArchitect",
  description: "Create and align a shared vision; detect drift.",
  system: `${LDR_TONE} Produce a vision statement, a communication plan, an alignment estimate (0..1) and drift signals.`,
  inputSchema: z.object({ mission: z.string().optional(), notes: z.array(z.string()).default([]) }),
  outputSchema: z.object({ statement: z.string(), communication: z.string(), alignmentScore: scoreField, driftSignals: z.array(z.string()) }),
  buildUserPrompt: (i) => `Mission: ${i.mission ?? "(n/a)"}\nNotes: ${i.notes.join("; ")}\nCreate the vision, a communication plan, an alignment score, and drift signals.`,
  example: {
    input: { mission: "Make quality accessible" },
    output: { statement: "A world where every team ships software they're proud of.", communication: "Open each all-hands with one customer story tied to the vision.",
      alignmentScore: 0.6, driftSignals: ["Roadmap decisions justified by revenue, not vision"] },
  },
});

/* LDR-5 ─ BelongingCoach */
export const BelongingCoach = defineAgent({
  name: "BelongingCoach",
  description: "Measure and improve belonging and team cohesion.",
  system: `${LDR_TONE} Score belonging dimensions (trust, psychological safety, recognition, contribution, identity fit, mission fit) 0..1 and prescribe moves.`,
  inputSchema: z.object({ signals: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ trust: scoreField, psychologicalSafety: scoreField, recognition: scoreField, contribution: scoreField, identityFit: scoreField, missionFit: scoreField }),
    belongingScore: scoreField, cohesionScore: scoreField, moves: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Signals:\n${i.signals.join("\n")}\nScore belonging dimensions and prescribe moves.`,
  example: {
    input: { signals: ["New hires stay quiet in meetings for months"] },
    output: { scores: { trust: 0.5, psychologicalSafety: 0.4, recognition: 0.5, contribution: 0.4, identityFit: 0.5, missionFit: 0.6 },
      belongingScore: 0.48, cohesionScore: 0.5, moves: ["Assign each new hire a first-week visible contribution", "Invite dissent explicitly in meetings"] },
  },
});

/* LDR-6 ─ ConversationGuide */
export const ConversationGuide = defineAgent({
  name: "ConversationGuide",
  description: "Generate a leadership conversation script for a given role/level.",
  system: `${LDR_TONE} Given a role (caretaker→awakener) and situation, produce a conversation script, key questions, follow-up paths, and an effectiveness estimate.`,
  inputSchema: z.object({ role: z.enum(["CARETAKER","GUIDE","COACH","MENTOR","SPONSOR","AWAKENER"]), situation: z.string() }),
  outputSchema: z.object({ script: z.string(), questions: z.array(z.string()), followUps: z.array(z.string()), effectiveness: scoreField }),
  buildUserPrompt: (i) => `Role: ${i.role}\nSituation: ${i.situation}\nProduce a conversation script, questions, follow-ups, and an effectiveness estimate.`,
  example: {
    input: { role: "SPONSOR", situation: "A high-potential engineer doubts they're 'leadership material'." },
    output: { script: "Name the specific moments that already show leadership; reflect the identity back.",
      questions: ["When have you already led without the title?", "Who are you becoming here?"],
      followUps: ["Give them a visible leadership task", "Revisit the identity in two weeks"], effectiveness: 0.7 },
  },
});

/* LDR-7 ─ AlignmentAnalyst */
export const AlignmentAnalyst = defineAgent({
  name: "AlignmentAnalyst",
  description: "Measure organizational alignment across mission/identity/values/rules/behaviors/teams.",
  system: `${LDR_TONE} Score each alignment layer 0..1 and produce a misalignment report.`,
  inputSchema: z.object({ inputs: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ mission: scoreField, identity: scoreField, values: scoreField, decisionRules: scoreField, behaviors: scoreField, teams: scoreField }),
    misalignments: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Inputs:\n${i.inputs.join("\n")}\nScore alignment layers and list misalignments.`,
  example: {
    input: { inputs: ["Stated value is 'customer first' but bonuses reward feature count"] },
    output: { scores: { mission: 0.6, identity: 0.6, values: 0.4, decisionRules: 0.3, behaviors: 0.4, teams: 0.5 },
      misalignments: ["Incentives reward output, not customer value"] },
  },
});

/* LDR-8 ─ FutureLeaderCoach */
export const FutureLeaderCoach = defineAgent({
  name: "FutureLeaderCoach",
  description: "Assess and develop next-generation leaders; build the pipeline.",
  system: `${LDR_TONE} Score a candidate (self-awareness, decision quality, influence, responsibility, mission ownership, identity stability, vision capability) and give a readiness verdict + development plan.`,
  inputSchema: z.object({ candidate: z.string(), evidence: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ selfAwareness: scoreField, decisionQuality: scoreField, influence: scoreField, responsibility: scoreField, missionOwnership: scoreField, identityStability: scoreField, visionCapability: scoreField }),
    readinessScore: scoreField, developmentPlan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Candidate: ${i.candidate}\nEvidence: ${i.evidence.join("; ")}\nScore readiness and give a development plan.`,
  example: {
    input: { candidate: "Sam", evidence: ["Owns outcomes", "Still avoids hard feedback"] },
    output: { scores: { selfAwareness: 0.6, decisionQuality: 0.6, influence: 0.5, responsibility: 0.8, missionOwnership: 0.7, identityStability: 0.6, visionCapability: 0.5 },
      readinessScore: 0.62, developmentPlan: ["Practice direct feedback weekly", "Own a cross-team initiative"] },
  },
});

/* LDR-9 ─ CultureReplicator */
export const CultureReplicator = defineAgent({
  name: "CultureReplicator",
  description: "Build a culture blueprint that replicates without micromanagement.",
  system: `${LDR_TONE} From founder identity, values, leadership behaviors and operating principles, produce a culture blueprint with rituals and a replication playbook.`,
  inputSchema: z.object({ founderIdentity: z.string().optional(), values: z.array(z.string()).default([]), behaviors: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    values: z.array(z.string()), leadershipBehaviors: z.array(z.string()), operatingPrinciples: z.array(z.string()),
    rituals: z.array(z.string()), replicationPlaybook: z.string(),
  }),
  buildUserPrompt: (i) => `Founder identity: ${i.founderIdentity ?? "(n/a)"}\nValues: ${i.values.join("; ")}\nBehaviors: ${i.behaviors.join("; ")}\nProduce a culture blueprint + rituals + replication playbook.`,
  example: {
    input: { values: ["Ownership"] },
    output: { values: ["Ownership", "Candor"], leadershipBehaviors: ["Leaders take the blame, share the credit"], operatingPrinciples: ["Disagree and commit"],
      rituals: ["Weekly 'what I own' standup", "Monthly failure retro"], replicationPlaybook: "Teach via stories + rituals; promote only behavior that models the values." },
  },
});

/* LDR-10 ─ AwakenerAgent */
export const AwakenerAgent = defineAgent({
  name: "AwakenerAgent",
  description: "Move a person from task to meaning via the awakener question framework.",
  system: `${LDR_TONE} Walk the person from what→why→who they're becoming→what future→larger purpose, and score purpose clarity, mission connection, awakening readiness.`,
  inputSchema: z.object({ task: z.string(), context: z.string().optional() }),
  outputSchema: z.object({
    why: z.string(), becoming: z.string(), futureCreated: z.string(), largerPurpose: z.string(),
    purposeClarity: scoreField, missionConnection: scoreField, awakeningReadiness: scoreField,
  }),
  buildUserPrompt: (i) => `Task: ${i.task}\nContext: ${i.context ?? "(n/a)"}\nApply the awakener framework and score purpose clarity, mission connection, awakening readiness.`,
  example: {
    input: { task: "Fix the onboarding bug backlog" },
    output: { why: "So new users succeed in their first hour.", becoming: "Someone who guards the first impression.",
      futureCreated: "A product people trust from minute one.", largerPurpose: "Make quality software accessible to all.",
      purposeClarity: 0.7, missionConnection: 0.7, awakeningReadiness: 0.65 },
  },
});
