// Growth Prescription templates — one per bottleneck type. A prescription turns a
// diagnosis into a targeted, time-bounded, measurable intervention. Pure data;
// the PrescriptionGenerator agent personalizes a template to the user's context.

export interface PrescriptionTemplate {
  bottleneck: string;
  title: string;
  objective: string;
  sevenDay: string[];
  thirtyDay: string[];
  metrics: string[];
  reviewQuestions: string[];
  failureModes: string[];
  linkedEngines: string[];
}

const T = (
  bottleneck: string, title: string, objective: string,
  sevenDay: string[], thirtyDay: string[], metrics: string[], reviewQuestions: string[], failureModes: string[], linkedEngines: string[],
): PrescriptionTemplate => ({ bottleneck, title, objective, sevenDay, thirtyDay, metrics, reviewQuestions, failureModes, linkedEngines });

export const PRESCRIPTION_TEMPLATES: Record<string, PrescriptionTemplate> = {
  mission: T("mission", "Mission Clarification", "Reconnect daily work to a reason that matters.",
    ["Write one sentence: why does this matter to you?", "List 3 contributions you want to be responsible for."],
    ["Draft a one-paragraph mission and test it against your week.", "Cut one commitment that serves no mission."],
    ["mission statement drafted", "decisions checked against mission"], ["Does today's work serve the mission?"], ["Chasing goals with no why."], ["Mission Engine", "Worldview OS"]),
  identity: T("identity", "Identity Alignment", "Close the gap between stated and enacted identity.",
    ["Name the identity you're becoming in one line.", "List behaviors that contradict it."],
    ["Replace one contradicting behavior with an identity-proving one.", "Log one identity proof daily."],
    ["identity statement written", "identity proofs logged"], ["What did today prove about who you are?"], ["Claiming an identity you don't yet enact."], ["Identity Engine", "Identity-Based Habit"]),
  value_conflict: T("value_conflict", "Value Conflict Resolution", "Resolve competing priorities into a clear ranking.",
    ["List the values currently competing.", "Rank your top 5 values."],
    ["Define a tie-break rule for the top conflict.", "Make one decision using the ranking."],
    ["values ranked", "conflict tie-break rule defined"], ["Which value did you betray under pressure?"], ["Trying to honor all values at once."], ["Values Engine", "Principle-Centered Life"]),
  belief: T("belief", "Belief Reframe", "Replace one limiting belief with a testable, growth belief.",
    ["Write the limiting belief verbatim.", "Find one piece of evidence against it."],
    ["Reframe it as a strategy problem and run a 2-week test.", "Track outcomes vs the old belief."],
    ["belief reframed", "counter-evidence collected"], ["Did the evidence change your belief?"], ["Arguing for your limitations."], ["Belief Engine", "Growth Mindset", "Double-Loop Learning"]),
  motivation: T("motivation", "Motivation Redesign", "Restore autonomy, competence, or relatedness.",
    ["Diagnose which of A/C/R is lowest.", "Reconnect the goal to a value you chose."],
    ["Create one meaningful option and one small win.", "Share progress with someone who matters."],
    ["autonomy/competence/relatedness rated", "weekly small wins"], ["Are you acting from ownership or pressure?"], ["Sustaining on willpower until it snaps."], ["Intrinsic Motivation", "Habit Engine"]),
  energy: T("energy", "Energy Recovery", "Rebuild the physical/mental energy growth depends on.",
    ["Protect a fixed sleep window for 7 nights.", "Remove one chronic energy drain."],
    ["Add one daily recovery practice.", "Match hard work to peak-energy hours."],
    ["sleep consistency", "energy rating trend"], ["When is your energy highest, and what did you spend it on?"], ["Optimizing output while depleting the source."], ["Health Engine", "Deep Work Engine"]),
  focus: T("focus", "Focus Restoration", "Rebuild the capacity for sustained attention.",
    ["Identify the top 3 distractions.", "Run one 25-minute single-task block."],
    ["Schedule daily focus blocks with a shutdown ritual.", "Track distraction count per block."],
    ["focus blocks completed", "distractions per block"], ["What pulled your attention most?"], ["Calling interrupted time 'focus'."], ["Deep Work Engine", "Flow State"]),
  skill: T("skill", "Skill Practice", "Close the specific capability gap blocking progress.",
    ["Decompose the skill; pick the weakest subskill.", "Design one drill you fail ~30% of the time."],
    ["Practice the drill with feedback 4x/week.", "Log errors and one correction each session."],
    ["practice sessions", "subskill score trend"], ["Which subskill improved this week?"], ["Comfortable reps that don't stretch."], ["Deliberate Practice", "Mastery Learning"]),
  judgment: T("judgment", "Decision Quality", "Improve how decisions are made, not just made faster.",
    ["Write the next decision in a journal with options.", "Run one debiasing protocol (pre-mortem)."],
    ["Add a base-rate + opposite-case check to decisions.", "Schedule reviews of 2 past decisions."],
    ["decisions journaled", "reviews completed"], ["What would change your mind?"], ["Confusing conviction with evidence."], ["Cognitive Bias", "Decision Engine", "Personal Boardroom"]),
  environment: T("environment", "Environment Redesign", "Make the right behavior the default.",
    ["Identify one cue that triggers the wrong behavior.", "Remove or add one environmental cue."],
    ["Redesign one space/device for the target behavior.", "Track behavior rate before/after."],
    ["cues changed", "behavior rate"], ["What did your environment make easy this week?"], ["Relying on willpower against the environment."], ["Behavior Design", "Habit Engine"]),
  habit: T("habit", "Behavior Design", "Redesign a failing behavior to actually happen.",
    ["Shrink the behavior to a 2-minute version.", "Anchor it to an existing routine."],
    ["Remove one source of friction; track success rate.", "Scale up only after 7 days of consistency."],
    ["tiny-behavior adoption", "success rate"], ["Was it too big, unprompted, or unmotivating?"], ["Relying on motivation for a too-hard behavior."], ["Behavior Design", "Identity-Based Habit"]),
  shadow: T("shadow", "Shadow Intervention", "Surface and disarm the avoidance behind the block.",
    ["Name what you're avoiding and the feeling under it.", "Do the smallest version of the avoided task today."],
    ["Schedule the avoided work first, 4x/week.", "Log the trigger that precedes avoidance."],
    ["avoided-task completions", "avoidance triggers logged"], ["What were you protecting yourself from?"], ["Productive procrastination on safe tasks."], ["Shadow Engine", "Deep Work Engine"]),
  leverage: T("leverage", "Leverage Upgrade", "Convert effort into scalable, compounding output.",
    ["List your highest-leverage activity.", "Identify one task to automate, delegate, or templatize."],
    ["Turn one repeated effort into a reusable asset.", "Shift 20% of time to leverage work."],
    ["leverage actions taken", "reusable assets created"], ["What did you do once that could pay you repeatedly?"], ["Hard work with no multiplier."], ["Naval Life OS", "Asset-Based Growth"]),
  asset: T("asset", "Asset Creation", "Turn consumption into durable, compounding output.",
    ["Pick one specific knowledge domain and outline an asset.", "Block one deep-work session for v1."],
    ["Publish v1 and collect feedback.", "Revise into a reusable asset."],
    ["deep-work sessions", "asset published", "feedback received"], ["What durable thing did you create?"], ["Consuming endlessly without shipping."], ["Asset-Based Growth", "Specific Knowledge", "Deep Work Engine"]),
  relationship: T("relationship", "Relationship Support", "Build the support, feedback, and aligned community you lack.",
    ["Name one person who could give honest feedback.", "Ask one person for help this week."],
    ["Set up a recurring accountability check-in.", "Contribute value to one aligned community."],
    ["support interactions", "feedback received"], ["Who helped you, and who did you help?"], ["Growing in isolation with no feedback."], ["Relationship Engine", "Personal Boardroom"]),
  antifragility: T("antifragility", "Antifragile Upgrade", "Reduce a fragile dependency and build optionality.",
    ["Name the single dependency carrying most downside.", "Define a cap for the worst case."],
    ["Start one capped-downside, high-upside experiment.", "Build one backup/buffer."],
    ["dependency reduced", "optionality experiments started"], ["What would a shock do to you today?"], ["Optimizing efficiency while increasing fragility."], ["Antifragile Life", "Naval Life OS"]),
};

export function prescriptionFor(bottleneck: string): PrescriptionTemplate | null {
  return PRESCRIPTION_TEMPLATES[bottleneck] ?? null;
}
