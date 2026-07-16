import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { activeGuardianConsent, GUARDIAN_CONSENT_VERSION } from "@/lib/guardian-consent";
import { ok, created, parseBody, requireSameOrigin, route } from "@/lib/http";
import { privacyHash, requestSessionMetadata } from "@/lib/session";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const consent = await activeGuardianConsent(userId);
    return ok({ consent: consent ? { id: consent.id, guardianName: consent.guardianName, relationship: consent.relationship, version: consent.version, acceptedAt: consent.acceptedAt } : null });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      guardianName: z.string().trim().min(2).max(120),
      relationship: z.enum(["parent", "legal_guardian", "authorized_caregiver"]),
      confirmAdult: z.literal(true),
      acceptChildPrivacy: z.literal(true),
    }));
    const metadata = requestSessionMetadata(req);
    await prisma.guardianConsent.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    const consent = await prisma.guardianConsent.create({
      data: {
        userId,
        guardianName: body.guardianName,
        relationship: body.relationship,
        version: GUARDIAN_CONSENT_VERSION,
        ipHash: metadata.ip ? privacyHash(metadata.ip) : null,
        userAgent: metadata.userAgent,
      },
    });
    return created({ consent: { id: consent.id, version: consent.version, acceptedAt: consent.acceptedAt } });
  });
}

export async function DELETE(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const result = await prisma.guardianConsent.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    return ok({ revoked: result.count });
  });
}
