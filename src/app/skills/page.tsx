"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { useI18n, useT } from "@/lib/i18n/client";
import { SKILLS, type Bi } from "@/lib/skills-catalog";

export default function SkillsIndexPage() {
  const { locale } = useI18n();
  const T = useT();
  const L = (b: Bi) => (locale === "en" ? b.en : b.zh);
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const items = SKILLS.filter((e) => !needle || `${L(e.title)} ${L(e.subtitle)} ${e.slug}`.toLowerCase().includes(needle));

  return (
    <div>
      <PageHeader title={T("技能库", "Skills Library")} subtitle={T("20 个能力引擎,一处检索与进入。", "20 capability engines — search and open in one place.")} />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={T("搜索引擎…", "Search engines…")}
        className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((e) => (
          <a key={e.slug} href={`/skills/${e.slug}`} className="block rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-600">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-100">{L(e.title)}</div>
              <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{e.tier === 2 ? "Pro" : "Plus"}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{L(e.subtitle)}</p>
          </a>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">{T("无匹配。", "No matches.")}</p>}
      </div>
    </div>
  );
}
