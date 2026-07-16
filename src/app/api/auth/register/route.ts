import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSession, privacyHash, requestSessionMetadata, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { HttpError, parseBody, requireSameOrigin, route } from "@/lib/http";
import { anonymousClientKey, persistentRateLimit } from "@/lib/rate-limit";
import { issueAuthToken } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/email";
import { validRegistrationInvite } from "@/lib/registration-invites";

const LEGAL_VERSION = process.env.TERMS_VERSION || "2026-07-16-draft";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const registrationMode = process.env.REGISTRATION_MODE ?? (process.env.NODE_ENV === "production" ? "closed" : "open");
    if (registrationMode === "closed") throw new HttpError(403, "Registration is currently closed");
    const limited = await persistentRateLimit({ key: `auth:register:${anonymousClientKey(req)}`, limit: 4, windowMs: 60 * 60_000 });
    if (limited) return limited;
    const body = await parseBody(req, z.object({
      email: z.string().email().transform((v) => v.trim().toLowerCase()),
      password: z.string().min(12).max(200),
      name: z.string().trim().max(100).optional(),
      acceptTerms: z.literal(true),
      inviteToken: z.string().min(20).max(500).optional(),
    }));
    const invite = registrationMode === "invite"
      ? await validRegistrationInvite(body.inviteToken || "", body.email)
      : null;
    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const now = new Date();
    const verificationRequired = process.env.AUTH_REQUIRE_EMAIL_VERIFICATION === "true" || process.env.NODE_ENV === "production";
    const metadata = requestSessionMetadata(req);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: body.email, name: body.name || null, passwordHash: hashPassword(body.password),
          emailVerifiedAt: verificationRequired ? null : now,
          termsAcceptedAt: now, privacyAcceptedAt: now, consentVersion: LEGAL_VERSION,
          legalConsents: { create: [
            { document: "terms", version: LEGAL_VERSION, ipHash: metadata.ip ? privacyHash(metadata.ip) : null, userAgent: metadata.userAgent },
            { document: "privacy", version: process.env.PRIVACY_VERSION || LEGAL_VERSION, ipHash: metadata.ip ? privacyHash(metadata.ip) : null, userAgent: metadata.userAgent },
          ] },
        },
      });
      if (invite) {
        const claimed = await tx.registrationInvite.updateMany({
          where: { id: invite.id, usedAt: null, revokedAt: null, expiresAt: { gt: now } },
          data: { usedAt: now },
        });
        if (!claimed.count) throw new HttpError(409, "Invitation was already used");
        if (invite.teamId) {
          const team = await tx.team.findUnique({ where: { id: invite.teamId }, select: { id: true, seats: true, status: true, expiresAt: true } });
          if (!team || team.status !== "ACTIVE" || (team.expiresAt && team.expiresAt <= now)) throw new HttpError(409, "Invited team is unavailable");
          const count = await tx.teamMember.count({ where: { teamId: team.id } });
          if (count >= team.seats) throw new HttpError(409, "Invited team has no available seats");
          await tx.teamMember.create({ data: { teamId: team.id, userId: created.id, role: invite.teamRole } });
        }
      }
      return created;
    });
    if (verificationRequired) {
      const token = await issueAuthToken(user.id, "EMAIL_VERIFY", 24 * 60 * 60_000);
      const debugLink = await sendVerificationEmail(user.email, token);
      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, verificationRequired: true, ...(process.env.NODE_ENV !== "production" ? { debugLink } : {}) }, { status: 201 });
    }
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, verificationRequired: false }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, await createSession(user.id, metadata), sessionCookieOptions);
    return res;
  });
}
