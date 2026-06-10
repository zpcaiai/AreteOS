import { getOptionalUserId } from "@/lib/auth";
import { PageHeader, Card } from "@/components/ui";
import { GrantForm } from "../AdminClient";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "会员发放" };

export const dynamic = "force-dynamic";

export default async function AdminMemberships() {
  const { t } = await getDict();
  await getOptionalUserId();
  return (
    <div>
      <PageHeader title={t("page.admin.memberships.title")} subtitle={t("page.admin.memberships.subtitle")} />
      <Card title="发放会员"><GrantForm /></Card>
    </div>
  );
}
