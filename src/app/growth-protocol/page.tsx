import GrowthProtocolClient from "./GrowthProtocolClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("成长协议", "Growth Protocol");

export default function Page() {
  return <GrowthProtocolClient />;
}
