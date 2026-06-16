"use client";
import { useState } from "react";
import { TIERS, PERIOD_LABEL, PERIOD_DAYS, price, perMonth, type Tier, type Period } from "@/lib/membership/plans";
import { useI18n, useT } from "@/lib/i18n/client";

const PERIODS: Period[] = ["MONTHLY", "QUARTERLY", "ANNUAL"];
const RANK: Record<Tier, number> = { FREE: 0, PLUS: 1, PRO: 2 };

// Chinese display mirror of the English source in plans.ts (display-only — gating/prices unchanged).
const TIER_ZH: Record<Tier, { label: string; tagline: string; features: string[] }> = {
  FREE: {
    label: "免费版", tagline: "开启成长闭环。",
    features: ["世界观 · 使命 · 身份 · 价值观", "习惯与每日复盘", "仪表盘与成长分", "浏览社区"],
  },
  PLUS: {
    label: "Plus", tagline: "想得更清,决策更好。",
    features: ["包含免费版全部", "全部 19 个 AI 教练", "决策 · 思维模型 · 第一性原理", "天才建模与学习路径", "Naval 人生 OS —— 杠杆、判断、财富与自由", "在社区发帖", "每周回顾"],
  },
  PRO: {
    label: "Pro", tagline: "复利,通往卓越。",
    features: ["包含 Plus 全部", "数字孪生与漂移预测", "卓越适应(天才 → 你)", "知识图谱 + 每夜报告", "季度回顾与优先 AI", "业务规模化(SFM)、领导力与管理 OS"],
  },
};
const PERIOD_ZH: Record<Period, string> = { MONTHLY: "按月", QUARTERLY: "按季", ANNUAL: "按年" };

export default function MembershipClient({
  currentTier, expiresAt, period,
}: { currentTier: Tier; expiresAt: string | null; period: Period | null }) {
  const { locale } = useI18n();
  const T = useT();
  const periodLabel = (p: Period) => (locale === "en" ? PERIOD_LABEL[p] : PERIOD_ZH[p]);
  const [sel, setSel] = useState<Period>("ANNUAL");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier>(currentTier);
  const [exp, setExp] = useState<string | null>(expiresAt);

  async function upgrade(t: Tier) {
    if (t === "FREE") return;
    setBusy(t); setMsg(null);
    try {
      // Step one create order, step two activate. Mock pay; real flow redirects to payUrl.
      const co = await fetch("/api/membership/checkout", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier: t, period: sel }),
      }).then((r) => r.json());
      if (!co.order) throw new Error(co.error || T("下单失败", "Checkout failed"));
      const ac = await fetch("/api/membership/activate", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId: co.order.id }),
      }).then((r) => r.json());
      if (!ac.membership) throw new Error(ac.error || T("激活失败", "Activation failed"));
      setTier(ac.membership.tier);
      setExp(ac.membership.expiresAt ?? null);
      setMsg(T(`你现在是 ${ac.membership.tier}。有效期至 ${fmt(ac.membership.expiresAt)}。`, `You're now ${ac.membership.tier}. Valid through ${fmt(ac.membership.expiresAt)}.`));
    } catch (e: any) {
      setMsg(e.message || T("出错了", "Something went wrong"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="text-sm text-slate-300">
          {T("当前方案", "Current plan")}: <span className="font-semibold text-white">{tier}</span>
          {period && tier !== "FREE" && <span className="text-slate-500"> · {periodLabel(period)}</span>}
          {exp && tier !== "FREE" && <span className="text-slate-500"> · {T("续费于", "renews")} {fmt(exp)}</span>}
        </div>
        <PeriodToggle sel={sel} onChange={setSel} />
      </div>

      {msg && <div className="mb-5 rounded-lg border border-indigo-700 bg-indigo-950/40 px-4 py-2 text-sm text-indigo-200">{msg}</div>}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {TIERS.map((t) => {
          const isCurrent = t.tier === tier;
          const isFree = t.tier === "FREE";
          const lower = RANK[t.tier] < RANK[tier];
          const p = isFree ? 0 : price(t.tier, sel);
          const label = locale === "en" ? t.label : TIER_ZH[t.tier].label;
          const tagline = locale === "en" ? t.tagline : TIER_ZH[t.tier].tagline;
          const features = locale === "en" ? t.features : TIER_ZH[t.tier].features;
          return (
            <div key={t.tier}
              className={`flex flex-col rounded-2xl border p-5 ${t.tier === "PRO" ? "border-indigo-600 bg-indigo-950/20" : "border-slate-800 bg-slate-900/50"}`}>
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-bold">{label}</div>
                {t.tier === "PRO" && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase">{T("最超值", "Best value")}</span>}
              </div>
              <p className="mt-1 text-sm text-slate-400">{tagline}</p>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-bold tabular-nums">¥{p}</span>
                {!isFree && <span className="pb-1 text-xs text-slate-500">/ {locale === "en" ? PERIOD_LABEL[sel].toLowerCase() : PERIOD_ZH[sel]}</span>}
              </div>
              {!isFree && sel !== "MONTHLY" && (
                <div className="mt-1 text-xs text-emerald-400">≈ ¥{perMonth(t.tier, sel)}{T("/月", "/mo")}</div>
              )}

              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                {features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-indigo-400">✓</span><span>{f}</span></li>
                ))}
              </ul>

              <button
                disabled={isCurrent || isFree || lower || busy !== null}
                onClick={() => upgrade(t.tier)}
                className={`mt-5 rounded-lg px-4 py-2 text-sm font-semibold ${
                  isCurrent ? "cursor-default bg-slate-800 text-slate-400"
                  : isFree || lower ? "cursor-not-allowed bg-slate-800 text-slate-500"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"}`}>
                {busy === t.tier ? T("处理中…", "Processing…") : isCurrent ? T("当前方案", "Current plan") : isFree ? T("已包含", "Included") : lower ? "—" : T(`升级到 ${label}`, `Upgrade to ${label}`)}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        {T("演示用模拟结算 —— 订单即时生效并叠加剩余时长", "Mock checkout for the demo — orders activate instantly and stack remaining time")} ({Object.entries(PERIOD_DAYS).map(([k, v]) => (locale === "en" ? `${k.toLowerCase()} ${v}d` : `${PERIOD_ZH[k as Period]} ${v}天`)).join(" · ")}).
        {" "}{T("生产环境请将真实的支付宝 / 微信支付回调接入", "Wire a real Alipay / WeChat Pay notify callback into")} <code>/api/membership/activate</code>{T("。", " for production.")}
      </p>
    </div>
  );
}

function PeriodToggle({ sel, onChange }: { sel: Period; onChange: (p: Period) => void }) {
  const { locale } = useI18n();
  return (
    <div className="inline-flex rounded-lg border border-slate-700 p-0.5">
      {PERIODS.map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`rounded-md px-3 py-1 text-xs font-medium ${sel === p ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
          {locale === "en" ? PERIOD_LABEL[p] : PERIOD_ZH[p]}{p === "ANNUAL" && <span className="ml-1 text-emerald-400">-36%</span>}
        </button>
      ))}
    </div>
  );
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}
