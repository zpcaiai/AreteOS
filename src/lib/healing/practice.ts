// ───────────────────── Healing OS · practice service (shared) ─────────────────────
// Create/list/complete PracticeTasks. Every intervention skill calls
// createPracticeTask(s); the timeline reads completion stats. Each create/
// complete also emits a Healing event for timeline aggregation.

import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import {
  type PracticeTaskInput,
  type CompletePracticeInput,
  type PracticeTaskView,
  PracticeTaskInputSchema,
} from "../domain/practice";

export async function createPracticeTask(input: PracticeTaskInput): Promise<string> {
  const data = PracticeTaskInputSchema.parse(input);
  try {
    const row = await prisma.practiceTask.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        title: data.title,
        description: data.description,
        steps: data.steps,
        difficulty: data.difficulty,
        completionMetric: data.completionMetric,
      },
      select: { id: true },
    });
    await recordHealingEvent({
      userId: data.userId,
      sessionId: data.sessionId,
      module: "practice",
      type: "PracticeTaskCreated",
      recordId: row.id,
      payload: { sourceType: data.sourceType, title: data.title, difficulty: data.difficulty },
    });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "practice", stage: "create" });
    return "";
  }
}

export async function createPracticeTasks(inputs: PracticeTaskInput[]): Promise<string[]> {
  const ids: string[] = [];
  for (const i of inputs) ids.push(await createPracticeTask(i));
  return ids.filter(Boolean);
}

export async function listPracticeTasks(
  userId: string,
  opts: { status?: string; sessionId?: string; limit?: number } = {},
): Promise<PracticeTaskView[]> {
  try {
    type Row = {
      id: string; sourceType: string; sourceId: string | null; title: string; description: string;
      steps: unknown; difficulty: string; status: string; completionMetric: string; createdAt: Date; completedAt: Date | null;
    };
    const rows = (await prisma.practiceTask.findMany({
      where: { userId, ...(opts.status ? { status: opts.status } : {}), ...(opts.sessionId ? { sessionId: opts.sessionId } : {}) },
      orderBy: { createdAt: "desc" },
      take: opts.limit ?? 50,
    })) as unknown as Row[];
    return rows.map((r) => ({
      id: r.id,
      sourceType: r.sourceType as PracticeTaskView["sourceType"],
      sourceId: r.sourceId,
      title: r.title,
      description: r.description,
      steps: (r.steps as string[]) ?? [],
      difficulty: r.difficulty as PracticeTaskView["difficulty"],
      status: r.status as PracticeTaskView["status"],
      completionMetric: r.completionMetric,
      createdAt: r.createdAt.toISOString(),
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
    }));
  } catch (e) {
    reportError(e, { surface: "practice", stage: "list" });
    return [];
  }
}

export async function completePracticeTask(input: CompletePracticeInput): Promise<boolean> {
  try {
    const completed = input.status === "completed";
    const res = await prisma.practiceTask.updateMany({
      where: { id: input.taskId, userId: input.userId }, // scope to owner
      data: {
        status: input.status,
        completedAt: completed ? new Date() : null,
        reflection: input.reflection ?? undefined,
      },
    });
    if (res.count > 0) {
      await recordHealingEvent({
        userId: input.userId,
        module: "practice",
        type: completed ? "PracticeTaskCompleted" : "PracticeTaskUpdated",
        recordId: input.taskId,
        payload: { status: input.status },
      });
    }
    return res.count > 0;
  } catch (e) {
    reportError(e, { surface: "practice", stage: "complete" });
    return false;
  }
}
