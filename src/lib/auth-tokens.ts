import crypto from "node:crypto";
import { prisma } from "./db";

export type AuthTokenType = "EMAIL_VERIFY" | "PASSWORD_RESET";

const digest = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export async function issueAuthToken(userId: string, type: AuthTokenType, ttlMs: number) {
  const token = crypto.randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.authToken.deleteMany({ where: { userId, type, usedAt: null } }),
    prisma.authToken.create({ data: { userId, type, tokenHash: digest(token), expiresAt: new Date(Date.now() + ttlMs) } }),
  ]);
  return token;
}

export async function consumeAuthToken(token: string, type: AuthTokenType) {
  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const row = await tx.authToken.findUnique({ where: { tokenHash: digest(token) } });
    if (!row || row.type !== type || row.usedAt || row.expiresAt <= now) return null;
    const claimed = await tx.authToken.updateMany({ where: { id: row.id, usedAt: null }, data: { usedAt: now } });
    return claimed.count === 1 ? row.userId : null;
  });
}
