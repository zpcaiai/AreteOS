import SynthesisClient from "./SynthesisClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("跨引擎综合", "Cross-Engine Synthesis");

export default function Page() {
  return <SynthesisClient />;
}
