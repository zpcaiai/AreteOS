/* Naval Life OS — engine UI config. Plain serializable data so server pages can
   pass it into the client <EngineStudio/>. One entry per engine (Section 5–17). */

export type FieldKind = "text" | "textarea" | "list" | "areas";
export interface Field { name: string; label: string; kind: FieldKind; placeholder?: string }
export interface EngineConfig {
  slug: string;
  title: string;
  subtitle: string;
  assessEndpoint: string;
  button: string;
  fields: Field[];
  profileEndpoint?: string;
  /** key in the response object that holds the latest persisted record (for the GET view) */
}

export const PORTFOLIO_AREAS = [
  "HEALTH", "WEALTH", "LEARNING", "RELATIONSHIPS", "MISSION", "FREEDOM", "HAPPINESS", "CREATIVITY", "LEGACY",
] as const;

export const ENGINES: Record<string, EngineConfig> = {
  "specific-knowledge": {
    slug: "specific-knowledge", title: "Specific Knowledge", button: "Assess",
    subtitle: "The rare intersection of curiosity, lived experience and skill that others can't easily replicate.",
    assessEndpoint: "/api/naval/specific-knowledge/assess", profileEndpoint: "/api/naval/specific-knowledge/profile",
    fields: [
      { name: "answers", label: "Answer the prompts (one per line)", kind: "list", placeholder: "What do you learn without being forced?\nWhat do people ask you for help with?\nWhat is obvious to you but not to others?" },
      { name: "context", label: "Any extra context", kind: "textarea", placeholder: "Background, current work, domain…" },
    ],
  },
  "talent-stack": {
    slug: "talent-stack", title: "Talent Stack", button: "Build stack",
    subtitle: "Combine several skills into a rare, defensible identity — not a single best skill.",
    assessEndpoint: "/api/naval/talent-stack/analyze", profileEndpoint: "/api/naval/talent-stack",
    fields: [
      { name: "skills", label: "Your skills (one per line)", kind: "list", placeholder: "AI engineering\nteaching\nsystems design\nwriting" },
      { name: "interests", label: "Interests / obsessions (optional)", kind: "list", placeholder: "education\ndeveloper tools" },
    ],
  },
  "leverage": {
    slug: "leverage", title: "Leverage", button: "Assess leverage",
    subtitle: "Labor, capital, code, media, AI agents — find where you rent your time and where you can own scale.",
    assessEndpoint: "/api/naval/leverage/assess", profileEndpoint: "/api/naval/leverage/profile",
    fields: [
      { name: "currentWork", label: "Describe your current work", kind: "textarea", placeholder: "Salaried consultant billing hours…" },
      { name: "incomeSources", label: "Income sources (one per line)", kind: "list", placeholder: "salary\nfreelance gigs" },
    ],
  },
  "judgment": {
    slug: "judgment", title: "Judgment", button: "Assess judgment",
    subtitle: "The quality of your decisions under uncertainty — and the blind spots that drag it down.",
    assessEndpoint: "/api/naval/judgment/assess", profileEndpoint: "/api/naval/judgment/profile",
    fields: [
      { name: "decisions", label: "Recent meaningful decisions (one per line)", kind: "list", placeholder: "I act fast and rarely write down assumptions" },
      { name: "reflections", label: "Reflections on how you decide (optional)", kind: "list", placeholder: "I tend to anchor on the first option" },
    ],
  },
  "decision-journal": {
    slug: "decision-journal", title: "Decision Journal", button: "Log decision",
    subtitle: "Structure a decision for later review. Reviewing predictions is the fastest way to sharpen judgment.",
    assessEndpoint: "/api/naval/decision-journal/create", profileEndpoint: "/api/naval/decision-journal",
    fields: [
      { name: "decision", label: "The decision", kind: "textarea", placeholder: "Leave my job to build a product" },
      { name: "context", label: "Context (optional)", kind: "textarea", placeholder: "6 months runway, idea has early pull…" },
    ],
  },
  "wealth": {
    slug: "wealth", title: "Wealth Creation", button: "Map wealth",
    subtitle: "Wealth is owning assets that earn while you sleep — not renting your time. Educational only.",
    assessEndpoint: "/api/naval/wealth/profile", profileEndpoint: "/api/naval/wealth/profile",
    fields: [
      { name: "incomeStreams", label: "Income streams (one per line)", kind: "list", placeholder: "salary\nside project" },
      { name: "assets", label: "Assets you own (one per line)", kind: "list", placeholder: "open-source library\nnewsletter" },
    ],
  },
  "assets": {
    slug: "assets", title: "Asset Builder", button: "Generate ideas",
    subtitle: "Turn knowledge and skills into assets that keep producing value after the initial effort.",
    assessEndpoint: "/api/naval/assets/ideas", profileEndpoint: "/api/naval/assets",
    fields: [
      { name: "knowledge", label: "What do you know how to do?", kind: "textarea", placeholder: "I know how to migrate legacy apps to Next.js" },
      { name: "audience", label: "Audience (optional)", kind: "text", placeholder: "indie developers" },
    ],
  },
  "opportunities": {
    slug: "opportunities", title: "Permissionless Opportunities", button: "Discover",
    subtitle: "Find and validate things you can start without asking permission: micro-SaaS, AI agents, courses, communities.",
    assessEndpoint: "/api/naval/opportunities/discover", profileEndpoint: "/api/naval/opportunities",
    fields: [
      { name: "skills", label: "Skills (one per line)", kind: "list", placeholder: "Next.js\nAI agents" },
      { name: "interests", label: "Interests (one per line)", kind: "list", placeholder: "developer productivity" },
    ],
  },
  "long-term-games": {
    slug: "long-term-games", title: "Long-Term Games", button: "Assess game",
    subtitle: "Is this game worth playing for a decade? Compounding, identity, reputation — minus short-term traps.",
    assessEndpoint: "/api/naval/long-term-games/assess", profileEndpoint: "/api/naval/long-term-games",
    fields: [
      { name: "game", label: "The game / path", kind: "text", placeholder: "Grow an audience by chasing viral hot-takes" },
      { name: "context", label: "Context (optional)", kind: "textarea", placeholder: "Why you're considering it…" },
    ],
  },
  "freedom": {
    slug: "freedom", title: "Freedom", button: "Assess freedom",
    subtitle: "Design freedom across four dimensions: time, location, financial, and psychological.",
    assessEndpoint: "/api/naval/freedom/assess", profileEndpoint: "/api/naval/freedom/profile",
    fields: [
      { name: "situation", label: "Your current situation", kind: "textarea", placeholder: "Office job, fixed hours, one income source" },
      { name: "constraints", label: "Known constraints (one per line)", kind: "list", placeholder: "mortgage\nfixed 9-6\nsingle income" },
    ],
  },
  "happiness": {
    slug: "happiness", title: "Happiness", button: "Check in",
    subtitle: "Happiness as a trainable skill: lower desire load, raise peace. This is not therapy.",
    assessEndpoint: "/api/naval/happiness/assess", profileEndpoint: "/api/naval/happiness/profile",
    fields: [
      { name: "checkIn", label: "How are you, honestly?", kind: "textarea", placeholder: "Restless, comparing myself to peers constantly" },
      { name: "desires", label: "Current desires (one per line)", kind: "list", placeholder: "more status\na bigger title" },
    ],
  },
  "life-portfolio": {
    slug: "life-portfolio", title: "Life Portfolio", button: "Assess balance",
    subtitle: "Don't over-optimize career at the expense of health, relationships and meaning. Rate each area 0–100.",
    assessEndpoint: "/api/naval/life-portfolio/assess", profileEndpoint: "/api/naval/life-portfolio",
    fields: [
      { name: "areas", label: "Rate each life area", kind: "areas" },
      { name: "context", label: "Context (optional)", kind: "textarea", placeholder: "What's been getting all your attention…" },
    ],
  },
  "twin": {
    slug: "twin", title: "Naval Digital Twin", button: "Simulate",
    subtitle: "Synthesize your life-strategy twin: detect drift, surface opportunities, predict constraints.",
    assessEndpoint: "/api/naval/twin/simulate", profileEndpoint: "/api/naval/twin/profile",
    fields: [
      { name: "signals", label: "Signals about your situation (one per line)", kind: "list", placeholder: "High specific knowledge\nLow leverage\nNo owned assets" },
      { name: "goal", label: "Your goal", kind: "text", placeholder: "Financial freedom in 5 years" },
    ],
  },
};

export const ENGINE_ORDER = [
  "specific-knowledge", "talent-stack", "leverage", "judgment", "decision-journal", "wealth",
  "assets", "opportunities", "long-term-games", "freedom", "happiness", "life-portfolio", "twin",
] as const;
