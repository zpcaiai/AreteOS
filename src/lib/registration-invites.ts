import crypto from "node:crypto";
import { prisma } from "./db";
import { HttpError } from "./http";

const hash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export async function createRegistrationInvite(input: {
  email: string;
  invitedById: string;
  teamId?: string;
  teamRole?: "admin" | "member" | "viewer";
  ttlMs?: number;
}) {
  const token = crypto.randomBytes(32).toString("base64url");
  const email = input.email.trim().toLowerCase();
  await prisma.registrationInvite.updateMany({
    where: { email, teamId: input.teamId ?? null, usedAt: null, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  const invite = await prisma.registrationInvite.create({
    data: {
      email,
      tokenHash: hash(token),
      invitedById: input.invitedById,
      teamId: input.teamId,
      teamRole: input.teamRole ?? "member",
      expiresAt: new Date(Date.now() + (input.ttlMs ?? 7 * 86_400_000)),
    },
  });
  return { invite, token };
}

export async function validRegistrationInvite(token: string, email: string) {
  const invite = await prisma.registrationInvite.findUnique({ where: { tokenHash: hash(token) } });
  if (!invite || invite.email !== email.trim().toLowerCase() || invite.usedAt || invite.revokedAt || invite.expiresAt <= new Date()) {
    throw new HttpError(403, "Invitation is invalid or expired");
  }
  return invite;
}

export async function revokeRegistrationInvite(id: string, invitedById: string) {
  const result = await prisma.registrationInvite.updateMany({
    where: { id, invitedById, usedAt: null, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  if (!result.count) throw new HttpError(404, "Invitation not found");
  return { revoked: true };
}
