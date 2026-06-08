import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ConversationGuide } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "leadership");
    const b = await parseBody(req, z.object({
      role: z.enum(["CARETAKER","GUIDE","COACH","MENTOR","SPONSOR","AWAKENER"]),
      situation: z.string().min(1), organizationId: z.string().optional(),
    }));
    const out = await ConversationGuide.run({ role: b.role, situation: b.situation });
    const conversation = await prisma.leadershipConversation.create({ data: {
      userId, organizationId: b.organizationId ?? null, conversationType: b.role,
      script: out.script, questions: out.questions, followUps: out.followUps, effectiveness: out.effectiveness,
    } });
    return created({ conversation });
  });
}
