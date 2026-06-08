// MISSION OS — seed the Genius / Role-Model library (Dilts' Strategies of Genius
// + Excellence Reverse Engineering). 20 structured blueprints — modeling HOW each
// produced, not biography. Idempotent: upsert genius by name; create canonical
// strategy if absent, else update its blueprint fields.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Step = { step: number; system: "V" | "A" | "K" | "Ad"; description: string };
interface GeniusSeed {
  name: string; era: string; domain: string; summary: string;
  s: {
    name: string; description: string;
    identity: string; beliefs: string; values: string; capabilities: string;
    highLeverage: string[]; repSequence: Step[];
    tote: { test: string; operate: string; testExit: string; exit: string };
    creativeProcess: string; learningProcess: string; feedbackProcess: string;
    shadowPatterns: string; failureModes: string;
    installProtocol: string[];
  };
}

const G: GeniusSeed[] = [
  {
    name: "Aristotle", era: "384–322 BC", domain: "Philosophy / logic",
    summary: "Built systematic knowledge by defining essences and tracing causes to first principles.",
    s: {
      name: "Chain of First Causes", description: "Define essence, classify, trace the four causes until reaching an irreducible principle.",
      identity: "A systematic seeker of the order of things.", beliefs: "Reality is intelligible; knowledge can be organized.", values: "Truth, logic, classification.", capabilities: "Definition, classification, causal reasoning.",
      highLeverage: ["Belief: reality is intelligible", "Define terms before arguing"],
      repSequence: [{ step: 1, system: "Ad", description: "State precisely what it IS." }, { step: 2, system: "V", description: "Place it in a hierarchy of kinds." }, { step: 3, system: "Ad", description: "Ask the four causes; repeat 'why' to a first principle." }],
      tote: { test: "Reached an irreducible cause?", operate: "Ask 'why' one level deeper.", testExit: "Cause can't be reduced.", exit: "Treat as first principle." },
      creativeProcess: "Build frameworks that organize a whole domain.", learningProcess: "Observe → categorize → abstract → systematize.", feedbackProcess: "Test claims against definitions and logical consistency.",
      shadowPatterns: "Over-categorization; mistaking the map for the territory.", failureModes: "Premature systems built on untested premises.",
      installProtocol: ["Write a one-sentence essence-definition first.", "List the four causes explicitly.", "Keep asking 'why' until you can't."],
    },
  },
  {
    name: "Mozart", era: "1756–1791", domain: "Music composition",
    summary: "Composed whole works in auditory imagination before writing a note.",
    s: {
      name: "Auditory Whole-Composition", description: "Hear themes internally, let them assemble into a complete work, feel its rightness, then transcribe.",
      identity: "A vessel through which complete music arrives.", beliefs: "The music already exists; I discover it.", values: "Harmony, beauty, elegance.", capabilities: "Auditory imagination; holding large structures; felt 'rightness'.",
      highLeverage: ["Compose in the ear, not on paper", "Trust the felt sense of completeness"],
      repSequence: [{ step: 1, system: "A", description: "Let themes sound in the mind's ear." }, { step: 2, system: "A", description: "Allow them to combine into the whole, heard at once." }, { step: 3, system: "K", description: "Feel whether the whole is alive; then transcribe." }],
      tote: { test: "Sounds complete and alive internally?", operate: "Hear variations / let it assemble.", testExit: "The whole 'sounds finished'.", exit: "Write it down." },
      creativeProcess: "Internal simulation then rapid transcription.", learningProcess: "Saturate in masters' works, then recombine internally.", feedbackProcess: "Inner ear judges emotional impact and elegance.",
      shadowPatterns: "Impatience with the merely technical; reliance on flow.", failureModes: "Skipping revision when the inner ear is fatigued.",
      installProtocol: ["Practice hearing music internally without an instrument.", "Plan a whole before recording details.", "Use the felt 'rightness' check before committing."],
    },
  },
  {
    name: "Walt Disney", era: "1901–1966", domain: "Creativity / enterprise",
    summary: "Separated dreaming, planning and critiquing so they never fought.",
    s: {
      name: "Dreamer–Realist–Critic", description: "Imagine without limits, plan concretely, then critique the plan (never the dream).",
      identity: "A storyteller who makes the impossible feel inevitable.", beliefs: "Everything begins as imagination; constraints are solvable.", values: "Imagination, joy, experience.", capabilities: "Visualization, sequencing, targeted critique.",
      highLeverage: ["Identity: storyteller not administrator", "Spatially separate the three positions"],
      repSequence: [{ step: 1, system: "V", description: "Dreamer: see the finished experience, no constraints." }, { step: 2, system: "K", description: "Realist: act out what must physically happen, in order." }, { step: 3, system: "Ad", description: "Critic: question the PLAN against the dream, never the dream." }],
      tote: { test: "Does the plan reproduce the dream?", operate: "Revise the realist plan.", testExit: "Feasible AND faithful.", exit: "Commit and build." },
      creativeProcess: "A three-role creative method — dreamer, realist, critic — separated in space.", learningProcess: "Prototype experiences and watch real audiences.", feedbackProcess: "Critic evaluates plan vs. dream; audience reaction is final.",
      shadowPatterns: "Critic leaking into the dream; perfectionism.", failureModes: "Over-investing before the realist plan is sound.",
      installProtocol: ["Use three physical spots; only dream in spot 1.", "Act out the plan in first person in spot 2.", "In spot 3 critique only the plan; route fixes to spot 2."],
    },
  },
  {
    name: "Leonardo da Vinci", era: "1452–1519", domain: "Art / science / engineering",
    summary: "Practiced saper vedere — knowing how to truly see — and tested ideas against experience.",
    s: {
      name: "Saper Vedere & Dimostrazione", description: "Observe exhaustively from many angles, connect by analogy, imagine, then test against experience.",
      identity: "A universal learner for whom art and science are one seeing.", beliefs: "Everything connects; experience is the only true test.", values: "Curiosity, beauty, integration.", capabilities: "Microscopic observation; cross-domain analogy; experiment.",
      highLeverage: ["Observe before theorizing", "Test by experience (dimostrazione)"],
      repSequence: [{ step: 1, system: "V", description: "Observe in fine detail from multiple viewpoints." }, { step: 2, system: "K", description: "Connect by analogy across domains." }, { step: 3, system: "Ad", description: "Imagine, draw, then test against direct experience." }],
      tote: { test: "Matches reality from every angle?", operate: "Observe again differently.", testExit: "Confirmed by experience.", exit: "Record the principle." },
      creativeProcess: "Cross-domain synthesis driven by observation.", learningProcess: "Observe → sketch → question → connect → experiment.", feedbackProcess: "Direct experience over authority; the drawing reveals errors.",
      shadowPatterns: "Endless curiosity; unfinished projects.", failureModes: "Starting more than can be completed; perfection delaying release.",
      installProtocol: ["Observe one thing 10 minutes before any conclusion.", "Force one cross-domain analogy.", "Verify against a real test, not authority."],
    },
  },
  {
    name: "Nikola Tesla", era: "1856–1943", domain: "Invention / engineering",
    summary: "Built and ran machines entirely in his mind, watching them wear over time before building.",
    s: {
      name: "Full Mental Simulation", description: "Construct the device in imagination, run it over simulated time to find faults, fix in the mind, build once.",
      identity: "An engineer whose mind is a complete laboratory.", beliefs: "The mind can simulate reality; a flaw found in imagination is free.", values: "Precision, innovation, efficiency.", capabilities: "Photographic visualization; mental simulation; patience.",
      highLeverage: ["Run it in the mind before the world", "Simulate wear over time"],
      repSequence: [{ step: 1, system: "V", description: "Construct the machine vividly and completely in mind." }, { step: 2, system: "K", description: "Run it mentally; watch it operate and wear over time." }, { step: 3, system: "Ad", description: "Diagnose and redesign in imagination; build only when flawless." }],
      tote: { test: "Runs flawlessly over simulated time?", operate: "Fix the imagined fault, re-run.", testExit: "No faults in extended mental operation.", exit: "Build the physical device." },
      creativeProcess: "Full mental prototype before any material work.", learningProcess: "Iterative mental refinement; learn from imagined failure.", feedbackProcess: "Mental simulation is the test bench; reality confirms.",
      shadowPatterns: "Over-attachment to the perfect mental model; neglect of commercial reality.", failureModes: "Delaying execution; ignoring funding/partners.",
      installProtocol: ["Simulate the whole system in your mind before building.", "Fast-forward to find failure modes over time.", "Iterate mentally until clean, then commit resources."],
    },
  },
  {
    name: "Albert Einstein", era: "1879–1955", domain: "Theoretical physics",
    summary: "Reasoned from vivid thought-experiments and demanded deep simplicity.",
    s: {
      name: "Gedankenexperiment", description: "Imagine a vivid physical scenario at the limits, follow its logic to a contradiction, and reformulate principles to resolve it.",
      identity: "A seeker of the simple laws behind appearances.", beliefs: "The universe is comprehensible and ultimately simple.", values: "Truth, simplicity, independence.", capabilities: "Visual thought-experiments; combinatory play; tenacity.",
      highLeverage: ["Hold the question for years", "Imagine, don't just calculate"],
      repSequence: [{ step: 1, system: "V", description: "Picture a concrete scenario at a physical limit (riding a light beam)." }, { step: 2, system: "K", description: "Feel/run the scenario; find where intuition breaks." }, { step: 3, system: "Ad", description: "Reformulate the principle to remove the contradiction; check math." }],
      tote: { test: "Does a contradiction remain?", operate: "Adjust the principle / imagine a sharper case.", testExit: "Consistent and simpler than before.", exit: "Formalize." },
      creativeProcess: "Combinatory play with images, then formalization.", learningProcess: "Question accepted axioms; learn by re-deriving.", feedbackProcess: "Internal consistency + experimental prediction.",
      shadowPatterns: "Stubbornness against evidence (later QM).", failureModes: "Clinging to aesthetic preference over data.",
      installProtocol: ["Convert a problem into one vivid scenario at its limit.", "Find where common sense breaks.", "Change a premise, not the conclusion."],
    },
  },
  {
    name: "Charlie Munger", era: "1924–2023", domain: "Investing / judgment",
    summary: "Applied a latticework of mental models and inverted problems to avoid stupidity.",
    s: {
      name: "Latticework & Inversion", description: "Run a problem through many disciplines' models and solve by inversion — avoid what guarantees failure.",
      identity: "A learning machine who compounds judgment.", beliefs: "Avoiding stupidity beats seeking brilliance.", values: "Rationality, honesty, patience.", capabilities: "Multidisciplinary models; inversion; circle of competence.",
      highLeverage: ["Study how things fail, then avoid that", "Act only where your knowledge is genuinely deep"],
      repSequence: [{ step: 1, system: "Ad", description: "List the relevant models from several disciplines." }, { step: 2, system: "Ad", description: "Invert: what would guarantee the worst outcome?" }, { step: 3, system: "K", description: "Act only inside competence, with margin of safety." }],
      tote: { test: "Have I checked it against multiple models?", operate: "Add a discipline's model / invert again.", testExit: "Decision survives inversion + models.", exit: "Act, sized for safety." },
      creativeProcess: "Recombine models across disciplines.", learningProcess: "Read broadly daily; maintain checklists.", feedbackProcess: "Long-horizon outcomes; pre-mortem via inversion.",
      shadowPatterns: "Over-confidence outside competence.", failureModes: "Acting where you lack a model; ignoring base rates.",
      installProtocol: ["Before deciding, list models from 3 disciplines.", "Write the failure path and avoid it.", "Size positions for margin of safety."],
    },
  },
  {
    name: "Steve Jobs", era: "1955–2011", domain: "Product / design",
    summary: "Fused technology with liberal arts and said no to almost everything.",
    s: {
      name: "Taste & Subtraction", description: "Start from the felt user experience, then ruthlessly remove until only the essential, beautiful core remains.",
      identity: "A curator of products at the intersection of tech and the humanities.", beliefs: "Design is how it works; focus means saying no.", values: "Simplicity, craftsmanship, experience.", capabilities: "Aesthetic taste; empathy for the user; ruthless focus.",
      highLeverage: ["Start from the experience, not the feature", "Subtract until it's essential"],
      repSequence: [{ step: 1, system: "K", description: "Feel the whole user experience as a person, not an engineer." }, { step: 2, system: "V", description: "See the simplest form that delivers it." }, { step: 3, system: "Ad", description: "Cut everything non-essential; demand craftsmanship in the unseen." }],
      tote: { test: "Is anything non-essential left?", operate: "Remove it / simplify the flow.", testExit: "Only the essential, beautiful core remains.", exit: "Ship." },
      creativeProcess: "Experience-first design, then aggressive subtraction.", learningProcess: "Study great design across fields; prototype relentlessly.", feedbackProcess: "Personal taste as proxy for the user; demos over specs.",
      shadowPatterns: "Reality distortion; harshness with people.", failureModes: "Overriding valid data with ego; alienating collaborators.",
      installProtocol: ["Describe the experience before any feature.", "Cut the feature list in half.", "Polish what users never see."],
    },
  },
  {
    name: "Ray Dalio", era: "b. 1949", domain: "Investing / systems",
    summary: "Turned painful mistakes plus reflection into explicit, testable principles and systems.",
    s: {
      name: "Mistakes Into Principles", description: "Treat every painful mistake as data, extract a reusable principle, encode it as a rule, and let the rule act next time.",
      identity: "A radically open systems-builder who learns from being wrong.", beliefs: "Reality + reflection compounds; ego and blind spots are the enemies.", values: "Truth, transparency, evolution.", capabilities: "Radical open-mindedness; principle extraction; systematizing.",
      highLeverage: ["Separate ego from being right", "Encode lessons as reusable rules"],
      repSequence: [{ step: 1, system: "K", description: "Notice the pain of a mistake without ego-defense." }, { step: 2, system: "Ad", description: "Reflect: what type of situation is this, what's the principle?" }, { step: 3, system: "V", description: "Write the rule; build it into a checklist/algorithm." }],
      tote: { test: "Have I extracted a reusable principle?", operate: "Reflect deeper / seek dissent.", testExit: "Principle encoded and testable.", exit: "Apply the rule next time." },
      creativeProcess: "Systematize judgment into decision rules and 'machines'.", learningProcess: "Mistake → principle → rule → backtest.", feedbackProcess: "Believability-weighted dissent; track rules against outcomes.",
      shadowPatterns: "Over-systematizing; analysis at the cost of warmth.", failureModes: "Treating people as machines; rule rigidity in novel regimes.",
      installProtocol: ["Keep a mistake → principle log.", "Convert each principle into an if-then rule.", "Invite the strongest opposing view before deciding."],
    },
  },
  {
    name: "Peter Drucker", era: "1909–2005", domain: "Management / contribution",
    summary: "Asked what the situation requires and focused on contribution and effectiveness.",
    s: {
      name: "Contribution & Effectiveness", description: "Start from 'what does this situation need and what can I contribute?', concentrate on the few things that matter, and manage by results.",
      identity: "A steward who turns knowledge into responsible contribution.", beliefs: "Effectiveness can be learned; results live outside the organization.", values: "Responsibility, integrity, contribution.", capabilities: "Asking the right question; prioritization; managing strengths.",
      highLeverage: ["Ask 'what needs to be done?' before 'what do I want?'", "Concentrate on the vital few"],
      repSequence: [{ step: 1, system: "Ad", description: "Ask what the situation requires and where you can contribute." }, { step: 2, system: "V", description: "See the few priorities that produce results; drop the rest." }, { step: 3, system: "K", description: "Build on strengths; manage time to the priorities." }],
      tote: { test: "Am I working on the vital few?", operate: "Abandon a non-priority / sharpen the question.", testExit: "Effort aligns with results that matter.", exit: "Execute and measure." },
      creativeProcess: "Frame the right question; design for contribution.", learningProcess: "Feedback analysis: predict outcomes, compare, adjust.", feedbackProcess: "Measure results outside the org; abandon what no longer serves.",
      shadowPatterns: "Abstraction without execution.", failureModes: "Confusing activity with results; keeping sunk priorities.",
      installProtocol: ["Begin each week with 'what does this need?'", "Pick the vital few; abandon one thing.", "Do a feedback analysis on a past decision."],
    },
  },
  {
    name: "Sherlock Holmes", era: "fictional (A. Conan Doyle)", domain: "Observation / deduction",
    summary: "Reasoned backward from minute observed detail to the only explanation that fits.",
    s: {
      name: "Observation & Abduction", description: "Saturate on micro-detail others ignore, generate candidate explanations, eliminate the impossible, keep the one that fits.",
      identity: "A reasoning instrument who sees what others merely look at.", beliefs: "Everything leaves a trace; the obvious is usually unobserved.", values: "Precision, detachment, truth.", capabilities: "Microscopic observation; abductive inference; elimination.",
      highLeverage: ["Observe, don't just see", "Eliminate the impossible; whatever remains is the truth"],
      repSequence: [{ step: 1, system: "V", description: "Scan for tiny anomalies and details others overlook." }, { step: 2, system: "Ad", description: "Generate every explanation the details could imply (abduction)." }, { step: 3, system: "Ad", description: "Eliminate the impossible; retain the single consistent account." }],
      tote: { test: "Does one explanation fit ALL the details?", operate: "Gather one more observation / eliminate a candidate.", testExit: "Exactly one explanation survives.", exit: "Declare the conclusion." },
      creativeProcess: "Reconstruct the whole from fragments by inference.", learningProcess: "Build vast specialized reference knowledge (soils, tobaccos, hands).", feedbackProcess: "Test the theory against new evidence; discard if contradicted.",
      shadowPatterns: "Cold detachment; boredom without stimulation.", failureModes: "Over-confidence when data is thin; theorizing ahead of facts.",
      installProtocol: ["Spend the first minutes only observing details.", "List every explanation before choosing.", "Cross out the impossible; trust what remains."],
    },
  },
  {
    name: "Sigmund Freud", era: "1856–1939", domain: "Psychology / psychoanalysis",
    summary: "Decoded the hidden structure beneath behavior from slips, dreams and associations.",
    s: {
      name: "Decoding the Unconscious", description: "Treat surface errors, dreams and free associations as data, trace them to latent structure, and surface the underlying pattern.",
      identity: "An archaeologist of the mind reading what the surface conceals.", beliefs: "Nothing is accidental; the hidden drives the visible.", values: "Insight, honesty about the self, depth.", capabilities: "Metacognition; symbolic interpretation; pattern-finding under the surface.",
      highLeverage: ["Read the slip, the dream, the omission as signal", "Trace surface to latent cause"],
      repSequence: [{ step: 1, system: "A", description: "Collect free associations, slips, dream fragments without censoring." }, { step: 2, system: "Ad", description: "Interpret: what latent wish/conflict would produce this surface?" }, { step: 3, system: "K", description: "Test the interpretation against the person's felt response." }],
      tote: { test: "Does the interpretation resolve the surface anomalies?", operate: "Gather more associations / revise the hypothesis.", testExit: "Latent pattern accounts for the material.", exit: "Make the unconscious conscious." },
      creativeProcess: "Build explanatory structures from fragmentary signals.", learningProcess: "Case-by-case pattern accumulation; self-analysis.", feedbackProcess: "Clinical response; later, falsifiability critiques.",
      shadowPatterns: "Over-interpretation; unfalsifiable certainty.", failureModes: "Forcing one schema onto all cases; ignoring disconfirmation.",
      installProtocol: ["Note the slip/omission instead of dismissing it.", "Ask what hidden aim it would serve.", "Check the read against lived response, not theory alone."],
    },
  },
  {
    name: "Elon Musk", era: "b. 1971", domain: "Engineering / enterprise",
    summary: "Reasoned from physical first principles and compressed iteration cycles brutally.",
    s: {
      name: "First Principles & Fast Iteration", description: "Strip a problem to physics-level truths, rebuild the solution from there, then iterate hardware as fast as failure allows.",
      identity: "An engineer who treats the impossible as an unsolved physics problem.", beliefs: "Reason up from physics, not analogy; cost/limits are usually conventions.", values: "Truth, speed, leverage on civilization-scale problems.", capabilities: "First-principles decomposition; rapid iteration; extreme risk tolerance.",
      highLeverage: ["Reason from physics, not analogy", "Make the cycle time short; let it fail fast"],
      repSequence: [{ step: 1, system: "Ad", description: "Reduce to fundamental physical/economic truths." }, { step: 2, system: "V", description: "Rebuild the solution upward from those truths." }, { step: 3, system: "K", description: "Build, test to failure, iterate; delete parts/steps aggressively." }],
      tote: { test: "Is any constraint just convention, not physics?", operate: "Remove the convention / rebuild from base truths.", testExit: "Design is bounded only by physics & cost-floor.", exit: "Build and iterate." },
      creativeProcess: "First-principles redesign + ruthless iteration loops.", learningProcess: "Learn the underlying science directly; learn by destructive testing.", feedbackProcess: "Reality (test stands, telemetry) over opinion; rapid retry.",
      shadowPatterns: "Over-aggressive timelines; burnout of teams.", failureModes: "Underestimating integration time; spreading focus thin.",
      installProtocol: ["Write the physics floor of the problem.", "Rebuild ignoring how it's 'normally' done.", "Shorten the iteration cycle; delete before optimizing."],
    },
  },
  {
    name: "Jeff Bezos", era: "b. 1964", domain: "Enterprise / decision-making",
    summary: "Optimized for the long term and for reversible, high-velocity decisions.",
    s: {
      name: "Long-Horizon, Reversible-First", description: "Anchor on the customer and a long horizon, classify decisions by reversibility, and decide fast on the reversible ones.",
      identity: "A long-term owner working backward from the customer.", beliefs: "Most decisions are reversible; speed compounds; obsess over customers not competitors.", values: "Customer obsession, long-term thinking, high standards.", capabilities: "Working backward; decision-type classification; minimizing long-run regret.",
      highLeverage: ["Work backward from the customer", "Two-way doors: decide fast and reverse if wrong"],
      repSequence: [{ step: 1, system: "Ad", description: "Project to the long horizon; minimize future regret." }, { step: 2, system: "V", description: "Write the customer outcome backward (the future press release)." }, { step: 3, system: "Ad", description: "Classify: one-way (deliberate) vs two-way door (decide fast)." }],
      tote: { test: "Is this a reversible (two-way) door?", operate: "If reversible, decide now; if not, gather more.", testExit: "Decision matched to its reversibility.", exit: "Act at the right speed." },
      creativeProcess: "Work backward from the desired customer experience.", learningProcess: "Narrative memos over slides; learn from disagree-and-commit.", feedbackProcess: "Long-horizon metrics; customer signal over competitor noise.",
      shadowPatterns: "Relentless standards straining people.", failureModes: "Treating one-way doors as two-way; over-expansion.",
      installProtocol: ["Write the future press release first.", "Label each decision one-way or two-way.", "Move fast on reversible calls; slow only on irreversible ones."],
    },
  },
  {
    name: "Muhammad Yunus", era: "b. 1940", domain: "Social business / economics",
    summary: "Inverted economic assumptions to design enterprises that solve social problems.",
    s: {
      name: "Social Business Inversion", description: "Question the assumptions that exclude the poor, invert them, and design a self-sustaining business whose objective is social good, not profit extraction.",
      identity: "An economist who designs systems for the excluded.", beliefs: "The poor are creditworthy; assumptions, not people, are the constraint.", values: "Dignity, inclusion, sustainability.", capabilities: "Assumption inversion; bottom-up design; self-sustaining models.",
      highLeverage: ["Question the assumption that excludes people", "Design for social objective, sustained by business"],
      repSequence: [{ step: 1, system: "Ad", description: "Name the accepted assumption that creates the exclusion." }, { step: 2, system: "Ad", description: "Invert it and design from the excluded person's reality." }, { step: 3, system: "K", description: "Build a self-sustaining model; measure social impact, reinvest." }],
      tote: { test: "Does it sustain itself AND serve the social goal?", operate: "Redesign the model / re-examine an assumption.", testExit: "Self-sustaining and socially effective.", exit: "Scale and replicate." },
      creativeProcess: "Invert economic orthodoxy; design ground-up.", learningProcess: "Learn from the field/villages, not the textbook.", feedbackProcess: "Repayment + measured social outcomes; iterate the model.",
      shadowPatterns: "Idealism outrunning operational rigor.", failureModes: "Scaling before the model is genuinely self-sustaining.",
      installProtocol: ["Write the assumption that excludes your users.", "Design as if the opposite were true.", "Require the model to fund itself."],
    },
  },
  {
    name: "Richard Feynman", era: "1918–1988", domain: "Physics / learning",
    summary: "Compiled complex theory down to plain, first-principles pictures anyone could follow.",
    s: {
      name: "The Feynman Technique", description: "Strip the jargon, re-explain the idea in plain language and concrete images until the gap that reveals non-understanding is gone.",
      identity: "A relentless what-is-it-really child, never burdened by the authority pose.", beliefs: "Real understanding shows up as the ability to explain something plainly.", values: "Honesty, clarity, curiosity, play.", capabilities: "Jargon-stripping; visual reframing; reasoning from basics.",
      highLeverage: ["Re-explain it for a beginner", "Strip out the jargon on purpose"],
      repSequence: [{ step: 1, system: "Ad", description: "State the concept; write it as if teaching a beginner." }, { step: 2, system: "V", description: "Replace formal terms with concrete physical pictures (Feynman diagrams)." }, { step: 3, system: "Ad", description: "Find where the explanation breaks; go relearn exactly that, repeat." }],
      tote: { test: "Can a first-year follow it with no jargon?", operate: "Find the fuzzy spot, relearn it, re-explain.", testExit: "Plain, gap-free explanation.", exit: "You actually understand it." },
      creativeProcess: "Reduce complexity to the simplest true picture, then rebuild.", learningProcess: "Teach-to-learn; expose gaps by explaining aloud.", feedbackProcess: "The listener's confusion marks the exact gap to fix.",
      shadowPatterns: "Impatience with pomposity; dismissiveness of formalism.", failureModes: "Oversimplifying past the point of accuracy.",
      installProtocol: ["Write the idea for a 1st-year student.", "Delete every piece of jargon; draw it.", "Relearn wherever the explanation stutters."],
    },
  },
  {
    name: "John von Neumann", era: "1903–1957", domain: "Math / computing / game theory",
    summary: "Found the underlying axioms of any field and ported pure-math structure across domains.",
    s: {
      name: "Axiomatic Cross-Domain Modeling", description: "Reduce a new field to its core axioms and mathematical structure, then attack it with deep general machinery from another field.",
      identity: "A universal modeler who sees structure, not surface phenomena.", beliefs: "Behind any complex system lies a small set of base axioms.", values: "Rigor, generality, power.", capabilities: "Abstraction; isomorphism-spotting; cross-field transfer.",
      highLeverage: ["See the isomorphism, not the phenomenon", "Reduce a field to axioms first"],
      repSequence: [{ step: 1, system: "Ad", description: "Extract the field's core conflict as a mathematical set/structure." }, { step: 2, system: "Ad", description: "Map it to a known structure you already master (isomorphism)." }, { step: 3, system: "V", description: "Apply your general machinery; formalize the result (e.g. game theory)." }],
      tote: { test: "Have I found the underlying axioms?", operate: "Abstract one level higher / find the isomorphism.", testExit: "Field reduced to known structure.", exit: "Solve with general tools." },
      creativeProcess: "Translate domain A's structure to solve domain B.", learningProcess: "Learn the axioms, skip the folklore.", feedbackProcess: "Mathematical consistency + predictive power.",
      shadowPatterns: "Detachment from messy human/ethical reality.", failureModes: "Over-abstraction that ignores context-specific constraints.",
      installProtocol: ["Write the new problem as a formal structure.", "Find an isomorphic structure you already know.", "Port your strongest tools across."],
    },
  },
  {
    name: "Carl Friedrich Gauss", era: "1777–1855", domain: "Mathematics",
    summary: "Found symmetry and shortcuts that replaced brute computation with elegant structure.",
    s: {
      name: "Algorithm Restructuring", description: "Refuse brute force; search the problem's structure for symmetry and shortcuts that collapse the work.",
      identity: "A seeker of the elegant path, the 'Prince of Mathematics'.", beliefs: "There is almost always a structural shortcut; brute force is a failure of seeing.", values: "Elegance, rigor, efficiency.", capabilities: "Pattern/symmetry recognition; algorithmic reframing; intuition.",
      highLeverage: ["Find the symmetry before computing", "Refuse brute force"],
      repSequence: [{ step: 1, system: "V", description: "Look at the whole structure, not the linear steps (1+100, 2+99…)." }, { step: 2, system: "Ad", description: "Spot the invariant/symmetry that repeats." }, { step: 3, system: "Ad", description: "Recast the task as a closed-form shortcut (50 × 101)." }],
      tote: { test: "Is there still brute force in this?", operate: "Hunt for a symmetry / closed form.", testExit: "An elegant shortcut replaces the grind.", exit: "Compute the easy way." },
      creativeProcess: "Compress computation into structure.", learningProcess: "Re-derive from the cleanest possible angle.", feedbackProcess: "Elegance + correctness; distrust ugly proofs.",
      shadowPatterns: "Perfectionism; reluctance to publish the messy.", failureModes: "Withholding work until it's flawless; slow dissemination.",
      installProtocol: ["Before computing, ask 'where's the symmetry?'", "Look for a closed-form shortcut.", "Prefer the elegant solution over the powerful machine."],
    },
  },
  {
    name: "Alexander von Humboldt", era: "1769–1859", domain: "Natural science / systems",
    summary: "Saw nature as one connected web and related multi-domain data on a single picture.",
    s: {
      name: "Networked Ecological Thinking", description: "Refuse to study a discipline in isolation; overlay climate, geology, biology and culture data to reveal universal cross-domain laws.",
      identity: "A connector who sees the web of life as one great whole.", beliefs: "Everything is interconnected; isolated study misses the real pattern.", values: "Wholeness, wonder, rigor across domains.", capabilities: "Multi-modal data association; visualization; global pattern-finding.",
      highLeverage: ["Plot every domain on one chart", "Compare across regions and dimensions"],
      repSequence: [{ step: 1, system: "V", description: "Gather data across disciplines and regions onto one visual field (isotherms)." }, { step: 2, system: "Ad", description: "Look for cross-domain correlations others miss (climate↔vegetation)." }, { step: 3, system: "Ad", description: "Abstract the universal law from the relationships." }],
      tote: { test: "Have I connected enough domains to see the pattern?", operate: "Add another data dimension / region.", testExit: "A cross-domain regularity appears.", exit: "State the general law." },
      creativeProcess: "Synthesis across disciplines via visualization.", learningProcess: "Field measurement + comparison across systems.", feedbackProcess: "Cross-regional consistency of the pattern.",
      shadowPatterns: "Breadth that risks losing depth.", failureModes: "Spreading across too much to finish synthesis.",
      installProtocol: ["Put data from 3+ domains on one chart.", "Hunt for cross-domain correlations.", "Generalize the relationship into a law."],
    },
  },
  {
    name: "Michael Faraday", era: "1791–1867", domain: "Electromagnetism",
    summary: "Reasoned physics through vivid spatial intuition, ahead of the math that later formalized it.",
    s: {
      name: "Spatial-Intuitive Modeling", description: "When the math is out of reach, perceive the invisible physically — model fields as tangible, elastic lines you can feel in space.",
      identity: "A self-taught experimenter who trusts physical intuition over formalism.", beliefs: "Physical intuition can precede and guide the mathematics.", values: "Curiosity, directness, humility, rigor in the lab.", capabilities: "3D spatial imagination; physical analogy; meticulous experiment.",
      highLeverage: ["See the invisible as tangible (lines of force)", "Let intuition lead the math"],
      repSequence: [{ step: 1, system: "V", description: "Picture the invisible phenomenon as concrete objects (taut elastic field lines)." }, { step: 2, system: "K", description: "Feel how they push/pull and move in space." }, { step: 3, system: "Ad", description: "Design an experiment to confirm the imagined model." }],
      tote: { test: "Does the physical picture predict the experiment?", operate: "Adjust the imagined model, retest.", testExit: "Model matches observation.", exit: "Hand the intuition to the mathematicians (Maxwell)." },
      creativeProcess: "Visualize the unseen, then verify by experiment.", learningProcess: "Hands-on experiment over formal training.", feedbackProcess: "Experimental result confirms or kills the mental model.",
      shadowPatterns: "Distrust of pure math may limit formal reach.", failureModes: "Insights stalling for lack of formalization.",
      installProtocol: ["Render the invisible as tangible objects in your mind.", "Feel how they'd move/interact.", "Design the experiment that would prove it."],
    },
  },
];

async function main() {
  for (const g of G) {
    const genius = await prisma.genius.upsert({
      where: { name: g.name }, update: { era: g.era, domain: g.domain, summary: g.summary },
      create: { name: g.name, era: g.era, domain: g.domain, summary: g.summary },
    });
    const data = {
      geniusId: genius.id, name: g.s.name, description: g.s.description,
      identity: g.s.identity, beliefs: g.s.beliefs, values: g.s.values, capabilities: g.s.capabilities,
      highLeverage: g.s.highLeverage.join(" · "),
      creativeProcess: g.s.creativeProcess, learningProcess: g.s.learningProcess, feedbackProcess: g.s.feedbackProcess,
      shadowPatterns: g.s.shadowPatterns, failureModes: g.s.failureModes,
      repSequence: g.s.repSequence, tote: g.s.tote, installProtocol: g.s.installProtocol,
    };
    const existing = await prisma.geniusStrategy.findFirst({ where: { geniusId: genius.id, name: g.s.name } });
    if (existing) await prisma.geniusStrategy.update({ where: { id: existing.id }, data });
    else await prisma.geniusStrategy.create({ data });
  }
  console.log(`Seeded ${G.length} geniuses with full Excellence Blueprints.`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
