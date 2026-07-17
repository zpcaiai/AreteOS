import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { sendRegistrationInviteEmail } from "@/lib/email";
import { created, ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { createRegistrationInvite, revokeRegistrationInvite } from "@/lib/registration-invites";
import { writeSecurityAudit } from "@/lib/security-audit";

export async function GET() {
  return route(async () => {
    await requireAdmin();
    const invites = await prisma.registrationInvite.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, email: true, teamId: true, teamRole: true, expiresAt: true, usedAt: true, revokedAt: true, createdAt: true },
    });
    return ok({ invites });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const adminId = await requireAdmin();
    const body = await parseBody(req, z.object({
      email: z.string().email(),
      teamId: z.string().min(1).optional(),
      teamRole: z.enum(["admin", "member", "viewer"]).default("member"),
    }));
    const { invite, token } = await createRegistrationInvite({ ...body, invitedById: adminId });
    let link: string;
    try {
      link = await sendRegistrationInviteEmail(invite.email, token);
    } catch (error) {
      await prisma.registrationInvite.update({ where: { id: invite.id }, data: { revokedAt: new Date() } });
      throw error;
    }
    await writeSecurityAudit(req, { actorId: adminId, action: "invite.create", targetType: "registration_invite", targetId: invite.id, metadata: { teamRole: body.teamRole } });
    return created({
      invite: { id: invite.id, email: invite.email, expiresAt: invite.expiresAt },
      ...(process.env.NODE_ENV !== "production" ? { debugLink: link } : {}),
    });
  });
}

export async function DELETE(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const adminId = await requireAdmin();
    const body = await parseBody(req, z.object({ id: z.string().min(1) }));
    const result = await revokeRegistrationInvite(body.id, adminId);
    await writeSecurityAudit(req, { actorId: adminId, action: "invite.revoke", targetType: "registration_invite", targetId: body.id });
    return ok(result);
  });
}
