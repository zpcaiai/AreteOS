import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* ───────────────────────── Worldview OS — Reality Interpretation ───────────────────────── */
const WV_TONE = BASE_TONE + " A worldview is the deepest framework through which a person interprets reality, human nature, meaning, success, failure, responsibility, time, change, risk and purpose. Help users make the implicit explicit and evolve consciously. No political indoctrination, no religious coercion, no ideological manipulation — protect personal agency.";

/* WV-1 ─ AssumptionDetector */
export const AssumptionDetector = defineAgent({
  name: "AssumptionDetector",
  description: "Surface the hidden assumptions beneath how someone interprets their life.",
  system: `${WV_TONE} Identify the hidden, often self-limiting assumptions implied by the inputs, rate how testable/risky each is, and propose a cheap test.`,
  inputSchema: z.object({ statements: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    assumptions: z.array(z.object({ assumption: z.string(), risk: scoreField, test: z.string() })).min(1),
  }),
  buildUserPrompt: (i) => `Statements:\n${i.statements.join("\n")}\nSurface hidden assumptions, rate risk, propose a cheap test for each.`,
  example: {
    input: { statements: ["I'm too old to switch fields"] },
    output: { assumptions: [{ assumption: "Age is the binding constraint on change.", risk: 0.7, test: "Find 3 people who switched fields at your age and study how." }] },
  },
});

/* WV-2 ─ MeaningGuide */
export const MeaningGuide = defineAgent({
  name: "MeaningGuide",
  description: "Help a person construct meaning across work, learning, relationships, contribution, mastery, legacy.",
  system: `${WV_TONE} Score the six meaning dimensions 0..1 and suggest where meaning can be deepened. Do not prescribe a single 'right' meaning — surface the person's own.`,
  inputSchema: z.object({ reflections: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ work: scoreField, learning: scoreField, relationships: scoreField, contribution: scoreField, mastery: scoreField, legacy: scoreField }),
    summary: z.string(), suggestions: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Reflections:\n${i.reflections.join("\n")}\nScore meaning dimensions and suggest where to deepen.`,
  example: {
    input: { reflections: ["Work feels hollow but I love mentoring juniors"] },
    output: { scores: { work: 0.4, learning: 0.6, relationships: 0.7, contribution: 0.7, mastery: 0.5, legacy: 0.5 },
      summary: "Meaning is concentrated in contribution and relationships, thin in core work.", suggestions: ["Shift role toward mentoring/teaching", "Reconnect daily work to who it helps"] },
  },
});

/* WV-3 ─ MissionGenerator */
export const MissionGenerator = defineAgent({
  name: "MissionGenerator",
  description: "Generate mission candidates from a person's worldview.",
  system: `${WV_TONE} From the worldview/assumptions/values, propose mission candidates (timeless contribution, not dated goals) and an alignment estimate for each.`,
  inputSchema: z.object({ worldview: z.string().optional(), values: z.array(z.string()).default([]), themes: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    candidates: z.array(z.object({ mission: z.string(), alignment: scoreField, why: z.string() })).min(1),
  }),
  buildUserPrompt: (i) => `Worldview: ${i.worldview ?? "(n/a)"}\nValues: ${i.values.join("; ")}\nThemes: ${i.themes.join("; ")}\nPropose mission candidates with alignment.`,
  example: {
    input: { values: ["Learning", "Contribution"], themes: ["teaching"] },
    output: { candidates: [{ mission: "Compound and transfer understanding so others build faster.", alignment: 0.85, why: "Fuses the learning and contribution values." }] },
  },
});

/* WV-4 ─ IdentityNavigator */
export const IdentityNavigator = defineAgent({
  name: "IdentityNavigator",
  description: "Recommend identities and a roadmap that fit a person's worldview.",
  system: `${WV_TONE} From the worldview and mission, recommend identities to grow into and a short roadmap. Reference identity archetypes by common name.`,
  inputSchema: z.object({ worldview: z.string().optional(), mission: z.string().optional() }),
  outputSchema: z.object({
    identities: z.array(z.object({ identity: z.string(), why: z.string() })).min(1),
    roadmap: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Worldview: ${i.worldview ?? "(n/a)"}\nMission: ${i.mission ?? "(n/a)"}\nRecommend identities + a roadmap.`,
  example: {
    input: { mission: "Transfer understanding" },
    output: { identities: [{ identity: "Teacher", why: "Directly serves the mission." }, { identity: "Builder", why: "Turns understanding into tools." }],
      roadmap: ["Practice teaching in public weekly", "Ship one learning tool this quarter"] },
  },
});

/* WV-5 ─ WorldviewSimulator */
export const WorldviewSimulator = defineAgent({
  name: "WorldviewSimulator",
  description: "Simulate the behaviors, decisions and outcomes two worldviews would produce.",
  system: `${WV_TONE} Given two worldviews (or a current vs proposed one), project the behaviors, decisions and likely outcomes each leads to. Be concrete and even-handed.`,
  inputSchema: z.object({ worldviewA: z.string(), worldviewB: z.string(), context: z.string().optional() }),
  outputSchema: z.object({
    a: z.object({ behaviors: z.array(z.string()), decisions: z.array(z.string()), outcomes: z.array(z.string()) }),
    b: z.object({ behaviors: z.array(z.string()), decisions: z.array(z.string()), outcomes: z.array(z.string()) }),
    contrast: z.string(),
  }),
  buildUserPrompt: (i) => `Worldview A: ${i.worldviewA}\nWorldview B: ${i.worldviewB}\nContext: ${i.context ?? "(n/a)"}\nProject behaviors, decisions, outcomes for each; contrast them.`,
  example: {
    input: { worldviewA: "Effort alone creates success", worldviewB: "Leverage and selection create success" },
    output: { a: { behaviors: ["Works longer hours"], decisions: ["Takes on more tasks"], outcomes: ["Burnout, linear results"] },
      b: { behaviors: ["Chooses high-leverage bets"], decisions: ["Says no often"], outcomes: ["Non-linear results"] },
      contrast: "B compounds; A grinds. Same effort, different selection." },
  },
});

/* WV-6 ─ WorldviewTwinArchitect */
export const WorldviewTwinArchitect = defineAgent({
  name: "WorldviewTwinArchitect",
  description: "Maintain a worldview twin and detect drift between stated and enacted worldview.",
  system: `${WV_TONE} Given a worldview snapshot and recent behavior, detect drift between stated and enacted worldview and suggest conscious evolution steps.`,
  inputSchema: z.object({ snapshot: z.record(z.string(), z.unknown()), recentBehavior: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    driftDetected: z.boolean(), drift: z.string(), evolutionSuggestions: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Snapshot: ${JSON.stringify(i.snapshot)}\nRecent behavior:\n${i.recentBehavior.join("\n")}\nDetect drift and suggest conscious evolution.`,
  example: {
    input: { snapshot: { stated: "long-term" }, recentBehavior: ["Chased a quick win that hurt trust"] },
    output: { driftDetected: true, drift: "Stated long-term worldview, acted short-term under pressure.",
      evolutionSuggestions: ["Add a long-term check to high-pressure decisions", "Review the trust cost weekly"] },
  },
});
