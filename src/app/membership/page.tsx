import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { getActiveMembership } from "@/lib/membership/service";
import { PageHeader } from "@/components/ui";
import MembershipClient from "./MembershipClient";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("会员", "Membership", "Arete 会员:解锁全部 AI 教练、数字孪生、知识图谱与深度引擎。", "Arete membership: unlock all AI coaches, the digital twin, knowledge graph and deep engines.");

export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const active = await getActiveMembership(userId);
  return (
    <div>
      <PageHeader title={t("page.membership.title")} subtitle={t("page.membership.subtitle")} />
      <MembershipClient
        currentTier={active.tier}
        expiresAt={active.expiresAt ? active.expiresAt.toISOString() : null}
        period={active.period ?? null}
      />
    </div>
  );
}
