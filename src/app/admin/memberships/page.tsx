import { getOptionalUserId } from "@/lib/auth";
import { PageHeader, Card } from "@/components/ui";
import { GrantForm } from "../AdminClient";

export const metadata = { title: "会员发放" };

export const dynamic = "force-dynamic";

export default async function AdminMemberships() {
  await getOptionalUserId();
  return (
    <div>
      <PageHeader title="会员发放" subtitle="给指定用户手动开通 / 续期会员(同等级自动叠加时长)。" />
      <Card title="发放会员"><GrantForm /></Card>
    </div>
  );
}
