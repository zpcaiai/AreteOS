import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";

export const metadata = { title: "Life Portfolio" };
export const dynamic = "force-dynamic";

const config = ENGINES["life-portfolio"];

export default function Page() {
  return (
    <div>
      <PageHeader title={config.title} subtitle={config.subtitle} />
      <EngineStudio config={config} />
    </div>
  );
}
