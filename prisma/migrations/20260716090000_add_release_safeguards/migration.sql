CREATE TABLE "registration_invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "teamId" TEXT,
    "teamRole" TEXT NOT NULL DEFAULT 'member',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "registration_invites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "registration_invites_tokenHash_key" ON "registration_invites"("tokenHash");
CREATE INDEX "registration_invites_email_expiresAt_idx" ON "registration_invites"("email", "expiresAt");
CREATE INDEX "registration_invites_teamId_idx" ON "registration_invites"("teamId");

CREATE TABLE "guardian_consents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "ipHash" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "guardian_consents_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "guardian_consents_userId_acceptedAt_idx" ON "guardian_consents"("userId", "acceptedAt");
ALTER TABLE "guardian_consents" ADD CONSTRAINT "guardian_consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "child_profiles" ADD COLUMN "guardianConsentId" TEXT;
CREATE INDEX "child_profiles_guardianConsentId_idx" ON "child_profiles"("guardianConsentId");
