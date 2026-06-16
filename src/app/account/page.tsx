"use client";

import { useState } from "react";

import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";

interface Contribution { factor: string; value: number; dragShare: number }
interface GrowthExplanation { value: number; weakest: string; strongest: string; biggestLever: string; projectedIfLeverPlus10: number; gainFromLever: number; contributions: Contribution[] }

const pct = (x: number) => Math.round(x * 100);

export default function AccountPage() {
  const { t, locale } = useI18n();
  const T = useT();
  const q = useApi<{ explanation: GrowthExplanation }>("/api/explain");
  const [confirmReset, setConfirmReset] = useState(false);
  const reset = useApiMutation<{ confirm: true }, { deleted: number }>("/api/account/reset");
  const e = q.data?.explanation;

  return (
    <div>
      <PageHeader title={t("innov.account.title")} subtitle={t("innov.account.subtitle")} />

      <Card title={t("innov.account.explainCard")}>
        {q.isLoading ? <p className="text-sm text-slate-500">{t("innov.loading")}</p> : e ? (
          <div>
            <div className="flex flex-wrap items-end gap-6">
              <div><div className="text-xs text-slate-500">{t("innov.account.current")}</div><div className="text-3xl font-bold tabular-nums">{pct(e.value)}</div></div>
              <div><div className="text-xs text-slate-500">{t("innov.account.ifPlus10")}</div><div className="text-3xl font-bold tabular-nums text-emerald-300">{pct(e.projectedIfLeverPlus10)}</div></div>
              <div className="pb-1 text-sm text-emerald-300">+{pct(e.gainFromLever)}</div>
            </div>
            <p className="mt-2 text-sm text-slate-300">{t("innov.account.leverText").replace("{weak}", e.biggestLever).replace("{strong}", e.strongest)}</p>
            <div className="mt-3">
              <div className="mb-1 text-xs text-slate-500">{t("innov.account.dragContrib")}</div>
              {e.contributions.map((c) => <ScoreBar key={c.factor} label={`${c.factor} · ${t("innov.account.dragLabel")} ${pct(c.dragShare)}%`} value={c.value} />)}
            </div>
          </div>
        ) : <p className="text-sm text-slate-500">{t("innov.loading")}</p>}
      </Card>

      <div className="mt-4">
        <Card title={t("innov.account.exportCard")}>
          <p className="text-sm text-slate-300">{t("innov.account.exportDesc")}</p>
          <a href="/api/account/export" download className="mt-3 inline-block rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600">{t("innov.account.exportBtn")}</a>
        </Card>
      </div>

      <div className="mt-4">
        <Card title={T("数据管理", "Data controls")} accent="#f43f5e">
          <p className="text-sm text-slate-300">{T("清除你的成长闭环数据(诊断/处方/协议/资产/资本/Deep Work/身份树等),用于清理样例或重新开始。其余账户数据不受影响,且操作前请先导出。", "Wipe your growth-loop data (diagnoses, prescriptions, protocol runs, assets, capital, Deep Work, identity tree, …) to clear samples or start fresh. The rest of your account is untouched — export first if needed.")}</p>
          <label className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" checked={confirmReset} onChange={(e) => setConfirmReset(e.target.checked)} className="accent-rose-500" />
            {T("我已了解,确认清除", "I understand — confirm wipe")}
          </label>
          <button onClick={() => confirmReset && reset.mutate({ confirm: true })} disabled={!confirmReset || reset.isPending}
            className="mt-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-50">
            {reset.isPending ? T("清除中…", "Wiping…") : T("清除成长数据", "Wipe growth data")}
          </button>
          {reset.data && <p className="mt-2 text-sm text-emerald-300">{T("已清除", "Deleted")} {reset.data.deleted} {T("条事件。", "events.")}</p>}
          {reset.error && <p className="mt-2 text-sm text-rose-400" role="alert">{reset.error.message}</p>}
        </Card>
      </div>
    </div>
  );
}
