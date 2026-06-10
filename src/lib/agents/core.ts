import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* 1 ─ MissionCoach */
export const MissionCoach = defineAgent({
  name: "MissionCoach",
  description: "Clarify why the user exists and the contribution they want to make.",
  system: `${BASE_TONE} You help the user articulate a Mission (why I exist), a Vision (where this leads), and concrete life priorities. Distinguish mission (timeless contribution) from goals (dated targets).`,
  inputSchema: z.object({
    reflections: z.array(z.string()).default([]),
    lifeThemes: z.array(z.string()).default([]),
    draft: z.string().optional(),
  }),
  outputSchema: z.object({
    missionStatement: z.string(),
    visionStatement: z.string(),
    lifePriorities: z.array(z.string()).min(1),
    clarifyingQuestions: z.array(z.string()).default([]),
  }),
  buildUserPrompt: (i) =>
    `Themes: ${i.lifeThemes?.join("; ") || "(none)"}\nReflections: ${i.reflections?.join(" | ") || "(none)"}\nDraft mission: ${i.draft ?? "(none)"}\nProduce mission, vision, 3-5 life priorities, and up to 3 clarifying questions.`,
  example: {
    input: { reflections: ["I lose track of time when teaching"], lifeThemes: ["learning", "building"], draft: "" },
    output: {
      missionStatement: "Compound and transfer understanding so others can build faster than I did.",
      visionStatement: "A body of teaching and tools that outlives me and raises the ceiling for builders.",
      lifePriorities: ["Master one hard domain deeply", "Teach in public weekly", "Build durable tools"],
      clarifyingQuestions: ["Whose progress do you most want to be responsible for?"],
    },
  },
});

/* 2 ─ WorldviewCoach */
export const WorldviewCoach = defineAgent({
  name: "WorldviewCoach",
  description: "Surface hidden assumptions about reality, success, failure, human nature, responsibility.",
  system: `${BASE_TONE} You reveal the user's operating assumptions and where they may be self-limiting or untested. You do not impose a worldview; you make the implicit explicit.`,
  inputSchema: z.object({ answers: z.array(z.object({ question: z.string(), answer: z.string() })).default([]) }),
  outputSchema: z.object({
    dimensions: z.array(z.object({ dimension: z.string(), stance: z.string() })),
    hiddenAssumptions: z.array(z.string()),
    testsToRun: z.array(z.string()).default([]),
  }),
  buildUserPrompt: (i) =>
    `Answers:\n${i.answers?.map((a) => `Q:${a.question} A:${a.answer}`).join("\n") || "(none)"}\nExtract worldview dimensions, name hidden assumptions, and propose cheap tests to check them.`,
  example: {
    input: { answers: [{ question: "What creates success?", answer: "Hard work" }] },
    output: {
      dimensions: [{ dimension: "success", stance: "Effort-centric; underweights leverage and selection." }],
      hiddenAssumptions: ["Effort is the binding constraint (vs. direction or compounding)."],
      testsToRun: ["For one month, track outcomes vs. hours to see if effort actually predicts results."],
    },
  },
});

/* 3 ─ IdentityCoach */
export const IdentityCoach = defineAgent({
  name: "IdentityCoach",
  description: "Clarify who the user is becoming and the gap between stated and enacted identity.",
  system: `${BASE_TONE} Behavior follows identity. You map identities/roles from the mission and flag where current behavior contradicts the claimed identity.`,
  inputSchema: z.object({
    mission: z.string().optional(),
    currentIdentities: z.array(z.string()).default([]),
    recentBehaviors: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({
    identities: z.array(z.object({ name: z.string(), statement: z.string() })),
    gaps: z.array(z.string()),
    identityProofs: z.array(z.string()).default([]),
  }),
  buildUserPrompt: (i) =>
    `Mission: ${i.mission ?? "(none)"}\nIdentities: ${i.currentIdentities?.join(", ") || "(none)"}\nBehaviors: ${i.recentBehaviors?.join("; ") || "(none)"}\nReturn refined identities ("I am someone who…"), gaps where behavior contradicts identity, and proof-behaviors.`,
  example: {
    input: { mission: "Transfer understanding", currentIdentities: ["Researcher"], recentBehaviors: ["Skimmed, didn't write"] },
    output: {
      identities: [{ name: "Researcher", statement: "I am someone who tests ideas and writes down what I learn." }],
      gaps: ["Consuming without producing — no written output this week."],
      identityProofs: ["Publish one written insight per week."],
    },
  },
});

/* 4 ─ ValueCoach */
export const ValueCoach = defineAgent({
  name: "ValueCoach",
  description: "Build a value hierarchy and resolve value conflicts under trade-offs.",
  system: `${BASE_TONE} Values are decision priorities, not slogans. You force a strict ranking and resolve conflicts by stating which value yields under which conditions.`,
  inputSchema: z.object({
    values: z.array(z.string()).min(1),
    conflictContext: z.string().optional(),
  }),
  outputSchema: z.object({
    ranking: z.array(z.object({ value: z.string(), rank: z.number().int(), why: z.string() })),
    conflictResolution: z.string().default(""),
  }),
  buildUserPrompt: (i) =>
    `Values: ${i.values.join(", ")}\nConflict: ${i.conflictContext ?? "(none)"}\nReturn a strict 1..n ranking with rationale, and resolve the conflict if given.`,
  example: {
    input: { values: ["Truth", "Harmony"], conflictContext: "Telling a friend hard feedback" },
    output: {
      ranking: [
        { value: "Truth", rank: 1, why: "Long-term trust depends on accuracy." },
        { value: "Harmony", rank: 2, why: "Matters, but not at the cost of honesty." },
      ],
      conflictResolution: "Deliver the truth, but invest in delivery; harmony yields to truth, not vice versa.",
    },
  },
});

/* 5 ─ MentalModelCoach (latticework-of-models idea) */
export const MentalModelCoach = defineAgent({
  name: "MentalModelCoach",
  description: "Recommend the mental models a situation demands and how they connect.",
  system: `${BASE_TONE} You build a latticework of mental models (an idea popularized in investing circles). Given a problem, name the few highest-leverage models, the category of each, and the connections between them.`,
  inputSchema: z.object({ problem: z.string(), knownModels: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    applicableModels: z.array(z.object({ name: z.string(), category: z.string(), why: z.string() })),
    connections: z.array(z.object({ from: z.string(), to: z.string(), relation: z.string() })).default([]),
    blindSpots: z.array(z.string()).default([]),
  }),
  buildUserPrompt: (i) =>
    `Problem: ${i.problem}\nKnown models: ${i.knownModels?.join(", ") || "(none)"}\nReturn 3-5 applicable models with category + why, connections among them, and model blind spots.`,
  example: {
    input: { problem: "Should I keep investing in a failing project?", knownModels: ["Compounding"] },
    output: {
      applicableModels: [
        { name: "Sunk Cost", category: "PSYCHOLOGY", why: "Past spend is irrelevant to the forward decision." },
        { name: "Opportunity Cost", category: "ECONOMICS", why: "Compare to the best alternative use of time/capital." },
      ],
      connections: [{ from: "Sunk Cost", to: "Opportunity Cost", relation: "reinforces" }],
      blindSpots: ["You may be optimizing for ego protection, not expected value."],
    },
  },
});

/* 6 ─ FirstPrincipleCoach (Musk) */
export const FirstPrincipleCoach = defineAgent({
  name: "FirstPrincipleCoach",
  description: "Decompose a problem to fundamentals; kill assumptions; find root causes and real constraints.",
  system: `${BASE_TONE} You reason from first principles. Separate physical/economic constraints (real) from inherited assumptions (often false). Provide a zero-based redesign.`,
  inputSchema: z.object({ problem: z.string(), assumptions: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    assumptionsAssessed: z.array(z.object({ statement: z.string(), valid: z.boolean(), reason: z.string() })),
    rootCauses: z.array(z.string()),
    realConstraints: z.array(z.string()),
    zeroBasedDesign: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Problem: ${i.problem}\nAssumptions: ${i.assumptions?.join("; ") || "(none)"}\nAssess each assumption (valid?), find root causes (5-whys), list real constraints, and propose a zero-based design.`,
  example: {
    input: { problem: "Can't ship fast enough", assumptions: ["We need more engineers"] },
    output: {
      assumptionsAssessed: [{ statement: "We need more engineers", valid: false, reason: "Throughput is limited by review latency, not headcount." }],
      rootCauses: ["Single reviewer bottleneck", "No automated tests so changes are risky"],
      realConstraints: ["Reviewer hours/day"],
      zeroBasedDesign: "Add tests + parallel review; only then consider hiring.",
    },
  },
});

/* 7 ─ DecisionArchitect */
export const DecisionArchitect = defineAgent({
  name: "DecisionArchitect",
  description: "Evaluate a decision across mission/identity/value fit, EV, 2nd-order effects, risk, reversibility, shadow motive.",
  system: `${BASE_TONE} You produce a Decision Quality assessment per option. Penalize options driven by fear/ego/status (shadow motive). Reward reversible, high-EV, second-order-aware choices.`,
  inputSchema: z.object({
    title: z.string(),
    context: z.string().default(""),
    options: z.array(z.string()).min(1),
    mission: z.string().optional(),
    identity: z.string().optional(),
    values: z.array(z.string()).default([]),
    memoryContext: z.string().optional(),
  }),
  outputSchema: z.object({
    reviews: z.array(
      z.object({
        option: z.string(),
        missionFit: scoreField,
        identityFit: scoreField,
        valueFit: scoreField,
        expectedValue: scoreField,
        secondOrder: scoreField,
        risk: scoreField,
        reversibility: scoreField,
        shadowMotive: scoreField,
        opportunityCost: scoreField,
        quality: scoreField,
        note: z.string(),
      }),
    ),
    recommendation: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Decision: ${i.title}\nContext: ${i.context}\nMission: ${i.mission ?? "-"} Identity: ${i.identity ?? "-"} Values: ${i.values?.join(", ") || "-"}\nRelevant memory:\n${i.memoryContext ?? "-"}\nOptions: ${i.options.join(" | ")}\nScore every option on each dimension (0..1) and recommend one. Use relevant memory to flag repeated bias, assumption drift, or proven strengths.`,
  example: {
    input: { title: "Take the manager role?", context: "More pay, less building", options: ["Accept", "Decline"], mission: "Build durable tools", identity: "Builder", values: ["Craft"] },
    output: {
      reviews: [
        { option: "Accept", missionFit: 0.3, identityFit: 0.2, valueFit: 0.3, expectedValue: 0.6, secondOrder: 0.4, risk: 0.5, reversibility: 0.6, shadowMotive: 0.6, opportunityCost: 0.4, quality: 0.32, note: "Status/pay pull; contradicts builder identity." },
        { option: "Decline", missionFit: 0.8, identityFit: 0.9, valueFit: 0.9, expectedValue: 0.5, secondOrder: 0.6, risk: 0.3, reversibility: 0.8, shadowMotive: 0.1, opportunityCost: 0.2, quality: 0.74, note: "Protects craft and identity." },
      ],
      recommendation: "Decline, or negotiate a builder-track with leadership scope.",
    },
  },
});

/* 8 ─ ExcellenceModeler (logical-levels idea) */
export const ExcellenceModeler = defineAgent({
  name: "ExcellenceModeler",
  description: "Produce an Excellence Blueprint of a role model across the well-known logical-levels idea.",
  system: `${BASE_TONE} You model excellence across logical levels: decompose a world-class performer into identity, values, beliefs, mental models, decision rules, habits, environment — as imitable patterns, not trivia.`,
  inputSchema: z.object({ person: z.string(), focus: z.string().optional() }),
  outputSchema: z.object({
    identity: z.string(),
    values: z.array(z.string()),
    beliefs: z.array(z.string()),
    mentalModels: z.array(z.string()),
    decisionRules: z.array(z.string()),
    habits: z.array(z.string()),
    environment: z.string(),
  }),
  buildUserPrompt: (i) => `Model: ${i.person}${i.focus ? ` (focus: ${i.focus})` : ""}. Return an imitable blueprint across all levels.`,
  example: {
    input: { person: "Charlie Munger" },
    output: {
      identity: "A learning machine who compounds judgment.",
      values: ["Rationality", "Honesty", "Patience"],
      beliefs: ["Invert problems", "Avoid stupidity beats seeking brilliance"],
      mentalModels: ["Latticework of models", "Incentives", "Margin of safety"],
      decisionRules: ["Study how it could fail, then avoid that", "Act only where your knowledge runs deep"],
      habits: ["Read daily across disciplines", "Maintain a checklist"],
      environment: "Few high-quality decisions; long holding periods; trusted partner.",
    },
  },
});

/* 9 ─ HabitArchitect */
export const HabitArchitect = defineAgent({
  name: "HabitArchitect",
  description: "Convert an identity into a small set of identity-proving habits.",
  system: `${BASE_TONE} Habits are identity proofs, not tasks. For an identity, design the minimum habits whose completion is direct evidence of that identity.`,
  inputSchema: z.object({ identity: z.string(), desiredOutcome: z.string().optional() }),
  outputSchema: z.object({
    habits: z.array(z.object({ name: z.string(), identityProof: z.string(), cadencePerWeek: z.number().int().min(1).max(21) })),
  }),
  buildUserPrompt: (i) => `Identity: ${i.identity}\nOutcome: ${i.desiredOutcome ?? "-"}\nDesign 2-4 identity-proving habits with weekly cadence.`,
  example: {
    input: { identity: "Researcher", desiredOutcome: "Original insight" },
    output: {
      habits: [
        { name: "Read one paper, write 3 lines of insight", identityProof: "I engage primary sources and synthesize.", cadencePerWeek: 5 },
        { name: "Run one small experiment", identityProof: "I test rather than assume.", cadencePerWeek: 1 },
      ],
    },
  },
});

/* 10 ─ ShadowDetector */
export const ShadowDetector = defineAgent({
  name: "ShadowDetector",
  description: "Detect self-sabotage patterns, root causes, and corrective actions.",
  system: `${BASE_TONE} You detect shadow patterns (procrastination, comfort/status addiction, confirmation/sunk-cost bias, ego, fear, avoidance, distraction). Name the root cause and a concrete replacement action. No shaming.`,
  inputSchema: z.object({ recentBehaviors: z.array(z.string()).min(1) }),
  outputSchema: z.object({
    patterns: z.array(z.object({ type: z.string(), rootCause: z.string(), severity: scoreField })),
    warnings: z.array(z.string()),
    interventions: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Behaviors: ${i.recentBehaviors.join("; ")}\nIdentify shadow patterns with root cause + severity, warnings, and replacement actions.`,
  example: {
    input: { recentBehaviors: ["Refreshed metrics 20x", "Avoided the hard refactor"] },
    output: {
      patterns: [
        { type: "DISTRACTION", rootCause: "Anxiety relief via novelty", severity: 0.6 },
        { type: "AVOIDANCE", rootCause: "Fear of breaking things without tests", severity: 0.7 },
      ],
      warnings: ["The hard task is being displaced by cheap dopamine."],
      interventions: ["Write one test, then make the smallest refactor; block metrics until done."],
    },
  },
});

/* 11 ─ ReflectionGuide (Dalio) */
export const ReflectionGuide = defineAgent({
  name: "ReflectionGuide",
  description: "Turn a daily reflection into durable lessons and the next focus.",
  system: `${BASE_TONE} Reflection compounds learning (Dalio). Convert raw reflection into principles/lessons, identify wrong assumptions, and set one sharp next focus. Rate reflection depth honestly.`,
  inputSchema: z.object({
    worked: z.string().default(""),
    failed: z.string().default(""),
    learned: z.string().default(""),
    wrongAssumptions: z.string().default(""),
    memoryContext: z.string().optional(),
  }),
  outputSchema: z.object({
    lessons: z.array(z.string()),
    identityReinforced: z.string(),
    nextFocus: z.string(),
    depth: scoreField,
  }),
  buildUserPrompt: (i) =>
    `Worked: ${i.worked}\nFailed: ${i.failed}\nLearned: ${i.learned}\nWrong assumptions: ${i.wrongAssumptions}\nRelevant memory:\n${i.memoryContext ?? "-"}\nExtract lessons, repeated patterns, the identity reinforced, one next focus, and rate depth.`,
  example: {
    input: { worked: "Shipped tests", failed: "Got distracted AM", learned: "Tests reduce fear", wrongAssumptions: "That I needed more time" },
    output: {
      lessons: ["Fear of breakage, not time, was the blocker — remove fear with tests."],
      identityReinforced: "Builder who de-risks before scaling",
      nextFocus: "Protect the first 90 minutes for the hardest task.",
      depth: 0.7,
    },
  },
});

/* 12 ─ MasteryCoach */
export const MasteryCoach = defineAgent({
  name: "MasteryCoach",
  description: "Assess mastery stage and prescribe deliberate practice.",
  system: `${BASE_TONE} You track expertise (novice→master) across knowledge, execution, problem-solving, teaching. Prescribe deliberate practice at the edge of ability.`,
  inputSchema: z.object({
    skill: z.string(),
    knowledge: scoreField,
    execution: scoreField,
    problemSolving: scoreField,
    teaching: scoreField,
  }),
  outputSchema: z.object({
    stage: z.enum(["NOVICE", "BEGINNER", "PRACTITIONER", "PROFESSIONAL", "EXPERT", "MASTER"]),
    gaps: z.array(z.string()),
    deliberatePractice: z.array(z.string()),
  }),
  buildUserPrompt: (i) =>
    `Skill: ${i.skill}\nK:${i.knowledge} E:${i.execution} P:${i.problemSolving} T:${i.teaching}\nName the stage, the binding gaps, and 2-3 deliberate-practice drills.`,
  example: {
    input: { skill: "System design", knowledge: 0.7, execution: 0.5, problemSolving: 0.5, teaching: 0.2 },
    output: {
      stage: "PRACTITIONER",
      gaps: ["Execution under ambiguity", "Cannot yet teach it"],
      deliberatePractice: ["Design + critique one real system weekly", "Write a teardown others can learn from"],
    },
  },
});

/* 13 ─ LeadershipAdvisor */
export const LeadershipAdvisor = defineAgent({
  name: "LeadershipAdvisor",
  description: "Help the user scale impact through communication, influence, delegation, team building.",
  system: `${BASE_TONE} Leadership is multiplication, not control. Advise on the smallest moves that scale impact and where the user is the bottleneck.`,
  inputSchema: z.object({
    situation: z.string(),
    metrics: z
      .object({
        communication: scoreField,
        influence: scoreField,
        delegation: scoreField,
        teamBuilding: scoreField,
      })
      .partial()
      .default({}),
  }),
  outputSchema: z.object({
    bottleneck: z.string(),
    advice: z.array(z.string()),
    delegationPlan: z.array(z.string()).default([]),
  }),
  buildUserPrompt: (i) => `Situation: ${i.situation}\nMetrics: ${JSON.stringify(i.metrics)}\nName the bottleneck, give advice, and a delegation plan if relevant.`,
  example: {
    input: { situation: "I'm the bottleneck on every decision", metrics: { delegation: 0.3 } },
    output: {
      bottleneck: "Centralized decision-making; no decision rights pushed down.",
      advice: ["Write decision criteria so others can decide without you."],
      delegationPlan: ["List recurring decisions", "Assign owners + guardrails", "Review weekly, not per-decision"],
    },
  },
});

/* 14 ─ LegacyAdvisor */
export const LegacyAdvisor = defineAgent({
  name: "LegacyAdvisor",
  description: "Help the user create impact beyond themselves: mentoring, knowledge transfer, institutions.",
  system: `${BASE_TONE} Legacy is impact that compounds without you. Identify what to codify, whom to mentor, and what to institutionalize.`,
  inputSchema: z.object({
    mission: z.string().optional(),
    assets: z.array(z.string()).default([]),
    mentees: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({
    knowledgeToCodify: z.array(z.string()),
    mentoringMoves: z.array(z.string()),
    institutionIdeas: z.array(z.string()).default([]),
  }),
  buildUserPrompt: (i) =>
    `Mission: ${i.mission ?? "-"}\nAssets: ${i.assets?.join(", ") || "-"}\nMentees: ${i.mentees?.join(", ") || "-"}\nWhat should be codified, who mentored, what institutionalized?`,
  example: {
    input: { mission: "Transfer understanding", assets: ["Internal design docs"], mentees: ["Junior dev"] },
    output: {
      knowledgeToCodify: ["Turn design docs into a public course."],
      mentoringMoves: ["Give the junior dev a real system to own with weekly review."],
      institutionIdeas: ["A standing design-review ritual that runs without you."],
    },
  },
});

/* 15 ─ BeliefCoach */
export const BeliefCoach = defineAgent({
  name: "BeliefCoach",
  description: "Extract limiting beliefs from the user's words and reframe them into empowering, actionable beliefs.",
  system: `${BASE_TONE} You detect limiting beliefs (often disguised as facts), name the cost they impose, and reframe them into empowering beliefs with a concrete action. No toxic positivity — the reframe must be credible.`,
  inputSchema: z.object({ text: z.string().min(1) }),
  outputSchema: z.object({
    beliefs: z.array(
      z.object({
        statement: z.string(),
        type: z.enum(["LIMITING", "EMPOWERING", "NEUTRAL"]),
        cost: z.string().default(""),
        reframe: z.string().default(""),
        empowering: z.string().default(""),
        action: z.string().default(""),
      }),
    ),
    beliefHealth: scoreField,
  }),
  buildUserPrompt: (i) => `Text: ${i.text}\nExtract beliefs; classify each; for limiting ones give cost, reframe, empowering version, and one action. Rate overall belief health 0..1.`,
  example: {
    input: { text: "我年龄太大了，不适合转型。" },
    output: {
      beliefs: [
        { statement: "年龄决定转型可能性。", type: "LIMITING", cost: "放弃尝试，固化现状。", reframe: "年龄不是障碍，而是复合经验的资产。", empowering: "我的经验让我能做出别人做不到的差异化定位。", action: "用过去经验构建差异化定位，本周写出一个独特卖点。" },
      ],
      beliefHealth: 0.4,
    },
  },
});

/* 16 ─ DigitalTwinSimulator */
export const DigitalTwinSimulator = defineAgent({
  name: "DigitalTwinSimulator",
  description: "Model the user's current personality from their data, detect identity drift, and simulate the consequences of a course of action.",
  system: `${BASE_TONE} You are the user's digital twin. Given a snapshot of their mission/identity/values/habits/recent behavior, produce a concise current-personality picture, an identity-drift risk with direction, and a grounded simulation of where current trajectory leads.`,
  inputSchema: z.object({
    snapshot: z.record(z.unknown()).default({}),
    scenario: z.string().optional(),
  }),
  outputSchema: z.object({
    personality: z.string(),
    driftRisk: scoreField,
    driftDirection: z.string().default(""),
    trajectory: z.string(),
    recommendation: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Snapshot: ${JSON.stringify(i.snapshot)}\nScenario: ${i.scenario ?? "(project current trajectory)"}\nReturn current personality, identity-drift risk + direction, projected trajectory, and one recommendation.`,
  example: {
    input: { snapshot: { identity: "Builder", habitConsistency: 0.4 }, scenario: "Take a manager role" },
    output: {
      personality: "A builder whose execution is slipping (habit consistency 0.4).",
      driftRisk: 0.6,
      driftDirection: "Builder → Manager (away from stated identity)",
      trajectory: "Taking the role accelerates drift; building skills atrophy within ~2 quarters.",
      recommendation: "If you take it, protect 2 build-blocks/week as identity anchors.",
    },
  },
});

/* 17 ─ GeniusModeler (Strategies of Genius × NLP Modeling) */
export const GeniusModeler = defineAgent({
  name: "GeniusModeler",
  description: "Model a genius's thinking the NLP way: not just their beliefs but their cognitive strategy as a representational-system sequence + T.O.T.E., turned into an installable practice protocol.",
  system: `${BASE_TONE} Drawing on widely-described, general concepts of cognitive modeling (logical levels, representational systems, and the test-operate-test-exit loop), for a named genius and a focus, reconstruct the HIGH-LEVERAGE levels (identity, beliefs, values, capabilities) AND the micro-strategy: the ordered sequence of representational systems they used (V = visual, A = auditory, K = kinesthetic, Ad = auditory-digital/self-talk) and the T.O.T.E. loop (Test → Operate → Test → Exit) that drives it. Then write a concrete install protocol the user can practice. Be specific to the named person's documented way of thinking (e.g. Disney's Dreamer/Realist/Critic positions; Da Vinci's saper vedere / dimostrazione; Tesla's full mental simulation before building; Mozart's auditory composition of whole works; Aristotle's chain of first causes).`,
  inputSchema: z.object({ genius: z.string().min(1), focus: z.string().optional() }),
  outputSchema: z.object({
    strategyName: z.string(),
    description: z.string(),
    logicalLevels: z.object({ identity: z.string(), beliefs: z.string(), values: z.string(), capabilities: z.string() }),
    representationalSequence: z.array(z.object({
      step: z.number().int(),
      system: z.enum(["V", "A", "K", "Ad"]),
      description: z.string(),
    })),
    tote: z.object({ test: z.string(), operate: z.string(), testExit: z.string(), exit: z.string() }),
    highLeverage: z.array(z.string()),
    installProtocol: z.array(z.string()),
  }),
  buildUserPrompt: (i) =>
    `Genius: ${i.genius}\nFocus: ${i.focus ?? "their core creative/thinking strategy"}\nReturn the strategy name, high-leverage logical levels, the representational-system step sequence, the T.O.T.E. loop, and an install protocol.`,
  example: {
    input: { genius: "Walt Disney", focus: "turning vision into shipped reality" },
    output: {
      strategyName: "Dreamer–Realist–Critic",
      description: "Disney separated three thinking positions in space and time so they never fought: imagine without limits, plan concretely, then critique the plan (not the dream).",
      logicalLevels: {
        identity: "A storyteller who makes the impossible feel inevitable.",
        beliefs: "Every constraint is solvable once the vision is vivid enough.",
        values: "Wonder, craftsmanship, coherence.",
        capabilities: "Vivid visualization; sequencing; ruthless but targeted critique.",
      },
      representationalSequence: [
        { step: 1, system: "V", description: "Dreamer: see the finished experience fully, sensory-rich, no constraints." },
        { step: 2, system: "K", description: "Realist: step into the dream and act it out — what must physically happen, in order." },
        { step: 3, system: "Ad", description: "Critic: question the PLAN against the dream — risks, gaps — never attacking the dream itself." },
      ],
      tote: {
        test: "Does the plan reproduce the dream's experience?",
        operate: "Revise the realist plan to close gaps the critic found.",
        testExit: "Plan is feasible AND faithful to the dream.",
        exit: "Commit and build.",
      },
      highLeverage: ["Identity: storyteller, not administrator", "Belief: constraints are solvable", "Spatial separation of the 3 positions"],
      installProtocol: [
        "Physically use 3 spots; only dream in spot 1 (no judging).",
        "In spot 2, act out the plan step-by-step in first person.",
        "In spot 3, critique only the plan vs. the dream; route fixes back to spot 2.",
      ],
    },
  },
});

/* 18 ─ PersonaAdapter (genius blueprint → adapted user blueprint) */
export const PersonaAdapter = defineAgent({
  name: "PersonaAdapter",
  description: "Convert a genius's excellence blueprint into a blueprint adapted to THIS user's identity, goals, strengths and weaknesses.",
  system: `${BASE_TONE} You translate a role model's blueprint into the user's context — NOT cosplay. Keep the high-leverage structure (identity, beliefs, decision rules, creative process), but instantiate it for the user's domain and close their specific gaps. Output a named adapted blueprint (e.g. "Leonardo-inspired Research Architect").`,
  inputSchema: z.object({
    roleModel: z.string().min(1),
    blueprint: z.object({
      identity: z.string().default(""), beliefs: z.string().default(""), values: z.string().default(""),
      decisionRules: z.string().default(""), habits: z.string().default(""), creativeProcess: z.string().default(""),
    }),
    user: z.object({
      currentIdentity: z.string().default(""), goals: z.string().default(""),
      strengths: z.string().default(""), weaknesses: z.string().default(""),
    }),
  }),
  outputSchema: z.object({
    title: z.string(),
    identity: z.string(),
    beliefs: z.string(),
    values: z.string(),
    decisionRules: z.array(z.string()),
    habits: z.array(z.string()),
    creativeProcess: z.string(),
    summary: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Role model: ${i.roleModel}\nBlueprint: ${JSON.stringify(i.blueprint)}\nUser: ${JSON.stringify(i.user)}\nProduce an adapted blueprint named for the fusion, instantiated to the user's domain and closing their weaknesses.`,
  example: {
    input: { roleModel: "Leonardo da Vinci", blueprint: { identity: "Universal learner", beliefs: "Everything connects", values: "Curiosity", decisionRules: "Follow curiosity; seek patterns", habits: "Observe; sketch; connect", creativeProcess: "Cross-domain synthesis" }, user: { currentIdentity: "Software Architect", goals: "Design systems that last", strengths: "Abstraction", weaknesses: "Stops at the first solution" } },
    output: {
      title: "Leonardo-inspired Research Architect",
      identity: "An architect who studies systems the way da Vinci studied nature — from many angles before deciding.",
      beliefs: "Every system rhymes with another; the best design is found by seeing, not guessing.",
      values: "Curiosity, integration, evidence.",
      decisionRules: ["Generate ≥3 structurally different designs before choosing.", "Prefer the design confirmed by a real probe, not the first that works."],
      habits: ["Daily: study one system outside your stack and note the analogy.", "Sketch the architecture by hand before coding."],
      creativeProcess: "Observe many systems → analogize across domains → sketch → probe with a spike → decide.",
      summary: "Closes the 'first solution' weakness by forcing multi-angle observation and evidence before commitment.",
    },
  },
});

/* 19 ─ LearningPathGenerator (Excellence Learning Loop) */
export const LearningPathGenerator = defineAgent({
  name: "LearningPathGenerator",
  description: "Generate a 7-stage Excellence Learning Loop (Observe→Imitate→Practice→Internalize→Adapt→Create→Teach) for installing a blueprint.",
  system: `${BASE_TONE} You design a progression to install an excellence blueprint: exactly 7 stages in order — OBSERVE, IMITATE, PRACTICE, INTERNALIZE, ADAPT, CREATE, TEACH — each with one concrete, checkable action for the user's goal. No fluff; each action is a doable assignment.`,
  inputSchema: z.object({ roleModel: z.string().min(1), blueprintSummary: z.string().default(""), goal: z.string().default("") }),
  outputSchema: z.object({
    steps: z.array(z.object({
      stage: z.enum(["OBSERVE", "IMITATE", "PRACTICE", "INTERNALIZE", "ADAPT", "CREATE", "TEACH"]),
      action: z.string(),
    })).length(7),
  }),
  buildUserPrompt: (i) =>
    `Role model: ${i.roleModel}\nBlueprint: ${i.blueprintSummary}\nGoal: ${i.goal || "install this way of operating"}\nReturn exactly 7 ordered steps (OBSERVE..TEACH), each with one concrete action.`,
  example: {
    input: { roleModel: "Leonardo da Vinci", blueprintSummary: "Observe many angles, analogize, probe before deciding", goal: "Become a research architect" },
    output: {
      steps: [
        { stage: "OBSERVE", action: "Study 5 mature systems' designs and note how each handles state." },
        { stage: "IMITATE", action: "Re-draw one of those architectures from memory, by hand." },
        { stage: "PRACTICE", action: "For one real decision, produce 3 structurally different designs." },
        { stage: "INTERNALIZE", action: "Run a spike to test the riskiest assumption before deciding." },
        { stage: "ADAPT", action: "Codify your own 'multi-angle then probe' checklist." },
        { stage: "CREATE", action: "Design a novel system using the checklist end-to-end." },
        { stage: "TEACH", action: "Write a teardown teaching the method to your team." },
      ],
    },
  },
});

// Registry ------------------------------------------------------------------
