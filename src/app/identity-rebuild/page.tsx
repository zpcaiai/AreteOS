import { titleMeta } from "@/lib/i18n/metadata";
import IdentityClient from "@/components/healing/IdentityClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("身份重建", "Identity Reconstruction");

export default function IdentityRebuildPage() {
  return (
    <div>
      <IdentityClient />
      <Disclaimer />
    </div>
  );
}
