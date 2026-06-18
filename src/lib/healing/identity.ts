// ───────────────────── Healing OS · Identity reconstruction service ─────────────────────
import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { createPracticeTask } from "./practice";
import { resolveIdentityMode, recommendIdentityNextSkills, identityPracticeTask, evidencePlaceholders } from "./identity-logic";
import { IdentityReconstruction } from "../agents/healing-identity";
import {
  type IdentityReconstructionInput,
  type IdentityReconstructionOutput,
  type IdentityReconstructionCore,
  type IdentityEvidenceInput,
  IdentityReconstructionCoreSchema,
} from "../domain/identity-rebuild";

export interface IdentityResult extends IdentityReconstructionOutput {
  recordId: string;
  mode: string;
}

export async function runIdentityReconstruction(input: IdentityReconstructionInput): Promise<IdentityResult> {
  const risk = input.safetyContext.riskLevel;
  if (risk === "red") throw new Error("Identity reconstruction is blocked during red risk state.");
  const mode = resolveIdentityMode(input.mode, risk);

  let core: IdentityReconstructionCore;
  try {
    core = await IdentityReconstruction.run({
      currentIdentityPain: input.currentIdentityPain,
      mode,
      oldBeliefs: input.knownPatterns?.oldBeliefs ?? [],
      successfulPracticeEvidence: input.knownPatterns?.successfulPracticeEvidence ?? [],
      importantValues: input.valuesContext?.importantValues ?? [],
      language: "zh",
    });
  } catch (e) {
    reportError(e, { surface: "identity", stage: "run" });
    core = IdentityReconstructionCoreSchema.parse({
      identityMap: { oldIdentityNarratives: [], transitionIdentities: [], newIdentitySeeds: [] },
      missionRecovery: {},
      dailyEvidencePlan: { identityStatement: "我是一个可以通过小行动积累能力的人", sevenDayEvidenceActions: [], minimumViableAction: "记录今天一个微小进展", fallbackAction: "写一句'我今天照顾了自己'" },
      identityPracticeTask: { title: "身份证据", description: "记录每日小证据", steps: [], completionMetric: "证据数量" },
      integrationSummary: "先从一个更真实、可验证的身份种子开始。",
    });
  }

  const output: IdentityReconstructionOutput = {
    ...core,
    nextRecommendedSkills: recommendIdentityNextSkills(core, risk),
    cautions: ["这不是承诺彻底治愈，也不否定你过去的痛苦。", "新身份是可被每日证据验证的种子，不是口号。"],
  };

  const recordId = await persist(input, output, mode);
  if (recordId && mode !== "light_identity_stabilization") {
    await createPracticeTask(identityPracticeTask(core, { userId: input.userId, sessionId: input.sessionId, sourceId: recordId }));
    await seedEvidence(evidencePlaceholders(core, { userId: input.userId, sessionId: input.sessionId, sourceId: recordId }));
  }
  return { ...output, recordId, mode };
}

async function persist(input: IdentityReconstructionInput, output: IdentityReconstructionOutput, mode: string): Promise<string> {
  try {
    const row = await prisma.identityReconstructionSession.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        mode,
        currentIdentityPain: input.currentIdentityPain,
        relatedFormulationId: input.relatedFormulationId,
        relatedBeliefRecordId: input.relatedBeliefRecordId,
        identityMap: output.identityMap,
        missionRecovery: output.missionRecovery,
        dailyEvidencePlan: output.dailyEvidencePlan,
        identityPracticeTask: output.identityPracticeTask,
        integrationSummary: output.integrationSummary,
        nextRecommendedSkills: output.nextRecommendedSkills,
        cautions: output.cautions,
      },
      select: { id: true },
    });
    await recordHealingEvent({ userId: input.userId, sessionId: input.sessionId, module: "identity", type: "IdentityReconstructed", recordId: row.id, payload: { mode, seeds: output.identityMap.newIdentitySeeds.length } });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "identity", stage: "persist" });
    return "";
  }
}

async function seedEvidence(rows: { userId: string; sessionId: string; identitySessionId?: string; identityStatement: string; evidenceAction: string }[]) {
  if (!rows.length) return;
  try {
    await prisma.identityEvidence.createMany({ data: rows });
  } catch (e) {
    reportError(e, { surface: "identity", stage: "seed-evidence" });
  }
}

export async function recordIdentityEvidence(input: IdentityEvidenceInput): Promise<{ id: string } | null> {
  try {
    const row = await prisma.identityEvidence.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        identitySessionId: input.identitySessionId,
        identityStatement: input.identityStatement,
        evidenceAction: input.evidenceAction,
        userReflection: input.userReflection,
        evidenceStrength: input.evidenceStrength,
        completed: input.completed,
      },
      select: { id: true },
    });
    await recordHealingEvent({ userId: input.userId, sessionId: input.sessionId, module: "identity-evidence", type: input.completed ? "IdentityEvidenceLogged" : "IdentityEvidenceNoted", recordId: row.id, payload: { completed: input.completed, strength: input.evidenceStrength } });
    return { id: row.id };
  } catch (e) {
    reportError(e, { surface: "identity", stage: "evidence" });
    return null;
  }
}
