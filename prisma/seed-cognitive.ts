// MISSION OS — Cognitive OS seed: 18 mental models, 10 biases, 8 decision lenses.
// Idempotent (upsert by slug). Run via `npm run db:seed` (or `db:seed:cognitive`).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MODELS = [
  {
    "slug": "opportunity-cost",
    "name": "Opportunity Cost",
    "category": "ECONOMICS",
    "summary": "The true cost of a choice is the best alternative you give up.",
    "whenToUse": "Every allocation of time/money/attention.",
    "examples": [
      "Saying yes to a project means saying no to others"
    ]
  },
  {
    "slug": "incentives",
    "name": "Incentives",
    "category": "ECONOMICS",
    "summary": "People respond to incentives; to predict behavior, follow the rewards.",
    "whenToUse": "Designing systems, predicting behavior.",
    "examples": [
      "Commission pay shifts what salespeople optimize"
    ]
  },
  {
    "slug": "network-effects",
    "name": "Network Effects",
    "category": "ECONOMICS",
    "summary": "Each new user makes the product more valuable to others.",
    "whenToUse": "Platform/market strategy.",
    "examples": [
      "A marketplace gets better as more buyers and sellers join"
    ]
  },
  {
    "slug": "economies-of-scale",
    "name": "Economies of Scale",
    "category": "ECONOMICS",
    "summary": "Unit cost falls as volume rises.",
    "whenToUse": "Scaling, pricing, competition.",
    "examples": [
      "Larger production runs lower the cost per unit"
    ]
  },
  {
    "slug": "compounding",
    "name": "Compounding",
    "category": "ECONOMICS",
    "summary": "Small gains reinvested grow exponentially over time.",
    "whenToUse": "Long-horizon decisions.",
    "examples": [
      "Skills and capital both compound with consistency"
    ]
  },
  {
    "slug": "feedback-loops",
    "name": "Feedback Loops",
    "category": "SYSTEMS_THINKING",
    "summary": "Outputs loop back as inputs, amplifying or dampening behavior.",
    "whenToUse": "Understanding system dynamics.",
    "examples": [
      "Reinforcing loops cause runaway growth or collapse"
    ]
  },
  {
    "slug": "second-order-effects",
    "name": "Second-Order Effects",
    "category": "SYSTEMS_THINKING",
    "summary": "The consequences of consequences often dominate first effects.",
    "whenToUse": "Any consequential decision.",
    "examples": [
      "A quick fix that creates a bigger problem later"
    ]
  },
  {
    "slug": "bottlenecks",
    "name": "Bottlenecks",
    "category": "SYSTEMS_THINKING",
    "summary": "A system's throughput is set by its tightest constraint.",
    "whenToUse": "Improving any process.",
    "examples": [
      "Speeding up non-constraints doesn't raise output"
    ]
  },
  {
    "slug": "bayesian-updating",
    "name": "Bayesian Updating",
    "category": "PROBABILITY",
    "summary": "Revise beliefs in proportion to new evidence.",
    "whenToUse": "Reasoning under uncertainty.",
    "examples": [
      "Update your estimate as data arrives, don't anchor"
    ]
  },
  {
    "slug": "expected-value",
    "name": "Expected Value",
    "category": "PROBABILITY",
    "summary": "Weigh each outcome by its probability and payoff.",
    "whenToUse": "Decisions with uncertain payoffs.",
    "examples": [
      "A low-odds, high-payoff bet can still be worth taking"
    ]
  },
  {
    "slug": "margin-of-safety",
    "name": "Margin of Safety",
    "category": "DECISION_SCIENCE",
    "summary": "Leave room for error so mistakes aren't fatal.",
    "whenToUse": "Risk-bearing decisions.",
    "examples": [
      "Build in buffer against being wrong"
    ]
  },
  {
    "slug": "regression-to-the-mean",
    "name": "Regression to the Mean",
    "category": "PROBABILITY",
    "summary": "Extreme results tend to be followed by more average ones.",
    "whenToUse": "Interpreting performance.",
    "examples": [
      "A great quarter is often followed by a normal one"
    ]
  },
  {
    "slug": "circle-of-competence",
    "name": "Circle of Competence",
    "category": "DECISION_SCIENCE",
    "summary": "Know the boundary of what you truly understand, and stay inside it.",
    "whenToUse": "Choosing where to act.",
    "examples": [
      "Decline bets that require knowledge you lack"
    ]
  },
  {
    "slug": "inversion",
    "name": "Inversion",
    "category": "DECISION_SCIENCE",
    "summary": "Solve problems backward: study how to fail, then avoid it.",
    "whenToUse": "Hard or stuck problems.",
    "examples": [
      "Ask what guarantees the worst outcome, then prevent it"
    ]
  },
  {
    "slug": "via-negativa",
    "name": "Via Negativa",
    "category": "DECISION_SCIENCE",
    "summary": "Improvement by removal — subtract harm before adding features.",
    "whenToUse": "Simplification, health, design.",
    "examples": [
      "Removing a bad habit often beats adding a good one"
    ]
  },
  {
    "slug": "optionality",
    "name": "Optionality",
    "category": "PROBABILITY",
    "summary": "Keep cheap options open with large upside and capped downside.",
    "whenToUse": "Uncertain, fast-changing domains.",
    "examples": [
      "Small experiments preserve big future choices"
    ]
  },
  {
    "slug": "antifragility",
    "name": "Antifragility",
    "category": "SYSTEMS_THINKING",
    "summary": "Some systems gain from disorder and stress, not just survive it.",
    "whenToUse": "Designing resilient systems.",
    "examples": [
      "Redundancy and small stressors strengthen a system"
    ]
  },
  {
    "slug": "power-laws",
    "name": "Power Laws",
    "category": "PROBABILITY",
    "summary": "A few inputs account for most outputs; distributions are not normal.",
    "whenToUse": "Prioritization, investing.",
    "examples": [
      "A handful of bets drive most of the returns"
    ]
  }
] as const;
const BIASES = [
  {
    "slug": "confirmation-bias",
    "name": "Confirmation Bias",
    "description": "Seeking and weighting evidence that confirms what you already believe.",
    "correction": "Actively seek disconfirming evidence; argue the other side."
  },
  {
    "slug": "sunk-cost-bias",
    "name": "Sunk Cost Bias",
    "description": "Continuing because of past investment rather than future value.",
    "correction": "Decide from here forward; ignore unrecoverable costs."
  },
  {
    "slug": "authority-bias",
    "name": "Authority Bias",
    "description": "Over-weighting the opinion of an authority figure.",
    "correction": "Judge the argument, not the title."
  },
  {
    "slug": "recency-bias",
    "name": "Recency Bias",
    "description": "Over-weighting the most recent events.",
    "correction": "Zoom out to base rates and longer history."
  },
  {
    "slug": "availability-bias",
    "name": "Availability Bias",
    "description": "Judging likelihood by how easily examples come to mind.",
    "correction": "Use actual frequencies, not vividness."
  },
  {
    "slug": "loss-aversion",
    "name": "Loss Aversion",
    "description": "Feeling losses roughly twice as strongly as equivalent gains.",
    "correction": "Reframe in absolute terms; weigh symmetrically."
  },
  {
    "slug": "overconfidence",
    "name": "Overconfidence",
    "description": "Systematically overestimating your accuracy or control.",
    "correction": "Track calibration; pre-mortem your plan."
  },
  {
    "slug": "status-quo-bias",
    "name": "Status Quo Bias",
    "description": "Preferring things to stay the same by default.",
    "correction": "Ask: would I choose this fresh today?"
  },
  {
    "slug": "social-proof-bias",
    "name": "Social Proof Bias",
    "description": "Copying the crowd instead of reasoning independently.",
    "correction": "Separate consensus from correctness."
  },
  {
    "slug": "halo-effect",
    "name": "Halo Effect",
    "description": "Letting one positive trait color your whole judgment.",
    "correction": "Evaluate each dimension on its own evidence."
  }
] as const;
const LENSES = [
  {
    "slug": "mission",
    "name": "Mission",
    "question": "Does this serve the larger purpose I exist for?"
  },
  {
    "slug": "identity",
    "name": "Identity",
    "question": "Is this who I am becoming?"
  },
  {
    "slug": "economics",
    "name": "Economics",
    "question": "What are the costs, incentives and expected value?"
  },
  {
    "slug": "probability",
    "name": "Probability",
    "question": "What's likely, and how confident should I be?"
  },
  {
    "slug": "systems",
    "name": "Systems",
    "question": "What are the second-order effects and feedback loops?"
  },
  {
    "slug": "psychology",
    "name": "Psychology",
    "question": "What biases might be distorting this?"
  },
  {
    "slug": "risk",
    "name": "Risk",
    "question": "What's the downside, and can I survive being wrong?"
  },
  {
    "slug": "time-horizon",
    "name": "Time Horizon",
    "question": "How does this look over years, not days?"
  }
] as const;

type Cat = "ECONOMICS"|"PSYCHOLOGY"|"SYSTEMS_THINKING"|"PROBABILITY"|"BIOLOGY"|"PHYSICS"|"STRATEGY"|"INNOVATION"|"DECISION_SCIENCE"|"GENERAL";

async function main() {
  for (const m of MODELS) {
    await prisma.cogModel.upsert({
      where: { slug: m.slug },
      update: { name: m.name, category: m.category as Cat, summary: m.summary, whenToUse: m.whenToUse, examples: [...m.examples] },
      create: { slug: m.slug, name: m.name, category: m.category as Cat, summary: m.summary, whenToUse: m.whenToUse, examples: [...m.examples] },
    });
  }
  for (const b of BIASES) {
    await prisma.bias.upsert({
      where: { slug: b.slug },
      update: { name: b.name, description: b.description, correction: b.correction },
      create: { slug: b.slug, name: b.name, description: b.description, correction: b.correction },
    });
  }
  for (const l of LENSES) {
    await prisma.decisionLens.upsert({
      where: { slug: l.slug },
      update: { name: l.name, question: l.question },
      create: { slug: l.slug, name: l.name, question: l.question },
    });
  }
  console.log(`Seeded ${MODELS.length} mental models, ${BIASES.length} biases, ${LENSES.length} decision lenses.`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
