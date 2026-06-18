import { titleMeta } from "@/lib/i18n/metadata";
import StabilizationClient from "@/components/healing/StabilizationClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("稳定化", "Stabilization");

export default function StabilizationPage() {
  return (
    <div>
      <StabilizationClient />
      <Disclaimer />
    </div>
  );
}
