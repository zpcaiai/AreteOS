import AssetsClient from "./AssetsClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("资产成长", "Asset-Based Growth");

export default function Page() {
  return <AssetsClient />;
}
