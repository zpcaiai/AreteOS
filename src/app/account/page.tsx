import AccountClient from "./AccountClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("账户 · 透明与数据权利", "Account · transparency & data rights");

export default function Page() {
  return <AccountClient />;
}
