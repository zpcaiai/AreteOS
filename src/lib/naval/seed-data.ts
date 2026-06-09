/* Naval Life OS — seed/reference data (Section 28). Static catalogs used by the
   seed script, dashboards and pickers. No DB dependency. */

export const LEVERAGE_TYPES = [
  { key: "LABOR", label: "Labor", scalable: false },
  { key: "CAPITAL", label: "Capital", scalable: true },
  { key: "CODE", label: "Code", scalable: true, permissionless: true },
  { key: "MEDIA", label: "Media", scalable: true, permissionless: true },
  { key: "AI_AGENT", label: "AI Agents", scalable: true, permissionless: true },
  { key: "COMMUNITY", label: "Community", scalable: true },
  { key: "BRAND", label: "Brand", scalable: true },
  { key: "NETWORK", label: "Network", scalable: true },
  { key: "KNOWLEDGE", label: "Knowledge", scalable: true },
  { key: "SYSTEM", label: "Systems", scalable: true },
] as const;

export const ASSET_TYPES = [
  "CODE", "MEDIA", "KNOWLEDGE", "PRODUCT", "BRAND",
  "COMMUNITY", "EQUITY", "INVESTMENT", "BUSINESS", "AI_AGENT",
] as const;

export const LIFE_PORTFOLIO_AREAS = [
  "HEALTH", "WEALTH", "LEARNING", "RELATIONSHIPS", "MISSION",
  "FREEDOM", "HAPPINESS", "CREATIVITY", "LEGACY",
] as const;

export const HAPPINESS_PRACTICES = [
  "desire audit", "daily walk", "solitude", "gratitude reflection", "sleep review",
  "digital quiet hour", "relationship repair", "focused work", "physical training", "mindful breathing",
] as const;

export const FREEDOM_DIMENSIONS = ["TIME", "LOCATION", "FINANCIAL", "PSYCHOLOGICAL"] as const;

export const SPECIFIC_KNOWLEDGE_QUESTIONS = [
  "What do you learn without being forced?",
  "What do people ask you for help with?",
  "What problems do you notice before others?",
  "What can you explore for years without external reward?",
  "What have you learned through pain, failure, or unusual experience?",
  "What skill combinations make you different?",
  "What is obvious to you but not to others?",
  "What domain gives you both interest and an unfair advantage?",
  "What could you keep improving for 10 years?",
  "What would you work on even if nobody praised you?",
] as const;
