// Assembles a normalized cross-engine signal set from whatever engines have data, then
// derives ranked bridge insights. Every source is best-effort — a missing engine just
// means fewer signals, never an error.

import { computeScoresCached } from "./analytics";
import { outcomeProgress } from "./self-report";
import { latestBottleneck } from "./bottleneck";
import { deriveBridgeInsights, type BridgeInsight, type EngineSignals } from "./cross-engine";
import { reportError } from "./logger";

export async function gatherSignals(userId: string): Promise<EngineSignals> {
  const s: EngineSignals = {};

  try {
    const { scores } = await computeScoresCached(userId);
    s.habitConsistency = scores.habitConsistency;
    s.reflection = scores.reflection;
    s.decisionQuality = scores.decisionQuality;
    s.mentalModelUsage = scores.mentalModelUsage;
    s.firstPrinciple = scores.firstPrinciple;
  } catch (e) { reportError(e, { surface: "cross-engine", src: "scores" }); }

  try {
    const prog = await outcomeProgress(userId);
    if (prog.metrics.length) {
      const latest: Record<string, number> = {};
      const delta: Record<string, number> = {};
      for (const m of prog.metrics) { latest[m.metric] = m.latest; delta[m.metric] = m.delta; }
      s.selfReport = latest as EngineSignals["selfReport"];
      s.selfReportDelta = delta as EngineSignals["selfReportDelta"];
    }
  } catch (e) { reportError(e, { surface: "cross-engine", src: "self-report" }); }

  try {
    const bn = (await latestBottleneck(userId)) as { primary?: string } | null;
    if (bn?.primary) s.bottleneck = bn.primary;
  } catch (e) { reportError(e, { surface: "cross-engine", src: "bottleneck" }); }

  return s;
}

export async function crossEngineInsights(userId: string): Promise<{ signals: EngineSignals; insights: BridgeInsight[] }> {
  const signals = await gatherSignals(userId);
  return { signals, insights: deriveBridgeInsights(signals) };
}
