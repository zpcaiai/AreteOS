"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";
import type { InterventionStep } from "@/lib/domain/dilts";

const SKILL_LABEL: Record<string, { zh: string; en: string }> = {
  "emotion-regulation": { zh: "情绪调节", en: "Emotion regulation" },
  exposure: { zh: "暴露训练", en: "Exposure" },
  "core-belief": { zh: "核心信念重构", en: "Core belief" },
  "parts-work": { zh: "内在部分工作", en: "Parts work" },
  "identity-reconstruction": { zh: "身份重建", en: "Identity rebuild" },
  cbt: { zh: "CBT 认知行为", en: "CBT" },
  "behavioral-activation": { zh: "行为激活", en: "Behavioral activation" },
  stabilization: { zh: "稳定化", en: "Stabilization" },
};

/** Ordered, recommended next-skill path from the formulation. */
export default function InterventionPathCard({ path }: { path: InterventionStep[] }) {
  const T = useT();
  if (!path?.length) return null;
  return (
    <Card title={T("推荐干预路径", "Recommended intervention path")} accent="#818cf8">
      <ol className="space-y-2">
        {path.map((step) => {
          const label = SKILL_LABEL[step.skill] ?? { zh: step.skill, en: step.skill };
          return (
            <li key={step.order} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600/80 text-xs font-bold tabular-nums text-white">{step.order}</span>
              <div>
                <div className="text-sm font-medium text-slate-100">{T(label.zh, label.en)}</div>
                <div className="text-xs text-slate-400">{step.reason}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
