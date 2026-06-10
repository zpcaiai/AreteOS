import { getUserId } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { AssessmentTool } from "../IdentityClient";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Identity Assessment" };

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const { t } = await getDict();
  await getUserId();
  return (
    <div>
      <PageHeader title={t("page.ethos.assessment.title")} subtitle={t("page.ethos.assessment.subtitle")} />
      <AssessmentTool />
    </div>
  );
}
