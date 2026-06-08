import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* ───────────────────────── SFM — Business Scaling Engine ───────────────────────── */
const SFM_TONE = BASE_TONE + " You work at the organization level: founders, teams, business systems. Make every insight observable, recordable, scorable, repeatable, transferable. No motivational language.";

/* SFM-1 ─ FounderPatternExtractor */
export const FounderPatternExtractor = defineAgent({
  name: "FounderPatternExtractor",
  description: "Convert founder intuition into explicit, repeatable patterns and a dependency map.",
  system: `${SFM_TONE} Extract how the founder thinks, decides, sells, leads, hires and solves problems. Separate transferable patterns from founder-personal ones.`,
  inputSchema: z.object({
    answers: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    companyStory: z.string().optional(),
  }),
  outputSchema: z.object({
    founderIdentity: z.string(),
    founderValues: z.array(z.string()),
    founderBeliefs: z.array(z.string()),
    decisionStyle: z.string(), riskStyle: z.string(), learningStyle: z.string(),
    leadershipStyle: z.string(), creativityStyle: z.string(), executionStyle: z.string(),
    strengths: z.array(z.string()), shadowRisks: z.array(z.string()),
    dependencyMap: z.array(z.object({ area: z.string(), dependency: scoreField })),
  }),
  buildUserPrompt: (i) => `Founder interview:\n${i.answers.map((a) => `Q:${a.question}\nA:${a.answer}`).join("\n")}\nStory: ${i.companyStory ?? "(none)"}\nExtract the founder DNA profile, strengths, shadow risks, and a dependency map (area→0..1).`,
  example: {
    input: { answers: [{ question: "What do you refuse to compromise?", answer: "Product quality, even under deadline." }] },
    output: {
      founderIdentity: "A craftsman-operator who treats quality as identity, not policy.",
      founderValues: ["Quality", "Trust", "Long-term"], founderBeliefs: ["Reputation compounds", "Speed without quality is debt"],
      decisionStyle: "Principle-first, slow on irreversible calls.", riskStyle: "Asymmetric: avoids ruin, takes cheap options.",
      learningStyle: "Learns by building and post-mortems.", leadershipStyle: "High-standard mentor.",
      creativityStyle: "Constraint-driven.", executionStyle: "Ships in tight loops.",
      strengths: ["Taste", "Resilience under pressure"], shadowRisks: ["Bottlenecks on quality calls", "Impatience with B-players"],
      dependencyMap: [{ area: "Final product sign-off", dependency: 0.9 }, { area: "Hiring senior roles", dependency: 0.7 }],
    },
  },
});

/* SFM-2 ─ SuccessFactorModeler */
export const SuccessFactorModeler = defineAgent({
  name: "SuccessFactorModeler",
  description: "Identify the repeatable success factors of the business and score them.",
  system: `${SFM_TONE} Identify what makes the business succeed. For each factor score repeatability, scalability, founder-dependency (0..1) and a replication method.`,
  inputSchema: z.object({
    founderProfile: z.string().optional(),
    history: z.array(z.string()).default([]),
    wins: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({
    factors: z.array(z.object({
      name: z.string(), description: z.string(),
      category: z.enum(["IDENTITY","VALUE","MARKET","PRODUCT","DECISION","TEAM","CULTURE","EXECUTION","CUSTOMER","RESILIENCE"]),
      evidence: z.string(), repeatabilityScore: scoreField, founderDependencyScore: scoreField,
      scalabilityScore: scoreField, riskIfLost: z.string(), replicationMethod: z.string(),
    })).min(1),
  }),
  buildUserPrompt: (i) => `Founder: ${i.founderProfile ?? "(n/a)"}\nHistory: ${i.history.join("; ")}\nWins: ${i.wins.join("; ")}\nProduce the success-factor map with scores and replication methods.`,
  example: {
    input: { wins: ["Customers renew because onboarding is hand-held by founder"] },
    output: { factors: [{
      name: "High-touch onboarding", description: "Founder personally onboards key accounts.",
      category: "CUSTOMER", evidence: "95% renewal on founder-onboarded accounts.",
      repeatabilityScore: 0.6, founderDependencyScore: 0.85, scalabilityScore: 0.4,
      riskIfLost: "Renewal drops as founder steps back.", replicationMethod: "Codify the onboarding script + train a CS lead; measure renewal parity.",
    }] },
  },
});

/* SFM-3 ─ CompanyIdentityBuilder */
export const CompanyIdentityBuilder = defineAgent({
  name: "CompanyIdentityBuilder",
  description: "Define a shared organizational identity (internal + external).",
  system: `${SFM_TONE} Build the company identity: what it is becoming, its promise, and its cultural boundaries.`,
  inputSchema: z.object({ founderProfile: z.string().optional(), mission: z.string().optional(), notes: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    identityStatement: z.string(), strategicPosition: z.string(), culturalIdentity: z.string(),
    enemyToAvoid: z.string(), promiseToCustomer: z.string(), internalSelfImage: z.string(),
  }),
  buildUserPrompt: (i) => `Mission: ${i.mission ?? "(n/a)"}\nFounder: ${i.founderProfile ?? "(n/a)"}\nNotes: ${i.notes.join("; ")}\nProduce the company identity.`,
  example: {
    input: { mission: "Make quality software accessible" },
    output: { identityStatement: "A craftsmanship-driven product company.", strategicPosition: "Premium reliability at fair price.",
      culturalIdentity: "Builders who sweat the unseen details.", enemyToAvoid: "Becoming a feature factory.",
      promiseToCustomer: "It just works, and keeps working.", internalSelfImage: "We are the people who refuse to ship junk." },
  },
});

/* SFM-4 ─ BusinessValueArchitect */
export const BusinessValueArchitect = defineAgent({
  name: "BusinessValueArchitect",
  description: "Turn founder values into ranked shared values, detect conflicts and dilution.",
  system: `${SFM_TONE} Extract and rank core business values, convert each into an operating principle, and flag dilution risk (0..1) and conflicts.`,
  inputSchema: z.object({ founderValues: z.array(z.string()).default([]), behaviors: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    values: z.array(z.object({ value: z.string(), rank: z.number(), operatingPrinciple: z.string(), dilutionRisk: scoreField })).min(1),
    conflicts: z.array(z.string()).default([]),
  }),
  buildUserPrompt: (i) => `Founder values: ${i.founderValues.join("; ")}\nObserved behaviors: ${i.behaviors.join("; ")}\nRank values, derive operating principles, flag dilution risk and conflicts.`,
  example: {
    input: { founderValues: ["Quality", "Speed"] },
    output: { values: [
      { value: "Quality", rank: 1, operatingPrinciple: "Protect product quality even under growth pressure.", dilutionRisk: 0.4 },
      { value: "Speed", rank: 2, operatingPrinciple: "Ship learning loops fast, but never below the quality floor.", dilutionRisk: 0.3 }],
      conflicts: ["Quality vs Speed under deadline — resolve via a non-negotiable quality floor."] },
  },
});

/* SFM-5 ─ DecisionRuleEncoder */
export const DecisionRuleEncoder = defineAgent({
  name: "DecisionRuleEncoder",
  description: "Convert founder decision intuition into repeatable decision rules.",
  system: `${SFM_TONE} Turn past decisions into explicit if-then decision rules with context, examples and anti-patterns.`,
  inputSchema: z.object({ decisions: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    rules: z.array(z.object({ rule: z.string(), context: z.string(), examples: z.array(z.string()), antiPatterns: z.array(z.string()) })).min(1),
  }),
  buildUserPrompt: (i) => `Past decisions:\n${i.decisions.join("\n")}\nEncode repeatable decision rules.`,
  example: {
    input: { decisions: ["Turned down a big client who wanted us off-mission"] },
    output: { rules: [{ rule: "Decline revenue that pulls us off the core mission.", context: "Large but off-mission deals.",
      examples: ["Said no to a custom-build contract."], antiPatterns: ["Chasing logo deals that fragment the roadmap."] }] },
  },
});

/* SFM-6 ─ OperatingPrincipleBuilder */
export const OperatingPrincipleBuilder = defineAgent({
  name: "OperatingPrincipleBuilder",
  description: "Create organization-wide operating principles with enforcement.",
  system: `${SFM_TONE} Produce operating principles: principle, why it matters, decision context, examples, anti-patterns, enforcement mechanism.`,
  inputSchema: z.object({ values: z.array(z.string()).default([]), decisionRules: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    principles: z.array(z.object({ principle: z.string(), whyItMatters: z.string(), decisionContext: z.string(),
      examples: z.array(z.string()), antiPatterns: z.array(z.string()), enforcement: z.string() })).min(1),
  }),
  buildUserPrompt: (i) => `Values: ${i.values.join("; ")}\nRules: ${i.decisionRules.join("; ")}\nProduce enforceable operating principles.`,
  example: {
    input: { values: ["Trust"] },
    output: { principles: [{ principle: "Prefer long-term trust over short-term revenue.", whyItMatters: "Trust compounds; extraction does not.",
      decisionContext: "Pricing, refunds, roadmap promises.", examples: ["Proactive refund on our error."],
      antiPatterns: ["Dark patterns to lift a quarter."], enforcement: "Trust-impact line in every launch review." }] },
  },
});

/* SFM-7 ─ CollaborationPatternAnalyzer */
export const CollaborationPatternAnalyzer = defineAgent({
  name: "CollaborationPatternAnalyzer",
  description: "Diagnose team collaboration and produce an upgrade plan.",
  system: `${SFM_TONE} Score collaboration dimensions (psychological safety, decision clarity, role clarity, conflict quality, knowledge sharing, cross-functional, creative tension) 0..1 and prescribe upgrades.`,
  inputSchema: z.object({ observations: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    patterns: z.array(z.object({ dimension: z.string(), score: scoreField, friction: z.string(), upgrade: z.string() })).min(1),
    overall: scoreField,
  }),
  buildUserPrompt: (i) => `Observations:\n${i.observations.join("\n")}\nScore each collaboration dimension and prescribe upgrades.`,
  example: {
    input: { observations: ["Disagreements go silent then resurface in 1:1s"] },
    output: { patterns: [{ dimension: "Conflict quality", score: 0.35, friction: "Conflict is avoided in the room.", upgrade: "Adopt a written disagree-and-commit ritual." }], overall: 0.5 },
  },
});

/* SFM-8 ─ ConsciousLeadershipCoach */
export const ConsciousLeadershipCoach = defineAgent({
  name: "ConsciousLeadershipCoach",
  description: "Assess leadership maturity and blind spots, produce a growth plan.",
  system: `${SFM_TONE} Score leadership maturity (self-awareness, responsibility, communication, emotional regulation, decision maturity, integrity, people development) and surface blind spots.`,
  inputSchema: z.object({ reflections: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    maturityScore: scoreField, dimensions: z.array(z.object({ dimension: z.string(), score: scoreField })),
    blindSpots: z.array(z.string()), growthPlan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Leadership reflections:\n${i.reflections.join("\n")}\nScore maturity, name blind spots, give a growth plan.`,
  example: {
    input: { reflections: ["I jump in and fix things myself when stressed"] },
    output: { maturityScore: 0.55, dimensions: [{ dimension: "People development", score: 0.4 }],
      blindSpots: ["Rescuing prevents the team from growing."], growthPlan: ["Replace rescue with one coaching question.", "Delegate one recurring fix this week."] },
  },
});

/* SFM-9 ─ ResilienceStrategist */
export const ResilienceStrategist = defineAgent({
  name: "ResilienceStrategist",
  description: "Stress-test the company and map fragility.",
  system: `${SFM_TONE} Score resilience dimensions (cash, team, product, market, culture, founder, operational redundancy) 0..1, map fragility and prescribe upgrades.`,
  inputSchema: z.object({ context: z.array(z.string()).default([]), scenario: z.string().optional() }),
  outputSchema: z.object({
    patterns: z.array(z.object({ dimension: z.string(), score: scoreField, fragility: z.string(), upgrade: z.string() })).min(1),
    overall: scoreField, stressTest: z.string(),
  }),
  buildUserPrompt: (i) => `Context: ${i.context.join("; ")}\nScenario: ${i.scenario ?? "general shock"}\nStress-test and map fragility.`,
  example: {
    input: { context: ["3 months runway", "1 key engineer"] },
    output: { patterns: [{ dimension: "Founder/key-person", score: 0.3, fragility: "One engineer holds critical knowledge.", upgrade: "Pair-document the core system; add a backup owner." }], overall: 0.45, stressTest: "If the key engineer leaves, delivery stalls ~6 weeks." },
  },
});

/* SFM-10 ─ ReplicationPlaybookGenerator */
export const ReplicationPlaybookGenerator = defineAgent({
  name: "ReplicationPlaybookGenerator",
  description: "Turn success factors into a repeatable replication playbook.",
  system: `${SFM_TONE} Produce a replication playbook: what to preserve, standardize, delegate, automate, teach, measure, protect — plus transfer/hiring/onboarding/culture/decision/scaling playbooks.`,
  inputSchema: z.object({ successFactors: z.array(z.string()).default([]), bottlenecks: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    transferPlan: z.string(), hiringPlaybook: z.string(), onboardingPlaybook: z.string(),
    culturePlaybook: z.string(), decisionPlaybook: z.string(), scalingPlaybook: z.string(),
    blueprint: z.object({ preserve: z.array(z.string()), standardize: z.array(z.string()), delegate: z.array(z.string()),
      automate: z.array(z.string()), teach: z.array(z.string()), measure: z.array(z.string()), protect: z.array(z.string()) }),
    readinessScore: scoreField,
  }),
  buildUserPrompt: (i) => `Success factors: ${i.successFactors.join("; ")}\nBottlenecks: ${i.bottlenecks.join("; ")}\nGenerate the replication playbook + blueprint + readiness score.`,
  example: {
    input: { successFactors: ["High-touch onboarding"], bottlenecks: ["Founder dependency"] },
    output: { transferPlan: "Shadow → co-run → solo with founder review → independent.",
      hiringPlaybook: "Hire CS leads for judgment + empathy; trial on real onboardings.",
      onboardingPlaybook: "Codified 5-step onboarding script with quality checks.",
      culturePlaybook: "Weekly customer-story ritual to keep care alive.",
      decisionPlaybook: "Escalate only irreversible account risks to founder.",
      scalingPlaybook: "Add a pod per 20 accounts; measure renewal parity.",
      blueprint: { preserve: ["Care for the customer"], standardize: ["Onboarding script"], delegate: ["Account onboarding"],
        automate: ["Onboarding checklist tracking"], teach: ["Quality bar"], measure: ["Renewal parity vs founder"], protect: ["The quality floor"] },
      readinessScore: 0.6 },
  },
});

/* SFM-11 ─ OrganizationalHealthAnalyst */
export const OrganizationalHealthAnalyst = defineAgent({
  name: "OrganizationalHealthAnalyst",
  description: "Synthesize the SFM scores into an organizational health diagnosis.",
  system: `${SFM_TONE} Given the computed SFM scores, diagnose the organization, name the binding constraint, and give the next three highest-leverage moves.`,
  inputSchema: z.object({ scores: z.record(z.string(), z.number()) }),
  outputSchema: z.object({ diagnosis: z.string(), bindingConstraint: z.string(), nextMoves: z.array(z.string()).min(1) }),
  buildUserPrompt: (i) => `SFM scores: ${JSON.stringify(i.scores)}\nDiagnose org health, name the binding constraint, give 3 high-leverage moves.`,
  example: {
    input: { scores: { founderDependency: 0.8, replicationReadiness: 0.4 } },
    output: { diagnosis: "Strong factors, but success still routes through the founder.", bindingConstraint: "Founder dependency on key decisions.",
      nextMoves: ["Encode the top 3 founder decisions as rules.", "Train a deputy on account onboarding.", "Set a 90-day founder-absent test."] },
  },
});
