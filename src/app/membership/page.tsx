import { getUserId } from "@/lib/auth";
import { getActiveMembership } from "@/lib/membership/service";
import { PageHeader } from "@/components/ui";
import MembershipClient from "./MembershipClient";

export const metadata = { title: "Membership" };

export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const userId = await getUserId();
  const active = await getActiveMembership(userId);
  return (
    <div>
      <PageHeader title="Membership" subtitle="Upgrade your tier — unlock deeper engines as you grow." />
      <MembershipClient
        currentTier={active.tier}
        expiresAt={active.expiresAt ? active.expiresAt.toISOString() : null}
        period={active.period ?? null}
      />
    </div>
  );
}
