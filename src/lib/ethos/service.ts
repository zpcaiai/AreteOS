// Identity Library — service. Computes the identity scoreboard from the user's stack,
// conflicts and evolution snapshots.
import { prisma } from "../db";
import * as S from "./scoring";
import type { Stage } from "./constants";

export async function computeIdentityProfile(userId: string) {
  const [stack, conflicts, snapshots, lastAssessment] = await Promise.all([
    prisma.userIdentityStack.findMany({ where: { userId, active: true } }),
    prisma.identityConflict.findMany({ where: { userId } }),
    prisma.identityEvolutionSnapshot.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.identityAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  const clarity = S.identityClarityScore(stack.length);
  const stability = S.identityStabilityScore(stack.map((s) => s.stage as Stage));
  const conflict = S.identityConflictScore(conflicts);
  // momentum: distinct stages advanced over snapshots, normalized
  const momentum = snapshots.length > 1 ? Math.min(1, snapshots.length / 8) : (snapshots.length ? 0.2 : 0);
  const evolution = S.identityEvolutionScore(momentum);
  const alignment = S.identityAlignmentScore(lastAssessment?.alignment ?? clarity);
  const integration = S.identityIntegrationScore({ clarity, conflict, stability });

  const scores: S.IdentityScores = { clarity, alignment, stability, conflict, evolution, integration };
  return { ...scores, globalScore: S.globalIdentityScore(scores), stack, conflicts, snapshots };
}

export type IdentityProfile = Awaited<ReturnType<typeof computeIdentityProfile>>;
