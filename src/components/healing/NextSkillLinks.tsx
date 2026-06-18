"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";
import { stageForSkill } from "@/lib/healing/journey";

/** Render recommended next-skill keys as clickable chips that navigate the loop.
 *  Unknown / non-navigable keys are silently dropped. */
export default function NextSkillLinks({ skills, title }: { skills?: string[]; title?: string }) {
  const { locale } = useI18n();
  const en = locale === "en";
  const stages = [...new Set(skills ?? [])].map(stageForSkill).filter((s): s is NonNullable<typeof s> => !!s);
  if (stages.length === 0) return null;
  return (
    <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 px-4 py-3">
      <div className="mb-2 text-xs font-semibold text-indigo-300">{title ?? (en ? "Continue the journey" : "继续这段旅程")}</div>
      <div className="flex flex-wrap gap-2">
        {stages.map((s) => (
          <Link
            key={s.key + s.path}
            href={s.path}
            className="group inline-flex items-center gap-1 rounded-lg border border-indigo-700/60 bg-indigo-900/30 px-3 py-1.5 text-sm text-indigo-100 transition hover:border-indigo-500 hover:bg-indigo-800/40">
            {en ? s.en : s.zh}
            <span className="text-indigo-400 transition group-hover:translate-x-0.5">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
