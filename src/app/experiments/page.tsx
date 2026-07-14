import ExperimentsClient from "./ExperimentsClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("N-of-1 实验", "N-of-1 Experiments");

export default function Page() {
  return <ExperimentsClient />;
}
