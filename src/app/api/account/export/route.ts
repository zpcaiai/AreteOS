import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { prisma } from "@/lib/db";

// GET /api/account/export -> portable JSON export of the user's own data.
// Trust as a feature: the user can take their data with them at any time.
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [user, scoreSnapshots, decisions, reflections, habits, identities, values, mentalModels, personality, membership, events] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, createdAt: true } }),
      prisma.scoreSnapshot.findMany({ where: { userId }, orderBy: { date: "asc" }, take: 5000 }),
      prisma.decision.findMany({ where: { userId }, take: 2000 }),
      prisma.reflection.findMany({ where: { userId }, take: 2000 }),
      prisma.habit.findMany({ where: { userId }, take: 1000 }),
      prisma.identity.findMany({ where: { userId }, take: 1000 }),
      prisma.value.findMany({ where: { userId }, take: 1000 }),
      prisma.mentalModel.findMany({ where: { userId }, take: 2000 }),
      prisma.personalityState.findUnique({ where: { userId } }),
      prisma.membership.findUnique({ where: { userId } }),
      prisma.domainEvent.findMany({ where: { userId }, orderBy: { occurredAt: "desc" }, take: 5000 }),
    ]);
    return ok(
      {
        format: "arete-export-v1",
        generatedAt: new Date().toISOString(),
        user,
        counts: {
          scoreSnapshots: scoreSnapshots.length, decisions: decisions.length, reflections: reflections.length,
          habits: habits.length, identities: identities.length, values: values.length, mentalModels: mentalModels.length, events: events.length,
        },
        data: { scoreSnapshots, decisions, reflections, habits, identities, values, mentalModels, personality, membership, events },
      },
      { headers: { "Content-Disposition": 'attachment; filename="arete-export.json"' } },
    );
  });
}
