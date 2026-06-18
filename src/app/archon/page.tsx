import { titleMeta } from "@/lib/i18n/metadata";
import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeLeadership } from "@/lib/archon/service";
import { LEVELS } from "@/lib/archon/levels";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import LeadershipStudio from "./LeadershipStudio";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("领导力杠杆引擎", "Leadership Leverage Engine");

export const dynamic = "force-dynamic";

export default async function LeadershipPage() {
  const { t, locale } = await getDict();
  const en = locale === "en";
  const userId = await getUserId();
  const [health, leverage, vision] = await Promise.all([
    computeLeadership(userId),
    prisma.leadershipLeverageMap.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.visionStatement.findFirst({ where: { userId, active: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const dist = leverage
    ? { ENVIRONMENT: leverage.environment, BEHAVIOR: leverage.behavior, CAPABILITY: leverage.capability, BELIEF: leverage.belief, IDENTITY: leverage.identity, MISSION: leverage.mission }
    : null;

  return (
    <div>
      <PageHeader title={t("page.archon.title")} subtitle={t("page.archon.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("card.global_leadership_score")}>
          <div className="text-4xl font-bold tabular-nums">{Math.round(health.globalLeadershipScore * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">(Mission × Identity × Vision × Belonging × Readiness) ÷ Blind spots</p>
        </Card>
        <Card title={t("card.leverage")}>
          <ScoreBar label={t("score.leverage_score")} value={health.leverageScore} />
          <ScoreBar label={t("score.vision_alignment")} value={health.visionAlignment} />
          <ScoreBar label={t("score.belonging")} value={health.belongingScore} />
        </Card>
        <Card title={t("card.maturity_alignment")}>
          <ScoreBar label={t("score.leadership_maturity")} value={health.maturity} />
          <ScoreBar label={t("score.org_alignment")} value={health.alignmentScore} />
          <Link href="/archon/dashboard" className="mt-3 inline-block rounded-lg bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700">Full dashboard →</Link>
        </Card>
      </div>

      <Card title={t("card.logical_level_leadership_model")}>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr><th className="py-1 pr-3">{en ? "Lvl" : "级"}</th><th className="px-3">{en ? "Level" : "层级"}</th><th className="px-3">{en ? "Question" : "问题"}</th><th className="px-3">{en ? "Role" : "角色"}</th><th className="px-3">{en ? "Leverage" : "杠杆"}</th><th className="px-3">{en ? "Your focus" : "你的重点"}</th></tr>
            </thead>
            <tbody>
              {LEVELS.map((l) => (
                <tr key={l.level} className="border-t border-slate-800">
                  <td className="py-2 pr-3 tabular-nums text-slate-500">{l.n}</td>
                  <td className="px-3 font-medium text-slate-200">{l.level}</td>
                  <td className="px-3 text-xs text-slate-400">{l.question}</td>
                  <td className="px-3 text-indigo-300">{l.role}</td>
                  <td className="px-3 text-xs text-slate-400">{l.leverage}</td>
                  <td className="px-3">{dist ? <span className="tabular-nums">{Math.round((dist as Record<string, number>)[l.level] * 100)}</span> : <span className="text-slate-500">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leverage && leverage.blindSpots.length > 0 && (
          <p className="mt-3 text-sm text-amber-400">Blind spots: {leverage.blindSpots.join(", ")}</p>
        )}
      </Card>

      <Card title={t("card.shared_vision")}>
        {vision ? (
          <div className="text-sm text-slate-300">
            <p className="font-semibold text-white">{vision.statement}</p>
            <p className="mt-1 text-xs text-slate-500">Communicate: {vision.communication}</p>
          </div>
        ) : <Empty>{t("empty.no_vision_yet_create_one_in")}</Empty>}
      </Card>

      <div className="mt-6"><LeadershipStudio /></div>
    </div>
  );
}
