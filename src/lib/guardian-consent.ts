import { prisma } from "./db";
import { HttpError } from "./http";

export const GUARDIAN_CONSENT_VERSION = "2026-07-16";

export async function activeGuardianConsent(userId: string) {
  return prisma.guardianConsent.findFirst({
    where: { userId, revokedAt: null, version: GUARDIAN_CONSENT_VERSION },
    orderBy: { acceptedAt: "desc" },
  });
}

export async function requireGuardianConsent(userId: string) {
  if (process.env.CHILD_FEATURE_ENABLED !== "true") throw new HttpError(403, "Child features are not enabled");
  if (process.env.CHILD_GUARDIAN_CONSENT_ENABLED !== "true") throw new HttpError(503, "Guardian consent enforcement is not configured");
  const consent = await activeGuardianConsent(userId);
  if (!consent) throw new HttpError(403, "Active guardian consent is required");
  return consent;
}
