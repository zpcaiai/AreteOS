// Shared Zod schemas usable on BOTH the server (API validation) and the client
// (instant form feedback before a request is ever sent). Keep them dependency-
// free of server-only modules so they can be imported in "use client" files.

import { z } from "zod";

export const NavalGoalSchema = z.object({
  statement: z.string().trim().min(8, "Describe the goal in at least a short sentence").max(400, "Keep the goal under 400 characters"),
  horizon: z.enum(["ONE_YEAR", "THREE_YEARS", "FIVE_YEARS", "TEN_YEARS", "LIFETIME"]).optional(),
  why: z.string().trim().max(300, "Keep the why under 300 characters").optional(),
  targetDate: z.string().optional(),
});

export const CoachMessageSchema = z.object({
  message: z.string().trim().min(1, "Write a message first").max(4000, "Messages are capped at 4000 characters"),
});

export const CoachSessionSchema = z.object({
  title: z.string().max(120).optional(),
  focus: z.enum(["", "decisions", "habits", "naval", "reflection"]).optional(),
});

/** First Zod issue message, or null when the value is valid. */
export function firstIssue<S extends z.ZodTypeAny>(schema: S, value: unknown): string | null {
  const result = schema.safeParse(value);
  return result.success ? null : result.error.issues[0]?.message ?? "Invalid input";
}
