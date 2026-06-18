// ───────────────────── Healing OS · Relapse-prevention service ─────────────────────
import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { createPracticeTasks } from "./practice";
import { detectRelapseSignals, recommendRelapseNextSkills, maintenancePracticeTasks } from "./relapse-logic";
import { RelapsePrevention } from "../agents/healing-relapse";
import {
  type RelapsePreventionInput,
  type RelapsePreventionOutput,
  type RelapsePreventionCore,
  type RelapseCheckInInput,
  RelapsePreventionCoreSchema,
} from "../domain/relapse-prevention";

export interface RelapseResult extends RelapsePreventionOutput {
  planId: string;
}

export async function runRelapsePrevention(input: RelapsePreventionInput): Promise<RelapseResult> {
  const risk = input.safetyContext.riskLevel;
  if (risk === "red") throw new Error("Relapse prevention is routed to urgent crisis response during red risk.");

  const { activeSignals, relapseRisk } = detectRelapseSignals(input.recentSignals, risk);
  const sessionId = input.sessionId ?? "relapse";

  let core: RelapsePreventionCore;
  try {
    core = await RelapsePrevention.run({
      currentConcern: input.currentConcern ?? "",
      mode: input.mode,
      relapseRisk,
      activeSignals,
      oldLoops: input.knownPatterns?.oldLoops ?? [],
      coreBeliefs: input.knownPatterns?.coreBeliefs ?? [],
      language: "zh",
    });
  } catch (e) {
    reportError(e, { surface: "relapse", stage: "run" });
    core = RelapsePreventionCoreSchema.parse({
      relapseRiskMap: { riskLevel: relapseRisk, mainTriggers: [], earlyWarningSignals: [], oldPatternScripts: [] },
      ifThenPlans: [{ ifSignal: "连续两天没做练习", thenAction: "做一个 5 分钟最低任务", relatedSkill: "cbt", difficulty: "easy" }],
      recoveryProtocol: { twentyFourHourPlan: ["暂停深度分析", "优先身体照顾", "一个最低行动"], sevenDayPlan: [], thirtyDayMaintenancePlan: [] },
      supportSystemPlan: {},
      identityMaintenance: { oldIdentityWarning: "'我又失败了'是旧身份", newIdentityReminder: "我可以更快回到轨道", minimumEvidenceAction: "做一个 5 分钟任务", repairStatement: "旧模式被触发不是失败" },
      practiceMaintenancePlan: { minimumDailyPractice: "每天一个 5 分钟任务", weeklyReviewQuestions: [], fallbackWhenLowEnergy: "写一句'我注意到了信号'" },
      relapseReviewTemplate: { whatHappened: "", whatTriggeredIt: "", whatOldPatternAppeared: "", whatHelpedEvenALittle: "", whatToTryNextTime: "" },
    });
  }
  // Deterministic: the model can't under-rate the relapse band.
  core.relapseRiskMap.riskLevel = relapseRisk;

  const output: RelapsePreventionOutput = {
    ...core,
    nextRecommendedSkills: recommendRelapseNextSkills(relapseRisk),
    cautions: ["复发不是失败，而是启动维护协议的信号。", "本工具不承诺永久治愈；风险升高时请优先安全与求助。"],
  };

  const planId = await persist(input, output, sessionId);
  if (planId) await createPracticeTasks(maintenancePracticeTasks(core, { userId: input.userId, sessionId, sourceId: planId }));
  return { ...output, planId };
}

async function persist(input: RelapsePreventionInput, output: RelapsePreventionOutput, sessionId: string): Promise<string> {
  try {
    const row = await prisma.relapsePreventionPlan.create({
      data: {
        userId: input.userId,
        sessionId,
        mode: input.mode,
        currentConcern: input.currentConcern,
        relapseRiskMap: output.relapseRiskMap,
        ifThenPlans: output.ifThenPlans,
        recoveryProtocol: output.recoveryProtocol,
        supportSystemPlan: output.supportSystemPlan,
        identityMaintenance: output.identityMaintenance,
        practiceMaintenancePlan: output.practiceMaintenancePlan,
        relapseReviewTemplate: output.relapseReviewTemplate,
        nextRecommendedSkills: output.nextRecommendedSkills,
        cautions: output.cautions,
      },
      select: { id: true },
    });
    await recordHealingEvent({ userId: input.userId, sessionId, module: "relapse", type: "RelapsePlanCreated", recordId: row.id, payload: { relapseRisk: output.relapseRiskMap.riskLevel } });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "relapse", stage: "persist" });
    return "";
  }
}

export async function recordRelapseCheckIn(input: RelapseCheckInInput, safetyRisk: "green" | "yellow" | "orange" | "red"): Promise<{ id: string; relapseRisk: string } | null> {
  const { relapseRisk } = detectRelapseSignals(input.signals, safetyRisk);
  try {
    const row = await prisma.relapseCheckIn.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        planId: input.planId,
        signals: input.signals,
        riskLevel: relapseRisk,
        actionTaken: input.actionTaken ?? undefined,
        userReflection: input.userReflection,
      },
      select: { id: true },
    });
    await recordHealingEvent({ userId: input.userId, sessionId: input.sessionId, module: "relapse-checkin", type: "RelapseCheckIn", recordId: row.id, payload: { relapseRisk } });
    return { id: row.id, relapseRisk };
  } catch (e) {
    reportError(e, { surface: "relapse", stage: "checkin" });
    return null;
  }
}
