import ProjectFoundryClient from "@/components/ProjectFoundryClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("项目铸造厂", "Project Foundry");

export default function ProjectFoundryPage() {
  return <ProjectFoundryClient />;
}
