import { z } from "zod";
import { prisma } from "@/lib/db";
import { issueAuthToken } from "@/lib/auth-tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { anonymousClientKey, persistentRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const limited = await persistentRateLimit({ key: `auth:forgot:${anonymousClientKey(req)}`, limit: 4, windowMs: 60 * 60_000 });
    if (limited) return limited;
    const { email } = await parseBody(req, z.object({ email: z.string().email().transform((v) => v.trim().toLowerCase()) }));
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
    if (user) {
      const token = await issueAuthToken(user.id, "PASSWORD_RESET", 30 * 60_000);
      await sendPasswordResetEmail(user.email, token);
    }
    return ok({ ok: true, message: "If the account exists, a reset link has been sent." });
  });
}
