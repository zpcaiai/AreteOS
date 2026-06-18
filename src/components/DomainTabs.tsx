"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/client";

export type DomainTab = { href: string; zh: string; en: string };

/** Studio sub-navigation: turns a domain's sibling pages into tabs.
 *  Rendered by each domain's segment layout, above the page content. */
export default function DomainTabs({ tabs }: { tabs: DomainTab[] }) {
  const path = usePathname();
  const T = useT();
  return (
    <nav aria-label="Section" className="mb-5 flex flex-wrap gap-x-1 gap-y-0 border-b border-slate-800">
      {tabs.map((t, i) => {
        const active = i === 0 ? path === t.href : path === t.href || path.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              active ? "border-indigo-500 text-white" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}>
            {T(t.zh, t.en)}
          </Link>
        );
      })}
    </nav>
  );
}
