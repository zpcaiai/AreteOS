import FutureSelfClient from "./FutureSelfClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("未来自我 · 蒙特卡洛", "Future Self · Monte Carlo");

export default function Page() {
  return <FutureSelfClient />;
}
