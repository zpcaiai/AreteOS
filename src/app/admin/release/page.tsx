import { Card, PageHeader } from "@/components/ui";
import { releaseReadiness } from "@/lib/release/readiness";

export const dynamic = "force-dynamic";

export default function ReleaseReadinessPage() {
  const report = releaseReadiness();
  return (
    <div>
      <PageHeader title="生产发布门禁" subtitle={`Release profile: ${report.profile}`} />
      <Card title={report.ready ? "PASS · 可以按当前档位发布" : "FAIL · 禁止按当前档位发布"}>
        <div className="space-y-3">
          {report.checks.map((check) => (
            <div key={check.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={check.status === "pass" ? "text-emerald-400" : check.status === "disabled" ? "text-slate-500" : "text-rose-400"}>
                  {check.status === "pass" ? "PASS" : check.status === "disabled" ? "OFF" : "FAIL"}
                </span>
                <span className="font-medium text-slate-200">{check.id}</span>
                <span className="text-xs text-slate-500">{check.category}</span>
              </div>
              <p className="mt-1 text-sm text-slate-300">{check.message}</p>
              {check.remediation ? <p className="mt-1 text-xs text-amber-300">{check.remediation}</p> : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
