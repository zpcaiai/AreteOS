import { getUserId } from "@/lib/auth";
import { route } from "@/lib/http";
import { prisma } from "@/lib/db";
import { exportAllUserData } from "@/lib/data-rights";
import { writeSecurityAudit } from "@/lib/security-audit";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [user, data] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, emailVerifiedAt: true, termsAcceptedAt: true, privacyAcceptedAt: true, consentVersion: true, createdAt: true, updatedAt: true } }),
      exportAllUserData(userId),
    ]);
    await writeSecurityAudit(req, { actorId: userId, action: "account.export", targetType: "user", targetId: userId });
    return new Response(JSON.stringify({ format: "arete-export-v2", generatedAt: new Date().toISOString(), user, data }, (_, value) => typeof value === "bigint" ? value.toString() : value), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": 'attachment; filename="arete-export.json"', "Cache-Control": "private, no-store" },
    });
  });
}
