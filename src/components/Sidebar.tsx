"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useI18n, LanguageSwitcher } from "@/lib/i18n/client";
import type { DictKey } from "@/lib/i18n/dictionaries";

// Grouped by the product's development lifecycle. Classical sub-brand + plain function.
const GROUPS: { title: string; titleKey?: DictKey; items: { href: string; label: string; labelKey?: DictKey }[] }[] = [
  { title: "", items: [
    { href: "/dashboard", label: "Dashboard", labelKey: "nav.dashboard" },
    { href: "/coach", label: "AI Coach", labelKey: "nav.coach" },
  ]},
  { title: "Childhood", titleKey: "nav.childhood", items: [
    { href: "/genius", label: "Genius · Kids" },
  ]},
  { title: "Foundation", titleKey: "nav.foundation", items: [
    { href: "/cosmos", label: "Cosmos · Worldview" },
    { href: "/cosmos/constellation", label: "Constellation" },
  ]},
  { title: "Direction", titleKey: "nav.direction", items: [
    { href: "/telos", label: "Telos · Mission" },
    { href: "/identity", label: "Identity" },
    { href: "/ethos", label: "Ethos · Identity Library" },
    { href: "/values", label: "Values" },
    { href: "/beliefs", label: "Beliefs" },
  ]},
  { title: "Thinking", titleKey: "nav.thinking", items: [
    { href: "/phronesis", label: "Phronesis · Cognitive" },
    { href: "/psychology", label: "Psychology · CBT" },
    { href: "/decisions", label: "Decisions" },
    { href: "/role-models", label: "Role Models" },
    { href: "/genius-strategies", label: "Genius Strategies" },
    { href: "/models", label: "Genius Library" },
    { href: "/adaptation", label: "Adaptation" },
  ]},
  { title: "Execution", titleKey: "nav.execution", items: [
    { href: "/learning-path", label: "Learning Path" },
    { href: "/habits", label: "Habits" },
    { href: "/mastery", label: "Mastery" },
    { href: "/reflection", label: "Reflection" },
    { href: "/legacy", label: "Legacy" },
  ]},
  { title: "Organization", titleKey: "nav.organization", items: [
    { href: "/archon", label: "Archon · Leadership" },
    { href: "/oikos", label: "Oikos · Management" },
    { href: "/praxis", label: "Praxis · Scaling" },
  ]},
  { title: "Naval Life OS", titleKey: "nav.naval", items: [
    { href: "/naval", label: "Naval · Overview" },
    { href: "/naval/dashboard", label: "Naval Dashboard" },
    { href: "/naval/onboarding", label: "Naval · Get set up" },
    { href: "/naval/plan", label: "90-Day Plan" },
    { href: "/naval/specific-knowledge", label: "Specific Knowledge" },
    { href: "/naval/talent-stack", label: "Talent Stack" },
    { href: "/naval/leverage", label: "Leverage" },
    { href: "/naval/judgment", label: "Judgment" },
    { href: "/naval/decision-journal", label: "Decision Journal" },
    { href: "/naval/wealth", label: "Wealth Creation" },
    { href: "/naval/assets", label: "Asset Builder" },
    { href: "/naval/opportunities", label: "Opportunities" },
    { href: "/naval/long-term-games", label: "Long-Term Games" },
    { href: "/naval/freedom", label: "Freedom" },
    { href: "/naval/happiness", label: "Happiness" },
    { href: "/naval/life-portfolio", label: "Life Portfolio" },
    { href: "/naval/twin", label: "Naval Digital Twin" },
  ]},
  { title: "Analytics", titleKey: "nav.analytics", items: [
    { href: "/reviews", label: "Reviews" },
    { href: "/timeline", label: "Timeline" },
    { href: "/twin", label: "Digital Twin" },
  ]},
  { title: "Library & Social", titleKey: "nav.library", items: [
    { href: "/mnemosyne", label: "Mnemosyne · Listen" },
    { href: "/community", label: "Agora · Community" },
  ]},
  { title: "Account", titleKey: "nav.account", items: [
    { href: "/emporion", label: "Emporion · Store" },
    { href: "/membership", label: "Membership" },
    { href: "/about", label: "About Arete" },

    { href: "/admin", label: "管理后台 Admin" },
  ]},
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  if (path === "/login") return null;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/90 p-3 lg:hidden" style={{ position: "sticky", top: 0, zIndex: 30 }}>
        <button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /></svg>
        </button>
        <Logo size={24} />
        <span className="text-base font-bold tracking-wide font-serif">ARETE</span>
      </div>

      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900 p-4 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:bg-slate-900/50 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-5 flex items-center justify-between">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <Logo size={34} />
            <div>
              <div className="text-lg font-bold tracking-wide font-serif">ARETE</div>
              <div className="text-[10px] italic text-slate-500">Become who you are.</div>
            </div>
          </Link>
          <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>
        <nav aria-label="Primary" className="flex-1 space-y-3 overflow-y-auto pr-1">
          {GROUPS.map((g, gi) => {
            const open = !collapsed[g.title];
            return (
              <div key={g.title || gi}>
                {g.title && (
                  <button onClick={() => setCollapsed((c) => ({ ...c, [g.title]: !c[g.title] }))}
                    className="flex w-full items-center justify-between px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300">
                    <span>{g.titleKey ? t(g.titleKey) : g.title}</span>
                    <span className="text-slate-600">{open ? "▾" : "▸"}</span>
                  </button>
                )}
                {open && (
                  <div className="mt-0.5 space-y-0.5">
                    {g.items.map((n) => {
                      const active = path === n.href || path.startsWith(n.href + "/");
                      return (
                        <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`block rounded-lg px-3 py-1.5 text-sm ${active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
                          {n.labelKey ? t(n.labelKey) : n.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={logout} className="rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800">
            {t("common.logout")}
          </button>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </aside>
    </>
  );
}
