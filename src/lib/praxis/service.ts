// SFM — service layer. Reads the engine tables and computes the organizational
// health scoreboard from pure scoring functions.
import { prisma } from "../db";
import * as S from "./scoring";

export async function computeOrgHealth(userId: string) {
  const [factors, values, rules, decisions, collab, leadership, resilience] = await Promise.all([
    prisma.successFactor.findMany({ where: { userId } }),
    prisma.coreBusinessValue.findMany({ where: { userId } }),
    prisma.businessDecisionRule.findMany({ where: { userId } }),
    prisma.decision.count({ where: { userId } }).catch(() => 0),
    prisma.collaborationPattern.findMany({ where: { userId } }),
    prisma.leadershipPattern.findMany({ where: { userId } }),
    prisma.resiliencePattern.findMany({ where: { userId } }),
  ]);

  const founderDependency = S.founderDependencyScore(factors);
  const repeatability = S.repeatabilityScore(factors);
  const scalability = S.scalabilityScore(factors);
  const valuesAlignment = S.valuesAlignmentScore(values);
  const decisionConsistency = S.decisionConsistencyScore({
    decisionsWithRule: rules.length,
    decisionsTotal: Math.max(rules.length, decisions || rules.length),
  });
  const collaborationQuality = S.collaborationQualityScore(collab);
  const leadershipMaturity = S.leadershipMaturityScore(leadership);
  const resilienceScore = S.resilienceScore(resilience);

  const inputs: S.SfmInputs = {
    repeatability, valuesAlignment, decisionConsistency, collaborationQuality,
    leadershipMaturity, resilience: resilienceScore, founderDependency, scalabilityFallback: scalability,
  };
  const replicationReadiness = S.replicationReadinessScore(inputs);
  const organizationalHealth = S.organizationalHealthScore(inputs);

  return {
    founderDependency, repeatability, scalability, valuesAlignment, decisionConsistency,
    collaborationQuality, leadershipMaturity, resilience: resilienceScore,
    replicationReadiness, organizationalHealth,
  };
}

export type OrgHealth = Awaited<ReturnType<typeof computeOrgHealth>>;
