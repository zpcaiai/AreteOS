// MISSION OS — analytics. Aggregates raw aggregates from PostgreSQL into the
// score set + global Growth Score + personality-state evaluation. Pure scoring is
// delegated to scoring.ts; this file is the read-model projector.

import { prisma } from "./db";
import * as score from "./scoring";
import { evaluateStage, type StageSignals, type StageEvaluation } from "./personality/stateMachine";
import type { EvolutionStage } from "./domain/enums";

const DAY = 86_400_000;
const since = (days: number) => new Date(Date.now() - days * DAY);

export interface ScoreSet {
  missionAlignment: number;
  identityAlignment: number;
  valueIntegrity: number;
  mentalModelUsage: number;
  firstPrinciple: number;
  decisionQuality: number;
  habitConsistency: number;
  mastery: number;
  leadership: number;
  legacy: number;
  reflection: number;
  growth: number;
}

export interface AnalyticsResult {
  scores: ScoreSet;
  stage: StageEvaluation;
  signals: StageSignals;
}

export async function computeScores(userId: string): Promise<AnalyticsResult> {
  const [
    missionCount,
    identities,
    valueRankings,
    decisions,
    modelsKnown,
    modelsAppliedRows,
    assumptions,
    rootCauseCount,
    habits,
    habitLogs,
    masteryLevels,
    leadershipMetric,
    menteeCount,
    assetCount,
    legacyProjectCount,
    reflections,
    personality,
  ] = await Promise.all([
    prisma.mission.count({ where: { userId, active: true } }),
    prisma.identity.findMany({ where: { userId } }),
    prisma.valueRanking.count({ where: { userId } }),
    prisma.decision.findMany({ where: { userId }, select: { quality: true, status: true } }),
    prisma.mentalModel.count({ where: { userId } }),
    prisma.modelUsageLog.findMany({ where: { userId }, select: { modelId: true }, distinct: ["modelId"] }),
    prisma.assumption.findMany({ where: { userId }, select: { valid: true } }),
    prisma.rootCause.count({ where: { userId } }),
    prisma.habit.findMany({ where: { userId, active: true }, select: { targetPerWeek: true } }),
    prisma.habitLog.count({ where: { habit: { userId }, done: true, date: { gte: since(30) } } }),
    prisma.masteryLevel.findMany({ where: { skill: { userId } } }),
    prisma.leadershipMetric.findFirst({ where: { userId }, orderBy: { date: "desc" } }),
    prisma.mentee.count({ where: { userId } }),
    prisma.knowledgeAsset.count({ where: { userId } }),
    prisma.legacyProject.count({ where: { userId } }),
    prisma.reflection.findMany({ where: { userId, date: { gte: since(30) } }, select: { depth: true, date: true } }),
    prisma.personalityState.findUnique({ where: { userId } }),
  ]);

  // Habit consistency over 30 days.
  const weeklyTarget = habits.reduce((a, h) => a + (h.targetPerWeek || 0), 0);
  const monthlyTarget = (weeklyTarget * 30) / 7;
  const habitConsistency = score.habitConsistencyScore({ completions: habitLogs, target: monthlyTarget });

  // Decisions.
  const reviewed = decisions.filter((d) => d.quality != null);
  const decisionQuality = reviewed.length
    ? reviewed.reduce((a, d) => a + (d.quality ?? 0), 0) / reviewed.length
    : 0;
  const aligned = reviewed.filter((d) => (d.quality ?? 0) >= 0.6).length;
  const valueIntegrity = score.valueIntegrityScore({ alignedDecisions: aligned, totalDecisions: reviewed.length });

  // Identity alignment: avg clarity × values-consistency × behavior match.
  const avgClarity = identities.length ? identities.reduce((a, i) => a + i.clarity, 0) / identities.length : 0;
  const valuesConsistency = Math.min(1, valueRankings / 5); // ~5 ranked values = solid
  const identityAlignment = score.identityAlignmentScore({
    clarity: avgClarity,
    valuesConsistency,
    behaviorMatch: habitConsistency,
  });

  const missionAlignment = score.missionAlignmentScore({
    clarity: missionCount > 0 ? 0.85 : 0.15,
    actionConsistency: habitConsistency,
  });

  const mentalModelUsage = score.mentalModelUsageScore({
    modelsApplied: modelsAppliedRows.length,
    modelsKnown,
  });

  const firstPrinciple = score.firstPrincipleScore({
    assumptionsTested: assumptions.filter((a) => a.valid !== null).length,
    assumptionsTotal: assumptions.length,
    rootCausesFound: rootCauseCount,
  });

  const mastery = masteryLevels.length
    ? masteryLevels.reduce(
        (a, m) =>
          a +
          score.masteryScore({
            knowledge: m.knowledge,
            execution: m.execution,
            problemSolving: m.problemSolving,
            teaching: m.teaching,
          }),
        0,
      ) / masteryLevels.length
    : 0;

  const leadership = leadershipMetric
    ? score.leadershipScore({
        communication: leadershipMetric.communication,
        influence: leadershipMetric.influence,
        delegation: leadershipMetric.delegation,
        teamBuilding: leadershipMetric.teamBuilding,
        decisionQuality: leadershipMetric.decisionQuality,
      })
    : 0;

  const legacy = score.legacyScore({
    mentees: menteeCount,
    knowledgeAssets: assetCount,
    institutions: legacyProjectCount,
  });

  const avgDepth = reflections.length ? reflections.reduce((a, r) => a + r.depth, 0) / reflections.length : 0;
  const daysReflected = new Set(reflections.map((r) => r.date.toISOString().slice(0, 10))).size;
  const reflection = score.reflectionScore({ avgDepth, daysReflected, daysInPeriod: 30 });

  const growth = score.growthScore({
    mission: missionAlignment,
    identity: identityAlignment,
    values: valueIntegrity,
    mentalModels: mentalModelUsage,
    firstPrinciples: firstPrinciple,
    decisions: decisionQuality,
    habits: habitConsistency,
    reflection,
    mastery,
  });

  const scores: ScoreSet = {
    missionAlignment, identityAlignment, valueIntegrity, mentalModelUsage, firstPrinciple,
    decisionQuality, habitConsistency, mastery, leadership, legacy, reflection, growth,
  };

  const signals: StageSignals = {
    awareness: reflection,
    valuesDiscovered: valuesConsistency,
    identityClarity: identityAlignment,
    habitConsistency,
    decisionQuality,
    mastery,
    leadership,
    legacy,
  };
  const currentStage: EvolutionStage = (personality?.stage as EvolutionStage) ?? "UNAWARE";
  const stage = evaluateStage(currentStage, signals);

  return { scores, stage, signals };
}

// ── Short-TTL read cache. computeScores runs ~17 queries; read paths
// (dashboard, analytics GET, twin) tolerate a few seconds of staleness. Writes
// call invalidateScores(). Per-process only — fine for a single Node server.
const _scoreCache = new Map<string, { at: number; data: AnalyticsResult }>();
const SCORE_TTL_MS = 30_000;

export async function computeScoresCached(userId: string): Promise<AnalyticsResult> {
  const hit = _scoreCache.get(userId);
  if (hit && Date.now() - hit.at < SCORE_TTL_MS) return hit.data;
  const data = await computeScores(userId);
  _scoreCache.set(userId, { at: Date.now(), data });
  return data;
}

export function invalidateScores(userId: string): void {
  _scoreCache.delete(userId);
}

const SCORE_KIND_MAP: [keyof ScoreSet, string][] = [
  ["missionAlignment", "MISSION_ALIGNMENT"], ["identityAlignment", "IDENTITY_ALIGNMENT"],
  ["valueIntegrity", "VALUE_INTEGRITY"], ["mentalModelUsage", "MENTAL_MODEL_USAGE"],
  ["firstPrinciple", "FIRST_PRINCIPLE"], ["decisionQuality", "DECISION_QUALITY"],
  ["habitConsistency", "HABIT_CONSISTENCY"], ["mastery", "MASTERY"], ["leadership", "LEADERSHIP"],
  ["legacy", "LEGACY"], ["reflection", "REFLECTION"], ["growth", "GROWTH"],
];

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

/** Persist a full score snapshot (call after meaningful events / nightly). */
export async function snapshotScores(userId: string, scores?: ScoreSet): Promise<ScoreSet> {
  const s = scores ?? (await computeScores(userId)).scores;
  await prisma.scoreSnapshot.createMany({
    data: SCORE_KIND_MAP.map(([k, kind]) => ({ userId, kind: kind as never, value: s[k] })),
  });
  return s;
}

/**
 * Advance the personality stage when its gate clears, recording a transition;
 * otherwise just persist progress. Uses a precomputed evaluation when given.
 */
export async function maybeAdvanceStage(userId: string, evaluation?: StageEvaluation) {
  const stage = evaluation ?? (await computeScores(userId)).stage;
  await prisma.personalityState.upsert({
    where: { userId }, update: {}, create: { userId, stage: stage.current as never },
  });
  if (stage.shouldAdvance && stage.next) {
    await prisma.personalityState.update({
      where: { userId }, data: { stage: stage.next as never, progress: 0, enteredAt: new Date() },
    });
    await prisma.personalityTransition.create({
      data: { userId, fromStage: stage.current as never, toStage: stage.next as never, reason: `gate ${String(stage.gate)} ≥ ${stage.threshold}` },
    });
    return { advanced: true as const, from: stage.current, to: stage.next };
  }
  await prisma.personalityState.update({ where: { userId }, data: { progress: stage.progress } });
  return { advanced: false as const, stage: stage.current, progress: stage.progress };
}

/**
 * One-shot progress recorder: computes scores once, snapshots them at most once
 * per day (unless `force`), and advances the personality stage if its gate clears.
 * Wire this into loop-critical writes (reflection, decision review) and a daily job.
 */
export async function recordProgress(userId: string, opts: { force?: boolean } = {}) {
  const { scores, stage } = await computeScores(userId);
  const existing = await prisma.scoreSnapshot.findFirst({
    where: { userId, kind: "GROWTH", date: { gte: startOfToday() } },
  });
  if (opts.force || !existing) await snapshotScores(userId, scores);
  const transition = await maybeAdvanceStage(userId, stage);
  invalidateScores(userId);
  return { scores, stage, transition };
}
