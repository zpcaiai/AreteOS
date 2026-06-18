import { titleMeta } from "@/lib/i18n/metadata";
import CounterpartBanner from "@/components/healing/CounterpartBanner";
import CBTClient from "@/components/healing/CBTClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("CBT 认知行为", "CBT Behavioral Change");

export default function CBTPage() {
  return (
    <div>
      <CounterpartBanner href="/psychology" tone="growth" zh="想做长期成长/优化,而非危机处理?→ 成长版「心理工作室」" en="Long-term growth rather than crisis support? → Growth Psychology" />
      <CBTClient />
      <Disclaimer />
    </div>
  );
}
