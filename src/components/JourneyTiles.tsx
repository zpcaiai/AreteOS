"use client";

// Cross-engine overview tiles with trend sparklines. Used on /journey and at the
// top of /dashboard as the default landing.

import { useApi } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import type { Bi } from "@/lib/bottleneck-rules";

interface Journey {
  bottleneck: string | null;
  prescriptions: { count: number; latest: string | null };
  assets: { portfolio: number; published: number; count: number };
  capital: { global: number; weakest: string; spark: number[] };
  identity: { unlocked: number; total: number; active: { name: Bi } | null };
  deepWork: { global: number; minutes: number; sessions: number; spark: number[] };
  protocol: { runs: number; topScore: number; spark: number[] };
  specificKnowledge: { moat: number | null; score: number | null; spark: number[] };
}

function Sparkline({ values, color = "#64748b" }: { values?: number[]; color?: string }) {
  const v = (values ?? []).filter((x) => Number.isFinite(x));
  if (v.length < 2) return <div className="mt-2 h-4" />;
  const W = 120, H = 16, max = Math.max(1, ...v);
  const pts = v.map((x, i) => `${((i / (v.length - 1)) * W).toFixed(1)},${(H - (x / max) * H).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-4 w-full" preserveAspectRatio="none" role="img" aria-label="trend">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function Tile({ title, metric, sub, href, accent, spark }: { title: string; metric: string; sub: string; href: string; accent?: string; spark?: number[] }) {
  return (
    <a href={href} className="block rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-600">
      <div className="text-xs font-semibold" style={accent ? { color: accent } : undefined}>{title}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-slate-100">{metric}</div>
      <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
      <Sparkline values={spark} color={accent} />
    </a>
  );
}

export default function JourneyTiles() {
  const { locale } = useI18n();
  const T = useT();
  const L = (b?: Bi | null) => (b ? (locale === "en" ? b.en : b.zh) : "—");
  const q = useApi<{ journey: Journey }>("/api/journey");
  const j = q.data?.journey;
  if (!j) return <p className="text-sm text-slate-500">{T("加载全景中…", "Loading overview…")}</p>;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Tile title={T("成长协议", "Growth Protocol")} metric={`${Math.round(j.protocol.topScore)}`} sub={`${j.protocol.runs} ${T("次运行", "runs")}`} href="/growth-protocol" accent="#a78bfa" spark={j.protocol.spark} />
      <Tile title={T("瓶颈诊断", "Bottleneck")} metric={j.bottleneck ?? "—"} sub={T("当前主瓶颈", "current primary")} href="/bottlenecks" accent="#f59e0b" />
      <Tile title={T("成长处方", "Prescription")} metric={`${j.prescriptions.count}`} sub={j.prescriptions.latest ?? T("尚无", "none yet")} href="/prescriptions" accent="#34d399" />
      <Tile title={T("深度工作", "Deep Work")} metric={`${Math.round(j.deepWork.global)}`} sub={`${j.deepWork.minutes} ${T("分钟", "min")} · ${j.deepWork.sessions} ${T("会话", "sessions")}`} href="/deep-work" accent="#38bdf8" spark={j.deepWork.spark} />
      <Tile title={T("独特知识", "Specific Knowledge")} metric={j.specificKnowledge.moat != null ? `${Math.round(j.specificKnowledge.moat)}` : "—"} sub={T("护城河分", "moat score")} href="/specific-knowledge" accent="#a78bfa" spark={j.specificKnowledge.spark} />
      <Tile title={T("资产成长", "Asset Growth")} metric={`${Math.round(j.assets.portfolio)}`} sub={`${j.assets.published}/${j.assets.count} ${T("已发布", "published")}`} href="/assets" accent="#34d399" />
      <Tile title={T("人生资本", "Life Capital")} metric={`${Math.round(j.capital.global)}`} sub={`${T("最弱", "weakest")}: ${j.capital.weakest}`} href="/life-capital" accent="#38bdf8" spark={j.capital.spark} />
      <Tile title={T("身份进化", "Identity Tree")} metric={`${j.identity.unlocked}/${j.identity.total}`} sub={`${T("下一个", "next")}: ${L(j.identity.active?.name)}`} href="/identity-tree" accent="#f472b6" />
    </div>
  );
}
