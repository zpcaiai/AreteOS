"use client";

// The one thing to do now — the highest-leverage surface, pinned to the top of
// the dashboard. Derived from the latest prescription / bottleneck.

import { useApi } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";

interface NextAction { action: string; source: string; href: string }

export default function NextActionBanner() {
  const { locale } = useI18n();
  const T = useT();
  const q = useApi<{ next: NextAction }>("/api/next-action");
  const n = q.data?.next;
  if (!n) return null;

  if (!n.action) {
    return (
      <a href="/onboarding" className="block rounded-2xl border border-indigo-700/50 bg-indigo-950/30 p-4 transition hover:border-indigo-500">
        <div className="text-xs font-semibold text-indigo-300">{T("从这里开始", "Start here")}</div>
        <div className="mt-1 text-base font-medium text-slate-100">{T("先跑一次首启闭环,得到你的第一个下一步 →", "Run the first-loop to get your first next action →")}</div>
      </a>
    );
  }
  return (
    <a href={n.href} className="block rounded-2xl border border-emerald-700/50 bg-emerald-950/20 p-4 transition hover:border-emerald-500">
      <div className="text-xs font-semibold text-emerald-300">👉 {T("你现在唯一要做的一件事", "Your one next action")}</div>
      <div className="mt-1 text-base font-medium text-slate-100">{n.action}</div>
      {n.source && <div className="mt-0.5 text-xs text-slate-500">{T("来自", "from")}: {n.source} →</div>}
    </a>
  );
}
