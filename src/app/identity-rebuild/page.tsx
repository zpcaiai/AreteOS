import { titleMeta } from "@/lib/i18n/metadata";
import CounterpartBanner from "@/components/healing/CounterpartBanner";
import IdentityClient from "@/components/healing/IdentityClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("身份重建", "Identity Reconstruction");

export default function IdentityRebuildPage() {
  return (
    <div>
      <CounterpartBanner href="/identity" tone="growth" zh="想做长期身份成长,而非危机处理?→ 成长版「身份」" en="Long-term identity growth rather than crisis support? → Growth Identity" />
      <IdentityClient />
      <Disclaimer />
    </div>
  );
}
