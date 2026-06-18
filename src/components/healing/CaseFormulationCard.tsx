"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";
import type { FiveP } from "@/lib/domain/dilts";

const ROWS: { key: keyof FiveP; zh: string; en: string; accent: string }[] = [
  { key: "presentingProblems", zh: "当前问题", en: "Presenting", accent: "#f472b6" },
  { key: "predisposingFactors", zh: "易感因素", en: "Predisposing", accent: "#fbbf24" },
  { key: "precipitatingFactors", zh: "诱发因素", en: "Precipitating", accent: "#fb923c" },
  { key: "perpetuatingFactors", zh: "维持因素", en: "Perpetuating", accent: "#fb7185" },
  { key: "protectiveFactors", zh: "保护因素", en: "Protective", accent: "#34d399" },
];

/** 5P case formulation. Protective factors are emphasized (always present). */
export default function CaseFormulationCard({ fiveP }: { fiveP: FiveP }) {
  const T = useT();
  return (
    <Card title={T("5P 个案概念化", "5P case formulation")}>
      <div className="space-y-3">
        {ROWS.map((r) => {
          const items = fiveP[r.key] ?? [];
          return (
            <div key={r.key}>
              <div className="mb-1 text-xs font-semibold" style={{ color: r.accent }}>{T(r.zh, r.en)}</div>
              {items.length ? (
                <ul className="space-y-0.5 text-sm text-slate-300">
                  {items.map((it, i) => <li key={i}>· {it}</li>)}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">{T("（暂无）", "(none)")}</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
