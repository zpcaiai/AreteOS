import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* ═══════════════════════════════════════════════════════════════════════════
   Psychology OS — ported & secularized from the emotion-sphere engines.
   These are LLM agents (auto-exposed at POST /api/agents/:name). The
   deterministic engines (Formation trajectory, decision-source scoring, habit
   FSM, persona tags) live under src/lib/psychology/* as pure functions.
   ═══════════════════════════════════════════════════════════════════════════ */
const PSY_TONE = BASE_TONE +
  " Ground every claim in evidence-based psychology (CBT, narrative identity, behavioral activation). " +
  "Never diagnose, never pathologize, never use moral labels. Frame patterns as changeable tendencies, not fixed traits.";

const scale10 = z.number().int().min(1).max(10);

/* ─────────────── PSY-1 · CbtReframe (L1 — Beck ABC model) ─────────────── */
// Source: psychology_engine.py → CognitiveSchema / SchemaEngine
export const CbtReframe = defineAgent({
  name: "CbtReframe",
  description: "Run a thought through the CBT ABC model (3-layer belief hierarchy) and produce evidence-based reframes.",
  system: `${PSY_TONE} Apply Beck's cognitive model. From an activating event + the user's reaction, surface the belief hierarchy (automatic thought → intermediate beliefs: attitude/rules/assumptions → core beliefs about self/others/world), name the cognitive distortion, the emotional/behavioral/physiological consequences, then give a reframe at each layer plus evidence against the distorted belief. Score severity and belief-strength 1..10.`,
  inputSchema: z.object({
    activatingEvent: z.string(),
    automaticThought: z.string().default(""),
    reaction: z.string().default(""),
  }),
  outputSchema: z.object({
    distortionType: z.string(),
    activatingEvent: z.string(),
    beliefHierarchy: z.object({
      automaticThought: z.string(),
      intermediate: z.object({ attitude: z.string(), rules: z.string(), assumptions: z.string() }),
      core: z.object({ self: z.string(), others: z.string(), world: z.string() }),
    }),
    consequences: z.object({ emotional: z.string(), behavioral: z.string(), physiological: z.string() }),
    reframing: z.object({ automatic: z.string(), intermediate: z.string(), core: z.string(), synthesis: z.string() }),
    evidenceAgainst: z.array(z.string()),
    severityScore: scale10,
    beliefStrength: scale10,
  }),
  buildUserPrompt: (i) =>
    `Activating event: ${i.activatingEvent}\nAutomatic thought: ${i.automaticThought || "(infer it)"}\nReaction: ${i.reaction || "(infer it)"}\nMap the full ABC belief hierarchy, distortion, consequences, layered reframes and counter-evidence.`,
  example: {
    input: { activatingEvent: "My manager gave terse feedback on my draft." },
    output: {
      distortionType: "Mind-reading + catastrophizing",
      activatingEvent: "Manager gave terse feedback on a draft.",
      beliefHierarchy: {
        automaticThought: "He thinks I'm incompetent and I'll be fired.",
        intermediate: { attitude: "Criticism is dangerous.", rules: "I must be flawless to be safe.", assumptions: "If my work isn't perfect, I'll be rejected." },
        core: { self: "I'm not good enough.", others: "Others are waiting to judge me.", world: "The world is unforgiving of mistakes." },
      },
      consequences: { emotional: "Anxiety, shame", behavioral: "Avoid sending future drafts", physiological: "Tight chest, shallow breathing" },
      reframing: {
        automatic: "Terse feedback is about the draft, not my worth.",
        intermediate: "Feedback is information, not a verdict.",
        core: "I am competent and still learning; both are true.",
        synthesis: "A short note on one draft is data to improve, not evidence I'm failing.",
      },
      evidenceAgainst: ["He assigned me this project last week.", "Past terse notes were followed by approval."],
      severityScore: 6, beliefStrength: 7,
    },
  },
});

/* ─────────────── PSY-2 · PersonalityDriver (L0 — deep driver) ─────────────── */
// Source: psychology_engine.py → PersonalityDriver / PersonalityCausalEngine
export const PersonalityDriver = defineAgent({
  name: "PersonalityDriver",
  description: "Trace a surface complaint to its deep emotional driver and behavioral loop (e.g. perfectionism, impostor pattern).",
  system: `${PSY_TONE} From a surface problem, infer the deep emotion, the hidden dynamics, the self-reinforcing behavioral cycle (trigger → response → short-term relief → long-term cost), the personality tendencies in play, the underlying core belief, and the long-term risk if unaddressed. Set an intervention priority 1..5 (5 = most urgent). Name the driver category (e.g. perfectionism, impostor-pattern, approval-seeking).`,
  inputSchema: z.object({ surfaceProblem: z.string(), context: z.string().default("") }),
  outputSchema: z.object({
    driverCategory: z.string(),
    surfaceProblem: z.string(),
    deepEmotion: z.string(),
    hiddenDynamics: z.string(),
    behavioralCycle: z.object({ trigger: z.string(), response: z.string(), relief: z.string(), cost: z.string() }),
    personalityTraits: z.array(z.string()),
    coreBelief: z.string(),
    longTermRisk: z.string(),
    interventionPriority: z.number().int().min(1).max(5),
  }),
  buildUserPrompt: (i) => `Surface problem: ${i.surfaceProblem}\nContext: ${i.context || "(n/a)"}\nTrace it to the deep driver, cycle, core belief and long-term risk.`,
  example: {
    input: { surfaceProblem: "I keep redoing my work and miss deadlines." },
    output: {
      driverCategory: "Perfectionism",
      surfaceProblem: "Repeated rework, missed deadlines.",
      deepEmotion: "Fear of being judged as inadequate.",
      hiddenDynamics: "Perfection is used as pre-emptive armor against criticism.",
      behavioralCycle: { trigger: "Work feels 'not good enough'", response: "Endless polishing", relief: "Temporary anxiety drop", cost: "Missed deadlines reinforce the inadequacy fear" },
      personalityTraits: ["High conscientiousness", "High self-criticism"],
      coreBelief: "My worth equals my output's flawlessness.",
      longTermRisk: "Burnout and chronic underdelivery despite high effort.",
      interventionPriority: 4,
    },
  },
});

/* ─────────────── PSY-3 · NarrativeIdentity (L3 — McAdams) ─────────────── */
// Source: psychology_engine.py → IdentityNarrative / IdentityEngine
export const NarrativeIdentity = defineAgent({
  name: "NarrativeIdentity",
  description: "Classify a life-story reflection by McAdams narrative type and score coherence, agency and redemption.",
  system: `${PSY_TONE} Using Dan McAdams' narrative identity theory, classify the dominant narrative type (redemption | contamination | turning_point | stability), give it a title, extract identity themes and core values, and score coherence, agency and redemption 1..10. Redemption = bad→good arc; contamination = good→bad arc.`,
  inputSchema: z.object({ history: z.array(z.string()).min(1) }),
  outputSchema: z.object({
    narrativeType: z.enum(["redemption", "contamination", "turning_point", "stability"]),
    narrativeTitle: z.string(),
    identityThemes: z.array(z.string()),
    coreValues: z.array(z.string()),
    coherenceScore: scale10,
    agencyScore: scale10,
    redemptionScore: scale10,
  }),
  buildUserPrompt: (i) => `Life-story entries:\n${i.history.join("\n---\n")}\nClassify the narrative, extract themes/values, and score coherence, agency, redemption.`,
  example: {
    input: { history: ["I burned out and quit, but that forced me to rebuild my work around what I actually value."] },
    output: {
      narrativeType: "redemption",
      narrativeTitle: "Burnout as a reset",
      identityThemes: ["Reinvention", "Value-driven work"],
      coreValues: ["Authenticity", "Sustainability"],
      coherenceScore: 7, agencyScore: 6, redemptionScore: 8,
    },
  },
});

/* ─────────────── PSY-4 · StateAssessment (L2 — state snapshot) ─────────────── */
// Source: psychology_engine.py → PsychologicalState / StateMachineEngine
export const StateAssessment = defineAgent({
  name: "StateAssessment",
  description: "Take a brief check-in and return a psychological state snapshot with a recommended micro-action.",
  system: `${PSY_TONE} From a short check-in, name the state, set state_level 1..3 (1=regulated, 2=strained, 3=overwhelmed), arousal 1..10, valence -5..5, focus 1..10, list triggering and protective factors, and give one concrete recommended action plus an escalation note if state_level is 3.`,
  inputSchema: z.object({ checkIn: z.string(), intensity: scale10.default(5) }),
  outputSchema: z.object({
    stateName: z.string(),
    stateLevel: z.number().int().min(1).max(3),
    arousalLevel: scale10,
    valenceScore: z.number().int().min(-5).max(5),
    focusCapacity: scale10,
    triggeringFactors: z.array(z.string()),
    protectiveFactors: z.array(z.string()),
    recommendedAction: z.string(),
    escalationProtocol: z.string().default(""),
  }),
  buildUserPrompt: (i) => `Check-in: ${i.checkIn}\nReported intensity: ${i.intensity}/10\nReturn the state snapshot and one recommended action.`,
  example: {
    input: { checkIn: "Wired, can't focus, three deadlines colliding.", intensity: 8 },
    output: {
      stateName: "Overload / scattered focus", stateLevel: 2, arousalLevel: 8, valenceScore: -2, focusCapacity: 3,
      triggeringFactors: ["Colliding deadlines", "No buffer time"], protectiveFactors: ["Awareness of the state"],
      recommendedAction: "Pick the single highest-leverage task and timebox 25 minutes on only that.",
      escalationProtocol: "",
    },
  },
});

/* ─────────────── PSY-5 · BehaviorRegulation (Praxis — energy tiers) ─────────────── */
// Source: habit_behavior_engine.py → BehaviorRegulationEngine.regulate
export const BehaviorRegulation = defineAgent({
  name: "BehaviorRegulation",
  description: "Adapt a task to current energy: downgrade to the minimum executable action with a Green/Yellow/Red tier.",
  system: `${PSY_TONE} Behavioral activation under low energy. Given a task + energy 1..5 + motivation 1..10 + prior failures, estimate current resistance 1..10, name the psychological state, give the minimum executable action (≤60s if energy is low), a downgraded task version, emotional compensation (reframe partial completion as success), continuity advice, and a tier: Green (energy≥4) | Yellow (≥3) | Red (else).`,
  inputSchema: z.object({
    task: z.string(),
    energyLevel: z.number().int().min(1).max(5).default(3),
    motivation: scale10.default(5),
    previousFailures: z.number().int().min(0).default(0),
  }),
  outputSchema: z.object({
    currentResistance: scale10,
    currentPsychologicalState: z.string(),
    minExecutableAction: z.string(),
    taskDowngrade: z.string(),
    emotionalCompensation: z.string(),
    continuityAdvice: z.string(),
    selectedTier: z.enum(["Green", "Yellow", "Red"]),
  }),
  buildUserPrompt: (i) => `Task: ${i.task}\nEnergy: ${i.energyLevel}/5\nMotivation: ${i.motivation}/10\nPrevious failures: ${i.previousFailures}\nReturn an energy-matched regulation plan.`,
  example: {
    input: { task: "Write the quarterly report", energyLevel: 2, motivation: 4, previousFailures: 2 },
    output: {
      currentResistance: 8, currentPsychologicalState: "Low energy, high resistance",
      minExecutableAction: "Open the report doc and write one bullet.",
      taskDowngrade: "Outline only — 5 minutes.",
      emotionalCompensation: "Any start counts; the system downshifted on purpose — not a failure.",
      continuityAdvice: "Stop after the timer; momentum matters more than volume today.",
      selectedTier: "Red",
    },
  },
});

/* ─────────────── PSY-6 · DecisionMotiveGuide (Phronesis — motive→guidance) ─────────────── */
// Source: decision_support.py / discernment_engine.py (secularized)
export const DecisionMotiveGuide = defineAgent({
  name: "DecisionMotiveGuide",
  description: "Surface the motive behind a pending decision, flag the driving source, and give calibrated guidance.",
  system: `${PSY_TONE} For a pending decision, analyze the underlying motives (note how much each of fear, pride, desire, duty/values, love/care is driving it, each 0..1), classify the dominant SOURCE (values | fear | pride | impulse | social_pressure | mixed | uncertain), give a guidance priority (proceed | pause | reframe | seek_input), the reasoning, 2-3 alternatives, and a humility note acknowledging uncertainty. Calibrate confidence 0..1.`,
  inputSchema: z.object({
    decision: z.string(),
    emotionalContext: z.string().default(""),
  }),
  outputSchema: z.object({
    motiveProfile: z.object({ fear: scoreField, pride: scoreField, desire: scoreField, duty: scoreField, care: scoreField }),
    dominantSource: z.enum(["values", "fear", "pride", "impulse", "social_pressure", "mixed", "uncertain"]),
    guidancePriority: z.enum(["proceed", "pause", "reframe", "seek_input"]),
    reasoning: z.string(),
    alternatives: z.array(z.string()),
    humilityNote: z.string(),
    confidence: scoreField,
  }),
  buildUserPrompt: (i) => `Pending decision: ${i.decision}\nEmotional context: ${i.emotionalContext || "(n/a)"}\nAnalyze motives, name the dominant source, and give calibrated guidance.`,
  example: {
    input: { decision: "Quit my job tomorrow after a bad review.", emotionalContext: "Angry and humiliated." },
    output: {
      motiveProfile: { fear: 0.4, pride: 0.7, desire: 0.3, duty: 0.2, care: 0.2 },
      dominantSource: "pride",
      guidancePriority: "pause",
      reasoning: "The decision is currently pride/anger-driven, made at peak emotional arousal — a classic low-quality decision window.",
      alternatives: ["Sleep on it and re-decide in 72 hours", "Separate the review's signal from its tone", "Draft the resignation but don't send it"],
      humilityNote: "This reads the motive from limited context; only you can verify what's actually driving you.",
      confidence: 0.6,
    },
  },
});

/* ─────────────── PSY-7 · GrowthSynthesis (L4 — growth metrics) ─────────────── */
// Source: psychology_engine.py → GrowthMetrics / GrowthEngine
export const GrowthSynthesis = defineAgent({
  name: "GrowthSynthesis",
  description: "Synthesize a run of reflections into five growth metrics (0..1) and concrete insights.",
  system: `${PSY_TONE} From a history of reflections, score five growth metrics 0..1 — emotional regulation, cognitive flexibility, behavioral activation, interpersonal effectiveness, self-concept clarity — and extract specific, evidence-grounded insights (no platitudes).`,
  inputSchema: z.object({ reflections: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    metrics: z.object({
      emotionalRegulation: scoreField, cognitiveFlexibility: scoreField, behavioralActivation: scoreField,
      interpersonalEffectiveness: scoreField, selfConceptClarity: scoreField,
    }),
    insights: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Reflections:\n${i.reflections.join("\n")}\nScore the five growth metrics and extract concrete insights.`,
  example: {
    input: { reflections: ["I noticed my anger earlier this week and chose to wait before replying."] },
    output: {
      metrics: { emotionalRegulation: 0.6, cognitiveFlexibility: 0.55, behavioralActivation: 0.5, interpersonalEffectiveness: 0.55, selfConceptClarity: 0.6 },
      insights: ["Early emotion-labeling is becoming a reliable regulation tool for you."],
    },
  },
});
