import OutcomesClient from "./OutcomesClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("人生成果 · 基线与自评", "Life Outcomes · baseline & self-report");

export default function Page() {
  return <OutcomesClient />;
}
