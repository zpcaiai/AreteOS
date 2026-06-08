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
    features: ["Everything in Free", "All 19 AI coaches", "Decisions · Mental Models · First Principles", "Genius modeling & Learning Paths", "Post in the community", "Weekly reviews"],
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
