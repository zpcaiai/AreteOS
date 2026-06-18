"use client";

import { useT } from "@/lib/i18n/client";
import type { RiskLevel } from "@/lib/domain/risk";

const STYLES: Record<RiskLevel, { border: string; bg: string; dot: string; labelZh: string; labelEn: string }> = {
  green: { border: "border-emerald-800/60", bg: "bg-emerald-950/30", dot: "bg-emerald-400", labelZh: "状态平稳", labelEn: "Steady" },
  yellow: { border: "border-amber-800/60", bg: "bg-amber-950/30", dot: "bg-amber-400", labelZh: "需要支持", labelEn: "Needs support" },
  orange: { border: "border-orange-700/70", bg: "bg-orange-950/40", dot: "bg-orange-400", labelZh: "先稳定化", labelEn: "Stabilize first" },
  red: { border: "border-rose-700/80", bg: "bg-rose-950/50", dot: "bg-rose-400", labelZh: "危机支持", labelEn: "Crisis support" },
};

/** Risk-aware banner. Always shows the safe user-facing message; never exposes
 *  internal classifier details. */
export default function SafetyBanner({ level, message }: { level: RiskLevel; message: string }) {
  const T = useT();
  const s = STYLES[level];
  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-4`} role={level === "red" || level === "orange" ? "alert" : "status"}>
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
        <span className={`inline-block h-2 w-2 rounded-full ${s.dot}`} aria-hidden />
        {T(s.labelZh, s.labelEn)}
      </div>
      <p className="text-sm leading-relaxed text-slate-100">{message}</p>
    </div>
  );
}
