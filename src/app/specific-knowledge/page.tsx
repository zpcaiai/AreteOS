import SpecificKnowledgeClient from "./SpecificKnowledgeClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("独特知识 · 深度版", "Specific Knowledge · Flagship");

export default function Page() {
  return <SpecificKnowledgeClient />;
}
