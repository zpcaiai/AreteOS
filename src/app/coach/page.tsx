import { titleMeta } from "@/lib/i18n/metadata";
import { PageHeader } from "@/components/ui";
import CoachChat from "@/components/coach/CoachChat";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("AI 教练", "AI Coach", "AI 教练:围绕决策、习惯、复盘与 Naval 规划的多轮对话式辅导。", "AI Coach: multi-turn conversational coaching for decisions, habits, reflection and Naval planning.");
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
