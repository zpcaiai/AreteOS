"use client";
import { useState } from "react";
import { TIERS, PERIOD_LABEL, PERIOD_DAYS, price, perMonth, type Tier, type Period } from "@/lib/membership/plans";

const PERIODS: Period[] = ["MONTHLY", "QUARTERLY", "ANNUAL"];
const RANK: Record<Tier, number> = { FREE: 0, PLUS: 1, PRO: 2 };

export default function MembershipClient({
  currentTier, expiresAt, period,
}: { currentTier: Tier; expiresAt: string | null; period: Period | null }) {
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
      if (!co.order) throw new Error(co.error || "Checkout failed");
      const ac = await fetch("/api/membership/activate", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId: co.order.id }),
      }).then((r) => r.json());
      if (!ac.membership) throw new Error(ac.error || "Activation failed");
      setTier(ac.membership.tier);
      setExp(ac.membership.expiresAt ?? null);
      setMsg(`You're now ${ac.membership.tier}. Valid through ${fmt(ac.membership.expiresAt)}.`);
    } catch (e: any) {
      setMsg(e.message || "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="text-sm text-slate-300">
          Current plan: <span className="font-semibold text-white">{tier}</span>
          {period && tier !== "FREE" && <span className="text-slate-500"> · {PERIOD_LABEL[period]}</span>}
          {exp && tier !== "FREE" && <span className="text-slate-500"> · renews {fmt(exp)}</span>}
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
          return (
            <div key={t.tier}
              className={`flex flex-col rounded-2xl border p-5 ${t.tier === "PRO" ? "border-indigo-600 bg-indigo-950/20" : "border-slate-800 bg-slate-900/50"}`}>
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-bold">{t.label}</div>
                {t.tier === "PRO" && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase">Best value</span>}
              </div>
              <p className="mt-1 text-sm text-slate-400">{t.tagline}</p>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-bold tabular-nums">¥{p}</span>
                {!isFree && <span className="pb-1 text-xs text-slate-500">/ {PERIOD_LABEL[sel].toLowerCase()}</span>}
              </div>
              {!isFree && sel !== "MONTHLY" && (
                <div className="mt-1 text-xs text-emerald-400">≈ ¥{perMonth(t.tier, sel)}/mo</div>
              )}

              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                {t.features.map((f) => (
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
                {busy === t.tier ? "Processing…" : isCurrent ? "Current plan" : isFree ? "Included" : lower ? "—" : `Upgrade to ${t.label}`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        Mock checkout for the demo — orders activate instantly and stack remaining time ({Object.entries(PERIOD_DAYS).map(([k, v]) => `${k.toLowerCase()} ${v}d`).join(" · ")}).
        Wire a real Alipay / WeChat Pay notify callback into <code>/api/membership/activate</code> for production.
      </p>
    </div>
  );
}

function PeriodToggle({ sel, onChange }: { sel: Period; onChange: (p: Period) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-700 p-0.5">
      {PERIODS.map((p) => (
        <button key={p} onClick={() => onChange(p)}
          className={`rounded-md px-3 py-1 text-xs font-medium ${sel === p ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
          {PERIOD_LABEL[p]}{p === "ANNUAL" && <span className="ml-1 text-emerald-400">-36%</span>}
        </button>
      ))}
    </div>
  );
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}
