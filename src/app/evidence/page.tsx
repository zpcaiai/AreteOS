import EvidenceClient from "./EvidenceClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("证据 · 言行差距", "Evidence · the gap");

export default function Page() {
  return <EvidenceClient />;
}
