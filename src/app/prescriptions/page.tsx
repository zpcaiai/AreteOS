import PrescriptionsClient from "./PrescriptionsClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("成长处方", "Growth Prescription");

export default function Page() {
  return <PrescriptionsClient />;
}
