import { prisma } from "./db";
import { reportError } from "./logger";
import { privacyHash, requestSessionMetadata } from "./session";

export interface SecurityAuditInput {
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  outcome?: "success" | "denied" | "failed";
  metadata?: Record<string, string | number | boolean | null>;
}

/** Durable, privacy-preserving evidence for privileged and destructive actions. */
export async function writeSecurityAudit(req: Request, input: SecurityAuditInput) {
  const request = requestSessionMetadata(req);
  try {
    await prisma.securityAuditEvent.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId ?? null,
        outcome: input.outcome ?? "success",
        metadata: input.metadata,
        requestId: req.headers.get("x-vercel-id") ?? req.headers.get("x-request-id"),
        ipHash: request.ip ? privacyHash(request.ip) : null,
        userAgent: request.userAgent ?? null,
      },
    });
  } catch (error) {
    reportError(error, { surface: "security-audit", action: input.action });
    if (process.env.NODE_ENV === "production") throw error;
  }
}
