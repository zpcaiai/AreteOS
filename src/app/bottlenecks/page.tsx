import BottlenecksClient from "./BottlenecksClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("瓶颈诊断", "Bottleneck Diagnosis");

export default function Page() {
  return <BottlenecksClient />;
}
