import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, requireSameOrigin, route } from "@/lib/http";
import { persistentRateLimit } from "@/lib/rate-limit";
import { addMemberByEmail, getTeamDetail, removeMember, updateMemberRole } from "@/lib/teams";

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
    return created(await addMemberByEmail(id, userId, body.email, body.role));
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const { id } = await params;
    const body = await parseBody(req, z.object({ userId: z.string().min(1), role: z.enum(["admin", "member", "viewer"]) }));
    return ok(await updateMemberRole(id, userId, body.userId, body.role));
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const { id } = await params;
    const body = await parseBody(req, z.object({ userId: z.string().min(1) }));
    return ok(await removeMember(id, userId, body.userId));
  });
}
