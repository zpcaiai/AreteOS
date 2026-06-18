// ───────────────────── Healing OS · Practice tasks (shared) ─────────────────────
// The practice spine for Batches 2-4: CBT, emotion-regulation, parts-work,
// exposure, and identity all emit small, measurable PracticeTasks here. The
// timeline reads completion stats from these. Pure Zod + types.

import { z } from "zod";

export const PRACTICE_SOURCE_TYPES = [
  "cbt",
  "emotion-regulation",
  "core-belief",
  "parts-work",
  "exposure",
  "identity",
  "relapse-prevention",
  "stabilization",
  "manual",
] as const;
export type PracticeSourceType = (typeof PRACTICE_SOURCE_TYPES)[number];

export const PRACTICE_STATUSES = ["pending", "in_progress", "completed", "skipped"] as const;
export type PracticeStatus = (typeof PRACTICE_STATUSES)[number];

export const PRACTICE_DIFFICULTY = ["easy", "medium", "hard"] as const;
export type PracticeDifficulty = (typeof PRACTICE_DIFFICULTY)[number];

/** Input to create a practice task (services build this from a skill's plan). */
export const PracticeTaskInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  sourceType: z.enum(PRACTICE_SOURCE_TYPES),
  sourceId: z.string().optional(),
  title: z.string().min(1),
  description: z.string().default(""),
  steps: z.array(z.string()).default([]),
  difficulty: z.enum(PRACTICE_DIFFICULTY).default("easy"),
  completionMetric: z.string().default(""),
});
export type PracticeTaskInput = z.infer<typeof PracticeTaskInputSchema>;

export const CompletePracticeInputSchema = z.object({
  userId: z.string().min(1),
  taskId: z.string().min(1),
  status: z.enum(PRACTICE_STATUSES).default("completed"),
  reflection: z
    .object({
      note: z.string().optional(),
      beforeDistress: z.number().min(0).max(10).optional(),
      afterDistress: z.number().min(0).max(10).optional(),
      learning: z.string().optional(),
    })
    .optional(),
});
export type CompletePracticeInput = z.infer<typeof CompletePracticeInputSchema>;

export interface PracticeTaskView {
  id: string;
  sourceType: PracticeSourceType;
  sourceId: string | null;
  title: string;
  description: string;
  steps: string[];
  difficulty: PracticeDifficulty;
  status: PracticeStatus;
  completionMetric: string;
  createdAt: string;
  completedAt: string | null;
}
