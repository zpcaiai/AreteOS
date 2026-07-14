"use client";

// Cross-Engine Synthesis — the moat. Surfaces how a pattern in one domain (e.g. wellbeing)
// is affecting another (e.g. execution), with one concrete action. Reads /api/cross-engine.

import { Card, PageHeader } from "@/components/ui";
import { useApi } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";

interface Bi { zh: string; en: string }
type Domain = "wellbeing" | "execution" | "thinking" | "identity" | "relationships" | "diagnose";
interface Insight { id: string; from: Domain; to: Domain; severity: "info" | "watch" | "act"; score: number; title: Bi; explanation: Bi; action: Bi; href: string }

const DOMAIN: Record<Domain, Bi> = {
  wellbeing: { zh: "身心", en: "Wellbeing" },
  execution: { zh: "执行", en: "Execution" },
  thinking: { zh: "思维", en: "Thinking" },
  identity: { zh: "身份", en: "Identity" },
  relationships: { zh: "关系", en: "Relationships" },
  diagnose: { zh: "诊断", en: "Diagnose" },
};
const SEV: Record<Insight["severity"], { zh: string; en: string; cls: string }> = {
  act: { zh: "行动", en: "Act", cls: "bg-rose-950/50 text-rose-300 border-rose-800/50" },
  watch: { zh: "关注", en: "Watch", cls: "bg-amber-950/40 text-amber-300 border-amber-800/50" },
  info: { zh: "留意", en: "Note", cls: "bg-slate-800/60 text-slate-300 border-slate-700" },
};

export default function SynthesisClient() {
  const { locale } = useI18n();
  const T = useT();
  const L = (b: Bi) => (locale === "en" ? b.en : b.zh);
  const q = useApi<{ insights: Insight[] }>("/api/cross-engine");

  if (q.error && isUpgradeError(q.error)) {
    return (
      <div>
        <PageHeader title={T("跨引擎综合", "Cross-Engine Synthesis")} subtitle={T("连接不同引擎里的模式,发现别处看不到的因果。", "Connect patterns across engines to see causes no single view shows.")} />
        <UpgradeNotice feature={T("跨引擎综合", "Cross-Engine Synthesis")} tier="Pro" />
      </div>
    );
  }
  const insights = q.data?.insights ?? [];

  return (
    <div>
      <PageHeader
        title={T("跨引擎综合", "Cross-Engine Synthesis")}
        subtitle={T("护城河不在单个引擎,而在把不同领域的模式连起来:一处的模式如何影响另一处。", "The moat isn't any one engine — it's linking patterns across domains: how one area drives another.")}
      />
      {q.isPending ? (
        <Card title={T("综合中…", "Synthesizing…")}><p className="text-sm text-slate-500">{T("加载中…", "Loading…")}</p></Card>
      ) : insights.length === 0 ? (
        <Card title={T("暂无跨域信号", "No cross-domain signals yet")}>
          <p className="text-sm text-slate-400">{T("多用几个引擎(打分、自评、瓶颈诊断等),这里就会显示它们之间的因果连接。先做一次", "Use a few engines (scores, self-report, bottleneck diagnosis…) and the causal links will appear here. Start with a")} <a className="text-indigo-400" href="/outcomes">{T("人生自评", "life self-report")}</a>。</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {insights.map((i) => (
            <Card key={i.id} title={L(i.title)} accent={i.severity === "act" ? "#f43f5e" : i.severity === "watch" ? "#f59e0b" : "#6366f1"}>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">{L(DOMAIN[i.from])}</span>
                <span className="text-slate-500" aria-hidden="true">→</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">{L(DOMAIN[i.to])}</span>
                <span className={`rounded-full border px-2 py-0.5 ${SEV[i.severity].cls}`}>{L(SEV[i.severity])}</span>
              </div>
              <p className="text-sm text-slate-200">{L(i.explanation)}</p>
              <a href={i.href} className="mt-3 inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
                {L(i.action)}
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
