import { titleMeta } from "@/lib/i18n/metadata";
import { PageHeader } from "@/components/ui";
import CoachChat from "@/components/coach/CoachChat";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("AI 教练", "AI Coach");
export const dynamic = "force-dynamic";

export default async function CoachPage() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.coach.title")} subtitle={t("page.coach.subtitle")} />
      <CoachChat />
    </div>
  );
}
