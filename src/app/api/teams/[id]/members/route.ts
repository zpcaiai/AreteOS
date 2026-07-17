import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, requireSameOrigin, route } from "@/lib/http";
import { persistentRateLimit } from "@/lib/rate-limit";
import { addMemberByEmail, getTeamDetail, removeMember, updateMemberRole } from "@/lib/teams";
import { writeSecurityAudit } from "@/lib/security-audit";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await params;
    return ok(await getTeamDetail(id, userId));
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const limited = await persistentRateLimit({ key: `team-member:${userId}`, limit: 30, windowMs: 60 * 60_000 });
    if (limited) return limited;
    const { id } = await params;
    const body = await parseBody(req, z.object({ email: z.string().email(), role: z.enum(["admin", "member", "viewer"]).default("member") }));
    const member = await addMemberByEmail(id, userId, body.email, body.role);
    await writeSecurityAudit(req, { actorId: userId, action: "team.member.add", targetType: "team", targetId: id, metadata: { role: body.role } });
    return created(member);
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const { id } = await params;
    const body = await parseBody(req, z.object({ userId: z.string().min(1), role: z.enum(["admin", "member", "viewer"]) }));
    const member = await updateMemberRole(id, userId, body.userId, body.role);
    await writeSecurityAudit(req, { actorId: userId, action: "team.member.role", targetType: "team", targetId: id, metadata: { memberId: body.userId, role: body.role } });
    return ok(member);
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const { id } = await params;
    const body = await parseBody(req, z.object({ userId: z.string().min(1) }));
    const result = await removeMember(id, userId, body.userId);
    await writeSecurityAudit(req, { actorId: userId, action: "team.member.remove", targetType: "team", targetId: id, metadata: { memberId: body.userId } });
    return ok(result);
  });
}
