import GraphClient from "./GraphClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("知识图谱 · 路径与涌现关联", "Knowledge Graph · paths & emergent links");

export default function Page() {
  return <GraphClient />;
}
