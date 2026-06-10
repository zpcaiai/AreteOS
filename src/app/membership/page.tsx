import { getUserId } from "@/lib/auth";
import { getActiveMembership } from "@/lib/membership/service";
import { PageHeader } from "@/components/ui";
import MembershipClient from "./MembershipClient";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Membership" };

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
