import { titleMeta } from "@/lib/i18n/metadata";
import CoreBeliefClient from "@/components/healing/CoreBeliefClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("核心信念重构", "Core Belief Reconstruction");

export default function CoreBeliefPage() {
  return (
    <div>
      <CoreBeliefClient />
      <Disclaimer />
    </div>
  );
}
