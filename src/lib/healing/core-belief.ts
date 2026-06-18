// ───────────────────── Healing OS · Core-belief service ─────────────────────
import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { createPracticeTasks } from "./practice";
import { recommendBeliefNextSkills, experimentsToPracticeTasks } from "./belief-logic";
import { CoreBeliefReconstruction } from "../agents/healing-core-belief";
import {
  type CoreBeliefInput,
  type CoreBeliefOutput,
  type CoreBeliefCore,
  CoreBeliefCoreSchema,
} from "../domain/belief";

export interface CoreBeliefResult extends CoreBeliefOutput {
  recordId: string;
}

export async function runCoreBeliefReconstruction(input: CoreBeliefInput): Promise<CoreBeliefResult> {
  const risk = input.safetyContext.riskLevel;
  if (risk === "red") throw new Error("Core belief reconstruction is blocked during red risk state.");
  const depth = risk === "orange" ? "shallow" : input.preferences?.depth ?? "standard";

  let core: CoreBeliefCore;
  try {
    core = await CoreBeliefReconstruction.run({
      problemStatement: input.problemStatement,
      behaviors: input.diltsContext?.behaviors ?? [],
      beliefs: input.diltsContext?.beliefs ?? [],
      identities: input.diltsContext?.identities ?? [],
      depth,
      language: input.preferences?.language ?? "zh",
    });
  } catch (e) {
    reportError(e, { surface: "core-belief", stage: "run" });
    core = CoreBeliefCoreSchema.parse({
      extractedBeliefs: [{ belief: input.problemStatement, type: "core_belief", evidence: "", protectionFunction: "", longTermCost: "" }],
      primaryBeliefPattern: { name: "", summary: "", oldLoop: "", keyFear: "", keyProtection: "", keyCost: "" },
    });
  }

  const cautions = [
    "这不是诊断，也不代表某个信念一定来自童年；用谨慎语言看待成因。",
    "新信念是可被现实检验的假设，不是必须强行相信的口号。",
  ];
  const output: CoreBeliefOutput = { ...core, cautions, nextRecommendedSkills: recommendBeliefNextSkills(core, risk) };

  const recordId = await persist(input, output);
  if (recordId && depth !== "shallow") {
    await createPracticeTasks(experimentsToPracticeTasks(core, { userId: input.userId, sessionId: input.sessionId, sourceId: recordId }));
  }
  return { ...output, recordId };
}

async function persist(input: CoreBeliefInput, output: CoreBeliefOutput): Promise<string> {
  try {
    const row = await prisma.coreBeliefRecord.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        formulationId: input.formulationId,
        intakeId: input.intakeId,
        problemStatement: input.problemStatement,
        extractedBeliefs: output.extractedBeliefs,
        primaryBeliefPattern: output.primaryBeliefPattern,
        reconstructedBeliefs: output.reconstructedBeliefs,
        behavioralExperiments: output.behavioralExperiments,
        identitySeeds: output.identitySeeds,
        cautions: output.cautions,
        nextRecommendedSkills: output.nextRecommendedSkills,
      },
      select: { id: true },
    });
    await recordHealingEvent({
      userId: input.userId, sessionId: input.sessionId, module: "core-belief", type: "BeliefsReconstructed", recordId: row.id,
      payload: { beliefTypes: output.extractedBeliefs.map((b) => b.type), experiments: output.behavioralExperiments.length },
    });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "core-belief", stage: "persist" });
    return "";
  }
}
