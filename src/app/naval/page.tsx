import { titleMeta } from "@/lib/i18n/metadata";
import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { computeNavalDashboard } from "@/lib/naval/service";
import { Card, PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES, ENGINE_ORDER } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("Naval 人生 OS", "Naval Life OS", "Naval 人生 OS:围绕专属知识、杠杆、判断力、财富与自由的长期复利系统。", "Naval Life OS: a long-term compounding system for specific knowledge, leverage, judgment, wealth and freedom.");
export const dynamic = "force-dynamic";

export default async function NavalHome() {
  const { t, locale } = await getDict();
  const en = locale === "en";
  const userId = await getUserId();
  const d = await computeNavalDashboard(userId);

  return (
    <div>
      <PageHeader title={t("page.naval.title")} subtitle={t("page.naval.subtitle")} />

      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/naval/onboarding" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium">Get set up →</Link>
        <Link href="/naval/plan" className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700">90-day plan</Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("card.global_naval_score")}>
          <div className="text-5xl font-bold tabular-nums">{Math.round(d.scores.global)}</div>
          <p className="mt-2 text-xs text-slate-400">Geometric mean of seven life drivers — a near-zero area pulls the whole score down.</p>
          <Link href="/naval/dashboard" className="mt-3 inline-block rounded-lg bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700">Open dashboard →</Link>
        </Card>
        <Card title={t("card.recommended_next_action")}>
          <p className="text-sm text-slate-300">{d.recommendedNextAction}</p>
        </Card>
        <Card title={t("card.the_loop")}>
          <p className="text-sm text-slate-400">Specific knowledge → judgment → leverage → assets → wealth → freedom → happiness → better judgment.</p>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-300">Engines</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ENGINE_ORDER.map((slug) => {
            const e = ENGINES[slug];
            return (
              <Link key={slug} href={`/naval/${slug}`} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-indigo-600">
                <div className="text-sm font-medium text-slate-100">{e.title}</div>
                <div className="mt-1 text-[11px] leading-snug text-slate-500">{e.subtitle}</div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-1 text-sm font-semibold text-slate-300">Start here — Specific Knowledge</h2>
        <p className="mb-3 text-xs text-slate-500">{en ? "Answer the prompts to seed your Naval Life OS, then explore the other engines." : "回答这些提示来初始化你的 Naval 人生 OS,然后探索其他引擎。"}</p>
        <EngineStudio config={ENGINES["specific-knowledge"]} />
      </div>
    </div>
  );
}
