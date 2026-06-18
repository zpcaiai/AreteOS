"use client";

import { Card } from "@/components/ui";
import { useT, useI18n } from "@/lib/i18n/client";
import { crisisResourcesFor, UNIVERSAL_CRISIS_GUIDANCE } from "@/lib/healing/crisis-resources";
import type { SafetyPlan } from "@/lib/domain/risk";

/** Vetted crisis resources + the safety plan. Shown for orange/red. Copy is
 *  deterministic (never model-generated) and makes no confidentiality promises. */
export default function CrisisSupportCard({ plan, locale }: { plan?: SafetyPlan; locale?: string }) {
  const T = useT();
  const { locale: uiLocale } = useI18n();
  const loc = locale ?? (uiLocale === "en" ? "en-US" : "zh-CN");
  const resources = crisisResourcesFor(loc);
  const guidance = uiLocale === "en" ? UNIVERSAL_CRISIS_GUIDANCE.en : UNIVERSAL_CRISIS_GUIDANCE.zh;

  return (
    <Card title={T("现在可以做什么", "What you can do right now")} accent="#fb7185">
      <p className="text-sm leading-relaxed text-rose-100/90">{guidance}</p>

      <div className="mt-3 space-y-1.5">
        {resources.map((r) => (
          <div key={`${r.name}-${r.contact}`} className="flex flex-wrap items-baseline justify-between gap-x-3 rounded-lg border border-rose-900/40 bg-rose-950/30 px-3 py-2">
            <span className="text-sm text-slate-100">{r.name}</span>
            <span className="font-mono text-sm font-semibold text-rose-200">{r.contact}{r.hours ? <span className="ml-1 font-sans text-xs font-normal text-slate-400">({r.hours})</span> : null}</span>
          </div>
        ))}
      </div>

      {plan?.immediateSteps?.length ? (
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-400">{T("立刻可做的几步", "A few steps you can take now")}</div>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-200">
            {plan.immediateSteps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      ) : null}

      {plan?.professionalHelpRecommendation ? (
        <p className="mt-3 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-300">
          {plan.professionalHelpRecommendation}
        </p>
      ) : null}
    </Card>
  );
}
