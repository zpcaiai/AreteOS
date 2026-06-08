import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { clarityScore, coherenceScore, globalWorldviewScore, type Dimensions } from "@/lib/cosmos/scoring";

const s = z.number().min(0).max(1).default(0);
const STAGES = ["INHERITED","QUESTIONED","CONSCIOUS","INTEGRATED","GENERATIVE","LEGACY"] as const;

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({
      reality: s, humanNature: s, meaning: s, success: s, failure: s,
      responsibility: s, time: s, change: s, risk: s, purpose: s,
      stage: z.enum(STAGES).default("QUESTIONED"), summary: z.string().default(""),
    }));
    const dims: Dimensions = { reality: b.reality, humanNature: b.humanNature, meaning: b.meaning, success: b.success,
      failure: b.failure, responsibility: b.responsibility, time: b.time, change: b.change, risk: b.risk, purpose: b.purpose };
    const conflicts = await prisma.assumptionConflict.findMany({ where: { userId } });
    const clarity = clarityScore(dims);
    const coherence = coherenceScore(conflicts);
    const global = globalWorldviewScore({ clarity, coherence, assumptionAwareness: clarity, meaning: b.meaning, missionAlignment: b.purpose, identityAlignment: b.purpose, wisdom: clarity });
    const profile = await prisma.worldviewProfile.create({ data: {
      userId, ...dims, clarityScore: clarity, coherenceScore: coherence, globalScore: global, stage: b.stage, summary: b.summary,
    } });
    await prisma.worldviewEvolution.create({ data: { userId, stage: b.stage, note: "Profile recorded" } });
    return created({ profile });
  });
}
