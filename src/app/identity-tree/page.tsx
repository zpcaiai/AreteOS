import IdentityTreeClient from "./IdentityTreeClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("身份进化树", "Identity Evolution Tree");

export default function Page() {
  return <IdentityTreeClient />;
}
