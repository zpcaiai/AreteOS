import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { E2E_SESSION_TOKEN } from "./auth-fixture";

export default async function globalSetup() {
  if (!process.env.DATABASE_URL) throw new Error("E2E requires DATABASE_URL");
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.upsert({ where: { id: "usr_demo" }, update: {}, create: { id: "usr_demo", email: "demo@arete.local", name: "E2E User", emailVerifiedAt: new Date() } });
    const tokenHash = crypto.createHash("sha256").update(E2E_SESSION_TOKEN).digest("hex");
    await prisma.authSession.upsert({
      where: { tokenHash },
      update: { userId: user.id, expiresAt: new Date(Date.now() + 60 * 60_000), revokedAt: null },
      create: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60_000), userAgent: "Playwright" },
    });
  } finally { await prisma.$disconnect(); }
}
