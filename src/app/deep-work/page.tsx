import DeepWorkClient from "./DeepWorkClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("深度工作 · 深度版", "Deep Work · Flagship");

export default function Page() {
  return <DeepWorkClient />;
}
