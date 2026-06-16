// Growth Protocol service — the unifying loop (Observe→Diagnose→Design→Practice→
// Reflect→Update→Compound). Each run + stage is event-sourced; the run is a
// projection. Diagnose/Design stages compose the Bottleneck + Prescription engines.

import { prisma } from "./db";
import { emit } from "./events";
import { PROTOCOL_STAGES, nextStage, protocolProgress, scoreProtocol, type ProtocolStage } from "./protocol-scoring";
import { diagnoseBottleneck, latestBottleneck } from "./bottleneck";
import { generatePrescription } from "./prescription";
import { recordSession } from "./deep-work";
import { sessionScore } from "./deep-work-math";
import { createAsset } from "./asset-growth";
import { recordEntry } from "./capital-ledger";

const NS = "Protocol";

export async function createRun(userId: string, input: { title: string; contextType?: string }): Promise<{ id: string }> {
  const id = globalThis.crypto?.randomUUID?.() ?? `gp_${Date.now()}`;
  await emit({ userId, aggregateType: NS, aggregateId: id, type: "RunCreated", payload: { title: input.title, contextType: input.contextType ?? "skill_growth" } });
  return { id };
}

export async function recordStage(
  userId: string,
  runId: string,
  stage: ProtocolStage,
  input: { score: number; notes?: string; data?: unknown },
): Promise<{ ok: true }> {
  await emit({ userId, aggregateType: NS, aggregateId: runId, type: "StageRecorded", payload: { stage, score: input.score, notes: input.notes ?? "", data: input.data ?? null } });
  return { ok: true };
}

export interface ProtocolRun {
  id: string;
  title: string;
  contextType: string;
  createdAt: number;
  stages: Partial<Record<ProtocolStage, { score: number; notes: string; at: number }>>;
  progress: number;
  score: number;
  nextStage: ProtocolStage | null;
}

async function loadRunEvents(userId: string, runId?: string) {
  return prisma.domainEvent.findMany({
    where: { userId, aggregateType: NS, ...(runId ? { aggregateId: runId } : {}) },
    orderBy: { occurredAt: "asc" },
    select: { aggregateId: true, type: true, payload: true, occurredAt: true },
  });
}

function project(events: { type: string; payload: unknown; occurredAt: Date }[], id: string): ProtocolRun | null {
  const created = events.find((e) => e.type === "RunCreated");
  if (!created) return null;
  const cp = (created.payload ?? {}) as Record<string, unknown>;
  const stages: ProtocolRun["stages"] = {};
  for (const e of events) {
    if (e.type !== "StageRecorded") continue;
    const p = (e.payload ?? {}) as Record<string, unknown>;
    const stage = String(p.stage) as ProtocolStage;
    if (!(PROTOCOL_STAGES as readonly string[]).includes(stage)) continue;
    stages[stage] = { score: Number(p.score) || 0, notes: String(p.notes ?? ""), at: e.occurredAt.getTime() };
  }
  const scoreMap: Partial<Record<ProtocolStage, number>> = {};
  for (const s of PROTOCOL_STAGES) if (stages[s]) scoreMap[s] = stages[s]!.score;
  const recorded = Object.keys(stages) as ProtocolStage[];
  return {
    id,
    title: String(cp.title ?? ""),
    contextType: String(cp.contextType ?? ""),
    createdAt: created.occurredAt.getTime(),
    stages,
    progress: protocolProgress(recorded),
    score: scoreProtocol(scoreMap),
    nextStage: nextStage(recorded),
  };
}

export async function getRun(userId: string, runId: string): Promise<ProtocolRun | null> {
  return project(await loadRunEvents(userId, runId), runId);
}

export async function listRuns(userId: string): Promise<ProtocolRun[]> {
  const events = await loadRunEvents(userId);
  const byRun = new Map<string, typeof events>();
  for (const e of events) {
    const arr = byRun.get(e.aggregateId) ?? [];
    arr.push(e);
    byRun.set(e.aggregateId, arr);
  }
  const runs: ProtocolRun[] = [];
  for (const [id, evs] of byRun) {
    const r = project(evs, id);
    if (r) runs.push(r);
  }
  return runs.sort((a, b) => b.createdAt - a.createdAt);
}


// ── End-to-end orchestration: the protocol DRIVES the other engines ───────────
/** Diagnose stage: run the Bottleneck Diagnosis engine and record it as the stage. */
export async function orchestrateDiagnose(userId: string, runId: string, input: { problemStatement?: string; signals?: string[] }) {
  const result = await diagnoseBottleneck(userId, { ...input, useEvidence: true });
  const score = result.diagnosis.confidence || (result.ranked[0]?.confidence ?? 0.5);
  await recordStage(userId, runId, "diagnose", { score, notes: `Primary bottleneck: ${result.diagnosis.primaryBottleneck}`, data: { primary: result.diagnosis.primaryBottleneck } });
  return { run: await getRun(userId, runId), diagnosis: result };
}

/** Design stage: run the Growth Prescription engine (for the diagnosed bottleneck) and record it. */
export async function orchestrateDesign(userId: string, runId: string, input: { bottleneck?: string; context?: string }) {
  let bottleneck = input.bottleneck;
  if (!bottleneck) {
    const last = (await latestBottleneck(userId)) as { primary?: string } | null;
    bottleneck = last?.primary ?? "asset";
  }
  const result = await generatePrescription(userId, { bottleneck, context: input.context });
  await recordStage(userId, runId, "design", { score: 0.7, notes: result ? `Prescription: ${result.prescription.title}` : "No prescription", data: { bottleneck } });
  return { run: await getRun(userId, runId), prescription: result };
}

/** Practice stage (standalone, user-driven): log a REAL Deep Work session + record it.
 *  NOTE: not called by runFullLoop — the full loop never fabricates sessions. */
export async function orchestratePractice(userId: string, runId: string, t: { durationMin: number; distractions: number; difficulty: number; outputQuality: number }) {
  const score = sessionScore({ ...t, at: Date.now() }) / 100;
  await recordSession(userId, { ...t, notes: `Growth Protocol run ${runId}` });
  await recordStage(userId, runId, "practice", { score, notes: `Deep Work: ${t.durationMin}m, ${t.distractions} distractions` });
  return { run: await getRun(userId, runId), practiceScore: Math.round(score * 100) };
}

/** Compound stage (standalone, user-driven): create a REAL asset + life-capital deposit.
 *  NOTE: not called by runFullLoop — the full loop never fabricates assets/capital. */
export async function orchestrateCompound(userId: string, runId: string, input: { assetName?: string; assetType?: string; capitalCategory?: string; capitalAmount?: number }) {
  const assetName = input.assetName || "Protocol output";
  const assetType = input.assetType || "knowledge";
  const { id: assetId } = await createAsset(userId, { name: assetName, type: assetType });
  await recordEntry(userId, { category: input.capitalCategory || "knowledge", entryType: "deposit", amount: input.capitalAmount ?? 15, description: `Compound from protocol run ${runId}`, sourceEngine: "growth-protocol" });
  await recordStage(userId, runId, "compound", { score: 0.7, notes: `Asset created: ${assetName} (+${input.capitalAmount ?? 15} ${input.capitalCategory || "knowledge"} capital)` });
  return { run: await getRun(userId, runId), assetId, asset: { name: assetName, type: assetType }, capital: { category: input.capitalCategory || "knowledge", amount: input.capitalAmount ?? 15 } };
}

/** Update stage: turn the loop into an actual change — persist a decision rule the
 *  user adopts (a real artifact, not just a recorded number). */
export async function orchestrateUpdate(userId: string, runId: string, input: { decisionRule?: string; bottleneck?: string }) {
  const rule = input.decisionRule || (input.bottleneck ? `When the "${input.bottleneck}" pattern shows up, run its prescription's first action before anything else.` : "Close the loop weekly: diagnose, prescribe, practice, compound.");
  await emit({ userId, aggregateType: "LoopUpdate", aggregateId: runId, type: "DecisionRuleUpdated", payload: { runId, decisionRule: rule, bottleneck: input.bottleneck ?? null } }).catch(() => {});
  await recordStage(userId, runId, "update", { score: 0.7, notes: `New decision rule: ${rule}` });
  return { run: await getRun(userId, runId), decisionRule: rule };
}

/** Recent decision rules the loop has produced (the system's accumulated updates). */
export async function latestDecisionRules(userId: string, limit = 10) {
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: "LoopUpdate", type: "DecisionRuleUpdated" },
    orderBy: { occurredAt: "desc" },
    take: Math.min(Math.max(limit, 1), 50),
    select: { payload: true, occurredAt: true },
  });
  return rows.map((r) => ({ ...(r.payload as Record<string, unknown>), at: r.occurredAt.getTime() }));
}

function practicePlanNote(prescriptionTitle: string | null): string {
  return prescriptionTitle ? `Plan a Deep Work block toward: ${prescriptionTitle}` : "Plan one focused Deep Work block this week";
}

export interface FullLoopInput {
  problemStatement?: string;
  signals?: string[];
  context?: string;
  // practice/compound are accepted for API compatibility but the full loop does NOT
  // fabricate sessions/assets/capital from them — those are logged by the user.
  practice?: { durationMin: number; distractions: number; difficulty: number; outputQuality: number };
  compound?: { assetName?: string; assetType?: string; capitalCategory?: string; capitalAmount?: number };
  scores?: { observe?: number; reflect?: number; update?: number };
}

export interface FullLoopResult {
  run: ProtocolRun | null;
  diagnosis: { primaryBottleneck: string };
  prescription: { title: string; firstAction: string } | null;
  plan: { practice: string; compound: string; decisionRule: string };
}

/** One click: diagnose + design for real; record practice / compound / update as a
 *  concrete PLAN + a persisted decision rule. Never fabricates Deep Work sessions,
 *  assets, or life-capital — those are real only when the user logs them. */
export async function runFullLoop(userId: string, runId: string, input: FullLoopInput = {}): Promise<FullLoopResult> {
  const sc = input.scores ?? {};
  await recordStage(userId, runId, "observe", { score: sc.observe ?? 0.6, notes: input.problemStatement || "observed" });
  const diagnose = await orchestrateDiagnose(userId, runId, { problemStatement: input.problemStatement, signals: input.signals });
  const primary = diagnose.diagnosis.diagnosis.primaryBottleneck;
  const design = await orchestrateDesign(userId, runId, { bottleneck: primary, context: input.context });
  const presTitle = design.prescription?.prescription.title ?? null;
  const firstAction = design.prescription?.prescription.firstAction ?? null;

  const practiceNote = practicePlanNote(presTitle);
  const compoundNote = `Ship a durable asset toward: ${presTitle ?? "your goal"} (log it in Asset-Based Growth)`;
  await recordStage(userId, runId, "practice", { score: 0.5, notes: practiceNote });
  await recordStage(userId, runId, "reflect", { score: sc.reflect ?? 0.6, notes: "Reflect after acting on the plan" });
  const update = await orchestrateUpdate(userId, runId, { decisionRule: firstAction ? `Rule: ${firstAction}` : undefined, bottleneck: primary });
  await recordStage(userId, runId, "compound", { score: 0.5, notes: compoundNote });

  return {
    run: await getRun(userId, runId),
    diagnosis: diagnose.diagnosis.diagnosis,
    prescription: design.prescription?.prescription ?? null,
    plan: { practice: practiceNote, compound: compoundNote, decisionRule: update.decisionRule },
  };
}
