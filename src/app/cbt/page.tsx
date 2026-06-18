import { titleMeta } from "@/lib/i18n/metadata";
import CBTClient from "@/components/healing/CBTClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("CBT 认知行为", "CBT Behavioral Change");

export default function CBTPage() {
  return (
    <div>
      <CBTClient />
      <Disclaimer />
    </div>
  );
}
