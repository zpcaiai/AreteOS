import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* ───────────────────────── Identity Library Engine ───────────────────────── */
const IDL_TONE = BASE_TONE + " Identity is a stable self-concept that organizes attention, values, decisions and long-term behavior — NOT a job title or personality type. Goals fail; identity persists. Avoid career advice, MBTI gimmicks, and motivational language. Be observable and evolutionary.";

const STACK_ROLE = z.enum(["PRIMARY","SECONDARY","EMERGING","LEGACY"]);
const STAGE = z.enum(["DISCOVER","CHOOSE","PRACTICE","INTERNALIZE","INTEGRATE","MASTER","TEACH","LEGACY"]);

/* IDL-1 ─ IdentityExplorer */
export const IdentityExplorer = defineAgent({
  name: "IdentityExplorer",
  description: "Help a user surface which identities already drive their attention and behavior.",
  system: `${IDL_TONE} From the user's reflections, surface the identities they already enact (with evidence) and ones latent or aspired-to.`,
  inputSchema: z.object({ reflections: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    enacted: z.array(z.object({ identity: z.string(), evidence: z.string() })),
    latent: z.array(z.string()), questions: z.array(z.string()).default([]),
  }),
  buildUserPrompt: (i) => `Reflections:\n${i.reflections.join("\n")}\nSurface enacted identities (with evidence), latent ones, and clarifying questions.`,
  example: {
    input: { reflections: ["I lose time reading papers and re-deriving results"] },
    output: { enacted: [{ identity: "Researcher", evidence: "Spends discretionary time on disciplined inquiry." }],
      latent: ["Teacher"], questions: ["Whose understanding do you most want to advance?"] },
  },
});

/* IDL-2 ─ IdentityAssessor */
export const IdentityAssessor = defineAgent({
  name: "IdentityAssessor",
  description: "Score a user's identity clarity, alignment, stability, conflict, evolution, integration.",
  system: `${IDL_TONE} Score the six identity dimensions 0..1 and give a one-paragraph diagnosis.`,
  inputSchema: z.object({ reflections: z.array(z.string()).default([]), mission: z.string().optional() }),
  outputSchema: z.object({
    scores: z.object({ clarity: scoreField, alignment: scoreField, stability: scoreField, conflict: scoreField, evolution: scoreField, integration: scoreField }),
    summary: z.string(),
  }),
  buildUserPrompt: (i) => `Mission: ${i.mission ?? "(n/a)"}\nReflections:\n${i.reflections.join("\n")}\nScore the six identity dimensions and summarize.`,
  example: {
    input: { reflections: ["I switch between researcher and founder and feel torn"], mission: "Advance and apply understanding" },
    output: { scores: { clarity: 0.5, alignment: 0.6, stability: 0.5, conflict: 0.4, evolution: 0.5, integration: 0.4 },
      summary: "Two strong identities pull in different directions; integration is the binding constraint." },
  },
});

/* IDL-3 ─ IdentityStackBuilder */
export const IdentityStackBuilder = defineAgent({
  name: "IdentityStackBuilder",
  description: "Compose a coherent identity stack (primary/secondary/emerging/legacy).",
  system: `${IDL_TONE} Build an identity stack from the user's mission, values and strengths. Assign each a role and a current evolution stage.`,
  inputSchema: z.object({ mission: z.string().optional(), values: z.array(z.string()).default([]), strengths: z.array(z.string()).default([]), current: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    stack: z.array(z.object({ archetype: z.string(), role: STACK_ROLE, stage: STAGE, why: z.string() })).min(1),
  }),
  buildUserPrompt: (i) => `Mission: ${i.mission ?? "(n/a)"}\nValues: ${i.values.join("; ")}\nStrengths: ${i.strengths.join("; ")}\nCurrent identities: ${i.current.join("; ")}\nCompose a primary/secondary/emerging/legacy stack with stages.`,
  example: {
    input: { mission: "Advance and apply understanding", strengths: ["analysis", "building"] },
    output: { stack: [
      { archetype: "Researcher", role: "PRIMARY", stage: "INTERNALIZE", why: "Core driver of attention and standards." },
      { archetype: "Architect", role: "SECONDARY", stage: "PRACTICE", why: "Turns understanding into systems." },
      { archetype: "Entrepreneur", role: "EMERGING", stage: "CHOOSE", why: "Next growth edge: act under uncertainty." },
      { archetype: "Mentor", role: "LEGACY", stage: "DISCOVER", why: "Long-term: grow others beyond yourself." }] },
  },
});

/* IDL-4 ─ IdentityConflictAnalyzer */
export const IdentityConflictAnalyzer = defineAgent({
  name: "IdentityConflictAnalyzer",
  description: "Detect tensions between identities and propose an integration strategy.",
  system: `${IDL_TONE} Find genuine conflicts between identities in the stack, score severity 0..1, and give trade-offs + an integration strategy.`,
  inputSchema: z.object({ identities: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    conflicts: z.array(z.object({ identityA: z.string(), identityB: z.string(), tension: z.string(), tradeoffs: z.array(z.string()), integration: z.string(), severity: scoreField })),
  }),
  buildUserPrompt: (i) => `Identities: ${i.identities.join("; ")}\nDetect conflicts, score severity, give trade-offs and integration.`,
  example: {
    input: { identities: ["Researcher", "Entrepreneur"] },
    output: { conflicts: [{ identityA: "Researcher", identityB: "Entrepreneur",
      tension: "Researcher needs certainty; entrepreneur acts under uncertainty.",
      tradeoffs: ["Rigor vs speed", "Truth vs traction"],
      integration: "Run the company as a series of falsifiable experiments — rigor in service of action.", severity: 0.5 }] },
  },
});

/* IDL-5 ─ IdentityEvolutionCoach */
export const IdentityEvolutionCoach = defineAgent({
  name: "IdentityEvolutionCoach",
  description: "Coach a user through the 8 identity evolution stages.",
  system: `${IDL_TONE} Given an identity and its current stage, give the next stage, what to practice, and how to know it's internalized.`,
  inputSchema: z.object({ archetype: z.string(), stage: STAGE, context: z.string().optional() }),
  outputSchema: z.object({ nextStage: STAGE, practices: z.array(z.string()), evidenceOfProgress: z.array(z.string()) }),
  buildUserPrompt: (i) => `Identity: ${i.archetype}\nCurrent stage: ${i.stage}\nContext: ${i.context ?? "(n/a)"}\nGive the next stage, practices, and evidence of progress.`,
  example: {
    input: { archetype: "Researcher", stage: "PRACTICE" },
    output: { nextStage: "INTERNALIZE", practices: ["Default to evidence before opinion daily", "Publish one falsifiable claim weekly"],
      evidenceOfProgress: ["You reach for evidence without prompting", "Identity survives a setback"] },
  },
});

/* IDL-6 ─ IdentityRecommendationAgent */
export const IdentityRecommendationAgent = defineAgent({
  name: "IdentityRecommendationAgent",
  description: "Recommend identities and a stack from mission, values, goals and strengths.",
  system: `${IDL_TONE} Recommend high-leverage identities (by archetype name) with a fit score 0..1 and a rationale tied to the user's mission.`,
  inputSchema: z.object({ mission: z.string().optional(), values: z.array(z.string()).default([]), goals: z.array(z.string()).default([]), strengths: z.array(z.string()).default([]), desiredFuture: z.string().optional() }),
  outputSchema: z.object({
    recommendations: z.array(z.object({ archetype: z.string(), role: STACK_ROLE, fitScore: scoreField, rationale: z.string() })).min(1),
    growthPath: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Mission: ${i.mission ?? "(n/a)"}\nValues: ${i.values.join("; ")}\nGoals: ${i.goals.join("; ")}\nStrengths: ${i.strengths.join("; ")}\nDesired future: ${i.desiredFuture ?? "(n/a)"}\nRecommend identities with fit scores and a growth path.`,
  example: {
    input: { mission: "Make understanding accessible", strengths: ["teaching", "writing"] },
    output: { recommendations: [
      { archetype: "Teacher", role: "PRIMARY", fitScore: 0.85, rationale: "Mission centers on growing others' understanding." },
      { archetype: "Storyteller", role: "SECONDARY", fitScore: 0.7, rationale: "Makes ideas land and spread." }],
      growthPath: ["Practice the Teacher identity in public weekly", "Add Storyteller craft to amplify reach"] },
  },
});

/* IDL-7 ─ IdentityBlueprintGenerator */
export const IdentityBlueprintGenerator = defineAgent({
  name: "IdentityBlueprintGenerator",
  description: "Generate a full identity blueprint for any archetype.",
  system: `${IDL_TONE} Produce a complete identity blueprint: mission, identity statement, values, beliefs, mental models, decision rules, habits, capabilities, shadow patterns, failure modes, growth path, legacy expression.`,
  inputSchema: z.object({ archetype: z.string(), family: z.string().optional() }),
  outputSchema: z.object({
    mission: z.string(), identityStatement: z.string(),
    values: z.array(z.string()), beliefs: z.array(z.string()), mentalModels: z.array(z.string()),
    decisionRules: z.array(z.string()), habits: z.array(z.string()), capabilities: z.array(z.string()),
    shadowPatterns: z.array(z.string()), failureModes: z.array(z.string()),
    growthPath: z.array(z.string()), legacyExpression: z.string(),
  }),
  buildUserPrompt: (i) => `Archetype: ${i.archetype}\nFamily: ${i.family ?? "(infer)"}\nGenerate the full identity blueprint.`,
  example: {
    input: { archetype: "Builder", family: "Builders" },
    output: { mission: "Turn ideas into working reality.", identityStatement: "I transform ideas into reality.",
      values: ["Craft", "Reliability", "Pragmatism"], beliefs: ["Shipping beats theorizing", "Reality is the judge"],
      mentalModels: ["Systems thinking", "Constraints theory"], decisionRules: ["Bias to a working prototype", "Cut scope before quality"],
      habits: ["Daily build", "Refactor relentlessly"], capabilities: ["Implementation", "Debugging", "Sequencing"],
      shadowPatterns: ["Building before deciding what matters"], failureModes: ["Polishing the wrong thing"],
      growthPath: ["Discover","Choose","Practice","Internalize","Integrate","Master","Teach","Legacy"],
      legacyExpression: "Systems and people that keep building after you." },
  },
});
