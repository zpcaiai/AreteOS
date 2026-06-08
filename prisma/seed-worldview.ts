// MISSION OS — Worldview OS seed: 10 worldview archetypes.
// Idempotent (upsert by slug). Run via `npm run db:seed` (or `db:seed:worldview`).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ARCHETYPES = [
  {
    "slug": "explorer",
    "name": "Explorer",
    "mission": "Discover what's possible by venturing past the known.",
    "coreAssumptions": [
      "Reality rewards the curious",
      "The map is never the territory",
      "Discovery beats certainty"
    ],
    "values": [
      "Curiosity",
      "Courage",
      "Openness"
    ],
    "blindSpots": [
      "Restlessness",
      "Starting more than finishing"
    ],
    "growthOpportunities": [
      "Pair exploration with one committed depth"
    ]
  },
  {
    "slug": "builder",
    "name": "Builder",
    "mission": "Turn possibility into working reality.",
    "coreAssumptions": [
      "Reality is shaped by what we make",
      "Shipping reveals truth"
    ],
    "values": [
      "Craft",
      "Pragmatism",
      "Reliability"
    ],
    "blindSpots": [
      "Building before deciding what matters"
    ],
    "growthOpportunities": [
      "Add a 'why' check before each build"
    ]
  },
  {
    "slug": "scholar",
    "name": "Scholar",
    "mission": "Understand reality deeply before acting.",
    "coreAssumptions": [
      "Knowledge compounds",
      "Context determines meaning"
    ],
    "values": [
      "Depth",
      "Rigor",
      "Patience"
    ],
    "blindSpots": [
      "Analysis without action",
      "Detachment"
    ],
    "growthOpportunities": [
      "Set action deadlines on inquiry"
    ]
  },
  {
    "slug": "entrepreneur",
    "name": "Entrepreneur",
    "mission": "Create value by acting under uncertainty.",
    "coreAssumptions": [
      "Uncertainty is opportunity",
      "Value created beats credentials"
    ],
    "values": [
      "Initiative",
      "Resilience",
      "Focus"
    ],
    "blindSpots": [
      "Chasing too many opportunities"
    ],
    "growthOpportunities": [
      "Adopt a single-focus filter"
    ]
  },
  {
    "slug": "guardian",
    "name": "Guardian",
    "mission": "Protect and preserve what matters.",
    "coreAssumptions": [
      "Some things must be defended",
      "Stability enables growth"
    ],
    "values": [
      "Duty",
      "Prudence",
      "Loyalty"
    ],
    "blindSpots": [
      "Resisting needed change",
      "Over-caution"
    ],
    "growthOpportunities": [
      "Distinguish protecting from clinging"
    ]
  },
  {
    "slug": "visionary",
    "name": "Visionary",
    "mission": "See and call forth a better future.",
    "coreAssumptions": [
      "The future is built by those who imagine it",
      "Meaning aligns people"
    ],
    "values": [
      "Imagination",
      "Conviction",
      "Hope"
    ],
    "blindSpots": [
      "Detachment from reality",
      "Vision without execution"
    ],
    "growthOpportunities": [
      "Pair each vision with a realist plan"
    ]
  },
  {
    "slug": "strategist",
    "name": "Strategist",
    "mission": "Win by choosing where and how to act.",
    "coreAssumptions": [
      "Position beats effort",
      "Most outcomes are decided before the contest"
    ],
    "values": [
      "Foresight",
      "Discipline",
      "Focus"
    ],
    "blindSpots": [
      "Over-planning",
      "Cynicism"
    ],
    "growthOpportunities": [
      "Convert one plan into action this week"
    ]
  },
  {
    "slug": "creator",
    "name": "Creator",
    "mission": "Bring new realities into being.",
    "coreAssumptions": [
      "Creation is a discipline",
      "Constraints breed originality"
    ],
    "values": [
      "Originality",
      "Courage",
      "Expression"
    ],
    "blindSpots": [
      "Perfectionism",
      "Comparison"
    ],
    "growthOpportunities": [
      "Ship before it feels ready"
    ]
  },
  {
    "slug": "systems-thinker",
    "name": "Systems Thinker",
    "mission": "See the whole, its relationships and feedback.",
    "coreAssumptions": [
      "Everything is connected",
      "Structure drives behavior"
    ],
    "values": [
      "Holism",
      "Patience",
      "Leverage"
    ],
    "blindSpots": [
      "Over-modeling",
      "Paralysis from complexity"
    ],
    "growthOpportunities": [
      "Act on the highest-leverage point now"
    ]
  },
  {
    "slug": "legacy-builder",
    "name": "Legacy Builder",
    "mission": "Create impact that outlives the self.",
    "coreAssumptions": [
      "The best work outlives its maker",
      "We inherit and pass on"
    ],
    "values": [
      "Stewardship",
      "Long-term thinking",
      "Significance"
    ],
    "blindSpots": [
      "Neglecting the present",
      "Legacy obsession"
    ],
    "growthOpportunities": [
      "Balance long arc with present contribution"
    ]
  }
] as const;

async function main() {
  for (const a of ARCHETYPES) {
    await prisma.worldviewArchetype.upsert({
      where: { slug: a.slug },
      update: { name: a.name, mission: a.mission, coreAssumptions: [...a.coreAssumptions], values: [...a.values], blindSpots: [...a.blindSpots], growthOpportunities: [...a.growthOpportunities] },
      create: { slug: a.slug, name: a.name, mission: a.mission, coreAssumptions: [...a.coreAssumptions], values: [...a.values], blindSpots: [...a.blindSpots], growthOpportunities: [...a.growthOpportunities] },
    });
  }
  console.log(`Seeded ${ARCHETYPES.length} worldview archetypes.`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
