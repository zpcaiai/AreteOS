// MISSION OS — Identity Library seed. 10 families, 55 archetypes with full blueprints.
// Idempotent: upsert family by slug, upsert archetype by slug. Run via `npm run db:seed`.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FAMILIES = [
  {
    "slug": "truth-seekers",
    "name": "Truth Seekers",
    "purpose": "Understand reality",
    "archetypes": [
      {
        "name": "Researcher",
        "slug": "researcher",
        "mission": "Seek truth through disciplined inquiry.",
        "identityStatement": "I seek truth through disciplined inquiry.",
        "values": [
          "Truth",
          "Curiosity",
          "Rigor",
          "Humility",
          "Learning"
        ],
        "beliefs": [
          "Reality can be understood",
          "Evidence matters",
          "Questions are valuable"
        ],
        "mentalModels": [
          "Scientific method",
          "Bayesian thinking",
          "First principles",
          "Systems thinking"
        ],
        "decisionRules": [
          "Evidence before opinion",
          "Seek falsification",
          "Follow curiosity"
        ],
        "habits": [
          "Reading",
          "Writing",
          "Observation",
          "Experimentation",
          "Reflection"
        ],
        "capabilities": [
          "Critical thinking",
          "Analysis",
          "Writing",
          "Experiment design"
        ],
        "shadowPatterns": [
          "Over-analysis",
          "Perfectionism",
          "Isolation",
          "Endless learning, no execution"
        ],
        "failureModes": [
          "Analysis paralysis",
          "Confusing study for progress"
        ],
        "legacyExpression": "A body of verified understanding others build on.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Scientist",
        "slug": "scientist",
        "mission": "Explain nature through testable models.",
        "identityStatement": "I explain nature through testable models.",
        "values": [
          "Truth",
          "Precision",
          "Skepticism",
          "Replicability"
        ],
        "beliefs": [
          "Nature is lawful",
          "Theories must be falsifiable",
          "Measurement reveals reality"
        ],
        "mentalModels": [
          "Hypothesis testing",
          "Controlled experiment",
          "Occam's razor"
        ],
        "decisionRules": [
          "Predict, then test",
          "Prefer the simpler model",
          "Trust data over authority"
        ],
        "habits": [
          "Experimenting",
          "Measuring",
          "Peer review",
          "Documenting"
        ],
        "capabilities": [
          "Modeling",
          "Statistics",
          "Instrumentation"
        ],
        "shadowPatterns": [
          "Reductionism",
          "Dismissing the unmeasurable"
        ],
        "failureModes": [
          "Overfitting",
          "Ignoring anomalies"
        ],
        "legacyExpression": "Laws and methods that outlive the discoverer.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Scholar",
        "slug": "scholar",
        "mission": "Master and steward a body of knowledge.",
        "identityStatement": "I master and preserve deep knowledge.",
        "values": [
          "Depth",
          "Accuracy",
          "Patience",
          "Stewardship"
        ],
        "beliefs": [
          "Knowledge compounds",
          "Sources matter",
          "Context is everything"
        ],
        "mentalModels": [
          "Canonical mapping",
          "Comparative analysis"
        ],
        "decisionRules": [
          "Cite the source",
          "Master the canon before critiquing"
        ],
        "habits": [
          "Deep reading",
          "Note-taking",
          "Synthesis"
        ],
        "capabilities": [
          "Synthesis",
          "Memory",
          "Exposition"
        ],
        "shadowPatterns": [
          "Pedantry",
          "Detachment from practice"
        ],
        "failureModes": [
          "Hoarding knowledge",
          "Never shipping"
        ],
        "legacyExpression": "A preserved and extended canon.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Thinker",
        "slug": "thinker",
        "mission": "Reason clearly about hard problems.",
        "identityStatement": "I reason clearly to see what's true.",
        "values": [
          "Clarity",
          "Independence",
          "Honesty"
        ],
        "beliefs": [
          "Clear thinking is rare and trainable",
          "Most confusion is unexamined assumptions"
        ],
        "mentalModels": [
          "First principles",
          "Inversion",
          "Second-order thinking"
        ],
        "decisionRules": [
          "Define terms first",
          "Steelman the opposite"
        ],
        "habits": [
          "Solitary thinking",
          "Writing to think",
          "Questioning assumptions"
        ],
        "capabilities": [
          "Reasoning",
          "Abstraction",
          "Argument"
        ],
        "shadowPatterns": [
          "Overthinking",
          "Detachment"
        ],
        "failureModes": [
          "Cleverness over usefulness"
        ],
        "legacyExpression": "Frameworks that sharpen how others think.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Philosopher",
        "slug": "philosopher",
        "mission": "Examine meaning, ethics and existence.",
        "identityStatement": "I examine how we should live and what is true.",
        "values": [
          "Wisdom",
          "Truth",
          "Integrity",
          "Wonder"
        ],
        "beliefs": [
          "The examined life is worth living",
          "Questions outlast answers"
        ],
        "mentalModels": [
          "Dialectic",
          "Thought experiments",
          "Ethical frameworks"
        ],
        "decisionRules": [
          "Question the foundations",
          "Live the conclusions"
        ],
        "habits": [
          "Reflection",
          "Dialogue",
          "Reading primary texts"
        ],
        "capabilities": [
          "Conceptual analysis",
          "Ethical reasoning"
        ],
        "shadowPatterns": [
          "Abstraction without action",
          "Endless relativizing"
        ],
        "failureModes": [
          "Ungrounded speculation"
        ],
        "legacyExpression": "Ideas that reshape how a culture sees itself.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Systems Thinker",
        "slug": "systems-thinker",
        "mission": "See wholes, relationships and feedback.",
        "identityStatement": "I see the system, not just the parts.",
        "values": [
          "Holism",
          "Patience",
          "Leverage"
        ],
        "beliefs": [
          "Everything is connected",
          "Structure drives behavior",
          "Leverage points are non-obvious"
        ],
        "mentalModels": [
          "Feedback loops",
          "Stocks and flows",
          "Leverage points"
        ],
        "decisionRules": [
          "Find the constraint",
          "Trace the loop before acting"
        ],
        "habits": [
          "Mapping systems",
          "Looking for feedback",
          "Modeling"
        ],
        "capabilities": [
          "Modeling",
          "Pattern recognition",
          "Synthesis"
        ],
        "shadowPatterns": [
          "Over-modeling",
          "Paralysis from complexity"
        ],
        "failureModes": [
          "Ignoring the human element"
        ],
        "legacyExpression": "Interventions that shift whole systems.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Strategist",
        "slug": "strategist",
        "mission": "Win by choosing where and how to compete.",
        "identityStatement": "I create advantage through positioning and timing.",
        "values": [
          "Foresight",
          "Discipline",
          "Focus"
        ],
        "beliefs": [
          "Position beats effort",
          "Most battles are won before they're fought"
        ],
        "mentalModels": [
          "Game theory",
          "SWOT",
          "OODA loop",
          "Asymmetry"
        ],
        "decisionRules": [
          "Concentrate force",
          "Choose the terrain",
          "Preserve optionality"
        ],
        "habits": [
          "Scenario planning",
          "War-gaming",
          "Reviewing outcomes"
        ],
        "capabilities": [
          "Analysis",
          "Foresight",
          "Decision-making"
        ],
        "shadowPatterns": [
          "Over-planning",
          "Cynicism"
        ],
        "failureModes": [
          "Analysis without action",
          "Rigid plans"
        ],
        "legacyExpression": "Strategic doctrine others adopt.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Historian",
        "slug": "historian",
        "mission": "Learn from the patterns of the past.",
        "identityStatement": "I read the past to understand the present.",
        "values": [
          "Truth",
          "Context",
          "Memory"
        ],
        "beliefs": [
          "History rhymes",
          "Context explains behavior",
          "Memory prevents repetition"
        ],
        "mentalModels": [
          "Cyclical patterns",
          "Counterfactuals",
          "Path dependence"
        ],
        "decisionRules": [
          "Check the precedent",
          "Distrust the present's certainties"
        ],
        "habits": [
          "Archival reading",
          "Synthesis",
          "Narrative writing"
        ],
        "capabilities": [
          "Research",
          "Synthesis",
          "Narrative"
        ],
        "shadowPatterns": [
          "Determinism",
          "Nostalgia"
        ],
        "failureModes": [
          "Cherry-picking the past"
        ],
        "legacyExpression": "An institutional memory that guides the future.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Futurist",
        "slug": "futurist",
        "mission": "Anticipate what is becoming.",
        "identityStatement": "I see the trends shaping what's next.",
        "values": [
          "Foresight",
          "Openness",
          "Curiosity"
        ],
        "beliefs": [
          "The future is forecastable in probability",
          "Weak signals precede big shifts"
        ],
        "mentalModels": [
          "Trend extrapolation",
          "Scenario planning",
          "S-curves"
        ],
        "decisionRules": [
          "Track the second-order effects",
          "Bet on the inevitable, time the contingent"
        ],
        "habits": [
          "Signal scanning",
          "Scenario writing",
          "Forecasting"
        ],
        "capabilities": [
          "Forecasting",
          "Synthesis",
          "Imagination"
        ],
        "shadowPatterns": [
          "Hype-chasing",
          "Overconfidence"
        ],
        "failureModes": [
          "Mistaking possible for probable"
        ],
        "legacyExpression": "Foresight that shapes today's decisions.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  },
  {
    "slug": "creators",
    "name": "Creators",
    "purpose": "Create new realities",
    "archetypes": [
      {
        "name": "Creator",
        "slug": "creator",
        "mission": "Bring new things into being.",
        "identityStatement": "I bring new things into the world.",
        "values": [
          "Originality",
          "Courage",
          "Expression"
        ],
        "beliefs": [
          "Creation is a discipline",
          "Taste can be developed"
        ],
        "mentalModels": [
          "Divergent-convergent",
          "Combinatory play"
        ],
        "decisionRules": [
          "Make first, judge later",
          "Finish and ship"
        ],
        "habits": [
          "Daily making",
          "Collecting inspiration",
          "Iterating"
        ],
        "capabilities": [
          "Ideation",
          "Craft",
          "Execution"
        ],
        "shadowPatterns": [
          "Self-doubt",
          "Comparison",
          "Perfectionism"
        ],
        "failureModes": [
          "Never finishing",
          "Imitation"
        ],
        "legacyExpression": "A body of work that inspires more creation.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Inventor",
        "slug": "inventor",
        "mission": "Solve problems with novel mechanisms.",
        "identityStatement": "I invent what doesn't yet exist.",
        "values": [
          "Ingenuity",
          "Persistence",
          "Curiosity"
        ],
        "beliefs": [
          "Constraints breed invention",
          "Most things can be redesigned"
        ],
        "mentalModels": [
          "First principles",
          "Analogical transfer",
          "TRIZ"
        ],
        "decisionRules": [
          "Prototype the riskiest part first",
          "Fail cheap and fast"
        ],
        "habits": [
          "Tinkering",
          "Prototyping",
          "Reading widely"
        ],
        "capabilities": [
          "Problem-solving",
          "Prototyping",
          "Synthesis"
        ],
        "shadowPatterns": [
          "Tinkering without shipping",
          "Lone-genius syndrome"
        ],
        "failureModes": [
          "Solution in search of a problem"
        ],
        "legacyExpression": "Inventions that become infrastructure.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Designer",
        "slug": "designer",
        "mission": "Shape how things work and feel.",
        "identityStatement": "I design experiences that work and delight.",
        "values": [
          "Empathy",
          "Clarity",
          "Craft"
        ],
        "beliefs": [
          "Form follows function and feeling",
          "Details are not details"
        ],
        "mentalModels": [
          "User-centered design",
          "Affordances",
          "Subtraction"
        ],
        "decisionRules": [
          "Start from the user's experience",
          "Remove until essential"
        ],
        "habits": [
          "Sketching",
          "Prototyping",
          "User testing"
        ],
        "capabilities": [
          "Empathy",
          "Visual thinking",
          "Iteration"
        ],
        "shadowPatterns": [
          "Over-polishing",
          "Aesthetics over function"
        ],
        "failureModes": [
          "Designing for self, not user"
        ],
        "legacyExpression": "Designs that quietly raise the standard.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Innovator",
        "slug": "innovator",
        "mission": "Turn novelty into adopted value.",
        "identityStatement": "I turn new ideas into things people use.",
        "values": [
          "Novelty",
          "Pragmatism",
          "Impact"
        ],
        "beliefs": [
          "Innovation = invention × adoption",
          "Timing is decisive"
        ],
        "mentalModels": [
          "Diffusion of innovation",
          "Jobs-to-be-done",
          "Crossing the chasm"
        ],
        "decisionRules": [
          "Validate demand early",
          "Reduce adoption friction"
        ],
        "habits": [
          "Experimenting",
          "Talking to users",
          "Iterating"
        ],
        "capabilities": [
          "Synthesis",
          "Experimentation",
          "Persuasion"
        ],
        "shadowPatterns": [
          "Novelty for its own sake"
        ],
        "failureModes": [
          "Ignoring distribution"
        ],
        "legacyExpression": "Innovations that change a category.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Artist",
        "slug": "artist",
        "mission": "Express truth through form.",
        "identityStatement": "I express what words can't say.",
        "values": [
          "Authenticity",
          "Beauty",
          "Courage"
        ],
        "beliefs": [
          "Art reveals truth",
          "Vulnerability is strength"
        ],
        "mentalModels": [
          "Emotional resonance",
          "Constraint as freedom"
        ],
        "decisionRules": [
          "Serve the work, not the ego",
          "Show, don't tell"
        ],
        "habits": [
          "Daily practice",
          "Studying masters",
          "Experimenting"
        ],
        "capabilities": [
          "Craft",
          "Perception",
          "Expression"
        ],
        "shadowPatterns": [
          "Self-indulgence",
          "Fragile ego"
        ],
        "failureModes": [
          "Chasing approval",
          "Never finishing"
        ],
        "legacyExpression": "Work that moves people for generations.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Storyteller",
        "slug": "storyteller",
        "mission": "Move people through narrative.",
        "identityStatement": "I tell stories that change how people see.",
        "values": [
          "Resonance",
          "Truth",
          "Craft"
        ],
        "beliefs": [
          "Story is how humans think",
          "Specifics carry universals"
        ],
        "mentalModels": [
          "Hero's journey",
          "Show don't tell",
          "Conflict drives story"
        ],
        "decisionRules": [
          "Lead with the human",
          "Earn the emotion"
        ],
        "habits": [
          "Writing",
          "Observing",
          "Editing"
        ],
        "capabilities": [
          "Narrative",
          "Empathy",
          "Communication"
        ],
        "shadowPatterns": [
          "Manipulation",
          "Style over substance"
        ],
        "failureModes": [
          "Vague abstraction",
          "No stakes"
        ],
        "legacyExpression": "Stories that outlive their teller.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Visionary",
        "slug": "visionary",
        "mission": "See and articulate a compelling future.",
        "identityStatement": "I see a future others can't yet picture.",
        "values": [
          "Imagination",
          "Conviction",
          "Hope"
        ],
        "beliefs": [
          "The future is built by those who imagine it",
          "Vision aligns people"
        ],
        "mentalModels": [
          "Backcasting",
          "First principles",
          "Inevitability"
        ],
        "decisionRules": [
          "Hold the vision, flex the path",
          "Communicate relentlessly"
        ],
        "habits": [
          "Imagining",
          "Articulating",
          "Recruiting believers"
        ],
        "capabilities": [
          "Imagination",
          "Communication",
          "Conviction"
        ],
        "shadowPatterns": [
          "Detachment from reality",
          "Reality distortion"
        ],
        "failureModes": [
          "Vision without execution"
        ],
        "legacyExpression": "A future others make real.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "World Builder",
        "slug": "world-builder",
        "mission": "Construct rich, coherent worlds.",
        "identityStatement": "I build whole worlds others can inhabit.",
        "values": [
          "Coherence",
          "Depth",
          "Imagination"
        ],
        "beliefs": [
          "Worlds need internal logic",
          "Detail creates immersion"
        ],
        "mentalModels": [
          "Systems coherence",
          "Worldbuilding bibles"
        ],
        "decisionRules": [
          "Keep the internal logic consistent",
          "Build depth before breadth"
        ],
        "habits": [
          "Designing systems",
          "Documenting lore",
          "Iterating"
        ],
        "capabilities": [
          "Systems design",
          "Imagination",
          "Consistency"
        ],
        "shadowPatterns": [
          "Over-building, under-shipping"
        ],
        "failureModes": [
          "Detail without story"
        ],
        "legacyExpression": "Worlds others live and create within.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  },
  {
    "slug": "builders",
    "name": "Builders",
    "purpose": "Transform ideas into systems",
    "archetypes": [
      {
        "name": "Builder",
        "slug": "builder",
        "mission": "Turn ideas into working reality.",
        "identityStatement": "I transform ideas into reality.",
        "values": [
          "Craft",
          "Reliability",
          "Pragmatism"
        ],
        "beliefs": [
          "Shipping beats theorizing",
          "Reality is the judge"
        ],
        "mentalModels": [
          "Systems thinking",
          "Constraints theory"
        ],
        "decisionRules": [
          "Bias to a working prototype",
          "Cut scope before quality"
        ],
        "habits": [
          "Daily building",
          "Refactoring",
          "Shipping"
        ],
        "capabilities": [
          "Implementation",
          "Debugging",
          "Sequencing"
        ],
        "shadowPatterns": [
          "Building before deciding what matters"
        ],
        "failureModes": [
          "Polishing the wrong thing"
        ],
        "legacyExpression": "Systems and people that keep building.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Engineer",
        "slug": "engineer",
        "mission": "Make things work reliably at scale.",
        "identityStatement": "I make things work, reliably.",
        "values": [
          "Rigor",
          "Reliability",
          "Efficiency"
        ],
        "beliefs": [
          "Edge cases are the job",
          "Simplicity scales"
        ],
        "mentalModels": [
          "Trade-off analysis",
          "Margin of safety",
          "Abstraction layers"
        ],
        "decisionRules": [
          "Measure before optimizing",
          "Design for failure"
        ],
        "habits": [
          "Testing",
          "Debugging",
          "Documenting"
        ],
        "capabilities": [
          "Problem-solving",
          "Systems design",
          "Debugging"
        ],
        "shadowPatterns": [
          "Over-engineering",
          "Gold-plating"
        ],
        "failureModes": [
          "Premature optimization"
        ],
        "legacyExpression": "Robust systems others depend on.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Architect",
        "slug": "architect",
        "mission": "Design the structure that makes scale possible.",
        "identityStatement": "I design structures that scale.",
        "values": [
          "Foresight",
          "Clarity",
          "Integrity"
        ],
        "beliefs": [
          "Structure determines what's possible",
          "Decisions made early cost the most"
        ],
        "mentalModels": [
          "Systems thinking",
          "Trade-off analysis",
          "Conway's law"
        ],
        "decisionRules": [
          "Optimize for change",
          "Make the right thing easy"
        ],
        "habits": [
          "Diagramming",
          "Reviewing designs",
          "Documenting decisions"
        ],
        "capabilities": [
          "Systems design",
          "Abstraction",
          "Judgment"
        ],
        "shadowPatterns": [
          "Ivory-tower design",
          "Over-abstraction"
        ],
        "failureModes": [
          "Designing for imagined scale"
        ],
        "legacyExpression": "Architectures that outlast their authors.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Operator",
        "slug": "operator",
        "mission": "Run the machine with excellence.",
        "identityStatement": "I make the system run, every day.",
        "values": [
          "Discipline",
          "Reliability",
          "Ownership"
        ],
        "beliefs": [
          "Execution is a skill",
          "Consistency compounds"
        ],
        "mentalModels": [
          "Bottleneck theory",
          "Metrics that matter",
          "Checklists"
        ],
        "decisionRules": [
          "Find and fix the constraint",
          "Measure what you manage"
        ],
        "habits": [
          "Reviewing metrics",
          "Removing blockers",
          "Standardizing"
        ],
        "capabilities": [
          "Execution",
          "Coordination",
          "Prioritization"
        ],
        "shadowPatterns": [
          "Firefighting over fixing",
          "Control obsession"
        ],
        "failureModes": [
          "Activity over outcomes"
        ],
        "legacyExpression": "Operations that run without you.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Craftsman",
        "slug": "craftsman",
        "mission": "Pursue mastery of the work itself.",
        "identityStatement": "I pursue mastery in the work.",
        "values": [
          "Mastery",
          "Care",
          "Patience"
        ],
        "beliefs": [
          "Quality is its own reward",
          "Mastery takes a decade"
        ],
        "mentalModels": [
          "Deliberate practice",
          "Kaizen"
        ],
        "decisionRules": [
          "Sweat the unseen details",
          "Never ship below your bar"
        ],
        "habits": [
          "Deliberate practice",
          "Refining",
          "Studying the craft"
        ],
        "capabilities": [
          "Skill",
          "Attention",
          "Taste"
        ],
        "shadowPatterns": [
          "Perfectionism",
          "Slowness"
        ],
        "failureModes": [
          "Polish over delivery"
        ],
        "legacyExpression": "A standard of craft others aspire to.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "System Designer",
        "slug": "system-designer",
        "mission": "Design how parts coordinate into a whole.",
        "identityStatement": "I design how the parts work together.",
        "values": [
          "Coherence",
          "Leverage",
          "Clarity"
        ],
        "beliefs": [
          "The interfaces are the system",
          "Coordination is the hidden cost"
        ],
        "mentalModels": [
          "Systems thinking",
          "Modularity",
          "Feedback loops"
        ],
        "decisionRules": [
          "Minimize coupling",
          "Design the seams"
        ],
        "habits": [
          "Mapping flows",
          "Defining interfaces",
          "Reviewing"
        ],
        "capabilities": [
          "Systems design",
          "Abstraction",
          "Synthesis"
        ],
        "shadowPatterns": [
          "Complexity creep"
        ],
        "failureModes": [
          "Designing parts, ignoring the whole"
        ],
        "legacyExpression": "Designs that let many people build together.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  },
  {
    "slug": "entrepreneurs",
    "name": "Entrepreneurs",
    "purpose": "Create value",
    "archetypes": [
      {
        "name": "Entrepreneur",
        "slug": "entrepreneur",
        "mission": "Create value by solving meaningful problems.",
        "identityStatement": "I create value by solving meaningful problems.",
        "values": [
          "Initiative",
          "Resilience",
          "Customer obsession"
        ],
        "beliefs": [
          "Value created beats credentials",
          "Speed and learning win"
        ],
        "mentalModels": [
          "Lean startup",
          "Jobs-to-be-done",
          "Asymmetric bets"
        ],
        "decisionRules": [
          "Talk to customers",
          "Test the riskiest assumption first"
        ],
        "habits": [
          "Selling",
          "Building",
          "Learning fast"
        ],
        "capabilities": [
          "Selling",
          "Execution",
          "Adaptability"
        ],
        "shadowPatterns": [
          "Chasing opportunities",
          "Lack of focus",
          "Overconfidence"
        ],
        "failureModes": [
          "Scaling before product-market fit"
        ],
        "legacyExpression": "Enterprises that solve real problems at scale.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Founder",
        "slug": "founder",
        "mission": "Will a new thing into existence.",
        "identityStatement": "I build something from nothing.",
        "values": [
          "Conviction",
          "Resourcefulness",
          "Ownership"
        ],
        "beliefs": [
          "Default alive",
          "Recruiting is the job",
          "Culture is set early"
        ],
        "mentalModels": [
          "First principles",
          "Default-alive math",
          "Hiring for slope"
        ],
        "decisionRules": [
          "Do things that don't scale (first)",
          "Protect runway"
        ],
        "habits": [
          "Recruiting",
          "Selling",
          "Deciding fast"
        ],
        "capabilities": [
          "Vision",
          "Recruiting",
          "Resilience"
        ],
        "shadowPatterns": [
          "Founder dependency",
          "Hero complex"
        ],
        "failureModes": [
          "Not delegating",
          "Burning out the team"
        ],
        "legacyExpression": "A durable company with its own life.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Business Builder",
        "slug": "business-builder",
        "mission": "Turn a product into a durable business.",
        "identityStatement": "I build the engine that makes value repeatable.",
        "values": [
          "Pragmatism",
          "Discipline",
          "Growth"
        ],
        "beliefs": [
          "A business is a repeatable system",
          "Unit economics decide survival"
        ],
        "mentalModels": [
          "Unit economics",
          "Flywheels",
          "Channel-market fit"
        ],
        "decisionRules": [
          "Make the economics work first",
          "Build repeatable motions"
        ],
        "habits": [
          "Reviewing metrics",
          "Building process",
          "Hiring"
        ],
        "capabilities": [
          "Systems",
          "Sales",
          "Operations"
        ],
        "shadowPatterns": [
          "Process over product",
          "Premature scaling"
        ],
        "failureModes": [
          "Ignoring margins"
        ],
        "legacyExpression": "A self-sustaining business machine.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Market Creator",
        "slug": "market-creator",
        "mission": "Bring a new market into being.",
        "identityStatement": "I create markets that didn't exist.",
        "values": [
          "Vision",
          "Education",
          "Boldness"
        ],
        "beliefs": [
          "Demand can be created",
          "Category ownership is durable"
        ],
        "mentalModels": [
          "Category design",
          "Crossing the chasm",
          "Demand creation"
        ],
        "decisionRules": [
          "Frame the category",
          "Educate before selling"
        ],
        "habits": [
          "Evangelizing",
          "Educating",
          "Iterating"
        ],
        "capabilities": [
          "Vision",
          "Persuasion",
          "Timing"
        ],
        "shadowPatterns": [
          "Too early",
          "Educating competitors"
        ],
        "failureModes": [
          "Building demand others capture"
        ],
        "legacyExpression": "A new category others compete within.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Opportunity Finder",
        "slug": "opportunity-finder",
        "mission": "See value others miss.",
        "identityStatement": "I see opportunity where others see noise.",
        "values": [
          "Curiosity",
          "Alertness",
          "Decisiveness"
        ],
        "beliefs": [
          "Opportunity hides in friction",
          "Timing beats brilliance"
        ],
        "mentalModels": [
          "Arbitrage",
          "Asymmetry",
          "Pattern recognition"
        ],
        "decisionRules": [
          "Act on conviction with bounded risk",
          "Move when the window opens"
        ],
        "habits": [
          "Scanning",
          "Networking",
          "Testing fast"
        ],
        "capabilities": [
          "Pattern recognition",
          "Networks",
          "Speed"
        ],
        "shadowPatterns": [
          "Shiny-object chasing",
          "No follow-through"
        ],
        "failureModes": [
          "Spreading too thin"
        ],
        "legacyExpression": "A track record of bets that compounded.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  },
  {
    "slug": "investors",
    "name": "Investors",
    "purpose": "Allocate resources wisely",
    "archetypes": [
      {
        "name": "Investor",
        "slug": "investor",
        "mission": "Allocate capital to its highest use.",
        "identityStatement": "I allocate resources to their highest use.",
        "values": [
          "Rationality",
          "Patience",
          "Discipline"
        ],
        "beliefs": [
          "What you pay and what you get are different things",
          "Most of the time, do nothing"
        ],
        "mentalModels": [
          "Margin of safety",
          "Circle of competence",
          "Expected value"
        ],
        "decisionRules": [
          "Buy with a margin of safety",
          "Stay in your circle of competence"
        ],
        "habits": [
          "Reading",
          "Valuing",
          "Waiting"
        ],
        "capabilities": [
          "Analysis",
          "Judgment",
          "Temperament"
        ],
        "shadowPatterns": [
          "Overtrading",
          "Anchoring",
          "Herd-following"
        ],
        "failureModes": [
          "Acting outside competence",
          "Ignoring base rates"
        ],
        "legacyExpression": "Capital compounded responsibly over decades.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Capital Allocator",
        "slug": "capital-allocator",
        "mission": "Direct resources across a portfolio.",
        "identityStatement": "I direct resources where they compound most.",
        "values": [
          "Discipline",
          "Objectivity",
          "Stewardship"
        ],
        "beliefs": [
          "Allocation is the highest-leverage decision",
          "Opportunity cost is everything"
        ],
        "mentalModels": [
          "Opportunity cost",
          "Portfolio theory",
          "Kelly criterion"
        ],
        "decisionRules": [
          "Compare every use against the best alternative",
          "Size to conviction and risk"
        ],
        "habits": [
          "Reviewing the portfolio",
          "Reallocating",
          "Cutting losers"
        ],
        "capabilities": [
          "Judgment",
          "Quantitative analysis",
          "Detachment"
        ],
        "shadowPatterns": [
          "Loss aversion",
          "Sunk-cost holding"
        ],
        "failureModes": [
          "Diworsification"
        ],
        "legacyExpression": "A portfolio that compounds across cycles.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Compounder",
        "slug": "compounder",
        "mission": "Win through patience and compounding.",
        "identityStatement": "I let time and compounding do the work.",
        "values": [
          "Patience",
          "Consistency",
          "Long-term thinking"
        ],
        "beliefs": [
          "Compounding is the eighth wonder",
          "Time in beats timing"
        ],
        "mentalModels": [
          "Compounding",
          "Base rates",
          "Time horizons"
        ],
        "decisionRules": [
          "Hold quality, avoid interruption",
          "Reinvest relentlessly"
        ],
        "habits": [
          "Holding",
          "Reinvesting",
          "Ignoring noise"
        ],
        "capabilities": [
          "Temperament",
          "Patience",
          "Selection"
        ],
        "shadowPatterns": [
          "Impatience",
          "Tinkering"
        ],
        "failureModes": [
          "Interrupting compounding"
        ],
        "legacyExpression": "Quiet, durable, compounding outcomes.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Risk Manager",
        "slug": "risk-manager",
        "mission": "Protect the downside so the upside survives.",
        "identityStatement": "I keep us alive to win over time.",
        "values": [
          "Prudence",
          "Vigilance",
          "Realism"
        ],
        "beliefs": [
          "Survival first",
          "Tail risks dominate outcomes"
        ],
        "mentalModels": [
          "Margin of safety",
          "Antifragility",
          "Barbell strategy"
        ],
        "decisionRules": [
          "Avoid ruin at all costs",
          "Cap downside, keep upside open"
        ],
        "habits": [
          "Stress-testing",
          "Hedging",
          "Pre-mortems"
        ],
        "capabilities": [
          "Risk analysis",
          "Discipline",
          "Foresight"
        ],
        "shadowPatterns": [
          "Over-caution",
          "Missing upside"
        ],
        "failureModes": [
          "Hidden leverage",
          "Ignoring correlations"
        ],
        "legacyExpression": "An organization that survives every shock.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  },
  {
    "slug": "leaders",
    "name": "Leaders",
    "purpose": "Develop and influence people",
    "archetypes": [
      {
        "name": "Leader",
        "slug": "leader",
        "mission": "Develop people and multiply impact.",
        "identityStatement": "I develop people and multiply impact.",
        "values": [
          "Service",
          "Integrity",
          "Vision"
        ],
        "beliefs": [
          "Leadership is multiplication",
          "People grow when trusted"
        ],
        "mentalModels": [
          "Logical levels",
          "Situational leadership",
          "Leverage"
        ],
        "decisionRules": [
          "Develop, don't control",
          "Push decisions down"
        ],
        "habits": [
          "Coaching",
          "Communicating vision",
          "Removing blockers"
        ],
        "capabilities": [
          "Communication",
          "Influence",
          "Development"
        ],
        "shadowPatterns": [
          "Micromanaging",
          "Hero complex"
        ],
        "failureModes": [
          "Being the bottleneck"
        ],
        "legacyExpression": "Leaders who lead without you.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Executive",
        "slug": "executive",
        "mission": "Turn strategy into organizational results.",
        "identityStatement": "I convert strategy into results.",
        "values": [
          "Accountability",
          "Focus",
          "Decisiveness"
        ],
        "beliefs": [
          "Results live outside the org",
          "Focus on the vital few"
        ],
        "mentalModels": [
          "Prioritization",
          "OKRs",
          "Decision rights"
        ],
        "decisionRules": [
          "Concentrate on the vital few",
          "Decide and own it"
        ],
        "habits": [
          "Reviewing results",
          "Prioritizing",
          "Communicating"
        ],
        "capabilities": [
          "Execution",
          "Judgment",
          "Communication"
        ],
        "shadowPatterns": [
          "Activity over results",
          "Politics"
        ],
        "failureModes": [
          "Diluted focus"
        ],
        "legacyExpression": "An organization that executes reliably.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Culture Builder",
        "slug": "culture-builder",
        "mission": "Shape the values people live by.",
        "identityStatement": "I build the culture people thrive in.",
        "values": [
          "Authenticity",
          "Consistency",
          "Care"
        ],
        "beliefs": [
          "Culture is what you tolerate",
          "You get the behavior you reward"
        ],
        "mentalModels": [
          "Reinforcement",
          "Rituals",
          "Norm-setting"
        ],
        "decisionRules": [
          "Reward the behavior you want",
          "Tell stories that carry values"
        ],
        "habits": [
          "Modeling values",
          "Recognizing behavior",
          "Ritual-keeping"
        ],
        "capabilities": [
          "Influence",
          "Storytelling",
          "Consistency"
        ],
        "shadowPatterns": [
          "Saying vs doing gap"
        ],
        "failureModes": [
          "Tolerating value violations"
        ],
        "legacyExpression": "A culture that replicates excellence.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Visionary Leader",
        "slug": "visionary-leader",
        "mission": "Align people around a shared future.",
        "identityStatement": "I align people around a future worth building.",
        "values": [
          "Vision",
          "Inspiration",
          "Conviction"
        ],
        "beliefs": [
          "Shared vision creates alignment",
          "Meaning motivates"
        ],
        "mentalModels": [
          "Backcasting",
          "Narrative alignment"
        ],
        "decisionRules": [
          "Communicate the why relentlessly",
          "Connect work to mission"
        ],
        "habits": [
          "Casting vision",
          "Recruiting believers",
          "Reinforcing meaning"
        ],
        "capabilities": [
          "Communication",
          "Inspiration",
          "Strategy"
        ],
        "shadowPatterns": [
          "Vision without grounding"
        ],
        "failureModes": [
          "Inspiration without execution"
        ],
        "legacyExpression": "A movement that outlives its founder.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Awakener",
        "slug": "awakener",
        "mission": "Move people from task to purpose.",
        "identityStatement": "I help people connect to their larger purpose.",
        "values": [
          "Meaning",
          "Service",
          "Belief in others"
        ],
        "beliefs": [
          "People rise to who they're seen as",
          "Purpose unlocks energy"
        ],
        "mentalModels": [
          "Logical levels",
          "Identity sponsorship"
        ],
        "decisionRules": [
          "Speak to identity, not just behavior",
          "Connect work to mission"
        ],
        "habits": [
          "Sponsoring identity",
          "Asking deeper questions",
          "Recognizing potential"
        ],
        "capabilities": [
          "Empathy",
          "Inspiration",
          "Insight"
        ],
        "shadowPatterns": [
          "Inspiration without structure"
        ],
        "failureModes": [
          "Manipulating meaning"
        ],
        "legacyExpression": "People who found their purpose through you.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  },
  {
    "slug": "teachers",
    "name": "Teachers",
    "purpose": "Develop others",
    "archetypes": [
      {
        "name": "Teacher",
        "slug": "teacher",
        "mission": "Grow understanding in others.",
        "identityStatement": "I help others understand.",
        "values": [
          "Clarity",
          "Patience",
          "Generosity"
        ],
        "beliefs": [
          "Anyone can learn with the right scaffold",
          "Teaching deepens understanding"
        ],
        "mentalModels": [
          "Scaffolding",
          "Feynman technique",
          "Zone of proximal development"
        ],
        "decisionRules": [
          "Meet the learner where they are",
          "Explain simply or you don't understand it"
        ],
        "habits": [
          "Explaining",
          "Designing lessons",
          "Giving feedback"
        ],
        "capabilities": [
          "Explanation",
          "Empathy",
          "Curriculum design"
        ],
        "shadowPatterns": [
          "Talking down",
          "Over-explaining"
        ],
        "failureModes": [
          "Teaching content, not learners"
        ],
        "legacyExpression": "Generations who learned to think.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Mentor",
        "slug": "mentor",
        "mission": "Help others grow beyond me.",
        "identityStatement": "I help others grow beyond me.",
        "values": [
          "Generosity",
          "Wisdom",
          "Humility"
        ],
        "beliefs": [
          "Growth is the goal",
          "The mentee surpasses the mentor"
        ],
        "mentalModels": [
          "Apprenticeship",
          "Socratic questioning"
        ],
        "decisionRules": [
          "Ask before advising",
          "Give the lesson, not the answer"
        ],
        "habits": [
          "Listening",
          "Questioning",
          "Sponsoring"
        ],
        "capabilities": [
          "Empathy",
          "Judgment",
          "Communication"
        ],
        "shadowPatterns": [
          "Creating dependency",
          "Living through others"
        ],
        "failureModes": [
          "Advice-giving without listening"
        ],
        "legacyExpression": "People who exceed you and pay it forward.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Coach",
        "slug": "coach",
        "mission": "Unlock performance through practice and feedback.",
        "identityStatement": "I unlock people's performance.",
        "values": [
          "Growth",
          "Accountability",
          "Belief"
        ],
        "beliefs": [
          "People have the answers",
          "Feedback drives improvement"
        ],
        "mentalModels": [
          "GROW model",
          "Deliberate practice",
          "Feedback loops"
        ],
        "decisionRules": [
          "Ask powerful questions",
          "Hold the standard with care"
        ],
        "habits": [
          "Observing",
          "Questioning",
          "Giving feedback"
        ],
        "capabilities": [
          "Active listening",
          "Feedback",
          "Motivation"
        ],
        "shadowPatterns": [
          "Over-directing",
          "Rescuing"
        ],
        "failureModes": [
          "Coaching without accountability"
        ],
        "legacyExpression": "Performers who internalized the standard.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Guide",
        "slug": "guide",
        "mission": "Help others navigate the path.",
        "identityStatement": "I help others find their way.",
        "values": [
          "Service",
          "Patience",
          "Presence"
        ],
        "beliefs": [
          "The traveler walks; the guide points",
          "Trust is earned by presence"
        ],
        "mentalModels": [
          "Stage-appropriate support",
          "Maps and terrain"
        ],
        "decisionRules": [
          "Point the way, don't carry them",
          "Match support to the stage"
        ],
        "habits": [
          "Listening",
          "Orienting",
          "Encouraging"
        ],
        "capabilities": [
          "Empathy",
          "Orientation",
          "Communication"
        ],
        "shadowPatterns": [
          "Over-directing",
          "Fostering dependence"
        ],
        "failureModes": [
          "Leading instead of guiding"
        ],
        "legacyExpression": "Travelers who reached their destination.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Advisor",
        "slug": "advisor",
        "mission": "Improve others' decisions with expertise.",
        "identityStatement": "I improve decisions with hard-won expertise.",
        "values": [
          "Honesty",
          "Judgment",
          "Discretion"
        ],
        "beliefs": [
          "Good counsel is rare",
          "The decision stays with the decider"
        ],
        "mentalModels": [
          "Decision frameworks",
          "Pre-mortems",
          "Base rates"
        ],
        "decisionRules": [
          "Advise, don't decide",
          "Tell the hard truth kindly"
        ],
        "habits": [
          "Listening",
          "Framing options",
          "Following up"
        ],
        "capabilities": [
          "Judgment",
          "Communication",
          "Domain expertise"
        ],
        "shadowPatterns": [
          "Overstepping",
          "People-pleasing"
        ],
        "failureModes": [
          "Telling people what they want to hear"
        ],
        "legacyExpression": "Better decisions made by those you served.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  },
  {
    "slug": "protectors",
    "name": "Protectors",
    "purpose": "Preserve what matters",
    "archetypes": [
      {
        "name": "Guardian",
        "slug": "guardian",
        "mission": "Protect people and what they value.",
        "identityStatement": "I protect what matters.",
        "values": [
          "Duty",
          "Courage",
          "Vigilance"
        ],
        "beliefs": [
          "Some things must be defended",
          "Prevention beats cure"
        ],
        "mentalModels": [
          "Threat modeling",
          "Defense in depth"
        ],
        "decisionRules": [
          "Protect the vulnerable",
          "Anticipate the threat"
        ],
        "habits": [
          "Watching",
          "Preparing",
          "Defending"
        ],
        "capabilities": [
          "Vigilance",
          "Courage",
          "Preparedness"
        ],
        "shadowPatterns": [
          "Over-protection",
          "Paranoia"
        ],
        "failureModes": [
          "Defending the wrong thing"
        ],
        "legacyExpression": "Things and people kept safe across time.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Steward",
        "slug": "steward",
        "mission": "Care for resources held in trust.",
        "identityStatement": "I care for what's entrusted to me.",
        "values": [
          "Responsibility",
          "Humility",
          "Long-term thinking"
        ],
        "beliefs": [
          "We inherit and pass on",
          "Ownership is temporary"
        ],
        "mentalModels": [
          "Sustainability",
          "Total cost of ownership"
        ],
        "decisionRules": [
          "Leave it better than you found it",
          "Act for the next generation"
        ],
        "habits": [
          "Maintaining",
          "Conserving",
          "Planning ahead"
        ],
        "capabilities": [
          "Care",
          "Planning",
          "Discipline"
        ],
        "shadowPatterns": [
          "Over-conservatism",
          "Hoarding"
        ],
        "failureModes": [
          "Neglecting renewal"
        ],
        "legacyExpression": "Resources passed on healthier than received.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Quality Keeper",
        "slug": "quality-keeper",
        "mission": "Hold the standard of excellence.",
        "identityStatement": "I hold the line on quality.",
        "values": [
          "Excellence",
          "Integrity",
          "Consistency"
        ],
        "beliefs": [
          "Quality is non-negotiable",
          "Standards drift without a keeper"
        ],
        "mentalModels": [
          "Checklists",
          "Root-cause analysis",
          "Standards"
        ],
        "decisionRules": [
          "Never ship below the bar",
          "Fix the cause, not the symptom"
        ],
        "habits": [
          "Reviewing",
          "Testing",
          "Setting standards"
        ],
        "capabilities": [
          "Attention",
          "Judgment",
          "Rigor"
        ],
        "shadowPatterns": [
          "Perfectionism",
          "Bottlenecking"
        ],
        "failureModes": [
          "Process over outcome"
        ],
        "legacyExpression": "A standard that holds after you leave.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Risk Guardian",
        "slug": "risk-guardian",
        "mission": "Keep the organization out of ruin.",
        "identityStatement": "I keep us out of ruin.",
        "values": [
          "Prudence",
          "Vigilance",
          "Independence"
        ],
        "beliefs": [
          "Survival enables everything else",
          "The unlikely happens eventually"
        ],
        "mentalModels": [
          "Tail risk",
          "Margin of safety",
          "Red-teaming"
        ],
        "decisionRules": [
          "Avoid ruin first",
          "Question the consensus"
        ],
        "habits": [
          "Stress-testing",
          "Auditing",
          "Pre-mortems"
        ],
        "capabilities": [
          "Risk analysis",
          "Skepticism",
          "Foresight"
        ],
        "shadowPatterns": [
          "Excess caution",
          "Crying wolf"
        ],
        "failureModes": [
          "Missing the upside entirely"
        ],
        "legacyExpression": "An organization that never blew up.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Ethics Guardian",
        "slug": "ethics-guardian",
        "mission": "Keep actions aligned with what's right.",
        "identityStatement": "I keep us honest and good.",
        "values": [
          "Integrity",
          "Courage",
          "Fairness"
        ],
        "beliefs": [
          "The ends don't justify all means",
          "Trust is the real asset"
        ],
        "mentalModels": [
          "Ethical frameworks",
          "Stakeholder analysis"
        ],
        "decisionRules": [
          "Do right even when costly",
          "Surface the uncomfortable question"
        ],
        "habits": [
          "Questioning",
          "Speaking up",
          "Auditing"
        ],
        "capabilities": [
          "Moral reasoning",
          "Courage",
          "Judgment"
        ],
        "shadowPatterns": [
          "Self-righteousness",
          "Rigidity"
        ],
        "failureModes": [
          "Moralizing without nuance"
        ],
        "legacyExpression": "An organization that stayed worthy of trust.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  },
  {
    "slug": "transformers",
    "name": "Transformers",
    "purpose": "Create meaningful change",
    "archetypes": [
      {
        "name": "Change Agent",
        "slug": "change-agent",
        "mission": "Drive change through systems and people.",
        "identityStatement": "I make change happen.",
        "values": [
          "Courage",
          "Persistence",
          "Empathy"
        ],
        "beliefs": [
          "Change is resisted by default",
          "People change when they own it"
        ],
        "mentalModels": [
          "Change management",
          "Tipping points",
          "Diffusion"
        ],
        "decisionRules": [
          "Start with the willing",
          "Make the new way easier"
        ],
        "habits": [
          "Building coalitions",
          "Piloting",
          "Communicating"
        ],
        "capabilities": [
          "Influence",
          "Persistence",
          "Communication"
        ],
        "shadowPatterns": [
          "Impatience",
          "Steamrolling"
        ],
        "failureModes": [
          "Change without buy-in"
        ],
        "legacyExpression": "Lasting change others sustain.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Reformer",
        "slug": "reformer",
        "mission": "Fix broken systems from within.",
        "identityStatement": "I fix what's broken from within.",
        "values": [
          "Justice",
          "Persistence",
          "Pragmatism"
        ],
        "beliefs": [
          "Broken systems can be fixed",
          "Reform beats revolution where possible"
        ],
        "mentalModels": [
          "Leverage points",
          "Incrementalism",
          "Coalition-building"
        ],
        "decisionRules": [
          "Pick the highest-leverage fix",
          "Build allies before acting"
        ],
        "habits": [
          "Diagnosing",
          "Coalition-building",
          "Iterating"
        ],
        "capabilities": [
          "Analysis",
          "Persuasion",
          "Endurance"
        ],
        "shadowPatterns": [
          "Cynicism",
          "Burnout"
        ],
        "failureModes": [
          "Reform without coalition"
        ],
        "legacyExpression": "Systems that work better for everyone.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Movement Builder",
        "slug": "movement-builder",
        "mission": "Mobilize many toward a cause.",
        "identityStatement": "I mobilize people around a cause.",
        "values": [
          "Conviction",
          "Inclusion",
          "Energy"
        ],
        "beliefs": [
          "Movements need shared identity",
          "Many small acts compound"
        ],
        "mentalModels": [
          "Network effects",
          "Shared identity",
          "Momentum"
        ],
        "decisionRules": [
          "Give people a role",
          "Lower the cost of joining"
        ],
        "habits": [
          "Organizing",
          "Storytelling",
          "Recruiting"
        ],
        "capabilities": [
          "Mobilization",
          "Communication",
          "Energy"
        ],
        "shadowPatterns": [
          "Burnout",
          "Purity spirals"
        ],
        "failureModes": [
          "Movement without structure"
        ],
        "legacyExpression": "A self-sustaining movement.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Social Entrepreneur",
        "slug": "social-entrepreneur",
        "mission": "Solve social problems sustainably.",
        "identityStatement": "I solve social problems with sustainable models.",
        "values": [
          "Compassion",
          "Pragmatism",
          "Sustainability"
        ],
        "beliefs": [
          "Impact must sustain itself",
          "Dignity over charity"
        ],
        "mentalModels": [
          "Social business",
          "Theory of change",
          "Inversion"
        ],
        "decisionRules": [
          "Question the excluding assumption",
          "Make the model self-sustaining"
        ],
        "habits": [
          "Field listening",
          "Prototyping",
          "Measuring impact"
        ],
        "capabilities": [
          "Design",
          "Resourcefulness",
          "Measurement"
        ],
        "shadowPatterns": [
          "Idealism over rigor"
        ],
        "failureModes": [
          "Scaling before sustainability"
        ],
        "legacyExpression": "Self-sustaining solutions to real problems.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  },
  {
    "slug": "legacy-builders",
    "name": "Legacy Builders",
    "purpose": "Create impact beyond self",
    "archetypes": [
      {
        "name": "Institution Builder",
        "slug": "institution-builder",
        "mission": "Build organizations that outlast individuals.",
        "identityStatement": "I build institutions that outlast me.",
        "values": [
          "Durability",
          "Stewardship",
          "Vision"
        ],
        "beliefs": [
          "Institutions outlive people",
          "Design beats heroics"
        ],
        "mentalModels": [
          "Institutional design",
          "Succession",
          "Self-governance"
        ],
        "decisionRules": [
          "Build for succession from day one",
          "Encode values into structure"
        ],
        "habits": [
          "Designing governance",
          "Developing successors",
          "Documenting"
        ],
        "capabilities": [
          "Systems design",
          "Leadership",
          "Patience"
        ],
        "shadowPatterns": [
          "Founder dependency",
          "Empire-building"
        ],
        "failureModes": [
          "No succession plan"
        ],
        "legacyExpression": "An institution that thrives without you.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Legacy Builder",
        "slug": "legacy-builder",
        "mission": "Create impact that outlives me.",
        "identityStatement": "I create impact beyond my lifetime.",
        "values": [
          "Significance",
          "Stewardship",
          "Long-term thinking"
        ],
        "beliefs": [
          "The best work outlives its maker",
          "Plant trees you won't sit under"
        ],
        "mentalModels": [
          "Long time horizons",
          "Compounding impact"
        ],
        "decisionRules": [
          "Optimize for the long arc",
          "Invest in what compounds after you"
        ],
        "habits": [
          "Long-term planning",
          "Mentoring",
          "Documenting wisdom"
        ],
        "capabilities": [
          "Vision",
          "Patience",
          "Generosity"
        ],
        "shadowPatterns": [
          "Legacy obsession",
          "Neglecting the present"
        ],
        "failureModes": [
          "Building monuments, not value"
        ],
        "legacyExpression": "Impact that compounds for generations.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Knowledge Steward",
        "slug": "knowledge-steward",
        "mission": "Preserve and transmit hard-won knowledge.",
        "identityStatement": "I preserve and pass on what we've learned.",
        "values": [
          "Stewardship",
          "Accuracy",
          "Generosity"
        ],
        "beliefs": [
          "Knowledge lost is the real tragedy",
          "Documentation is an act of care"
        ],
        "mentalModels": [
          "Knowledge management",
          "SECI",
          "Canonical capture"
        ],
        "decisionRules": [
          "Capture tacit knowledge before it walks",
          "Make knowledge findable"
        ],
        "habits": [
          "Documenting",
          "Teaching",
          "Organizing knowledge"
        ],
        "capabilities": [
          "Synthesis",
          "Curation",
          "Communication"
        ],
        "shadowPatterns": [
          "Hoarding",
          "Over-curation"
        ],
        "failureModes": [
          "Knowledge that no one can find"
        ],
        "legacyExpression": "A living body of knowledge others inherit.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      },
      {
        "name": "Civilization Builder",
        "slug": "civilization-builder",
        "mission": "Advance the long arc of human progress.",
        "identityStatement": "I work for the long arc of human progress.",
        "values": [
          "Vision",
          "Responsibility",
          "Hope"
        ],
        "beliefs": [
          "Progress is a choice",
          "We stand on others' shoulders and build the next floor"
        ],
        "mentalModels": [
          "Long-termism",
          "Compounding civilization",
          "Existential priorities"
        ],
        "decisionRules": [
          "Work on what matters most over centuries",
          "Reduce existential risk, expand capability"
        ],
        "habits": [
          "Deep work on hard problems",
          "Building for the long term",
          "Collaborating widely"
        ],
        "capabilities": [
          "Vision",
          "Synthesis",
          "Endurance"
        ],
        "shadowPatterns": [
          "Grandiosity",
          "Neglecting the near"
        ],
        "failureModes": [
          "Abstraction without delivery"
        ],
        "legacyExpression": "A higher floor for everyone who follows.",
        "growthPath": [
          "Discover the identity",
          "Choose it deliberately",
          "Practice its behaviors",
          "Internalize its values",
          "Integrate it with your stack",
          "Master it",
          "Teach it to others",
          "Express it as legacy"
        ]
      }
    ]
  }
] as const;

async function main() {
  let order = 0;
  let count = 0;
  for (const f of FAMILIES) {
    const family = await prisma.identityFamily.upsert({
      where: { slug: f.slug },
      update: { name: f.name, purpose: f.purpose, sortOrder: order },
      create: { slug: f.slug, name: f.name, purpose: f.purpose, sortOrder: order },
    });
    order++;
    for (const a of f.archetypes) {
      await prisma.identityArchetype.upsert({
        where: { slug: a.slug },
        update: {
          name: a.name, familyId: family.id, mission: a.mission, identityStatement: a.identityStatement,
          values: [...a.values], beliefs: [...a.beliefs], mentalModels: [...a.mentalModels], decisionRules: [...a.decisionRules],
          habits: [...a.habits], capabilities: [...a.capabilities], shadowPatterns: [...a.shadowPatterns],
          failureModes: [...a.failureModes], growthPath: [...a.growthPath], legacyExpression: a.legacyExpression,
        },
        create: {
          slug: a.slug, name: a.name, familyId: family.id, mission: a.mission, identityStatement: a.identityStatement,
          values: [...a.values], beliefs: [...a.beliefs], mentalModels: [...a.mentalModels], decisionRules: [...a.decisionRules],
          habits: [...a.habits], capabilities: [...a.capabilities], shadowPatterns: [...a.shadowPatterns],
          failureModes: [...a.failureModes], growthPath: [...a.growthPath], legacyExpression: a.legacyExpression,
        },
      });
      count++;
    }
  }
  console.log(`Seeded ${FAMILIES.length} identity families and ${count} archetypes.`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
