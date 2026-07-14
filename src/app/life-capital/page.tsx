import LifeCapitalClient from "./LifeCapitalClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("人生资本总账", "Life Capital Ledger");

export default function Page() {
  return <LifeCapitalClient />;
}
