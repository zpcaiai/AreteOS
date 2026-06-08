import { getUserId } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { AssessmentTool } from "../IdentityClient";

export const metadata = { title: "Identity Assessment" };

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  await getUserId();
  return (
    <div>
      <PageHeader title="Identity Assessment" subtitle="Measure clarity, alignment, stability, conflict, evolution and integration." />
      <AssessmentTool />
    </div>
  );
}
