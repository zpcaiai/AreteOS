// ───────────── Healing OS · Stabilization pure logic (deterministic) ─────────────
import type { TraumaStabilizationInput, PresentOrientation, StabilizationPriority, StabilizationMode } from "../domain/trauma-stabilization";
import { STAB_BLOCKED_SKILLS } from "../domain/trauma-stabilization";
import { classifyArousalState } from "./emotion-logic";
import type { ArousalState } from "../domain/emotion-regulation";

export function classifyTraumaArousal(input: TraumaStabilizationInput): ArousalState {
  const s = input.symptoms ?? {};
  if (s.panic || s.emotionalFlooding || s.flashback || s.urgeToEscape) return "hyperarousal";
  if (s.numbness || s.shutdown || s.dissociation || s.bodyFreeze) return "hypoarousal";
  return classifyArousalState({ currentEmotionText: input.currentExperience, bodySignals: input.bodySignals });
}

export function classifyOrientation(input: TraumaStabilizationInput): PresentOrientation {
  const o = input.orientation;
  if (!o) return "unclear";
  const known = [o.knowsCurrentDate, o.knowsCurrentLocation, o.feelsPresent].filter((x) => x === true).length;
  const unknown = [o.knowsCurrentDate, o.knowsCurrentLocation, o.feelsPresent].filter((x) => x === false).length;
  if (known >= 2 && unknown === 0) return "oriented";
  if (unknown >= 2) return "disoriented";
  if (known >= 1) return "partially_oriented";
  return "unclear";
}

export function stabilizationPriority(arousal: ArousalState, input: TraumaStabilizationInput): StabilizationPriority {
  const s = input.symptoms ?? {};
  if (s.flashback || s.intrusiveMemory) return "orienting";
  if (arousal === "hyperarousal") return "down_regulation";
  if (arousal === "hypoarousal") return "up_regulation";
  if (s.dissociation) return "grounding";
  return "normal_reflection";
}

export function selectStabilizationProtocol(input: TraumaStabilizationInput, arousal: ArousalState): StabilizationMode {
  if (input.preferredStabilizationMode) return input.preferredStabilizationMode;
  const s = input.symptoms ?? {};
  if (s.flashback) return "flashback_protocol";
  if (s.dissociation || arousal === "hypoarousal") return "body_activation";
  if (arousal === "hyperarousal") return "breathing";
  return "grounding";
}

/** Deep work is ALWAYS blocked during stabilization — deterministic, not the model's call. */
export function blockedStabilizationSkills(): (typeof STAB_BLOCKED_SKILLS)[number][] {
  return [...STAB_BLOCKED_SKILLS];
}
