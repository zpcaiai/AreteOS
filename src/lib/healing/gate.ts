// ───────────────────── Healing OS · shared safety gate ─────────────────────
// One place that reads the latest triage for a session and enforces the
// cross-batch invariants: red blocks everything (→ crisis); orange is
// stabilization-only and forces shallow depth; exposure additionally requires
// green/yellow. Routes/services call these instead of re-implementing the gate.

import { prisma } from "../db";
import type { RiskLevel } from "../domain/risk";

/** Latest risk level for a session (server-authoritative). Defaults to green. */
export async function latestRiskLevel(userId: string, sessionId: string): Promise<RiskLevel> {
  try {
    const row = await prisma.safetyTriageEvent.findFirst({
      where: { userId, sessionId },
      orderBy: { createdAt: "desc" },
      select: { riskLevel: true },
    });
    return (row?.riskLevel as RiskLevel) ?? "green";
  } catch {
    return "green";
  }
}

/** Thrown by gate helpers; carries the route the caller should surface. */
export class RiskGateError extends Error {
  constructor(public route: string, message: string) {
    super(message);
    this.name = "RiskGateError";
  }
}

/** Block when red (default for every deep skill). */
export function assertNotRed(level: RiskLevel, skill: string): void {
  if (level === "red") throw new RiskGateError("urgent_crisis_response", `${skill} is blocked during red risk state.`);
}

/** Exposure-grade gate: block red AND orange (orange → stabilization). */
export function requireGreenOrYellow(level: RiskLevel, skill: string): void {
  if (level === "red") throw new RiskGateError("urgent_crisis_response", `${skill} is blocked during red risk state.`);
  if (level === "orange") throw new RiskGateError("stabilization", `${skill} is not available during orange risk state.`);
}

/** Orange → shallow; otherwise standard. */
export function depthForRisk(level: RiskLevel): "shallow" | "standard" {
  return level === "orange" ? "shallow" : "standard";
}
