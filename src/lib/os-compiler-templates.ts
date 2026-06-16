// Personal OS Compiler — templates + intent routing. Pure data + a keyword router
// that maps a desired-identity sentence to the closest OS template. No I/O imports.

export interface IdentityStack { primary: string; secondary: string; emerging: string; legacy: string }
export interface OSTemplate {
  key: string;
  name: string;
  keywords: string[];
  identityStack: IdentityStack;
  values: string[];
  skills: string[];
  habits: string[];
  deepWorkBlocks: number;
  assetRoadmap: string[];
  decisionRules: string[];
  ninetyDay: { m1: string; m2: string; m3: string };
}

const O = (
  key: string, name: string, keywords: string[], identityStack: IdentityStack, values: string[], skills: string[], habits: string[],
  deepWorkBlocks: number, assetRoadmap: string[], decisionRules: string[], ninetyDay: { m1: string; m2: string; m3: string },
): OSTemplate => ({ key, name, keywords, identityStack, values, skills, habits, deepWorkBlocks, assetRoadmap, decisionRules, ninetyDay });

export const PERSONAL_OS_TEMPLATES: OSTemplate[] = [
  O("ai_entrepreneur", "AI Entrepreneur OS", ["ai", "research entrepreneur", "ai entrepreneur", "ml"],
    { primary: "Researcher", secondary: "Builder", emerging: "Entrepreneur", legacy: "Mentor" },
    ["Truth", "Leverage", "Usefulness", "Long-termism", "Integrity"],
    ["AI research", "software architecture", "product discovery", "writing", "distribution"],
    ["Read one paper daily", "Write one research note daily", "Build one prototype weekly", "Talk to one user weekly"],
    4, ["Research memo", "Prototype", "Public essay", "MVP", "User-interview database"],
    ["Evidence before enthusiasm", "Prototype before scaling", "Users before abstraction", "Compounding over attention"],
    { m1: "Research + problem discovery", m2: "Prototype + publish", m3: "User feedback + MVP iteration" }),
  O("researcher", "Researcher OS", ["research", "scientist", "phd", "scholar"],
    { primary: "Researcher", secondary: "Writer", emerging: "Systems Thinker", legacy: "Teacher" },
    ["Truth", "Rigor", "Curiosity", "Contribution"],
    ["literature synthesis", "experiment design", "argumentation", "writing", "statistics"],
    ["Read one paper daily", "Write one note daily", "Run one experiment weekly", "Weekly synthesis"],
    4, ["Literature map", "Research memo", "Paper draft", "Public explainer"],
    ["Question before answer", "Cheap test before big claim", "Write to think"],
    { m1: "Map the field + a question", m2: "Run experiments + draft", m3: "Publish + get feedback" }),
  O("builder", "Builder OS", ["build", "engineer", "developer", "ship"],
    { primary: "Builder", secondary: "Architect", emerging: "Founder", legacy: "Mentor" },
    ["Craft", "Shipping", "Simplicity", "Ownership"],
    ["systems design", "debugging", "testing", "performance", "API design"],
    ["Ship something daily", "Fix one bug daily", "Refactor weekly", "Read code weekly"],
    4, ["Prototype", "Code library", "Product feature", "Technical writeup"],
    ["Working over perfect", "Simplify before scaling", "Measure before optimizing"],
    { m1: "Define + prototype", m2: "Build v1 + test", m3: "Ship + harden" }),
  O("system_architect", "System Architect OS", ["architect", "systems", "platform", "infrastructure"],
    { primary: "Systems Thinker", secondary: "Architect", emerging: "Leader", legacy: "Mentor" },
    ["Coherence", "Leverage", "Reliability", "Clarity"],
    ["systems thinking", "architecture", "trade-off analysis", "documentation", "modeling"],
    ["Diagram one system weekly", "Write one design doc weekly", "Review one trade-off daily"],
    3, ["Architecture diagram", "Design doc", "Reference framework", "Decision record"],
    ["Constraints before solutions", "Reversible before irreversible", "Document the why"],
    { m1: "Map systems + constraints", m2: "Design + prototype", m3: "Validate + document" }),
  O("founder", "Founder OS", ["found", "startup", "company", "business"],
    { primary: "Founder", secondary: "Builder", emerging: "Leader", legacy: "Institution Builder" },
    ["Customer value", "Speed", "Resilience", "Integrity"],
    ["product discovery", "selling", "hiring", "fundraising", "operations"],
    ["Talk to one customer daily", "Ship weekly", "Review metrics weekly", "Write one update weekly"],
    4, ["Offer", "MVP", "Sales page", "Customer-interview database", "Operating playbook"],
    ["Customers before code", "Cap downside, keep upside open", "Decide reversibly, fast"],
    { m1: "Problem + customers", m2: "MVP + first users", m3: "Iterate + early revenue" }),
  O("investor", "Investor OS", ["invest", "investor", "capital", "portfolio"],
    { primary: "Investor", secondary: "Researcher", emerging: "Allocator", legacy: "Steward" },
    ["Patience", "Rationality", "Long-termism", "Independence"],
    ["valuation", "incentive analysis", "decision journaling", "probabilistic thinking"],
    ["Read one annual report weekly", "Journal each decision", "Study one incentive daily", "Avoid impulsive trades"],
    3, ["Thesis memo", "Decision journal", "Company analysis", "Principle library"],
    ["Margin of safety", "Invert the thesis", "Base rates before stories"],
    { m1: "Build the journal + principles", m2: "Write theses", m3: "Review decisions + refine" }),
  O("creator", "Creator OS", ["creat", "artist", "design", "media"],
    { primary: "Creator", secondary: "Designer", emerging: "Product Builder", legacy: "Culture Builder" },
    ["Originality", "Taste", "Devotion", "Generosity"],
    ["ideation", "craft", "storytelling", "distribution", "iteration"],
    ["Make something daily", "Publish weekly", "Collect feedback weekly", "Study a master weekly"],
    3, ["Essay", "Series", "Portfolio piece", "Signature format"],
    ["Ship before perfect", "Quantity unlocks quality", "Make for one person"],
    { m1: "Find the voice + format", m2: "Publish consistently", m3: "Build an audience + portfolio" }),
  O("leader", "Leader OS", ["lead", "manager", "executive", "team"],
    { primary: "Leader", secondary: "Coach", emerging: "Mentor", legacy: "Institution Builder" },
    ["Service", "Clarity", "Trust", "Accountability"],
    ["communication", "delegation", "decision-making", "team design", "coaching"],
    ["One 1:1 weekly", "Clarify one priority daily", "Review one decision weekly", "Give one piece of feedback daily"],
    3, ["Operating principle", "Team playbook", "Decision record", "Vision memo"],
    ["Clarity before speed", "Decide who decides", "Praise in public, correct in private"],
    { m1: "Clarify vision + roles", m2: "Build operating cadence", m3: "Develop the team + delegate" }),
  O("mentor", "Mentor OS", ["mentor", "teach", "coach", "educator"],
    { primary: "Teacher", secondary: "Mentor", emerging: "Institution Builder", legacy: "Legacy Builder" },
    ["Generosity", "Patience", "Truth", "Contribution"],
    ["explanation", "curriculum design", "feedback", "storytelling"],
    ["Explain one idea daily", "Mentor one person weekly", "Publish one lesson weekly"],
    2, ["Lesson", "Course outline", "Explanation thread", "Mentoring framework"],
    ["Teach to understand", "Meet them where they are", "Transfer, don't impress"],
    { m1: "Define what you teach", m2: "Create lessons", m3: "Mentor + build a curriculum" }),
  O("knowledge_creator", "Knowledge Creator OS", ["knowledge", "writer", "content", "thinker"],
    { primary: "Researcher", secondary: "Creator", emerging: "Teacher", legacy: "Mentor" },
    ["Truth", "Clarity", "Usefulness", "Compounding"],
    ["research", "writing", "synthesis", "distribution"],
    ["Read daily", "Write one note daily", "Publish weekly", "Synthesize weekly"],
    3, ["Knowledge map", "Essay", "Newsletter", "Reusable framework"],
    ["Write to think", "Publish to learn", "Compounding over virality"],
    { m1: "Pick a domain + start notes", m2: "Publish weekly", m3: "Build a body of work" }),
];

export const TEMPLATE_BY_KEY: Record<string, OSTemplate> = Object.fromEntries(PERSONAL_OS_TEMPLATES.map((t) => [t.key, t]));

/** Route a free-text desired-identity intent to the closest template. */
export function pickTemplate(intent: string): OSTemplate {
  const text = intent.toLowerCase();
  let best: OSTemplate | null = null;
  let bestHits = 0;
  for (const t of PERSONAL_OS_TEMPLATES) {
    const hits = t.keywords.reduce((n, k) => (text.includes(k) ? n + 1 : n), 0);
    if (hits > bestHits) { best = t; bestHits = hits; }
  }
  return best ?? TEMPLATE_BY_KEY.knowledge_creator;
}
