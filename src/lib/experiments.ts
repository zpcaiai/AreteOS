// N-of-1 experiment engine. Lifecycle is event-sourced (ExperimentCreated /
// ExperimentObserved in domain_events), and the readout is computed on demand
// from the recorded observations. Turns coaching advice into personal science.

import { prisma } from "./db";
import { emit } from "./events";
import { readout, type Readout } from "./experiments-math";

const NS = "Experiment";
export type Phase = "baseline" | "intervention";

export interface ExperimentSpec {
  id: string;
  hypothesis: string;
  metric: string;
  unit: string;
  higherIsBetter: boolean;
  createdAt: number;
}

export interface ExperimentSummary extends ExperimentSpec {
  baselineN: number;
  interventionN: number;
}

function uuid(): string {
  return globalThis.crypto?.randomUUID?.() ?? `exp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function createExperiment(
  userId: string,
  input: { hypothesis: string; metric: string; unit?: string; higherIsBetter?: boolean },
): Promise<{ id: string }> {
  const id = uuid();
  await emit({
    userId,
    aggregateType: NS,
    aggregateId: id,
    type: "ExperimentCreated",
    payload: { hypothesis: input.hypothesis, metric: input.metric, unit: input.unit ?? "", higherIsBetter: input.higherIsBetter ?? true },
  });
  return { id };
}

export async function recordObservation(
  userId: string,
  input: { experimentId: string; phase: Phase; value: number; at?: number },
): Promise<{ ok: true }> {
  await emit({
    userId,
    aggregateType: NS,
    aggregateId: input.experimentId,
    type: "ExperimentObserved",
    payload: { phase: input.phase, value: input.value, at: input.at ?? Date.now() },
  });
  return { ok: true };
}

async function loadEvents(userId: string, experimentId?: string) {
  return prisma.domainEvent.findMany({
    where: { userId, aggregateType: NS, ...(experimentId ? { aggregateId: experimentId } : {}) },
    orderBy: { occurredAt: "asc" },
    select: { aggregateId: true, type: true, payload: true, occurredAt: true },
  });
}

export async function listExperiments(userId: string): Promise<ExperimentSummary[]> {
  const events = await loadEvents(userId);
  const map = new Map<string, ExperimentSummary>();
  for (const ev of events) {
    const p = (ev.payload ?? {}) as Record<string, unknown>;
    if (ev.type === "ExperimentCreated") {
      map.set(ev.aggregateId, {
        id: ev.aggregateId,
        hypothesis: String(p.hypothesis ?? ""),
        metric: String(p.metric ?? ""),
        unit: String(p.unit ?? ""),
        higherIsBetter: Boolean(p.higherIsBetter ?? true),
        createdAt: ev.occurredAt.getTime(),
        baselineN: 0,
        interventionN: 0,
      });
    } else if (ev.type === "ExperimentObserved") {
      const e = map.get(ev.aggregateId);
      if (e) {
        if (p.phase === "baseline") e.baselineN += 1;
        else if (p.phase === "intervention") e.interventionN += 1;
      }
    }
  }
  return [...map.values()].sort((a, b) => b.createdAt - a.createdAt);
}

export interface ExperimentReadout {
  spec: ExperimentSpec;
  readout: Readout;
}

export async function getExperimentReadout(userId: string, experimentId: string): Promise<ExperimentReadout | null> {
  const events = await loadEvents(userId, experimentId);
  const created = events.find((e) => e.type === "ExperimentCreated");
  if (!created) return null;
  const cp = (created.payload ?? {}) as Record<string, unknown>;

  const baseline: number[] = [];
  const intervention: number[] = [];
  for (const ev of events) {
    if (ev.type !== "ExperimentObserved") continue;
    const p = (ev.payload ?? {}) as Record<string, unknown>;
    const v = Number(p.value);
    if (!Number.isFinite(v)) continue;
    if (p.phase === "baseline") baseline.push(v);
    else if (p.phase === "intervention") intervention.push(v);
  }

  return {
    spec: {
      id: experimentId,
      hypothesis: String(cp.hypothesis ?? ""),
      metric: String(cp.metric ?? ""),
      unit: String(cp.unit ?? ""),
      higherIsBetter: Boolean(cp.higherIsBetter ?? true),
      createdAt: created.occurredAt.getTime(),
    },
    readout: readout(baseline, intervention),
  };
}
