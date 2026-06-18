import { titleMeta } from "@/lib/i18n/metadata";
import { getLocale } from "@/lib/i18n/server";
import { PageHeader } from "@/components/ui";
import { crisisResourcesFor, UNIVERSAL_CRISIS_GUIDANCE } from "@/lib/healing/crisis-resources";

export const generateMetadata = titleMeta("安全与求助", "Safety & support");

// Always-available, server-rendered crisis resources + an explanation of the
// safety model. No input, no model — just standing help.
export default async function SafetyPage() {
  const isEn = (await getLocale()) === "en";
  const tt = (zh: string, en: string) => (isEn ? en : zh);
  const resources = crisisResourcesFor(isEn ? "en-US" : "zh-CN");

  return (
    <div>
      <PageHeader
        title={tt("安全与求助", "Safety & support")}
        subtitle={tt("如果此刻很艰难，这里随时可用。", "If right now is hard, this is here for you anytime.")}
      />

      <div className="rounded-2xl border border-rose-800/50 bg-rose-950/30 p-5">
        <p className="text-sm leading-relaxed text-rose-100/90">
          {isEn ? UNIVERSAL_CRISIS_GUIDANCE.en : UNIVERSAL_CRISIS_GUIDANCE.zh}
        </p>
        <div className="mt-4 space-y-1.5">
          {resources.map((r) => (
            <div key={`${r.name}-${r.contact}`} className="flex flex-wrap items-baseline justify-between gap-x-3 rounded-lg border border-rose-900/40 bg-rose-950/40 px-3 py-2">
              <span className="text-sm text-slate-100">{r.name}{r.note ? <span className="ml-2 text-xs text-slate-400">{r.note}</span> : null}</span>
              <span className="font-mono text-sm font-semibold text-rose-200">{r.contact}{r.hours ? <span className="ml-1 font-sans text-xs font-normal text-slate-400">({r.hours})</span> : null}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {tt(
            "这些号码可能随地区变化，请以你所在地的官方急救/危机服务为准。运营者可通过 HEALING_CRISIS_RESOURCES 环境变量本地化此列表。",
            "These numbers can vary by region — rely on your local official emergency/crisis services. Operators can localize this list via the HEALING_CRISIS_RESOURCES env var.",
          )}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-sm leading-relaxed text-slate-300">
        <h2 className="mb-2 text-sm font-semibold text-slate-200">{tt("这个系统如何保护你", "How this system protects you")}</h2>
        <p>{tt(
          "在做任何深入的人格分析之前，每条消息都会先经过安全筛查。当出现自伤、自杀、伤害他人、严重精神危机等信号时，系统会优先稳定化并引导你联系现实支持，而不会继续深挖。最高危的判断由确定性规则决定，不依赖 AI 的主观判断，也不会被降级。",
          "Before any deeper personality work, every message passes through safety triage. When signals of self-harm, suicide, harm to others, or acute crisis appear, the system stabilizes first and points you toward real-world support instead of digging deeper. The highest-risk decisions are made by deterministic rules — not the model's judgment — and can never be lowered.",
        )}</p>
        <p className="mt-2 text-xs text-slate-500">{tt(
          "本工具不提供诊断，不能替代心理治疗师、精神科医生或急救服务。",
          "This tool does not diagnose and cannot replace a therapist, psychiatrist, or emergency services.",
        )}</p>
      </div>
    </div>
  );
}
