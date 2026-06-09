import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const reviews = await prisma.decisionJournalReview.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
    const lessons = reviews.flatMap((r) => r.lessons);
    const biases = reviews.map((r) => r.biasDetected).filter(Boolean);
    return ok({ lessons, repeatedBiases: biases, reviews });
  });
}
