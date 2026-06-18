import Link from "next/link";
import { HEALING_PHASES } from "@/lib/healing/journey";

// Server-compatible hub: the full 12-stage loop in four phases, every stage a
// link. Makes the "logic closed loop" visible and navigable end-to-end.
export default function HealingJourney({ en }: { en: boolean }) {
  return (
    <div className="space-y-6">
      {HEALING_PHASES.map((phase, pi) => (
        <section key={phase.id}>
          <h2 className="mb-2 text-sm font-semibold text-slate-300">{en ? phase.en : phase.zh}</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {phase.stages.map((s, si) => (
              <Link
                key={s.key}
                href={s.path}
                className="group rounded-xl border border-slate-800 bg-slate-900/50 p-3 transition hover:border-indigo-600/60 hover:bg-slate-800/40">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] tabular-nums text-slate-300">{pi * 3 + si + 1}</span>
                  {en ? s.en : s.zh}
                  <span className="ml-auto text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-indigo-400">→</span>
                </div>
                <p className="mt-1 pl-7 text-xs text-slate-400">{en ? s.descEn : s.descZh}</p>
              </Link>
            ))}
          </div>
          {pi < HEALING_PHASES.length - 1 && <div className="mx-auto mt-3 h-4 w-px bg-slate-700/60" aria-hidden />}
        </section>
      ))}
    </div>
  );
}
