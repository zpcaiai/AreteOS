import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* ───────────────────────── Cognitive OS — Judgment & Decision ───────────────────────── */
const COG_TONE = BASE_TONE + " Optimize judgment quality over information quantity. Inspired by widely-taught ideas: a latticework of mental models, decision quality, cognitive biases, reasoning under uncertainty, and strategic diagnosis. Evidence-based, long-term, model-diverse. No productivity hacks.";

/* COG-1 ─ LatticeworkBuilder */
export const LatticeworkBuilder = defineAgent({
  name: "LatticeworkBuilder",
  description: "Build a personal latticework of mental models for a goal, and surface blind spots.",
  system: `${COG_TONE} For a goal, select a diverse set of relevant mental models (name + category), connect them, and name the blind spots a single-discipline view would miss.`,
  inputSchema: z.object({ goal: z.string(), known: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    nodes: z.array(z.object({ model: z.string(), category: z.string() })).min(1),
    edges: z.array(z.object({ from: z.string(), to: z.string(), relation: z.string() })),
    blindSpots: z.array(z.string()), synergy: z.string(),
  }),
  buildUserPrompt: (i) => `Goal: ${i.goal}\nKnown models: ${i.known.join("; ")}\nBuild a diverse latticework (nodes + edges), name blind spots and the synergy.`,
  example: {
    input: { goal: "Build an AI startup" },
    output: { nodes: [{ model: "Opportunity Cost", category: "Economics" }, { model: "Network Effects", category: "Economics" }, { model: "Second-Order Effects", category: "Systems" }, { model: "Margin of Safety", category: "Decision Science" }],
      edges: [{ from: "Network Effects", to: "Compounding", relation: "amplifies" }],
      blindSpots: ["Psychology of adoption", "Tail risk in funding"], synergy: "Economic + systems models together predict both growth and failure modes." },
  },
});

/* COG-2 ─ DecisionLensAnalyzer */
export const DecisionLensAnalyzer = defineAgent({
  name: "DecisionLensAnalyzer",
  description: "Analyze a decision through multiple lenses and give a confidence score.",
  system: `${COG_TONE} Analyze the decision through mission, identity, economics, probability, systems, psychology, risk and time-horizon lenses. Give a calibrated confidence 0..1.`,
  inputSchema: z.object({ decision: z.string(), context: z.string().optional() }),
  outputSchema: z.object({
    lenses: z.array(z.object({ lens: z.string(), reading: z.string() })).min(1),
    recommendation: z.string(), confidence: scoreField,
  }),
  buildUserPrompt: (i) => `Decision: ${i.decision}\nContext: ${i.context ?? "(n/a)"}\nAnalyze through each lens, recommend, and give calibrated confidence.`,
  example: {
    input: { decision: "Should I start a company?" },
    output: { lenses: [{ lens: "Opportunity cost", reading: "Foregoes a stable senior role." }, { lens: "Expected value", reading: "Low odds, high payoff — positive EV if downside is survivable." }, { lens: "Identity", reading: "Aligns with a builder identity." }],
      recommendation: "Proceed with a capped, reversible first step.", confidence: 0.62 },
  },
});

/* COG-3 ─ BiasDetector */
export const BiasDetector = defineAgent({
  name: "BiasDetector",
  description: "Detect likely cognitive biases in a piece of reasoning and suggest corrections.",
  system: `${COG_TONE} Identify the cognitive biases most likely at play, score severity 0..1, and give a concrete correction for each.`,
  inputSchema: z.object({ reasoning: z.string() }),
  outputSchema: z.object({
    biases: z.array(z.object({ bias: z.string(), severity: scoreField, evidence: z.string(), correction: z.string() })),
    riskScore: scoreField,
  }),
  buildUserPrompt: (i) => `Reasoning:\n${i.reasoning}\nDetect biases, score severity, and give corrections.`,
  example: {
    input: { reasoning: "This will work because it worked last time and everyone agrees." },
    output: { biases: [{ bias: "Recency bias", severity: 0.6, evidence: "Generalizes from one recent case.", correction: "Check base rates across many cases." }, { bias: "Social proof", severity: 0.5, evidence: "'Everyone agrees'.", correction: "Separate consensus from correctness." }], riskScore: 0.55 },
  },
});

/* COG-4 ─ JudgmentCoach */
export const JudgmentCoach = defineAgent({
  name: "JudgmentCoach",
  description: "Assess judgment quality across eight dimensions and give a development plan.",
  system: `${COG_TONE} Score judgment dimensions (problem framing, evidence quality, model diversity, bias resistance, long-term thinking, second-order thinking, risk awareness, decision clarity) 0..1 and prescribe development.`,
  inputSchema: z.object({ reflections: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ problemFraming: scoreField, evidenceQuality: scoreField, modelDiversity: scoreField, biasResistance: scoreField, longTermThinking: scoreField, secondOrderThinking: scoreField, riskAwareness: scoreField, decisionClarity: scoreField }),
    developmentPlan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Reflections:\n${i.reflections.join("\n")}\nScore judgment dimensions and give a development plan.`,
  example: {
    input: { reflections: ["I decide fast but rarely write down why"] },
    output: { scores: { problemFraming: 0.5, evidenceQuality: 0.5, modelDiversity: 0.4, biasResistance: 0.4, longTermThinking: 0.5, secondOrderThinking: 0.4, riskAwareness: 0.5, decisionClarity: 0.6 },
      developmentPlan: ["Keep a decision journal", "Apply two extra mental models per big call"] },
  },
});

/* COG-5 ─ DecisionJournalGuide */
export const DecisionJournalGuide = defineAgent({
  name: "DecisionJournalGuide",
  description: "Structure a decision into a journal entry (assumptions, expected outcome).",
  system: `${COG_TONE} Turn a decision into a structured journal entry: clear framing, explicit assumptions, the expected outcome, and which models apply.`,
  inputSchema: z.object({ decision: z.string(), context: z.string().optional() }),
  outputSchema: z.object({
    framing: z.string(), assumptions: z.array(z.string()), expectedOutcome: z.string(), modelsToApply: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Decision: ${i.decision}\nContext: ${i.context ?? "(n/a)"}\nStructure the journal entry.`,
  example: {
    input: { decision: "Hire a senior engineer now" },
    output: { framing: "Trade current runway for delivery speed.", assumptions: ["Pipeline stays full", "Onboarding takes 6 weeks"],
      expectedOutcome: "Ship 30% faster within a quarter.", modelsToApply: ["Opportunity cost", "Margin of safety"] },
  },
});

/* COG-6 ─ MetaThinkingCoach */
export const MetaThinkingCoach = defineAgent({
  name: "MetaThinkingCoach",
  description: "Map how a person thinks: cognitive profile, strengths, weaknesses.",
  system: `${COG_TONE} From the inputs, characterize thinking/decision/learning/reasoning/risk styles and name strengths and weaknesses.`,
  inputSchema: z.object({ reflections: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    thinkingStyle: z.string(), decisionStyle: z.string(), learningStyle: z.string(), reasoningStyle: z.string(), riskStyle: z.string(),
    strengths: z.array(z.string()), weaknesses: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Reflections:\n${i.reflections.join("\n")}\nCharacterize the cognitive profile.`,
  example: {
    input: { reflections: ["I jump to action and trust intuition"] },
    output: { thinkingStyle: "Intuitive-fast", decisionStyle: "Decisive", learningStyle: "Experiential", reasoningStyle: "Heuristic", riskStyle: "Risk-tolerant",
      strengths: ["Speed", "Bias to action"], weaknesses: ["Under-weighs evidence", "Skips second-order effects"] },
  },
});

/* COG-7 ─ UncertaintyStrategist */
export const UncertaintyStrategist = defineAgent({
  name: "UncertaintyStrategist",
  description: "Reason under uncertainty: robustness, optionality, tail risk, antifragility.",
  system: `${COG_TONE} Assess robustness, fragility, optionality and tail-risk awareness 0..1; map options (upside, capped downside) and tail risks (exposure, mitigation).`,
  inputSchema: z.object({ situation: z.string(), context: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ robustness: scoreField, fragility: scoreField, optionality: scoreField, tailRiskAwareness: scoreField }),
    options: z.array(z.object({ option: z.string(), upside: z.string(), cappedDownside: z.boolean() })),
    tailRisks: z.array(z.object({ risk: z.string(), exposure: scoreField, mitigation: z.string() })),
    profile: z.string(),
  }),
  buildUserPrompt: (i) => `Situation: ${i.situation}\nContext: ${i.context.join("; ")}\nAssess uncertainty handling, map options and tail risks.`,
  example: {
    input: { situation: "Launching into an uncertain market" },
    output: { scores: { robustness: 0.5, fragility: 0.5, optionality: 0.6, tailRiskAwareness: 0.4 },
      options: [{ option: "Soft launch in one segment", upside: "Learn cheaply", cappedDownside: true }],
      tailRisks: [{ risk: "Single-channel dependency", exposure: 0.6, mitigation: "Diversify acquisition early" }], profile: "Moderately antifragile; reduce single points of failure." },
  },
});

/* COG-8 ─ StrategicDiagnostician */
export const StrategicDiagnostician = defineAgent({
  name: "StrategicDiagnostician",
  description: "Diagnose a problem: root causes, constraints, leverage points.",
  system: `${COG_TONE} Diagnose before prescribing: define the real problem, find root causes, name binding constraints, and identify high-leverage points (with impact 0..1).`,
  inputSchema: z.object({ problem: z.string(), context: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    diagnosis: z.string(), rootCauses: z.array(z.string()), constraints: z.array(z.string()),
    leveragePoints: z.array(z.object({ leverage: z.string(), impact: scoreField })),
  }),
  buildUserPrompt: (i) => `Problem: ${i.problem}\nContext: ${i.context.join("; ")}\nDiagnose root causes, constraints and leverage points.`,
  example: {
    input: { problem: "Growth has stalled" },
    output: { diagnosis: "Acquisition works but retention leaks.", rootCauses: ["Weak onboarding", "No activation metric"], constraints: ["One growth engineer"],
      leveragePoints: [{ leverage: "Fix first-session onboarding", impact: 0.8 }] },
  },
});

/* COG-9 ─ WisdomMentor (shared with Worldview OS) */
export const WisdomMentor = defineAgent({
  name: "WisdomMentor",
  description: "Convert decisions and reflections into durable wisdom and personal principles.",
  system: `${COG_TONE} From decision journals, reviews and reflections, extract durable insights and crisp personal principles (each with a rationale). No platitudes.`,
  inputSchema: z.object({ reflections: z.array(z.string()).default([]), lessons: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    insights: z.array(z.object({ insight: z.string(), basis: z.string() })),
    principles: z.array(z.object({ principle: z.string(), rationale: z.string() })),
  }),
  buildUserPrompt: (i) => `Reflections:\n${i.reflections.join("\n")}\nLessons:\n${i.lessons.join("\n")}\nExtract durable insights and personal principles.`,
  example: {
    input: { lessons: ["I lost money chasing a hot trend I didn't understand"] },
    output: { insights: [{ insight: "My worst losses came from outside my competence.", basis: "Pattern across three failed bets." }],
      principles: [{ principle: "Only bet where my knowledge is genuinely deep.", rationale: "Removes the largest, most repeated source of loss." }] },
  },
});
