"use client";

import { useState, type ReactNode } from "react";
import { useT } from "@/lib/i18n/client";
import type { DiltsMap, DiltsLevel } from "@/lib/domain/dilts";

// Top → bottom, the way Dilts is usually drawn (Mission highest).
const ORDER: DiltsLevel[] = ["mission", "identity", "beliefAndValues", "capability", "behavior", "environment"];
const META: Record<DiltsLevel, { zh: string; en: string; color: string }> = {
  mission: { zh: "使命", en: "Mission", color: "#a78bfa" },
  identity: { zh: "身份", en: "Identity", color: "#f472b6" },
  beliefAndValues: { zh: "信念 / 价值", en: "Beliefs / Values", color: "#fb7185" },
  capability: { zh: "能力", en: "Capability", color: "#fbbf24" },
  behavior: { zh: "行为", en: "Behavior", color: "#34d399" },
  environment: { zh: "环境", en: "Environment", color: "#38bdf8" },
};

function Detail({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <p className="text-xs text-slate-400">
      <span className="text-slate-500">{label}:</span> <span className="text-slate-300">{children}</span>
    </p>
  );
}

export default function DiltsMapCanvas({ map }: { map: DiltsMap }) {
  const T = useT();
  const [open, setOpen] = useState<DiltsLevel | null>("identity");

  return (
    <div className="space-y-2" aria-label={T("Dilts 六层人格地图", "Dilts six-level map")}>
      {ORDER.map((lvl) => {
        const m = META[lvl];
        const items = map[lvl] ?? [];
        const isOpen = open === lvl;
        return (
          <div key={lvl} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
            <button
              onClick={() => setOpen(isOpen ? null : lvl)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left transition hover:bg-slate-800/40"
              aria-expanded={isOpen}>
              <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: m.color }}>
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} aria-hidden />
                {T(m.zh, m.en)}
              </span>
              <span className="text-xs text-slate-500">{items.length} · {isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div className="space-y-2 border-t border-slate-800 px-4 py-3">
                {items.length === 0 && <p className="text-xs text-slate-500">{T("（暂无）", "(none)")}</p>}
                {items.map((it: Record<string, string>, i: number) => (
                  <div key={i} className="rounded-lg bg-slate-950/40 px-3 py-2">
                    <p className="text-sm text-slate-100">{it.item ?? it.belief ?? it.narrative ?? it.blockedCalling}</p>
                    <div className="mt-1 space-y-0.5">
                      <Detail label={T("证据", "Evidence")}>{it.evidence}</Detail>
                      <Detail label={T("短期作用", "Short-term")}>{it.shortTermFunction}</Detail>
                      <Detail label={T("长期代价", "Long-term cost")}>{it.longTermCost ?? it.cost}</Detail>
                      <Detail label={T("可训练技能", "Trainable skill")}>{it.trainableSkill}</Detail>
                      <Detail label={T("类型", "Type")}>{it.type}</Detail>
                      <Detail label={T("影响", "Impact")}>{it.impact}</Detail>
                      <Detail label={T("新身份种子", "New identity seed")}>{it.alternativeIdentitySeed}</Detail>
                      <Detail label={T("成长方向", "Growth direction")}>{it.growthDirection}</Detail>
                      <Detail label={T("恐惧", "Fear")}>{it.fear}</Detail>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
