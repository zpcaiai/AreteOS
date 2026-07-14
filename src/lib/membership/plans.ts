// Membership catalog + entitlements. String-based so this file is safe to import
// from client components (no Prisma client dependency).

export type Tier = "FREE" | "PLUS" | "PRO";
export type Period = "MONTHLY" | "QUARTERLY" | "ANNUAL";

export const TIER_RANK: Record<Tier, number> = { FREE: 0, PLUS: 1, PRO: 2 };

export interface TierInfo { tier: Tier; label: string; tagline: string; features: string[] }

export const TIERS: TierInfo[] = [
  {
    tier: "FREE", label: "Free", tagline: "Start the loop.",
    features: ["Worldview · Mission · Identity · Values", "Habits & daily Reflection", "Dashboard & growth score", "Browse the community"],
  },
  {
    tier: "PLUS", label: "Plus", tagline: "Think and decide better.",
    features: ["Everything in Free", "All 19 AI coaches", "Decisions · Mental Models · First Principles", "Genius modeling & Learning Paths", "Naval Life OS — leverage, judgment, wealth & freedom", "Post in the community", "Weekly reviews"],
  },
  {
    tier: "PRO", label: "Pro", tagline: "Compound into excellence.",
    features: ["Everything in Plus", "Digital Twin & drift prediction", "Excellence adaptation (genius → you)", "Knowledge graph + nightly reports", "Quarterly reviews & priority AI", "Business Scaling (SFM), Leadership & Management OS"],
  },
];

// feature key -> minimum tier rank required.
export const FEATURES: Record<string, number> = {
  agents: 1, decisions: 1, mental_models: 1, first_principles: 1,
  genius: 1, learning_path: 1, community_post: 1, weekly_review: 1,
  digital_twin: 2, excellence_adapt: 2, knowledge_graph: 2, nightly_reports: 2, quarterly_review: 2,
  sfm: 2, leadership: 2, management: 2, cognitive: 2, child: 2,
  naval: 2,
  // Innovation engines (2026-06)
  council: 2, future_self: 2, graph_path: 2, cross_engine: 2,
  narrative: 1, evidence: 1, experiments: 1,
  // Orchestration engines (2026-06)
  bottleneck: 1, prescription: 1, growth_protocol: 1, boardroom: 2,
  identity_tree: 1, asset_growth: 1, life_capital: 1, personal_os: 2,
  // Skills Library (2026-06): 20 engines
  skill_specific_knowledge: 1, skill_principle_centered_life: 1, skill_deliberate_practice: 1, skill_double_loop_learning: 1, skill_flow_state: 1, skill_intrinsic_motivation: 1, skill_deep_work: 1, skill_growth_mindset: 1, skill_behavior_design: 1, skill_identity_based_habit: 1, skill_mastery_learning: 1, skill_experiential_learning: 1,
  skill_archetype_identity: 2, skill_cognitive_bias: 2, skill_antifragile_life: 2, skill_ooda_adaptive_action: 2, skill_design_thinking: 2, skill_creativity_capability: 2, skill_learning_organization: 2, skill_psychological_safety: 2,
};

export function hasFeature(tier: Tier, featureKey: string): boolean {
  const need = FEATURES[featureKey] ?? 0;
  return TIER_RANK[tier] >= need;
}

// Prices in the smallest sensible unit (¥). Quarterly/annual carry a discount.
export const PRICES: Record<Exclude<Tier, "FREE">, Record<Period, number>> = {
  PLUS: { MONTHLY: 39, QUARTERLY: 99, ANNUAL: 299 },
  PRO: { MONTHLY: 99, QUARTERLY: 269, ANNUAL: 899 },
};

/** B2B seat tier — grants PRO to each member. Priced per seat (min 3 seats). */
export const TEAM_PLAN = {
  grantsTier: "PRO" as const,
  minSeats: 3,
  pricePerSeat: { MONTHLY: 79, QUARTERLY: 219, ANNUAL: 719 } as Record<Period, number>,
};

export const PERIOD_DAYS: Record<Period, number> = { MONTHLY: 30, QUARTERLY: 90, ANNUAL: 365 };
export const PERIOD_LABEL: Record<Period, string> = { MONTHLY: "Monthly", QUARTERLY: "Quarterly", ANNUAL: "Annual" };

export function price(tier: Tier, period: Period): number {
  if (tier === "FREE") return 0;
  return PRICES[tier][period];
}

/** Effective ¥/month, for showing savings on longer terms. */
export function perMonth(tier: Tier, period: Period): number {
  const months = PERIOD_DAYS[period] / 30;
  return Math.round((price(tier, period) / months) * 10) / 10;
}
