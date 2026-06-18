import { titleMeta } from "@/lib/i18n/metadata";
import { getLocale } from "@/lib/i18n/server";
import { PageHeader } from "@/components/ui";
import HealingJourney from "@/components/healing/HealingJourney";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("疗愈 OS · 旅程地图", "Healing OS · Journey map");

export default async function HealingOSPage() {
  const isEn = (await getLocale()) === "en";
  const tt = (zh: string, en: string) => (isEn ? en : zh);
  return (
    <div>
      <PageHeader
        title={tt("疗愈 OS · 旅程地图", "Healing OS · Journey map")}
        subtitle={tt("从安全筛查到长期维护的完整闭环。任意一步都先经过安全分流。", "The full loop from safety triage to long-term upkeep. Every step is safety-gated first.")}
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <a href="/healing" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
          {tt("开始一次会谈 →", "Start a session →")}
        </a>
        <a href="/safety" className="rounded-lg border border-rose-800/60 bg-rose-950/30 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-950/50">
          {tt("我现在需要帮助", "I need help now")}
        </a>
        <a href="/healing-timeline" className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800/40">
          {tt("查看进展", "See progress")}
        </a>
      </div>

      <HealingJourney en={isEn} />

      <p className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
        {tt(
          "这是一个自助工具，不是诊断或治疗，也不能替代心理治疗师、医生或急救服务。任何深入练习前都会先做安全筛查；高危状态会被引导到现实支持。",
          "A self-help tool — not diagnosis or treatment, and not a replacement for a therapist, doctor, or emergency services. Every deeper exercise is safety-screened first; high-risk states are routed to real-world support.",
        )}
      </p>
      <Disclaimer />
    </div>
  );
}
