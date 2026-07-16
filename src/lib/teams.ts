// B2B teams. A team grants PRO to its members (see membership/service.ts). Uses raw SQL
// against teams/team_members so it doesn't depend on the generated Prisma model; user
// lookups use the existing typed client. Owner-guarded; seat-limited.

import { prisma } from "./db";
import { HttpError } from "./http";
import { reportError } from "./logger";

const uuid = () => globalThis.crypto?.randomUUID?.() ?? `tm_${Date.now()}_${Math.random().toString(36).slice(2)}`;

export interface TeamSummary { id: string; name: string; seats: number; ownerId: string; role: string; memberCount: number }
export interface TeamMemberView { userId: string; email: string; name: string | null; role: string; createdAt: number }
export interface TeamDetail { id: string; name: string; seats: number; ownerId: string; status: string; members: TeamMemberView[] }

/** Membership guard used by shared resources. */
export async function requireTeamMember(teamId: string, userId: string) {
  const member = await prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId } }, include: { team: true } });
  if (!member || member.team.status !== "ACTIVE" || (member.team.expiresAt && member.team.expiresAt <= new Date())) throw new HttpError(403, "你无权访问该团队工作区");
  return member;
}

/** Create a team and enroll the owner as its first member. */
export async function createTeam(ownerId: string, name: string, seats: number): Promise<{ id: string }> {
  const id = uuid();
  const clean = name.trim().slice(0, 120) || "My team";
  const s = Math.max(1, Math.min(500, Math.round(seats)));
  await prisma.$executeRaw`
    INSERT INTO teams ("id","name","ownerId","seats","grantsTier","status","createdAt")
    VALUES (${id}, ${clean}, ${ownerId}, ${s}, 'PRO', 'ACTIVE', now())
  `;
  await prisma.$executeRaw`
    INSERT INTO team_members ("id","teamId","userId","role","createdAt")
    VALUES (${uuid()}, ${id}, ${ownerId}, 'owner', now())
    ON CONFLICT ("teamId","userId") DO NOTHING
  `;
  return { id };
}

/** Teams the user owns or belongs to, with seat usage. */
export async function listTeamsForUser(userId: string): Promise<TeamSummary[]> {
  const rows = await prisma.$queryRaw<{ id: string; name: string; seats: number; ownerId: string; role: string; memberCount: number }[]>`
    SELECT t.id, t.name, t.seats, t."ownerId", tm.role,
      (SELECT count(*) FROM team_members x WHERE x."teamId" = t.id)::int AS "memberCount"
    FROM team_members tm JOIN teams t ON t.id = tm."teamId"
    WHERE tm."userId" = ${userId}
    ORDER BY t."createdAt" DESC
  `;
  return rows.map((r) => ({ ...r, memberCount: Number(r.memberCount), seats: Number(r.seats) }));
}

async function ownedTeam(teamId: string, ownerId: string) {
  const t = await prisma.$queryRaw<{ id: string; name: string; seats: number; ownerId: string; status: string }[]>`
    SELECT id, name, seats, "ownerId", status FROM teams WHERE id = ${teamId} AND "ownerId" = ${ownerId} LIMIT 1
  `;
  if (!t[0]) throw new HttpError(404, "团队不存在或你不是所有者");
  return t[0];
}

/** Team detail with members (owner-only). */
export async function getTeamDetail(teamId: string, ownerId: string): Promise<TeamDetail> {
  const t = await ownedTeam(teamId, ownerId);
  const members = await prisma.$queryRaw<{ userId: string; role: string; createdAt: Date }[]>`
    SELECT "userId", role, "createdAt" FROM team_members WHERE "teamId" = ${teamId} ORDER BY "createdAt" ASC
  `;
  const users = await prisma.user.findMany({ where: { id: { in: members.map((m) => m.userId) } }, select: { id: true, email: true, name: true } });
  const byId = new Map(users.map((u) => [u.id, u]));
  return {
    id: t.id, name: t.name, seats: Number(t.seats), ownerId: t.ownerId, status: t.status,
    members: members.map((m) => ({ userId: m.userId, email: byId.get(m.userId)?.email ?? "—", name: byId.get(m.userId)?.name ?? null, role: m.role, createdAt: new Date(m.createdAt).getTime() })),
  };
}

/** Add a member by email (owner-only, seat-limited). */
export async function addMemberByEmail(teamId: string, ownerId: string, email: string): Promise<{ added: boolean }> {
  const t = await ownedTeam(teamId, ownerId);
  const count = await prisma.$queryRaw<{ n: bigint }[]>`SELECT count(*)::bigint AS n FROM team_members WHERE "teamId" = ${teamId}`;
  if (Number(count[0]?.n ?? 0) >= Number(t.seats)) throw new HttpError(400, "席位已满，请增加席位或移除成员");
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() }, select: { id: true } });
  if (!user) throw new HttpError(404, "没有找到该邮箱对应的用户");
  await prisma.$executeRaw`
    INSERT INTO team_members ("id","teamId","userId","role","createdAt")
    VALUES (${uuid()}, ${teamId}, ${user.id}, 'member', now())
    ON CONFLICT ("teamId","userId") DO NOTHING
  `;
  return { added: true };
}

/** Remove a member (owner-only; cannot remove the owner). */
export async function removeMember(teamId: string, ownerId: string, userId: string): Promise<{ removed: number }> {
  await ownedTeam(teamId, ownerId);
  if (userId === ownerId) throw new HttpError(400, "不能移除团队所有者");
  const r = await prisma.$executeRaw`DELETE FROM team_members WHERE "teamId" = ${teamId} AND "userId" = ${userId} AND role <> 'owner'`;
  return { removed: Number(r) };
}

/** The tier a user is granted via any ACTIVE team membership, if any. Fail-safe. */
export async function teamGrantedTier(userId: string): Promise<string | null> {
  try {
    const rows = await prisma.$queryRaw<{ grantsTier: string }[]>`
      SELECT t."grantsTier" AS "grantsTier"
      FROM team_members tm JOIN teams t ON t.id = tm."teamId"
      WHERE tm."userId" = ${userId} AND t.status = 'ACTIVE' AND (t."expiresAt" IS NULL OR t."expiresAt" > now())
      LIMIT 1
    `;
    return rows[0]?.grantsTier ?? null;
  } catch (e) {
    reportError(e, { surface: "teams", op: "grantedTier" });
    return null;
  }
}
