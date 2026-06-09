import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* ═══════════════════════════ Naval Life OS — agents ═══════════════════════════
   Concise, strategic, rational, non-motivational, non-therapeutic, long-term.
   Auto-exposed at POST /api/agents/:name. */
const NAVAL_TONE = BASE_TONE +
  " Operate as a life-strategy systems thinker focused on specific knowledge, judgment, leverage, ownership, freedom and long-term compounding. Action-oriented, evidence-seeking. No hype, no motivation-speak.";
const WEALTH_SAFETY = " SAFETY: educational framing only. Never recommend specific securities, never promise returns, never give regulated financial/legal/tax advice; suggest consulting qualified professionals for those.";
const HAPPINESS_SAFETY = " SAFETY: this is not therapy or medical care. Do not diagnose. If self-harm/crisis/severe-distress language appears, gently recommend contacting a qualified professional or local crisis support immediately, and keep the rest of the response brief.";
const list = z.array(z.string());

/* 1 ─ SpecificKnowledgeCoach */
export const SpecificKnowledgeCoach = defineAgent({
  name: "SpecificKnowledgeCoach",
  description: "Surface a person's specific knowledge — the rare intersection of curiosity, lived experience and skill they can compound.",
  system: `${NAVAL_TONE} From the user's answers, identify specific knowledge (NOT generic skills): the intersection of natural curiosity, rare skill combinations, hard-won judgment and unfair advantage. Score components 0..1 (curiosityDepth, skillRarity, marketRelevance, personalEnergy, compounding) and propose concrete knowledge assets + a growth plan.`,
  inputSchema: z.object({ answers: list.default([]), context: z.string().default("") }),
  outputSchema: z.object({
    summary: z.string(),
    components: z.object({ curiosityDepth: scoreField, skillRarity: scoreField, marketRelevance: scoreField, personalEnergy: scoreField, compounding: scoreField }),
    knowledgeAssets: z.array(z.object({ name: z.string(), why: z.string() })),
    rareCombination: list,
    growthPlan: list,
  }),
  buildUserPrompt: (i) => `Assessment answers:\n${i.answers.join("\n")}\nContext: ${i.context || "(n/a)"}\nExtract specific knowledge, score components, name assets + a growth plan.`,
  example: {
    input: { answers: ["I obsessively learn AI + I taught for years + I love systems design"] },
    output: { summary: "Rare stack: AI engineering × pedagogy × systems thinking.", components: { curiosityDepth: 0.8, skillRarity: 0.7, marketRelevance: 0.7, personalEnergy: 0.8, compounding: 0.7 }, knowledgeAssets: [{ name: "AI-for-educators course", why: "Sits exactly on your intersection." }], rareCombination: ["AI", "Teaching", "Systems design"], growthPlan: ["Publish one teardown a week", "Build one teaching artifact a month"] },
  },
});

/* 2 ─ TalentStackArchitect */
export const TalentStackArchitect = defineAgent({
  name: "TalentStackArchitect",
  description: "Combine multiple skills into a rare, defensible identity stack with monetization paths.",
  system: `${NAVAL_TONE} Find the rare COMBINATION (not a single best skill) that makes the user hard to replace. Score skillDiversity, skillDepth, rarity, marketDemand, identityAlignment 0..1, suggest an identity stack and asset/monetization strategy.`,
  inputSchema: z.object({ skills: list.min(1), interests: list.default([]) }),
  outputSchema: z.object({
    stack: list, identityStack: z.string(),
    components: z.object({ skillDiversity: scoreField, skillDepth: scoreField, rarity: scoreField, marketDemand: scoreField, identityAlignment: scoreField }),
    monetizationPaths: list, defensibility: z.string(),
  }),
  buildUserPrompt: (i) => `Skills: ${i.skills.join(", ")}\nInterests: ${i.interests.join(", ")}\nDesign the rare defensible stack + monetization.`,
  example: {
    input: { skills: ["finance", "psychology", "writing", "distribution"] },
    output: { stack: ["finance", "psychology", "writing", "distribution"], identityStack: "The behavioral-finance writer who can also distribute.", components: { skillDiversity: 0.8, skillDepth: 0.6, rarity: 0.7, marketDemand: 0.7, identityAlignment: 0.7 }, monetizationPaths: ["Paid newsletter", "Cohort course"], defensibility: "The 4-way combo is far rarer than any single skill." },
  },
});

/* 3 ─ LeverageCoach */
export const LeverageCoach = defineAgent({
  name: "LeverageCoach",
  description: "Assess current leverage, flag time-for-money dependence, and plan upgrades toward code/media/AI leverage.",
  system: `${NAVAL_TONE} Categorize leverage (labor, capital, code, media, AI-agent, community, brand, network, knowledge, system). Detect time-for-money dependence, score the portfolio (scalability, ownership, automation, distribution, compounding 0..1), and give an upgrade plan toward permissionless, scalable leverage.`,
  inputSchema: z.object({ currentWork: z.string(), incomeSources: list.default([]) }),
  outputSchema: z.object({
    timeForMoney: scoreField,
    distribution: z.array(z.object({ category: z.string(), usage: scoreField })),
    components: z.object({ scalability: scoreField, ownership: scoreField, automation: scoreField, distribution: scoreField, compounding: scoreField }),
    lowLeverageWarning: z.string(),
    upgradePlan: list,
  }),
  buildUserPrompt: (i) => `Current work: ${i.currentWork}\nIncome sources: ${i.incomeSources.join(", ")}\nAssess leverage + give an upgrade plan.`,
  example: {
    input: { currentWork: "Salaried consultant billing hours" },
    output: { timeForMoney: 0.9, distribution: [{ category: "labor", usage: 0.9 }, { category: "code", usage: 0.1 }], components: { scalability: 0.2, ownership: 0.2, automation: 0.1, distribution: 0.2, compounding: 0.2 }, lowLeverageWarning: "Nearly all income rents your time — zero compounding.", upgradePlan: ["Productize one engagement into a template", "Publish to build media leverage"] },
  },
});

/* 4 ─ NavalJudgmentCoach (renamed to avoid clash with cognitive.JudgmentCoach) */
export const NavalJudgmentCoach = defineAgent({
  name: "NavalJudgmentCoach",
  description: "Assess decision-making quality under uncertainty and surface blind spots.",
  system: `${NAVAL_TONE} Judgment = good decisions under uncertainty. Score predictionAccuracy, assumptionQuality, modelUsage, emotionalDiscipline, learningRate 0..1 from the user's decision history; name strengths, blind spots and a growth plan.`,
  inputSchema: z.object({ decisions: list.default([]), reflections: list.default([]) }),
  outputSchema: z.object({
    components: z.object({ predictionAccuracy: scoreField, assumptionQuality: scoreField, modelUsage: scoreField, emotionalDiscipline: scoreField, learningRate: scoreField }),
    strengths: list, blindSpots: list, growthPlan: list,
  }),
  buildUserPrompt: (i) => `Decisions:\n${i.decisions.join("\n")}\nReflections:\n${i.reflections.join("\n")}\nScore judgment, name blind spots + a plan.`,
  example: {
    input: { decisions: ["I act fast and rarely write down assumptions"] },
    output: { components: { predictionAccuracy: 0.5, assumptionQuality: 0.4, modelUsage: 0.4, emotionalDiscipline: 0.5, learningRate: 0.5 }, strengths: ["Decisiveness"], blindSpots: ["Unstated assumptions", "No feedback loop"], growthPlan: ["Log every big decision's assumptions", "Schedule a review date"] },
  },
});

/* 5 ─ DecisionJournalCoach */
export const DecisionJournalCoach = defineAgent({
  name: "DecisionJournalCoach",
  description: "Structure a decision into a journal entry built for later review and judgment improvement.",
  system: `${NAVAL_TONE} Turn a decision into a reviewable entry: context, options, assumptions, expected outcome, downside, upside, time horizon, confidence 0..1, models used, rationale, and a suggested review horizon.`,
  inputSchema: z.object({ decision: z.string(), context: z.string().default("") }),
  outputSchema: z.object({
    options: list, assumptions: list, expectedOutcome: z.string(), downsideRisk: z.string(), upsidePotential: z.string(),
    timeHorizon: z.string(), confidence: scoreField, modelsUsed: list, rationale: z.string(), reviewInDays: z.number().int(),
  }),
  buildUserPrompt: (i) => `Decision: ${i.decision}\nContext: ${i.context || "(n/a)"}\nStructure the journal entry.`,
  example: {
    input: { decision: "Leave my job to build a product" },
    output: { options: ["Stay", "Leave now", "Build nights/weekends first"], assumptions: ["6mo runway", "Idea has pull"], expectedOutcome: "A validated MVP in 90 days.", downsideRisk: "Burn savings with no traction.", upsidePotential: "Owned asset with compounding upside.", timeHorizon: "6 months", confidence: 0.55, modelsUsed: ["Expected value", "Reversibility"], rationale: "Reversible enough; the learning compounds.", reviewInDays: 90 },
  },
});

/* 6 ─ WealthArchitect */
export const WealthArchitect = defineAgent({
  name: "WealthArchitect",
  description: "Map wealth as asset ownership (not salary): income streams, ownership ratio, asset roadmap.",
  system: `${NAVAL_TONE}${WEALTH_SAFETY} Frame wealth as owning assets that earn while you sleep. Classify income as active/passive/leveraged, estimate ownership ratio, score components (ownershipRatio, assetQuality, leverage, compounding, durability 0..1), find the bottleneck, and give an asset-creation roadmap.`,
  inputSchema: z.object({ incomeStreams: list.default([]), assets: list.default([]) }),
  outputSchema: z.object({
    ownershipRatio: scoreField,
    incomeMap: z.array(z.object({ name: z.string(), kind: z.enum(["active", "passive", "leveraged"]) })),
    components: z.object({ ownershipRatio: scoreField, assetQuality: scoreField, leverage: scoreField, compounding: scoreField, durability: scoreField }),
    bottleneck: z.string(), roadmap: list,
  }),
  buildUserPrompt: (i) => `Income streams: ${i.incomeStreams.join(", ")}\nAssets: ${i.assets.join(", ")}\nMap wealth + an asset roadmap. Educational only.`,
  example: {
    input: { incomeStreams: ["salary"], assets: [] },
    output: { ownershipRatio: 0.05, incomeMap: [{ name: "salary", kind: "active" }], components: { ownershipRatio: 0.05, assetQuality: 0.1, leverage: 0.1, compounding: 0.1, durability: 0.3 }, bottleneck: "100% active income, 0 owned assets.", roadmap: ["Ship one code or media asset", "Convert expertise into a sellable artifact"] },
  },
});

/* 7 ─ AssetBuilderCoach */
export const AssetBuilderCoach = defineAgent({
  name: "AssetBuilderCoach",
  description: "Turn knowledge/skills into assets that keep producing value after the initial effort.",
  system: `${NAVAL_TONE} An asset keeps creating value after the work is done (article, course, software, AI agent, template, community, product, brand). Generate asset ideas matched to the user, recommend a type, and give a build + distribution + maintenance plan with a compounding estimate 0..1.`,
  inputSchema: z.object({ knowledge: z.string(), audience: z.string().default("") }),
  outputSchema: z.object({
    ideas: z.array(z.object({ idea: z.string(), category: z.string(), compounding: scoreField })),
    recommended: z.string(), buildPlan: list, distributionPlan: list, maintenance: z.string(),
  }),
  buildUserPrompt: (i) => `Knowledge: ${i.knowledge}\nAudience: ${i.audience || "(infer)"}\nGenerate assets + a build/distribution plan.`,
  example: {
    input: { knowledge: "I know how to migrate legacy apps to Next.js" },
    output: { ideas: [{ idea: "Migration playbook", category: "knowledge", compounding: 0.7 }, { idea: "CLI codemod", category: "code", compounding: 0.8 }], recommended: "Start with the playbook, then the codemod.", buildPlan: ["Outline the 10-step migration", "Write it once, sell many times"], distributionPlan: ["Post teardowns", "SEO the playbook"], maintenance: "Update once per Next major." },
  },
});

/* 8 ─ PermissionlessStartupCoach */
export const PermissionlessStartupCoach = defineAgent({
  name: "PermissionlessStartupCoach",
  description: "Find and validate opportunities you can start without permission (micro-SaaS, AI agent, newsletter, course…).",
  system: `${NAVAL_TONE} Find permissionless opportunities (micro-SaaS, AI-agent product, newsletter, community, course, tool). Scan problem–market fit, map distribution, define an MVP, and design a cheap validation experiment with a clear metric.`,
  inputSchema: z.object({ skills: list.default([]), interests: list.default([]) }),
  outputSchema: z.object({
    opportunities: z.array(z.object({ title: z.string(), problem: z.string(), fit: scoreField })),
    mvp: z.string(), distribution: list, validationExperiment: z.object({ hypothesis: z.string(), test: z.string(), metric: z.string() }), launchChecklist: list,
  }),
  buildUserPrompt: (i) => `Skills: ${i.skills.join(", ")}\nInterests: ${i.interests.join(", ")}\nFind + validate a permissionless opportunity.`,
  example: {
    input: { skills: ["Next.js", "AI agents"] },
    output: { opportunities: [{ title: "Inbox-triage AI agent", problem: "Founders drown in email", fit: 0.6 }], mvp: "One-flow agent that drafts replies for 20 beta users.", distribution: ["Build-in-public", "Founder communities"], validationExperiment: { hypothesis: "Founders will pay $20/mo", test: "Pre-sell to 20 leads", metric: "≥5 paid pre-orders" }, launchChecklist: ["Landing page", "Waitlist", "Beta cohort"] },
  },
});

/* 9 ─ LongTermGameAdvisor */
export const LongTermGameAdvisor = defineAgent({
  name: "LongTermGameAdvisor",
  description: "Evaluate whether a game is worth playing for a decade; flag short-term traps.",
  system: `${NAVAL_TONE} Assess a game/path for long-term play. Score compounding, identityAlignment, relationshipQuality, reputationUpside, learningRate and shortTermTrapRisk (0..1). Flag short-term traps and recommend keep/adjust/drop.`,
  inputSchema: z.object({ game: z.string(), context: z.string().default("") }),
  outputSchema: z.object({
    components: z.object({ compounding: scoreField, identityAlignment: scoreField, relationshipQuality: scoreField, reputationUpside: scoreField, learningRate: scoreField, shortTermTrapRisk: scoreField }),
    shortTermTrap: z.string(), recommendation: z.enum(["keep", "adjust", "drop"]), reasoning: z.string(),
  }),
  buildUserPrompt: (i) => `Game/path: ${i.game}\nContext: ${i.context || "(n/a)"}\nAssess for long-term play + flag traps.`,
  example: {
    input: { game: "Grow an audience by chasing viral hot-takes" },
    output: { components: { compounding: 0.3, identityAlignment: 0.3, relationshipQuality: 0.3, reputationUpside: 0.2, learningRate: 0.3, shortTermTrapRisk: 0.8 }, shortTermTrap: "Virality optimizes attention, not trust or compounding.", recommendation: "adjust", reasoning: "Trade reach-now for a durable, reputation-compounding niche." },
  },
});

/* 10 ─ FreedomArchitect */
export const FreedomArchitect = defineAgent({
  name: "FreedomArchitect",
  description: "Design freedom across time, location, financial and psychological dimensions.",
  system: `${NAVAL_TONE} Assess freedom across four dimensions (time, location, financial, psychological) plus optionality, score each 0..1, map the binding constraints and dependencies, and give a freedom roadmap.`,
  inputSchema: z.object({ situation: z.string(), constraints: list.default([]) }),
  outputSchema: z.object({
    components: z.object({ timeFreedom: scoreField, locationFreedom: scoreField, financialResilience: scoreField, psychologicalFreedom: scoreField, optionality: scoreField }),
    constraints: z.array(z.object({ dimension: z.string(), description: z.string(), severity: scoreField })),
    roadmap: list,
  }),
  buildUserPrompt: (i) => `Situation: ${i.situation}\nKnown constraints: ${i.constraints.join(", ")}\nAssess freedom + a roadmap.`,
  example: {
    input: { situation: "Office job, fixed hours, one income source" },
    output: { components: { timeFreedom: 0.3, locationFreedom: 0.2, financialResilience: 0.4, psychologicalFreedom: 0.5, optionality: 0.3 }, constraints: [{ dimension: "time", description: "Fixed 9–6 with commute", severity: 0.7 }], roadmap: ["Negotiate remote days", "Build a second, location-free income"] },
  },
});

/* 11 ─ HappinessCoach */
export const HappinessCoach = defineAgent({
  name: "HappinessCoach",
  description: "Treat happiness as a trainable skill: desire audit, peace practices, gratitude — not therapy.",
  system: `${NAVAL_TONE}${HAPPINESS_SAFETY} Treat happiness as a skill. Score peace, health, relationships, autonomy, gratitude and desireLoad (0..1), run a brief desire audit, and suggest concrete inner-freedom practices.`,
  inputSchema: z.object({ checkIn: z.string(), desires: list.default([]) }),
  outputSchema: z.object({
    components: z.object({ peace: scoreField, health: scoreField, relationships: scoreField, autonomy: scoreField, gratitude: scoreField, desireLoad: scoreField }),
    desireAudit: list, practices: list, note: z.string().default(""),
  }),
  buildUserPrompt: (i) => `Check-in: ${i.checkIn}\nCurrent desires: ${i.desires.join(", ")}\nScore happiness, audit desires, suggest practices.`,
  example: {
    input: { checkIn: "Restless, comparing myself to peers constantly", desires: ["More status", "A bigger title"] },
    output: { components: { peace: 0.4, health: 0.5, relationships: 0.5, autonomy: 0.5, gratitude: 0.4, desireLoad: 0.7 }, desireAudit: ["Status desire is externally anchored → high suffering, low control"], practices: ["Daily gratitude note", "One comparison-free hour offline"], note: "" },
  },
});

/* 12 ─ LifePortfolioAdvisor */
export const LifePortfolioAdvisor = defineAgent({
  name: "LifePortfolioAdvisor",
  description: "Balance the life portfolio so career doesn't over-optimize at the expense of health, relationships, meaning.",
  system: `${NAVAL_TONE} Across areas (health, wealth, learning, relationships, mission, freedom, happiness, creativity, legacy) rate current 0..1 and target, detect over-optimization/imbalance, and give a reallocation plan.`,
  inputSchema: z.object({ areas: z.array(z.object({ area: z.string(), current: scoreField })).default([]), context: z.string().default("") }),
  outputSchema: z.object({
    imbalance: z.string(),
    reallocation: z.array(z.object({ area: z.string(), action: z.string() })),
    quarterlyReview: list,
  }),
  buildUserPrompt: (i) => `Areas: ${i.areas.map((a) => `${a.area}:${a.current}`).join(", ")}\nContext: ${i.context || "(n/a)"}\nDetect imbalance + reallocation.`,
  example: {
    input: { areas: [{ area: "wealth", current: 0.8 }, { area: "health", current: 0.3 }, { area: "relationships", current: 0.3 }] },
    output: { imbalance: "Career/wealth over-optimized; health and relationships neglected.", reallocation: [{ area: "health", action: "Protect 3 training blocks/week" }, { area: "relationships", action: "One undistracted evening/week" }], quarterlyReview: ["Re-rate each area", "Rebalance attention to the two lowest"] },
  },
});

/* 13 ─ NavalDigitalTwinSimulator */
export const NavalDigitalTwinSimulator = defineAgent({
  name: "NavalDigitalTwinSimulator",
  description: "Synthesize the life-strategy twin: detect drift, surface opportunities, predict constraints.",
  system: `${NAVAL_TONE}${WEALTH_SAFETY} From the user's specific knowledge, leverage, assets, games, freedom and happiness signals, synthesize a life-strategy twin: a one-paragraph state summary, a drift warning, the top opportunities, and likely upcoming constraints. Educational, not advice.`,
  inputSchema: z.object({ signals: list.default([]), goal: z.string().default("") }),
  outputSchema: z.object({
    summary: z.string(), driftScore: scoreField, driftWarning: z.string(),
    opportunities: z.array(z.object({ insight: z.string(), priority: z.number().int().min(1).max(5) })),
    constraints: list,
  }),
  buildUserPrompt: (i) => `Signals:\n${i.signals.join("\n")}\nGoal: ${i.goal || "(n/a)"}\nSynthesize the strategy twin: summary, drift, opportunities, constraints.`,
  example: {
    input: { signals: ["High specific knowledge", "Low leverage", "No owned assets"], goal: "Financial freedom in 5y" },
    output: { summary: "Strong knowledge, weak leverage — the gap is ownership, not ability.", driftScore: 0.4, driftWarning: "Knowledge growing but not being converted into assets.", opportunities: [{ insight: "Productize the top skill into one media + one code asset", priority: 5 }], constraints: ["Time: still trading hours for money"] },
  },
});
