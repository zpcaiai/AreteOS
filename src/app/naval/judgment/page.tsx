import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";

export const metadata = { title: "Judgment" };
export const dynamic = "force-dynamic";

const config = ENGINES["judgment"];

export default function Page() {
  return (
    <div>
      <PageHeader title={config.title} subtitle={config.subtitle} />
      <EngineStudio config={config} />
    </div>
  );
}
