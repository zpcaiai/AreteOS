import { notFound } from "next/navigation";
import SkillEngineRunner from "@/components/SkillEngineRunner";
import { SKILL_BY_SLUG, SKILLS } from "@/lib/skills-catalog";

export function generateStaticParams() {
  return SKILLS.map((e) => ({ engine: e.slug }));
}

export default async function SkillPage({ params }: { params: Promise<{ engine: string }> }) {
  const { engine } = await params;
  const e = SKILL_BY_SLUG[engine];
  if (!e) notFound();
  return <SkillEngineRunner engine={e} />;
}
