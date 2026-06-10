import pino from "pino";
import * as Sentry from "@sentry/nextjs";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
  base: { service: "areteos", env: process.env.NODE_ENV ?? "development" },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "passwordHash",
      "*.password",
      "*.passwordHash",
      "*.token",
      "*.apiKey",
      "*.secret",
    ],
    censor: "[redacted]",
  },
});

export function reportError(error: unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error({ err, ...context }, err.message);
  Sentry.captureException(err, { extra: context });
}
