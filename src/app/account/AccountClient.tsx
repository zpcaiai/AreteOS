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
  const mem = useApi<{ count: number }>("/api/account/memory");
  const [confirmMem, setConfirmMem] = useState(false);
  const clearMem = useApiMutation<{ confirm: true }, { deleted: number }>("/api/account/memory", { invalidate: ["/api/account/memory"] });
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const deleteAccount = useApiMutation<{ password: string; confirmation: "DELETE MY ACCOUNT" }, { ok: true; deletedRecords: number }>("/api/account/delete");
  const guardian = useApi<{ consent: { id: string; guardianName: string; relationship: string; version: string; acceptedAt: string } | null }>("/api/account/guardian-consent");
  const [guardianName, setGuardianName] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState<"parent" | "legal_guardian" | "authorized_caregiver">("parent");
  const guardianConsent = useApiMutation<
    { guardianName: string; relationship: "parent" | "legal_guardian" | "authorized_caregiver"; confirmAdult: true; acceptChildPrivacy: true },
    { consent: { id: string; version: string; acceptedAt: string } }
  >("/api/account/guardian-consent", { invalidate: ["/api/account/guardian-consent"] });
  const revokeGuardian = useApiMutation<Record<string, never>, { revoked: number }>("/api/account/guardian-consent", { method: "DELETE", invalidate: ["/api/account/guardian-consent"] });
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
        <Card title={T("AI 记忆", "AI memory")} accent="#a78bfa">
          <p className="text-sm text-slate-300">{T("Arete 会把你的反思、决策与洞察存为可检索的 AI 记忆（用于教练与代理的上下文）。你可以随时清除。", "Arete stores your reflections, decisions and insights as searchable AI memory (context for the coach & agents). You can forget it anytime.")}</p>
          <p className="mt-2 text-sm text-slate-400">{T("当前存储", "Currently stored")}: <span className="font-bold tabular-nums text-slate-200">{mem.data?.count ?? "…"}</span> {T("条记忆", "memories")}</p>
          <label className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" checked={confirmMem} onChange={(ev) => setConfirmMem(ev.target.checked)} className="accent-violet-500" />
            {T("我已了解，确认清除 AI 记忆", "I understand — forget my AI memory")}
          </label>
          <button onClick={() => confirmMem && clearMem.mutate({ confirm: true })} disabled={!confirmMem || clearMem.isPending}
            className="mt-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50">
            {clearMem.isPending ? T("清除中…", "Forgetting…") : T("清除 AI 记忆", "Forget AI memory")}
          </button>
          {clearMem.data && <p className="mt-2 text-sm text-emerald-300">{T("已清除", "Forgot")} {clearMem.data.deleted} {T("条记忆。", "memories.")}</p>}
          {clearMem.error && <p className="mt-2 text-sm text-rose-400" role="alert">{clearMem.error.message}</p>}
        </Card>
      </div>

      <div className="mt-4">
        <Card title={T("家庭功能与监护人同意", "Family features and guardian consent")} accent="#38bdf8">
          {guardian.data?.consent ? (
            <div>
              <p className="text-sm text-slate-300">{T("当前同意记录", "Active consent")}: {guardian.data.consent.guardianName} · {guardian.data.consent.relationship} · {guardian.data.consent.version}</p>
              <p className="mt-1 text-xs text-slate-500">{T("撤回后，儿童资料保留但家庭功能立即停止访问，直到重新完成同意。", "Revoking immediately blocks family-feature access until consent is completed again; existing records remain available for export/deletion.")}</p>
              <button onClick={() => revokeGuardian.mutate({})} disabled={revokeGuardian.isPending} className="mt-2 rounded-lg border border-rose-800 px-3 py-2 text-sm text-rose-300 hover:bg-rose-950/50 disabled:opacity-50">{T("撤回监护人同意", "Revoke guardian consent")}</button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-300">{T("只有年满 18 周岁的父母、法定监护人或获授权照护者可以启用家庭功能。儿童不得自行注册或管理账户。", "Only an adult parent, legal guardian, or authorized caregiver may enable family features. Children cannot register or administer accounts.")}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <input value={guardianName} onChange={(event) => setGuardianName(event.target.value)} placeholder={T("监护人真实姓名", "Guardian legal name")} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
                <select value={guardianRelationship} onChange={(event) => setGuardianRelationship(event.target.value as typeof guardianRelationship)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
                  <option value="parent">{T("父母", "Parent")}</option>
                  <option value="legal_guardian">{T("法定监护人", "Legal guardian")}</option>
                  <option value="authorized_caregiver">{T("获授权照护者", "Authorized caregiver")}</option>
                </select>
              </div>
              <button onClick={() => guardianName.trim() && guardianConsent.mutate({ guardianName, relationship: guardianRelationship, confirmAdult: true, acceptChildPrivacy: true })} disabled={!guardianName.trim() || guardianConsent.isPending} className="mt-3 rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50">{T("确认成年人身份并同意儿童隐私规则", "Confirm adult status and accept child privacy rules")}</button>
            </div>
          )}
          {(guardianConsent.error || revokeGuardian.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{(guardianConsent.error || revokeGuardian.error)?.message}</p>}
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

      <div className="mt-4">
        <Card title={T("永久删除账户", "Permanently delete account")} accent="#dc2626">
          <p className="text-sm leading-6 text-slate-300">{T("这会立即删除账户身份、工作区、AI 记忆、成长记录、订单与团队归属，且无法恢复。建议先导出数据。为防误操作，请输入密码和确认短语。", "This immediately erases your identity, workspaces, AI memory, growth records, orders, and team ownership. It cannot be undone. Export first, then enter your password and confirmation phrase.")}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input type="password" autoComplete="current-password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} placeholder={T("当前密码", "Current password")} className="rounded-lg border border-rose-900 bg-slate-950 px-3 py-2 text-sm" />
            <input value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} placeholder="DELETE MY ACCOUNT" className="rounded-lg border border-rose-900 bg-slate-950 px-3 py-2 text-sm" />
          </div>
          <button type="button" onClick={() => deleteAccount.mutate({ password: deletePassword, confirmation: "DELETE MY ACCOUNT" }, { onSuccess: () => { window.location.href = "/login"; } })} disabled={!deletePassword || deleteConfirmation !== "DELETE MY ACCOUNT" || deleteAccount.isPending} className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">
            {deleteAccount.isPending ? T("正在永久删除…", "Deleting permanently…") : T("永久删除我的账户", "Permanently delete my account")}
          </button>
          {deleteAccount.error && <p role="alert" className="mt-2 text-sm text-rose-400">{deleteAccount.error.message}</p>}
        </Card>
      </div>
    </div>
  );
}
