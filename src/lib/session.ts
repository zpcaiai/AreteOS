import crypto from "node:crypto";
import { prisma } from "./db";

const TTL_SECONDS = 60 * 60 * 24 * 14;
export const SESSION_COOKIE = "arete_session";

function tokenHash(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function privacySecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret && (process.env.NODE_ENV !== "production" || secret.length >= 32)) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET is required in production");
  return "local-development-only";
}

export function privacyHash(value: string) {
  return crypto.createHmac("sha256", privacySecret()).update(value).digest("hex");
}

export interface SessionMetadata {
  ip?: string | null;
  userAgent?: string | null;
}

export function requestSessionMetadata(req: Request): SessionMetadata {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
  return { ip, userAgent: req.headers.get("user-agent")?.slice(0, 500) };
}

export async function createSession(userId: string, metadata: SessionMetadata = {}) {
  const token = crypto.randomBytes(32).toString("base64url");
  await prisma.authSession.create({
    data: {
      userId,
      tokenHash: tokenHash(token),
      expiresAt: new Date(Date.now() + TTL_SECONDS * 1000),
      ipHash: metadata.ip ? privacyHash(metadata.ip) : null,
      userAgent: metadata.userAgent?.slice(0, 500) ?? null,
    },
  });
  return token;
}

export async function verifySession(token: string | undefined | null): Promise<string | null> {
  if (!token || token.length < 32 || token.length > 100) return null;
  const now = new Date();
  const session = await prisma.authSession.findUnique({
    where: { tokenHash: tokenHash(token) },
    select: { id: true, userId: true, expiresAt: true, revokedAt: true, lastSeenAt: true },
  });
  if (!session || session.revokedAt || session.expiresAt <= now) return null;
  if (now.getTime() - session.lastSeenAt.getTime() > 15 * 60_000) {
    void prisma.authSession.update({ where: { id: session.id }, data: { lastSeenAt: now } }).catch(() => undefined);
  }
  return session.userId;
}

export async function revokeSession(token: string | undefined | null) {
  if (!token) return;
  await prisma.authSession.updateMany({
    where: { tokenHash: tokenHash(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: TTL_SECONDS,
};
