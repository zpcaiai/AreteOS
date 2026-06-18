import { titleMeta } from "@/lib/i18n/metadata";
import { getLocale } from "@/lib/i18n/server";
import HealingSession from "@/components/healing/HealingSession";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta(
  "疗愈会谈",
  "Healing Session",
  "安全筛查 → Dilts 六层人格地图 → 5P 个案概念化 → 干预路径",
  "Safety triage → Dilts six-level map → 5P formulation → intervention path",
);

export default async function HealingPage() {
  const isEn = (await getLocale()) === "en";
  return (
    <div>
      <p className="mb-4 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-400">
        {isEn
          ? "This is a self-help tool, not therapy or a diagnosis, and it doesn't replace a therapist, doctor, or emergency services. If you're in danger, contact your local emergency number."
          : "这是一个自助工具，不是心理治疗或诊断，也不能替代治疗师、医生或急救服务。如果你正处于危险中，请联系当地急救电话。"}
      </p>
      <HealingSession />
      <Disclaimer />
    </div>
  );
}
