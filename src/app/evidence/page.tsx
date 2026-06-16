"use client";

import { useState } from "react";
import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";

interface DomainGap { domain: string; stated: number; enacted: number; gap: number; integrity: number; samples: number }
interface Interp { summary: string; biggestGap: string; suggestedExperiment: string }
interface EvidenceResult { signals: number; integrity: number; gaps: DomainGap[]; interpretation: Interp | null }

const KINDS = ["habits", "reflection", "decisions", "mentalModels", "mastery", "identity", "values", "mission", "firstPrinciples"];
const URL = "/api/evidence?interpret=1";
const pct = (x: number) => Math.round(x * 100);

export default function EvidencePage() {
  const { t } = useI18n();
  const gaps = useApi<{ evidence: EvidenceResult }>(URL);
  const [source, setSource] = useState("manual");
  const [kind, setKind] = useState("reflection");
  const [value, setValue] = useState(0.6);
  const add = useApiMutation<{ signals: { source: string; kind: string; value: number }[] }>("/api/evidence", { invalidate: [URL] });

  const [importSource, setImportSource] = useState<"git" | "ics">("git");
  const [raw, setRaw] = useState("");
  const imp = useApiMutation<{ source: string; raw: string }, { ingested: number }>("/api/evidence/import", { invalidate: [URL] });

  const e = gaps.data?.evidence;

  return (
    <div>
      <PageHeader title={t("innov.evidence.title")} subtitle={t("innov.evidence.subtitle")} />

      <Card title={t("innov.evidence.recordCard")}>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder={t("innov.evidence.sourcePlaceholder")} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" />
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200">
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <input type="range" min={0} max={100} value={Math.round(value * 100)} onChange={(e) => setValue(Number(e.target.value) / 100)} className="accent-indigo-500" />
          <span className="tabular-nums text-slate-300">{Math.round(value * 100)}%</span>
          <button onClick={() => add.mutate({ signals: [{ source, kind, value }] })} disabled={add.isPending}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500 disabled:opacity-50">{t("innov.evidence.add")}</button>
        </div>
        {add.error && !isUpgradeError(add.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{add.error.message}</p>}
      </Card>

      <div className="mt-4">
        <Card title={t("innov.evidence.importCard")}>
          <p className="text-sm text-slate-400">{t("innov.evidence.importDesc")}</p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <select value={importSource} onChange={(e) => setImportSource(e.target.value as "git" | "ics")} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200">
              <option value="git">git log</option>
              <option value="ics">.ics</option>
            </select>
            <button onClick={() => raw.trim() && imp.mutate({ source: importSource, raw })} disabled={imp.isPending || !raw.trim()}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500 disabled:opacity-50">{imp.isPending ? t("innov.evidence.importing") : t("innov.evidence.importBtn")}</button>
            {imp.data && <span className="text-xs text-emerald-400">+{imp.data.ingested}</span>}
          </div>
          <textarea value={raw} onChange={(e) => setRaw(e.target.value)} placeholder={t("innov.evidence.importPlaceholder")} rows={4}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 font-mono text-xs text-slate-200" />
          {imp.error && !isUpgradeError(imp.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{imp.error.message}</p>}
        </Card>
      </div>

      <div className="mt-4">
        {gaps.error && isUpgradeError(gaps.error) ? (
          <UpgradeNotice feature={t("innov.evidence.title")} tier="Plus" />
        ) : gaps.isLoading ? (
          <Card title={t("innov.evidence.gapReport")}><p className="text-sm text-slate-500">{t("innov.loading")}</p></Card>
        ) : e ? (
          <div className="space-y-4">
            <Card title={t("innov.evidence.overall")}>
              <div className="text-3xl font-bold tabular-nums">{pct(e.integrity)}%</div>
              <p className="mt-1 text-xs text-slate-500">{t("innov.evidence.basedOn").replace("{n}", String(e.signals))}</p>
            </Card>
            <Card title={t("innov.evidence.domains")}>
              {e.gaps.filter((g) => g.samples > 0 || g.stated > 0).map((g) => (
                <div key={g.domain} className="border-t border-slate-800 py-2 first:border-t-0">
                  <div className="flex justify-between text-xs text-slate-400"><span>{g.domain}</span><span className="tabular-nums">{t("innov.evidence.gap")} {g.gap >= 0 ? "+" : ""}{pct(g.gap)} · n={g.samples}</span></div>
                  <div className="mt-1"><ScoreBar label={t("innov.evidence.stated")} value={g.stated} /></div>
                  <ScoreBar label={t("innov.evidence.behavior")} value={g.enacted} />
                </div>
              ))}
            </Card>
            {e.interpretation && (
              <Card title={t("innov.evidence.interpret")} accent="#f59e0b">
                <p className="text-sm text-slate-200">{e.interpretation.summary}</p>
                <p className="mt-2 text-sm text-amber-300/90"><span className="text-slate-500">{t("innov.evidence.biggestGap")}:</span> {e.interpretation.biggestGap}</p>
                <p className="mt-1 text-sm text-emerald-300"><span className="text-slate-500">{t("innov.evidence.suggestExp")}:</span> {e.interpretation.suggestedExperiment}</p>
              </Card>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
