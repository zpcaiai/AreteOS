// Child Development OS — service. Computes a child's development scoreboard.
import { prisma } from "../db";
import * as S from "./scoring";

export async function computeChild(childId: string) {
  const [assessment, env, autonomy, resilience, mindsetLogs, mindsetGrowth, curiosity, creativity, coaching, projects] = await Promise.all([
    prisma.childAssessment.findFirst({ where: { childId }, orderBy: { createdAt: "desc" } }),
    prisma.learningEnvironment.findFirst({ where: { childId }, orderBy: { createdAt: "desc" } }),
    prisma.learningAutonomyLog.findFirst({ where: { childId }, orderBy: { createdAt: "desc" } }),
    prisma.resilienceLog.findFirst({ where: { childId }, orderBy: { createdAt: "desc" } }),
    prisma.growthMindsetLog.count({ where: { childId } }),
    prisma.growthMindsetLog.count({ where: { childId, mindset: "GROWTH" } }),
    prisma.curiosityLog.count({ where: { childId } }),
    prisma.creativityProject.findFirst({ where: { childId }, orderBy: { createdAt: "desc" } }),
    prisma.parentCoachingSession.findFirst({ where: { childId }, orderBy: { createdAt: "desc" } }),
    prisma.childProject.count({ where: { childId } }),
  ]);

  const a = assessment;
  const explorer = Math.min(1, curiosity / 10) || (a?.curiosity ?? 0);
  const creator = creativity?.confidence ?? (a?.creativity ?? 0);
  const builder = Math.min(1, projects / 5) || (a?.creativity ?? 0);
  const researcher = a?.problemSolving ?? 0;
  const problemSolver = a?.problemSolving ?? 0;
  const resilienceScore = resilience?.resilienceScore ?? (a?.resilience ?? 0);
  const autonomyScore = autonomy?.autonomyScore ?? (a?.autonomy ?? 0);
  const growthMindset = mindsetLogs > 0 ? mindsetGrowth / mindsetLogs : 0;
  const parentSupport = coaching?.supportScore ?? 0;

  const inputs: S.ChildInputs = { explorer, creator, builder, researcher, problemSolver, resilience: resilienceScore, autonomy: autonomyScore, growthMindset, parentSupport };
  const global = S.globalChildScore(inputs);
  return { ...inputs, environmentScore: env ? S.environmentScore(env) : 0, globalScore: global };
}

export type ChildHealth = Awaited<ReturnType<typeof computeChild>>;
