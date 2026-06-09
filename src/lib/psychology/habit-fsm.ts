/* Habit behavioral-activation tiers — deterministic TS port of
   emotion-sphere/backend/habit_behavior_engine.py (BehaviorRegulationEngine
   fallback + tier logic). Works fully offline; the BehaviorRegulation agent
   gives the LLM-enriched version. */

export type Tier = "Green" | "Yellow" | "Red";

export function tierFromEnergy(energy: number): Tier {
  if (energy >= 4) return "Green";
  if (energy >= 3) return "Yellow";
  return "Red";
}

export interface RegulationResult {
  currentResistance: number;          // 1..10
  currentPsychologicalState: string;
  minExecutableAction: string;
  taskDowngrade: string;
  emotionalCompensation: string;
  continuityAdvice: string;
  selectedTier: Tier;
}

/** Deterministic regulation plan for a task at a given energy (1..5). */
export function regulate(task: string, energy = 3): RegulationResult {
  if (energy <= 2)
    return {
      currentResistance: 8,
      currentPsychologicalState: "Low energy, high resistance",
      minExecutableAction: `Open the doc for "${task}" and read the first line`,
      taskDowngrade: `Minimum version of "${task}" (60 seconds)`,
      emotionalCompensation: "The system downshifted to low-energy mode on purpose — this is not a failure",
      continuityAdvice: "Any tiny start counts as success",
      selectedTier: "Red",
    };
  if (energy <= 3)
    return {
      currentResistance: 5,
      currentPsychologicalState: "Normal energy, moderate resistance",
      minExecutableAction: `Start the first step of "${task}", timeboxed to 5 minutes`,
      taskDowngrade: `Simplified version of "${task}" (5 minutes)`,
      emotionalCompensation: "Finishing 50% still counts",
      continuityAdvice: "Set one focus timer and stay with a single small block",
      selectedTier: "Yellow",
    };
  return {
    currentResistance: 3,
    currentPsychologicalState: "High energy, low resistance",
    minExecutableAction: `Execute "${task}" fully`,
    taskDowngrade: task,
    emotionalCompensation: "Keep the rhythm, but don't overspend",
    continuityAdvice: "Record what this success felt like",
    selectedTier: "Green",
  };
}

export interface HabitFSM { habitName: string; anchor: string; tiers: Record<Tier, string>; }

/** Build an identity-anchored habit state machine with energy-graded tiers. */
export function createHabitFsm(habitName: string, anchor = ""): HabitFSM {
  return {
    habitName,
    anchor: anchor || `After I ${"<existing routine>"}, I will ${habitName}`,
    tiers: {
      Green: `Full ${habitName}`,
      Yellow: `Half-size ${habitName}`,
      Red: `Token ${habitName} (≤60s) — just to keep the identity vote`,
    },
  };
}
